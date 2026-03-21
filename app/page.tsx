import Image from "next/image";
import Link from "next/link";
import { unstable_noStore as noStore } from "next/cache";

import { readSiteData } from "@/lib/site-data";

export default async function Home() {
  noStore();

  const siteData = await readSiteData();

  return (
    <main className="min-h-screen px-4 py-6 md:px-6">
      <div className="mx-auto max-w-6xl">
        <section className="overflow-hidden rounded-[2rem] border border-white/70 bg-white/80 shadow-[0_30px_80px_rgba(14,29,56,0.08)] backdrop-blur">
          <div className="grid gap-10 px-6 py-10 md:grid-cols-[1.05fr_0.95fr] md:px-10 md:py-14">
            <div className="flex flex-col justify-center">
              <div className="inline-flex w-fit items-center gap-3 rounded-full bg-yellow px-4 py-2 text-sm font-bold text-ink">
                <Image
                  src={siteData.logo}
                  alt={`${siteData.siteName} logo`}
                  width={28}
                  height={28}
                  className="rounded-full"
                />
                <span>{siteData.siteName}</span>
              </div>

              <h1 className="mt-6 text-4xl font-black tracking-[-0.06em] text-ink md:text-6xl">
                {siteData.heroTitle}
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-8 text-ink/70 md:text-lg">
                {siteData.heroSubtitle}
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/admin"
                  className="rounded-full bg-blue px-6 py-3 text-sm font-bold text-white transition hover:bg-blue/90"
                >
                  Open Admin
                </Link>
                <Link
                  href="/api/site"
                  className="rounded-full border border-ink/10 bg-white px-6 py-3 text-sm font-semibold text-ink transition hover:border-blue hover:text-blue"
                >
                  View API
                </Link>
              </div>
            </div>

            <div className="rounded-[2rem] bg-slate-900 p-6 text-white shadow-[0_24px_60px_rgba(15,23,42,0.2)]">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-yellow">
                Dynamic Content
              </p>
              <div className="mt-6 space-y-4">
                {siteData.features.map((feature) => (
                  <article
                    key={feature.title}
                    className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5"
                  >
                    <h2 className="text-xl font-bold">{feature.title}</h2>
                    <p className="mt-2 text-sm leading-7 text-white/72">
                      {feature.desc}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
