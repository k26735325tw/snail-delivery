import Image from "next/image";
import Link from "next/link";

type SiteHeaderProps = {
  siteName: string;
  logoUrl: string;
};

const navItems = [
  { href: "/consumer", label: "消費者" },
  { href: "/courier", label: "騎手" },
  { href: "/merchant", label: "店家" },
  { href: "/admin", label: "CMS" },
];

export function SiteHeader({ siteName, logoUrl }: SiteHeaderProps) {
  return (
    <header className="sticky top-0 z-50">
      <div className="shell pt-5">
        <div className="glass flex items-center justify-between rounded-full px-4 py-3 md:px-6">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full bg-blue">
              <Image
                src={logoUrl}
                alt={siteName}
                width={44}
                height={44}
                unoptimized
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <p className="font-[var(--font-manrope)] text-sm font-extrabold uppercase tracking-[0.28em] text-blue">
                {siteName}
              </p>
              <p className="text-sm text-ink/55">CMS 驅動的外送品牌站</p>
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
              下載 App
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
