import type { MetadataRoute } from "next";

import { buildSiteUrl } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const updatedAt = new Date();

  return ["/", "/merchant", "/courier", "/about"].map((path) => ({
    url: buildSiteUrl(path),
    lastModified: updatedAt,
    changeFrequency: "daily",
    priority: path === "/" ? 1 : 0.8,
  }));
}
