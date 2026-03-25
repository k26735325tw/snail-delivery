import Image from "next/image";

import { EditableBlock, EditableImageFrame, EditableText } from "@/components/cms-inline-edit";
import type { CmsPartnerItem } from "@/lib/cms-schema";

type PartnersSectionProps = {
  partners: CmsPartnerItem[];
  title: string;
  description: string;
};

function isExternalUrl(value: string) {
  return /^https?:\/\//i.test(value);
}

function PartnerTextLink({ href, children }: { href: string; children: string }) {
  const normalizedHref = href.trim();

  if (!normalizedHref) {
    return <span>{children}</span>;
  }

  return (
    <a
      href={normalizedHref}
      {...(isExternalUrl(normalizedHref) ? { target: "_blank", rel: "noreferrer" } : {})}
      className="underline decoration-[#0b4fd4]/24 underline-offset-4 transition hover:text-[#0b4fd4] hover:decoration-[#0b4fd4]"
    >
      {children}
    </a>
  );
}

function EmptyPartnerCard() {
  return (
    <article className="gradient-border grid gap-6 border bg-white/84 p-6 shadow-[0_24px_70px_rgba(14,29,56,0.08)] md:grid-cols-[220px_minmax(0,1fr)]">
      <div className="flex aspect-[4/3] items-center justify-center rounded-[1.6rem] border border-dashed border-[#0e1d38]/14 bg-[#eef5ff]">
        <span className="text-sm font-bold tracking-[0.16em] text-[#5d6b87]">圖片位置</span>
      </div>
      <div className="grid gap-4">
        <div className="rounded-[1.2rem] bg-[#f6f9ff] px-4 py-3">
          <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#0b4fd4]">公司名稱</p>
          <p className="mt-2 text-base font-semibold text-[#0e1d38]/72">尚未提供</p>
        </div>
        <div className="rounded-[1.2rem] bg-[#f6f9ff] px-4 py-3">
          <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#0b4fd4]">聯絡資訊</p>
          <p className="mt-2 text-base font-semibold text-[#0e1d38]/72">尚未提供</p>
        </div>
        <div className="rounded-[1.2rem] bg-[#f6f9ff] px-4 py-3">
          <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#0b4fd4]">服務範圍</p>
          <p className="mt-2 text-base font-semibold text-[#0e1d38]/72">尚未提供</p>
        </div>
      </div>
    </article>
  );
}

function PartnerCard({ partner, index }: { partner: CmsPartnerItem; index: number }) {
  return (
    <EditableBlock
      selection={{
        id: `home.partnersSection.items.${partner.id}.block`,
        kind: "block",
        label: `合作廠商卡片 ${index + 1}`,
        collectionPath: "home.partnersSection.items",
        itemPath: `home.partnersSection.items.${index}`,
        itemId: partner.id,
        itemIndex: index,
      }}
      className="snap-start shrink-0 basis-[86%] sm:basis-[420px] lg:basis-[440px]"
    >
      <article className="gradient-border flex h-full flex-col overflow-hidden border bg-white/84 p-6 shadow-[0_24px_70px_rgba(14,29,56,0.08)]">
        <EditableImageFrame
          selection={{
            id: `home.partnersSection.items.${partner.id}.image`,
            kind: "image",
            label: `合作廠商 ${index + 1} 圖片`,
            imagePath: `home.partnersSection.items.${index}.image`,
            uploadKey: `home/partners/${partner.id}`,
            collectionPath: "home.partnersSection.items",
            itemPath: `home.partnersSection.items.${index}`,
            itemId: partner.id,
            itemIndex: index,
          }}
          className="relative aspect-[4/3] overflow-hidden rounded-[1.6rem] bg-[#eef5ff]"
        >
          {partner.image.url ? (
            <Image
              src={partner.image.url}
              alt={partner.image.alt}
              fill
              unoptimized
              className="object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm font-bold tracking-[0.16em] text-[#5d6b87]">
              圖片位置
            </div>
          )}
        </EditableImageFrame>
        <div className="mt-5 space-y-4">
          <div className="rounded-[1.2rem] bg-[#f6f9ff] px-4 py-3">
            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#0b4fd4]">公司名稱</p>
            <p className="mt-2 text-base font-semibold text-[#0e1d38]">
              <PartnerTextLink href={partner.nameUrl}>{partner.name}</PartnerTextLink>
            </p>
          </div>
          <div className="rounded-[1.2rem] bg-[#f6f9ff] px-4 py-3">
            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#0b4fd4]">聯絡資訊</p>
            <p className="mt-2 text-base font-semibold text-[#0e1d38]">
              <PartnerTextLink href={partner.contactUrl}>{partner.contactInfo}</PartnerTextLink>
            </p>
          </div>
          <div className="rounded-[1.2rem] bg-[#f6f9ff] px-4 py-3">
            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#0b4fd4]">服務範圍</p>
            <p className="mt-2 text-base font-semibold text-[#0e1d38]">{partner.serviceScope}</p>
          </div>
        </div>
      </article>
    </EditableBlock>
  );
}

export function PartnersSection({ partners, title, description }: PartnersSectionProps) {
  return (
    <EditableBlock
      selection={{
        id: "home.partnersSection.block",
        kind: "block",
        label: "首頁合作廠商區塊",
        collectionPath: "home.partnersSection.items",
      }}
      className="relative overflow-hidden rounded-[2rem] border border-white/80 bg-white/84 p-6 shadow-[0_24px_70px_rgba(14,29,56,0.08)] md:p-8"
    >
      <section id="partners">
        <div className="absolute -left-12 top-0 h-48 w-48 rounded-full bg-[#ffd84a]/26 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-52 w-52 rounded-full bg-[#1b6fff]/14 blur-3xl" />

        <div className="relative">
          <div className="max-w-3xl">
            <EditableText
              as="p"
              value={title}
              className="font-[var(--font-manrope)] text-sm font-extrabold uppercase tracking-[0.28em] text-[#0b4fd4]"
              selection={{
                id: "home.partnersSection.title",
                kind: "text",
                label: "合作廠商區塊標題",
                fieldPath: "home.partnersSection.title",
              }}
            />
            <EditableText
              as="p"
              value={description}
              className="mt-4 text-lg leading-8 text-[#44536d]"
              multiline
              selection={{
                id: "home.partnersSection.description",
                kind: "text",
                label: "合作廠商區塊描述",
                fieldPath: "home.partnersSection.description",
                multiline: true,
              }}
            />
          </div>

          <div className="mt-8">
            {partners.length > 0 ? (
              <div className="-mx-2 flex snap-x snap-mandatory gap-6 overflow-x-auto px-2 pb-4 [scrollbar-width:thin]">
                {partners.map((partner, index) => (
                  <PartnerCard key={partner.id ?? `${partner.name}-${index}`} partner={partner} index={index} />
                ))}
              </div>
            ) : (
              <div className="grid gap-4">
                <EmptyPartnerCard />
                <p className="text-sm leading-7 text-[#5d6b87]">
                  目前尚未公開合作廠商資料，後續將於資料確認後補上。
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </EditableBlock>
  );
}
