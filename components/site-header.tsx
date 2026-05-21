"use client";

import Image from "next/image";
import Link from "next/link";

import { EditableBlock, EditableImageFrame, EditableLink, EditableText } from "@/components/cms-inline-edit";
import { useCmsVisualEditor } from "@/components/cms-visual-context";
import type { CmsData } from "@/lib/cms-schema";
import { getBlockStyle, getImageStyle, getTextStyle } from "@/lib/cms-style";

type SiteHeaderProps = {
  site: CmsData;
  embedded?: boolean;
  highlighted?: boolean;
};

export function SiteHeader({ site, embedded = false, highlighted = false }: SiteHeaderProps) {
  const editor = useCmsVisualEditor();
  const blockStyle = getBlockStyle(site.home.header.blockStyle);
  const topOffset = embedded ? 0 : editor?.editorTopOffset ?? 0;
  const mobileNavItems = [
    { label: "HOME", href: "/" },
    ...site.home.header.navItems,
    site.home.header.aboutLink,
    site.home.header.cta,
  ].filter((item, index, list) => list.findIndex((entry) => entry.label === item.label && entry.href === item.href) === index);

  return (
    <>
      <header
        className={`z-50 w-full ${embedded ? "top-0" : "fixed inset-x-0"}`}
        style={embedded ? undefined : { top: `${topOffset}px` }}
      >
        <div className="shell py-3 md:py-4">
          <EditableBlock
            selection={{
              id: "home.header.block",
              kind: "block",
              label: "首頁 Header 區塊",
              stylePath: "home.header.blockStyle",
            }}
            className={`flex items-start justify-between gap-3 border bg-white/90 backdrop-blur transition-shadow md:items-center md:gap-4 ${highlighted ? "ring-4 ring-blue/25 shadow-[0_24px_70px_rgba(27,111,255,0.18)]" : ""}`}
            style={blockStyle}
          >
            <Link href="/" className="flex min-w-0 items-center gap-3">
              <EditableImageFrame
                selection={{
                  id: "site.logo",
                  kind: "image",
                  label: "網站 Logo",
                  imagePath: "site.logo",
                  uploadKey: "shared/logo",
                }}
                className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full bg-blue/10"
              >
                <Image
                  src={site.site.logo.url}
                  alt={site.site.logo.alt}
                  width={88}
                  height={88}
                  unoptimized
                  className="h-full w-full"
                  style={getImageStyle(site.site.logo)}
                />
              </EditableImageFrame>

              <div className="min-w-0">
                <EditableText
                  as="p"
                  value={site.site.siteName}
                  className="truncate font-[var(--font-manrope)] text-sm font-extrabold uppercase tracking-[0.28em] text-blue"
                  selection={{
                    id: "site.siteName.header",
                    kind: "text",
                    label: "網站名稱",
                    fieldPath: "site.siteName",
                  }}
                />
                <EditableText
                  as="p"
                  value={site.home.header.subtitle}
                  className="truncate"
                  style={getTextStyle(site.home.header.subtitleStyle)}
                  selection={{
                    id: "home.header.subtitle",
                    kind: "text",
                    label: "Header 副標",
                    fieldPath: "home.header.subtitle",
                    stylePath: "home.header.subtitleStyle",
                  }}
                />
              </div>
            </Link>

            <div className="flex shrink-0 items-start gap-2 md:items-center">
              <div className="hidden items-center gap-2 md:flex">
                <nav className="flex items-center gap-1">
                  {site.home.header.navItems.map((item, index) => (
                    <EditableLink
                      key={`${item.href}-${item.label}-${index}`}
                      href={item.href}
                      value={item.label}
                      className="rounded-full px-4 py-2 text-sm font-bold text-ink/68 no-underline transition hover:bg-white hover:text-blue"
                      selection={{
                        id: `home.header.navItems.${index}`,
                        kind: "link",
                        label: `Header 導航 ${index + 1}`,
                        fieldPath: `home.header.navItems.${index}.label`,
                        hrefPath: `home.header.navItems.${index}.href`,
                      }}
                    />
                  ))}
                  <EditableLink
                    href={site.home.header.aboutLink.href}
                    value={site.home.header.aboutLink.label}
                    className="rounded-full px-4 py-2 text-sm font-bold text-ink/68 no-underline transition hover:bg-white hover:text-blue"
                    selection={{
                      id: "home.header.about-link",
                      kind: "link",
                      label: "Header 關於我們",
                      fieldPath: "home.header.aboutLink.label",
                      hrefPath: "home.header.aboutLink.href",
                    }}
                  />
                </nav>

                <EditableLink
                  href={site.home.header.cta.href}
                  value={site.home.header.cta.label}
                  className="rounded-full bg-blue px-4 py-2 text-sm font-extrabold text-white no-underline transition hover:-translate-y-0.5"
                  selection={{
                    id: "home.header.cta",
                    kind: "link",
                    label: "Header CTA",
                    fieldPath: "home.header.cta.label",
                    hrefPath: "home.header.cta.href",
                  }}
                />
              </div>

              <details className="group relative md:hidden">
                <summary
                  className="list-none appearance-none [&::-webkit-details-marker]:hidden flex cursor-pointer items-center gap-2 rounded-full border border-[#d9e4ff] bg-white px-3 py-2 text-xs font-extrabold text-ink shadow-sm transition hover:border-blue hover:text-blue"
                  aria-label="開啟導覽選單"
                >
                  <span className="flex flex-col gap-1">
                    <span className="h-0.5 w-4 rounded-full bg-current" />
                    <span className="h-0.5 w-4 rounded-full bg-current" />
                    <span className="h-0.5 w-4 rounded-full bg-current" />
                  </span>
                  <span>選單</span>
                </summary>

                <div className="mt-3 w-[min(92vw,320px)] max-w-full overflow-hidden rounded-[1.5rem] border border-[#d9e4ff] bg-white p-3 shadow-[0_24px_70px_rgba(27,111,255,0.16)]">
                  <div className="grid gap-2">
                    {mobileNavItems.map((item) => {
                      if (item.href === "/") {
                        return (
                          <Link
                            key={`${item.label}-${item.href}`}
                            href={item.href}
                            className="rounded-2xl border border-[#eef2ff] px-4 py-3 text-sm font-bold text-ink no-underline transition hover:bg-[#f6f9ff] hover:text-blue"
                          >
                            {item.label}
                          </Link>
                        );
                      }

                      if (item.href === site.home.header.cta.href && item.label === site.home.header.cta.label) {
                        return (
                          <EditableLink
                            key={`${item.label}-${item.href}`}
                            href={item.href}
                            value={item.label}
                            className="rounded-2xl border border-[#eef2ff] px-4 py-3 text-sm font-bold text-ink no-underline transition hover:bg-[#f6f9ff] hover:text-blue"
                            selection={{
                              id: "home.header.cta.mobile",
                              kind: "link",
                              label: "手機版 Header CTA",
                              fieldPath: "home.header.cta.label",
                              hrefPath: "home.header.cta.href",
                            }}
                          />
                        );
                      }

                      if (item.href === site.home.header.aboutLink.href && item.label === site.home.header.aboutLink.label) {
                        return (
                          <EditableLink
                            key={`${item.label}-${item.href}`}
                            href={item.href}
                            value={item.label}
                            className="rounded-2xl border border-[#eef2ff] px-4 py-3 text-sm font-bold text-ink no-underline transition hover:bg-[#f6f9ff] hover:text-blue"
                            selection={{
                              id: "home.header.about-link.mobile",
                              kind: "link",
                              label: "手機版 Header 關於我們",
                              fieldPath: "home.header.aboutLink.label",
                              hrefPath: "home.header.aboutLink.href",
                            }}
                          />
                        );
                      }

                      const navIndex = site.home.header.navItems.findIndex(
                        (navItem) => navItem.label === item.label && navItem.href === item.href,
                      );

                      if (navIndex >= 0) {
                        return (
                          <EditableLink
                            key={`${item.label}-${item.href}`}
                            href={item.href}
                            value={item.label}
                            className="rounded-2xl border border-[#eef2ff] px-4 py-3 text-sm font-bold text-ink no-underline transition hover:bg-[#f6f9ff] hover:text-blue"
                            selection={{
                              id: `home.header.navItems.${navIndex}.mobile`,
                              kind: "link",
                              label: `手機版 Header 導航 ${navIndex + 1}`,
                              fieldPath: `home.header.navItems.${navIndex}.label`,
                              hrefPath: `home.header.navItems.${navIndex}.href`,
                            }}
                          />
                        );
                      }

                      return null;
                    })}
                  </div>
                </div>
              </details>
            </div>
          </EditableBlock>
        </div>
      </header>
      {!embedded ? <div aria-hidden="true" className="h-[138px] md:h-[92px]" /> : null}
    </>
  );
}
