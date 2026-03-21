import Link from "next/link";

import { FadeIn } from "@/components/fade-in";
import { SnailMascot } from "@/components/snail-mascot";

type PageHeroProps = {
  badge: string;
  title: string;
  description: string;
  primaryHref: string;
  primaryLabel: string;
  secondaryHref?: string;
  secondaryLabel?: string;
  asideTitle: string;
  stats: Array<{ label: string; value: string }>;
};

export function PageHero({
  badge,
  title,
  description,
  primaryHref,
  primaryLabel,
  secondaryHref,
  secondaryLabel,
  asideTitle,
  stats,
}: PageHeroProps) {
  return (
    <section className="hero-grid overflow-hidden">
      <div className="shell grid gap-10 pb-20 pt-14 md:grid-cols-[1.04fr_0.96fr] md:items-center md:pb-24 md:pt-20">
        <FadeIn className="space-y-7">
          <span className="pill bg-yellow text-ink">{badge}</span>
          <div className="space-y-5">
            <h1 className="section-title max-w-4xl font-[var(--font-manrope)] font-extrabold">
              {title}
            </h1>
            <p className="section-copy max-w-2xl">{description}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href={primaryHref}
              className="rounded-full bg-blue px-6 py-3 text-sm font-extrabold text-white transition hover:-translate-y-0.5"
            >
              {primaryLabel}
            </Link>
            {secondaryHref && secondaryLabel ? (
              <Link
                href={secondaryHref}
                className="rounded-full border border-ink/10 bg-white/90 px-6 py-3 text-sm font-bold text-ink transition hover:border-blue hover:text-blue"
              >
                {secondaryLabel}
              </Link>
            ) : null}
          </div>
        </FadeIn>

        <FadeIn delay={0.12}>
          <div className="soft-panel p-6 md:p-8">
            <div className="grid gap-5 md:grid-cols-[0.92fr_1.08fr] md:items-center">
              <div>
                <div className="mb-4 inline-flex rounded-full bg-blue/10 px-4 py-2 text-sm font-bold text-blue">
                  {asideTitle}
                </div>
                <div className="grid gap-4">
                  {stats.map((stat) => (
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
              <SnailMascot compact />
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
