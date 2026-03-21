import { FeatureCard } from "@/components/feature-card";
import { Footer } from "@/components/footer";
import { PageHero } from "@/components/page-hero";
import { SectionShell } from "@/components/section-shell";
import { SiteHeader } from "@/components/site-header";

const zeroFeeItems = ["不收廣告費", "不收月費", "不收上架費"];

export default function MerchantPage() {
  return (
    <main className="pb-10">
      <SiteHeader />
      <PageHero
        badge="Merchant Experience"
        title="讓店家把預算留給產品本身，而不是浪費在固定平台成本。"
        description="蝸牛外送為店家設計的合作頁面，核心訊息非常直接。不收廣告費、不收月費、不收上架費，讓平台真正成為成長夥伴，而不是額外壓力來源。"
        primaryHref="/merchant"
        primaryLabel="店家合作"
        secondaryHref="/consumer"
        secondaryLabel="立即訂餐"
        asideTitle="Merchant Snapshot"
        stats={[
          { label: "廣告費", value: "0 元" },
          { label: "月費", value: "0 元" },
          { label: "上架費", value: "0 元" },
        ]}
      />

      <SectionShell
        badge="Zero Fixed Fees"
        title="三個零成本承諾，直接定義蝸牛外送與其他平台的差異。"
        description="這不是話術，而是最清楚的商業立場。平台不靠固定收費壓縮店家，而是讓好店用產品、服務與履約能力被看見。"
      >
        <div className="grid gap-5 md:grid-cols-3">
          {zeroFeeItems.map((item, index) => (
            <div
              key={item}
              className="rounded-[2rem] bg-blue px-6 py-8 text-white shadow-[0_26px_70px_rgba(11,79,212,0.24)]"
            >
              <p className="font-[var(--font-manrope)] text-xs font-extrabold uppercase tracking-[0.24em] text-yellow">
                Zero Fee 0{index + 1}
              </p>
              <h3 className="mt-4 text-3xl font-bold">{item}</h3>
              <p className="mt-4 text-base leading-8 text-white/78">
                合作從一開始就降低負擔，讓店家能把資源集中在菜單品質、營運效率與品牌經營。
              </p>
            </div>
          ))}
        </div>
      </SectionShell>

      <SectionShell
        badge="Merchant Tools"
        title="不只費用透明，連合作訊息都要足夠清楚。"
        description="店家頁面不是單向促銷，而是用更高級、更有秩序的方式說明合作價值，讓品牌形象與商業條件同時被看見。"
      >
        <div className="grid gap-5 md:grid-cols-3">
          <FeatureCard
            eyebrow="Exposure"
            title="不靠買廣告換曝光"
            description="店家不需要因為預算多寡才能被發現，平台會用更公平的呈現方式讓好產品得到自然關注。"
            icon="廣"
          />
          <FeatureCard
            eyebrow="Operations"
            title="降低固定營運壓力"
            description="沒有月費與上架費，代表合作門檻更低，店家可以更靈活地評估是否擴大線上通路。"
            icon="營"
            delay={0.1}
          />
          <FeatureCard
            eyebrow="Brand"
            title="品牌價值被放大"
            description="簡潔、科技感與高級留白的官方網站，也能反向提升合作店家的品牌感受與可信度。"
            icon="牌"
            delay={0.2}
          />
        </div>
      </SectionShell>

      <SectionShell
        badge="Why It Matters"
        title="真正好的平台合作，應該讓店家感到更自由，而不是更被綁住。"
        description="當合作條件清楚、固定成本歸零，店家就能把注意力放回餐點品質、服務細節與回購體驗。這才是長期競爭力的來源。"
      >
        <div className="rounded-[2.4rem] border border-ink/8 bg-white/90 p-7 shadow-[0_22px_60px_rgba(14,29,56,0.06)] md:p-10">
          <p className="font-[var(--font-manrope)] text-xs font-extrabold uppercase tracking-[0.26em] text-blue">
            Merchant Promise
          </p>
          <h3 className="mt-4 text-3xl font-bold md:text-4xl">
            不收廣告費，不收月費，不收上架費。
          </h3>
          <p className="mt-4 max-w-3xl text-base leading-8 text-ink/72">
            這個承諾被放在店家頁最核心的位置，因為它不只是條件，更是品牌態度。蝸牛外送希望合作是健康的、長期的，也讓店家能真正感受到被尊重。
          </p>
        </div>
      </SectionShell>

      <Footer />
    </main>
  );
}
