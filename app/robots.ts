import type { MetadataRoute } from "next";

import { getCmsData } from "@/lib/cms-store";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const site = await getCmsData();

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/admin/visual"],
      },
    ],
    sitemap: `${site.site.siteUrl}/sitemap.xml`,
    host: site.site.siteUrl,
  };
}
