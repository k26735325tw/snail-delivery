import type { Metadata } from "next";

import type { CmsData, CmsRolePage, CmsSeo } from "@/lib/cms-schema";

function normalizeUrl(siteUrl: string, path: string) {
  return new URL(path, siteUrl).toString();
}

export function buildMetadata(site: CmsData, seo: CmsSeo): Metadata {
  const canonical = normalizeUrl(site.site.siteUrl, seo.canonicalPath);
  const imageUrl = normalizeUrl(site.site.siteUrl, seo.ogImageUrl || site.site.defaultSeoImageUrl);

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
  const siteUrl = site.site.siteUrl;

  return [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: site.site.organizationName,
      url: siteUrl,
      logo: normalizeUrl(siteUrl, site.site.logo.url),
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: site.site.siteName,
      url: siteUrl,
      description: site.home.seo.metaDescription,
      potentialAction: {
        "@type": "SearchAction",
        target: `${siteUrl}/?q={search_term_string}`,
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "首頁",
          item: siteUrl,
        },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "HowTo",
      name: site.home.launchFlow.title,
      description: site.home.launchFlow.description,
      step: site.home.launchFlow.steps.map((step, index) => ({
        "@type": "HowToStep",
        position: index + 1,
        name: step.title,
        text: step.description,
      })),
    },
  ];
}

export function buildRoleJsonLd(site: CmsData, path: string, pageName: string, page: CmsRolePage) {
  const siteUrl = site.site.siteUrl;

  return [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "首頁",
          item: siteUrl,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: pageName,
          item: normalizeUrl(siteUrl, path),
        },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: page.seo.pageTitle,
      description: page.seo.metaDescription,
      url: normalizeUrl(siteUrl, path),
    },
  ];
}
