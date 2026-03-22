import Link from "next/link";

type FooterProps = {
  siteName: string;
  title: string;
  description: string;
};

export function Footer({ siteName, title, description }: FooterProps) {
  return (
    <footer className="shell pb-10 pt-16">
      <div className="relative overflow-hidden rounded-[2.8rem] bg-[#09152d] px-6 py-9 text-white md:px-10 md:py-12">
        <div className="absolute -left-10 top-8 h-44 w-44 rounded-full bg-blue/25 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-52 w-52 rounded-full bg-yellow/20 blur-3xl" />

        <div className="relative flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="font-[var(--font-manrope)] text-sm font-extrabold uppercase tracking-[0.26em] text-yellow">
              {siteName}
            </p>
            <h2 className="mt-3 text-3xl font-bold md:text-4xl">{title}</h2>
            <p className="mt-4 text-base leading-8 text-white/70">{description}</p>
          </div>
          <div className="flex flex-wrap gap-3 text-sm font-bold text-white/82">
            <Link href="/courier">騎手入口</Link>
            <Link href="/merchant">店家合作</Link>
            <Link href="/consumer">消費者下載</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
