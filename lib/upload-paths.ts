const overwriteUploadKeys = new Set([
  "shared/logo",
  "home/hero",
  "consumer/hero",
  "courier/hero",
  "merchant/hero",
  "about/video",
]);

export function shouldOverwriteUpload(uploadKey: string) {
  return overwriteUploadKeys.has(uploadKey) || uploadKey.startsWith("home/download-cards/");
}

export function normalizeUploadPathValue(value: string) {
  return value.trim().toLowerCase().replace(/[^a-z0-9/-]+/g, "-");
}

export function normalizeUploadKey(uploadKey: string) {
  const value = normalizeUploadPathValue(uploadKey);

  if (!value) {
    return "shared/logo";
  }

  return value;
}

export function sanitizeUploadFilename(filename: string) {
  return filename.replace(/[^a-zA-Z0-9._-]+/g, "-");
}
