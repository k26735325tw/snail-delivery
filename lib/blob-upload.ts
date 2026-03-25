import { upload } from "@vercel/blob/client";

import {
  normalizeUploadKey,
  sanitizeUploadFilename,
  shouldOverwriteUpload,
} from "@/lib/upload-paths";
import { MAX_UPLOAD_BYTES } from "@/lib/upload-rules";

const MULTIPART_THRESHOLD_BYTES = 5 * 1024 * 1024;

function buildBlobPath(uploadKey: string, fileName: string) {
  const normalizedUploadKey = normalizeUploadKey(uploadKey);
  const safeFilename = sanitizeUploadFilename(fileName || "upload-file");
  const extension = safeFilename.includes(".") ? safeFilename.slice(safeFilename.lastIndexOf(".")) : "";
  const shouldOverwrite = shouldOverwriteUpload(normalizedUploadKey);

  const pathname = shouldOverwrite
    ? `cms/${normalizedUploadKey}${extension}`
    : `cms/${normalizedUploadKey}/${Date.now()}-${safeFilename}`;

  return {
    pathname,
    uploadKey: normalizedUploadKey,
    shouldOverwrite,
  };
}

function withVersion(url: string) {
  return `${url}${url.includes("?") ? "&" : "?"}v=${Date.now()}`;
}

export async function uploadAsset(file: File, uploadKey: string) {
  if (file.size > MAX_UPLOAD_BYTES) {
    throw new Error("File too large");
  }

  const target = buildBlobPath(uploadKey, file.name);
  const result = await upload(target.pathname, file, {
    access: "public",
    handleUploadUrl: "/api/cms/upload",
    clientPayload: JSON.stringify({
      uploadKey: target.uploadKey,
      fileType: file.type,
      fileSize: file.size,
    }),
    multipart: file.size >= MULTIPART_THRESHOLD_BYTES,
  });

  return {
    url: withVersion(result.url),
    rawUrl: result.url,
    pathname: result.pathname,
  };
}
