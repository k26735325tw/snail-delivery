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
        title="把品質、安心與食安，做成消費者看得見的外送體驗。"
        description="蝸牛外送不是追求最低成本的流程，而是讓訂餐從介面開始就更乾淨、更可靠。每一次下單，都應該感受到品質被認真對待。"
        primaryHref="/consumer"
        primaryLabel="立即訂餐"
        secondaryHref="/merchant"
        secondaryLabel="店家合作"
        asideTitle="Consumer Snapshot"
        stats={[
          { label: "推薦店家篩選", value: "高品質優先" },
          { label: "配送狀態", value: "即時透明" },
          { label: "食安標準", value: "多層把關" },
        ]}
      />

      <SectionShell
        badge="Trusted Moments"
        title="消費者最在意的三件事，就是品質、安心與食安。"
        description="這個頁面聚焦在訂餐過程裡最關鍵的感受。不是單純說得安心，而是用清楚的結構把信任建立起來。"
      >
        <div className="grid gap-5 md:grid-cols-3">
          <FeatureCard
            eyebrow="Quality"
            title="品質優先"
            description="店家呈現、菜單資訊與配送流程被統一整理，讓消費者更容易辨識值得信任的選擇。"
            icon="質"
          />
          <FeatureCard
            eyebrow="安心"
            title="過程安心"
            description="從下單確認到配送追蹤，每一步狀態都被清楚顯示，減少等待焦慮與資訊落差。"
            icon="心"
            delay={0.1}
          />
          <FeatureCard
            eyebrow="Food Safety"
            title="食安把關"
            description="平台以食安資訊、履約流程與合作標準建立更完整的保護層，讓用戶不只吃得快，也吃得放心。"
            icon="食"
            delay={0.2}
          />
        </div>
      </SectionShell>

      <SectionShell
        badge="Visual Precision"
        title="把外送介面做得更像科技品牌，而不是雜訊密集的促銷牆。"
        description="頁面以 Apple 風格的留白與視覺秩序，讓消費者一眼抓到核心訊息。藍色負責建立穩定感，黃色負責強化品牌記憶點與 CTA。"
      >
        <div className="grid gap-5 md:grid-cols-[1.08fr_0.92fr]">
          <div className="rounded-[2.2rem] bg-blue p-8 text-white shadow-[0_24px_70px_rgba(11,79,212,0.26)]">
            <p className="font-[var(--font-manrope)] text-xs font-extrabold uppercase tracking-[0.24em] text-yellow">
              UX Principle
            </p>
            <h3 className="mt-4 text-3xl font-bold md:text-4xl">
              每個區塊都只留下最重要的訊息，讓信任感被放大。
            </h3>
            <p className="mt-4 max-w-2xl text-base leading-8 text-white/78">
              我們避免過度堆砌的折扣訊號與壓迫式排版，改以精準層次、卡片留白與輕微動態，建立一種更成熟的數位品牌感。
            </p>
          </div>
          <div className="grid gap-4">
            {[
              "清楚的配送進度，降低等待不確定性",
              "高品質店家敘事，提升下單信心",
              "食安資訊不被隱藏，信任感更直接",
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
