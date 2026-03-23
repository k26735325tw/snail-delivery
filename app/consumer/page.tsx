import { RolePage } from "@/components/role-page";
import { getCmsData } from "@/lib/cms-store";
import { buildMetadata, buildRoleJsonLd } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const site = await getCmsData();
  return buildMetadata(site, site.consumer.seo);
}

export default async function ConsumerPage() {
  const cms = await getCmsData();
  const jsonLd = buildRoleJsonLd(cms, "/consumer", "消費者", cms.consumer);

  return (
    <>
      {jsonLd.map((item, index) => (
        <script
          key={`consumer-jsonld-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }}
        />
      ))}
      <RolePage site={cms} page={cms.consumer} pageKey="consumer" />
    </>
  );
}
