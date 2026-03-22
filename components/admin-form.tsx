"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import type { SiteContent } from "@/lib/site-data";

type AdminFormProps = {
  initialData: SiteContent;
};

export function AdminForm({ initialData }: AdminFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isSaving, setIsSaving] = useState(false);
  const [siteName, setSiteName] = useState(initialData.siteName);
  const [heroTitle, setHeroTitle] = useState(initialData.heroTitle);
  const [heroSubtitle, setHeroSubtitle] = useState(initialData.heroSubtitle);
  const [features, setFeatures] = useState(initialData.features.join("\n"));
  const [logo, setLogo] = useState(initialData.logo);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setSiteName(initialData.siteName);
    setHeroTitle(initialData.heroTitle);
    setHeroSubtitle(initialData.heroSubtitle);
    setFeatures(initialData.features.join("\n"));
    setLogo(initialData.logo);
  }, [initialData]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    setError(null);
    setIsSaving(true);

    try {
      const response = await fetch("/api/site", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          siteName,
          heroTitle,
          heroSubtitle,
          features: features
            .split("\n")
            .map((feature) => feature.trim())
            .filter(Boolean),
          logo,
        } satisfies SiteContent),
      });

      const result = (await response.json()) as
        | { error?: string }
        | { success: true; data: SiteContent };

      if (!response.ok) {
        throw new Error(
          "error" in result && typeof result.error === "string"
            ? result.error
            : "Failed to save site data",
        );
      }

      setMessage("Saved successfully");
      startTransition(() => {
        router.refresh();
      });
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Failed to save site data",
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-5">
      <label className="block space-y-2">
        <span className="text-sm font-semibold text-slate-700">Site name</span>
        <input
          value={siteName}
          onChange={(event) => setSiteName(event.target.value)}
          disabled={isSaving}
          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-blue focus:bg-white disabled:cursor-not-allowed disabled:opacity-60"
        />
      </label>

      <label className="block space-y-2">
        <span className="text-sm font-semibold text-slate-700">Hero title</span>
        <textarea
          value={heroTitle}
          onChange={(event) => setHeroTitle(event.target.value)}
          rows={3}
          disabled={isSaving}
          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-blue focus:bg-white disabled:cursor-not-allowed disabled:opacity-60"
        />
      </label>

      <label className="block space-y-2">
        <span className="text-sm font-semibold text-slate-700">Hero subtitle</span>
        <textarea
          value={heroSubtitle}
          onChange={(event) => setHeroSubtitle(event.target.value)}
          rows={4}
          disabled={isSaving}
          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-blue focus:bg-white disabled:cursor-not-allowed disabled:opacity-60"
        />
      </label>

      <label className="block space-y-2">
        <span className="text-sm font-semibold text-slate-700">Features</span>
        <textarea
          value={features}
          onChange={(event) => setFeatures(event.target.value)}
          rows={6}
          disabled={isSaving}
          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-blue focus:bg-white disabled:cursor-not-allowed disabled:opacity-60"
        />
        <p className="text-xs text-slate-500">One feature per line.</p>
      </label>

      <label className="block space-y-2">
        <span className="text-sm font-semibold text-slate-700">Logo URL</span>
        <input
          value={logo}
          onChange={(event) => setLogo(event.target.value)}
          disabled={isSaving}
          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-blue focus:bg-white disabled:cursor-not-allowed disabled:opacity-60"
        />
      </label>

      <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
        <p>POST target: `/api/site`</p>
        <p>Storage path: `data/site.json`</p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={isSaving || isPending}
          className="inline-flex rounded-full bg-blue px-6 py-3 text-sm font-bold text-white transition hover:bg-blue/90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSaving || isPending ? "Saving..." : "Save"}
        </button>
        {isSaving ? (
          <p className="text-sm font-medium text-slate-500">
            Writing to data/site.json...
          </p>
        ) : null}
        {message ? (
          <p className="text-sm font-medium text-emerald-600">{message}</p>
        ) : null}
        {error ? <p className="text-sm font-medium text-red-600">{error}</p> : null}
      </div>
    </form>
  );
}
