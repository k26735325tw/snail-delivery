import { RolePage } from "@/components/role-page";
import { getCmsData } from "@/lib/cms-store";
import { buildMetadata, buildRoleJsonLd } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const site = await getCmsData();
  return buildMetadata(site, site.merchant.seo);
}

export default async function MerchantPage() {
  const cms = await getCmsData();
  const jsonLd = buildRoleJsonLd(cms, "/merchant", "店家", cms.merchant);

  return (
    <>
      {jsonLd.map((item, index) => (
        <script
          key={`merchant-jsonld-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }}
        />
      ))}
      <RolePage site={cms} page={cms.merchant} pageKey="merchant" />
    </>
  );
}
