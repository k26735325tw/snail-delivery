import { list, put } from "@vercel/blob";
import { unstable_noStore as noStore } from "next/cache";

import { cmsDefaults } from "@/lib/cms-defaults";
import type { CmsData, CmsDownloadCard, CmsRolePage, CmsSection } from "@/lib/cms-schema";

const CMS_CONTENT_PATH = "cms/site-content.json";

function normalizeString(value: unknown, fallback: string) {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : fallback;
}

function normalizeStringArray(value: unknown, fallback: string[]) {
  if (!Array.isArray(value)) {
    return fallback;
  }

  const items = value
    .filter((item): item is string => typeof item === "string" && item.trim().length > 0)
    .map((item) => item.trim());

  return items.length > 0 ? items : fallback;
}

function normalizeSections(value: unknown, fallback: CmsSection[]) {
  if (!Array.isArray(value)) {
    return fallback;
  }

  const sections = value
    .map((section, index) => {
      const record = (section ?? {}) as Partial<CmsSection>;
      const fallbackSection = fallback[index] ?? fallback[0];

      return {
        id: normalizeString(record.id, fallbackSection?.id ?? `section-${index + 1}`),
        badge: normalizeString(record.badge, fallbackSection?.badge ?? "Section"),
        title: normalizeString(record.title, fallbackSection?.title ?? "Title"),
        description: normalizeString(
          record.description,
          fallbackSection?.description ?? "Description",
        ),
        items: Array.isArray(record.items)
          ? record.items
              .map((item, itemIndex) => {
                const itemRecord = (item ?? {}) as CmsSection["items"][number];
                const fallbackItem = fallbackSection?.items[itemIndex];

                return {
                  eyebrow: normalizeString(
                    itemRecord.eyebrow,
                    fallbackItem?.eyebrow ?? "",
                  ),
                  title: normalizeString(itemRecord.title, fallbackItem?.title ?? "Item title"),
                  description: normalizeString(
                    itemRecord.description,
                    fallbackItem?.description ?? "Item description",
                  ),
                  icon: normalizeString(itemRecord.icon, fallbackItem?.icon ?? ""),
                };
              })
              .filter((item) => item.title.length > 0)
          : fallbackSection?.items ?? [],
      };
    })
    .filter((section) => section.title.length > 0);

  return sections.length > 0 ? sections : fallback;
}

function normalizeRolePage(value: unknown, fallback: CmsRolePage): CmsRolePage {
  const record = (value ?? {}) as Partial<CmsRolePage>;
  const hero = (record.hero ?? {}) as Partial<CmsRolePage["hero"]>;

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
      stats: Array.isArray(hero.stats)
        ? hero.stats.map((stat, index) => {
            const statRecord = (stat ?? {}) as CmsRolePage["hero"]["stats"][number];
            const fallbackStat = fallback.hero.stats[index] ?? fallback.hero.stats[0];

            return {
              label: normalizeString(statRecord.label, fallbackStat?.label ?? "Label"),
              value: normalizeString(statRecord.value, fallbackStat?.value ?? "Value"),
            };
          })
        : fallback.hero.stats,
      heroImageUrl: normalizeString(hero.heroImageUrl, fallback.hero.heroImageUrl ?? ""),
    },
    sections: normalizeSections(record.sections, fallback.sections),
  };
}

function normalizeDownloadCards(value: unknown, fallback: CmsDownloadCard[]) {
  if (!Array.isArray(value)) {
    return fallback;
  }

  const cards = value.map((card, index) => {
    const record = (card ?? {}) as Partial<CmsDownloadCard>;
    const fallbackCard = fallback[index] ?? fallback[0];

    return {
      key: (record.key ?? fallbackCard?.key ?? "consumer") as CmsDownloadCard["key"],
      eyebrow: normalizeString(record.eyebrow, fallbackCard?.eyebrow ?? "App"),
      title: normalizeString(record.title, fallbackCard?.title ?? "Title"),
      description: normalizeString(
        record.description,
        fallbackCard?.description ?? "Description",
      ),
      audience: normalizeString(record.audience, fallbackCard?.audience ?? "Audience"),
      imageUrl: normalizeString(record.imageUrl, fallbackCard?.imageUrl ?? ""),
      imageAlt: normalizeString(record.imageAlt, fallbackCard?.imageAlt ?? "Image"),
      iosUrl: normalizeString(record.iosUrl, fallbackCard?.iosUrl ?? "#"),
      androidUrl: normalizeString(record.androidUrl, fallbackCard?.androidUrl ?? "#"),
      highlights: normalizeStringArray(record.highlights, fallbackCard?.highlights ?? []),
    };
  });

  return cards.length > 0 ? cards : fallback;
}

function normalizeLaunchFlow(value: unknown, fallback: CmsData["home"]["launchFlow"]) {
  if (!Array.isArray(value)) {
    return fallback;
  }

  const steps = value.map((step, index) => {
    const record = (step ?? {}) as Partial<CmsData["home"]["launchFlow"][number]>;
    const fallbackStep = fallback[index] ?? fallback[0];

    return {
      index: normalizeString(record.index, fallbackStep?.index ?? `${index + 1}`),
      title: normalizeString(record.title, fallbackStep?.title ?? "Step title"),
      description: normalizeString(
        record.description,
        fallbackStep?.description ?? "Step description",
      ),
    };
  });

  return steps.length > 0 ? steps : fallback;
}

export function normalizeCmsData(input: unknown): CmsData {
  const record = (input ?? {}) as Partial<CmsData>;
  const site = (record.site ?? {}) as Partial<CmsData["site"]>;
  const home = (record.home ?? {}) as Partial<CmsData["home"]>;
  const hero = (home.hero ?? {}) as Partial<CmsData["home"]["hero"]>;

  return {
    site: {
      siteName: normalizeString(site.siteName, cmsDefaults.site.siteName),
      logoUrl: normalizeString(site.logoUrl, cmsDefaults.site.logoUrl),
      footerTitle: normalizeString(site.footerTitle, cmsDefaults.site.footerTitle),
      footerDescription: normalizeString(
        site.footerDescription,
        cmsDefaults.site.footerDescription,
      ),
    },
    home: {
      hero: {
        badge: normalizeString(hero.badge, cmsDefaults.home.hero.badge ?? ""),
        title: normalizeString(hero.title, cmsDefaults.home.hero.title),
        subtitle: normalizeString(hero.subtitle, cmsDefaults.home.hero.subtitle),
        primaryLabel: normalizeString(hero.primaryLabel, cmsDefaults.home.hero.primaryLabel),
        primaryHref: normalizeString(hero.primaryHref, cmsDefaults.home.hero.primaryHref),
        secondaryLabel: normalizeString(
          hero.secondaryLabel,
          cmsDefaults.home.hero.secondaryLabel,
        ),
        secondaryHref: normalizeString(
          hero.secondaryHref,
          cmsDefaults.home.hero.secondaryHref,
        ),
        heroImageUrl: normalizeString(
          hero.heroImageUrl,
          cmsDefaults.home.hero.heroImageUrl ?? "",
        ),
      },
      features: normalizeStringArray(home.features, cmsDefaults.home.features),
      downloadCards: normalizeDownloadCards(home.downloadCards, cmsDefaults.home.downloadCards),
      launchFlow: normalizeLaunchFlow(home.launchFlow, cmsDefaults.home.launchFlow),
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
    contentType: "application/json; charset=utf-8",
  });

  return {
    data: normalized,
    url: result.url,
  };
}

