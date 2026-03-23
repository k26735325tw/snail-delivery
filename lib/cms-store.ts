import { list, put } from "@vercel/blob";
import { unstable_noStore as noStore } from "next/cache";

import { cmsDefaults } from "@/lib/cms-defaults";
import type {
  CmsBlockStyle,
  CmsContentItem,
  CmsData,
  CmsDownloadCard,
  CmsHomeFeatureCard,
  CmsImageAsset,
  CmsLaunchStep,
  CmsLinkGroup,
  CmsLinkItem,
  CmsRolePage,
  CmsSection,
  CmsSeo,
  CmsStat,
  CmsTextStyle,
} from "@/lib/cms-schema";
import { defaultBlockStyle, defaultImageAsset, defaultTextStyle, isValidColorValue } from "@/lib/cms-style";

const CMS_CONTENT_PATH = "cms/site-content.json";

type JsonRecord = Record<string, unknown>;

function isRecord(value: unknown): value is JsonRecord {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function cloneValue<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function cleanStoredString(value: string) {
  return value.replace(/^\uFEFF/, "").replace(/\u0000/g, "");
}

function looksCorruptedString(value: string) {
  return value.includes("�") || /[ÃÅÆÇÐÑØÞßæçðñøþ]/.test(value);
}

function parseJsonText(text: string) {
  return JSON.parse(text.replace(/^\uFEFF/, ""));
}

function getAtPath(source: unknown, path: string) {
  return path.split(".").filter(Boolean).reduce<unknown>((current, part) => {
    if (current && typeof current === "object") {
      return (current as JsonRecord)[part];
    }

    return undefined;
  }, source);
}

function setAtPath<T>(source: T, path: string, value: unknown) {
  const next = cloneValue(source);
  const parts = path.split(".").filter(Boolean);

  if (parts.length === 0) {
    return next;
  }

  let cursor = next as unknown as JsonRecord;

  for (let index = 0; index < parts.length - 1; index += 1) {
    const part = parts[index];
    const branch = cursor[part];

    if (!branch || typeof branch !== "object") {
      cursor[part] = {};
    }

    cursor = cursor[part] as JsonRecord;
  }

  cursor[parts[parts.length - 1]] = value;
  return next;
}

function mergeMissingFields<T>(current: unknown, fallback: T): T {
  if (Array.isArray(fallback)) {
    if (!Array.isArray(current)) {
      return cloneValue(fallback);
    }

    const fallbackItem = fallback[0];
    return current.map((item, index) => mergeMissingFields(item, fallback[index] ?? fallbackItem)) as T;
  }

  if (typeof fallback === "string") {
    return (typeof current === "string" ? cleanStoredString(current) : fallback) as T;
  }

  if (typeof fallback === "number") {
    if (typeof current === "number" && Number.isFinite(current)) {
      return current as T;
    }

    if (typeof current === "string" && Number.isFinite(Number(current))) {
      return Number(current) as T;
    }

    return fallback;
  }

  if (typeof fallback === "boolean") {
    return (typeof current === "boolean" ? current : fallback) as T;
  }

  if (!fallback || typeof fallback !== "object") {
    return fallback;
  }

  const record = isRecord(current) ? current : {};
  const result: JsonRecord = {};

  for (const key of Object.keys(fallback as JsonRecord)) {
    const templateValue = (fallback as JsonRecord)[key];
    result[key] = key in record ? mergeMissingFields(record[key], templateValue) : cloneValue(templateValue);
  }

  return result as T;
}

function applyLegacyAliases(input: unknown) {
  const cloned = isRecord(input) ? cloneValue(input) : {};

  if (isRecord(cloned.site) && typeof cloned.site.logoUrl === "string" && !isRecord(cloned.site.logo)) {
    cloned.site.logo = {
      ...cmsDefaults.site.logo,
      url: cloned.site.logoUrl,
    };
  }

  if (isRecord(cloned.home)) {
    if (Array.isArray(cloned.home.features)) {
      cloned.home.features = {
        cards: cloned.home.features,
      };
    }

    if (isRecord(cloned.home.hero) && typeof cloned.home.hero.heroImageUrl === "string" && !isRecord(cloned.home.hero.heroImage)) {
      cloned.home.hero.heroImage = {
        ...cmsDefaults.home.hero.heroImage,
        url: cloned.home.hero.heroImageUrl,
      };
    }
  }

  for (const pageKey of ["consumer", "courier", "merchant"] as const) {
    if (isRecord(cloned[pageKey]) && isRecord(cloned[pageKey].hero) && typeof cloned[pageKey].hero.heroImageUrl === "string" && !isRecord(cloned[pageKey].hero.heroImage)) {
      cloned[pageKey].hero.heroImage = {
        ...cmsDefaults[pageKey].hero.heroImage,
        url: cloned[pageKey].hero.heroImageUrl,
      };
    }
  }

  return cloned;
}

function normalizeDisplayString(value: unknown, fallback: string) {
  if (typeof value !== "string") {
    return fallback;
  }

  const cleaned = cleanStoredString(value).trim();

  if (!cleaned || looksCorruptedString(cleaned)) {
    return fallback;
  }

  return cleaned;
}

function normalizeBoolean(value: unknown, fallback: boolean) {
  return typeof value === "boolean" ? value : fallback;
}

function normalizeNumber(value: unknown, fallback: number, min?: number, max?: number) {
  const parsed = typeof value === "number" ? value : Number(value);

  if (!Number.isFinite(parsed)) {
    return fallback;
  }

  const rounded = Math.round(parsed);
  const withMin = typeof min === "number" ? Math.max(min, rounded) : rounded;
  return typeof max === "number" ? Math.min(max, withMin) : withMin;
}

function normalizeColor(value: unknown, fallback: string) {
  const next = normalizeDisplayString(value, fallback);
  return isValidColorValue(next) ? next : fallback;
}

function normalizeTextStyle(value: unknown, fallback: CmsTextStyle): CmsTextStyle {
  const record = isRecord(value) ? value : {};

  return {
    fontSize: normalizeDisplayString(record.fontSize, fallback.fontSize) as CmsTextStyle["fontSize"],
    fontWeight: normalizeDisplayString(record.fontWeight, fallback.fontWeight) as CmsTextStyle["fontWeight"],
    textAlign: normalizeDisplayString(record.textAlign, fallback.textAlign) as CmsTextStyle["textAlign"],
    textColor: normalizeColor(record.textColor, fallback.textColor),
    lineHeight: normalizeDisplayString(record.lineHeight, fallback.lineHeight) as CmsTextStyle["lineHeight"],
  };
}

function normalizeBlockStyle(value: unknown, fallback: CmsBlockStyle): CmsBlockStyle {
  const record = isRecord(value) ? value : {};

  return {
    backgroundColor: normalizeColor(record.backgroundColor, fallback.backgroundColor),
    foregroundColor: normalizeColor(record.foregroundColor, fallback.foregroundColor),
    borderColor: normalizeColor(record.borderColor, fallback.borderColor),
    borderRadius: normalizeDisplayString(record.borderRadius, fallback.borderRadius) as CmsBlockStyle["borderRadius"],
    paddingX: normalizeDisplayString(record.paddingX, fallback.paddingX) as CmsBlockStyle["paddingX"],
    paddingY: normalizeDisplayString(record.paddingY, fallback.paddingY) as CmsBlockStyle["paddingY"],
    shadow: normalizeDisplayString(record.shadow, fallback.shadow) as CmsBlockStyle["shadow"],
  };
}

function normalizeImageAsset(value: unknown, fallback: CmsImageAsset): CmsImageAsset {
  const record = isRecord(value) ? value : {};

  return {
    url: normalizeDisplayString(record.url, fallback.url),
    alt: normalizeDisplayString(record.alt, fallback.alt),
    objectFit: normalizeDisplayString(record.objectFit, fallback.objectFit) as CmsImageAsset["objectFit"],
    focalX: normalizeNumber(record.focalX, fallback.focalX, 0, 100),
    focalY: normalizeNumber(record.focalY, fallback.focalY, 0, 100),
    desktopHeight: normalizeNumber(record.desktopHeight, fallback.desktopHeight, 80, 1600),
    mobileHeight: normalizeNumber(record.mobileHeight, fallback.mobileHeight, 80, 1600),
  };
}

function normalizeLink(value: unknown, fallback: CmsLinkItem): CmsLinkItem {
  const record = isRecord(value) ? value : {};

  return {
    label: normalizeDisplayString(record.label, fallback.label),
    href: normalizeDisplayString(record.href, fallback.href),
  };
}

function normalizeLinkGroups(value: unknown, fallback: CmsLinkGroup[]) {
  if (!Array.isArray(value)) {
    return fallback;
  }

  const groups = value.map((group, index) => {
    const record = isRecord(group) ? group : {};
    const fallbackGroup = fallback[index] ?? fallback[0];

    return {
      title: normalizeDisplayString(record.title, fallbackGroup?.title ?? "連結群組"),
      links: Array.isArray(record.links)
        ? record.links.map((link, linkIndex) => normalizeLink(link, fallbackGroup?.links[linkIndex] ?? { label: "連結", href: "/" }))
        : fallbackGroup?.links ?? [],
    };
  });

  return groups.length > 0 ? groups : fallback;
}

function normalizeStats(value: unknown, fallback: CmsStat[]) {
  if (!Array.isArray(value)) {
    return fallback;
  }

  const stats = value.map((stat, index) => {
    const record = isRecord(stat) ? stat : {};
    const fallbackStat = fallback[index] ?? fallback[0];

    return {
      label: normalizeDisplayString(record.label, fallbackStat?.label ?? "標籤"),
      value: normalizeDisplayString(record.value, fallbackStat?.value ?? "內容"),
    };
  });

  return stats.length > 0 ? stats : fallback;
}

function normalizeSeo(value: unknown, fallback: CmsSeo): CmsSeo {
  const record = isRecord(value) ? value : {};

  return {
    pageTitle: normalizeDisplayString(record.pageTitle, fallback.pageTitle),
    metaDescription: normalizeDisplayString(record.metaDescription, fallback.metaDescription),
    canonicalPath: normalizeDisplayString(record.canonicalPath, fallback.canonicalPath),
    ogTitle: normalizeDisplayString(record.ogTitle, fallback.ogTitle),
    ogDescription: normalizeDisplayString(record.ogDescription, fallback.ogDescription),
    ogImageUrl: normalizeDisplayString(record.ogImageUrl, fallback.ogImageUrl),
    robotsIndex: normalizeBoolean(record.robotsIndex, fallback.robotsIndex),
    robotsFollow: normalizeBoolean(record.robotsFollow, fallback.robotsFollow),
  };
}

function normalizeContentItem(value: unknown, fallback: CmsContentItem): CmsContentItem {
  const record = isRecord(value) ? value : {};

  return {
    eyebrow: normalizeDisplayString(record.eyebrow, fallback.eyebrow),
    title: normalizeDisplayString(record.title, fallback.title),
    description: normalizeDisplayString(record.description, fallback.description),
    icon: normalizeDisplayString(record.icon, fallback.icon ?? ""),
    eyebrowStyle: normalizeTextStyle(record.eyebrowStyle, fallback.eyebrowStyle),
    titleStyle: normalizeTextStyle(record.titleStyle, fallback.titleStyle),
    descriptionStyle: normalizeTextStyle(record.descriptionStyle, fallback.descriptionStyle),
    blockStyle: normalizeBlockStyle(record.blockStyle, fallback.blockStyle),
  };
}

function normalizeSections(value: unknown, fallback: CmsSection[]) {
  if (!Array.isArray(value)) {
    return fallback;
  }

  const sections = value.map((section, index) => {
    const record = isRecord(section) ? section : {};
    const fallbackSection = fallback[index] ?? fallback[0];

    return {
      id: normalizeDisplayString(record.id, fallbackSection?.id ?? `section-${index + 1}`),
      badge: normalizeDisplayString(record.badge, fallbackSection?.badge ?? "區塊"),
      title: normalizeDisplayString(record.title, fallbackSection?.title ?? "標題"),
      description: normalizeDisplayString(record.description, fallbackSection?.description ?? "說明"),
      badgeStyle: normalizeTextStyle(record.badgeStyle, fallbackSection?.badgeStyle ?? defaultTextStyle()),
      titleStyle: normalizeTextStyle(record.titleStyle, fallbackSection?.titleStyle ?? defaultTextStyle({ fontSize: "4xl", fontWeight: "900" })),
      descriptionStyle: normalizeTextStyle(record.descriptionStyle, fallbackSection?.descriptionStyle ?? defaultTextStyle()),
      blockStyle: normalizeBlockStyle(record.blockStyle, fallbackSection?.blockStyle ?? defaultBlockStyle()),
      items: Array.isArray(record.items)
        ? record.items.map((item, itemIndex) =>
            normalizeContentItem(
              item,
              fallbackSection?.items[itemIndex] ??
                {
                  eyebrow: "",
                  title: "卡片標題",
                  description: "卡片說明",
                  icon: "",
                  eyebrowStyle: defaultTextStyle(),
                  titleStyle: defaultTextStyle({ fontSize: "xl", fontWeight: "700" }),
                  descriptionStyle: defaultTextStyle(),
                  blockStyle: defaultBlockStyle(),
                },
            ),
          )
        : fallbackSection?.items ?? [],
    };
  });

  return sections.length > 0 ? sections : fallback;
}

function normalizeFeatureCards(value: unknown, fallback: CmsHomeFeatureCard[]) {
  if (!Array.isArray(value)) {
    return fallback;
  }

  const cards = value.map((card, index) => {
    const record = isRecord(card) ? card : {};
    const fallbackCard = fallback[index] ?? fallback[0];

    return {
      eyebrow: normalizeDisplayString(record.eyebrow, fallbackCard?.eyebrow ?? "特色"),
      title: normalizeDisplayString(record.title, fallbackCard?.title ?? "特色標題"),
      description: normalizeDisplayString(record.description, fallbackCard?.description ?? "特色說明"),
      eyebrowStyle: normalizeTextStyle(record.eyebrowStyle, fallbackCard?.eyebrowStyle ?? defaultTextStyle()),
      titleStyle: normalizeTextStyle(record.titleStyle, fallbackCard?.titleStyle ?? defaultTextStyle({ fontSize: "xl", fontWeight: "700" })),
      descriptionStyle: normalizeTextStyle(record.descriptionStyle, fallbackCard?.descriptionStyle ?? defaultTextStyle()),
      blockStyle: normalizeBlockStyle(record.blockStyle, fallbackCard?.blockStyle ?? defaultBlockStyle()),
    };
  });

  return cards.length > 0 ? cards : fallback;
}

function normalizeDownloadCards(value: unknown, fallback: CmsDownloadCard[]) {
  if (!Array.isArray(value)) {
    return fallback;
  }

  const cards = value.map((card, index) => {
    const record = isRecord(card) ? card : {};
    const fallbackCard = fallback[index] ?? fallback[0];

    return {
      key: (record.key ?? fallbackCard?.key ?? "consumer") as CmsDownloadCard["key"],
      eyebrow: normalizeDisplayString(record.eyebrow, fallbackCard?.eyebrow ?? "App"),
      title: normalizeDisplayString(record.title, fallbackCard?.title ?? "標題"),
      description: normalizeDisplayString(record.description, fallbackCard?.description ?? "說明"),
      audience: normalizeDisplayString(record.audience, fallbackCard?.audience ?? "受眾"),
      image: normalizeImageAsset(record.image, fallbackCard?.image ?? defaultImageAsset("", "圖片")),
      iosUrl: normalizeDisplayString(record.iosUrl, fallbackCard?.iosUrl ?? "#"),
      androidUrl: normalizeDisplayString(record.androidUrl, fallbackCard?.androidUrl ?? "#"),
      highlights: Array.isArray(record.highlights)
        ? record.highlights.map((item, itemIndex) => normalizeDisplayString(item, fallbackCard?.highlights[itemIndex] ?? "特色"))
        : fallbackCard?.highlights ?? [],
      eyebrowStyle: normalizeTextStyle(record.eyebrowStyle, fallbackCard?.eyebrowStyle ?? defaultTextStyle()),
      titleStyle: normalizeTextStyle(record.titleStyle, fallbackCard?.titleStyle ?? defaultTextStyle({ fontSize: "2xl", fontWeight: "900" })),
      audienceStyle: normalizeTextStyle(record.audienceStyle, fallbackCard?.audienceStyle ?? defaultTextStyle()),
      descriptionStyle: normalizeTextStyle(record.descriptionStyle, fallbackCard?.descriptionStyle ?? defaultTextStyle()),
      blockStyle: normalizeBlockStyle(record.blockStyle, fallbackCard?.blockStyle ?? defaultBlockStyle()),
    };
  });

  return cards.length > 0 ? cards : fallback;
}

function normalizeLaunchSteps(value: unknown, fallback: CmsLaunchStep[]) {
  if (!Array.isArray(value)) {
    return fallback;
  }

  const steps = value.map((step, index) => {
    const record = isRecord(step) ? step : {};
    const fallbackStep = fallback[index] ?? fallback[0];

    return {
      index: normalizeDisplayString(record.index, fallbackStep?.index ?? `${index + 1}`),
      title: normalizeDisplayString(record.title, fallbackStep?.title ?? "步驟標題"),
      description: normalizeDisplayString(record.description, fallbackStep?.description ?? "步驟說明"),
      indexStyle: normalizeTextStyle(record.indexStyle, fallbackStep?.indexStyle ?? defaultTextStyle()),
      titleStyle: normalizeTextStyle(record.titleStyle, fallbackStep?.titleStyle ?? defaultTextStyle({ fontSize: "xl", fontWeight: "700" })),
      descriptionStyle: normalizeTextStyle(record.descriptionStyle, fallbackStep?.descriptionStyle ?? defaultTextStyle()),
      blockStyle: normalizeBlockStyle(record.blockStyle, fallbackStep?.blockStyle ?? defaultBlockStyle()),
    };
  });

  return steps.length > 0 ? steps : fallback;
}

function normalizeRolePage(value: unknown, fallback: CmsRolePage): CmsRolePage {
  const record = isRecord(value) ? value : {};
  const hero = isRecord(record.hero) ? record.hero : {};

  return {
    hero: {
      badge: normalizeDisplayString(hero.badge, fallback.hero.badge),
      title: normalizeDisplayString(hero.title, fallback.hero.title),
      description: normalizeDisplayString(hero.description, fallback.hero.description),
      primaryLabel: normalizeDisplayString(hero.primaryLabel, fallback.hero.primaryLabel),
      primaryHref: normalizeDisplayString(hero.primaryHref, fallback.hero.primaryHref),
      secondaryLabel: normalizeDisplayString(hero.secondaryLabel, fallback.hero.secondaryLabel),
      secondaryHref: normalizeDisplayString(hero.secondaryHref, fallback.hero.secondaryHref),
      asideTitle: normalizeDisplayString(hero.asideTitle, fallback.hero.asideTitle),
      stats: normalizeStats(hero.stats, fallback.hero.stats),
      heroImage: normalizeImageAsset(hero.heroImage, fallback.hero.heroImage),
      badgeStyle: normalizeTextStyle(hero.badgeStyle, fallback.hero.badgeStyle),
      titleStyle: normalizeTextStyle(hero.titleStyle, fallback.hero.titleStyle),
      descriptionStyle: normalizeTextStyle(hero.descriptionStyle, fallback.hero.descriptionStyle),
      asideTitleStyle: normalizeTextStyle(hero.asideTitleStyle, fallback.hero.asideTitleStyle),
      sectionStyle: normalizeBlockStyle(hero.sectionStyle, fallback.hero.sectionStyle),
    },
    sections: normalizeSections(record.sections, fallback.sections),
    seo: normalizeSeo(record.seo, fallback.seo),
  };
}

export function normalizeCmsData(input: unknown): CmsData {
  const merged = mergeMissingFields(applyLegacyAliases(input), cmsDefaults);
  const record: JsonRecord = isRecord(merged) ? merged : {};
  const site: JsonRecord = isRecord(record.site) ? record.site : {};
  const home: JsonRecord = isRecord(record.home) ? record.home : {};
  const header = isRecord(home.header) ? home.header : {};
  const hero = isRecord(home.hero) ? home.hero : {};
  const features = isRecord(home.features) ? home.features : {};
  const launchFlow = isRecord(home.launchFlow) ? home.launchFlow : {};

  return {
    site: {
      siteName: normalizeDisplayString(site.siteName, cmsDefaults.site.siteName),
      siteUrl: normalizeDisplayString(site.siteUrl, cmsDefaults.site.siteUrl),
      logo: normalizeImageAsset(site.logo, cmsDefaults.site.logo),
      organizationName: normalizeDisplayString(site.organizationName, cmsDefaults.site.organizationName),
      footerTitle: normalizeDisplayString(site.footerTitle, cmsDefaults.site.footerTitle),
      footerDescription: normalizeDisplayString(site.footerDescription, cmsDefaults.site.footerDescription),
      footerTitleStyle: normalizeTextStyle(site.footerTitleStyle, cmsDefaults.site.footerTitleStyle),
      footerDescriptionStyle: normalizeTextStyle(site.footerDescriptionStyle, cmsDefaults.site.footerDescriptionStyle),
      footerLinkGroups: normalizeLinkGroups(site.footerLinkGroups, cmsDefaults.site.footerLinkGroups),
      footerStyle: normalizeBlockStyle(site.footerStyle, cmsDefaults.site.footerStyle),
      defaultSeoImageUrl: normalizeDisplayString(site.defaultSeoImageUrl, cmsDefaults.site.defaultSeoImageUrl),
    },
    home: {
      header: {
        subtitle: normalizeDisplayString(header.subtitle, cmsDefaults.home.header.subtitle),
        subtitleStyle: normalizeTextStyle(header.subtitleStyle, cmsDefaults.home.header.subtitleStyle),
        navItems: Array.isArray(header.navItems)
          ? header.navItems.map((item, index) => normalizeLink(item, cmsDefaults.home.header.navItems[index] ?? { label: "導覽", href: "/" }))
          : cmsDefaults.home.header.navItems,
        cta: normalizeLink(header.cta, cmsDefaults.home.header.cta),
        blockStyle: normalizeBlockStyle(header.blockStyle, cmsDefaults.home.header.blockStyle),
      },
      hero: {
        badge: normalizeDisplayString(hero.badge, cmsDefaults.home.hero.badge),
        title: normalizeDisplayString(hero.title, cmsDefaults.home.hero.title),
        subtitle: normalizeDisplayString(hero.subtitle, cmsDefaults.home.hero.subtitle),
        primaryLabel: normalizeDisplayString(hero.primaryLabel, cmsDefaults.home.hero.primaryLabel),
        primaryHref: normalizeDisplayString(hero.primaryHref, cmsDefaults.home.hero.primaryHref),
        secondaryLabel: normalizeDisplayString(hero.secondaryLabel, cmsDefaults.home.hero.secondaryLabel),
        secondaryHref: normalizeDisplayString(hero.secondaryHref, cmsDefaults.home.hero.secondaryHref),
        deviceBadge: normalizeDisplayString(hero.deviceBadge, cmsDefaults.home.hero.deviceBadge),
        secondaryBadge: normalizeDisplayString(hero.secondaryBadge, cmsDefaults.home.hero.secondaryBadge),
        heroImage: normalizeImageAsset(hero.heroImage, cmsDefaults.home.hero.heroImage),
        badgeStyle: normalizeTextStyle(hero.badgeStyle, cmsDefaults.home.hero.badgeStyle),
        titleStyle: normalizeTextStyle(hero.titleStyle, cmsDefaults.home.hero.titleStyle),
        subtitleStyle: normalizeTextStyle(hero.subtitleStyle, cmsDefaults.home.hero.subtitleStyle),
        deviceBadgeStyle: normalizeTextStyle(hero.deviceBadgeStyle, cmsDefaults.home.hero.deviceBadgeStyle),
        secondaryBadgeStyle: normalizeTextStyle(hero.secondaryBadgeStyle, cmsDefaults.home.hero.secondaryBadgeStyle),
        sectionStyle: normalizeBlockStyle(hero.sectionStyle, cmsDefaults.home.hero.sectionStyle),
      },
      features: {
        cards: normalizeFeatureCards(features.cards, cmsDefaults.home.features.cards),
        sectionStyle: normalizeBlockStyle(features.sectionStyle, cmsDefaults.home.features.sectionStyle),
      },
      downloadCards: normalizeDownloadCards(home.downloadCards, cmsDefaults.home.downloadCards),
      launchFlow: {
        eyebrow: normalizeDisplayString(launchFlow.eyebrow, cmsDefaults.home.launchFlow.eyebrow),
        title: normalizeDisplayString(launchFlow.title, cmsDefaults.home.launchFlow.title),
        description: normalizeDisplayString(launchFlow.description, cmsDefaults.home.launchFlow.description),
        eyebrowStyle: normalizeTextStyle(launchFlow.eyebrowStyle, cmsDefaults.home.launchFlow.eyebrowStyle),
        titleStyle: normalizeTextStyle(launchFlow.titleStyle, cmsDefaults.home.launchFlow.titleStyle),
        descriptionStyle: normalizeTextStyle(launchFlow.descriptionStyle, cmsDefaults.home.launchFlow.descriptionStyle),
        leftBlockStyle: normalizeBlockStyle(launchFlow.leftBlockStyle, cmsDefaults.home.launchFlow.leftBlockStyle),
        rightBlockStyle: normalizeBlockStyle(launchFlow.rightBlockStyle, cmsDefaults.home.launchFlow.rightBlockStyle),
        steps: normalizeLaunchSteps(launchFlow.steps, cmsDefaults.home.launchFlow.steps),
      },
      seo: normalizeSeo(home.seo, cmsDefaults.home.seo),
    },
    consumer: normalizeRolePage(record.consumer, cmsDefaults.consumer),
    courier: normalizeRolePage(record.courier, cmsDefaults.courier),
    merchant: normalizeRolePage(record.merchant, cmsDefaults.merchant),
  };
}

async function getCmsBlobUrl() {
  const { blobs } = await list({
    prefix: CMS_CONTENT_PATH,
    limit: 1,
  });

  return blobs[0]?.url ?? null;
}

async function readCmsBlobRaw() {
  const blobUrl = await getCmsBlobUrl();

  if (!blobUrl) {
    return null;
  }

  const response = await fetch(blobUrl, { cache: "no-store" });

  if (!response.ok) {
    throw new Error(`Failed to fetch CMS blob: ${response.status}`);
  }

  const text = await response.text();
  return parseJsonText(text);
}

export async function seedCmsDataIfMissing() {
  const existingUrl = await getCmsBlobUrl();

  if (existingUrl) {
    return existingUrl;
  }

  const result = await put(CMS_CONTENT_PATH, JSON.stringify(cmsDefaults, null, 2), {
    access: "public",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json; charset=utf-8",
  });

  return result.url;
}

export async function getCmsData(): Promise<CmsData> {
  noStore();

  const raw = (await readCmsBlobRaw()) ?? (await seedCmsDataIfMissing(), cmsDefaults);
  return normalizeCmsData(raw);
}

export async function saveCmsData(data: CmsData, dirtyPaths: string[] = []) {
  const existingRaw = (await readCmsBlobRaw()) ?? cmsDefaults;
  let nextRaw = mergeMissingFields(applyLegacyAliases(existingRaw), cmsDefaults);

  if (dirtyPaths.length === 0) {
    nextRaw = mergeMissingFields(applyLegacyAliases(data), nextRaw);
  } else {
    for (const path of dirtyPaths) {
      nextRaw = setAtPath(nextRaw, path, getAtPath(data, path));
    }

    nextRaw = mergeMissingFields(nextRaw, cmsDefaults);
  }

  const result = await put(CMS_CONTENT_PATH, JSON.stringify(nextRaw, null, 2), {
    access: "public",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json; charset=utf-8",
  });

  return {
    data: normalizeCmsData(nextRaw),
    url: result.url,
  };
}
