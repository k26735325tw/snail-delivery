import type { ReactNode } from "react";

import { FadeIn } from "@/components/fade-in";
import type { CmsSection } from "@/lib/cms-schema";
import { getBlockStyle, getTextStyle } from "@/lib/cms-style";

type SectionShellProps = {
  section: CmsSection;
  children: ReactNode;
  highlighted?: boolean;
};

export function SectionShell({ section, children, highlighted = false }: SectionShellProps) {
  return (
    <section
      id={section.id}
      className={`shell py-14 transition-shadow md:py-20 ${highlighted ? "rounded-[2rem] ring-4 ring-blue/25" : ""}`}
      data-preview-section={section.id}
    >
      <FadeIn className="mb-10 max-w-3xl space-y-4 md:mb-14" style={getBlockStyle(section.blockStyle)}>
        <span className="pill bg-white shadow-sm" style={getTextStyle(section.badgeStyle)}>
          {section.badge}
        </span>
        <h2 className="font-[var(--font-manrope)]" style={getTextStyle(section.titleStyle)}>
          {section.title}
        </h2>
        <p style={getTextStyle(section.descriptionStyle)}>{section.description}</p>
      </FadeIn>
      {children}
    </section>
  );
}
