"use client";

import type { ReactNode } from "react";

import { EditableBlock, EditableText } from "@/components/cms-inline-edit";
import { FadeIn } from "@/components/fade-in";
import type { CmsArrayCollectionPath } from "@/lib/cms-data";
import type { CmsSection } from "@/lib/cms-schema";
import { getBlockStyle, getTextStyle } from "@/lib/cms-style";

type SectionShellProps = {
  section: CmsSection;
  children: ReactNode;
  highlighted?: boolean;
  pathPrefix?: string;
};

export function SectionShell({ section, children, highlighted = false, pathPrefix }: SectionShellProps) {
  const collectionPath = pathPrefix ? `${pathPrefix}.items` as CmsArrayCollectionPath : undefined;

  return (
    <section
      id={section.id}
      className={`shell py-14 transition-shadow md:py-20 ${highlighted ? "rounded-[2rem] ring-4 ring-blue/25" : ""}`}
      data-preview-section={section.id}
    >
      <EditableBlock
        selection={{
          id: `${pathPrefix ?? section.id}.block`,
          kind: "block",
          label: `${section.title} 區塊`,
          stylePath: pathPrefix ? `${pathPrefix}.blockStyle` : undefined,
          collectionPath,
        }}
      >
        <FadeIn className="mb-10 max-w-3xl space-y-4 md:mb-14" style={getBlockStyle(section.blockStyle)}>
          <EditableText
            as="span"
            value={section.badge}
            className="pill bg-white shadow-sm"
            style={getTextStyle(section.badgeStyle)}
            selection={{
              id: `${pathPrefix ?? section.id}.badge`,
              kind: "text",
              label: `${section.title} Badge`,
              fieldPath: pathPrefix ? `${pathPrefix}.badge` : undefined,
              stylePath: pathPrefix ? `${pathPrefix}.badgeStyle` : undefined,
            }}
          />
          <EditableText
            as="h2"
            value={section.title}
            className="font-[var(--font-manrope)]"
            style={getTextStyle(section.titleStyle)}
            multiline
            selection={{
              id: `${pathPrefix ?? section.id}.title`,
              kind: "text",
              label: `${section.title} 標題`,
              fieldPath: pathPrefix ? `${pathPrefix}.title` : undefined,
              stylePath: pathPrefix ? `${pathPrefix}.titleStyle` : undefined,
              multiline: true,
            }}
          />
          <EditableText
            as="p"
            value={section.description}
            style={getTextStyle(section.descriptionStyle)}
            multiline
            selection={{
              id: `${pathPrefix ?? section.id}.description`,
              kind: "text",
              label: `${section.title} 說明`,
              fieldPath: pathPrefix ? `${pathPrefix}.description` : undefined,
              stylePath: pathPrefix ? `${pathPrefix}.descriptionStyle` : undefined,
              multiline: true,
            }}
          />
        </FadeIn>
      </EditableBlock>
      {children}
    </section>
  );
}
