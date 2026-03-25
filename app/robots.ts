import type { MetadataRoute } from "next";

import { getSiteUrl } from "@/lib/site";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const siteUrl = getSiteUrl();

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/admin/visual"],
      },
    ],
    sitemap: `${siteUrl}sitemap.xml`,
    host: siteUrl,
  };
}
