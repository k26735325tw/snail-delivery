"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

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
};

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
}: SiteHomeProps) {
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
  const previewScaleClass = "";

  return (
    <div className={previewScaleClass}>
      <main className="min-h-screen pb-10">
        <div ref={(node) => { sectionRefs.current.header = node; }}>
          <SiteHeader site={site} embedded={embedded} highlighted={focusSection === "header"} />
        </div>

        <div className="shell mt-6 space-y-8">
          <section
            ref={(node) => { sectionRefs.current.hero = node; }}
            className={`relative overflow-hidden border transition-shadow ${focusSection === "hero" ? "ring-4 ring-blue/25 shadow-[0_24px_80px_rgba(27,111,255,0.18)]" : ""}`}
            style={getBlockStyle(site.home.hero.sectionStyle)}
            data-preview-section="hero"
          >
            <div className="absolute -left-24 top-0 h-72 w-72 rounded-full bg-[#ffd84a]/30 blur-3xl" />
            <div className="absolute right-0 top-12 h-72 w-72 rounded-full bg-[#1b6fff]/18 blur-3xl" />
            <div className="absolute inset-0 bg-[linear-gradient(rgba(11,79,212,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(11,79,212,0.04)_1px,transparent_1px)] bg-[size:34px_34px] [mask-image:linear-gradient(180deg,rgba(0,0,0,0.72),transparent)]" />

            <div className="relative grid gap-8 xl:grid-cols-[minmax(0,1.02fr)_minmax(320px,0.98fr)] xl:items-start">
              <div className="min-w-0">
                <div className="inline-flex max-w-full items-center gap-4 rounded-[2rem] border border-[#0e1d38]/8 bg-white/84 px-4 py-3 shadow-[0_18px_40px_rgba(14,29,56,0.06)]">
                  <div className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-[1.5rem] bg-[#0b4fd4] shadow-[0_20px_44px_rgba(11,79,212,0.32)]">
                    <Image
                      src={site.site.logo.url}
                      alt={site.site.logo.alt}
                      width={88}
                      height={88}
                      unoptimized
                      className="h-full w-full"
                      style={getImageStyle(site.site.logo)}
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-[var(--font-manrope)] text-xs font-extrabold uppercase tracking-[0.34em] text-[#0b4fd4]">
                      {site.site.siteName}
                    </p>
                    <p className="break-words" style={getTextStyle(site.home.hero.badgeStyle)}>
                      {site.home.hero.badge}
                    </p>
                  </div>
                </div>

                <h1
                  className="mt-8 max-w-4xl break-words font-[var(--font-manrope)] tracking-[-0.08em]"
                  style={getTextStyle(site.home.hero.titleStyle)}
                >
                  {site.home.hero.title}
                </h1>
                <p className="mt-5 max-w-3xl break-words" style={getTextStyle(site.home.hero.subtitleStyle)}>
                  {site.home.hero.subtitle}
                </p>

                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <span
                    className="rounded-full bg-[#0e1d38] px-4 py-2"
                    style={getTextStyle(site.home.hero.deviceBadgeStyle)}
                  >
                    {getDeviceLabel(site)}
                  </span>
                  <span
                    className="rounded-full bg-[#ffd84a] px-4 py-2"
                    style={getTextStyle(site.home.hero.secondaryBadgeStyle)}
                  >
                    {site.home.hero.secondaryBadge}
                  </span>
                </div>

                <div className="mt-8 flex flex-wrap gap-3">
                  <a
                    href={site.home.hero.primaryHref}
                    className="inline-flex items-center justify-center rounded-full bg-[#0e1d38] px-6 py-3.5 text-base font-black text-white transition hover:bg-[#16325f]"
                  >
                    {site.home.hero.primaryLabel}
                  </a>
                  <a
                    href={site.home.hero.secondaryHref}
                    className="inline-flex items-center justify-center rounded-full border border-[#0e1d38]/12 bg-white/84 px-6 py-3.5 text-base font-black text-[#0e1d38] transition hover:border-[#0b4fd4] hover:text-[#0b4fd4]"
                  >
                    {site.home.hero.secondaryLabel}
                  </a>
                </div>
              </div>

              <div ref={(node) => { sectionRefs.current.features = node; }} className={`grid gap-4 transition-shadow ${focusSection === "features" ? "rounded-[2rem] ring-4 ring-blue/25" : ""}`} data-preview-section="features">
                {site.home.hero.heroImage.url ? (
                  <div className="overflow-hidden rounded-[2rem] border border-white/80 bg-white/84 shadow-[0_24px_70px_rgba(14,29,56,0.12)]">
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
                  </div>
                ) : null}

                <div
                  className={`grid gap-4 ${featureColumnClass}`}
                  style={getBlockStyle(site.home.features.sectionStyle)}
                >
                  {site.home.features.cards.map((feature) => (
                    <article
                      key={`${feature.eyebrow}-${feature.title}`}
                      className="gradient-border flex h-full min-h-[220px] flex-col justify-between border transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(14,29,56,0.14)]"
                      style={getBlockStyle(feature.blockStyle)}
                    >
                      <div>
                        <p className="font-[var(--font-manrope)] uppercase tracking-[0.24em]" style={getTextStyle(feature.eyebrowStyle)}>
                          {feature.eyebrow}
                        </p>
                        <h2 className="mt-3 break-words" style={getTextStyle(feature.titleStyle)}>
                          {feature.title}
                        </h2>
                        <p className="mt-3 break-words" style={getTextStyle(feature.descriptionStyle)}>
                          {feature.description}
                        </p>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section id="download-cards" className="grid gap-6 lg:grid-cols-3">
            {site.home.downloadCards.map((card) => (
              <article
                key={card.key}
                className="group gradient-border relative overflow-hidden border transition duration-300 hover:-translate-y-1 hover:shadow-[0_26px_80px_rgba(14,29,56,0.16)]"
                style={getBlockStyle(card.blockStyle)}
              >
                <div className="absolute inset-x-6 top-0 h-24 rounded-b-[2rem] bg-gradient-to-b from-[#ffd84a]/45 to-transparent" />
                <div className="relative flex h-full flex-col">
                  <div className="overflow-hidden rounded-[1.6rem] bg-[#eef5ff]">
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
                  </div>

                  <div className="mt-5 flex flex-1 flex-col">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <p className="uppercase tracking-[0.26em]" style={getTextStyle(card.eyebrowStyle)}>
                          {card.eyebrow}
                        </p>
                        <h2 className="mt-2 break-words" style={getTextStyle(card.titleStyle)}>
                          {card.title}
                        </h2>
                      </div>
                      <div className="shrink-0 rounded-full bg-[#0e1d38] px-3 py-2 text-xs font-bold text-white">
                        APP
                      </div>
                    </div>

                    <p className="mt-3" style={getTextStyle(card.audienceStyle)}>
                      {card.audience}
                    </p>
                    <p className="mt-4 flex-1 break-words" style={getTextStyle(card.descriptionStyle)}>
                      {card.description}
                    </p>

                    <div className="mt-5 flex flex-wrap gap-2">
                      {card.highlights.map((highlight) => (
                        <span
                          key={highlight}
                          className="rounded-full bg-[#edf4ff] px-3 py-1.5 text-xs font-bold text-[#0b4fd4]"
                        >
                          {highlight}
                        </span>
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
              </article>
            ))}
          </section>

          <section id="launch-flow" ref={(node) => { sectionRefs.current["launch-flow"] = node; }} className={`grid gap-6 transition-shadow lg:grid-cols-[minmax(280px,0.9fr)_minmax(0,1.1fr)] ${focusSection === "launch-flow" ? "rounded-[2rem] ring-4 ring-blue/25" : ""}`} data-preview-section="launch-flow">
            <div className="border" style={getBlockStyle(site.home.launchFlow.leftBlockStyle)}>
              <p className="uppercase tracking-[0.3em]" style={getTextStyle(site.home.launchFlow.eyebrowStyle)}>
                {site.home.launchFlow.eyebrow}
              </p>
              <h2 className="mt-3 break-words" style={getTextStyle(site.home.launchFlow.titleStyle)}>
                {site.home.launchFlow.title}
              </h2>
              <p className="mt-4 break-words" style={getTextStyle(site.home.launchFlow.descriptionStyle)}>
                {site.home.launchFlow.description}
              </p>
            </div>

            <div
              className={`grid gap-4 ${site.home.launchFlow.steps.length > 2 ? "md:grid-cols-3" : "md:grid-cols-2"}`}
              style={getBlockStyle(site.home.launchFlow.rightBlockStyle)}
            >
              {site.home.launchFlow.steps.map((step) => (
                <article
                  key={step.index}
                  className="gradient-border border transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(14,29,56,0.14)]"
                  style={getBlockStyle(step.blockStyle)}
                >
                  <p className="font-[var(--font-manrope)] tracking-[0.26em]" style={getTextStyle(step.indexStyle)}>
                    {step.index}
                  </p>
                  <h3 className="mt-4 break-words" style={getTextStyle(step.titleStyle)}>
                    {step.title}
                  </h3>
                  <p className="mt-3 break-words" style={getTextStyle(step.descriptionStyle)}>
                    {step.description}
                  </p>
                </article>
              ))}
            </div>
          </section>
        </div>

        <div ref={(node) => { sectionRefs.current.footer = node; }}>
          <Footer site={site} highlighted={focusSection === "footer"} />
        </div>

        {!embedded && deviceChoice ? (
          <div className="fixed inset-0 z-50 flex items-end bg-[#0e1d38]/40 p-4 backdrop-blur-sm md:items-center md:justify-center">
            <div className="w-full max-w-md rounded-[2rem] bg-white p-6 shadow-[0_30px_90px_rgba(14,29,56,0.22)]">
              <p className="text-sm font-extrabold uppercase tracking-[0.26em] text-[#0b4fd4]">
                選擇下載平台
              </p>
              <h3 className="mt-2 text-3xl font-black text-[#0e1d38]">{deviceChoice.roleTitle}</h3>
              <p className="mt-3 text-base leading-8 text-[#0e1d38]/68">
                目前裝置無法自動判斷，請直接選擇 App Store 或 Google Play。
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
    </div>
  );
}
