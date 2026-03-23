"use client";

import type { ReactNode } from "react";

import { EditableBlock, EditableText } from "@/components/cms-inline-edit";
import { FadeIn } from "@/components/fade-in";
import type { CmsArrayCollectionPath } from "@/lib/cms-data";
import type { CmsContentItem } from "@/lib/cms-schema";
import { getBlockStyle, getTextStyle } from "@/lib/cms-style";

type FeatureCardProps = {
  item: CmsContentItem;
  icon: ReactNode;
  delay?: number;
  highlighted?: boolean;
  previewCardKey?: string;
  previewCardIndex?: number;
  pathPrefix?: string;
  label?: string;
};

export function FeatureCard({
  item,
  icon,
  delay,
  highlighted = false,
  previewCardKey,
  previewCardIndex,
  pathPrefix,
  label = "卡片",
}: FeatureCardProps) {
  const blockId = pathPrefix ?? `${previewCardKey ?? "card"}.${previewCardIndex ?? 0}`;
  const itemId = item.id;
  const collectionPath = pathPrefix?.replace(/\.\d+$/, "") as CmsArrayCollectionPath | undefined;

  return (
    <EditableBlock
      selection={{
        id: `${blockId}.${itemId}.block`,
        kind: "block",
        label: `${label}區塊`,
        stylePath: pathPrefix ? `${pathPrefix}.blockStyle` : undefined,
        collectionPath,
        itemPath: pathPrefix,
        itemId,
        itemIndex: previewCardIndex,
      }}
      className={`${highlighted ? "bg-[rgba(255,248,196,0.72)] ring-2 ring-[#1b6fff]/45 shadow-[0_24px_70px_rgba(27,111,255,0.16)] brightness-[1.02]" : ""}`}
    >
      <FadeIn
        delay={delay}
        className="gradient-border relative border backdrop-blur-xl transition-shadow"
        style={getBlockStyle(item.blockStyle)}
        data-preview-card-key={previewCardKey}
        data-preview-card-index={typeof previewCardIndex === "number" ? previewCardIndex : undefined}
      >
        <EditableText
          as="div"
          value={typeof icon === "string" ? icon : item.icon ?? ""}
          className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue text-2xl font-black text-white shadow-[0_16px_36px_rgba(27,111,255,0.28)]"
          selection={{
            id: `${blockId}.${itemId}.icon`,
            kind: "text",
            label: `${label} Icon`,
            fieldPath: pathPrefix ? `${pathPrefix}.icon` : undefined,
            collectionPath,
            itemPath: pathPrefix,
            itemId,
            itemIndex: previewCardIndex,
          }}
        />
        <EditableText
          as="p"
          value={item.eyebrow}
          className="mt-6 font-[var(--font-manrope)] uppercase tracking-[0.24em]"
          style={getTextStyle(item.eyebrowStyle)}
          selection={{
            id: `${blockId}.${itemId}.eyebrow`,
            kind: "text",
            label: `${label} Eyebrow`,
            fieldPath: pathPrefix ? `${pathPrefix}.eyebrow` : undefined,
            stylePath: pathPrefix ? `${pathPrefix}.eyebrowStyle` : undefined,
            collectionPath,
            itemPath: pathPrefix,
            itemId,
            itemIndex: previewCardIndex,
          }}
        />
        <EditableText
          as="h3"
          value={item.title}
          className="mt-3"
          style={getTextStyle(item.titleStyle)}
          selection={{
            id: `${blockId}.${itemId}.title`,
            kind: "text",
            label: `${label}標題`,
            fieldPath: pathPrefix ? `${pathPrefix}.title` : undefined,
            stylePath: pathPrefix ? `${pathPrefix}.titleStyle` : undefined,
            collectionPath,
            itemPath: pathPrefix,
            itemId,
            itemIndex: previewCardIndex,
          }}
        />
        <EditableText
          as="p"
          value={item.description}
          className="mt-3"
          style={getTextStyle(item.descriptionStyle)}
          multiline
          selection={{
            id: `${blockId}.${itemId}.description`,
            kind: "text",
            label: `${label}說明`,
            fieldPath: pathPrefix ? `${pathPrefix}.description` : undefined,
            stylePath: pathPrefix ? `${pathPrefix}.descriptionStyle` : undefined,
            multiline: true,
            collectionPath,
            itemPath: pathPrefix,
            itemId,
            itemIndex: previewCardIndex,
          }}
        />
      </FadeIn>
    </EditableBlock>
  );
}
