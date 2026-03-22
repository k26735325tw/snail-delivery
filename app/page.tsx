import { SiteHome } from "@/components/site-home";
import { getSiteData } from "@/lib/site-data";

export default async function Page() {
  const site = await getSiteData();

  return <SiteHome site={site} />;
}
