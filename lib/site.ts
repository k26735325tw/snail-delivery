const DEFAULT_SITE_URL = "https://goget.top";

function normalizeSiteUrl(value: string) {
  return value.endsWith("/") ? value : `${value}/`;
}

export function getSiteUrl() {
  const configuredUrl =
    process.env.SITE_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    DEFAULT_SITE_URL;

  return new URL(normalizeSiteUrl(configuredUrl)).toString();
}

export function getMetadataBase() {
  return new URL(getSiteUrl());
}

export function buildSiteUrl(path: string) {
  return new URL(path, getSiteUrl()).toString();
}
