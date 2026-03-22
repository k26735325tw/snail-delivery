import { promises as fs } from "fs";
import path from "path";

export type SiteContent = {
  siteName: string;
  heroTitle: string;
  heroSubtitle: string;
  features: string[];
  logo: string;
};

const siteDataPath = path.join(process.cwd(), "data", "site.json");

const defaultSiteData: SiteContent = {
  siteName: "GoGet",
  heroTitle: "一頁完成 GoGet 三種 App 下載導流",
  heroSubtitle:
    "首頁現在就是官方下載入口。無論你是外送員、店家或消費者，都能直接找到對應 App，手機裝置會自動導向正確商店。",
  features: [
    "首頁聚焦下載轉換，不再分散在多個說明頁",
    "手機裝置自動判斷 iOS / Android 並導向商店",
    "保留後台與 JSON 結構，方便後續再調整首頁文案",
  ],
  logo: "/logo.png",
};

function normalizeSiteData(input: unknown): SiteContent {
  const record = (input ?? {}) as Partial<SiteContent>;

  return {
    siteName:
      typeof record.siteName === "string" && record.siteName.trim().length > 0
        ? record.siteName.trim()
        : defaultSiteData.siteName,
    heroTitle:
      typeof record.heroTitle === "string" && record.heroTitle.trim().length > 0
        ? record.heroTitle.trim()
        : defaultSiteData.heroTitle,
    heroSubtitle:
      typeof record.heroSubtitle === "string" &&
      record.heroSubtitle.trim().length > 0
        ? record.heroSubtitle.trim()
        : defaultSiteData.heroSubtitle,
    features: Array.isArray(record.features)
      ? record.features
          .filter(
            (feature): feature is string =>
              typeof feature === "string" && feature.trim().length > 0,
          )
          .map((feature) => feature.trim())
      : defaultSiteData.features,
    logo:
      typeof record.logo === "string" && record.logo.trim().length > 0
        ? record.logo.trim()
        : defaultSiteData.logo,
  };
}

export async function getSiteData(): Promise<SiteContent> {
  try {
    const content = await fs.readFile(siteDataPath, "utf8");
    const parsed = JSON.parse(content) as unknown;
    return normalizeSiteData(parsed);
  } catch (error) {
    if ((error as NodeJS.ErrnoException)?.code === "ENOENT") {
      await saveSiteData(defaultSiteData);
      return defaultSiteData;
    }

    if (error instanceof SyntaxError) {
      throw new Error("Invalid JSON in data/site.json");
    }

    throw error;
  }
}

export async function saveSiteData(data: SiteContent) {
  const normalized = normalizeSiteData(data);
  await fs.mkdir(path.dirname(siteDataPath), { recursive: true });
  await fs.writeFile(siteDataPath, JSON.stringify(normalized, null, 2), "utf8");
}
