"use client";

import { EditableBlock, EditableLink, EditableText } from "@/components/cms-inline-edit";
import type { CmsData } from "@/lib/cms-schema";
import { getBlockStyle, getTextStyle } from "@/lib/cms-style";

type FooterProps = {
  site: CmsData;
  highlighted?: boolean;
  activeCardKey?: string | null;
  activeCardIndex?: number | null;
};

const activeCardClass = "bg-[rgba(255,248,196,0.72)] ring-2 ring-[#1b6fff]/45 shadow-[0_24px_70px_rgba(27,111,255,0.16)] brightness-[1.02]";

export function Footer({ site, highlighted = false, activeCardKey = null, activeCardIndex = null }: FooterProps) {
  return (
    <footer className="shell pb-10 pt-16">
      <EditableBlock
        selection={{
          id: "site.footer.block",
          kind: "block",
          label: "Footer 區塊",
          stylePath: "site.footerStyle",
        }}
        className={`relative overflow-hidden border transition-shadow ${highlighted ? "ring-4 ring-blue/25 shadow-[0_24px_70px_rgba(27,111,255,0.18)]" : ""}`}
        style={getBlockStyle(site.site.footerStyle)}
      >
        <div className="absolute -left-10 top-8 h-44 w-44 rounded-full bg-blue/25 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-52 w-52 rounded-full bg-yellow/20 blur-3xl" />

        <div className="relative grid gap-8 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,0.9fr)] lg:items-start">
          <div className={`max-w-2xl transition-shadow ${activeCardKey === "footer-main" ? activeCardClass : ""}`} data-preview-card-key="footer-main">
            <p className="font-[var(--font-manrope)] text-sm font-extrabold uppercase tracking-[0.26em] text-yellow">
              {site.site.siteName}
            </p>
            <EditableText
              as="h2"
              value={site.site.footerTitle}
              className="mt-3"
              style={getTextStyle(site.site.footerTitleStyle)}
              multiline
              selection={{
                id: "site.footer.title",
                kind: "text",
                label: "Footer 標題",
                fieldPath: "site.footerTitle",
                stylePath: "site.footerTitleStyle",
                multiline: true,
              }}
            />
            <EditableText
              as="p"
              value={site.site.footerDescription}
              className="mt-4"
              style={getTextStyle(site.site.footerDescriptionStyle)}
              multiline
              selection={{
                id: "site.footer.description",
                kind: "text",
                label: "Footer 說明文",
                fieldPath: "site.footerDescription",
                stylePath: "site.footerDescriptionStyle",
                multiline: true,
              }}
            />
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            {site.site.footerLinkGroups.map((group, groupIndex) => (
              <div
                key={group.title}
                className={`min-w-0 transition-shadow ${activeCardKey === "footer-link-group" && activeCardIndex === groupIndex ? activeCardClass : ""}`}
                data-preview-card-key="footer-link-group"
                data-preview-card-index={groupIndex}
              >
                <EditableText
                  as="p"
                  value={group.title}
                  className="text-sm font-extrabold uppercase tracking-[0.2em] text-yellow/90"
                  selection={{
                    id: `site.footerLinkGroups.${groupIndex}.title`,
                    kind: "text",
                    label: `Footer 連結群組 ${groupIndex + 1}`,
                    fieldPath: `site.footerLinkGroups.${groupIndex}.title`,
                  }}
                />
                <div className="mt-4 grid gap-3 text-sm font-bold text-white/82">
                  {group.links.map((link, linkIndex) => (
                    <EditableLink
                      key={`${group.title}-${link.href}-${link.label}-${linkIndex}`}
                      href={link.href}
                      value={link.label}
                      selection={{
                        id: `site.footerLinkGroups.${groupIndex}.links.${linkIndex}`,
                        kind: "link",
                        label: `Footer 連結 ${groupIndex + 1}-${linkIndex + 1}`,
                        fieldPath: `site.footerLinkGroups.${groupIndex}.links.${linkIndex}.label`,
                        hrefPath: `site.footerLinkGroups.${groupIndex}.links.${linkIndex}.href`,
                      }}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </EditableBlock>
    </footer>
  );
}
