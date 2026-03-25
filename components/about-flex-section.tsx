"use client";

import Image from "next/image";

import { EditableBlock, EditableText } from "@/components/cms-inline-edit";
import { useCmsVisualEditor } from "@/components/cms-visual-context";
import type { CmsFlexBlock } from "@/lib/cms-schema";

type AboutFlexSectionProps = {
  title: string;
  description: string;
  blocks: CmsFlexBlock[];
};

function isExternalUrl(value: string) {
  return /^https?:\/\//i.test(value);
}

function renderBlockLink(href: string, buttonLabel: string) {
  const normalizedHref = href.trim();
  const label = buttonLabel.trim() || "查看內容";

  if (!normalizedHref) {
    return null;
  }

  return (
    <a
      href={normalizedHref}
      {...(isExternalUrl(normalizedHref) ? { target: "_blank", rel: "noreferrer" } : {})}
      className="inline-flex items-center rounded-full border border-[#0b4fd4]/20 bg-[#edf4ff] px-4 py-2 text-sm font-black text-[#0b4fd4] transition hover:border-[#0b4fd4] hover:bg-[#dfeaff]"
    >
      {label}
    </a>
  );
}

function AboutFlexBlockCard({ block, index }: { block: CmsFlexBlock; index: number }) {
  const isText = block.type === "text";
  const isImage = block.type === "image";
  const isVideo = block.type === "video";

  return (
    <EditableBlock
      selection={{
        id: `about.flexSection.blocks.${block.id}.block`,
        kind: "block",
        label: `About 自訂內容 Block ${index + 1}`,
        collectionPath: "about.flexSection.blocks",
        itemPath: `about.flexSection.blocks.${index}`,
        itemId: block.id,
        itemIndex: index,
      }}
      className="gradient-border border bg-white/84 p-6 shadow-[0_24px_70px_rgba(14,29,56,0.08)]"
    >
      <article className="space-y-5">
        {isImage && block.mediaUrl ? (
          <div className="relative aspect-[16/9] overflow-hidden rounded-[1.6rem] bg-[#eef5ff]">
            <Image
              src={block.mediaUrl}
              alt={block.mediaAlt || block.heading || "About 自訂內容圖片"}
              fill
              unoptimized
              className="object-cover"
            />
          </div>
        ) : null}

        {isVideo ? (
          <div className="overflow-hidden rounded-[1.6rem] bg-black">
            {block.mediaUrl ? (
              <video
                src={block.mediaUrl}
                controls
                playsInline
                className="aspect-video w-full bg-black object-contain"
              />
            ) : (
              <div className="flex aspect-video items-center justify-center bg-[#0e1d38] px-6 text-center text-sm font-bold tracking-[0.16em] text-white/76">
                尚未提供影片
              </div>
            )}
          </div>
        ) : null}

        {(isText || block.heading) ? (
          <EditableText
            as="h3"
            value={block.heading}
            className="font-[var(--font-manrope)] text-2xl font-black tracking-[-0.04em] text-[#0e1d38]"
            multiline
            selection={{
              id: `about.flexSection.blocks.${block.id}.heading`,
              kind: "text",
              label: `About 自訂內容 Block ${index + 1} 標題`,
              fieldPath: `about.flexSection.blocks.${index}.heading`,
              collectionPath: "about.flexSection.blocks",
              itemPath: `about.flexSection.blocks.${index}`,
              itemId: block.id,
              itemIndex: index,
              multiline: true,
            }}
          />
        ) : null}

        {block.body ? (
          <EditableText
            as="p"
            value={block.body}
            className="text-base leading-8 text-[#44536d]"
            multiline
            selection={{
              id: `about.flexSection.blocks.${block.id}.body`,
              kind: "text",
              label: `About 自訂內容 Block ${index + 1} 內文`,
              fieldPath: `about.flexSection.blocks.${index}.body`,
              collectionPath: "about.flexSection.blocks",
              itemPath: `about.flexSection.blocks.${index}`,
              itemId: block.id,
              itemIndex: index,
              multiline: true,
            }}
          />
        ) : null}

        {block.caption ? (
          <EditableText
            as="p"
            value={block.caption}
            className="text-sm leading-7 text-[#5d6b87]"
            multiline
            selection={{
              id: `about.flexSection.blocks.${block.id}.caption`,
              kind: "text",
              label: `About 自訂內容 Block ${index + 1} Caption`,
              fieldPath: `about.flexSection.blocks.${index}.caption`,
              collectionPath: "about.flexSection.blocks",
              itemPath: `about.flexSection.blocks.${index}`,
              itemId: block.id,
              itemIndex: index,
              multiline: true,
            }}
          />
        ) : null}

        {renderBlockLink(block.linkUrl, block.buttonLabel)}
      </article>
    </EditableBlock>
  );
}

export function AboutFlexSection({ title, description, blocks }: AboutFlexSectionProps) {
  const editor = useCmsVisualEditor();

  if (blocks.length === 0 && !editor) {
    return null;
  }

  return (
    <EditableBlock
      selection={{
        id: "about.flexSection.block",
        kind: "block",
        label: "About 自訂內容區",
        collectionPath: "about.flexSection.blocks",
      }}
      className="relative overflow-hidden rounded-[2rem] border border-white/80 bg-white/84 p-6 shadow-[0_24px_70px_rgba(14,29,56,0.08)] md:p-8"
    >
      <section>
        <div className="absolute -right-10 top-0 h-44 w-44 rounded-full bg-[#ffd84a]/20 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-48 w-48 rounded-full bg-[#1b6fff]/10 blur-3xl" />

        <div className="relative">
          <div className="max-w-3xl">
            <EditableText
              as="p"
              value={title}
              className="font-[var(--font-manrope)] text-sm font-extrabold uppercase tracking-[0.28em] text-[#0b4fd4]"
              selection={{
                id: "about.flexSection.title",
                kind: "text",
                label: "About 自訂內容區標題",
                fieldPath: "about.flexSection.title",
              }}
            />
            <EditableText
              as="p"
              value={description}
              className="mt-4 text-lg leading-8 text-[#44536d]"
              multiline
              selection={{
                id: "about.flexSection.description",
                kind: "text",
                label: "About 自訂內容區描述",
                fieldPath: "about.flexSection.description",
                multiline: true,
              }}
            />
          </div>

          <div className="mt-8">
            {blocks.length > 0 ? (
              <div className="grid gap-6">
                {blocks.map((block, index) => (
                  <AboutFlexBlockCard key={block.id ?? `${block.type}-${index}`} block={block} index={index} />
                ))}
              </div>
            ) : (
              <div className="rounded-[1.6rem] border border-dashed border-[#0e1d38]/14 bg-[#eef5ff] px-6 py-10 text-center text-sm leading-7 text-[#5d6b87]">
                尚未新增自訂內容 block。選取這個區塊後，可在右側新增 text / image / video block。
              </div>
            )}
          </div>
        </div>
      </section>
    </EditableBlock>
  );
}
