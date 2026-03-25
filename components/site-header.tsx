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
            className={`flex flex-wrap items-center justify-between gap-4 border bg-white/90 backdrop-blur transition-shadow ${highlighted ? "ring-4 ring-blue/25 shadow-[0_24px_70px_rgba(27,111,255,0.18)]" : ""}`}
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

            <div className="flex flex-wrap items-center justify-end gap-2">
              <nav className="hidden items-center gap-1 md:flex">
                {site.home.header.navItems.map((item, index) => (
                  <EditableLink
                    key={`${item.href}-${item.label}-${index}`}
                    href={item.href}
                    value={item.label}
                    className="rounded-full px-4 py-2 text-sm font-bold text-ink/68 transition hover:bg-white hover:text-blue"
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
                  className="rounded-full px-4 py-2 text-sm font-bold text-ink/68 transition hover:bg-white hover:text-blue"
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
                className="rounded-full bg-blue px-4 py-2 text-sm font-extrabold text-white transition hover:-translate-y-0.5"
                selection={{
                  id: "home.header.cta",
                  kind: "link",
                  label: "Header CTA",
                  fieldPath: "home.header.cta.label",
                  hrefPath: "home.header.cta.href",
                }}
              />
            </div>
          </EditableBlock>
        </div>
      </header>
      {!embedded ? <div aria-hidden="true" className="h-[84px] md:h-[92px]" /> : null}
    </>
  );
}
