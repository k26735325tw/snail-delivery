import Link from "next/link";

import type { CmsData } from "@/lib/cms-schema";
import { getBlockStyle, getTextStyle } from "@/lib/cms-style";

type FooterProps = {
  site: CmsData;
  highlighted?: boolean;
};

export function Footer({ site, highlighted = false }: FooterProps) {
  return (
    <footer className="shell pb-10 pt-16">
      <div
        className={`relative overflow-hidden border transition-shadow ${highlighted ? "ring-4 ring-blue/25 shadow-[0_24px_70px_rgba(27,111,255,0.18)]" : ""}`}
        style={getBlockStyle(site.site.footerStyle)}
        data-preview-section="footer"
      >
        <div className="absolute -left-10 top-8 h-44 w-44 rounded-full bg-blue/25 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-52 w-52 rounded-full bg-yellow/20 blur-3xl" />

        <div className="relative grid gap-8 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,0.9fr)] lg:items-start">
          <div className="max-w-2xl">
            <p className="font-[var(--font-manrope)] text-sm font-extrabold uppercase tracking-[0.26em] text-yellow">
              {site.site.siteName}
            </p>
            <h2 className="mt-3" style={getTextStyle(site.site.footerTitleStyle)}>
              {site.site.footerTitle}
            </h2>
            <p className="mt-4" style={getTextStyle(site.site.footerDescriptionStyle)}>
              {site.site.footerDescription}
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            {site.site.footerLinkGroups.map((group) => (
              <div key={group.title} className="min-w-0">
                <p className="text-sm font-extrabold uppercase tracking-[0.2em] text-yellow/90">
                  {group.title}
                </p>
                <div className="mt-4 grid gap-3 text-sm font-bold text-white/82">
                  {group.links.map((link) => (
                    <Link key={`${group.title}-${link.href}-${link.label}`} href={link.href}>
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
