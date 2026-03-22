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
  sectionKey,
  page,
  onChange,
}: {
  title: string;
  sectionKey: string;
  page: CmsRolePage;
  onChange: (page: CmsRolePage) => void;
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
        section={sectionKey}
        value={page.hero.heroImageUrl ?? ""}
        onUploaded={(value) => onChange({ ...page, hero: { ...page.hero, heroImageUrl: value } })}
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
  const [savedSnapshot, setSavedSnapshot] = useState(JSON.stringify(initialData));
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setData(initialData);
    setSavedSnapshot(JSON.stringify(initialData));
  }, [initialData]);

  const isDirty = JSON.stringify(data) !== savedSnapshot;

  async function handleSave() {
    setIsSaving(true);
    setMessage(null);
    setError(null);

    try {
      const response = await fetch("/api/cms", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const result = (await response.json()) as { data?: CmsData; error?: string };

      if (!response.ok || !result.data) {
        throw new Error(result.error ?? "Failed to save CMS data");
      }

      setData(result.data);
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
          section="shared"
          value={data.site.logoUrl}
          onUploaded={(value) => setData({ ...data, site: { ...data.site, logoUrl: value } })}
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
          section="home"
          value={data.home.hero.heroImageUrl ?? ""}
          onUploaded={(value) =>
            setData({
              ...data,
              home: { ...data.home, hero: { ...data.home.hero, heroImageUrl: value } },
            })
          }
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
                section={`home/${card.key}`}
                value={card.imageUrl}
                onUploaded={(value) => helpers.update({ ...card, imageUrl: value })}
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
        sectionKey="consumer"
        page={data.consumer}
        onChange={(consumer) => setData({ ...data, consumer })}
      />
      <RolePageEditor
        title="Courier Page"
        sectionKey="courier"
        page={data.courier}
        onChange={(courier) => setData({ ...data, courier })}
      />
      <RolePageEditor
        title="Merchant Page"
        sectionKey="merchant"
        page={data.merchant}
        onChange={(merchant) => setData({ ...data, merchant })}
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
