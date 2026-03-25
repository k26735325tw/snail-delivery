import { list, put } from "@vercel/blob";
import { unstable_noStore as noStore } from "next/cache";

import { cmsDefaults } from "@/lib/cms-defaults";
import { applyLegacyAliases, cleanStoredString, mergeMissingFields, normalizeCmsData } from "@/lib/cms-data";
import type {
  CmsData,
} from "@/lib/cms-schema";

const CMS_CONTENT_PATH = "cms/site-content.json";

type JsonRecord = Record<string, unknown>;
export type CmsSource = "blob" | "fallback";
export type CmsStatusReason =
  | "ok"
  | "forced_fallback"
  | "blob_403"
  | "blob_unavailable"
  | "blob_missing"
  | "blob_error"
  | "default";

export type CmsStatus = {
  source: CmsSource;
  reason: CmsStatusReason;
  writeDisabled: boolean;
  message: string | null;
};

export type CmsSnapshot = {
  data: CmsData;
  status: CmsStatus;
};

export class CmsWriteLockedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CmsWriteLockedError";
  }
}

function isRecord(value: unknown): value is JsonRecord {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function cloneValue<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function parseJsonText(text: string) {
  return JSON.parse(text.replace(/^\uFEFF/, ""));
}

function getFallbackCmsData(): CmsData {
  return normalizeCmsData(cloneValue(cmsDefaults));
}

function reportCmsReadFailure(error: unknown) {
  console.error(
    "[cms-store] Falling back to cmsDefaults because CMS blob could not be read.",
    error,
  );
}

function isBlob403Error(error: unknown) {
  return error instanceof Error && error.message.includes("403");
}

function getFallbackStatus(reason: CmsStatusReason): CmsStatus {
  if (reason === "forced_fallback") {
    return {
      source: "fallback",
      reason,
      writeDisabled: true,
      message: "目前強制使用備援資料，已停用儲存 / 發布。",
    };
  }

  if (reason === "blob_missing" || reason === "default") {
    return {
      source: "fallback",
      reason,
      writeDisabled: true,
      message: "目前使用備援資料，尚未讀到 Blob CMS 主資料，已停用儲存 / 發布。",
    };
  }

  return {
    source: "fallback",
    reason,
    writeDisabled: true,
    message: "Blob CMS 暫時不可讀，目前使用備援資料，已停用儲存 / 發布避免覆蓋原始資料。",
  };
}

function getBlobStatus(): CmsStatus {
  return {
    source: "blob",
    reason: "ok",
    writeDisabled: false,
    message: null,
  };
}

function shouldForceFallback() {
  return process.env.CMS_FORCE_FALLBACK === "1";
}

function getAtPath(source: unknown, path: string) {
  return path.split(".").filter(Boolean).reduce<unknown>((current, part) => {
    if (current && typeof current === "object") {
      return (current as JsonRecord)[part];
    }

    return undefined;
  }, source);
}

function setAtPath<T>(source: T, path: string, value: unknown) {
  const next = cloneValue(source);
  const parts = path.split(".").filter(Boolean);

  if (parts.length === 0) {
    return next;
  }

  let cursor = next as unknown as JsonRecord;

  for (let index = 0; index < parts.length - 1; index += 1) {
    const part = parts[index];
    const branch = cursor[part];

    if (!branch || typeof branch !== "object") {
      cursor[part] = {};
    }

    cursor = cursor[part] as JsonRecord;
  }

  cursor[parts[parts.length - 1]] = value;
  return next;
}

function collectDirtyPaths(previous: unknown, next: unknown, basePath = ""): string[] {
  if (JSON.stringify(previous) === JSON.stringify(next)) {
    return [];
  }

  if (Array.isArray(previous) && Array.isArray(next)) {
    if (previous.length !== next.length) {
      return basePath ? [basePath] : [];
    }

    const nested = previous.flatMap((item, index) =>
      collectDirtyPaths(item, next[index], basePath ? `${basePath}.${index}` : String(index)),
    );

    return nested.length > 0 ? nested : basePath ? [basePath] : [];
  }

  if (isRecord(previous) && isRecord(next)) {
    const keys = new Set([...Object.keys(previous), ...Object.keys(next)]);
    return Array.from(keys).flatMap((key) =>
      collectDirtyPaths(previous[key], next[key], basePath ? `${basePath}.${key}` : key),
    );
  }

  return basePath ? [basePath] : [];
}

async function getCmsBlobUrl() {
  const { blobs } = await list({
    prefix: CMS_CONTENT_PATH,
    limit: 1,
  });

  return blobs[0]?.url ?? null;
}

async function readCmsBlobRaw() {
  const blobUrl = await getCmsBlobUrl();

  if (!blobUrl) {
    return null;
  }

  const response = await fetch(blobUrl, { cache: "no-store" });

  if (!response.ok) {
    throw new Error(`Failed to fetch CMS blob: ${response.status}`);
  }

  const text = await response.text();
  return parseJsonText(text);
}

export async function seedCmsDataIfMissing() {
  const existingUrl = await getCmsBlobUrl();

  if (existingUrl) {
    return existingUrl;
  }

  const result = await put(CMS_CONTENT_PATH, JSON.stringify(cmsDefaults, null, 2), {
    access: "public",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json; charset=utf-8",
  });

  return result.url;
}

export async function getCmsSnapshot(): Promise<CmsSnapshot> {
  noStore();

  if (shouldForceFallback()) {
    return {
      data: getFallbackCmsData(),
      status: getFallbackStatus("forced_fallback"),
    };
  }

  try {
    const raw = await readCmsBlobRaw();

    if (raw) {
      return {
        data: normalizeCmsData(raw),
        status: getBlobStatus(),
      };
    }

    try {
      await seedCmsDataIfMissing();
    } catch (error) {
      reportCmsReadFailure(error);
    }

    return {
      data: getFallbackCmsData(),
      status: getFallbackStatus("blob_missing"),
    };
  } catch (error) {
    reportCmsReadFailure(error);

    return {
      data: getFallbackCmsData(),
      status: getFallbackStatus(isBlob403Error(error) ? "blob_403" : "blob_unavailable"),
    };
  }
}

export async function getCmsData(): Promise<CmsData> {
  return (await getCmsSnapshot()).data;
}

async function getWritableCmsRaw() {
  const snapshot = await getCmsSnapshot();

  if (snapshot.status.writeDisabled) {
    throw new CmsWriteLockedError(snapshot.status.message ?? "目前使用備援資料，已停用儲存 / 發布。");
  }

  return snapshot.data;
}

export async function saveCmsData(data: CmsData, dirtyPaths: string[] = []) {
  const existingRaw = await getWritableCmsRaw();
  let nextRaw = mergeMissingFields(applyLegacyAliases(existingRaw), cmsDefaults);
  const effectiveDirtyPaths = dirtyPaths.length > 0
    ? dirtyPaths
    : collectDirtyPaths(normalizeCmsData(existingRaw), data);

  if (effectiveDirtyPaths.length === 0) {
    nextRaw = mergeMissingFields(applyLegacyAliases(data), nextRaw);
  } else {
    for (const path of effectiveDirtyPaths) {
      nextRaw = setAtPath(nextRaw, path, getAtPath(data, path));
    }

    nextRaw = mergeMissingFields(nextRaw, cmsDefaults);
  }

  const result = await put(CMS_CONTENT_PATH, JSON.stringify(nextRaw, null, 2), {
    access: "public",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json; charset=utf-8",
  });

  return {
    data: normalizeCmsData(nextRaw),
    url: result.url,
  };
}
