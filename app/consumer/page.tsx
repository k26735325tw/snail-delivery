import { RolePage } from "@/components/role-page";
import { getCmsData } from "@/lib/cms-store";

export const dynamic = "force-dynamic";

export default async function ConsumerPage() {
  const cms = await getCmsData();

  return (
    <RolePage
      siteName={cms.site.siteName}
      logoUrl={cms.site.logoUrl}
      footerTitle={cms.site.footerTitle}
      footerDescription={cms.site.footerDescription}
      page={cms.consumer}
    />
  );
}
