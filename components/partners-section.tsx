import Image from "next/image";

import type { Partner } from "@/lib/partners";

type PartnersSectionProps = {
  partners: Partner[];
  title: string;
  description: string;
};

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

function PartnerCard({ partner }: { partner: Partner }) {
  return (
    <article className="gradient-border flex h-full flex-col overflow-hidden border bg-white/84 p-6 shadow-[0_24px_70px_rgba(14,29,56,0.08)]">
      <div className="relative aspect-[4/3] overflow-hidden rounded-[1.6rem] bg-[#eef5ff]">
        <Image
          src={partner.image.src}
          alt={partner.image.alt}
          fill
          unoptimized
          className="object-cover"
        />
      </div>
      <div className="mt-5 space-y-4">
        <div className="rounded-[1.2rem] bg-[#f6f9ff] px-4 py-3">
          <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#0b4fd4]">公司名稱</p>
          <p className="mt-2 text-base font-semibold text-[#0e1d38]">{partner.companyName}</p>
        </div>
        <div className="rounded-[1.2rem] bg-[#f6f9ff] px-4 py-3">
          <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#0b4fd4]">聯絡資訊</p>
          <p className="mt-2 text-base font-semibold text-[#0e1d38]">{partner.contactInfo}</p>
        </div>
        <div className="rounded-[1.2rem] bg-[#f6f9ff] px-4 py-3">
          <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#0b4fd4]">服務範圍</p>
          <p className="mt-2 text-base font-semibold text-[#0e1d38]">{partner.serviceScope}</p>
        </div>
      </div>
    </article>
  );
}

export function PartnersSection({ partners, title, description }: PartnersSectionProps) {
  return (
    <section
      id="partners"
      className="relative overflow-hidden rounded-[2rem] border border-white/80 bg-white/84 p-6 shadow-[0_24px_70px_rgba(14,29,56,0.08)] md:p-8"
    >
      <div className="absolute -left-12 top-0 h-48 w-48 rounded-full bg-[#ffd84a]/26 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-52 w-52 rounded-full bg-[#1b6fff]/14 blur-3xl" />

      <div className="relative">
        <div className="max-w-3xl">
          <p className="font-[var(--font-manrope)] text-sm font-extrabold uppercase tracking-[0.28em] text-[#0b4fd4]">
            {title}
          </p>
          <p className="mt-4 text-lg leading-8 text-[#44536d]">
            {description}
          </p>
        </div>

        <div className="mt-8">
          {partners.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {partners.map((partner) => (
                <PartnerCard
                  key={`${partner.companyName}-${partner.contactInfo}`}
                  partner={partner}
                />
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
  );
}
