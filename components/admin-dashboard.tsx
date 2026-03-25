"use client";

import type { ReactNode } from "react";
import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { AdminArrayEditor } from "@/components/admin-array-editor";
import { AdminLivePreview, type PreviewTarget } from "@/components/admin-live-preview";
import { AdminImageUpload } from "@/components/admin-image-upload";
import { AdminSaveBar } from "@/components/admin-save-bar";
import type {
  CmsBlockStyle,
  CmsContentItem,
  CmsData,
  CmsDownloadCard,
  CmsLaunchStep,
  CmsLinkGroup,
  CmsLinkItem,
  CmsRolePage,
  CmsSection,
  CmsSeo,
  CmsStat,
  CmsTextStyle,
} from "@/lib/cms-schema";
import {
  BRAND_COLOR_OPTIONS,
  defaultBlockStyle,
  defaultImageAsset,
  defaultTextStyle,
  FONT_SIZE_OPTIONS,
  FONT_WEIGHT_OPTIONS,
  LINE_HEIGHT_OPTIONS,
  RADIUS_OPTIONS,
  SHADOW_OPTIONS,
  SPACING_OPTIONS,
  TEXT_ALIGN_OPTIONS,
} from "@/lib/cms-style";
import { uploadAsset } from "@/lib/blob-upload";
import { createCmsId } from "@/lib/cms-data";
import { MAX_UPLOAD_BYTES, getImageTooLargeMessage } from "@/lib/upload-rules";

type AdminDashboardProps = {
  initialData: CmsData;
};

type PendingUploadMap = Record<string, File | null>;

function Panel({ title, description, children }: { title: string; description?: string; children: ReactNode }) {
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

function Field({
  label,
  value,
  onChange,
  multiline = false,
}: {
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  multiline?: boolean;
}) {
  return (
    <label className="space-y-2">
      <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{label}</span>
      {multiline ? (
        <textarea
          value={value}
          onChange={(event) => onChange(event.target.value)}
          rows={4}
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500"
        />
      ) : (
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500"
        />
      )}
    </label>
  );
}

function SelectField({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: readonly string[];
  onChange: (value: string) => void;
}) {
  return (
    <label className="space-y-2">
      <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

function ColorField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="space-y-2">
      <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{label}</span>
      <div className="grid gap-2 md:grid-cols-[1fr_180px]">
        <select
          value={BRAND_COLOR_OPTIONS.some((item) => item.value === value) ? value : "__custom__"}
          onChange={(event) => {
            if (event.target.value !== "__custom__") {
              onChange(event.target.value);
            }
          }}
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500"
        >
          {BRAND_COLOR_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
          <option value="__custom__">自訂 HEX</option>
        </select>
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="#RRGGBB"
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500"
        />
      </div>
    </div>
  );
}

function TextStyleEditor({ label, style, onChange }: { label: string; style: CmsTextStyle; onChange: (style: CmsTextStyle) => void }) {
  return (
    <div className="space-y-3 rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4">
      <p className="text-sm font-bold text-slate-900">{label}</p>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <SelectField label="字級" value={style.fontSize} options={FONT_SIZE_OPTIONS} onChange={(value) => onChange({ ...style, fontSize: value as CmsTextStyle["fontSize"] })} />
        <SelectField label="字重" value={style.fontWeight} options={FONT_WEIGHT_OPTIONS} onChange={(value) => onChange({ ...style, fontWeight: value as CmsTextStyle["fontWeight"] })} />
        <SelectField label="對齊" value={style.textAlign} options={TEXT_ALIGN_OPTIONS} onChange={(value) => onChange({ ...style, textAlign: value as CmsTextStyle["textAlign"] })} />
        <SelectField label="行高" value={style.lineHeight} options={LINE_HEIGHT_OPTIONS} onChange={(value) => onChange({ ...style, lineHeight: value as CmsTextStyle["lineHeight"] })} />
        <ColorField label="文字顏色" value={style.textColor} onChange={(value) => onChange({ ...style, textColor: value })} />
      </div>
    </div>
  );
}

function BlockStyleEditor({ label, style, onChange }: { label: string; style: CmsBlockStyle; onChange: (style: CmsBlockStyle) => void }) {
  return (
    <div className="space-y-3 rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4">
      <p className="text-sm font-bold text-slate-900">{label}</p>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <ColorField label="背景色" value={style.backgroundColor} onChange={(value) => onChange({ ...style, backgroundColor: value })} />
        <ColorField label="前景色" value={style.foregroundColor} onChange={(value) => onChange({ ...style, foregroundColor: value })} />
        <ColorField label="邊框色" value={style.borderColor} onChange={(value) => onChange({ ...style, borderColor: value })} />
        <SelectField label="圓角" value={style.borderRadius} options={RADIUS_OPTIONS} onChange={(value) => onChange({ ...style, borderRadius: value as CmsBlockStyle["borderRadius"] })} />
        <SelectField label="左右留白" value={style.paddingX} options={SPACING_OPTIONS} onChange={(value) => onChange({ ...style, paddingX: value as CmsBlockStyle["paddingX"] })} />
        <SelectField label="上下留白" value={style.paddingY} options={SPACING_OPTIONS} onChange={(value) => onChange({ ...style, paddingY: value as CmsBlockStyle["paddingY"] })} />
        <SelectField label="陰影" value={style.shadow} options={SHADOW_OPTIONS} onChange={(value) => onChange({ ...style, shadow: value as CmsBlockStyle["shadow"] })} />
      </div>
    </div>
  );
}

function LinkListEditor({ title, items, onChange }: { title: string; items: CmsLinkItem[]; onChange: (items: CmsLinkItem[]) => void }) {
  return (
    <AdminArrayEditor
      label={title}
      items={items}
      createItem={() => ({ label: "", href: "" })}
      onChange={onChange}
      renderItem={(item, index, helpers) => (
        <div className="grid gap-4 md:grid-cols-2">
          <Field label={`項目 ${index + 1} 文字`} value={item.label} onChange={(value) => helpers.update({ ...item, label: value })} />
          <Field label={`項目 ${index + 1} 連結`} value={item.href} onChange={(value) => helpers.update({ ...item, href: value })} />
        </div>
      )}
    />
  );
}

function SeoEditor({ seo, onChange }: { seo: CmsSeo; onChange: (seo: CmsSeo) => void }) {
  return (
    <div className="space-y-4 rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4">
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Page Title" value={seo.pageTitle} onChange={(value) => onChange({ ...seo, pageTitle: value })} />
        <Field label="Canonical Path" value={seo.canonicalPath} onChange={(value) => onChange({ ...seo, canonicalPath: value })} />
        <Field label="OG Title" value={seo.ogTitle} onChange={(value) => onChange({ ...seo, ogTitle: value })} />
        <Field label="OG Image URL" value={seo.ogImageUrl} onChange={(value) => onChange({ ...seo, ogImageUrl: value })} />
      </div>
      <Field label="Meta Description" value={seo.metaDescription} onChange={(value) => onChange({ ...seo, metaDescription: value })} multiline />
      <Field label="OG Description" value={seo.ogDescription} onChange={(value) => onChange({ ...seo, ogDescription: value })} multiline />
      <div className="flex flex-wrap gap-4">
        <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
          <input type="checkbox" checked={seo.robotsIndex} onChange={(event) => onChange({ ...seo, robotsIndex: event.target.checked })} />
          允許索引
        </label>
        <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
          <input type="checkbox" checked={seo.robotsFollow} onChange={(event) => onChange({ ...seo, robotsFollow: event.target.checked })} />
          允許追蹤連結
        </label>
      </div>
    </div>
  );
}

const imageSuggestionMap = {
  logo: { dimensions: "240 x 240 px", ratio: "1:1", format: "PNG / SVG / WebP" },
  hero: { dimensions: "1600 x 1200 px", ratio: "4:3", format: "WebP / PNG" },
  card: { dimensions: "1200 x 900 px", ratio: "4:3", format: "WebP / JPG" },
};

const emptyLinkGroup = (): CmsLinkGroup => ({ id: createCmsId("footer-group", "group"), title: "", links: [{ label: "", href: "" }] });
const emptyStat = (): CmsStat => ({ label: "", value: "" });
const emptySectionItem = (): CmsContentItem => ({
  id: createCmsId("role-card", "card"),
  eyebrow: "",
  title: "",
  description: "",
  icon: "",
  eyebrowStyle: defaultTextStyle(),
  titleStyle: defaultTextStyle({ fontSize: "xl", fontWeight: "700" }),
  descriptionStyle: defaultTextStyle(),
  blockStyle: defaultBlockStyle(),
});
const emptySection = (): CmsSection => ({
  id: "",
  badge: "",
  title: "",
  description: "",
  badgeStyle: defaultTextStyle(),
  titleStyle: defaultTextStyle({ fontSize: "4xl", fontWeight: "900" }),
  descriptionStyle: defaultTextStyle(),
  blockStyle: defaultBlockStyle({ backgroundColor: "transparent", borderColor: "transparent", shadow: "none", paddingX: "0", paddingY: "0", borderRadius: "none" }),
  items: [emptySectionItem()],
});
const emptyLaunchStep = (): CmsLaunchStep => ({
  id: createCmsId("launch-step", "step"),
  index: "",
  title: "",
  description: "",
  indexStyle: defaultTextStyle(),
  titleStyle: defaultTextStyle({ fontSize: "xl", fontWeight: "700" }),
  descriptionStyle: defaultTextStyle(),
  blockStyle: defaultBlockStyle(),
});
const emptyDownloadCard = (): CmsDownloadCard => ({
  id: createCmsId("download-card", "download"),
  key: "download-card",
  eyebrow: "",
  title: "",
  description: "",
  audience: "",
  image: defaultImageAsset("", "請填寫 alt"),
  iosUrl: "",
  androidUrl: "",
  highlights: [""],
  eyebrowStyle: defaultTextStyle(),
  titleStyle: defaultTextStyle({ fontSize: "2xl", fontWeight: "900" }),
  audienceStyle: defaultTextStyle(),
  descriptionStyle: defaultTextStyle(),
  blockStyle: defaultBlockStyle(),
});

function RolePageEditor({
  title,
  previewPage,
  page,
  pendingFile,
  onChange,
  onFileChange,
  onPreviewTarget,
}: {
  title: string;
  previewPage: PreviewTarget["page"];
  page: CmsRolePage;
  pendingFile: File | null;
  onChange: (page: CmsRolePage) => void;
  onFileChange: (file: File | null) => void;
  onPreviewTarget: (target: PreviewTarget) => void;
}) {
  return (
    <div className="space-y-5 rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4">
      <h3 className="text-base font-black text-slate-900">{title}</h3>
      <div
        className="space-y-5"
        onMouseEnter={() => onPreviewTarget({ page: previewPage, section: "hero", fieldPath: `${previewPage}.hero`, cardKey: null, cardIndex: null })}
        onFocusCapture={() => onPreviewTarget({ page: previewPage, section: "hero", fieldPath: `${previewPage}.hero`, cardKey: null, cardIndex: null })}
      >
        <Field label="Hero Badge" value={page.hero.badge} onChange={(value) => onChange({ ...page, hero: { ...page.hero, badge: value } })} />
        <Field label="Hero 標題" value={page.hero.title} onChange={(value) => onChange({ ...page, hero: { ...page.hero, title: value } })} multiline />
        <Field label="Hero 說明" value={page.hero.description} onChange={(value) => onChange({ ...page, hero: { ...page.hero, description: value } })} multiline />
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="主要按鈕文字" value={page.hero.primaryLabel} onChange={(value) => onChange({ ...page, hero: { ...page.hero, primaryLabel: value } })} />
          <Field label="主要按鈕連結" value={page.hero.primaryHref} onChange={(value) => onChange({ ...page, hero: { ...page.hero, primaryHref: value } })} />
          <Field label="次要按鈕文字" value={page.hero.secondaryLabel} onChange={(value) => onChange({ ...page, hero: { ...page.hero, secondaryLabel: value } })} />
          <Field label="次要按鈕連結" value={page.hero.secondaryHref} onChange={(value) => onChange({ ...page, hero: { ...page.hero, secondaryHref: value } })} />
        </div>
        <Field label="右側摘要標題" value={page.hero.asideTitle} onChange={(value) => onChange({ ...page, hero: { ...page.hero, asideTitle: value } })} />
        <AdminImageUpload
          label="Hero 圖片"
          image={page.hero.heroImage}
          pendingFile={pendingFile}
          onChange={(heroImage) => onChange({ ...page, hero: { ...page.hero, heroImage } })}
          onFileChange={onFileChange}
          recommendation={imageSuggestionMap.hero}
          maxBytes={MAX_UPLOAD_BYTES}
        />
        <TextStyleEditor label="Hero Badge 樣式" style={page.hero.badgeStyle} onChange={(badgeStyle) => onChange({ ...page, hero: { ...page.hero, badgeStyle } })} />
        <TextStyleEditor label="Hero 標題樣式" style={page.hero.titleStyle} onChange={(titleStyle) => onChange({ ...page, hero: { ...page.hero, titleStyle } })} />
        <TextStyleEditor label="Hero 說明樣式" style={page.hero.descriptionStyle} onChange={(descriptionStyle) => onChange({ ...page, hero: { ...page.hero, descriptionStyle } })} />
        <TextStyleEditor label="摘要標題樣式" style={page.hero.asideTitleStyle} onChange={(asideTitleStyle) => onChange({ ...page, hero: { ...page.hero, asideTitleStyle } })} />
        <BlockStyleEditor label="Hero 區塊樣式" style={page.hero.sectionStyle} onChange={(sectionStyle) => onChange({ ...page, hero: { ...page.hero, sectionStyle } })} />
        <AdminArrayEditor
          label="Hero 統計"
          items={page.hero.stats}
          createItem={emptyStat}
          onChange={(stats) => onChange({ ...page, hero: { ...page.hero, stats } })}
          renderItem={(item, index, helpers) => (
            <div className="grid gap-4 md:grid-cols-2">
              <Field label={`統計 ${index + 1} 標題`} value={item.label} onChange={(value) => helpers.update({ ...item, label: value })} />
              <Field label={`統計 ${index + 1} 內容`} value={item.value} onChange={(value) => helpers.update({ ...item, value })} />
            </div>
          )}
        />
      </div>
      <div
        onMouseEnter={() => onPreviewTarget({ page: previewPage, section: page.sections[0]?.id ?? "hero", fieldPath: `${previewPage}.sections`, cardKey: null, cardIndex: null })}
        onFocusCapture={() => onPreviewTarget({ page: previewPage, section: page.sections[0]?.id ?? "hero", fieldPath: `${previewPage}.sections`, cardKey: null, cardIndex: null })}
      >
        <AdminArrayEditor
          label="內容區塊"
          items={page.sections}
          createItem={emptySection}
          onChange={(sections) => onChange({ ...page, sections })}
          renderItem={(section, index, helpers) => (
            <div
              className="space-y-4"
              onMouseEnter={() => onPreviewTarget({ page: previewPage, section: section.id || `section-${index + 1}`, fieldPath: `${previewPage}.sections.${index}`, cardKey: null, cardIndex: null })}
              onFocusCapture={() => onPreviewTarget({ page: previewPage, section: section.id || `section-${index + 1}`, fieldPath: `${previewPage}.sections.${index}`, cardKey: null, cardIndex: null })}
            >
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Section ID" value={section.id} onChange={(value) => helpers.update({ ...section, id: value })} />
                <Field label="Badge" value={section.badge} onChange={(value) => helpers.update({ ...section, badge: value })} />
              </div>
              <Field label="標題" value={section.title} onChange={(value) => helpers.update({ ...section, title: value })} />
              <Field label="說明" value={section.description} onChange={(value) => helpers.update({ ...section, description: value })} multiline />
              <TextStyleEditor label="Section Badge 樣式" style={section.badgeStyle} onChange={(badgeStyle) => helpers.update({ ...section, badgeStyle })} />
              <TextStyleEditor label="Section 標題樣式" style={section.titleStyle} onChange={(titleStyle) => helpers.update({ ...section, titleStyle })} />
              <TextStyleEditor label="Section 說明樣式" style={section.descriptionStyle} onChange={(descriptionStyle) => helpers.update({ ...section, descriptionStyle })} />
              <BlockStyleEditor label="Section 區塊樣式" style={section.blockStyle} onChange={(blockStyle) => helpers.update({ ...section, blockStyle })} />
              <AdminArrayEditor
                label="卡片"
                items={section.items}
                createItem={emptySectionItem}
                onChange={(items) => helpers.update({ ...section, items })}
                renderItem={(item, itemIndex, itemHelpers) => (
                  <div
                    className="space-y-4"
                    onMouseEnter={() => onPreviewTarget({ page: previewPage, section: section.id || `section-${index + 1}`, fieldPath: `${previewPage}.sections.${index}.items.${itemIndex}`, cardKey: "role-card", cardIndex: itemIndex })}
                    onFocusCapture={() => onPreviewTarget({ page: previewPage, section: section.id || `section-${index + 1}`, fieldPath: `${previewPage}.sections.${index}.items.${itemIndex}`, cardKey: "role-card", cardIndex: itemIndex })}
                  >
                    <div className="grid gap-4 md:grid-cols-2">
                      <Field label="Eyebrow" value={item.eyebrow} onChange={(value) => itemHelpers.update({ ...item, eyebrow: value })} />
                      <Field label="Icon" value={item.icon ?? ""} onChange={(value) => itemHelpers.update({ ...item, icon: value })} />
                    </div>
                    <Field label="標題" value={item.title} onChange={(value) => itemHelpers.update({ ...item, title: value })} />
                    <Field label="說明" value={item.description} onChange={(value) => itemHelpers.update({ ...item, description: value })} multiline />
                    <TextStyleEditor label={`卡片 ${itemIndex + 1} Eyebrow 樣式`} style={item.eyebrowStyle} onChange={(eyebrowStyle) => itemHelpers.update({ ...item, eyebrowStyle })} />
                    <TextStyleEditor label={`卡片 ${itemIndex + 1} 標題樣式`} style={item.titleStyle} onChange={(titleStyle) => itemHelpers.update({ ...item, titleStyle })} />
                    <TextStyleEditor label={`卡片 ${itemIndex + 1} 說明樣式`} style={item.descriptionStyle} onChange={(descriptionStyle) => itemHelpers.update({ ...item, descriptionStyle })} />
                    <BlockStyleEditor label={`卡片 ${itemIndex + 1} 區塊樣式`} style={item.blockStyle} onChange={(blockStyle) => itemHelpers.update({ ...item, blockStyle })} />
                  </div>
                )}
              />
            </div>
          )}
        />
      </div>
      <SeoEditor seo={page.seo} onChange={(seo) => onChange({ ...page, seo })} />
    </div>
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
  const [uploadingKeys, setUploadingKeys] = useState<Record<string, boolean>>({});
  const [previewTarget, setPreviewTarget] = useState<PreviewTarget>({ page: "home", section: "hero", fieldPath: null, cardKey: null, cardIndex: null });
  const [previewViewport, setPreviewViewport] = useState<"desktop" | "mobile">("desktop");

  useEffect(() => {
    setData(initialData);
    setPendingUploads({});
    setUploadingKeys({});
    setSavedSnapshot(JSON.stringify(initialData));
  }, [initialData]);

  const hasPendingUploads = Object.keys(pendingUploads).length > 0;
  const hasActiveUploads = Object.keys(uploadingKeys).length > 0;
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

  function setUploading(key: string, active: boolean) {
    setUploadingKeys((current) => {
      if (!active) {
        if (!(key in current)) {
          return current;
        }

        const next = { ...current };
        delete next[key];
        return next;
      }

      return { ...current, [key]: true };
    });
  }

  async function uploadImage(file: File, uploadKey: string) {
    if (file.size > MAX_UPLOAD_BYTES) {
      throw new Error(getImageTooLargeMessage());
    }

    const result = await uploadAsset(file, uploadKey);
    return result.url;
  }

  async function uploadImageAndUpdate(
    key: string,
    uploadKey: string,
    applyUrl: (url: string) => void,
    file: File | null,
  ) {
    if (!file) {
      setPendingUpload(key, null);
      return;
    }

    setPendingUpload(key, file);
    setUploading(key, true);
    setError(null);
    setMessage(null);

    try {
      const url = await uploadImage(file, uploadKey);
      applyUrl(url);
      setPendingUpload(key, null);
      setMessage("圖片已上傳到 Blob，請按儲存寫入 CMS JSON。");
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "圖片上傳失敗");
    } finally {
      setUploading(key, false);
    }
  }

  async function prepareDataForSave() {
    return structuredClone(data);
  }

  async function handleSave() {
    if (hasActiveUploads) {
      setError("圖片仍在上傳中，請等待完成後再儲存。");
      return;
    }

    setIsSaving(true);
    setMessage(null);
    setError(null);

    try {
      const nextData = await prepareDataForSave();
      const response = await fetch("/api/cms", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nextData),
      });
      const result = (await response.json()) as { data?: CmsData; error?: string };

      if (!response.ok || !result.data) {
        throw new Error(result.error ?? "儲存失敗");
      }

      setData(result.data);
      setPendingUploads({});
      setSavedSnapshot(JSON.stringify(result.data));
      setMessage("已儲存到 Blob，前台路徑已重新整理。");
      startTransition(() => router.refresh());
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "儲存失敗");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_420px]">
      <div className="space-y-6">
        <div onMouseEnter={() => setPreviewTarget({ page: "home", section: "footer", fieldPath: "site.footer.main", cardKey: "footer-main", cardIndex: null })} onFocusCapture={() => setPreviewTarget({ page: "home", section: "footer", fieldPath: "site.footer.main", cardKey: "footer-main", cardIndex: null })}>
        <Panel title="網站設定" description="全站共用品牌資料、網址、Footer 與預設 SEO 圖片。">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="網站名稱" value={data.site.siteName} onChange={(value) => setData({ ...data, site: { ...data.site, siteName: value } })} />
            <Field label="網站網址" value={data.site.siteUrl} onChange={(value) => setData({ ...data, site: { ...data.site, siteUrl: value } })} />
            <Field label="組織名稱" value={data.site.organizationName} onChange={(value) => setData({ ...data, site: { ...data.site, organizationName: value } })} />
            <Field label="預設 SEO 圖片" value={data.site.defaultSeoImageUrl} onChange={(value) => setData({ ...data, site: { ...data.site, defaultSeoImageUrl: value } })} />
          </div>
          <AdminImageUpload label="品牌 Logo" image={data.site.logo} pendingFile={pendingUploads["site.logo"] ?? null} onChange={(logo) => setData({ ...data, site: { ...data.site, logo } })} onFileChange={(file) => uploadImageAndUpdate("site.logo", "shared/logo", (url) => setData((current) => ({ ...current, site: { ...current.site, logo: { ...current.site.logo, url } } })), file)} recommendation={imageSuggestionMap.logo} maxBytes={MAX_UPLOAD_BYTES} isUploading={Boolean(uploadingKeys["site.logo"])} />
          <Field label="Footer 標題" value={data.site.footerTitle} onChange={(value) => setData({ ...data, site: { ...data.site, footerTitle: value } })} multiline />
          <Field label="Footer 說明" value={data.site.footerDescription} onChange={(value) => setData({ ...data, site: { ...data.site, footerDescription: value } })} multiline />
          <TextStyleEditor label="Footer 標題樣式" style={data.site.footerTitleStyle} onChange={(footerTitleStyle) => setData({ ...data, site: { ...data.site, footerTitleStyle } })} />
          <TextStyleEditor label="Footer 說明樣式" style={data.site.footerDescriptionStyle} onChange={(footerDescriptionStyle) => setData({ ...data, site: { ...data.site, footerDescriptionStyle } })} />
          <BlockStyleEditor label="Footer 區塊樣式" style={data.site.footerStyle} onChange={(footerStyle) => setData({ ...data, site: { ...data.site, footerStyle } })} />
          <AdminArrayEditor
            label="Footer 右側連結群組"
            items={data.site.footerLinkGroups}
            createItem={emptyLinkGroup}
            onChange={(footerLinkGroups) => setData({ ...data, site: { ...data.site, footerLinkGroups } })}
            renderItem={(group, index, helpers) => (
              <div className="space-y-4" onMouseEnter={() => setPreviewTarget({ page: "home", section: "footer", fieldPath: `site.footerLinkGroups.${index}`, cardKey: "footer-link-group", cardIndex: index })} onFocusCapture={() => setPreviewTarget({ page: "home", section: "footer", fieldPath: `site.footerLinkGroups.${index}`, cardKey: "footer-link-group", cardIndex: index })}>
                <Field label={`群組 ${index + 1} 標題`} value={group.title} onChange={(value) => helpers.update({ ...group, title: value })} />
                <LinkListEditor title="連結" items={group.links} onChange={(links) => helpers.update({ ...group, links })} />
              </div>
            )}
          />
        </Panel>
        </div>

        <div onMouseEnter={() => setPreviewTarget({ page: "home", section: "header", fieldPath: "home.header", cardKey: null, cardIndex: null })} onFocusCapture={() => setPreviewTarget({ page: "home", section: "header", fieldPath: "home.header", cardKey: null, cardIndex: null })}>
        <Panel title="首頁 Header" description="導覽列、副標與右上 CTA。">
          <Field label="Header 副標" value={data.home.header.subtitle} onChange={(value) => setData({ ...data, home: { ...data.home, header: { ...data.home.header, subtitle: value } } })} />
          <TextStyleEditor label="Header 副標樣式" style={data.home.header.subtitleStyle} onChange={(subtitleStyle) => setData({ ...data, home: { ...data.home, header: { ...data.home.header, subtitleStyle } } })} />
          <BlockStyleEditor label="Header 區塊樣式" style={data.home.header.blockStyle} onChange={(blockStyle) => setData({ ...data, home: { ...data.home, header: { ...data.home.header, blockStyle } } })} />
          <LinkListEditor title="Header 導覽列項目" items={data.home.header.navItems} onChange={(navItems) => setData({ ...data, home: { ...data.home, header: { ...data.home.header, navItems } } })} />
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Header 右上 CTA 文字" value={data.home.header.cta.label} onChange={(value) => setData({ ...data, home: { ...data.home, header: { ...data.home.header, cta: { ...data.home.header.cta, label: value } } } })} />
            <Field label="Header 右上 CTA 連結" value={data.home.header.cta.href} onChange={(value) => setData({ ...data, home: { ...data.home, header: { ...data.home.header, cta: { ...data.home.header.cta, href: value } } } })} />
          </div>
        </Panel>
        </div>

        <div onMouseEnter={() => setPreviewTarget({ page: "home", section: "hero", fieldPath: "home.hero", cardKey: null, cardIndex: null })} onFocusCapture={() => setPreviewTarget({ page: "home", section: "hero", fieldPath: "home.hero", cardKey: null, cardIndex: null })}>
        <Panel title="首頁 Hero" description="主視覺文案、Badge、按鈕與圖片。">
          <Field label="Hero Badge" value={data.home.hero.badge} onChange={(value) => setData({ ...data, home: { ...data.home, hero: { ...data.home.hero, badge: value } } })} />
          <Field label="Hero 標題" value={data.home.hero.title} onChange={(value) => setData({ ...data, home: { ...data.home, hero: { ...data.home.hero, title: value } } })} multiline />
          <Field label="Hero 說明" value={data.home.hero.subtitle} onChange={(value) => setData({ ...data, home: { ...data.home, hero: { ...data.home.hero, subtitle: value } } })} multiline />
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="主要按鈕文字" value={data.home.hero.primaryLabel} onChange={(value) => setData({ ...data, home: { ...data.home, hero: { ...data.home.hero, primaryLabel: value } } })} />
            <Field label="主要按鈕連結" value={data.home.hero.primaryHref} onChange={(value) => setData({ ...data, home: { ...data.home, hero: { ...data.home.hero, primaryHref: value } } })} />
            <Field label="次要按鈕文字" value={data.home.hero.secondaryLabel} onChange={(value) => setData({ ...data, home: { ...data.home, hero: { ...data.home.hero, secondaryLabel: value } } })} />
            <Field label="次要按鈕連結" value={data.home.hero.secondaryHref} onChange={(value) => setData({ ...data, home: { ...data.home, hero: { ...data.home.hero, secondaryHref: value } } })} />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="裝置 Badge 文案" value={data.home.hero.deviceBadge} onChange={(value) => setData({ ...data, home: { ...data.home, hero: { ...data.home.hero, deviceBadge: value } } })} />
            <Field label="第二顆 Badge 文案" value={data.home.hero.secondaryBadge} onChange={(value) => setData({ ...data, home: { ...data.home, hero: { ...data.home.hero, secondaryBadge: value } } })} />
          </div>
          <AdminImageUpload label="Hero 圖片" image={data.home.hero.heroImage} pendingFile={pendingUploads["home.hero"] ?? null} onChange={(heroImage) => setData({ ...data, home: { ...data.home, hero: { ...data.home.hero, heroImage } } })} onFileChange={(file) => uploadImageAndUpdate("home.hero", "home/hero", (url) => setData((current) => ({ ...current, home: { ...current.home, hero: { ...current.home.hero, heroImage: { ...current.home.hero.heroImage, url } } } })), file)} recommendation={imageSuggestionMap.hero} maxBytes={MAX_UPLOAD_BYTES} isUploading={Boolean(uploadingKeys["home.hero"])} />
          <TextStyleEditor label="Hero Badge 樣式" style={data.home.hero.badgeStyle} onChange={(badgeStyle) => setData({ ...data, home: { ...data.home, hero: { ...data.home.hero, badgeStyle } } })} />
          <TextStyleEditor label="Hero 標題樣式" style={data.home.hero.titleStyle} onChange={(titleStyle) => setData({ ...data, home: { ...data.home, hero: { ...data.home.hero, titleStyle } } })} />
          <TextStyleEditor label="Hero 說明樣式" style={data.home.hero.subtitleStyle} onChange={(subtitleStyle) => setData({ ...data, home: { ...data.home, hero: { ...data.home.hero, subtitleStyle } } })} />
          <TextStyleEditor label="裝置 Badge 樣式" style={data.home.hero.deviceBadgeStyle} onChange={(deviceBadgeStyle) => setData({ ...data, home: { ...data.home, hero: { ...data.home.hero, deviceBadgeStyle } } })} />
          <TextStyleEditor label="第二顆 Badge 樣式" style={data.home.hero.secondaryBadgeStyle} onChange={(secondaryBadgeStyle) => setData({ ...data, home: { ...data.home, hero: { ...data.home.hero, secondaryBadgeStyle } } })} />
          <BlockStyleEditor label="Hero 區塊樣式" style={data.home.hero.sectionStyle} onChange={(sectionStyle) => setData({ ...data, home: { ...data.home, hero: { ...data.home.hero, sectionStyle } } })} />
        </Panel>
        </div>

        <div onMouseEnter={() => setPreviewTarget({ page: "home", section: "features", fieldPath: "home.features", cardKey: null, cardIndex: null })} onFocusCapture={() => setPreviewTarget({ page: "home", section: "features", fieldPath: "home.features", cardKey: null, cardIndex: null })}>
        <Panel title="首頁特色卡片" description="Hero 右側 feature cards。">
          <BlockStyleEditor label="特色卡片容器樣式" style={data.home.features.sectionStyle} onChange={(sectionStyle) => setData({ ...data, home: { ...data.home, features: { ...data.home.features, sectionStyle } } })} />
          <AdminArrayEditor
            label="Feature Cards"
            items={data.home.features.cards}
            createItem={() => ({ id: createCmsId("feature-card", "feature"), eyebrow: "", title: "", description: "", eyebrowStyle: defaultTextStyle(), titleStyle: defaultTextStyle({ fontSize: "xl", fontWeight: "700" }), descriptionStyle: defaultTextStyle(), blockStyle: defaultBlockStyle() })}
            onChange={(cards) => setData({ ...data, home: { ...data.home, features: { ...data.home.features, cards } } })}
            renderItem={(card, index, helpers) => (
              <div className="space-y-4" onMouseEnter={() => setPreviewTarget({ page: "home", section: "features", fieldPath: `home.features.cards.${index}`, cardKey: "feature-card", cardIndex: index })} onFocusCapture={() => setPreviewTarget({ page: "home", section: "features", fieldPath: `home.features.cards.${index}`, cardKey: "feature-card", cardIndex: index })}>
                <Field label={`卡片 ${index + 1} Eyebrow`} value={card.eyebrow} onChange={(value) => helpers.update({ ...card, eyebrow: value })} />
                <Field label={`卡片 ${index + 1} 標題`} value={card.title} onChange={(value) => helpers.update({ ...card, title: value })} />
                <Field label={`卡片 ${index + 1} 說明`} value={card.description} onChange={(value) => helpers.update({ ...card, description: value })} multiline />
                <TextStyleEditor label="Eyebrow 樣式" style={card.eyebrowStyle} onChange={(eyebrowStyle) => helpers.update({ ...card, eyebrowStyle })} />
                <TextStyleEditor label="標題樣式" style={card.titleStyle} onChange={(titleStyle) => helpers.update({ ...card, titleStyle })} />
                <TextStyleEditor label="說明樣式" style={card.descriptionStyle} onChange={(descriptionStyle) => helpers.update({ ...card, descriptionStyle })} />
                <BlockStyleEditor label="卡片樣式" style={card.blockStyle} onChange={(blockStyle) => helpers.update({ ...card, blockStyle })} />
              </div>
            )}
          />
        </Panel>
        </div>

        <div onMouseEnter={() => setPreviewTarget({ page: "home", section: "features", fieldPath: "home.downloadCards", cardKey: null, cardIndex: null })} onFocusCapture={() => setPreviewTarget({ page: "home", section: "features", fieldPath: "home.downloadCards", cardKey: null, cardIndex: null })}>
        <Panel title="首頁下載卡" description="三個 App 下載卡與圖片。">
          <AdminArrayEditor
            label="下載卡"
            items={data.home.downloadCards}
            createItem={emptyDownloadCard}
            onChange={(downloadCards) => setData({ ...data, home: { ...data.home, downloadCards } })}
            renderItem={(card, index, helpers) => (
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <SelectField label="Key" value={card.key} options={["consumer", "courier", "merchant"]} onChange={(value) => helpers.update({ ...card, key: value as CmsDownloadCard["key"] })} />
                  <Field label="Eyebrow" value={card.eyebrow} onChange={(value) => helpers.update({ ...card, eyebrow: value })} />
                  <Field label="標題" value={card.title} onChange={(value) => helpers.update({ ...card, title: value })} />
                  <Field label="受眾" value={card.audience} onChange={(value) => helpers.update({ ...card, audience: value })} />
                </div>
                <Field label="說明" value={card.description} onChange={(value) => helpers.update({ ...card, description: value })} multiline />
                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="iOS URL" value={card.iosUrl} onChange={(value) => helpers.update({ ...card, iosUrl: value })} />
                  <Field label="Android URL" value={card.androidUrl} onChange={(value) => helpers.update({ ...card, androidUrl: value })} />
                </div>
                <AdminImageUpload label="卡片圖片" image={card.image} pendingFile={pendingUploads[`home.downloadCards.${index}.image`] ?? null} onChange={(image) => helpers.update({ ...card, image })} onFileChange={(file) => uploadImageAndUpdate(`home.downloadCards.${index}.image`, `home/${card.key}`, (url) => setData((current) => ({ ...current, home: { ...current.home, downloadCards: current.home.downloadCards.map((currentCard, currentIndex) => currentIndex === index ? { ...currentCard, image: { ...currentCard.image, url } } : currentCard) } })), file)} recommendation={imageSuggestionMap.card} maxBytes={MAX_UPLOAD_BYTES} isUploading={Boolean(uploadingKeys[`home.downloadCards.${index}.image`])} />
                <TextStyleEditor label="Eyebrow 樣式" style={card.eyebrowStyle} onChange={(eyebrowStyle) => helpers.update({ ...card, eyebrowStyle })} />
                <TextStyleEditor label="標題樣式" style={card.titleStyle} onChange={(titleStyle) => helpers.update({ ...card, titleStyle })} />
                <TextStyleEditor label="受眾樣式" style={card.audienceStyle} onChange={(audienceStyle) => helpers.update({ ...card, audienceStyle })} />
                <TextStyleEditor label="說明樣式" style={card.descriptionStyle} onChange={(descriptionStyle) => helpers.update({ ...card, descriptionStyle })} />
                <BlockStyleEditor label="卡片樣式" style={card.blockStyle} onChange={(blockStyle) => helpers.update({ ...card, blockStyle })} />
                <AdminArrayEditor
                  label="Highlights"
                  items={card.highlights}
                  createItem={() => ""}
                  onChange={(highlights) => helpers.update({ ...card, highlights })}
                  renderItem={(item, itemIndex, itemHelpers) => (
                    <Field label={`Highlight ${itemIndex + 1}`} value={item} onChange={itemHelpers.update} />
                  )}
                />
              </div>
            )}
          />
        </Panel>
        </div>

        <div onMouseEnter={() => setPreviewTarget({ page: "home", section: "launch-flow", fieldPath: "home.launchFlow.left", cardKey: "launch-main", cardIndex: null })} onFocusCapture={() => setPreviewTarget({ page: "home", section: "launch-flow", fieldPath: "home.launchFlow.left", cardKey: "launch-main", cardIndex: null })}>
        <Panel title="首頁 Launch Flow" description="左側介紹與右側步驟卡。">
          <Field label="左側 Eyebrow" value={data.home.launchFlow.eyebrow} onChange={(value) => setData({ ...data, home: { ...data.home, launchFlow: { ...data.home.launchFlow, eyebrow: value } } })} />
          <Field label="左側標題" value={data.home.launchFlow.title} onChange={(value) => setData({ ...data, home: { ...data.home, launchFlow: { ...data.home.launchFlow, title: value } } })} multiline />
          <Field label="左側說明" value={data.home.launchFlow.description} onChange={(value) => setData({ ...data, home: { ...data.home, launchFlow: { ...data.home.launchFlow, description: value } } })} multiline />
          <TextStyleEditor label="左側 Eyebrow 樣式" style={data.home.launchFlow.eyebrowStyle} onChange={(eyebrowStyle) => setData({ ...data, home: { ...data.home, launchFlow: { ...data.home.launchFlow, eyebrowStyle } } })} />
          <TextStyleEditor label="左側標題樣式" style={data.home.launchFlow.titleStyle} onChange={(titleStyle) => setData({ ...data, home: { ...data.home, launchFlow: { ...data.home.launchFlow, titleStyle } } })} />
          <TextStyleEditor label="左側說明樣式" style={data.home.launchFlow.descriptionStyle} onChange={(descriptionStyle) => setData({ ...data, home: { ...data.home, launchFlow: { ...data.home.launchFlow, descriptionStyle } } })} />
          <BlockStyleEditor label="左側區塊樣式" style={data.home.launchFlow.leftBlockStyle} onChange={(leftBlockStyle) => setData({ ...data, home: { ...data.home, launchFlow: { ...data.home.launchFlow, leftBlockStyle } } })} />
          <BlockStyleEditor label="右側區塊樣式" style={data.home.launchFlow.rightBlockStyle} onChange={(rightBlockStyle) => setData({ ...data, home: { ...data.home, launchFlow: { ...data.home.launchFlow, rightBlockStyle } } })} />
          <AdminArrayEditor
            label="步驟卡"
            items={data.home.launchFlow.steps}
            createItem={emptyLaunchStep}
            onChange={(steps) => setData({ ...data, home: { ...data.home, launchFlow: { ...data.home.launchFlow, steps } } })}
            renderItem={(step, index, helpers) => (
              <div className="space-y-4" onMouseEnter={() => setPreviewTarget({ page: "home", section: "launch-flow", fieldPath: `home.launchFlow.steps.${index}`, cardKey: "launch-step", cardIndex: index })} onFocusCapture={() => setPreviewTarget({ page: "home", section: "launch-flow", fieldPath: `home.launchFlow.steps.${index}`, cardKey: "launch-step", cardIndex: index })}>
                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="序號" value={step.index} onChange={(value) => helpers.update({ ...step, index: value })} />
                  <Field label="標題" value={step.title} onChange={(value) => helpers.update({ ...step, title: value })} />
                </div>
                <Field label="說明" value={step.description} onChange={(value) => helpers.update({ ...step, description: value })} multiline />
                <TextStyleEditor label="序號樣式" style={step.indexStyle} onChange={(indexStyle) => helpers.update({ ...step, indexStyle })} />
                <TextStyleEditor label="標題樣式" style={step.titleStyle} onChange={(titleStyle) => helpers.update({ ...step, titleStyle })} />
                <TextStyleEditor label="說明樣式" style={step.descriptionStyle} onChange={(descriptionStyle) => helpers.update({ ...step, descriptionStyle })} />
                <BlockStyleEditor label="步驟卡樣式" style={step.blockStyle} onChange={(blockStyle) => helpers.update({ ...step, blockStyle })} />
              </div>
            )}
          />
        </Panel>
        </div>

        <Panel title="消費者頁" description="消費者頁 Hero、內容區塊與 SEO。">
          <RolePageEditor title="消費者頁內容" previewPage="consumer" page={data.consumer} pendingFile={pendingUploads["consumer.hero"] ?? null} onChange={(consumer) => setData({ ...data, consumer })} onFileChange={(file) => uploadImageAndUpdate("consumer.hero", "consumer/hero", (url) => setData((current) => ({ ...current, consumer: { ...current.consumer, hero: { ...current.consumer.hero, heroImage: { ...current.consumer.hero.heroImage, url } } } })), file)} onPreviewTarget={setPreviewTarget} />
        </Panel>

        <Panel title="騎手頁" description="騎手頁 Hero、內容區塊與 SEO。">
          <RolePageEditor title="騎手頁內容" previewPage="courier" page={data.courier} pendingFile={pendingUploads["courier.hero"] ?? null} onChange={(courier) => setData({ ...data, courier })} onFileChange={(file) => uploadImageAndUpdate("courier.hero", "courier/hero", (url) => setData((current) => ({ ...current, courier: { ...current.courier, hero: { ...current.courier.hero, heroImage: { ...current.courier.hero.heroImage, url } } } })), file)} onPreviewTarget={setPreviewTarget} />
        </Panel>

        <Panel title="店家頁" description="店家頁 Hero、內容區塊與 SEO。">
          <RolePageEditor title="店家頁內容" previewPage="merchant" page={data.merchant} pendingFile={pendingUploads["merchant.hero"] ?? null} onChange={(merchant) => setData({ ...data, merchant })} onFileChange={(file) => uploadImageAndUpdate("merchant.hero", "merchant/hero", (url) => setData((current) => ({ ...current, merchant: { ...current.merchant, hero: { ...current.merchant.hero, heroImage: { ...current.merchant.hero.heroImage, url } } } })), file)} onPreviewTarget={setPreviewTarget} />
        </Panel>

        <Panel title="SEO / GEO 設定" description="首頁與三個角色頁的 metadata 基礎欄位。">
          <div className="space-y-6">
            <div>
              <h3 className="mb-3 text-base font-black text-slate-900">首頁</h3>
              <SeoEditor seo={data.home.seo} onChange={(seo) => setData({ ...data, home: { ...data.home, seo } })} />
            </div>
            <div>
              <h3 className="mb-3 text-base font-black text-slate-900">消費者頁</h3>
              <SeoEditor seo={data.consumer.seo} onChange={(seo) => setData({ ...data, consumer: { ...data.consumer, seo } })} />
            </div>
            <div>
              <h3 className="mb-3 text-base font-black text-slate-900">騎手頁</h3>
              <SeoEditor seo={data.courier.seo} onChange={(seo) => setData({ ...data, courier: { ...data.courier, seo } })} />
            </div>
            <div>
              <h3 className="mb-3 text-base font-black text-slate-900">店家頁</h3>
              <SeoEditor seo={data.merchant.seo} onChange={(seo) => setData({ ...data, merchant: { ...data.merchant, seo } })} />
            </div>
          </div>
        </Panel>

        <AdminSaveBar isSaving={isSaving || isPending || hasActiveUploads} isDirty={isDirty} message={message} error={error} onSave={handleSave} />
      </div>

      <aside className="xl:sticky xl:top-6 xl:h-[calc(100vh-3rem)]">
        <Panel title="即時預覽" description="使用與前台相同元件，支援桌機 / 手機切換與區塊定位。">
          <div className="flex flex-wrap gap-2">
            {([
              [{ page: "home", section: "header" }, "Header"],
              [{ page: "home", section: "hero" }, "Hero"],
              [{ page: "home", section: "features" }, "Features"],
              [{ page: "home", section: "launch-flow" }, "Launch Flow"],
              [{ page: "home", section: "footer" }, "Footer"],
            ] as const).map(([key, label]) => (
              <button key={`${key.page}-${key.section}`} type="button" onClick={() => setPreviewTarget(key)} className={`rounded-full px-3 py-2 text-xs font-bold ${previewTarget.page === key.page && previewTarget.section === key.section ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-700"}`}>
                {label}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={() => setPreviewViewport("desktop")} className={`rounded-full px-3 py-2 text-xs font-bold ${previewViewport === "desktop" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-700"}`}>桌機</button>
            <button type="button" onClick={() => setPreviewViewport("mobile")} className={`rounded-full px-3 py-2 text-xs font-bold ${previewViewport === "mobile" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-700"}`}>手機</button>
          </div>
          <div className="rounded-[2rem] bg-slate-100">
            <AdminLivePreview site={data} target={previewTarget} viewport={previewViewport} />
          </div>
        </Panel>
      </aside>
    </div>
  );
}
