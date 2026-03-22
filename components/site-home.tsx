"use client";

import Image from "next/image";
import { useState } from "react";

import type { SiteContent } from "@/lib/site-data";
import { detectDevice, type DeviceKind } from "@/utils/device";

type RoleKey = "courier" | "merchant" | "consumer";

type RoleConfig = {
  key: RoleKey;
  eyebrow: string;
  title: string;
  description: string;
  audience: string;
  imageSrc: string;
  imageAlt: string;
  iosUrl: string;
  androidUrl: string;
  highlights: string[];
};

const roles: RoleConfig[] = [
  {
    key: "courier",
    eyebrow: "外送夥伴",
    title: "GoGet Turbo",
    description: "接單、導航、交付與收入進度都集中在同一個工作台，讓跑單節奏更穩。",
    audience: "給需要快速上線接單的外送員",
    imageSrc: "/images/rider.png",
    imageAlt: "GoGet 外送夥伴 App 頁面預覽",
    iosUrl: "https://apps.apple.com/tw/app/%E8%9D%B8%E7%89%9Bturbo/id6751255326",
    androidUrl: "https://play.google.com/store/apps/details?id=plus.H5ADE2198",
    highlights: ["即時接單提醒", "清楚顯示收入", "支援導航切換"],
  },
  {
    key: "merchant",
    eyebrow: "店家管理",
    title: "GoGet 店家",
    description: "用單一介面管理菜單、營業狀態與訂單動態，尖峰時段也能穩定出餐。",
    audience: "給要同步管理訂單與門市營運的商家",
    imageSrc: "/images/merchant.png",
    imageAlt: "GoGet 店家 App 頁面預覽",
    iosUrl: "https://apps.apple.com/app/id6751261624",
    androidUrl: "https://play.google.com/store/apps/details?id=plus.H58A1C9BB",
    highlights: ["菜單與訂單同步", "營業中狀態即時切換", "門市出餐流程更順"],
  },
  {
    key: "consumer",
    eyebrow: "一般用戶",
    title: "GoGet 外送",
    description: "從點餐到收貨一條路徑完成，下單流程簡潔，配送進度一眼看懂。",
    audience: "給想快速完成下單的消費者",
    imageSrc: "/images/user.png",
    imageAlt: "GoGet 消費者 App 頁面預覽",
    iosUrl: "https://apps.apple.com/tw/app/%E8%9D%B8%E7%89%9B%E5%A4%96%E9%80%81/id6751226746",
    androidUrl: "https://play.google.com/store/apps/details?id=plus.H5F0A257F",
    highlights: ["快速下單流程", "即時配送追蹤", "熱門店家一鍵回購"],
  },
];

const launchSteps = [
  {
    index: "01",
    title: "選擇你的身分",
    description: "依照你是外送員、店家或消費者，直接進入對應下載入口。",
  },
  {
    index: "02",
    title: "自動判斷裝置",
    description: "若使用手機開啟頁面，系統會優先導向對應的 App Store 或 Google Play。",
  },
  {
    index: "03",
    title: "桌機可手動切換",
    description: "若你在桌機或平板上瀏覽，會直接顯示雙平台下載選擇。",
  },
];

function LogoMark() {
  return (
    <div className="relative h-14 w-14 rounded-[1.5rem] bg-[#0b4fd4] shadow-[0_20px_44px_rgba(11,79,212,0.32)]">
      <div className="absolute inset-x-2.5 bottom-2.5 h-6 rounded-full bg-[#ffd84a]" />
      <div className="absolute left-3 top-3 h-5 w-5 rounded-full border-[5px] border-white/85" />
      <div className="absolute right-3.5 top-3 h-2.5 w-2.5 rounded-full bg-white" />
    </div>
  );
}

function getDeviceLabel(device: DeviceKind) {
  if (device === "ios") {
    return "目前裝置：iPhone / iPad";
  }

  if (device === "android") {
    return "目前裝置：Android";
  }

  return "目前裝置：桌機或其他裝置";
}

type SiteHomeProps = {
  site: SiteContent;
};

export function SiteHome({ site }: SiteHomeProps) {
  const [deviceChoice, setDeviceChoice] = useState<{
    roleTitle: string;
    iosUrl: string;
    androidUrl: string;
  } | null>(null);
  const currentDevice = detectDevice();

  function handleDownload(role: RoleConfig) {
    const device = detectDevice();

    if (device === "ios") {
      window.location.href = role.iosUrl;
      return;
    }

    if (device === "android") {
      window.location.href = role.androidUrl;
      return;
    }

    setDeviceChoice({
      roleTitle: role.title,
      iosUrl: role.iosUrl,
      androidUrl: role.androidUrl,
    });
  }

  return (
    <main className="min-h-screen overflow-hidden px-4 py-6 md:px-6 md:py-8">
      <div className="mx-auto max-w-7xl">
        <section className="relative overflow-hidden rounded-[2.25rem] border border-white/75 bg-white/78 px-6 py-8 shadow-[0_32px_90px_rgba(14,29,56,0.08)] backdrop-blur md:px-10 md:py-10">
          <div className="absolute -left-24 top-0 h-72 w-72 rounded-full bg-[#ffd84a]/30 blur-3xl" />
          <div className="absolute right-0 top-12 h-72 w-72 rounded-full bg-[#1b6fff]/18 blur-3xl" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(11,79,212,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(11,79,212,0.04)_1px,transparent_1px)] bg-[size:34px_34px] [mask-image:linear-gradient(180deg,rgba(0,0,0,0.72),transparent)]" />

          <div className="relative grid gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
            <div>
              <div className="inline-flex items-center gap-4 rounded-full border border-[#0e1d38]/8 bg-white/84 px-4 py-3 shadow-[0_18px_40px_rgba(14,29,56,0.06)]">
                <LogoMark />
                <div>
                  <p className="font-[var(--font-manrope)] text-xs font-extrabold uppercase tracking-[0.34em] text-[#0b4fd4]">
                    {site.siteName}
                  </p>
                  <p className="text-sm font-semibold text-[#0e1d38]/62">
                    官方 App 下載入口
                  </p>
                </div>
              </div>

              <h1 className="mt-8 max-w-3xl text-5xl font-black tracking-[-0.08em] text-[#0e1d38] md:text-7xl">
                {site.heroTitle}
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-[#0e1d38]/72">
                {site.heroSubtitle}
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-[#0e1d38] px-4 py-2 text-sm font-bold text-white">
                  {getDeviceLabel(currentDevice)}
                </span>
                <span className="rounded-full bg-[#ffd84a] px-4 py-2 text-sm font-bold text-[#0e1d38]">
                  下載頁已支援自動導流
                </span>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="#download-cards"
                  className="inline-flex items-center justify-center rounded-full bg-[#0e1d38] px-6 py-3.5 text-base font-black text-white transition hover:bg-[#16325f]"
                >
                  立即選擇 App
                </a>
                <a
                  href="#launch-flow"
                  className="inline-flex items-center justify-center rounded-full border border-[#0e1d38]/12 bg-white/84 px-6 py-3.5 text-base font-black text-[#0e1d38] transition hover:border-[#0b4fd4] hover:text-[#0b4fd4]"
                >
                  了解下載流程
                </a>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
              {site.features.map((feature, index) => (
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
          {roles.map((role) => (
            <article
              key={role.key}
              className="group relative overflow-hidden rounded-[2rem] border border-[#0e1d38]/8 bg-white/88 p-5 shadow-[0_24px_60px_rgba(14,29,56,0.08)] transition duration-300 hover:-translate-y-2 hover:shadow-[0_30px_80px_rgba(14,29,56,0.14)]"
            >
              <div className="absolute inset-x-6 top-0 h-24 rounded-b-[2rem] bg-gradient-to-b from-[#ffd84a]/45 to-transparent" />
              <div className="relative">
                <div className="overflow-hidden rounded-[1.6rem] bg-[#eef5ff]">
                  <Image
                    src={role.imageSrc}
                    alt={role.imageAlt}
                    width={960}
                    height={720}
                    className="h-64 w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                    priority
                  />
                </div>

                <div className="mt-5 flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-extrabold uppercase tracking-[0.26em] text-[#0b4fd4]">
                      {role.eyebrow}
                    </p>
                    <h2 className="mt-2 text-3xl font-black tracking-[-0.05em] text-[#0e1d38]">
                      {role.title}
                    </h2>
                  </div>
                  <div className="rounded-full bg-[#0e1d38] px-3 py-2 text-xs font-bold text-white">
                    APP
                  </div>
                </div>

                <p className="mt-3 text-sm font-semibold text-[#0b4fd4]">
                  {role.audience}
                </p>
                <p className="mt-4 text-base leading-8 text-[#0e1d38]/70">
                  {role.description}
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                  {role.highlights.map((highlight) => (
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
                  onClick={() => handleDownload(role)}
                  className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-[#ffd84a] px-5 py-3.5 text-base font-black text-[#0e1d38] shadow-[0_18px_34px_rgba(255,216,74,0.38)] transition hover:bg-[#ffe68e]"
                >
                  下載 {role.title}
                </button>
              </div>
            </article>
          ))}
        </section>

        <section id="launch-flow" className="mt-8 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[2rem] border border-[#0e1d38]/8 bg-[#0e1d38] p-6 text-white shadow-[0_24px_70px_rgba(14,29,56,0.16)] md:p-8">
            <p className="text-sm font-extrabold uppercase tracking-[0.3em] text-[#ffd84a]">
              Download Flow
            </p>
            <h2 className="mt-3 text-4xl font-black tracking-[-0.05em]">
              首頁已經是直接導流的下載入口
            </h2>
            <p className="mt-4 text-base leading-8 text-white/72">
              不需要額外導頁或表單。使用者只要進到首頁，就能依角色選擇 App，手機裝置會自動跳轉到對應商店。
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {launchSteps.map((step) => (
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

        {deviceChoice ? (
          <div className="fixed inset-0 z-50 flex items-end bg-[#0e1d38]/40 p-4 backdrop-blur-sm md:items-center md:justify-center">
            <div className="w-full max-w-md rounded-[2rem] bg-white p-6 shadow-[0_30px_90px_rgba(14,29,56,0.22)]">
              <p className="text-sm font-extrabold uppercase tracking-[0.26em] text-[#0b4fd4]">
                選擇下載平台
              </p>
              <h3 className="mt-2 text-3xl font-black text-[#0e1d38]">
                {deviceChoice.roleTitle}
              </h3>
              <p className="mt-3 text-base leading-8 text-[#0e1d38]/68">
                目前無法自動辨識為 iOS 或 Android，請手動選擇要前往的應用商店。
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
      </div>
    </main>
  );
}
