import type { MetadataRoute } from "next";

import { getCmsData } from "@/lib/cms-store";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const site = await getCmsData();
  const updatedAt = new Date();

  return ["/", "/consumer", "/courier", "/merchant"].map((path) => ({
    url: new URL(path, site.site.siteUrl).toString(),
    lastModified: updatedAt,
    changeFrequency: "daily",
    priority: path === "/" ? 1 : 0.8,
  }));
}
