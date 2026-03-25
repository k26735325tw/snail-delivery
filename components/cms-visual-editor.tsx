"use client";

import { useRef } from "react";

import { SiteAbout } from "@/components/site-about";
import { CmsVisualEditorProvider, useCmsVisualEditor, type VisualPageKey } from "@/components/cms-visual-context";
import { RolePage } from "@/components/role-page";
import { SiteHome } from "@/components/site-home";
import type { CmsArrayCollectionPath } from "@/lib/cms-data";
import type { CmsBlockStyle, CmsData, CmsImageAsset, CmsTextStyle } from "@/lib/cms-schema";
import {
  BRAND_COLOR_OPTIONS,
  FONT_SIZE_OPTIONS,
  FONT_WEIGHT_OPTIONS,
  LINE_HEIGHT_OPTIONS,
  OBJECT_FIT_OPTIONS,
  RADIUS_OPTIONS,
  SHADOW_OPTIONS,
  TEXT_ALIGN_OPTIONS,
} from "@/lib/cms-style";
import {
  IMAGE_UPLOAD_ACCEPT,
  MAX_UPLOAD_BYTES,
  VIDEO_UPLOAD_ACCEPT,
  getImageTooLargeMessage,
  getImageUploadGuidance,
  getVideoTooLargeMessage,
  getVideoUploadGuidance,
} from "@/lib/upload-rules";

const ABOUT_VIDEO_ACCEPTED_TYPES = new Set(["video/mp4", "video/webm"]);

function Field({
  label,
  value,
  onChange,
  multiline = false,
  type = "text",
}: {
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  multiline?: boolean;
  type?: string;
}) {
  return (
    <label className="space-y-2">
      <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{label}</span>
      {multiline ? (
        <textarea
          value={String(value)}
          rows={4}
          onChange={(event) => onChange(event.target.value)}
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500"
        />
      ) : (
        <input
          type={type}
          value={String(value)}
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
      <div className="grid gap-2">
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

function TextStylePanel({ path, value }: { path: string; value: CmsTextStyle }) {
  const editor = useCmsVisualEditor();

  if (!editor) {
    return null;
  }

  return (
    <div className="space-y-4 rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4">
      <p className="text-sm font-bold text-slate-900">文字樣式</p>
      <div className="grid gap-4">
        <SelectField label="字級" value={value.fontSize} options={FONT_SIZE_OPTIONS} onChange={(next) => editor.updateValue(`${path}.fontSize`, next)} />
        <SelectField label="字重" value={value.fontWeight} options={FONT_WEIGHT_OPTIONS} onChange={(next) => editor.updateValue(`${path}.fontWeight`, next)} />
        <SelectField label="對齊" value={value.textAlign} options={TEXT_ALIGN_OPTIONS} onChange={(next) => editor.updateValue(`${path}.textAlign`, next)} />
        <SelectField label="行高" value={value.lineHeight} options={LINE_HEIGHT_OPTIONS} onChange={(next) => editor.updateValue(`${path}.lineHeight`, next)} />
        <ColorField label="文字顏色" value={value.textColor} onChange={(next) => editor.updateValue(`${path}.textColor`, next)} />
      </div>
    </div>
  );
}

function BlockStylePanel({ path, value }: { path: string; value: CmsBlockStyle }) {
  const editor = useCmsVisualEditor();

  if (!editor) {
    return null;
  }

  return (
    <div className="space-y-4 rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4">
      <p className="text-sm font-bold text-slate-900">區塊樣式</p>
      <div className="grid gap-4">
        <ColorField label="背景色" value={value.backgroundColor} onChange={(next) => editor.updateValue(`${path}.backgroundColor`, next)} />
        <ColorField label="前景色" value={value.foregroundColor} onChange={(next) => editor.updateValue(`${path}.foregroundColor`, next)} />
        <ColorField label="邊框色" value={value.borderColor} onChange={(next) => editor.updateValue(`${path}.borderColor`, next)} />
        <SelectField label="圓角" value={value.borderRadius} options={RADIUS_OPTIONS} onChange={(next) => editor.updateValue(`${path}.borderRadius`, next)} />
        <SelectField label="陰影" value={value.shadow} options={SHADOW_OPTIONS} onChange={(next) => editor.updateValue(`${path}.shadow`, next)} />
      </div>
    </div>
  );
}

function getImageRecommendation(path: string, uploadKey?: string) {
  if (path === "site.logo" || uploadKey === "shared/logo") {
    return { dimensions: "240 × 240 px" };
  }

  if (path.endsWith(".heroImage") || uploadKey?.endsWith("/hero")) {
    return { dimensions: "1600 × 1200 px" };
  }

  if (path.includes(".downloadCards.") || uploadKey?.startsWith("home/download-cards/")) {
    return { dimensions: "1200 × 900 px" };
  }

  if (path.includes(".partnersSection.items.")) {
    return { dimensions: "1200 × 900 px" };
  }

  if (
    path.includes(".flexSection.blocks.") ||
    uploadKey?.startsWith("home/flex-section/image/") ||
    uploadKey?.startsWith("about/flex-section/image/")
  ) {
    return { dimensions: "1600 × 900 px" };
  }

  return null;
}

function ImagePanel({ path, value, uploadKey }: { path: string; value: CmsImageAsset; uploadKey?: string }) {
  const editor = useCmsVisualEditor();
  const uploadRef = useRef<HTMLInputElement | null>(null);
  const recommendation = getImageRecommendation(path, uploadKey);

  if (!editor) {
    return null;
  }

  return (
    <div className="space-y-4 rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-bold text-slate-900">圖片設定</p>
        <div className="flex flex-col items-end gap-2">
          {recommendation ? (
            <div className="text-right">
              <p className="text-xs font-semibold text-slate-600">{getImageUploadGuidance(recommendation.dimensions)}</p>
            </div>
          ) : null}
          <button
            type="button"
            onClick={() => uploadRef.current?.click()}
            className="appearance-none rounded-full border border-slate-300 bg-white px-4 py-2 text-xs font-black text-slate-900 shadow-sm transition hover:border-slate-400 hover:bg-slate-100"
          >
            {editor.isUploadingPath(path) ? "上傳中" : "更換圖片"}
          </button>
        </div>
      </div>
      <input
        ref={uploadRef}
        type="file"
        accept={IMAGE_UPLOAD_ACCEPT}
        className="hidden"
        onChange={async (event) => {
          const file = event.target.files?.[0];

          if (file) {
            if (file.size > MAX_UPLOAD_BYTES) {
              editor.setErrorMessage(getImageTooLargeMessage());
              event.target.value = "";
              return;
            }

            await editor.uploadImage(path, file, uploadKey);
          }

          event.target.value = "";
        }}
      />
      <Field label="Alt 文字" value={value.alt} onChange={(next) => editor.updateValue(`${path}.alt`, next)} />
      <SelectField label="Object Fit" value={value.objectFit} options={OBJECT_FIT_OPTIONS} onChange={(next) => editor.updateValue(`${path}.objectFit`, next)} />
      <Field label="Focal X" type="number" value={value.focalX} onChange={(next) => editor.updateValue(`${path}.focalX`, Number(next))} />
      <Field label="Focal Y" type="number" value={value.focalY} onChange={(next) => editor.updateValue(`${path}.focalY`, Number(next))} />
      <Field label="桌機高度" type="number" value={value.desktopHeight} onChange={(next) => editor.updateValue(`${path}.desktopHeight`, Number(next))} />
      <Field label="手機高度" type="number" value={value.mobileHeight} onChange={(next) => editor.updateValue(`${path}.mobileHeight`, Number(next))} />
    </div>
  );
}

function FlatImagePanel({
  urlPath,
  altPath,
  url,
  alt,
  uploadKey,
}: {
  urlPath: string;
  altPath: string;
  url: string;
  alt: string;
  uploadKey: string;
}) {
  const editor = useCmsVisualEditor();
  const uploadRef = useRef<HTMLInputElement | null>(null);
  const recommendation = getImageRecommendation(urlPath, uploadKey);

  if (!editor) {
    return null;
  }

  return (
    <div className="space-y-4 rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-bold text-slate-900">圖片設定</p>
        <div className="flex flex-col items-end gap-2">
          {recommendation ? (
            <div className="text-right">
              <p className="text-xs font-semibold text-slate-600">{getImageUploadGuidance(recommendation.dimensions)}</p>
            </div>
          ) : null}
          <button
            type="button"
            onClick={() => uploadRef.current?.click()}
            className="appearance-none rounded-full border border-slate-300 bg-white px-4 py-2 text-xs font-black text-slate-900 shadow-sm transition hover:border-slate-400 hover:bg-slate-100"
          >
            {editor.isUploadingPath(urlPath) ? "上傳中" : "更換圖片"}
          </button>
        </div>
      </div>
      <input
        ref={uploadRef}
        type="file"
        accept={IMAGE_UPLOAD_ACCEPT}
        className="hidden"
        onChange={async (event) => {
          const file = event.target.files?.[0];

          if (file) {
            if (file.size > MAX_UPLOAD_BYTES) {
              editor.setErrorMessage(getImageTooLargeMessage());
              event.target.value = "";
              return;
            }

            try {
              const nextUrl = await editor.uploadFile(urlPath, file, uploadKey);
              editor.updateValue(urlPath, nextUrl);
            } catch {
              // Error state is already handled in uploadFile.
            }
          }

          event.target.value = "";
        }}
      />
      <Field label="圖片 URL" value={url} onChange={(next) => editor.updateValue(urlPath, next)} />
      <Field label="Alt 文字" value={alt} onChange={(next) => editor.updateValue(altPath, next)} />
    </div>
  );
}

function VideoPanel({
  path,
  value,
  posterPath,
  uploadKey = "about/video",
}: {
  path: string;
  value: string;
  posterPath?: string;
  uploadKey?: string;
}) {
  const editor = useCmsVisualEditor();
  const uploadRef = useRef<HTMLInputElement | null>(null);

  if (!editor) {
    return null;
  }

  return (
    <div className="space-y-4 rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-bold text-slate-900">影片設定</p>
          <p className="text-[11px] text-slate-500">{getVideoUploadGuidance("16:9")}</p>
        </div>
        <button
          type="button"
          onClick={() => uploadRef.current?.click()}
          className="appearance-none rounded-full border border-slate-300 bg-white px-4 py-2 text-xs font-black text-slate-900 shadow-sm transition hover:border-slate-400 hover:bg-slate-100"
        >
          {editor.isUploadingPath(path) ? "上傳中" : "上傳影片"}
        </button>
      </div>
      <input
        ref={uploadRef}
        type="file"
        accept={VIDEO_UPLOAD_ACCEPT}
        className="hidden"
        onChange={async (event) => {
          const file = event.target.files?.[0];

          if (file) {
            if (!ABOUT_VIDEO_ACCEPTED_TYPES.has(file.type)) {
              editor.setErrorMessage("目前只支援 MP4 / WebM 格式影片。");
              event.target.value = "";
              return;
            }

            if (file.size > MAX_UPLOAD_BYTES) {
              editor.setErrorMessage(getVideoTooLargeMessage());
              event.target.value = "";
              return;
            }

            try {
              const url = await editor.uploadFile(path, file, uploadKey);
              editor.updateValue(path, url);
            } catch {
              // Error state is already handled in uploadFile.
            }
          }

          event.target.value = "";
        }}
      />
      <Field label="影片 URL" value={value} onChange={(next) => editor.updateValue(path, next)} />
      {posterPath ? <Field label="Poster URL" value={String(editor.getValue(posterPath) ?? "")} onChange={(next) => editor.updateValue(posterPath, next)} /> : null}
    </div>
  );
}

function CardCrudPanel({
  collectionPath,
  itemId,
  itemIndex,
}: {
  collectionPath: CmsArrayCollectionPath;
  itemId?: string;
  itemIndex?: number;
}) {
  const editor = useCmsVisualEditor();
  const items = editor?.getValue(collectionPath);
  const total = Array.isArray(items) ? items.length : 0;

  if (!editor) {
    return null;
  }

  return (
    <div className="space-y-3 rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-bold text-slate-900">卡片 CRUD</p>
        <button
          type="button"
          onClick={() => editor.addArrayItem(collectionPath, itemId ?? null)}
          className="rounded-full border border-slate-300 bg-white px-3 py-1.5 text-xs font-black text-slate-700"
        >
          Add Item
        </button>
      </div>

      {itemId ? (
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => editor.moveArrayItem(collectionPath, itemId, "up")}
            disabled={!itemIndex}
            className="rounded-full border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-700 disabled:opacity-40"
          >
            上移
          </button>
          <button
            type="button"
            onClick={() => editor.moveArrayItem(collectionPath, itemId, "down")}
            disabled={typeof itemIndex !== "number" || itemIndex >= total - 1}
            className="rounded-full border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-700 disabled:opacity-40"
          >
            下移
          </button>
          <button
            type="button"
            onClick={() => editor.duplicateArrayItem(collectionPath, itemId)}
            className="rounded-full border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-700"
          >
            Duplicate
          </button>
          <button
            type="button"
            onClick={() => editor.removeArrayItem(collectionPath, itemId)}
            className="rounded-full border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-bold text-rose-700"
          >
            Delete
          </button>
        </div>
      ) : null}
    </div>
  );
}

function ItemEditorPanel({ itemPath, uploadKey }: { itemPath: string; uploadKey?: string }) {
  const editor = useCmsVisualEditor();
  const item = editor?.getValue(itemPath);

  if (!editor || !item || typeof item !== "object") {
    return null;
  }

  const record = item as Record<string, unknown>;
  const isAboutFlexBlock = itemPath.startsWith("about.flexSection.blocks.");
  const flexMediaBaseKey = isAboutFlexBlock ? "about/flex-section" : "home/flex-section";

  return (
    <div className="space-y-4 rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4">
      <p className="text-sm font-bold text-slate-900">卡片專屬設定</p>

      {"icon" in record && typeof record.icon === "string" ? (
        <Field label="Icon / 小圖示文字" value={record.icon} onChange={(next) => editor.updateValue(`${itemPath}.icon`, next)} />
      ) : null}
      {"index" in record && typeof record.index === "string" ? (
        <Field label="編號" value={record.index} onChange={(next) => editor.updateValue(`${itemPath}.index`, next)} />
      ) : null}
      {"eyebrow" in record && typeof record.eyebrow === "string" ? (
        <Field label="Eyebrow" value={record.eyebrow} onChange={(next) => editor.updateValue(`${itemPath}.eyebrow`, next)} />
      ) : null}
      {"title" in record && typeof record.title === "string" ? (
        <Field label="標題" value={record.title} onChange={(next) => editor.updateValue(`${itemPath}.title`, next)} multiline />
      ) : null}
      {"audience" in record && typeof record.audience === "string" ? (
        <Field label="受眾" value={record.audience} onChange={(next) => editor.updateValue(`${itemPath}.audience`, next)} />
      ) : null}
      {"description" in record && typeof record.description === "string" ? (
        <Field label="說明" value={record.description} onChange={(next) => editor.updateValue(`${itemPath}.description`, next)} multiline />
      ) : null}
      {"intro" in record && typeof record.intro === "string" ? (
        <Field label="介紹文" value={record.intro} onChange={(next) => editor.updateValue(`${itemPath}.intro`, next)} multiline />
      ) : null}
      {"videoTitle" in record && typeof record.videoTitle === "string" ? (
        <Field label="影片標題" value={record.videoTitle} onChange={(next) => editor.updateValue(`${itemPath}.videoTitle`, next)} />
      ) : null}
      {"videoDescription" in record && typeof record.videoDescription === "string" ? (
        <Field label="影片說明" value={record.videoDescription} onChange={(next) => editor.updateValue(`${itemPath}.videoDescription`, next)} multiline />
      ) : null}
      {"videoHint" in record && typeof record.videoHint === "string" ? (
        <Field label="影片 Placeholder 文案" value={record.videoHint} onChange={(next) => editor.updateValue(`${itemPath}.videoHint`, next)} multiline />
      ) : null}
      {"type" in record && typeof record.type === "string" ? (
        <SelectField
          label="Block 類型"
          value={record.type}
          options={["text", "image", "video"]}
          onChange={(next) => editor.updateValue(`${itemPath}.type`, next)}
        />
      ) : null}
      {"heading" in record && typeof record.heading === "string" ? (
        <Field label="標題" value={record.heading} onChange={(next) => editor.updateValue(`${itemPath}.heading`, next)} multiline />
      ) : null}
      {"body" in record && typeof record.body === "string" ? (
        <Field label="內文" value={record.body} onChange={(next) => editor.updateValue(`${itemPath}.body`, next)} multiline />
      ) : null}
      {"caption" in record && typeof record.caption === "string" ? (
        <Field label="Caption" value={record.caption} onChange={(next) => editor.updateValue(`${itemPath}.caption`, next)} multiline />
      ) : null}
      {"linkUrl" in record && typeof record.linkUrl === "string" ? (
        <Field label="連結 URL" value={record.linkUrl} onChange={(next) => editor.updateValue(`${itemPath}.linkUrl`, next)} />
      ) : null}
      {"buttonLabel" in record && typeof record.buttonLabel === "string" ? (
        <Field label="按鈕文案" value={record.buttonLabel} onChange={(next) => editor.updateValue(`${itemPath}.buttonLabel`, next)} />
      ) : null}
      {"name" in record && typeof record.name === "string" ? (
        <Field label="公司名稱" value={record.name} onChange={(next) => editor.updateValue(`${itemPath}.name`, next)} />
      ) : null}
      {"nameUrl" in record && typeof record.nameUrl === "string" ? (
        <Field label="公司名稱連結" value={record.nameUrl} onChange={(next) => editor.updateValue(`${itemPath}.nameUrl`, next)} />
      ) : null}
      {"contactInfo" in record && typeof record.contactInfo === "string" ? (
        <Field label="聯絡資訊" value={record.contactInfo} onChange={(next) => editor.updateValue(`${itemPath}.contactInfo`, next)} />
      ) : null}
      {"contactUrl" in record && typeof record.contactUrl === "string" ? (
        <Field label="聯絡資訊連結" value={record.contactUrl} onChange={(next) => editor.updateValue(`${itemPath}.contactUrl`, next)} />
      ) : null}
      {"serviceScope" in record && typeof record.serviceScope === "string" ? (
        <Field label="服務範圍" value={record.serviceScope} onChange={(next) => editor.updateValue(`${itemPath}.serviceScope`, next)} multiline />
      ) : null}
      {"aboutVideoUrl" in record && typeof record.aboutVideoUrl === "string" ? (
        <VideoPanel
          path={`${itemPath}.aboutVideoUrl`}
          value={record.aboutVideoUrl}
          posterPath={"aboutVideoPoster" in record && typeof record.aboutVideoPoster === "string" ? `${itemPath}.aboutVideoPoster` : undefined}
        />
      ) : null}
      {"mediaUrl" in record && typeof record.mediaUrl === "string" && "type" in record && record.type === "image" ? (
        <FlatImagePanel
          urlPath={`${itemPath}.mediaUrl`}
          altPath={`${itemPath}.mediaAlt`}
          url={record.mediaUrl}
          alt={typeof record.mediaAlt === "string" ? record.mediaAlt : ""}
          uploadKey={`${flexMediaBaseKey}/image/${typeof record.id === "string" ? record.id : "block"}`}
        />
      ) : null}
      {"mediaUrl" in record && typeof record.mediaUrl === "string" && "type" in record && record.type === "video" ? (
        <VideoPanel
          path={`${itemPath}.mediaUrl`}
          value={record.mediaUrl}
          uploadKey={`${flexMediaBaseKey}/video/${typeof record.id === "string" ? record.id : "block"}`}
        />
      ) : null}
      {"mediaAlt" in record && typeof record.mediaAlt === "string" && (!("type" in record) || record.type !== "image") ? (
        <Field label="媒體 Alt" value={record.mediaAlt} onChange={(next) => editor.updateValue(`${itemPath}.mediaAlt`, next)} />
      ) : null}
      {"image" in record && record.image && typeof record.image === "object" && "url" in record.image ? (
        <ImagePanel path={`${itemPath}.image`} value={record.image as CmsImageAsset} uploadKey={uploadKey} />
      ) : null}
      {"highlights" in record && Array.isArray(record.highlights) ? (
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Highlights</p>
          {record.highlights.map((highlight, index) => (
            <Field
              key={`${itemPath}.highlights.${index}`}
              label={`Highlight ${index + 1}`}
              value={String(highlight)}
              onChange={(next) => editor.updateValue(`${itemPath}.highlights.${index}`, next)}
            />
          ))}
        </div>
      ) : null}
      {"links" in record && Array.isArray(record.links) ? (
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Links</p>
          {record.links.map((entry, index) => {
            const link = entry as { label?: string; href?: string };

            return (
              <div key={`${itemPath}.links.${index}`} className="grid gap-3">
                <Field label={`連結 ${index + 1} 文字`} value={link.label ?? ""} onChange={(next) => editor.updateValue(`${itemPath}.links.${index}.label`, next)} />
                <Field label={`連結 ${index + 1} URL`} value={link.href ?? ""} onChange={(next) => editor.updateValue(`${itemPath}.links.${index}.href`, next)} />
              </div>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

function VisualSidebar() {
  const editor = useCmsVisualEditor();

  if (!editor) {
    return null;
  }

  const selection = editor.selected;
  const fieldValue = selection?.fieldPath ? editor.getValue(selection.fieldPath) : null;
  const hrefValue = selection?.hrefPath ? editor.getValue(selection.hrefPath) : null;
  const styleValue = selection?.stylePath ? editor.getValue(selection.stylePath) : null;
  const imageValue = selection?.imagePath ? editor.getValue(selection.imagePath) : null;

  return (
    <div className="flex h-full flex-col gap-4 rounded-[2rem] border border-slate-200 bg-white p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-blue-600">CMS V3 Visual</p>
        <h2 className="mt-2 text-xl font-black text-slate-900">前台即後台</h2>
        <p className="mt-2 text-sm leading-6 text-slate-500">點文字直接改內容，點圖片更換資產，點整張卡片進行 CRUD 與卡片專屬設定。</p>
      </div>

      {selection ? (
        <div className="space-y-4 overflow-y-auto pr-1">
          <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">目前選取</p>
            <p className="mt-2 text-base font-black text-slate-900">{selection.label}</p>
            {selection.itemId ? <p className="mt-2 text-xs font-mono text-slate-500">{selection.itemId}</p> : null}
          </div>

          {selection.collectionPath ? (
            <CardCrudPanel collectionPath={selection.collectionPath} itemId={selection.itemId} itemIndex={selection.itemIndex} />
          ) : null}

          {selection.itemPath ? (
            <ItemEditorPanel itemPath={selection.itemPath} uploadKey={selection.uploadKey} />
          ) : null}

          {selection.fieldPath && typeof fieldValue === "string" ? (
            <Field
              label="內容"
              value={fieldValue}
              multiline={Boolean(selection.multiline)}
              onChange={(next) => editor.updateValue(selection.fieldPath ?? "", next)}
            />
          ) : null}

          {selection.hrefPath && typeof hrefValue === "string" ? (
            <Field label="連結" value={hrefValue} onChange={(next) => editor.updateValue(selection.hrefPath ?? "", next)} />
          ) : null}

          {selection.stylePath && styleValue && typeof styleValue === "object" && "fontSize" in (styleValue as object) ? (
            <TextStylePanel path={selection.stylePath} value={styleValue as CmsTextStyle} />
          ) : null}

          {selection.stylePath && styleValue && typeof styleValue === "object" && "backgroundColor" in (styleValue as object) ? (
            <BlockStylePanel path={selection.stylePath} value={styleValue as CmsBlockStyle} />
          ) : null}

          {selection.imagePath && imageValue && typeof imageValue === "object" && "url" in (imageValue as object) ? (
            <ImagePanel path={selection.imagePath} value={imageValue as CmsImageAsset} uploadKey={selection.uploadKey} />
          ) : null}
        </div>
      ) : (
        <div className="rounded-[1.5rem] border border-dashed border-slate-300 bg-slate-50 p-5 text-sm leading-7 text-slate-500">
          先在左側前台畫面點選文字、圖片或整張卡片，這裡會出現對應設定與 CRUD。
        </div>
      )}

      <div className="mt-auto space-y-3 rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4">
        {editor.message ? <p className="text-sm font-medium text-emerald-700">{editor.message}</p> : null}
        {editor.error ? <p className="text-sm font-medium text-rose-600">{editor.error}</p> : null}
        <button
          type="button"
          onClick={() => editor.save()}
          disabled={!editor.isDirty || editor.isSaving}
          className="w-full rounded-full bg-slate-900 px-5 py-3 text-sm font-black text-white disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {editor.isSaving ? "儲存中..." : "儲存到 Blob CMS"}
        </button>
      </div>
    </div>
  );
}

function VisualCanvas() {
  const editor = useCmsVisualEditor();

  if (!editor) {
    return null;
  }

  const pageMap: Record<VisualPageKey, { label: string; href: string }> = {
    home: { label: "首頁", href: "/" },
    consumer: { label: "消費者", href: "/consumer" },
    courier: { label: "騎手", href: "/courier" },
    merchant: { label: "店家", href: "/merchant" },
    about: { label: "關於我們", href: "/about" },
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="fixed inset-x-0 top-0 z-[90] border-b border-slate-200 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1720px] flex-wrap items-center justify-between gap-3 px-4 py-4 md:px-6">
          <div className="flex flex-wrap gap-2">
            {(Object.keys(pageMap) as VisualPageKey[]).map((page) => (
              <button
                key={page}
                type="button"
                onClick={() => editor.setCurrentPage(page)}
                className={`rounded-full px-4 py-2 text-sm font-black ${editor.currentPage === page ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-700"}`}
              >
                {pageMap[page].label}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <a href={pageMap[editor.currentPage].href} target="_blank" rel="noreferrer" className="rounded-full border border-slate-300 px-4 py-2 text-sm font-bold text-slate-700">
              開啟公開頁
            </a>
            <button
              type="button"
              onClick={() => editor.save()}
              disabled={!editor.isDirty || editor.isSaving}
              className="rounded-full bg-slate-900 px-5 py-2.5 text-sm font-black text-white disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              {editor.isSaving ? "儲存中..." : "儲存"}
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1720px] px-4 pb-10 pt-28 md:px-6 xl:pr-[410px]">
        <div className="rounded-[2.2rem] border border-slate-200 bg-white shadow-[0_28px_90px_rgba(15,23,42,0.08)]">
          {editor.currentPage === "home" ? (
            <SiteHome site={editor.data} />
          ) : editor.currentPage === "about" ? (
            <SiteAbout site={editor.data} />
          ) : (
            <RolePage site={editor.data} page={editor.data[editor.currentPage]} pageKey={editor.currentPage} />
          )}
        </div>

        <div className="mt-6 xl:hidden">
          <VisualSidebar />
        </div>
      </div>

      <aside className="fixed bottom-4 right-4 top-24 hidden w-[360px] xl:block">
        <VisualSidebar />
      </aside>
    </div>
  );
}

export function CmsVisualEditor({ initialData }: { initialData: CmsData }) {
  return (
    <CmsVisualEditorProvider initialData={initialData}>
      <VisualCanvas />
    </CmsVisualEditorProvider>
  );
}
