import { RolePage } from "@/components/role-page";
import { getCmsData } from "@/lib/cms-store";
import { buildMetadata, buildRoleJsonLd } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const site = await getCmsData();
  return buildMetadata(site, site.courier.seo);
}

export default async function CourierPage() {
  const cms = await getCmsData();
  const jsonLd = buildRoleJsonLd(cms, "/courier", "騎手", cms.courier);

  return (
    <>
      {jsonLd.map((item, index) => (
        <script
          key={`courier-jsonld-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }}
        />
      ))}
      <RolePage site={cms} page={cms.courier} pageKey="courier" />
    </>
  );
}
