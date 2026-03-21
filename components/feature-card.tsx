import type { ReactNode } from "react";

import { FadeIn } from "@/components/fade-in";

type FeatureCardProps = {
  eyebrow: string;
  title: string;
  description: string;
  icon: ReactNode;
  delay?: number;
};

export function FeatureCard({
  eyebrow,
  title,
  description,
  icon,
  delay,
}: FeatureCardProps) {
  return (
    <FadeIn
      delay={delay}
      className="gradient-border relative rounded-[2rem] bg-white/82 p-7 shadow-[0_24px_70px_rgba(14,29,56,0.08)] backdrop-blur-xl"
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue text-2xl text-white shadow-[0_16px_36px_rgba(27,111,255,0.28)]">
        {icon}
      </div>
      <p className="mt-6 font-[var(--font-manrope)] text-xs font-extrabold uppercase tracking-[0.24em] text-blue">
        {eyebrow}
      </p>
      <h3 className="mt-3 text-2xl font-bold text-ink">{title}</h3>
      <p className="mt-3 text-base leading-8 text-ink/72">{description}</p>
    </FadeIn>
  );
}
