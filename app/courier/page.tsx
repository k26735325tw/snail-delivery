import { FeatureCard } from "@/components/feature-card";
import { Footer } from "@/components/footer";
import { PageHero } from "@/components/page-hero";
import { SectionShell } from "@/components/section-shell";
import { SiteHeader } from "@/components/site-header";

export default function CourierPage() {
  return (
    <main className="pb-10">
      <SiteHeader />
      <PageHero
        badge="Courier Experience"
        title="排班有彈性，收入有秩序，交付也有標準。"
        description="GoGet 讓配送員清楚知道每個班次、訂單與獎勵條件，避免靠猜測工作，也減少現場摩擦。"
        primaryHref="/courier"
        primaryLabel="查看班表"
        secondaryHref="/consumer"
        secondaryLabel="切換消費者頁面"
        asideTitle="Shift Overview"
        stats={[
          { label: "熱門時段獎勵", value: "NT$ 2,800+" },
          { label: "排班調整", value: "按週更新" },
          { label: "支援時段", value: "24 / 7" },
        ]}
      />

      <SectionShell
        badge="Three Pillars"
        title="把配送員最在意的三件事講清楚：收入、彈性與安全。"
        description="制度設計越透明，配送員越能專注在執行，而不是花時間理解規則。"
      >
        <div className="grid gap-5 md:grid-cols-3">
          <FeatureCard
            eyebrow="Income"
            title="收入模型透明"
            description="每筆訂單、尖峰加成與額外獎勵都能被說明，避免配送員對報酬結構產生不必要疑慮。"
            icon="薪"
          />
          <FeatureCard
            eyebrow="Flexibility"
            title="接單節奏可調"
            description="可依據個人時段安排工作，不需要被固定班表綁死，同時維持平台運作穩定。"
            icon="班"
            delay={0.1}
          />
          <FeatureCard
            eyebrow="Safety"
            title="交付流程有規範"
            description="從取貨到交件都有標準流程，讓配送品質一致，也降低現場溝通成本。"
            icon="盾"
            delay={0.2}
          />
        </div>
      </SectionShell>

      <SectionShell
        badge="Work Rhythm"
        title="讓每日節奏清楚，配送員才有辦法長期留在系統裡。"
        description="好的配送後台不是只有派單，更包含節奏管理、風險提醒與合理的工作預期。"
      >
        <div className="grid gap-5 md:grid-cols-[0.98fr_1.02fr]">
          <div className="rounded-[2.2rem] bg-yellow px-8 py-9 text-ink shadow-[0_24px_60px_rgba(255,216,74,0.28)]">
            <p className="font-[var(--font-manrope)] text-xs font-extrabold uppercase tracking-[0.24em] text-blue">
              Courier Promise
            </p>
            <h3 className="mt-4 text-3xl font-bold">
              配送員不需要更努力地猜，只需要更有效率地跑單。
            </h3>
            <p className="mt-4 text-base leading-8 text-ink/76">
              透過一致的任務資訊與明確的班次規則，平台可以同時提升效率、留任率與實際交付品質。
            </p>
          </div>
          <div className="grid gap-4">
            {[
              "訂單資訊在接單前就完整揭露。",
              "每個班次都有明確的起訖與支援範圍。",
              "異常狀況可快速回報並進入處理流程。",
            ].map((item) => (
              <div
                key={item}
                className="rounded-[2rem] border border-ink/8 bg-white/86 px-6 py-5 text-lg font-bold text-ink shadow-[0_18px_44px_rgba(14,29,56,0.05)]"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </SectionShell>

      <Footer />
    </main>
  );
}
