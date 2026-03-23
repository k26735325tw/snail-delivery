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

function normalizeString(value: unknown, fallback: string) {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : fallback;
}

function normalizeBoolean(value: unknown, fallback: boolean) {
  return typeof value === "boolean" ? value : fallback;
}

function normalizeNumber(value: unknown, fallback: number, min?: number, max?: number) {
  const parsed = typeof value === "number" ? value : Number(value);

  if (!Number.isFinite(parsed)) {
    return fallback;
  }

  const bounded = Math.round(parsed);
  const atLeast = typeof min === "number" ? Math.max(min, bounded) : bounded;
  return typeof max === "number" ? Math.min(max, atLeast) : atLeast;
}

function normalizeStringArray(value: unknown, fallback: string[]) {
  if (!Array.isArray(value)) {
    return fallback;
  }

  const next = value
    .filter((item): item is string => typeof item === "string" && item.trim().length > 0)
    .map((item) => item.trim());

  return next.length > 0 ? next : fallback;
}

function normalizeColor(value: unknown, fallback: string) {
  const normalized = normalizeString(value, fallback);
  return isValidColorValue(normalized) ? normalized : fallback;
}

function normalizeTextStyle(value: unknown, fallback: CmsTextStyle): CmsTextStyle {
  const record = (value ?? {}) as Partial<CmsTextStyle>;

  return {
    fontSize: normalizeString(record.fontSize, fallback.fontSize) as CmsTextStyle["fontSize"],
    fontWeight: normalizeString(record.fontWeight, fallback.fontWeight) as CmsTextStyle["fontWeight"],
    textAlign: normalizeString(record.textAlign, fallback.textAlign) as CmsTextStyle["textAlign"],
    textColor: normalizeColor(record.textColor, fallback.textColor),
    lineHeight: normalizeString(record.lineHeight, fallback.lineHeight) as CmsTextStyle["lineHeight"],
  };
}

function normalizeBlockStyle(value: unknown, fallback: CmsBlockStyle): CmsBlockStyle {
  const record = (value ?? {}) as Partial<CmsBlockStyle>;

  return {
    backgroundColor: normalizeColor(record.backgroundColor, fallback.backgroundColor),
    foregroundColor: normalizeColor(record.foregroundColor, fallback.foregroundColor),
    borderColor: normalizeColor(record.borderColor, fallback.borderColor),
    borderRadius: normalizeString(record.borderRadius, fallback.borderRadius) as CmsBlockStyle["borderRadius"],
    paddingX: normalizeString(record.paddingX, fallback.paddingX) as CmsBlockStyle["paddingX"],
    paddingY: normalizeString(record.paddingY, fallback.paddingY) as CmsBlockStyle["paddingY"],
    shadow: normalizeString(record.shadow, fallback.shadow) as CmsBlockStyle["shadow"],
  };
}

function normalizeImageAsset(value: unknown, fallback: CmsImageAsset): CmsImageAsset {
  const record = (value ?? {}) as Partial<CmsImageAsset>;
  return {
    url: normalizeString(record.url, fallback.url),
    alt: normalizeString(record.alt, fallback.alt),
    objectFit: normalizeString(record.objectFit, fallback.objectFit) as CmsImageAsset["objectFit"],
    focalX: normalizeNumber(record.focalX, fallback.focalX, 0, 100),
    focalY: normalizeNumber(record.focalY, fallback.focalY, 0, 100),
    desktopHeight: normalizeNumber(record.desktopHeight, fallback.desktopHeight, 80, 1200),
    mobileHeight: normalizeNumber(record.mobileHeight, fallback.mobileHeight, 80, 1200),
  };
}

function normalizeLink(value: unknown, fallback: CmsLinkItem): CmsLinkItem {
  const record = (value ?? {}) as Partial<CmsLinkItem>;
  return {
    label: normalizeString(record.label, fallback.label),
    href: normalizeString(record.href, fallback.href),
  };
}

function normalizeLinkGroups(value: unknown, fallback: CmsLinkGroup[]) {
  if (!Array.isArray(value)) {
    return fallback;
  }

  const groups = value.map((group, index) => {
    const record = (group ?? {}) as Partial<CmsLinkGroup>;
    const fallbackGroup = fallback[index] ?? fallback[0];

    return {
      title: normalizeString(record.title, fallbackGroup?.title ?? "連結群組"),
      links: Array.isArray(record.links)
        ? record.links.map((link, linkIndex) =>
            normalizeLink(link, fallbackGroup?.links[linkIndex] ?? { label: "連結", href: "/" }),
          )
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
    const record = (stat ?? {}) as Partial<CmsStat>;
    const fallbackStat = fallback[index] ?? fallback[0];
    return {
      label: normalizeString(record.label, fallbackStat?.label ?? "標籤"),
      value: normalizeString(record.value, fallbackStat?.value ?? "內容"),
    };
  });

  return stats.length > 0 ? stats : fallback;
}

function normalizeSeo(value: unknown, fallback: CmsSeo): CmsSeo {
  const record = (value ?? {}) as Partial<CmsSeo>;
  return {
    pageTitle: normalizeString(record.pageTitle, fallback.pageTitle),
    metaDescription: normalizeString(record.metaDescription, fallback.metaDescription),
    canonicalPath: normalizeString(record.canonicalPath, fallback.canonicalPath),
    ogTitle: normalizeString(record.ogTitle, fallback.ogTitle),
    ogDescription: normalizeString(record.ogDescription, fallback.ogDescription),
    ogImageUrl: normalizeString(record.ogImageUrl, fallback.ogImageUrl),
    robotsIndex: normalizeBoolean(record.robotsIndex, fallback.robotsIndex),
    robotsFollow: normalizeBoolean(record.robotsFollow, fallback.robotsFollow),
  };
}

function normalizeContentItem(value: unknown, fallback: CmsContentItem): CmsContentItem {
  const record = (value ?? {}) as Partial<CmsContentItem>;
  return {
    eyebrow: normalizeString(record.eyebrow, fallback.eyebrow),
    title: normalizeString(record.title, fallback.title),
    description: normalizeString(record.description, fallback.description),
    icon: normalizeString(record.icon, fallback.icon ?? ""),
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
    const record = (section ?? {}) as Partial<CmsSection>;
    const fallbackSection = fallback[index] ?? fallback[0];

    return {
      id: normalizeString(record.id, fallbackSection?.id ?? `section-${index + 1}`),
      badge: normalizeString(record.badge, fallbackSection?.badge ?? "區塊"),
      title: normalizeString(record.title, fallbackSection?.title ?? "標題"),
      description: normalizeString(record.description, fallbackSection?.description ?? "描述"),
      badgeStyle: normalizeTextStyle(
        record.badgeStyle,
        fallbackSection?.badgeStyle ?? defaultTextStyle(),
      ),
      titleStyle: normalizeTextStyle(
        record.titleStyle,
        fallbackSection?.titleStyle ?? defaultTextStyle({ fontSize: "4xl", fontWeight: "900" }),
      ),
      descriptionStyle: normalizeTextStyle(
        record.descriptionStyle,
        fallbackSection?.descriptionStyle ?? defaultTextStyle(),
      ),
      blockStyle: normalizeBlockStyle(
        record.blockStyle,
        fallbackSection?.blockStyle ?? defaultBlockStyle(),
      ),
      items: Array.isArray(record.items)
        ? record.items.map((item, itemIndex) =>
            normalizeContentItem(
              item,
              fallbackSection?.items[itemIndex] ??
                normalizeContentItem({}, {
                  eyebrow: "",
                  title: "卡片標題",
                  description: "卡片描述",
                  icon: "",
                  eyebrowStyle: defaultTextStyle(),
                  titleStyle: defaultTextStyle({ fontSize: "xl", fontWeight: "700" }),
                  descriptionStyle: defaultTextStyle(),
                  blockStyle: defaultBlockStyle(),
                }),
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
    const record = (card ?? {}) as Partial<CmsHomeFeatureCard>;
    const fallbackCard = fallback[index] ?? fallback[0];
    return {
      eyebrow: normalizeString(record.eyebrow, fallbackCard?.eyebrow ?? "特色"),
      title: normalizeString(record.title, fallbackCard?.title ?? "特色標題"),
      description: normalizeString(record.description, fallbackCard?.description ?? "特色描述"),
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
    const record = (card ?? {}) as Partial<CmsDownloadCard> & {
      imageUrl?: string;
      imageAlt?: string;
    };
    const fallbackCard = fallback[index] ?? fallback[0];
    return {
      key: (record.key ?? fallbackCard?.key ?? "consumer") as CmsDownloadCard["key"],
      eyebrow: normalizeString(record.eyebrow, fallbackCard?.eyebrow ?? "App"),
      title: normalizeString(record.title, fallbackCard?.title ?? "標題"),
      description: normalizeString(record.description, fallbackCard?.description ?? "描述"),
      audience: normalizeString(record.audience, fallbackCard?.audience ?? "受眾"),
      image: normalizeImageAsset(
        record.image ?? {
          url: record.imageUrl,
          alt: record.imageAlt,
        },
        fallbackCard?.image ?? defaultImageAsset("", "圖片"),
      ),
      iosUrl: normalizeString(record.iosUrl, fallbackCard?.iosUrl ?? "#"),
      androidUrl: normalizeString(record.androidUrl, fallbackCard?.androidUrl ?? "#"),
      highlights: normalizeStringArray(record.highlights, fallbackCard?.highlights ?? []),
      eyebrowStyle: normalizeTextStyle(record.eyebrowStyle, fallbackCard?.eyebrowStyle ?? defaultTextStyle()),
      titleStyle: normalizeTextStyle(record.titleStyle, fallbackCard?.titleStyle ?? defaultTextStyle({ fontSize: "xl", fontWeight: "700" })),
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
    const record = (step ?? {}) as Partial<CmsLaunchStep>;
    const fallbackStep = fallback[index] ?? fallback[0];
    return {
      index: normalizeString(record.index, fallbackStep?.index ?? `${index + 1}`),
      title: normalizeString(record.title, fallbackStep?.title ?? "步驟標題"),
      description: normalizeString(record.description, fallbackStep?.description ?? "步驟描述"),
      indexStyle: normalizeTextStyle(record.indexStyle, fallbackStep?.indexStyle ?? defaultTextStyle()),
      titleStyle: normalizeTextStyle(record.titleStyle, fallbackStep?.titleStyle ?? defaultTextStyle({ fontSize: "xl", fontWeight: "700" })),
      descriptionStyle: normalizeTextStyle(record.descriptionStyle, fallbackStep?.descriptionStyle ?? defaultTextStyle()),
      blockStyle: normalizeBlockStyle(record.blockStyle, fallbackStep?.blockStyle ?? defaultBlockStyle()),
    };
  });

  return steps.length > 0 ? steps : fallback;
}

function normalizeRolePage(value: unknown, fallback: CmsRolePage): CmsRolePage {
  const record = (value ?? {}) as Partial<CmsRolePage>;
  const hero = (record.hero ?? {}) as Partial<CmsRolePage["hero"]> & {
    heroImageUrl?: string;
  };

  return {
    hero: {
      badge: normalizeString(hero.badge, fallback.hero.badge),
      title: normalizeString(hero.title, fallback.hero.title),
      description: normalizeString(hero.description, fallback.hero.description),
      primaryLabel: normalizeString(hero.primaryLabel, fallback.hero.primaryLabel),
      primaryHref: normalizeString(hero.primaryHref, fallback.hero.primaryHref),
      secondaryLabel: normalizeString(hero.secondaryLabel, fallback.hero.secondaryLabel),
      secondaryHref: normalizeString(hero.secondaryHref, fallback.hero.secondaryHref),
      asideTitle: normalizeString(hero.asideTitle, fallback.hero.asideTitle),
      stats: normalizeStats(hero.stats, fallback.hero.stats),
      heroImage: normalizeImageAsset(
        hero.heroImage ?? {
          url: hero.heroImageUrl,
          alt: fallback.hero.heroImage.alt,
        },
        fallback.hero.heroImage,
      ),
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
  const record = (input ?? {}) as Partial<CmsData>;
  const site = (record.site ?? {}) as Partial<CmsData["site"]> & {
    logoUrl?: string;
  };
  const home = (record.home ?? {}) as Partial<CmsData["home"]>;
  const header = (home.header ?? {}) as Partial<CmsData["home"]["header"]>;
  const hero = (home.hero ?? {}) as Partial<CmsData["home"]["hero"]> & {
    heroImageUrl?: string;
  };
  const launchFlow = (home.launchFlow ?? {}) as Partial<CmsData["home"]["launchFlow"]>;

  return {
    site: {
      siteName: normalizeString(site.siteName, cmsDefaults.site.siteName),
      siteUrl: normalizeString(site.siteUrl, cmsDefaults.site.siteUrl),
      logo: normalizeImageAsset(
        site.logo ?? {
          url: site.logoUrl,
          alt: cmsDefaults.site.logo.alt,
        },
        cmsDefaults.site.logo,
      ),
      organizationName: normalizeString(site.organizationName, cmsDefaults.site.organizationName),
      footerTitle: normalizeString(site.footerTitle, cmsDefaults.site.footerTitle),
      footerDescription: normalizeString(site.footerDescription, cmsDefaults.site.footerDescription),
      footerTitleStyle: normalizeTextStyle(site.footerTitleStyle, cmsDefaults.site.footerTitleStyle),
      footerDescriptionStyle: normalizeTextStyle(
        site.footerDescriptionStyle,
        cmsDefaults.site.footerDescriptionStyle,
      ),
      footerLinkGroups: normalizeLinkGroups(site.footerLinkGroups, cmsDefaults.site.footerLinkGroups),
      footerStyle: normalizeBlockStyle(site.footerStyle, cmsDefaults.site.footerStyle),
      defaultSeoImageUrl: normalizeString(site.defaultSeoImageUrl, cmsDefaults.site.defaultSeoImageUrl),
    },
    home: {
      header: {
        subtitle: normalizeString(header.subtitle, cmsDefaults.home.header.subtitle),
        subtitleStyle: normalizeTextStyle(header.subtitleStyle, cmsDefaults.home.header.subtitleStyle),
        navItems: Array.isArray(header.navItems)
          ? header.navItems.map((item, index) =>
              normalizeLink(item, cmsDefaults.home.header.navItems[index] ?? { label: "導覽", href: "/" }),
            )
          : cmsDefaults.home.header.navItems,
        cta: normalizeLink(header.cta, cmsDefaults.home.header.cta),
        blockStyle: normalizeBlockStyle(header.blockStyle, cmsDefaults.home.header.blockStyle),
      },
      hero: {
        badge: normalizeString(hero.badge, cmsDefaults.home.hero.badge),
        title: normalizeString(hero.title, cmsDefaults.home.hero.title),
        subtitle: normalizeString(hero.subtitle, cmsDefaults.home.hero.subtitle),
        primaryLabel: normalizeString(hero.primaryLabel, cmsDefaults.home.hero.primaryLabel),
        primaryHref: normalizeString(hero.primaryHref, cmsDefaults.home.hero.primaryHref),
        secondaryLabel: normalizeString(hero.secondaryLabel, cmsDefaults.home.hero.secondaryLabel),
        secondaryHref: normalizeString(hero.secondaryHref, cmsDefaults.home.hero.secondaryHref),
        deviceBadge: normalizeString(hero.deviceBadge, cmsDefaults.home.hero.deviceBadge),
        secondaryBadge: normalizeString(hero.secondaryBadge, cmsDefaults.home.hero.secondaryBadge),
        heroImage: normalizeImageAsset(
          hero.heroImage ?? {
            url: hero.heroImageUrl,
            alt: cmsDefaults.home.hero.heroImage.alt,
          },
          cmsDefaults.home.hero.heroImage,
        ),
        badgeStyle: normalizeTextStyle(hero.badgeStyle, cmsDefaults.home.hero.badgeStyle),
        titleStyle: normalizeTextStyle(hero.titleStyle, cmsDefaults.home.hero.titleStyle),
        subtitleStyle: normalizeTextStyle(hero.subtitleStyle, cmsDefaults.home.hero.subtitleStyle),
        deviceBadgeStyle: normalizeTextStyle(hero.deviceBadgeStyle, cmsDefaults.home.hero.deviceBadgeStyle),
        secondaryBadgeStyle: normalizeTextStyle(
          hero.secondaryBadgeStyle,
          cmsDefaults.home.hero.secondaryBadgeStyle,
        ),
        sectionStyle: normalizeBlockStyle(hero.sectionStyle, cmsDefaults.home.hero.sectionStyle),
      },
      features: {
        cards: normalizeFeatureCards(
          (home.features as { cards?: CmsHomeFeatureCard[] })?.cards ?? home.features,
          cmsDefaults.home.features.cards,
        ),
        sectionStyle: normalizeBlockStyle(
          (home.features as Partial<CmsData["home"]["features"]>)?.sectionStyle,
          cmsDefaults.home.features.sectionStyle,
        ),
      },
      downloadCards: normalizeDownloadCards(home.downloadCards, cmsDefaults.home.downloadCards),
      launchFlow: {
        eyebrow: normalizeString(launchFlow.eyebrow, cmsDefaults.home.launchFlow.eyebrow),
        title: normalizeString(launchFlow.title, cmsDefaults.home.launchFlow.title),
        description: normalizeString(launchFlow.description, cmsDefaults.home.launchFlow.description),
        eyebrowStyle: normalizeTextStyle(launchFlow.eyebrowStyle, cmsDefaults.home.launchFlow.eyebrowStyle),
        titleStyle: normalizeTextStyle(launchFlow.titleStyle, cmsDefaults.home.launchFlow.titleStyle),
        descriptionStyle: normalizeTextStyle(
          launchFlow.descriptionStyle,
          cmsDefaults.home.launchFlow.descriptionStyle,
        ),
        leftBlockStyle: normalizeBlockStyle(
          launchFlow.leftBlockStyle,
          cmsDefaults.home.launchFlow.leftBlockStyle,
        ),
        rightBlockStyle: normalizeBlockStyle(
          launchFlow.rightBlockStyle,
          cmsDefaults.home.launchFlow.rightBlockStyle,
        ),
        steps: normalizeLaunchSteps(
          launchFlow.steps ?? (home.launchFlow as unknown),
          cmsDefaults.home.launchFlow.steps,
        ),
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

  const blobUrl = (await getCmsBlobUrl()) ?? (await seedCmsDataIfMissing());
  const response = await fetch(blobUrl, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch CMS blob: ${response.status}`);
  }

  return normalizeCmsData(await response.json());
}

export async function saveCmsData(data: CmsData) {
  const normalized = normalizeCmsData(data);
  const result = await put(CMS_CONTENT_PATH, JSON.stringify(normalized, null, 2), {
    access: "public",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json; charset=utf-8",
  });

  return {
    data: normalized,
    url: result.url,
  };
}
