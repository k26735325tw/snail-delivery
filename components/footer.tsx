import Link from "next/link";

export function Footer() {
  return (
    <footer className="shell pb-10 pt-16">
      <div className="relative overflow-hidden rounded-[2.8rem] bg-[#09152d] px-6 py-9 text-white md:px-10 md:py-12">
        <div className="absolute -left-10 top-8 h-44 w-44 rounded-full bg-blue/25 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-52 w-52 rounded-full bg-yellow/20 blur-3xl" />

        <div className="relative flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="font-[var(--font-manrope)] text-sm font-extrabold uppercase tracking-[0.26em] text-yellow">
              Snail Delivery
            </p>
            <h2 className="mt-3 text-3xl font-bold md:text-4xl">
              把品牌內容、配送流程與後台管理整合在同一個網站裡。
            </h2>
            <p className="mt-4 text-base leading-8 text-white/70">
              前台提供清楚的服務說明，後台則讓團隊可以直接更新首頁資料，適合展示輕量型內容管理流程。
            </p>
          </div>
          <div className="flex flex-wrap gap-3 text-sm font-bold text-white/82">
            <Link href="/courier">成為配送員</Link>
            <Link href="/merchant">商家合作</Link>
            <Link href="/consumer">立即下單</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
