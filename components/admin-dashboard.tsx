"use client";

import type { ReactNode } from "react";
import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { AdminArrayEditor } from "@/components/admin-array-editor";
import { AdminImageUpload } from "@/components/admin-image-upload";
import { AdminSaveBar } from "@/components/admin-save-bar";
import { AdminSectionEditor } from "@/components/admin-section-editor";
import type {
  CmsData,
  CmsDownloadCard,
  CmsLaunchStep,
  CmsRolePage,
  CmsStat,
} from "@/lib/cms-schema";

type AdminDashboardProps = {
  initialData: CmsData;
};

type PendingUploadMap = Record<string, File | null>;

function Field({
  label,
  value,
  onChange,
  multiline = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  multiline?: boolean;
}) {
  return (
    <label className="space-y-2">
      <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
        {label}
      </span>
      {multiline ? (
        <textarea
          value={value}
          onChange={(event) => onChange(event.target.value)}
          rows={4}
          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:bg-white"
        />
      ) : (
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:bg-white"
        />
      )}
    </label>
  );
}

function Panel({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5">
        <h2 className="text-lg font-black text-slate-900">{title}</h2>
        {description ? <p className="mt-1 text-sm text-slate-500">{description}</p> : null}
      </div>
      <div className="space-y-5">{children}</div>
    </section>
  );
}

const emptyStat = (): CmsStat => ({ label: "", value: "" });

const emptyDownloadCard = (): CmsDownloadCard => ({
  key: "consumer",
  eyebrow: "",
  title: "",
  description: "",
  audience: "",
  imageUrl: "",
  imageAlt: "",
  iosUrl: "",
  androidUrl: "",
  highlights: [""],
});

const emptyLaunchStep = (): CmsLaunchStep => ({
  index: "",
  title: "",
  description: "",
});

function RolePageEditor({
  title,
  pendingFile,
  page,
  onChange,
  onFileChange,
}: {
  title: string;
  pendingFile: File | null;
  page: CmsRolePage;
  onChange: (page: CmsRolePage) => void;
  onFileChange: (file: File | null) => void;
}) {
  return (
    <Panel title={title} description="Hero, stats, image and repeatable sections for this page.">
      <div className="grid gap-4 md:grid-cols-2">
        <Field
          label="Hero Badge"
          value={page.hero.badge}
          onChange={(value) => onChange({ ...page, hero: { ...page.hero, badge: value } })}
        />
        <Field
          label="Aside Title"
          value={page.hero.asideTitle}
          onChange={(value) => onChange({ ...page, hero: { ...page.hero, asideTitle: value } })}
        />
      </div>

      <Field
        label="Hero Title"
        value={page.hero.title}
        onChange={(value) => onChange({ ...page, hero: { ...page.hero, title: value } })}
        multiline
      />
      <Field
        label="Hero Description"
        value={page.hero.description}
        onChange={(value) => onChange({ ...page, hero: { ...page.hero, description: value } })}
        multiline
      />

      <div className="grid gap-4 md:grid-cols-2">
        <Field
          label="Primary Label"
          value={page.hero.primaryLabel}
          onChange={(value) =>
            onChange({ ...page, hero: { ...page.hero, primaryLabel: value } })
          }
        />
        <Field
          label="Primary Href"
          value={page.hero.primaryHref}
          onChange={(value) =>
            onChange({ ...page, hero: { ...page.hero, primaryHref: value } })
          }
        />
        <Field
          label="Secondary Label"
          value={page.hero.secondaryLabel}
          onChange={(value) =>
            onChange({ ...page, hero: { ...page.hero, secondaryLabel: value } })
          }
        />
        <Field
          label="Secondary Href"
          value={page.hero.secondaryHref}
          onChange={(value) =>
            onChange({ ...page, hero: { ...page.hero, secondaryHref: value } })
          }
        />
      </div>

      <AdminImageUpload
        label="Hero Image"
        value={page.hero.heroImageUrl ?? ""}
        pendingFile={pendingFile}
        onChange={(value) => onChange({ ...page, hero: { ...page.hero, heroImageUrl: value } })}
        onFileChange={onFileChange}
      />

      <AdminArrayEditor
        label="Hero Stats"
        items={page.hero.stats}
        createItem={emptyStat}
        onChange={(stats) => onChange({ ...page, hero: { ...page.hero, stats } })}
        renderItem={(item, index, helpers) => (
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-4">
              <p className="text-sm font-bold text-slate-900">Stat {index + 1}</p>
              <button
                type="button"
                onClick={helpers.remove}
                className="rounded-full border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-bold text-red-600 transition hover:border-red-300 hover:bg-red-100"
              >
                Remove Stat
              </button>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <Field
                label="Label"
                value={item.label}
                onChange={(value) => helpers.update({ ...item, label: value })}
              />
              <Field
                label="Value"
                value={item.value}
                onChange={(value) => helpers.update({ ...item, value: value })}
              />
            </div>
          </div>
        )}
      />

      <AdminSectionEditor
        title="Page Sections"
        sections={page.sections}
        onChange={(sections) => onChange({ ...page, sections })}
      />
    </Panel>
  );
}

export function AdminDashboard({ initialData }: AdminDashboardProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [data, setData] = useState(initialData);
  const [pendingUploads, setPendingUploads] = useState<PendingUploadMap>({});
  const [savedSnapshot, setSavedSnapshot] = useState(JSON.stringify(initialData));
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setData(initialData);
    setPendingUploads({});
    setSavedSnapshot(JSON.stringify(initialData));
  }, [initialData]);

  const hasPendingUploads = Object.keys(pendingUploads).length > 0;
  const isDirty = JSON.stringify(data) !== savedSnapshot || hasPendingUploads;

  function setPendingUpload(key: string, file: File | null) {
    setPendingUploads((current) => {
      if (!file) {
        if (!(key in current)) {
          return current;
        }

        const next = { ...current };
        delete next[key];
        return next;
      }

      return { ...current, [key]: file };
    });
  }

  async function uploadImage(file: File, uploadKey: string) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("uploadKey", uploadKey);

    const response = await fetch("/api/cms/upload", {
      method: "POST",
      body: formData,
    });
    const result = (await response.json()) as { error?: string; url?: string };

    if (!response.ok || !result.url) {
      throw new Error(result.error ?? "Upload failed");
    }

    return result.url;
  }

  async function prepareDataForSave() {
    const nextData: CmsData = structuredClone(data);

    if (pendingUploads["site.logo"]) {
      nextData.site.logoUrl = await uploadImage(pendingUploads["site.logo"], "shared/logo");
    }

    if (pendingUploads["home.hero"]) {
      nextData.home.hero.heroImageUrl = await uploadImage(pendingUploads["home.hero"], "home/hero");
    }

    if (pendingUploads["consumer.hero"]) {
      nextData.consumer.hero.heroImageUrl = await uploadImage(
        pendingUploads["consumer.hero"],
        "consumer/hero",
      );
    }

    if (pendingUploads["courier.hero"]) {
      nextData.courier.hero.heroImageUrl = await uploadImage(
        pendingUploads["courier.hero"],
        "courier/hero",
      );
    }

    if (pendingUploads["merchant.hero"]) {
      nextData.merchant.hero.heroImageUrl = await uploadImage(
        pendingUploads["merchant.hero"],
        "merchant/hero",
      );
    }

    for (const [index, card] of nextData.home.downloadCards.entries()) {
      const pendingFile = pendingUploads[`home.downloadCards.${index}.image`];

      if (!pendingFile) {
        continue;
      }

      card.imageUrl = await uploadImage(pendingFile, `home/${card.key}`);
    }

    return nextData;
  }

  async function handleSave() {
    setIsSaving(true);
    setMessage(null);
    setError(null);

    try {
      const nextData = await prepareDataForSave();
      const response = await fetch("/api/cms", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(nextData),
      });
      const result = (await response.json()) as { data?: CmsData; error?: string };

      if (!response.ok || !result.data) {
        throw new Error(result.error ?? "Failed to save CMS data");
      }

      setData(result.data);
      setPendingUploads({});
      setSavedSnapshot(JSON.stringify(result.data));
      setMessage("CMS saved and paths revalidated.");
      startTransition(() => {
        router.refresh();
      });
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Failed to save CMS data");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <Panel
        title="Site Settings"
        description="Shared brand information used by the header, footer and preview."
      >
        <Field
          label="Site Name"
          value={data.site.siteName}
          onChange={(value) => setData({ ...data, site: { ...data.site, siteName: value } })}
        />
        <AdminImageUpload
          label="Logo URL"
          value={data.site.logoUrl}
          pendingFile={pendingUploads["site.logo"] ?? null}
          onChange={(value) => setData({ ...data, site: { ...data.site, logoUrl: value } })}
          onFileChange={(file) => setPendingUpload("site.logo", file)}
        />
        <Field
          label="Footer Title"
          value={data.site.footerTitle}
          onChange={(value) => setData({ ...data, site: { ...data.site, footerTitle: value } })}
          multiline
        />
        <Field
          label="Footer Description"
          value={data.site.footerDescription}
          onChange={(value) =>
            setData({ ...data, site: { ...data.site, footerDescription: value } })
          }
          multiline
        />
      </Panel>

      <Panel
        title="Homepage"
        description="Homepage hero, features, download cards and launch flow."
      >
        <Field
          label="Hero Badge"
          value={data.home.hero.badge ?? ""}
          onChange={(value) =>
            setData({ ...data, home: { ...data.home, hero: { ...data.home.hero, badge: value } } })
          }
        />
        <AdminImageUpload
          label="Hero Image"
          value={data.home.hero.heroImageUrl ?? ""}
          pendingFile={pendingUploads["home.hero"] ?? null}
          onChange={(value) =>
            setData({
              ...data,
              home: { ...data.home, hero: { ...data.home.hero, heroImageUrl: value } },
            })
          }
          onFileChange={(file) => setPendingUpload("home.hero", file)}
        />
        <Field
          label="Hero Title"
          value={data.home.hero.title}
          onChange={(value) =>
            setData({ ...data, home: { ...data.home, hero: { ...data.home.hero, title: value } } })
          }
          multiline
        />
        <Field
          label="Hero Subtitle"
          value={data.home.hero.subtitle}
          onChange={(value) =>
            setData({
              ...data,
              home: { ...data.home, hero: { ...data.home.hero, subtitle: value } },
            })
          }
          multiline
        />
        <div className="grid gap-4 md:grid-cols-2">
          <Field
            label="Primary Label"
            value={data.home.hero.primaryLabel}
            onChange={(value) =>
              setData({
                ...data,
                home: { ...data.home, hero: { ...data.home.hero, primaryLabel: value } },
              })
            }
          />
          <Field
            label="Primary Href"
            value={data.home.hero.primaryHref}
            onChange={(value) =>
              setData({
                ...data,
                home: { ...data.home, hero: { ...data.home.hero, primaryHref: value } },
              })
            }
          />
          <Field
            label="Secondary Label"
            value={data.home.hero.secondaryLabel}
            onChange={(value) =>
              setData({
                ...data,
                home: { ...data.home, hero: { ...data.home.hero, secondaryLabel: value } },
              })
            }
          />
          <Field
            label="Secondary Href"
            value={data.home.hero.secondaryHref}
            onChange={(value) =>
              setData({
                ...data,
                home: { ...data.home, hero: { ...data.home.hero, secondaryHref: value } },
              })
            }
          />
        </div>

        <AdminArrayEditor
          label="Homepage Features"
          items={data.home.features}
          createItem={() => ""}
          onChange={(features) => setData({ ...data, home: { ...data.home, features } })}
          renderItem={(feature, index, helpers) => (
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-4">
                <p className="text-sm font-bold text-slate-900">Feature {index + 1}</p>
                <button
                  type="button"
                  onClick={helpers.remove}
                  className="rounded-full border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-bold text-red-600 transition hover:border-red-300 hover:bg-red-100"
                >
                  Remove Feature
                </button>
              </div>
              <Field label="Feature Text" value={feature} onChange={helpers.update} />
            </div>
          )}
        />

        <AdminArrayEditor
          label="Download Cards"
          items={data.home.downloadCards}
          createItem={emptyDownloadCard}
          onChange={(downloadCards) =>
            setData({ ...data, home: { ...data.home, downloadCards } })
          }
          renderItem={(card, index, helpers) => (
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-4">
                <p className="text-sm font-bold text-slate-900">Card {index + 1}</p>
                <button
                  type="button"
                  onClick={helpers.remove}
                  className="rounded-full border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-bold text-red-600 transition hover:border-red-300 hover:bg-red-100"
                >
                  Remove Card
                </button>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <Field
                  label="Key"
                  value={card.key}
                  onChange={(value) =>
                    helpers.update({ ...card, key: value as CmsDownloadCard["key"] })
                  }
                />
                <Field
                  label="Eyebrow"
                  value={card.eyebrow}
                  onChange={(value) => helpers.update({ ...card, eyebrow: value })}
                />
                <Field
                  label="Title"
                  value={card.title}
                  onChange={(value) => helpers.update({ ...card, title: value })}
                />
                <Field
                  label="Audience"
                  value={card.audience}
                  onChange={(value) => helpers.update({ ...card, audience: value })}
                />
              </div>

              <Field
                label="Description"
                value={card.description}
                onChange={(value) => helpers.update({ ...card, description: value })}
                multiline
              />
              <Field
                label="Image Alt"
                value={card.imageAlt}
                onChange={(value) => helpers.update({ ...card, imageAlt: value })}
              />
              <AdminImageUpload
                label="Card Image"
                value={card.imageUrl}
                pendingFile={pendingUploads[`home.downloadCards.${index}.image`] ?? null}
                onChange={(value) => helpers.update({ ...card, imageUrl: value })}
                onFileChange={(file) => setPendingUpload(`home.downloadCards.${index}.image`, file)}
              />

              <div className="grid gap-4 md:grid-cols-2">
                <Field
                  label="iOS URL"
                  value={card.iosUrl}
                  onChange={(value) => helpers.update({ ...card, iosUrl: value })}
                />
                <Field
                  label="Android URL"
                  value={card.androidUrl}
                  onChange={(value) => helpers.update({ ...card, androidUrl: value })}
                />
              </div>

              <AdminArrayEditor
                label="Highlights"
                items={card.highlights}
                createItem={() => ""}
                onChange={(highlights) => helpers.update({ ...card, highlights })}
                renderItem={(highlight, highlightIndex, highlightHelpers) => (
                  <div className="space-y-4">
                    <div className="flex items-start justify-between gap-4">
                      <p className="text-sm font-bold text-slate-900">
                        Highlight {highlightIndex + 1}
                      </p>
                      <button
                        type="button"
                        onClick={highlightHelpers.remove}
                        className="rounded-full border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-bold text-red-600 transition hover:border-red-300 hover:bg-red-100"
                      >
                        Remove Highlight
                      </button>
                    </div>
                    <Field
                      label="Highlight"
                      value={highlight}
                      onChange={highlightHelpers.update}
                    />
                  </div>
                )}
              />
            </div>
          )}
        />

        <AdminArrayEditor
          label="Launch Flow"
          items={data.home.launchFlow}
          createItem={emptyLaunchStep}
          onChange={(launchFlow) => setData({ ...data, home: { ...data.home, launchFlow } })}
          renderItem={(step, index, helpers) => (
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-4">
                <p className="text-sm font-bold text-slate-900">Step {index + 1}</p>
                <button
                  type="button"
                  onClick={helpers.remove}
                  className="rounded-full border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-bold text-red-600 transition hover:border-red-300 hover:bg-red-100"
                >
                  Remove Step
                </button>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <Field
                  label="Index"
                  value={step.index}
                  onChange={(value) => helpers.update({ ...step, index: value })}
                />
                <Field
                  label="Title"
                  value={step.title}
                  onChange={(value) => helpers.update({ ...step, title: value })}
                />
              </div>
              <Field
                label="Description"
                value={step.description}
                onChange={(value) => helpers.update({ ...step, description: value })}
                multiline
              />
            </div>
          )}
        />
      </Panel>

      <RolePageEditor
        title="Consumer Page"
        pendingFile={pendingUploads["consumer.hero"] ?? null}
        page={data.consumer}
        onChange={(consumer) => setData({ ...data, consumer })}
        onFileChange={(file) => setPendingUpload("consumer.hero", file)}
      />
      <RolePageEditor
        title="Courier Page"
        pendingFile={pendingUploads["courier.hero"] ?? null}
        page={data.courier}
        onChange={(courier) => setData({ ...data, courier })}
        onFileChange={(file) => setPendingUpload("courier.hero", file)}
      />
      <RolePageEditor
        title="Merchant Page"
        pendingFile={pendingUploads["merchant.hero"] ?? null}
        page={data.merchant}
        onChange={(merchant) => setData({ ...data, merchant })}
        onFileChange={(file) => setPendingUpload("merchant.hero", file)}
      />

      <Panel title="Current JSON" description="Normalized payload written to Blob.">
        <pre className="overflow-x-auto rounded-[1.5rem] bg-slate-950 p-4 text-xs leading-6 text-slate-200">
          {JSON.stringify(data, null, 2)}
        </pre>
      </Panel>

      <AdminSaveBar
        isSaving={isSaving || isPending}
        isDirty={isDirty}
        message={message}
        error={error}
        onSave={handleSave}
      />
    </div>
  );
}
