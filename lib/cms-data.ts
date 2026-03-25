import type {
  CmsBlockStyle,
  CmsContentItem,
  CmsData,
  CmsDownloadCard,
  CmsFlexBlock,
  CmsHomeFeatureCard,
  CmsLaunchStep,
  CmsLinkGroup,
  CmsPartnerItem,
} from "@/lib/cms-schema";
import { cmsDefaults } from "@/lib/cms-defaults";
import { defaultBlockStyle, defaultImageAsset, defaultTextStyle } from "@/lib/cms-style";

type JsonRecord = Record<string, unknown>;

export type CmsArrayCollectionPath =
  | "site.footerLinkGroups"
  | "home.features.cards"
  | "home.downloadCards"
  | "home.launchFlow.steps"
  | "home.flexSection.blocks"
  | "home.partnersSection.items"
  | `${"consumer" | "courier" | "merchant"}.sections.${number}.items`;

function isRecord(value: unknown): value is JsonRecord {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

export function cloneValue<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

export function cleanStoredString(value: string) {
  return value.replace(/^\uFEFF/, "").replace(/\u0000/g, "");
}

export function cleanUtf8Value<T>(value: T): T {
  if (typeof value === "string") {
    return cleanStoredString(value) as T;
  }

  if (Array.isArray(value)) {
    return value.map((item) => cleanUtf8Value(item)) as T;
  }

  if (isRecord(value)) {
    const next: JsonRecord = {};

    for (const [key, entry] of Object.entries(value)) {
      next[key] = cleanUtf8Value(entry);
    }

    return next as T;
  }

  return value;
}

function slugify(value: string) {
  const normalized = value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\w\s-]+/g, " ")
    .trim()
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return normalized || "item";
}

export function createCmsId(prefix: string, seed?: string) {
  const base = seed ? slugify(seed).slice(0, 40) : "item";
  const token = Math.random().toString(36).slice(2, 8);
  return `${prefix}-${base}-${token}`;
}

function ensureItemId<T extends { id?: string }>(item: T, prefix: string, seed: string) {
  if (typeof item.id === "string" && item.id.trim()) {
    return item;
  }

  return {
    ...item,
    id: createCmsId(prefix, seed),
  };
}

function ensureFooterLinkGroups(groups: CmsLinkGroup[]) {
  return groups.map((group, index) =>
    ensureItemId(group, "footer-group", `${group.title || "group"}-${index + 1}`),
  );
}

function ensureFeatureCards(cards: CmsHomeFeatureCard[]) {
  return cards.map((card, index) =>
    ensureItemId(card, "feature-card", `${card.title || card.eyebrow || "feature"}-${index + 1}`),
  );
}

function ensureDownloadCards(cards: CmsDownloadCard[]) {
  return cards.map((card, index) =>
    ensureItemId(card, "download-card", `${card.key || card.title || "download"}-${index + 1}`),
  );
}

function ensureLaunchSteps(steps: CmsLaunchStep[]) {
  return steps.map((step, index) =>
    ensureItemId(step, "launch-step", `${step.title || step.index || "step"}-${index + 1}`),
  );
}

function ensurePartnerItems(items: CmsPartnerItem[]) {
  return items.map((item, index) =>
    ensureItemId(item, "partner-card", `${item.name || item.contactInfo || "partner"}-${index + 1}`),
  );
}

function ensureFlexBlocks(blocks: CmsFlexBlock[]) {
  return blocks.map((block, index) =>
    ensureItemId(block, "flex-block", `${block.type || "block"}-${block.heading || block.caption || index + 1}`),
  );
}

function ensureContentItems(items: CmsContentItem[], pageKey: "consumer" | "courier" | "merchant", sectionId: string) {
  return items.map((item, index) =>
    ensureItemId(item, `${pageKey}-card`, `${sectionId}-${item.title || item.eyebrow || "item"}-${index + 1}`),
  );
}

export function ensureCmsStableIds(data: CmsData): CmsData {
  return {
    ...data,
    site: {
      ...data.site,
      footerLinkGroups: ensureFooterLinkGroups(data.site.footerLinkGroups),
    },
    home: {
      ...data.home,
      features: {
        ...data.home.features,
        cards: ensureFeatureCards(data.home.features.cards),
      },
      downloadCards: ensureDownloadCards(data.home.downloadCards),
      launchFlow: {
        ...data.home.launchFlow,
        steps: ensureLaunchSteps(data.home.launchFlow.steps),
      },
      flexSection: {
        ...data.home.flexSection,
        blocks: ensureFlexBlocks(data.home.flexSection.blocks),
      },
      partnersSection: {
        ...data.home.partnersSection,
        items: ensurePartnerItems(data.home.partnersSection.items),
      },
    },
    consumer: {
      ...data.consumer,
      sections: data.consumer.sections.map((section) => ({
        ...section,
        items: ensureContentItems(section.items, "consumer", section.id || "section"),
      })),
    },
    courier: {
      ...data.courier,
      sections: data.courier.sections.map((section) => ({
        ...section,
        items: ensureContentItems(section.items, "courier", section.id || "section"),
      })),
    },
    merchant: {
      ...data.merchant,
      sections: data.merchant.sections.map((section) => ({
        ...section,
        items: ensureContentItems(section.items, "merchant", section.id || "section"),
      })),
    },
  };
}

function emptyFooterLinkGroup(): CmsLinkGroup {
  return {
    id: createCmsId("footer-group", "group"),
    title: "新連結群組",
    links: [{ label: "新連結", href: "/" }],
  };
}

function emptyFeatureCard(): CmsHomeFeatureCard {
  return {
    id: createCmsId("feature-card", "feature"),
    eyebrow: "新特色",
    title: "新特色卡片",
    description: "請填寫這張卡片的說明。",
    eyebrowStyle: defaultTextStyle({ fontSize: "xs", fontWeight: "700", textColor: "brand.blueDeep" }),
    titleStyle: defaultTextStyle({ fontSize: "xl", fontWeight: "700", textColor: "brand.ink", lineHeight: "tight" }),
    descriptionStyle: defaultTextStyle({ fontSize: "base", fontWeight: "400", textColor: "#55627c", lineHeight: "relaxed" }),
    blockStyle: defaultBlockStyle({ backgroundColor: "#ffffffd9", borderColor: "#dce9ff", borderRadius: "xl", paddingX: "6", paddingY: "6", shadow: "md" }),
  };
}

function emptyDownloadCard(): CmsDownloadCard {
  return {
    id: createCmsId("download-card", "download"),
    key: "download-card",
    eyebrow: "新下載卡",
    title: "新 App",
    description: "請填寫下載卡說明。",
    audience: "請填寫受眾",
    image: defaultImageAsset("", "請填寫圖片 alt", { desktopHeight: 256, mobileHeight: 224 }),
    iosUrl: "",
    androidUrl: "",
    highlights: ["新亮點"],
    eyebrowStyle: defaultTextStyle({ fontSize: "xs", fontWeight: "700", textColor: "brand.blueDeep" }),
    titleStyle: defaultTextStyle({ fontSize: "2xl", fontWeight: "900", textColor: "brand.ink", lineHeight: "tight" }),
    audienceStyle: defaultTextStyle({ fontSize: "sm", fontWeight: "700", textColor: "brand.blueDeep" }),
    descriptionStyle: defaultTextStyle({ fontSize: "base", fontWeight: "400", textColor: "#44536d", lineHeight: "relaxed" }),
    blockStyle: defaultBlockStyle({ backgroundColor: "#fffffff0", borderColor: "#dce9ff", borderRadius: "xl", paddingX: "6", paddingY: "6", shadow: "md" }),
  };
}

function emptyLaunchStep(stepCount = 0): CmsLaunchStep {
  const index = String(stepCount + 1).padStart(2, "0");

  return {
    id: createCmsId("launch-step", index),
    index,
    title: "新步驟",
    description: "請填寫這個步驟的說明。",
    indexStyle: defaultTextStyle({ fontSize: "sm", fontWeight: "700", textColor: "brand.blueDeep" }),
    titleStyle: defaultTextStyle({ fontSize: "xl", fontWeight: "900", textColor: "brand.ink", lineHeight: "tight" }),
    descriptionStyle: defaultTextStyle({ fontSize: "sm", fontWeight: "400", textColor: "#55627c", lineHeight: "relaxed" }),
    blockStyle: defaultBlockStyle({ backgroundColor: "#fffffff0", borderColor: "#dce9ff", borderRadius: "xl", paddingX: "6", paddingY: "6", shadow: "md" }),
  };
}

function emptyPartnerItem(): CmsPartnerItem {
  return {
    id: createCmsId("partner-card", "partner"),
    image: defaultImageAsset("", "請填寫合作廠商圖片 alt", { desktopHeight: 220, mobileHeight: 220 }),
    name: "新合作廠商",
    nameUrl: "",
    contactInfo: "請填寫聯絡資訊",
    contactUrl: "",
    serviceScope: "請填寫服務範圍",
  };
}

function emptyFlexBlock(): CmsFlexBlock {
  return {
    id: createCmsId("flex-block", "block"),
    type: "text",
    heading: "新自訂內容",
    body: "請填寫這個 block 的內容。",
    mediaUrl: "",
    mediaAlt: "",
    caption: "",
    linkUrl: "",
  };
}

function emptyRoleCard(prefix: "consumer" | "courier" | "merchant"): CmsContentItem {
  return {
    id: createCmsId(`${prefix}-card`, "card"),
    eyebrow: "New",
    title: "新卡片",
    description: "請填寫這張卡片的說明。",
    icon: "新",
    eyebrowStyle: defaultTextStyle({ fontSize: "xs", fontWeight: "700", textColor: "brand.blueDeep" }),
    titleStyle: defaultTextStyle({ fontSize: "xl", fontWeight: "700", textColor: "brand.ink", lineHeight: "tight" }),
    descriptionStyle: defaultTextStyle({ fontSize: "base", fontWeight: "400", textColor: "#55627c", lineHeight: "relaxed" }),
    blockStyle: defaultBlockStyle({ backgroundColor: "#fffffff0", borderColor: "#dce9ff", borderRadius: "xl", paddingX: "6", paddingY: "6", shadow: "md" }),
  };
}

export function createArrayItemTemplate(collectionPath: CmsArrayCollectionPath, currentData: CmsData) {
  if (collectionPath === "site.footerLinkGroups") {
    return emptyFooterLinkGroup();
  }

  if (collectionPath === "home.features.cards") {
    return emptyFeatureCard();
  }

  if (collectionPath === "home.downloadCards") {
    return emptyDownloadCard();
  }

  if (collectionPath === "home.launchFlow.steps") {
    return emptyLaunchStep(currentData.home.launchFlow.steps.length);
  }

  if (collectionPath === "home.flexSection.blocks") {
    return emptyFlexBlock();
  }

  if (collectionPath === "home.partnersSection.items") {
    return emptyPartnerItem();
  }

  const roleMatch = collectionPath.match(/^(consumer|courier|merchant)\.sections\.\d+\.items$/);
  if (roleMatch) {
    return emptyRoleCard(roleMatch[1] as "consumer" | "courier" | "merchant");
  }

  return null;
}

export function cloneArrayItemWithFreshIds<T>(item: T): T {
  const cloned = cloneValue(item);

  if (!isRecord(cloned)) {
    return cloned;
  }

  const mutable = cloned as JsonRecord & { id?: string };

  if (typeof mutable.id === "string") {
    mutable.id = createCmsId(mutable.id.split("-")[0] || "item", mutable.id);
  }

  return mutable as T;
}

export function getImageUploadKey(imagePath: string, itemId?: string) {
  if (imagePath === "site.logo") {
    return "shared/logo";
  }

  if (imagePath === "home.hero.heroImage") {
    return "home/hero";
  }

  if (imagePath === "consumer.hero.heroImage") {
    return "consumer/hero";
  }

  if (imagePath === "courier.hero.heroImage") {
    return "courier/hero";
  }

  if (imagePath === "merchant.hero.heroImage") {
    return "merchant/hero";
  }

  if (imagePath.startsWith("home.downloadCards.") && itemId) {
    return `home/download-cards/${itemId}`;
  }

  return imagePath.replace(/\.(\d+)/g, "/$1").replace(/\./g, "/").replace(/\/url$/, "");
}

export function mergeMissingFields<T>(current: unknown, fallback: T): T {
  if (Array.isArray(fallback)) {
    if (!Array.isArray(current)) {
      return cloneValue(fallback);
    }

    if (fallback.length === 0) {
      return cleanUtf8Value(current) as T;
    }

    const fallbackItem = fallback[0];
    return current.map((item, index) => mergeMissingFields(item, fallback[index] ?? fallbackItem)) as T;
  }

  if (typeof fallback === "string") {
    return (typeof current === "string" ? cleanStoredString(current) : fallback) as T;
  }

  if (typeof fallback === "number") {
    return (typeof current === "number" ? current : fallback) as T;
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

  for (const key of Object.keys(record)) {
    if (!(key in result)) {
      result[key] = cleanUtf8Value(record[key]);
    }
  }

  return result as T;
}

export function applyLegacyAliases(input: unknown) {
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

export function normalizeCmsData(input: unknown): CmsData {
  const merged = mergeMissingFields(cleanUtf8Value(applyLegacyAliases(input)), cmsDefaults);
  return ensureCmsStableIds(merged as CmsData);
}

export function getDefaultBlockStyle() {
  return defaultBlockStyle();
}

export function getDefaultTextStyle() {
  return defaultTextStyle();
}

export function getDefaultCardBlockStyle(): CmsBlockStyle {
  return defaultBlockStyle({ backgroundColor: "#fffffff0", borderColor: "#dce9ff", borderRadius: "xl", paddingX: "6", paddingY: "6", shadow: "md" });
}
