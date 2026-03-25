import type { Metadata } from "next";

import { Footer } from "@/components/footer";
import { SiteHeader } from "@/components/site-header";
import { aboutPage } from "@/lib/about";
import { getCmsData } from "@/lib/cms-store";
import { buildSiteUrl, getSiteUrl } from "@/lib/site";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: aboutPage.title,
  description: aboutPage.description,
  alternates: {
    canonical: buildSiteUrl("/about"),
  },
  openGraph: {
    type: "website",
    locale: "zh_TW",
    title: aboutPage.title,
    description: aboutPage.description,
    url: buildSiteUrl("/about"),
  },
  twitter: {
    card: "summary_large_image",
    title: aboutPage.title,
    description: aboutPage.description,
  },
};

export default async function AboutPage() {
  const site = await getCmsData();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: aboutPage.title,
    description: aboutPage.description,
    url: buildSiteUrl("/about"),
    isPartOf: {
      "@type": "WebSite",
      name: site.site.siteName,
      url: getSiteUrl(),
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="min-h-screen pb-10">
        <SiteHeader site={site} />

        <div className="shell mt-6 space-y-8">
          <section className="relative overflow-hidden rounded-[2rem] border border-white/80 bg-white/84 p-6 shadow-[0_24px_70px_rgba(14,29,56,0.08)] md:p-8">
            <div className="absolute -left-14 top-0 h-56 w-56 rounded-full bg-[#ffd84a]/24 blur-3xl" />
            <div className="absolute right-0 top-10 h-56 w-56 rounded-full bg-[#1b6fff]/12 blur-3xl" />

            <div className="relative max-w-3xl">
              <p className="font-[var(--font-manrope)] text-sm font-extrabold uppercase tracking-[0.28em] text-[#0b4fd4]">
                {aboutPage.title}
              </p>
              <h1 className="mt-4 font-[var(--font-manrope)] text-4xl font-black tracking-[-0.06em] text-[#0e1d38] md:text-6xl">
                {site.site.siteName}
              </h1>
              <p className="mt-5 text-lg leading-8 text-[#44536d]">
                {aboutPage.intro}
              </p>
            </div>
          </section>

          <section className="rounded-[2rem] border border-white/80 bg-white/84 p-6 shadow-[0_24px_70px_rgba(14,29,56,0.08)] md:p-8">
            <div className="max-w-3xl">
              <p className="font-[var(--font-manrope)] text-sm font-extrabold uppercase tracking-[0.28em] text-[#0b4fd4]">
                {aboutPage.videoTitle}
              </p>
              <p className="mt-4 text-lg leading-8 text-[#44536d]">
                影片區已預留 16:9 版位，可於素材確認後直接替換。
              </p>
            </div>

            <div className="mt-8 overflow-hidden rounded-[1.8rem] border border-[#0e1d38]/10 bg-[#eef5ff]">
              <div className="aspect-video w-full">
                {aboutPage.aboutVideoUrl ? (
                  <iframe
                    src={aboutPage.aboutVideoUrl}
                    title={aboutPage.videoTitle}
                    className="h-full w-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <div
                    className="flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_top_left,rgba(255,216,74,0.38),transparent_34%),linear-gradient(135deg,#f7fbff,#e8f0ff)] px-6 text-center"
                    style={
                      aboutPage.aboutVideoPoster
                        ? {
                            backgroundImage: `linear-gradient(rgba(247,251,255,0.84), rgba(232,240,255,0.9)), url(${aboutPage.aboutVideoPoster})`,
                            backgroundPosition: "center",
                            backgroundSize: "cover",
                          }
                        : undefined
                    }
                  >
                    <div>
                      <p className="text-sm font-extrabold uppercase tracking-[0.24em] text-[#0b4fd4]">
                        Video Placeholder
                      </p>
                      <p className="mt-4 text-2xl font-black text-[#0e1d38] md:text-3xl">
                        {aboutPage.videoHint}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>

        <Footer site={site} />
      </main>
    </>
  );
}
