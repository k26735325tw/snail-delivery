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
              讓每一次送達，都像官方級體驗一樣精準。
            </h2>
            <p className="mt-4 text-base leading-8 text-white/70">
              蝸牛外送用更穩定的履約、更透明的制度與更乾淨的視覺語言，重新定義外送的品質標準。
            </p>
          </div>
          <div className="flex flex-wrap gap-3 text-sm font-bold text-white/82">
            <Link href="/courier">加入外送員</Link>
            <Link href="/merchant">店家合作</Link>
            <Link href="/consumer">立即訂餐</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
