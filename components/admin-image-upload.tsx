"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";

type AdminImageUploadProps = {
  label: string;
  value: string;
  pendingFile: File | null;
  onChange: (url: string) => void;
  onFileChange: (file: File | null) => void;
};

export function AdminImageUpload({
  label,
  value,
  pendingFile,
  onChange,
  onFileChange,
}: AdminImageUploadProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [error, setError] = useState<string | null>(null);

  const previewUrl = useMemo(() => {
    if (!pendingFile) {
      return value;
    }

    return URL.createObjectURL(pendingFile);
  }, [pendingFile, value]);

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
      setError("Unsupported image type");
      return;
    }

    onFileChange(file);
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          {label}
        </p>
        <label className="cursor-pointer rounded-full border border-slate-300 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 transition hover:border-blue-500 hover:text-blue-600">
          {pendingFile ? "Replace Pending Image" : "Choose Image"}
          <input
            ref={inputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/svg+xml"
            className="hidden"
            onChange={handleChange}
          />
        </label>
      </div>
      <input
        value={value}
        onChange={(event) => {
          onFileChange(null);
          onChange(event.target.value);
        }}
        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:bg-white"
        placeholder="https://..."
      />
      {pendingFile ? (
        <p className="text-xs font-medium text-amber-700">
          New image selected: {pendingFile.name}. It will upload when you save.
        </p>
      ) : null}
      {previewUrl ? (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="relative h-40 w-full">
            <Image src={previewUrl} alt={label} fill unoptimized className="object-cover" />
          </div>
        </div>
      ) : null}
      {error ? <p className="text-xs font-medium text-red-600">{error}</p> : null}
    </div>
  );
}
