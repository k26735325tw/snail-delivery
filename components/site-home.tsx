"use client";

import Image from "next/image";
import { useState } from "react";

import { Footer } from "@/components/footer";
import { SiteHeader } from "@/components/site-header";
import type { CmsData, CmsDownloadCard } from "@/lib/cms-schema";
import { detectDevice } from "@/utils/device";

type SiteHomeProps = {
  site: CmsData;
};

function getDeviceLabel() {
  const device = detectDevice();

  if (device === "ios") {
    return "目前裝置：iPhone / iPad";
  }

  if (device === "android") {
    return "目前裝置：Android";
  }

  return "目前裝置：桌機或未識別";
}

export function SiteHome({ site }: SiteHomeProps) {
  const [deviceChoice, setDeviceChoice] = useState<{
    roleTitle: string;
    iosUrl: string;
    androidUrl: string;
  } | null>(null);

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

  return (
    <main className="min-h-screen overflow-hidden pb-10">
      <SiteHeader siteName={site.site.siteName} logoUrl={site.site.logoUrl} />

      <div className="shell mt-6">
        <section className="relative overflow-hidden rounded-[2.25rem] border border-white/75 bg-white/78 px-6 py-8 shadow-[0_32px_90px_rgba(14,29,56,0.08)] backdrop-blur md:px-10 md:py-10">
          <div className="absolute -left-24 top-0 h-72 w-72 rounded-full bg-[#ffd84a]/30 blur-3xl" />
          <div className="absolute right-0 top-12 h-72 w-72 rounded-full bg-[#1b6fff]/18 blur-3xl" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(11,79,212,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(11,79,212,0.04)_1px,transparent_1px)] bg-[size:34px_34px] [mask-image:linear-gradient(180deg,rgba(0,0,0,0.72),transparent)]" />

          <div className="relative grid gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
            <div>
              <div className="inline-flex items-center gap-4 rounded-full border border-[#0e1d38]/8 bg-white/84 px-4 py-3 shadow-[0_18px_40px_rgba(14,29,56,0.06)]">
                <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-[1.5rem] bg-[#0b4fd4] shadow-[0_20px_44px_rgba(11,79,212,0.32)]">
                  <Image
                    src={site.site.logoUrl}
                    alt={site.site.siteName}
                    width={56}
                    height={56}
                    unoptimized
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <p className="font-[var(--font-manrope)] text-xs font-extrabold uppercase tracking-[0.34em] text-[#0b4fd4]">
                    {site.site.siteName}
                  </p>
                  <p className="text-sm font-semibold text-[#0e1d38]/62">
                    {site.home.hero.badge}
                  </p>
                </div>
              </div>

              <h1 className="mt-8 max-w-3xl text-5xl font-black tracking-[-0.08em] text-[#0e1d38] md:text-7xl">
                {site.home.hero.title}
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-[#0e1d38]/72">
                {site.home.hero.subtitle}
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-[#0e1d38] px-4 py-2 text-sm font-bold text-white">
                  {getDeviceLabel()}
                </span>
                <span className="rounded-full bg-[#ffd84a] px-4 py-2 text-sm font-bold text-[#0e1d38]">
                  CMS 與 Blob 已整合
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

            <div className="grid gap-4">
              {site.home.hero.heroImageUrl ? (
                <div className="overflow-hidden rounded-[2rem] border border-white/80 bg-white/84 shadow-[0_22px_50px_rgba(14,29,56,0.08)]">
                  <Image
                    src={site.home.hero.heroImageUrl}
                    alt={site.home.hero.title}
                    width={1200}
                    height={900}
                    unoptimized
                    className="h-[360px] w-full object-cover"
                  />
                </div>
              ) : null}

              {site.home.features.map((feature, index) => (
                <div
                  key={feature}
                  className="rounded-[1.75rem] border border-white/80 bg-white/84 p-5 shadow-[0_22px_50px_rgba(14,29,56,0.08)]"
                  style={{ transform: `translateY(${index * 10}px)` }}
                >
                  <p className="text-sm font-extrabold uppercase tracking-[0.26em] text-[#0b4fd4]">
                    Feature {index + 1}
                  </p>
                  <p className="mt-3 text-lg font-bold leading-8 text-[#0e1d38]">
                    {feature}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="download-cards" className="mt-8 grid gap-6 lg:grid-cols-3">
          {site.home.downloadCards.map((card) => (
            <article
              key={card.key}
              className="group relative overflow-hidden rounded-[2rem] border border-[#0e1d38]/8 bg-white/88 p-5 shadow-[0_24px_60px_rgba(14,29,56,0.08)] transition duration-300 hover:-translate-y-2 hover:shadow-[0_30px_80px_rgba(14,29,56,0.14)]"
            >
              <div className="absolute inset-x-6 top-0 h-24 rounded-b-[2rem] bg-gradient-to-b from-[#ffd84a]/45 to-transparent" />
              <div className="relative">
                <div className="overflow-hidden rounded-[1.6rem] bg-[#eef5ff]">
                  <Image
                    src={card.imageUrl}
                    alt={card.imageAlt}
                    width={960}
                    height={720}
                    unoptimized
                    className="h-64 w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                  />
                </div>

                <div className="mt-5 flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-extrabold uppercase tracking-[0.26em] text-[#0b4fd4]">
                      {card.eyebrow}
                    </p>
                    <h2 className="mt-2 text-3xl font-black tracking-[-0.05em] text-[#0e1d38]">
                      {card.title}
                    </h2>
                  </div>
                  <div className="rounded-full bg-[#0e1d38] px-3 py-2 text-xs font-bold text-white">
                    APP
                  </div>
                </div>

                <p className="mt-3 text-sm font-semibold text-[#0b4fd4]">{card.audience}</p>
                <p className="mt-4 text-base leading-8 text-[#0e1d38]/70">
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
            </article>
          ))}
        </section>

        <section id="launch-flow" className="mt-8 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[2rem] border border-[#0e1d38]/8 bg-[#0e1d38] p-6 text-white shadow-[0_24px_70px_rgba(14,29,56,0.16)] md:p-8">
            <p className="text-sm font-extrabold uppercase tracking-[0.3em] text-[#ffd84a]">
              Launch Flow
            </p>
            <h2 className="mt-3 text-4xl font-black tracking-[-0.05em]">
              從 CMS 編輯到前台發布，路徑保持單純。
            </h2>
            <p className="mt-4 text-base leading-8 text-white/72">
              內容管理後台更新文字與圖片後，系統會將資料寫入 Blob，並重新整理首頁與各角色頁的快取。
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {site.home.launchFlow.map((step) => (
              <article
                key={step.index}
                className="rounded-[2rem] border border-[#0e1d38]/8 bg-white/90 p-5 shadow-[0_20px_50px_rgba(14,29,56,0.08)]"
              >
                <p className="font-[var(--font-manrope)] text-sm font-extrabold tracking-[0.26em] text-[#0b4fd4]">
                  {step.index}
                </p>
                <h3 className="mt-4 text-2xl font-black tracking-[-0.04em] text-[#0e1d38]">
                  {step.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-[#0e1d38]/68">
                  {step.description}
                </p>
              </article>
            ))}
          </div>
        </section>
      </div>

      <Footer
        siteName={site.site.siteName}
        title={site.site.footerTitle}
        description={site.site.footerDescription}
      />

      {deviceChoice ? (
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
  );
}
