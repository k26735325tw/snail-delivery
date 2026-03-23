"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import { EditableBlock, EditableImageFrame, EditableLink, EditableText } from "@/components/cms-inline-edit";
import { useCmsVisualEditor } from "@/components/cms-visual-context";
import { Footer } from "@/components/footer";
import { SiteHeader } from "@/components/site-header";
import type { CmsData, CmsDownloadCard } from "@/lib/cms-schema";
import { getBlockStyle, getImageHeight, getImageStyle, getTextStyle } from "@/lib/cms-style";
import { detectDevice } from "@/utils/device";

type SiteHomeProps = {
  site: CmsData;
  embedded?: boolean;
  previewViewport?: "desktop" | "mobile";
  focusSection?: "header" | "hero" | "features" | "launch-flow" | "footer" | null;
  activeCardKey?: string | null;
  activeCardIndex?: number | null;
};

const activeCardClass = "bg-[rgba(255,248,196,0.72)] ring-2 ring-[#1b6fff]/45 shadow-[0_24px_70px_rgba(27,111,255,0.16)] brightness-[1.02]";

function getDeviceLabel(site: CmsData) {
  const device = detectDevice();

  if (device === "ios") {
    return "目前裝置：iPhone / iPad";
  }

  if (device === "android") {
    return "目前裝置：Android";
  }

  return site.home.hero.deviceBadge;
}

export function SiteHome({
  site,
  embedded = false,
  previewViewport = "desktop",
  focusSection = null,
  activeCardKey = null,
  activeCardIndex = null,
}: SiteHomeProps) {
  const editor = useCmsVisualEditor();
  const [deviceChoice, setDeviceChoice] = useState<{
    roleTitle: string;
    iosUrl: string;
    androidUrl: string;
  } | null>(null);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
  const isMobilePreview = embedded && previewViewport === "mobile";

  useEffect(() => {
    if (!focusSection) {
      return;
    }

    const target = sectionRefs.current[focusSection];
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [focusSection]);

  function handleDownload(card: CmsDownloadCard) {
    const device = detectDevice();

    if (device === "ios") {
      window.location.href = card.iosUrl;
      return;
    }

    if (device === "android") {
      window.location.href = card.androidUrl;
      return;
    }

    setDeviceChoice({
      roleTitle: card.title,
      iosUrl: card.iosUrl,
      androidUrl: card.androidUrl,
    });
  }

  const featureColumnClass = site.home.features.cards.length > 2 ? "lg:grid-cols-3" : "lg:grid-cols-2";

  return (
    <main className="min-h-screen pb-10">
      <div ref={(node) => { sectionRefs.current.header = node; }}>
        <SiteHeader site={site} embedded={embedded} highlighted={focusSection === "header"} />
      </div>

      <div className="shell mt-6 space-y-8">
        <EditableBlock
          selection={{
            id: "home.hero.block",
            kind: "block",
            label: "首頁 Hero 區塊",
            stylePath: "home.hero.sectionStyle",
          }}
          className={`relative overflow-hidden border transition-shadow ${focusSection === "hero" ? "ring-4 ring-blue/25 shadow-[0_24px_80px_rgba(27,111,255,0.18)]" : ""}`}
          style={getBlockStyle(site.home.hero.sectionStyle)}
        >
          <section
            ref={(node) => { sectionRefs.current.hero = node; }}
            data-preview-section="hero"
          >
            <div className="absolute -left-24 top-0 h-72 w-72 rounded-full bg-[#ffd84a]/30 blur-3xl" />
            <div className="absolute right-0 top-12 h-72 w-72 rounded-full bg-[#1b6fff]/18 blur-3xl" />
            <div className="absolute inset-0 bg-[linear-gradient(rgba(11,79,212,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(11,79,212,0.04)_1px,transparent_1px)] bg-[size:34px_34px] [mask-image:linear-gradient(180deg,rgba(0,0,0,0.72),transparent)]" />

            <div className="relative grid gap-8 xl:grid-cols-[minmax(0,1.02fr)_minmax(320px,0.98fr)] xl:items-start">
              <div className="min-w-0">
                <div className="inline-flex max-w-full items-center gap-4 rounded-[2rem] border border-[#0e1d38]/8 bg-white/84 px-4 py-3 shadow-[0_18px_40px_rgba(14,29,56,0.06)]">
                  <EditableImageFrame
                    selection={{
                      id: "site.logo.hero",
                      kind: "image",
                      label: "首頁 Logo",
                      imagePath: "site.logo",
                      uploadKey: "shared/logo",
                    }}
                    className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-[1.5rem] bg-[#0b4fd4] shadow-[0_20px_44px_rgba(11,79,212,0.32)]"
                  >
                    <Image
                      src={site.site.logo.url}
                      alt={site.site.logo.alt}
                      width={88}
                      height={88}
                      unoptimized
                      className="h-full w-full"
                      style={getImageStyle(site.site.logo)}
                    />
                  </EditableImageFrame>
                  <div className="min-w-0">
                    <EditableText
                      as="p"
                      value={site.site.siteName}
                      className="truncate font-[var(--font-manrope)] text-xs font-extrabold uppercase tracking-[0.34em] text-[#0b4fd4]"
                      selection={{
                        id: "site.siteName.hero",
                        kind: "text",
                        label: "首頁品牌名稱",
                        fieldPath: "site.siteName",
                      }}
                    />
                    <EditableText
                      as="p"
                      value={site.home.hero.badge}
                      className="break-words"
                      style={getTextStyle(site.home.hero.badgeStyle)}
                      selection={{
                        id: "home.hero.badge",
                        kind: "text",
                        label: "Hero Badge",
                        fieldPath: "home.hero.badge",
                        stylePath: "home.hero.badgeStyle",
                      }}
                    />
                  </div>
                </div>

                <EditableText
                  as="h1"
                  value={site.home.hero.title}
                  className="mt-8 max-w-4xl break-words font-[var(--font-manrope)] tracking-[-0.08em]"
                  style={getTextStyle(site.home.hero.titleStyle)}
                  multiline
                  selection={{
                    id: "home.hero.title",
                    kind: "text",
                    label: "Hero 主標題",
                    fieldPath: "home.hero.title",
                    stylePath: "home.hero.titleStyle",
                    multiline: true,
                  }}
                />
                <EditableText
                  as="p"
                  value={site.home.hero.subtitle}
                  className="mt-5 max-w-3xl break-words"
                  style={getTextStyle(site.home.hero.subtitleStyle)}
                  multiline
                  selection={{
                    id: "home.hero.subtitle",
                    kind: "text",
                    label: "Hero 副標題",
                    fieldPath: "home.hero.subtitle",
                    stylePath: "home.hero.subtitleStyle",
                    multiline: true,
                  }}
                />

                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <EditableText
                    as="span"
                    value={editor ? site.home.hero.deviceBadge : getDeviceLabel(site)}
                    className="rounded-full bg-[#0e1d38] px-4 py-2"
                    style={getTextStyle(site.home.hero.deviceBadgeStyle)}
                    selection={{
                      id: "home.hero.deviceBadge",
                      kind: "text",
                      label: "Hero 裝置 Badge",
                      fieldPath: "home.hero.deviceBadge",
                      stylePath: "home.hero.deviceBadgeStyle",
                    }}
                  />
                  <EditableText
                    as="span"
                    value={site.home.hero.secondaryBadge}
                    className="rounded-full bg-[#ffd84a] px-4 py-2"
                    style={getTextStyle(site.home.hero.secondaryBadgeStyle)}
                    selection={{
                      id: "home.hero.secondaryBadge",
                      kind: "text",
                      label: "Hero 第二 Badge",
                      fieldPath: "home.hero.secondaryBadge",
                      stylePath: "home.hero.secondaryBadgeStyle",
                    }}
                  />
                </div>

                <div className="mt-8 flex flex-wrap gap-3">
                  <EditableLink
                    href={site.home.hero.primaryHref}
                    value={site.home.hero.primaryLabel}
                    className="inline-flex items-center justify-center rounded-full bg-[#0e1d38] px-6 py-3.5 text-base font-black text-white transition hover:bg-[#16325f]"
                    selection={{
                      id: "home.hero.primary",
                      kind: "link",
                      label: "Hero 主按鈕",
                      fieldPath: "home.hero.primaryLabel",
                      hrefPath: "home.hero.primaryHref",
                    }}
                  />
                  <EditableLink
                    href={site.home.hero.secondaryHref}
                    value={site.home.hero.secondaryLabel}
                    className="inline-flex items-center justify-center rounded-full border border-[#0e1d38]/12 bg-white/84 px-6 py-3.5 text-base font-black text-[#0e1d38] transition hover:border-[#0b4fd4] hover:text-[#0b4fd4]"
                    selection={{
                      id: "home.hero.secondary",
                      kind: "link",
                      label: "Hero 次按鈕",
                      fieldPath: "home.hero.secondaryLabel",
                      hrefPath: "home.hero.secondaryHref",
                    }}
                  />
                </div>
              </div>

              <div ref={(node) => { sectionRefs.current.features = node; }} className={`grid gap-4 transition-shadow ${focusSection === "features" ? "rounded-[2rem] ring-4 ring-blue/25" : ""}`} data-preview-section="features">
                {site.home.hero.heroImage.url ? (
                  <EditableImageFrame
                    selection={{
                      id: "home.hero.image",
                      kind: "image",
                      label: "首頁 Hero 圖片",
                      imagePath: "home.hero.heroImage",
                      uploadKey: "home/hero",
                    }}
                    className="overflow-hidden rounded-[2rem] border border-white/80 bg-white/84 shadow-[0_24px_70px_rgba(14,29,56,0.12)]"
                  >
                    <div className="relative w-full">
                      <Image
                        src={site.home.hero.heroImage.url}
                        alt={site.home.hero.heroImage.alt}
                        width={1600}
                        height={isMobilePreview ? site.home.hero.heroImage.mobileHeight : site.home.hero.heroImage.desktopHeight}
                        unoptimized
                        className="w-full"
                        style={{
                          ...getImageStyle(site.home.hero.heroImage, isMobilePreview),
                          height: getImageHeight(site.home.hero.heroImage, isMobilePreview),
                        }}
                      />
                    </div>
                  </EditableImageFrame>
                ) : null}

                <EditableBlock
                  selection={{
                    id: "home.features.block",
                    kind: "block",
                    label: "首頁 Features 區塊",
                    stylePath: "home.features.sectionStyle",
                    collectionPath: "home.features.cards",
                  }}
                  className={`grid gap-4 ${featureColumnClass}`}
                  style={getBlockStyle(site.home.features.sectionStyle)}
                >
                  {site.home.features.cards.map((feature, index) => (
                    <EditableBlock
                      key={`${feature.eyebrow}-${feature.title}`}
                      selection={{
                        id: `home.features.cards.${feature.id}.block`,
                        kind: "block",
                        label: `Feature 卡片 ${index + 1}`,
                        stylePath: `home.features.cards.${index}.blockStyle`,
                        collectionPath: "home.features.cards",
                        itemPath: `home.features.cards.${index}`,
                        itemId: feature.id,
                        itemIndex: index,
                      }}
                      className={`gradient-border flex h-full min-h-[220px] flex-col justify-between border transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(14,29,56,0.14)] ${activeCardKey === "feature-card" && activeCardIndex === index ? activeCardClass : ""}`}
                      style={getBlockStyle(feature.blockStyle)}
                    >
                      <article data-preview-card-key="feature-card" data-preview-card-index={index}>
                        <EditableText
                          as="p"
                          value={feature.eyebrow}
                          className="font-[var(--font-manrope)] uppercase tracking-[0.24em]"
                          style={getTextStyle(feature.eyebrowStyle)}
                          selection={{
                            id: `home.features.cards.${feature.id}.eyebrow`,
                            kind: "text",
                            label: `Feature 卡片 ${index + 1} Eyebrow`,
                            fieldPath: `home.features.cards.${index}.eyebrow`,
                            stylePath: `home.features.cards.${index}.eyebrowStyle`,
                            collectionPath: "home.features.cards",
                            itemPath: `home.features.cards.${index}`,
                            itemId: feature.id,
                            itemIndex: index,
                          }}
                        />
                        <EditableText
                          as="h2"
                          value={feature.title}
                          className="mt-3 break-words"
                          style={getTextStyle(feature.titleStyle)}
                          selection={{
                            id: `home.features.cards.${feature.id}.title`,
                            kind: "text",
                            label: `Feature 卡片 ${index + 1} 標題`,
                            fieldPath: `home.features.cards.${index}.title`,
                            stylePath: `home.features.cards.${index}.titleStyle`,
                            collectionPath: "home.features.cards",
                            itemPath: `home.features.cards.${index}`,
                            itemId: feature.id,
                            itemIndex: index,
                          }}
                        />
                        <EditableText
                          as="p"
                          value={feature.description}
                          className="mt-3 break-words"
                          style={getTextStyle(feature.descriptionStyle)}
                          multiline
                          selection={{
                            id: `home.features.cards.${feature.id}.description`,
                            kind: "text",
                            label: `Feature 卡片 ${index + 1} 說明`,
                            fieldPath: `home.features.cards.${index}.description`,
                            stylePath: `home.features.cards.${index}.descriptionStyle`,
                            multiline: true,
                            collectionPath: "home.features.cards",
                            itemPath: `home.features.cards.${index}`,
                            itemId: feature.id,
                            itemIndex: index,
                          }}
                        />
                      </article>
                    </EditableBlock>
                  ))}
                </EditableBlock>
              </div>
            </div>
          </section>
        </EditableBlock>

        <EditableBlock
          selection={{
            id: "home.downloadCards.collection",
            kind: "block",
            label: "首頁下載卡區塊",
            collectionPath: "home.downloadCards",
          }}
          className="grid gap-6 lg:grid-cols-3"
        >
          {site.home.downloadCards.map((card, index) => (
            <EditableBlock
              key={card.id}
              selection={{
                id: `home.downloadCards.${card.id}.block`,
                kind: "block",
                label: `下載卡 ${index + 1}`,
                stylePath: `home.downloadCards.${index}.blockStyle`,
                collectionPath: "home.downloadCards",
                itemPath: `home.downloadCards.${index}`,
                itemId: card.id,
                itemIndex: index,
              }}
              className="group gradient-border relative overflow-hidden border transition duration-300 hover:-translate-y-1 hover:shadow-[0_26px_80px_rgba(14,29,56,0.16)]"
              style={getBlockStyle(card.blockStyle)}
            >
              <div className="absolute inset-x-6 top-0 h-24 rounded-b-[2rem] bg-gradient-to-b from-[#ffd84a]/45 to-transparent" />
              <div className="relative flex h-full flex-col">
                <EditableImageFrame
                  selection={{
                    id: `home.downloadCards.${card.id}.image`,
                    kind: "image",
                    label: `下載卡 ${index + 1} 圖片`,
                    imagePath: `home.downloadCards.${index}.image`,
                    uploadKey: `home/download-cards/${card.id}`,
                    collectionPath: "home.downloadCards",
                    itemPath: `home.downloadCards.${index}`,
                    itemId: card.id,
                    itemIndex: index,
                  }}
                  className="overflow-hidden rounded-[1.6rem] bg-[#eef5ff]"
                >
                  <div className="relative w-full">
                    <Image
                      src={card.image.url}
                      alt={card.image.alt}
                      width={1200}
                      height={isMobilePreview ? card.image.mobileHeight : card.image.desktopHeight}
                      unoptimized
                      className="w-full transition duration-500 group-hover:scale-[1.03]"
                      style={{
                        ...getImageStyle(card.image, isMobilePreview),
                        height: getImageHeight(card.image, isMobilePreview),
                      }}
                    />
                  </div>
                </EditableImageFrame>

                <div className="mt-5 flex flex-1 flex-col">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <EditableText
                        as="p"
                        value={card.eyebrow}
                        className="uppercase tracking-[0.26em]"
                        style={getTextStyle(card.eyebrowStyle)}
                        selection={{
                          id: `home.downloadCards.${card.id}.eyebrow`,
                          kind: "text",
                          label: `下載卡 ${index + 1} Eyebrow`,
                          fieldPath: `home.downloadCards.${index}.eyebrow`,
                          stylePath: `home.downloadCards.${index}.eyebrowStyle`,
                          collectionPath: "home.downloadCards",
                          itemPath: `home.downloadCards.${index}`,
                          itemId: card.id,
                          itemIndex: index,
                        }}
                      />
                      <EditableText
                        as="h2"
                        value={card.title}
                        className="mt-2 break-words"
                        style={getTextStyle(card.titleStyle)}
                        selection={{
                          id: `home.downloadCards.${card.id}.title`,
                          kind: "text",
                          label: `下載卡 ${index + 1} 標題`,
                          fieldPath: `home.downloadCards.${index}.title`,
                          stylePath: `home.downloadCards.${index}.titleStyle`,
                          collectionPath: "home.downloadCards",
                          itemPath: `home.downloadCards.${index}`,
                          itemId: card.id,
                          itemIndex: index,
                        }}
                      />
                    </div>
                    <div className="shrink-0 rounded-full bg-[#0e1d38] px-3 py-2 text-xs font-bold text-white">
                      APP
                    </div>
                  </div>

                  <EditableText
                    as="p"
                    value={card.audience}
                    className="mt-3"
                    style={getTextStyle(card.audienceStyle)}
                    selection={{
                      id: `home.downloadCards.${card.id}.audience`,
                      kind: "text",
                      label: `下載卡 ${index + 1} 受眾`,
                      fieldPath: `home.downloadCards.${index}.audience`,
                      stylePath: `home.downloadCards.${index}.audienceStyle`,
                      collectionPath: "home.downloadCards",
                      itemPath: `home.downloadCards.${index}`,
                      itemId: card.id,
                      itemIndex: index,
                    }}
                  />
                  <EditableText
                    as="p"
                    value={card.description}
                    className="mt-4 flex-1 break-words"
                    style={getTextStyle(card.descriptionStyle)}
                    multiline
                    selection={{
                      id: `home.downloadCards.${card.id}.description`,
                      kind: "text",
                      label: `下載卡 ${index + 1} 說明`,
                      fieldPath: `home.downloadCards.${index}.description`,
                      stylePath: `home.downloadCards.${index}.descriptionStyle`,
                      multiline: true,
                      collectionPath: "home.downloadCards",
                      itemPath: `home.downloadCards.${index}`,
                      itemId: card.id,
                      itemIndex: index,
                    }}
                  />

                  <div className="mt-5 flex flex-wrap gap-2">
                    {card.highlights.map((highlight, highlightIndex) => (
                      <EditableText
                        key={`${card.id}-${highlightIndex}`}
                        as="span"
                        value={highlight}
                        className="rounded-full bg-[#edf4ff] px-3 py-1.5 text-xs font-bold text-[#0b4fd4]"
                        selection={{
                          id: `home.downloadCards.${card.id}.highlights.${highlightIndex}`,
                          kind: "text",
                          label: `下載卡 ${index + 1} Highlight ${highlightIndex + 1}`,
                          fieldPath: `home.downloadCards.${index}.highlights.${highlightIndex}`,
                          collectionPath: "home.downloadCards",
                          itemPath: `home.downloadCards.${index}`,
                          itemId: card.id,
                          itemIndex: index,
                        }}
                      />
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDownload(card)}
                    className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-[#ffd84a] px-5 py-3.5 text-base font-black text-[#0e1d38] shadow-[0_18px_34px_rgba(255,216,74,0.38)] transition hover:bg-[#ffe68e]"
                  >
                    下載 {card.title}
                  </button>
                </div>
              </div>
            </EditableBlock>
          ))}
        </EditableBlock>

        <section id="launch-flow" ref={(node) => { sectionRefs.current["launch-flow"] = node; }} className={`grid gap-6 transition-shadow lg:grid-cols-[minmax(280px,0.9fr)_minmax(0,1.1fr)] ${focusSection === "launch-flow" ? "rounded-[2rem] ring-4 ring-blue/25" : ""}`} data-preview-section="launch-flow">
          <EditableBlock
            selection={{
              id: "home.launchFlow.left",
              kind: "block",
              label: "Launch Flow 左側主卡",
              stylePath: "home.launchFlow.leftBlockStyle",
            }}
            className={`${activeCardKey === "launch-main" ? activeCardClass : ""} border transition-shadow`}
            style={getBlockStyle(site.home.launchFlow.leftBlockStyle)}
          >
            <div data-preview-card-key="launch-main">
              <EditableText
                as="p"
                value={site.home.launchFlow.eyebrow}
                className="uppercase tracking-[0.3em]"
                style={getTextStyle(site.home.launchFlow.eyebrowStyle)}
                selection={{
                  id: "home.launchFlow.eyebrow",
                  kind: "text",
                  label: "Launch Flow 左側 Eyebrow",
                  fieldPath: "home.launchFlow.eyebrow",
                  stylePath: "home.launchFlow.eyebrowStyle",
                }}
              />
              <EditableText
                as="h2"
                value={site.home.launchFlow.title}
                className="mt-3 break-words"
                style={getTextStyle(site.home.launchFlow.titleStyle)}
                multiline
                selection={{
                  id: "home.launchFlow.title",
                  kind: "text",
                  label: "Launch Flow 左側標題",
                  fieldPath: "home.launchFlow.title",
                  stylePath: "home.launchFlow.titleStyle",
                  multiline: true,
                }}
              />
              <EditableText
                as="p"
                value={site.home.launchFlow.description}
                className="mt-4 break-words"
                style={getTextStyle(site.home.launchFlow.descriptionStyle)}
                multiline
                selection={{
                  id: "home.launchFlow.description",
                  kind: "text",
                  label: "Launch Flow 左側內容",
                  fieldPath: "home.launchFlow.description",
                  stylePath: "home.launchFlow.descriptionStyle",
                  multiline: true,
                }}
              />
            </div>
          </EditableBlock>

          <EditableBlock
            selection={{
              id: "home.launchFlow.right",
              kind: "block",
              label: "Launch Flow 右側容器",
              stylePath: "home.launchFlow.rightBlockStyle",
              collectionPath: "home.launchFlow.steps",
            }}
            className={`grid gap-4 ${site.home.launchFlow.steps.length > 2 ? "md:grid-cols-3" : "md:grid-cols-2"}`}
            style={getBlockStyle(site.home.launchFlow.rightBlockStyle)}
          >
            {site.home.launchFlow.steps.map((step, index) => (
              <EditableBlock
                key={step.id}
                selection={{
                  id: `home.launchFlow.steps.${step.id}.block`,
                  kind: "block",
                  label: `Launch Flow 步驟卡 ${index + 1}`,
                  stylePath: `home.launchFlow.steps.${index}.blockStyle`,
                  collectionPath: "home.launchFlow.steps",
                  itemPath: `home.launchFlow.steps.${index}`,
                  itemId: step.id,
                  itemIndex: index,
                }}
                className={`gradient-border border transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(14,29,56,0.14)] ${activeCardKey === "launch-step" && activeCardIndex === index ? activeCardClass : ""}`}
                style={getBlockStyle(step.blockStyle)}
              >
                <article data-preview-card-key="launch-step" data-preview-card-index={index}>
                  <EditableText
                    as="p"
                    value={step.index}
                    className="font-[var(--font-manrope)] tracking-[0.26em]"
                    style={getTextStyle(step.indexStyle)}
                    selection={{
                      id: `home.launchFlow.steps.${step.id}.index`,
                      kind: "text",
                      label: `Launch Flow 步驟 ${index + 1} 編號`,
                      fieldPath: `home.launchFlow.steps.${index}.index`,
                      stylePath: `home.launchFlow.steps.${index}.indexStyle`,
                      collectionPath: "home.launchFlow.steps",
                      itemPath: `home.launchFlow.steps.${index}`,
                      itemId: step.id,
                      itemIndex: index,
                    }}
                  />
                  <EditableText
                    as="h3"
                    value={step.title}
                    className="mt-4 break-words"
                    style={getTextStyle(step.titleStyle)}
                    selection={{
                      id: `home.launchFlow.steps.${step.id}.title`,
                      kind: "text",
                      label: `Launch Flow 步驟 ${index + 1} 標題`,
                      fieldPath: `home.launchFlow.steps.${index}.title`,
                      stylePath: `home.launchFlow.steps.${index}.titleStyle`,
                      collectionPath: "home.launchFlow.steps",
                      itemPath: `home.launchFlow.steps.${index}`,
                      itemId: step.id,
                      itemIndex: index,
                    }}
                  />
                  <EditableText
                    as="p"
                    value={step.description}
                    className="mt-3 break-words"
                    style={getTextStyle(step.descriptionStyle)}
                    multiline
                    selection={{
                      id: `home.launchFlow.steps.${step.id}.description`,
                      kind: "text",
                      label: `Launch Flow 步驟 ${index + 1} 說明`,
                      fieldPath: `home.launchFlow.steps.${index}.description`,
                      stylePath: `home.launchFlow.steps.${index}.descriptionStyle`,
                      multiline: true,
                      collectionPath: "home.launchFlow.steps",
                      itemPath: `home.launchFlow.steps.${index}`,
                      itemId: step.id,
                      itemIndex: index,
                    }}
                  />
                </article>
              </EditableBlock>
            ))}
          </EditableBlock>
        </section>
      </div>

      <div ref={(node) => { sectionRefs.current.footer = node; }}>
        <Footer
          site={site}
          highlighted={focusSection === "footer"}
          activeCardKey={focusSection === "footer" ? activeCardKey : null}
          activeCardIndex={focusSection === "footer" ? activeCardIndex : null}
        />
      </div>

      {!embedded && deviceChoice ? (
        <div className="fixed inset-0 z-50 flex items-end bg-[#0e1d38]/40 p-4 backdrop-blur-sm md:items-center md:justify-center">
          <div className="w-full max-w-md rounded-[2rem] bg-white p-6 shadow-[0_30px_90px_rgba(14,29,56,0.22)]">
            <p className="text-sm font-extrabold uppercase tracking-[0.26em] text-[#0b4fd4]">
              選擇下載平台
            </p>
            <h3 className="mt-2 text-3xl font-black text-[#0e1d38]">{deviceChoice.roleTitle}</h3>
            <p className="mt-3 text-base leading-8 text-[#0e1d38]/68">
              請依照你的裝置選擇 App Store 或 Google Play，前往對應下載頁面。
            </p>

            <div className="mt-6 grid gap-3">
              <a
                href={deviceChoice.iosUrl}
                className="inline-flex items-center justify-center rounded-full bg-[#0e1d38] px-5 py-3.5 text-base font-bold text-white transition hover:bg-[#16325f]"
              >
                前往 App Store
              </a>
              <a
                href={deviceChoice.androidUrl}
                className="inline-flex items-center justify-center rounded-full bg-[#ffd84a] px-5 py-3.5 text-base font-bold text-[#0e1d38] transition hover:bg-[#ffe68e]"
              >
                前往 Google Play
              </a>
              <button
                type="button"
                onClick={() => setDeviceChoice(null)}
                className="inline-flex items-center justify-center rounded-full border border-[#0e1d38]/10 px-5 py-3.5 text-base font-bold text-[#0e1d38] transition hover:border-[#0b4fd4] hover:text-[#0b4fd4]"
              >
                關閉
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}
