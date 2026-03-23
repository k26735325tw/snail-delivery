import type { ReactNode } from "react";

import { FadeIn } from "@/components/fade-in";
import type { CmsContentItem } from "@/lib/cms-schema";
import { getBlockStyle, getTextStyle } from "@/lib/cms-style";

type FeatureCardProps = {
  item: CmsContentItem;
  icon: ReactNode;
  delay?: number;
};

export function FeatureCard({ item, icon, delay }: FeatureCardProps) {
  return (
    <FadeIn
      delay={delay}
      className="gradient-border relative border backdrop-blur-xl"
      style={getBlockStyle(item.blockStyle)}
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue text-2xl text-white shadow-[0_16px_36px_rgba(27,111,255,0.28)]">
        {icon}
      </div>
      <p className="mt-6 font-[var(--font-manrope)] uppercase tracking-[0.24em]" style={getTextStyle(item.eyebrowStyle)}>
        {item.eyebrow}
      </p>
      <h3 className="mt-3" style={getTextStyle(item.titleStyle)}>
        {item.title}
      </h3>
      <p className="mt-3" style={getTextStyle(item.descriptionStyle)}>
        {item.description}
      </p>
    </FadeIn>
  );
}
