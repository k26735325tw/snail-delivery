import type { ReactNode } from "react";

import { FadeIn } from "@/components/fade-in";

type SectionShellProps = {
  id?: string;
  badge: string;
  title: string;
  description: string;
  children: ReactNode;
};

export function SectionShell({
  id,
  badge,
  title,
  description,
  children,
}: SectionShellProps) {
  return (
    <section id={id} className="shell py-14 md:py-20">
      <FadeIn className="mb-10 max-w-3xl space-y-4 md:mb-14">
        <span className="pill bg-white text-blue shadow-sm">{badge}</span>
        <h2 className="section-title max-w-4xl font-[var(--font-manrope)] font-extrabold">
          {title}
        </h2>
        <p className="section-copy">{description}</p>
      </FadeIn>
      {children}
    </section>
  );
}
