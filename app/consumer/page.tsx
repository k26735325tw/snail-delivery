import { FeatureCard } from "@/components/feature-card";
import { Footer } from "@/components/footer";
import { PageHero } from "@/components/page-hero";
import { SectionShell } from "@/components/section-shell";
import { SiteHeader } from "@/components/site-header";

export default function ConsumerPage() {
  return (
    <main className="pb-10">
      <SiteHeader />
      <PageHero
        badge="Consumer Experience"
        title="從下單到送達，每一步都看得見。"
        description="GoGet 為消費者提供穩定透明的配送體驗，讓你知道餐點何時出發、何時抵達，以及誰正在為你配送。"
        primaryHref="/consumer"
        primaryLabel="開始訂購"
        secondaryHref="/merchant"
        secondaryLabel="查看商家方案"
        asideTitle="Consumer Snapshot"
        stats={[
          { label: "平均等待時間", value: "28 分鐘" },
          { label: "配送進度更新", value: "即時" },
          { label: "客服回應", value: "7 x 12" },
        ]}
      />

      <SectionShell
        badge="Trusted Moments"
        title="把配送焦慮降到最低，讓使用者只需要等餐點。"
        description="每一次狀態變更都會同步回到前台，使用者不需要反覆切換頁面或猜測配送進度。"
      >
        <div className="grid gap-5 md:grid-cols-3">
          <FeatureCard
            eyebrow="Quality"
            title="餐點狀態清楚"
            description="從接單、製作、取餐到送達，每個節點都能追蹤，降低等待時的不確定感。"
            icon="餐"
          />
          <FeatureCard
            eyebrow="Updates"
            title="通知節奏剛好"
            description="不過度打擾，也不讓人失聯。使用者只會在重要節點收到清楚的進度通知。"
            icon="訊"
            delay={0.1}
          />
          <FeatureCard
            eyebrow="Food Safety"
            title="配送品質穩定"
            description="透過標準化交接與明確路線安排，確保餐點能以合理狀態送到消費者手上。"
            icon="安"
            delay={0.2}
          />
        </div>
      </SectionShell>

      <SectionShell
        badge="Visual Precision"
        title="介面不是裝飾，而是幫助使用者快速理解狀態。"
        description="從首頁主視覺到資訊卡片，設計都圍繞在資訊辨識效率與品牌記憶點。"
      >
        <div className="grid gap-5 md:grid-cols-[1.08fr_0.92fr]">
          <div className="rounded-[2.2rem] bg-blue p-8 text-white shadow-[0_24px_70px_rgba(11,79,212,0.26)]">
            <p className="font-[var(--font-manrope)] text-xs font-extrabold uppercase tracking-[0.24em] text-yellow">
              UX Principle
            </p>
            <h3 className="mt-4 text-3xl font-bold md:text-4xl">
              少一點干擾，多一點可預期，才是配送服務最重要的體驗。
            </h3>
            <p className="mt-4 max-w-2xl text-base leading-8 text-white/78">
              當使用者能快速理解目前狀態、預估送達時間與可能延遲原因，信任感就不需要靠額外說服建立。
            </p>
          </div>
          <div className="grid gap-4">
            {[
              "重要資訊優先顯示，避免內容層級混亂。",
              "配送進度與 CTA 使用明確視覺對比。",
              "每個頁面都能在手機上快速完成任務。",
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
