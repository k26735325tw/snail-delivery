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
        title="讓每一次上線，都有更高收入、更大彈性與更完整安全感。"
        description="蝸牛外送把外送員視為品牌體驗的一部分。從派單節奏、收入透明度到安全保護設計，整個系統都圍繞效率與尊重，讓工作感受更穩、更清楚。"
        primaryHref="/courier"
        primaryLabel="加入外送員"
        secondaryHref="/consumer"
        secondaryLabel="立即訂餐"
        asideTitle="Shift Overview"
        stats={[
          { label: "尖峰時段收入", value: "NT$ 2,800+" },
          { label: "排班彈性", value: "自由上線" },
          { label: "安全守護", value: "24/7" },
        ]}
      />

      <SectionShell
        badge="Three Pillars"
        title="收入、彈性、安全，三個核心價值被直接做進流程裡。"
        description="外送員不是只看單量，更在意是否穩定、是否好安排、是否安心。蝸牛外送的頁面語言與產品承諾，都清楚對應這三個需求。"
      >
        <div className="grid gap-5 md:grid-cols-3">
          <FeatureCard
            eyebrow="Income"
            title="收入透明"
            description="每一趟配送的獎勵結構清楚呈現，尖峰加成與趟次節奏一目了然，讓你更容易估算每日收益。"
            icon="收"
          />
          <FeatureCard
            eyebrow="Flexibility"
            title="時間彈性"
            description="支援自由上線與靈活切換時段，讓兼職、全職或特定區域跑單都能找到合適節奏。"
            icon="彈"
            delay={0.1}
          />
          <FeatureCard
            eyebrow="Safety"
            title="安全優先"
            description="從路線資訊、緊急協助到履約保護機制，平台把安全當成日常設計，而不是事後補充。"
            icon="安"
            delay={0.2}
          />
        </div>
      </SectionShell>

      <SectionShell
        badge="Work Rhythm"
        title="更好的工作節奏，來自更少干擾與更清楚的資訊密度。"
        description="頁面延續品牌的留白與精準動線，把重要資訊保留在第一視野，讓外送員能快速理解合作價值，而不是被冗長文案淹沒。"
      >
        <div className="grid gap-5 md:grid-cols-[0.98fr_1.02fr]">
          <div className="rounded-[2.2rem] bg-yellow px-8 py-9 text-ink shadow-[0_24px_60px_rgba(255,216,74,0.28)]">
            <p className="font-[var(--font-manrope)] text-xs font-extrabold uppercase tracking-[0.24em] text-blue">
              Courier Promise
            </p>
            <h3 className="mt-4 text-3xl font-bold">
              用更高品質的派送體驗，換回更長期的收入穩定性。
            </h3>
            <p className="mt-4 text-base leading-8 text-ink/76">
              當系統對資訊呈現更清楚，外送員就能更專注在路線、服務與安全上。這種精簡不是少做，而是把真正重要的內容留下來。
            </p>
          </div>
          <div className="grid gap-4">
            {[
              "高峰獎勵與趟次狀態清楚呈現",
              "自主安排時間，降低排班壓力",
              "平台安全支援常態化，而非臨時補救",
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
