export const MAX_UPLOAD_BYTES = 20 * 1024 * 1024;
export const MAX_UPLOAD_MB_LABEL = "20MB";

export const IMAGE_UPLOAD_ACCEPT = "image/png,image/jpeg,image/webp,image/svg+xml";
export const VIDEO_UPLOAD_ACCEPT = "video/mp4,video/webm";

export const IMAGE_UPLOAD_FORMAT_LABEL = "JPG / PNG / WebP / SVG";
export const VIDEO_UPLOAD_FORMAT_LABEL = "MP4 / WebM";

export function getImageUploadGuidance(dimensions: string) {
  return `支援 ${IMAGE_UPLOAD_FORMAT_LABEL}，大小限制 ${MAX_UPLOAD_MB_LABEL}，建議尺寸 ${dimensions}`;
}

export function getVideoUploadGuidance(ratio: string) {
  return `支援 ${VIDEO_UPLOAD_FORMAT_LABEL}，大小限制 ${MAX_UPLOAD_MB_LABEL}，建議比例 ${ratio}`;
}

export function getImageTooLargeMessage() {
  return `圖片檔案過大，請改用小於 ${MAX_UPLOAD_MB_LABEL} 的圖片檔案後再試。`;
}

export function getVideoTooLargeMessage() {
  return `影片檔案過大，請改用小於 ${MAX_UPLOAD_MB_LABEL} 的 MP4/WebM 檔案後再試。`;
}
