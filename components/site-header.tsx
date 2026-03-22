import Link from "next/link";

const navItems = [
  { href: "/consumer", label: "消費者" },
  { href: "/courier", label: "配送員" },
  { href: "/merchant", label: "商家" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50">
      <div className="shell pt-5">
        <div className="glass flex items-center justify-between rounded-full px-4 py-3 md:px-6">
          <Link href="/" className="flex items-center gap-3">
            <div className="relative flex h-11 w-11 items-center justify-center rounded-full bg-blue">
              <div className="absolute h-5 w-5 rounded-full bg-yellow" />
              <div className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-white" />
            </div>
            <div>
              <p className="font-[var(--font-manrope)] text-sm font-extrabold uppercase tracking-[0.28em] text-blue">
                Snail Delivery
              </p>
              <p className="text-sm text-ink/55">慢速，但值得信任的配送服務</p>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            <nav className="hidden items-center gap-1 md:flex">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-full px-4 py-2 text-sm font-bold text-ink/68 transition hover:bg-white hover:text-blue"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <Link
              href="/consumer"
              className="rounded-full bg-blue px-4 py-2 text-sm font-extrabold text-white transition hover:-translate-y-0.5"
            >
              立即體驗
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
