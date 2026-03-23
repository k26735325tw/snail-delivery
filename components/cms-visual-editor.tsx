"use client";

import { useRef } from "react";

import { CmsVisualEditorProvider, useCmsVisualEditor, type VisualPageKey } from "@/components/cms-visual-context";
import { RolePage } from "@/components/role-page";
import { SiteHome } from "@/components/site-home";
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

function ImagePanel({ path, value }: { path: string; value: CmsImageAsset }) {
  const editor = useCmsVisualEditor();
  const uploadRef = useRef<HTMLInputElement | null>(null);

  if (!editor) {
    return null;
  }

  return (
    <div className="space-y-4 rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-bold text-slate-900">圖片設定</p>
        <button
          type="button"
          onClick={() => uploadRef.current?.click()}
          className="rounded-full bg-blue-600 px-4 py-2 text-xs font-black text-white"
        >
          {editor.isUploadingPath(path) ? "上傳中" : "更換圖片"}
        </button>
      </div>
      <input
        ref={uploadRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={async (event) => {
          const file = event.target.files?.[0];

          if (file) {
            await editor.uploadImage(path, file);
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
        <p className="mt-2 text-sm leading-6 text-slate-500">點文字直接改內容，點圖片更換資產，點區塊調整樣式，儲存後直接寫入正式 Blob CMS。</p>
      </div>

      {selection ? (
        <div className="space-y-4 overflow-y-auto pr-1">
          <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">目前選取</p>
            <p className="mt-2 text-base font-black text-slate-900">{selection.label}</p>
          </div>

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
            <ImagePanel path={selection.imagePath} value={imageValue as CmsImageAsset} />
          ) : null}
        </div>
      ) : (
        <div className="rounded-[1.5rem] border border-dashed border-slate-300 bg-slate-50 p-5 text-sm leading-7 text-slate-500">
          先在左側前台畫面點選文字、圖片或區塊，這裡就會出現對應設定。
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
        <div className="overflow-hidden rounded-[2.2rem] border border-slate-200 bg-white shadow-[0_28px_90px_rgba(15,23,42,0.08)]">
          {editor.currentPage === "home" ? (
            <SiteHome site={editor.data} />
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
