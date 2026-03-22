import { spawn } from "child_process";
import { createHash } from "crypto";
import { existsSync, watch } from "fs";
import { appendFile, mkdir, readFile, rm, writeFile } from "fs/promises";
import path from "path";

const projectRoot = process.cwd();
const port = Number(process.env.PORT ?? 3000);
const appUrl = `http://localhost:${port}`;
const stateDir = path.join(projectRoot, ".codex-guard");
const stateFile = path.join(stateDir, "state.json");
const stdoutLog = path.join(projectRoot, ".next-dev.log");
const stderrLog = path.join(projectRoot, ".next-dev.err.log");
const nextDir = path.join(projectRoot, ".next");
const watchRoots = ["app", "components", "lib", "data", "public", "utils"];
const restartDebounceMs = 1000;
const healthPollMs = 1500;
const staleThresholdMs = 1000;

let child = null;
let startedChildPid = null;
let lastKnownHtmlHash = "";
let pendingChange = null;
let restartTimer = null;
let healthTimer = null;
let lastRestartAt = 0;
let isRestarting = false;

await mkdir(stateDir, { recursive: true });

async function log(message) {
  const line = `[guardian ${new Date().toISOString()}] ${message}\n`;
  process.stdout.write(line);
  await appendFile(path.join(stateDir, "guardian.log"), line, "utf8");
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function runPowerShell(command) {
  return await new Promise((resolve, reject) => {
    const proc = spawn(
      "powershell.exe",
      ["-NoProfile", "-ExecutionPolicy", "Bypass", "-Command", command],
      {
        cwd: projectRoot,
        stdio: ["ignore", "pipe", "pipe"],
      },
    );

    let stdout = "";
    let stderr = "";

    proc.stdout.on("data", (chunk) => {
      stdout += chunk.toString();
    });

    proc.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
    });

    proc.on("error", reject);
    proc.on("close", (code) => {
      if (code === 0) {
        resolve(stdout.trim());
        return;
      }

      reject(new Error(stderr.trim() || `PowerShell exited with code ${code}`));
    });
  });
}

async function getHealthyResponse() {
  try {
    const response = await fetch(appUrl, {
      cache: "no-store",
      headers: {
        "cache-control": "no-cache",
        pragma: "no-cache",
      },
    });

    if (!response.ok) {
      return null;
    }

    const html = await response.text();
    return {
      html,
      hash: createHash("sha1").update(html).digest("hex"),
    };
  } catch {
    return null;
  }
}

async function getManagedNodePids() {
  const escapedRoot = projectRoot.replace(/\\/g, "\\\\").replace(/'/g, "''");
  const script = `
$items = Get-CimInstance Win32_Process -Filter "name = 'node.exe'" |
  Where-Object {
    $_.CommandLine -and
    $_.CommandLine -like '*next*dev*' -and
    $_.CommandLine -like '*${escapedRoot}*'
  } |
  Select-Object -ExpandProperty ProcessId
if ($items) { $items }
`;

  try {
    const stdout = await runPowerShell(script);
    return stdout
      .split(/\r?\n/)
      .map((value) => Number(value.trim()))
      .filter((value) => Number.isInteger(value) && value > 0);
  } catch {
    return [];
  }
}

async function stopManagedServers() {
  const pids = new Set(await getManagedNodePids());

  if (startedChildPid) {
    pids.add(startedChildPid);
  }

  if (pids.size === 0) {
    return;
  }

  for (const pid of pids) {
    try {
      process.kill(pid, "SIGTERM");
    } catch {}
  }

  await sleep(800);

  for (const pid of pids) {
    try {
      process.kill(pid, "SIGKILL");
    } catch {}
  }

  await log(`Stopped managed dev processes: ${Array.from(pids).join(", ")}`);
}

async function clearNextCache() {
  if (existsSync(nextDir)) {
    await rm(nextDir, { recursive: true, force: true });
    await log("Removed .next cache");
  }
}

async function inspectImportErrors() {
  if (!existsSync(stderrLog)) {
    return;
  }

  const content = await readFile(stderrLog, "utf8");
  const lines = content
    .split(/\r?\n/)
    .filter((line) => /module not found|can't resolve|cannot find module|import/i.test(line))
    .slice(-10);

  if (lines.length > 0) {
    await log(`Import issue detected:\n${lines.join("\n")}`);
  }
}

async function persistState(extra = {}) {
  const state = {
    port,
    appUrl,
    childPid: startedChildPid,
    lastKnownHtmlHash,
    lastRestartAt,
    updatedAt: new Date().toISOString(),
    ...extra,
  };

  await writeFile(stateFile, JSON.stringify(state, null, 2), "utf8");
}

async function spawnDevServer() {
  if (child) {
    return;
  }

  child = spawn("cmd.exe", ["/c", "npm", "run", "dev"], {
    cwd: projectRoot,
    env: { ...process.env, PORT: String(port) },
    stdio: ["ignore", "pipe", "pipe"],
  });

  startedChildPid = child.pid ?? null;
  lastRestartAt = Date.now();
  await persistState({ reason: "spawn" });
  await log(`Started npm run dev (pid ${startedChildPid ?? "unknown"})`);

  child.stdout.on("data", async (chunk) => {
    const text = chunk.toString();
    process.stdout.write(text);
    await appendFile(stdoutLog, text, "utf8");
  });

  child.stderr.on("data", async (chunk) => {
    const text = chunk.toString();
    process.stderr.write(text);
    await appendFile(stderrLog, text, "utf8");
  });

  child.on("exit", async (code, signal) => {
    const pid = startedChildPid;
    child = null;
    startedChildPid = null;
    await persistState({ reason: "exit", exitCode: code, signal, childPid: null });
    await log(`Dev server exited (pid ${pid ?? "unknown"}, code ${code}, signal ${signal ?? "none"})`);

    if (!isRestarting) {
      scheduleRestart("dev server exited unexpectedly", true);
    }
  });
}

async function ensureHealthyServer() {
  const response = await getHealthyResponse();

  if (response) {
    lastKnownHtmlHash = response.hash;
    await persistState({ reason: "healthy" });
    return true;
  }

  if (!child) {
    await log("localhost unreachable and no managed child present; starting npm run dev");
    await spawnDevServer();
  }

  return false;
}

function scheduleRestart(reason, clearCache) {
  if (restartTimer) {
    clearTimeout(restartTimer);
  }

  restartTimer = setTimeout(async () => {
    if (isRestarting) {
      return;
    }

    isRestarting = true;

    try {
      await log(`Restart scheduled: ${reason}`);
      await stopManagedServers();
      if (clearCache) {
        await clearNextCache();
      }
      await inspectImportErrors();
      await spawnDevServer();
    } finally {
      isRestarting = false;
    }
  }, restartDebounceMs);
}

function registerWatchers() {
  for (const root of watchRoots) {
    const absoluteRoot = path.join(projectRoot, root);

    if (!existsSync(absoluteRoot)) {
      continue;
    }

    watch(
      absoluteRoot,
      { recursive: true },
      async (eventType, fileName) => {
        if (!fileName) {
          return;
        }

        const relativePath = path.join(root, fileName).replace(/\\/g, "/");
        pendingChange = {
          eventType,
          relativePath,
          changedAt: Date.now(),
        };

        await persistState({ reason: "file-change", pendingChange });

        if (relativePath.endsWith("page.tsx")) {
          await log(`Detected page change: ${relativePath}`);
        }
      },
    );
  }
}

async function processPendingChange() {
  if (!pendingChange || Date.now() - pendingChange.changedAt < staleThresholdMs) {
    return;
  }

  const change = pendingChange;
  pendingChange = null;

  const response = await getHealthyResponse();

  if (!response) {
    scheduleRestart(`localhost unreachable after change in ${change.relativePath}`, true);
    return;
  }

  const pageChanged = change.relativePath.endsWith("page.tsx");
  const htmlUnchanged = lastKnownHtmlHash !== "" && response.hash === lastKnownHtmlHash;

  lastKnownHtmlHash = response.hash;
  await persistState({ reason: "post-change-check", lastChangedFile: change.relativePath });

  if (pageChanged && htmlUnchanged) {
    scheduleRestart(`page.tsx changed but homepage hash did not update for ${change.relativePath}`, true);
    return;
  }

  await log(`Change reflected successfully for ${change.relativePath}`);
}

function startHealthLoop() {
  healthTimer = setInterval(async () => {
    const healthy = await ensureHealthyServer();

    if (!healthy) {
      scheduleRestart("localhost unreachable during health check", true);
    }

    await processPendingChange();
  }, healthPollMs);
}

async function bootstrap() {
  await log(`Guardian boot on ${appUrl}`);
  registerWatchers();

  const healthy = await ensureHealthyServer();
  if (!healthy) {
    await sleep(2000);
  }

  const response = await getHealthyResponse();
  if (response) {
    lastKnownHtmlHash = response.hash;
    await persistState({ reason: "bootstrap-healthy" });
    await log("Initial localhost check passed");
  } else {
    scheduleRestart("initial localhost probe failed", true);
  }

  startHealthLoop();
}

process.on("SIGINT", async () => {
  await log("Guardian received SIGINT");
  process.exit(0);
});

process.on("SIGTERM", async () => {
  await log("Guardian received SIGTERM");
  process.exit(0);
});

process.on("uncaughtException", async (error) => {
  await log(`Uncaught exception: ${error instanceof Error ? error.stack ?? error.message : String(error)}`);
});

process.on("unhandledRejection", async (reason) => {
  await log(`Unhandled rejection: ${reason instanceof Error ? reason.stack ?? reason.message : String(reason)}`);
});

await bootstrap();
