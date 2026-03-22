export type DeviceKind = "ios" | "android" | "other";

export function detectDevice(userAgent?: string): DeviceKind {
  const source =
    userAgent ?? (typeof navigator !== "undefined" ? navigator.userAgent : "");

  const normalized = source.toLowerCase();
  const isIOS =
    /iphone|ipad|ipod/.test(normalized) ||
    (normalized.includes("macintosh") && normalized.includes("mobile"));

  if (isIOS) {
    return "ios";
  }

  if (normalized.includes("android")) {
    return "android";
  }

  return "other";
}
