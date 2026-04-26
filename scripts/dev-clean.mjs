import { spawn } from "child_process";
import { existsSync } from "fs";
import { rm } from "fs/promises";
import path from "path";

const projectRoot = process.cwd();
const packageJsonPath = path.join(projectRoot, "package.json");
const nextDir = path.join(projectRoot, ".next");
const cacheDir = path.join(projectRoot, "node_modules", ".cache");

if (!existsSync(packageJsonPath)) {
  throw new Error("dev:clean must be run from the snail-delivery project root.");
}

console.log("snail-delivery clean dev");
console.log("Cleaning .next...");
await rm(nextDir, { recursive: true, force: true });
console.log("Cleaning node_modules/.cache...");
await rm(cacheDir, { recursive: true, force: true });
console.log("Starting next dev...");

const child = spawn("npm", ["run", "dev"], {
  cwd: projectRoot,
  env: process.env,
  stdio: "inherit",
  shell: true,
});

child.on("error", (error) => {
  console.error(error);
  process.exit(1);
});

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }

  process.exit(code ?? 0);
});
