import type { Metadata } from "next";

import type { CmsData, CmsRolePage, CmsSeo } from "@/lib/cms-schema";
import { buildSiteUrl, getSiteUrl } from "@/lib/site";

export function buildMetadata(site: CmsData, seo: CmsSeo): Metadata {
  const canonical = buildSiteUrl(seo.canonicalPath);
  const imageUrl = buildSiteUrl(seo.ogImageUrl || site.site.defaultSeoImageUrl);

  return {
    title: seo.pageTitle,
    description: seo.metaDescription,
    alternates: {
      canonical,
    },
    robots: {
      index: seo.robotsIndex,
      follow: seo.robotsFollow,
    },
    openGraph: {
      type: "website",
      locale: "zh_TW",
      siteName: site.site.siteName,
      title: seo.ogTitle,
      description: seo.ogDescription,
      url: canonical,
      images: [{ url: imageUrl, alt: seo.ogTitle }],
    },
    twitter: {
      card: "summary_large_image",
      title: seo.ogTitle,
      description: seo.ogDescription,
      images: [imageUrl],
    },
  };
}

export function buildHomeJsonLd(site: CmsData) {
  const siteUrl = getSiteUrl();

  return [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: site.site.organizationName,
      url: siteUrl,
      logo: buildSiteUrl(site.site.logo.url),
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: site.site.siteName,
      url: siteUrl,
      description: site.home.seo.metaDescription,
    },
  ];
}

export function buildRoleJsonLd(site: CmsData, path: string, pageName: string, page: CmsRolePage) {
  const siteUrl = getSiteUrl();

  return [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: pageName,
      headline: page.hero.title,
      description: page.seo.metaDescription,
      url: buildSiteUrl(path),
      isPartOf: {
        "@type": "WebSite",
        name: site.site.siteName,
        url: siteUrl,
      },
    },
  ];
}
