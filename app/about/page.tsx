import { SiteAbout } from "@/components/site-about";
import { getCmsData } from "@/lib/cms-store";
import { buildSiteUrl, getSiteUrl } from "@/lib/site";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const site = await getCmsData();

  return {
    title: site.about.title,
    description: site.about.description,
    alternates: {
      canonical: buildSiteUrl("/about"),
    },
    openGraph: {
      type: "website",
      locale: "zh_TW",
      title: site.about.title,
      description: site.about.description,
      url: buildSiteUrl("/about"),
    },
    twitter: {
      card: "summary_large_image",
      title: site.about.title,
      description: site.about.description,
    },
  };
}

export default async function AboutPage() {
  const site = await getCmsData();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: site.about.title,
    description: site.about.description,
    url: buildSiteUrl("/about"),
    isPartOf: {
      "@type": "WebSite",
      name: site.site.siteName,
      url: getSiteUrl(),
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SiteAbout site={site} />
    </>
  );
}
