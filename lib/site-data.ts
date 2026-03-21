import { promises as fs } from "fs";
import path from "path";

export type SiteFeature = {
  title: string;
  desc: string;
};

export type SiteContent = {
  siteName: string;
  heroTitle: string;
  heroSubtitle: string;
  logo: string;
  features: SiteFeature[];
};

const siteDataPath = path.join(process.cwd(), "data", "site.json");

export async function readSiteData(): Promise<SiteContent> {
  const content = await fs.readFile(siteDataPath, "utf8");
  return JSON.parse(content) as SiteContent;
}

export async function writeSiteData(data: SiteContent) {
  await fs.writeFile(siteDataPath, JSON.stringify(data, null, 2), "utf8");
}
