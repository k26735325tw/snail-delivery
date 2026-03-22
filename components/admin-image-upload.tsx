"use client";

import Image from "next/image";
import { useRef, useState } from "react";

type AdminImageUploadProps = {
  label: string;
  section: string;
  value: string;
  onUploaded: (url: string) => void;
};

export function AdminImageUpload({
  label,
  section,
  value,
  onUploaded,
}: AdminImageUploadProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("section", section);

      const response = await fetch("/api/cms/upload", {
        method: "POST",
        body: formData,
      });
      const result = (await response.json()) as { error?: string; url?: string };

      if (!response.ok || !result.url) {
        throw new Error(result.error ?? "Upload failed");
      }

      onUploaded(result.url);

      if (inputRef.current) {
        inputRef.current.value = "";
      }
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Upload failed");
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          {label}
        </p>
        <label className="cursor-pointer rounded-full border border-slate-300 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 transition hover:border-blue-500 hover:text-blue-600">
          {isUploading ? "Uploading..." : "Upload Image"}
          <input
            ref={inputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/svg+xml"
            className="hidden"
            onChange={handleChange}
            disabled={isUploading}
          />
        </label>
      </div>
      <input
        value={value}
        onChange={(event) => onUploaded(event.target.value)}
        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:bg-white"
        placeholder="https://..."
      />
      {value ? (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="relative h-40 w-full">
            <Image src={value} alt={label} fill unoptimized className="object-cover" />
          </div>
        </div>
      ) : null}
      {error ? <p className="text-xs font-medium text-red-600">{error}</p> : null}
    </div>
  );
}
