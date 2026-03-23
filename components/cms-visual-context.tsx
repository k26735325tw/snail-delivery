"use client";

import type { ReactNode } from "react";
import { createContext, useContext, useRef, useState } from "react";

import type { CmsData } from "@/lib/cms-schema";

export type VisualPageKey = "home" | "consumer" | "courier" | "merchant";

export type CmsVisualSelection = {
  id: string;
  kind: "text" | "link" | "image" | "block";
  label: string;
  fieldPath?: string;
  stylePath?: string;
  hrefPath?: string;
  imagePath?: string;
  multiline?: boolean;
};

type CmsVisualContextValue = {
  enabled: boolean;
  data: CmsData;
  currentPage: VisualPageKey;
  setCurrentPage: (page: VisualPageKey) => void;
  selected: CmsVisualSelection | null;
  select: (selection: CmsVisualSelection) => void;
  updateValue: (path: string, value: unknown) => void;
  getValue: (path: string) => unknown;
  uploadImage: (imagePath: string, file: File) => Promise<void>;
  save: () => Promise<void>;
  isSaving: boolean;
  isDirty: boolean;
  message: string | null;
  error: string | null;
  isUploadingPath: (path: string) => boolean;
  editorTopOffset: number;
};

const CmsVisualContext = createContext<CmsVisualContextValue | null>(null);

function splitPath(path: string) {
  return path.split(".").filter(Boolean);
}

function cloneData<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function getAtPath(source: unknown, path: string) {
  return splitPath(path).reduce<unknown>((current, part) => {
    if (current && typeof current === "object") {
      return (current as Record<string, unknown>)[part];
    }

    return undefined;
  }, source);
}

function setAtPath<T>(source: T, path: string, value: unknown) {
  const next = cloneData(source);
  const parts = splitPath(path);

  if (parts.length === 0) {
    return next;
  }

  let cursor: Record<string, unknown> = next as Record<string, unknown>;

  for (let index = 0; index < parts.length - 1; index += 1) {
    const part = parts[index];
    const branch = cursor[part];

    if (!branch || typeof branch !== "object") {
      cursor[part] = {};
    }

    cursor = cursor[part] as Record<string, unknown>;
  }

  cursor[parts[parts.length - 1]] = value;
  return next;
}

function pathToUploadKey(path: string) {
  return path.replace(/\.(\d+)/g, "/$1").replace(/\./g, "/").replace(/\/url$/, "");
}

export function CmsVisualEditorProvider({
  initialData,
  children,
}: {
  initialData: CmsData;
  children: ReactNode;
}) {
  const [data, setData] = useState(initialData);
  const [currentPage, setCurrentPage] = useState<VisualPageKey>("home");
  const [selected, setSelected] = useState<CmsVisualSelection | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploadingPaths, setUploadingPaths] = useState<Record<string, boolean>>({});
  const dirtyPathsRef = useRef<Set<string>>(new Set());
  const [, setDirtyTick] = useState(0);

  function markDirty(path: string) {
    dirtyPathsRef.current.add(path);
    setDirtyTick((value) => value + 1);
  }

  function updateValue(path: string, value: unknown) {
    setData((current) => setAtPath(current, path, value));
    markDirty(path);
    setMessage(null);
    setError(null);
  }

  async function uploadImage(imagePath: string, file: File) {
    const uploadKey = pathToUploadKey(imagePath);
    setUploadingPaths((current) => ({ ...current, [imagePath]: true }));
    setError(null);
    setMessage(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("uploadKey", uploadKey);

      const response = await fetch("/api/cms/upload", {
        method: "POST",
        body: formData,
      });
      const result = (await response.json()) as { error?: string; url?: string };

      if (!response.ok || !result.url) {
        throw new Error(result.error ?? "圖片上傳失敗");
      }

      updateValue(`${imagePath}.url`, result.url);
      setMessage("圖片已上傳，按下儲存後會寫入正式 Blob CMS。");
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "圖片上傳失敗");
    } finally {
      setUploadingPaths((current) => {
        const next = { ...current };
        delete next[imagePath];
        return next;
      });
    }
  }

  async function save() {
    if (isSaving || Object.keys(uploadingPaths).length > 0 || dirtyPathsRef.current.size === 0) {
      return;
    }

    setIsSaving(true);
    setError(null);
    setMessage(null);

    try {
      const response = await fetch("/api/cms", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify({
          data,
          dirtyPaths: Array.from(dirtyPathsRef.current),
        }),
      });
      const result = (await response.json()) as { data?: CmsData; error?: string };

      if (!response.ok || !result.data) {
        throw new Error(result.error ?? "儲存失敗");
      }

      setData(result.data);
      dirtyPathsRef.current.clear();
      setDirtyTick((value) => value + 1);
      setMessage("已儲存到正式 Blob CMS，前台內容已更新。");
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "儲存失敗");
    } finally {
      setIsSaving(false);
    }
  }

  const value: CmsVisualContextValue = {
    enabled: true,
    data,
    currentPage,
    setCurrentPage,
    selected,
    select: setSelected,
    updateValue,
    getValue: (path) => getAtPath(data, path),
    uploadImage,
    save,
    isSaving,
    isDirty: dirtyPathsRef.current.size > 0 || Object.keys(uploadingPaths).length > 0,
    message,
    error,
    isUploadingPath: (path) => Boolean(uploadingPaths[path]),
    editorTopOffset: 88,
  };

  return <CmsVisualContext.Provider value={value}>{children}</CmsVisualContext.Provider>;
}

export function useCmsVisualEditor() {
  return useContext(CmsVisualContext);
}
