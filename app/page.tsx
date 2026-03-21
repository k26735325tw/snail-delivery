import Link from "next/link";

import { FeatureCard } from "@/components/feature-card";
import { FadeIn } from "@/components/fade-in";
import { Footer } from "@/components/footer";
import { SectionShell } from "@/components/section-shell";
import { SiteHeader } from "@/components/site-header";
import { SnailMascot } from "@/components/snail-mascot";

const roleHighlights = [
  {
    eyebrow: "Consumer",
    title: "品質更清楚",
    description:
      "從下單到送達，所有訊號都被整理成乾淨、直覺、讓人安心的高品質體驗。",
    icon: "品",
  },
  {
    eyebrow: "Courier",
    title: "收入更穩定",
    description:
      "更清楚的趟次資訊、合理的派單節奏與安全保障，讓每一次上線都更有掌握感。",
    icon: "穩",
  },
  {
    eyebrow: "Merchant",
    title: "合作更透明",
    description:
      "不收廣告費、不收月費、不收上架費，讓店家把資源放回產品與服務本身。",
    icon: "零",
  },
];

const merchantPromises = ["不收廣告費", "不收月費", "不收上架費"];

const entryCards = [
  {
    href: "/courier",
    title: "加入外送員",
    description: "高收入、彈性排班、安全保障，全流程設計都圍繞效率與安心。",
  },
  {
    href: "/merchant",
    title: "店家合作",
    description: "零固定費用、透明條件、品牌不被廣告位綁架，讓好產品被真正看見。",
  },
  {
    href: "/consumer",
    title: "立即訂餐",
    description: "更可靠的配送品質、更乾淨的介面與更安心的食安承諾，今晚就能體驗。",
  },
];

export default function Home() {
  return (
    <main className="pb-10">
      <SiteHeader />

      <section className="hero-grid overflow-hidden">
        <div className="shell grid gap-10 pb-20 pt-14 md:grid-cols-[1.02fr_0.98fr] md:items-center md:pb-28 md:pt-24">
          <FadeIn className="space-y-8">
            <span className="pill bg-yellow text-ink">Blue x Yellow Identity</span>
            <div className="space-y-5">
              <h1 className="section-title max-w-5xl font-[var(--font-manrope)] font-extrabold">
                重新定義外送的品質標準
              </h1>
              <p className="section-copy max-w-2xl">
                蝸牛外送以 Apple 風格的克制、科技感與大量留白，打造一個從品牌到體驗都更高級的外送平台。小蝸寶是我們的主視覺核心，也是一種更穩、更慢但更準的服務哲學。
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/courier"
                className="rounded-full bg-blue px-6 py-3 text-sm font-extrabold text-white transition hover:-translate-y-0.5"
              >
                加入外送員
              </Link>
              <Link
                href="/merchant"
                className="rounded-full border border-ink/10 bg-white/90 px-6 py-3 text-sm font-bold text-ink transition hover:border-blue hover:text-blue"
              >
                店家合作
              </Link>
              <Link
                href="/consumer"
                className="rounded-full border border-yellow/70 bg-yellow px-6 py-3 text-sm font-extrabold text-ink transition hover:-translate-y-0.5"
              >
                立即訂餐
              </Link>
            </div>

            <div className="grid max-w-2xl gap-3 sm:grid-cols-3">
              {[
                { label: "平均送達節奏", value: "18 min" },
                { label: "合作店家固定費", value: "0 元" },
                { label: "配送品質承諾", value: "3 層控管" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="soft-panel rounded-[1.8rem] px-5 py-5 text-center"
                >
                  <p className="text-xs font-bold text-ink/52">{stat.label}</p>
                  <p className="mt-2 font-[var(--font-manrope)] text-2xl font-extrabold">
                    {stat.value}
                  </p>
                </div>
              ))}
            </div>
          </FadeIn>

          <FadeIn delay={0.12}>
            <div className="soft-panel p-4 md:p-7">
              <div className="flex items-center justify-between rounded-full bg-white/72 px-4 py-3 backdrop-blur-xl">
                <div>
                  <p className="font-[var(--font-manrope)] text-xs font-extrabold uppercase tracking-[0.24em] text-blue">
                    Hero Visual
                  </p>
                  <p className="mt-1 text-lg font-bold">小蝸寶主視覺</p>
                </div>
                <div className="rounded-full bg-yellow px-3 py-1 text-sm font-extrabold text-ink">
                  Live
                </div>
              </div>
              <SnailMascot />
            </div>
          </FadeIn>
        </div>
      </section>

      <SectionShell
        badge="Three Audiences"
        title="為消費者、外送員與店家，建立同一套高品質體驗標準。"
        description="不是只做得快，而是讓每一個接觸面都更好看、更穩定、更清楚。蝸牛外送把三種角色放進同一個品牌系統中，讓每個人都得到被尊重的產品體驗。"
      >
        <div className="grid gap-5 md:grid-cols-3">
          {roleHighlights.map((item, index) => (
            <FeatureCard key={item.title} delay={index * 0.08} {...item} />
          ))}
        </div>
      </SectionShell>

      <SectionShell
        badge="Merchant Promise"
        title="對店家最直接的承諾，就是把不必要的固定成本拿掉。"
        description="蝸牛外送主打零廣告費、零月費、零上架費。平台角色是幫助優質店家被看見，而不是靠額外費用佔據曝光資源。"
      >
        <div className="grid gap-4 md:grid-cols-3">
          {merchantPromises.map((promise, index) => (
            <FadeIn
              key={promise}
              delay={index * 0.08}
              className="rounded-[2rem] bg-blue px-6 py-8 text-white shadow-[0_26px_70px_rgba(11,79,212,0.24)]"
            >
              <p className="font-[var(--font-manrope)] text-xs font-extrabold uppercase tracking-[0.24em] text-yellow">
                Promise 0{index + 1}
              </p>
              <p className="mt-4 text-3xl font-bold">{promise}</p>
              <p className="mt-4 text-base leading-8 text-white/76">
                讓合作關係回到產品本身。店家不需要先付出額外固定成本，才能開始提供更好的餐點與服務。
              </p>
            </FadeIn>
          ))}
        </div>
      </SectionShell>

      <SectionShell
        badge="Quality Loop"
        title="一個更慢但更準的品牌哲學，延伸成真正可感的產品細節。"
        description="首頁主視覺、頁面動畫、按鈕節奏與資訊卡設計，都以高級科技感與清晰閱讀性為核心。這不是模板式外送站，而是一個有品牌辨識度的官方網站。"
      >
        <div className="grid gap-5 md:grid-cols-[1.08fr_0.92fr]">
          <FadeIn className="soft-panel p-8 md:p-10">
            <p className="font-[var(--font-manrope)] text-xs font-extrabold uppercase tracking-[0.24em] text-blue">
              Design Direction
            </p>
            <h3 className="mt-4 text-3xl font-bold md:text-4xl">
              留白、玻璃質感、藍黃品牌色與緩慢浮動的動畫，共同構成蝸牛外送的官方語氣。
            </h3>
            <p className="mt-4 max-w-2xl text-base leading-8 text-ink/72">
              從 Hero 區到 CTA，整體視覺都避免過度擁擠。資訊被整理成清楚的區塊，動畫只在關鍵地方出現，營造出接近 Apple 官網的克制感與精密感。
            </p>
          </FadeIn>
          <div className="grid gap-4">
            {[
              "品牌主色聚焦藍色科技感與黃色辨識度",
              "頁面使用漸層光暈與玻璃面板提升質感",
              "CTA 依角色清楚分流，轉換目標更明確",
            ].map((item, index) => (
              <FadeIn
                key={item}
                delay={index * 0.08}
                className="rounded-[2rem] border border-ink/8 bg-white/86 px-6 py-6 text-lg font-bold text-ink shadow-[0_18px_44px_rgba(14,29,56,0.05)]"
              >
                {item}
              </FadeIn>
            ))}
          </div>
        </div>
      </SectionShell>

      <SectionShell
        badge="CTA"
        title="選擇你的角色，直接進入下一步。"
        description="三種 CTA 都已經被拉成主線入口，讓首頁不只是品牌展示，也能直接承接轉換。"
      >
        <div className="grid gap-5 md:grid-cols-3">
          {entryCards.map((item, index) => (
            <FadeIn
              key={item.href}
              delay={index * 0.08}
              className="gradient-border rounded-[2rem] bg-white/82 p-7"
            >
              <p className="font-[var(--font-manrope)] text-xs font-extrabold uppercase tracking-[0.24em] text-blue">
                Direct Entry
              </p>
              <h3 className="mt-3 text-2xl font-bold">{item.title}</h3>
              <p className="mt-3 text-base leading-8 text-ink/72">{item.description}</p>
              <Link
                href={item.href}
                className="mt-6 inline-flex rounded-full bg-yellow px-5 py-3 text-sm font-extrabold text-ink transition hover:-translate-y-0.5"
              >
                前往頁面
              </Link>
            </FadeIn>
          ))}
        </div>
      </SectionShell>

      <Footer />
    </main>
  );
}
