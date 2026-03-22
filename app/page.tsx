import { SiteHome } from "@/components/site-home";
import { getCmsData } from "@/lib/cms-store";

export const dynamic = "force-dynamic";

export default async function Page() {
  const site = await getCmsData();

  return <SiteHome site={site} />;
}
