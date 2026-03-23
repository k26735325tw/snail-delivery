import Image from "next/image";
import Link from "next/link";

import { FadeIn } from "@/components/fade-in";
import { SnailMascot } from "@/components/snail-mascot";
import type { CmsRoleHero } from "@/lib/cms-schema";
import { getBlockStyle, getImageHeight, getImageStyle, getTextStyle } from "@/lib/cms-style";

type PageHeroProps = {
  hero: CmsRoleHero;
};

export function PageHero({ hero }: PageHeroProps) {
  return (
    <section className="hero-grid overflow-hidden">
      <div className="shell grid gap-10 pb-20 pt-14 md:grid-cols-[1.04fr_0.96fr] md:items-center md:pb-24 md:pt-20">
        <FadeIn className="space-y-7">
          <span className="pill bg-yellow text-ink" style={getTextStyle(hero.badgeStyle)}>
            {hero.badge}
          </span>
          <div className="space-y-5">
            <h1 className="max-w-4xl font-[var(--font-manrope)]" style={getTextStyle(hero.titleStyle)}>
              {hero.title}
            </h1>
            <p className="max-w-2xl" style={getTextStyle(hero.descriptionStyle)}>
              {hero.description}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href={hero.primaryHref}
              className="rounded-full bg-blue px-6 py-3 text-sm font-extrabold text-white transition hover:-translate-y-0.5"
            >
              {hero.primaryLabel}
            </Link>
            {hero.secondaryHref && hero.secondaryLabel ? (
              <Link
                href={hero.secondaryHref}
                className="rounded-full border border-ink/10 bg-white/90 px-6 py-3 text-sm font-bold text-ink transition hover:border-blue hover:text-blue"
              >
                {hero.secondaryLabel}
              </Link>
            ) : null}
          </div>
        </FadeIn>

        <FadeIn delay={0.12}>
          <div className="soft-panel border" style={getBlockStyle(hero.sectionStyle)}>
            <div className="grid gap-5 md:grid-cols-[0.92fr_1.08fr] md:items-center">
              <div>
                <div className="mb-4 inline-flex rounded-full bg-blue/10 px-4 py-2" style={getTextStyle(hero.asideTitleStyle)}>
                  {hero.asideTitle}
                </div>
                <div className="grid gap-4">
                  {hero.stats.map((stat) => (
                    <div
                      key={stat.label}
                      className="rounded-[1.8rem] border border-white/90 bg-white/80 p-5 backdrop-blur-xl"
                    >
                      <p className="text-sm font-semibold text-ink/55">{stat.label}</p>
                      <p className="mt-2 font-[var(--font-manrope)] text-3xl font-extrabold text-ink">
                        {stat.value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {hero.heroImage.url ? (
                <div className="overflow-hidden rounded-[2rem] border border-white/90 bg-white/75 shadow-[0_18px_50px_rgba(14,29,56,0.08)]">
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
                </div>
              ) : (
                <SnailMascot compact />
              )}
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
