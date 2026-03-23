import { SiteHome } from "@/components/site-home";
import { getCmsData } from "@/lib/cms-store";
import { buildHomeJsonLd, buildMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const site = await getCmsData();
  return buildMetadata(site, site.home.seo);
}

export default async function Page() {
  const site = await getCmsData();
  const jsonLd = buildHomeJsonLd(site);

  return (
    <>
      {jsonLd.map((item, index) => (
        <script
          key={`home-jsonld-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }}
        />
      ))}
      <SiteHome site={site} />
    </>
  );
}
