"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";

import type { CmsImageAsset } from "@/lib/cms-schema";

type AdminImageUploadProps = {
  label: string;
  image: CmsImageAsset;
  pendingFile: File | null;
  onChange: (image: CmsImageAsset) => void;
  onFileChange: (file: File | null) => void;
  recommendation: {
    dimensions: string;
    ratio: string;
    format: string;
  };
  isUploading?: boolean;
};

export function AdminImageUpload({
  label,
  image,
  pendingFile,
  onChange,
  onFileChange,
  recommendation,
  isUploading = false,
}: AdminImageUploadProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [error, setError] = useState<string | null>(null);

  const previewUrl = useMemo(() => {
    if (!pendingFile) {
      return image.url;
    }

    return URL.createObjectURL(pendingFile);
  }, [image.url, pendingFile]);

  useEffect(() => {
    if (!pendingFile && inputRef.current) {
      inputRef.current.value = "";
    }
  }, [pendingFile]);

  useEffect(() => {
    if (!pendingFile) {
      return;
    }

    return () => {
      URL.revokeObjectURL(previewUrl);
    };
  }, [pendingFile, previewUrl]);

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setError(null);

    if (!file.type.startsWith("image/")) {
      setError("僅支援圖片格式");
      return;
    }

    onFileChange(file);
  }

  return (
    <div className="space-y-3 rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-extrabold text-slate-900">{label}</p>
          <p className="mt-1 text-xs text-slate-500">
            建議尺寸：{recommendation.dimensions} ｜ 比例：{recommendation.ratio} ｜ 格式：{recommendation.format}
          </p>
        </div>
        <label className="cursor-pointer rounded-full border border-slate-300 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 transition hover:border-blue-500 hover:text-blue-600">
          {isUploading ? "上傳中..." : pendingFile ? "更換待上傳圖片" : "選擇圖片"}
          <input
            ref={inputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/svg+xml"
            className="hidden"
            onChange={handleChange}
          />
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            圖片網址
          </span>
          <input
            value={image.url}
            onChange={(event) => {
              onFileChange(null);
              onChange({ ...image, url: event.target.value });
            }}
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500"
            placeholder="https://..."
          />
        </label>
        <label className="space-y-2">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            ALT 文字
          </span>
          <input
            value={image.alt}
            onChange={(event) => onChange({ ...image, alt: event.target.value })}
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500"
            placeholder="請描述圖片內容"
          />
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <label className="space-y-2">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Object Fit
          </span>
          <select
            value={image.objectFit}
            onChange={(event) =>
              onChange({
                ...image,
                objectFit: event.target.value as CmsImageAsset["objectFit"],
              })
            }
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500"
          >
            <option value="cover">cover</option>
            <option value="contain">contain</option>
          </select>
        </label>
        <label className="space-y-2">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Focal X
          </span>
          <input
            type="number"
            min={0}
            max={100}
            value={image.focalX}
            onChange={(event) => onChange({ ...image, focalX: Number(event.target.value) || 0 })}
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500"
          />
        </label>
        <label className="space-y-2">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Focal Y
          </span>
          <input
            type="number"
            min={0}
            max={100}
            value={image.focalY}
            onChange={(event) => onChange({ ...image, focalY: Number(event.target.value) || 0 })}
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500"
          />
        </label>
        <label className="space-y-2">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            桌機高度
          </span>
          <input
            type="number"
            min={80}
            max={1200}
            value={image.desktopHeight}
            onChange={(event) =>
              onChange({ ...image, desktopHeight: Number(event.target.value) || 80 })
            }
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500"
          />
        </label>
        <label className="space-y-2">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            手機高度
          </span>
          <input
            type="number"
            min={80}
            max={1200}
            value={image.mobileHeight}
            onChange={(event) =>
              onChange({ ...image, mobileHeight: Number(event.target.value) || 80 })
            }
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500"
          />
        </label>
      </div>

      {isUploading ? (
        <p className="text-xs font-medium text-blue-700">圖片已上傳到 Blob，記得按儲存寫入 CMS JSON。</p>
      ) : pendingFile ? (
        <p className="text-xs font-medium text-amber-700">
          已選擇新圖片：{pendingFile.name}，按下儲存後會上傳至 Blob。
        </p>
      ) : null}

      {previewUrl ? (
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <div className="border-b border-slate-200 px-4 py-2 text-xs font-semibold text-slate-500">
              原始預覽
            </div>
            <div className="relative h-48 w-full">
              <Image
                src={previewUrl}
                alt={image.alt || label}
                fill
                unoptimized
                className="object-contain"
              />
            </div>
          </div>
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <div className="border-b border-slate-200 px-4 py-2 text-xs font-semibold text-slate-500">
              前台裁切預估
            </div>
            <div
              className="relative w-full bg-slate-100"
              style={{ height: `${Math.min(image.desktopHeight, 260)}px` }}
            >
              <Image
                src={previewUrl}
                alt={image.alt || label}
                fill
                unoptimized
                style={{
                  objectFit: image.objectFit,
                  objectPosition: `${image.focalX}% ${image.focalY}%`,
                }}
              />
            </div>
          </div>
        </div>
      ) : null}

      {error ? <p className="text-xs font-medium text-red-600">{error}</p> : null}
    </div>
  );
}
