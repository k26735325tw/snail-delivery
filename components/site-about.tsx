"use client";

import { EditableBlock, EditableText } from "@/components/cms-inline-edit";
import { Footer } from "@/components/footer";
import { SiteHeader } from "@/components/site-header";
import type { CmsData } from "@/lib/cms-schema";

type SiteAboutProps = {
  site: CmsData;
};

export function SiteAbout({ site }: SiteAboutProps) {
  const videoUrl = site.about.aboutVideoUrl.trim();
  const isEmbedVideo =
    videoUrl.includes("youtube.com/embed") ||
    videoUrl.includes("youtube-nocookie.com/embed") ||
    videoUrl.includes("player.vimeo.com/video");

  return (
    <main className="min-h-screen pb-10">
      <SiteHeader site={site} />

      <div className="shell mt-6 space-y-8">
        <EditableBlock
          selection={{
            id: "about.hero.block",
            kind: "block",
            label: "About 頁首區塊",
            itemPath: "about",
          }}
          className="relative overflow-hidden rounded-[2rem] border border-white/80 bg-white/84 p-6 shadow-[0_24px_70px_rgba(14,29,56,0.08)] md:p-8"
        >
          <div className="absolute -left-14 top-0 h-56 w-56 rounded-full bg-[#ffd84a]/24 blur-3xl" />
          <div className="absolute right-0 top-10 h-56 w-56 rounded-full bg-[#1b6fff]/12 blur-3xl" />

          <div className="relative max-w-3xl">
            <EditableText
              as="p"
              value={site.about.title}
              className="font-[var(--font-manrope)] text-sm font-extrabold uppercase tracking-[0.28em] text-[#0b4fd4]"
              selection={{
                id: "about.title.eyebrow",
                kind: "text",
                label: "About 頁首標題",
                fieldPath: "about.title",
              }}
            />
            <EditableText
              as="h1"
              value={site.site.siteName}
              className="mt-4 font-[var(--font-manrope)] text-4xl font-black tracking-[-0.06em] text-[#0e1d38] md:text-6xl"
              selection={{
                id: "about.site-name",
                kind: "text",
                label: "網站名稱",
                fieldPath: "site.siteName",
              }}
            />
            <EditableText
              as="p"
              value={site.about.intro}
              className="mt-5 text-lg leading-8 text-[#44536d]"
              multiline
              selection={{
                id: "about.intro",
                kind: "text",
                label: "About 頁首介紹",
                fieldPath: "about.intro",
                multiline: true,
              }}
            />
          </div>
        </EditableBlock>

        <EditableBlock
          selection={{
            id: "about.video.block",
            kind: "block",
            label: "About 影片區",
            itemPath: "about",
          }}
          className="rounded-[2rem] border border-white/80 bg-white/84 p-6 shadow-[0_24px_70px_rgba(14,29,56,0.08)] md:p-8"
        >
          <div className="max-w-3xl">
            <EditableText
              as="p"
              value={site.about.videoTitle}
              className="font-[var(--font-manrope)] text-sm font-extrabold uppercase tracking-[0.28em] text-[#0b4fd4]"
              selection={{
                id: "about.video-title",
                kind: "text",
                label: "影片區標題",
                fieldPath: "about.videoTitle",
              }}
            />
            <EditableText
              as="p"
              value={site.about.videoDescription}
              className="mt-4 text-lg leading-8 text-[#44536d]"
              multiline
              selection={{
                id: "about.video-description",
                kind: "text",
                label: "影片區說明",
                fieldPath: "about.videoDescription",
                multiline: true,
              }}
            />
          </div>

          <div className="mt-8 overflow-hidden rounded-[1.8rem] border border-[#0e1d38]/10 bg-[#eef5ff]">
            <div className="aspect-video w-full">
              {videoUrl ? (
                isEmbedVideo ? (
                  <iframe
                    src={videoUrl}
                    title={site.about.videoTitle}
                    className="h-full w-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <video
                    src={videoUrl}
                    poster={site.about.aboutVideoPoster || undefined}
                    controls
                    playsInline
                    className="h-full w-full bg-black object-contain"
                  />
                )
              ) : (
                <div
                  className="flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_top_left,rgba(255,216,74,0.38),transparent_34%),linear-gradient(135deg,#f7fbff,#e8f0ff)] px-6 text-center"
                  style={
                    site.about.aboutVideoPoster
                      ? {
                          backgroundImage: `linear-gradient(rgba(247,251,255,0.84), rgba(232,240,255,0.9)), url(${site.about.aboutVideoPoster})`,
                          backgroundPosition: "center",
                          backgroundSize: "cover",
                        }
                      : undefined
                  }
                >
                  <EditableText
                    as="div"
                    value={site.about.videoHint}
                    className="text-2xl font-black text-[#0e1d38] md:text-3xl"
                    multiline
                    selection={{
                      id: "about.video-hint",
                      kind: "text",
                      label: "影片 Placeholder 文案",
                      fieldPath: "about.videoHint",
                      multiline: true,
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </EditableBlock>
      </div>

      <Footer site={site} />
    </main>
  );
}
