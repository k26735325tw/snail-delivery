import { FeatureCard } from "@/components/feature-card";
import { Footer } from "@/components/footer";
import { PageHero } from "@/components/page-hero";
import { SectionShell } from "@/components/section-shell";
import { SiteHeader } from "@/components/site-header";

const zeroFeeItems = ["月費 0 元", "上架費 0 元", "抽成方案透明"];

export default function MerchantPage() {
  return (
    <main className="pb-10">
      <SiteHeader />
      <PageHero
        badge="Merchant Experience"
        title="讓商家快速上線，也讓營運成本保持可控。"
        description="GoGet 為商家整理出清楚的合作方案、曝光方式與後續管理流程，降低加入門檻。"
        primaryHref="/merchant"
        primaryLabel="查看合作方案"
        secondaryHref="/consumer"
        secondaryLabel="查看前台體驗"
        asideTitle="Merchant Snapshot"
        stats={[
          { label: "月費", value: "0 元" },
          { label: "上架費", value: "0 元" },
          { label: "開通時間", value: "3 天內" },
        ]}
      />

      <SectionShell
        badge="Zero Fixed Fees"
        title="先讓商家開始賣，再討論如何把營運做大。"
        description="對中小型餐飲品牌來說，最重要的不是華麗方案，而是成本結構夠清楚、夠容易理解。"
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
                商家可以先驗證需求與訂單量，再決定擴大合作，不必一開始就承擔固定成本壓力。
              </p>
            </div>
          ))}
        </div>
      </SectionShell>

      <SectionShell
        badge="Merchant Tools"
        title="把曝光、營運與品牌呈現整合成一套可落地的流程。"
        description="商家不需要複雜系統，也能用最少步驟完成上架、更新資訊與查看合作內容。"
      >
        <div className="grid gap-5 md:grid-cols-3">
          <FeatureCard
            eyebrow="Exposure"
            title="首頁與品牌曝光"
            description="商家資訊能快速進入前台展示，幫助新品牌建立第一層能見度。"
            icon="曝"
          />
          <FeatureCard
            eyebrow="Operations"
            title="合作流程簡化"
            description="從初次洽談、資料提交到上線，都用更精簡的步驟降低溝通成本。"
            icon="營"
            delay={0.1}
          />
          <FeatureCard
            eyebrow="Brand"
            title="品牌內容可調整"
            description="透過後台維護首頁資料，商家能更快更新文案與亮點，不必等待重新部署。"
            icon="牌"
            delay={0.2}
          />
        </div>
      </SectionShell>

      <SectionShell
        badge="Why It Matters"
        title="對商家來說，真正重要的是能否用低風險開始，並持續經營。"
        description="好的商家頁面不是只說服合作，而是讓品牌理解加入後的實際運作方式。"
      >
        <div className="rounded-[2.4rem] border border-ink/8 bg-white/90 p-7 shadow-[0_22px_60px_rgba(14,29,56,0.06)] md:p-10">
          <p className="font-[var(--font-manrope)] text-xs font-extrabold uppercase tracking-[0.26em] text-blue">
            Merchant Promise
          </p>
          <h3 className="mt-4 text-3xl font-bold md:text-4xl">
            先把規則講清楚，再把合作做長久。
          </h3>
          <p className="mt-4 max-w-3xl text-base leading-8 text-ink/72">
            商家一旦知道費用、上線流程與內容更新方式，就能更快做出決策，也更願意把品牌交給平台一起經營。
          </p>
        </div>
      </SectionShell>

      <Footer />
    </main>
  );
}
