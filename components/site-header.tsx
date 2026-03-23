import Image from "next/image";
import Link from "next/link";

import type { CmsData } from "@/lib/cms-schema";
import { getBlockStyle, getImageStyle, getTextStyle } from "@/lib/cms-style";

type SiteHeaderProps = {
  site: CmsData;
  embedded?: boolean;
  highlighted?: boolean;
};

export function SiteHeader({ site, embedded = false, highlighted = false }: SiteHeaderProps) {
  const blockStyle = getBlockStyle(site.home.header.blockStyle);

  return (
    <header className={embedded ? "top-0 z-20" : "sticky top-0 z-50"}>
      <div className="shell pt-5">
        <div
          className={`flex flex-wrap items-center justify-between gap-4 border backdrop-blur transition-shadow ${highlighted ? "ring-4 ring-blue/25 shadow-[0_24px_70px_rgba(27,111,255,0.18)]" : ""}`}
          style={blockStyle}
          data-preview-section="header"
        >
          <Link href="/" className="flex min-w-0 items-center gap-3">
            <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full bg-blue/10">
              <Image
                src={site.site.logo.url}
                alt={site.site.logo.alt}
                width={88}
                height={88}
                unoptimized
                className="h-full w-full"
                style={getImageStyle(site.site.logo)}
              />
            </div>
            <div className="min-w-0">
              <p className="truncate font-[var(--font-manrope)] text-sm font-extrabold uppercase tracking-[0.28em] text-blue">
                {site.site.siteName}
              </p>
              <p className="truncate" style={getTextStyle(site.home.header.subtitleStyle)}>
                {site.home.header.subtitle}
              </p>
            </div>
          </Link>

          <div className="flex flex-wrap items-center justify-end gap-2">
            <nav className="hidden items-center gap-1 md:flex">
              {site.home.header.navItems.map((item) => (
                <Link
                  key={`${item.href}-${item.label}`}
                  href={item.href}
                  className="rounded-full px-4 py-2 text-sm font-bold text-ink/68 transition hover:bg-white hover:text-blue"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <Link
              href={site.home.header.cta.href}
              className="rounded-full bg-blue px-4 py-2 text-sm font-extrabold text-white transition hover:-translate-y-0.5"
            >
              {site.home.header.cta.label}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
