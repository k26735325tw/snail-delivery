"use client";

import Image from "next/image";

import { EditableBlock, EditableImageFrame, EditableLink, EditableText } from "@/components/cms-inline-edit";
import { FadeIn } from "@/components/fade-in";
import { SnailMascot } from "@/components/snail-mascot";
import type { CmsRoleHero } from "@/lib/cms-schema";
import { getBlockStyle, getImageHeight, getImageStyle, getTextStyle } from "@/lib/cms-style";

type PageHeroProps = {
  hero: CmsRoleHero;
  highlighted?: boolean;
  pathPrefix?: string;
};

export function PageHero({ hero, highlighted = false, pathPrefix = "role.hero" }: PageHeroProps) {
  return (
    <section className={`hero-grid overflow-hidden transition-shadow ${highlighted ? "ring-4 ring-blue/25" : ""}`} data-preview-section="hero">
      <div className="shell grid gap-10 pb-20 pt-14 md:grid-cols-[1.04fr_0.96fr] md:items-center md:pb-24 md:pt-20">
        <FadeIn className="space-y-7">
          <EditableText
            as="span"
            value={hero.badge}
            className="pill bg-yellow text-ink"
            style={getTextStyle(hero.badgeStyle)}
            selection={{
              id: `${pathPrefix}.badge`,
              kind: "text",
              label: "Hero Badge",
              fieldPath: `${pathPrefix}.badge`,
              stylePath: `${pathPrefix}.badgeStyle`,
            }}
          />
          <div className="space-y-5">
            <EditableText
              as="h1"
              value={hero.title}
              className="max-w-4xl font-[var(--font-manrope)]"
              style={getTextStyle(hero.titleStyle)}
              multiline
              selection={{
                id: `${pathPrefix}.title`,
                kind: "text",
                label: "Hero 標題",
                fieldPath: `${pathPrefix}.title`,
                stylePath: `${pathPrefix}.titleStyle`,
                multiline: true,
              }}
            />
            <EditableText
              as="p"
              value={hero.description}
              className="max-w-2xl"
              style={getTextStyle(hero.descriptionStyle)}
              multiline
              selection={{
                id: `${pathPrefix}.description`,
                kind: "text",
                label: "Hero 內文",
                fieldPath: `${pathPrefix}.description`,
                stylePath: `${pathPrefix}.descriptionStyle`,
                multiline: true,
              }}
            />
          </div>
          <div className="flex flex-wrap gap-3">
            <EditableLink
              href={hero.primaryHref}
              value={hero.primaryLabel}
              className="rounded-full bg-blue px-6 py-3 text-sm font-extrabold text-white transition hover:-translate-y-0.5"
              selection={{
                id: `${pathPrefix}.primary`,
                kind: "link",
                label: "Hero 主按鈕",
                fieldPath: `${pathPrefix}.primaryLabel`,
                hrefPath: `${pathPrefix}.primaryHref`,
              }}
            />
            {hero.secondaryHref && hero.secondaryLabel ? (
              <EditableLink
                href={hero.secondaryHref}
                value={hero.secondaryLabel}
                className="rounded-full border border-ink/10 bg-white/90 px-6 py-3 text-sm font-bold text-ink transition hover:border-blue hover:text-blue"
                selection={{
                  id: `${pathPrefix}.secondary`,
                  kind: "link",
                  label: "Hero 次按鈕",
                  fieldPath: `${pathPrefix}.secondaryLabel`,
                  hrefPath: `${pathPrefix}.secondaryHref`,
                }}
              />
            ) : null}
          </div>
        </FadeIn>

        <FadeIn delay={0.12}>
          <EditableBlock
            selection={{
              id: `${pathPrefix}.block`,
              kind: "block",
              label: "Hero 右側區塊",
              stylePath: `${pathPrefix}.sectionStyle`,
            }}
          >
            <div className="soft-panel border" style={getBlockStyle(hero.sectionStyle)}>
              <div className="grid gap-5 md:grid-cols-[0.92fr_1.08fr] md:items-center">
                <div>
                  <EditableText
                    as="div"
                    value={hero.asideTitle}
                    className="mb-4 inline-flex rounded-full bg-blue/10 px-4 py-2"
                    style={getTextStyle(hero.asideTitleStyle)}
                    selection={{
                      id: `${pathPrefix}.asideTitle`,
                      kind: "text",
                      label: "Hero 右側標題",
                      fieldPath: `${pathPrefix}.asideTitle`,
                      stylePath: `${pathPrefix}.asideTitleStyle`,
                    }}
                  />
                  <div className="grid gap-4">
                    {hero.stats.map((stat, index) => (
                      <div
                        key={stat.label}
                        className="rounded-[1.8rem] border border-white/90 bg-white/80 p-5 backdrop-blur-xl"
                      >
                        <EditableText
                          as="p"
                          value={stat.label}
                          className="text-sm font-semibold text-ink/55"
                          selection={{
                            id: `${pathPrefix}.stats.${index}.label`,
                            kind: "text",
                            label: `Hero 統計標籤 ${index + 1}`,
                            fieldPath: `${pathPrefix}.stats.${index}.label`,
                          }}
                        />
                        <EditableText
                          as="p"
                          value={stat.value}
                          className="mt-2 font-[var(--font-manrope)] text-3xl font-extrabold text-ink"
                          selection={{
                            id: `${pathPrefix}.stats.${index}.value`,
                            kind: "text",
                            label: `Hero 統計數值 ${index + 1}`,
                            fieldPath: `${pathPrefix}.stats.${index}.value`,
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {hero.heroImage.url ? (
                  <EditableImageFrame
                    selection={{
                      id: `${pathPrefix}.heroImage`,
                      kind: "image",
                      label: "Hero 圖片",
                      imagePath: `${pathPrefix}.heroImage`,
                      uploadKey: `${pathPrefix.split(".")[0]}/hero`,
                    }}
                    className="overflow-hidden rounded-[2rem] border border-white/90 bg-white/75 shadow-[0_18px_50px_rgba(14,29,56,0.08)]"
                  >
                    <div className="relative w-full">
                      <Image
                        src={hero.heroImage.url}
                        alt={hero.heroImage.alt}
                        width={1600}
                        height={hero.heroImage.desktopHeight}
                        unoptimized
                        className="w-full"
                        style={{
                          ...getImageStyle(hero.heroImage),
                          height: getImageHeight(hero.heroImage),
                        }}
                      />
                    </div>
                  </EditableImageFrame>
                ) : (
                  <SnailMascot compact />
                )}
              </div>
            </div>
          </EditableBlock>
        </FadeIn>
      </div>
    </section>
  );
}
