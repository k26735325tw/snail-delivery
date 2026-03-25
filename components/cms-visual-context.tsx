"use client";

import type { ReactNode } from "react";
import { createContext, useContext, useRef, useState } from "react";

import {
  cloneArrayItemWithFreshIds,
  cloneValue,
  createArrayItemTemplate,
  getImageUploadKey,
  type CmsArrayCollectionPath,
} from "@/lib/cms-data";
import type { CmsData } from "@/lib/cms-schema";

export type VisualPageKey = "home" | "consumer" | "courier" | "merchant" | "about";

export type CmsVisualSelection = {
  id: string;
  kind: "text" | "link" | "image" | "block";
  label: string;
  fieldPath?: string;
  stylePath?: string;
  hrefPath?: string;
  imagePath?: string;
  uploadKey?: string;
  multiline?: boolean;
  collectionPath?: CmsArrayCollectionPath;
  itemPath?: string;
  itemId?: string;
  itemIndex?: number;
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
  uploadImage: (imagePath: string, file: File, uploadKey?: string) => Promise<void>;
  save: () => Promise<void>;
  addArrayItem: (collectionPath: CmsArrayCollectionPath, afterItemId?: string | null) => void;
  duplicateArrayItem: (collectionPath: CmsArrayCollectionPath, itemId: string) => void;
  removeArrayItem: (collectionPath: CmsArrayCollectionPath, itemId: string) => void;
  moveArrayItem: (collectionPath: CmsArrayCollectionPath, itemId: string, direction: "up" | "down") => void;
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

function getAtPath(source: unknown, path: string) {
  return splitPath(path).reduce<unknown>((current, part) => {
    if (current && typeof current === "object") {
      return (current as Record<string, unknown>)[part];
    }

    return undefined;
  }, source);
}

function setAtPath<T>(source: T, path: string, value: unknown) {
  const next = cloneValue(source);
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

function replacePathPrefix(value: string | undefined, previousPrefix: string, nextPrefix: string) {
  if (!value) {
    return value;
  }

  return value === previousPrefix || value.startsWith(`${previousPrefix}.`)
    ? `${nextPrefix}${value.slice(previousPrefix.length)}`
    : value;
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

  function getCollectionItems(collectionPath: CmsArrayCollectionPath, source = data) {
    return (getAtPath(source, collectionPath) as Array<{ id?: string }> | undefined) ?? [];
  }

  function syncSelectionAfterCollectionChange(
    collectionPath: CmsArrayCollectionPath,
    nextItems: Array<{ id?: string }>,
  ) {
    setSelected((current) => {
      if (!current || current.collectionPath !== collectionPath || !current.itemPath || !current.itemId) {
        return current;
      }

      const nextIndex = nextItems.findIndex((item) => item.id === current.itemId);

      if (nextIndex < 0) {
        return null;
      }

      const nextItemPath = `${collectionPath}.${nextIndex}`;

      return {
        ...current,
        itemIndex: nextIndex,
        itemPath: nextItemPath,
        fieldPath: replacePathPrefix(current.fieldPath, current.itemPath, nextItemPath),
        stylePath: replacePathPrefix(current.stylePath, current.itemPath, nextItemPath),
        hrefPath: replacePathPrefix(current.hrefPath, current.itemPath, nextItemPath),
        imagePath: replacePathPrefix(current.imagePath, current.itemPath, nextItemPath),
      };
    });
  }

  function updateCollection(collectionPath: CmsArrayCollectionPath, nextItems: unknown[]) {
    setData((current) => setAtPath(current, collectionPath, nextItems));
    markDirty(collectionPath);
    syncSelectionAfterCollectionChange(collectionPath, nextItems as Array<{ id?: string }>);
    setMessage(null);
    setError(null);
  }

  function addArrayItem(collectionPath: CmsArrayCollectionPath, afterItemId?: string | null) {
    const currentItems = [...getCollectionItems(collectionPath)];
    const nextItem = createArrayItemTemplate(collectionPath, data);

    if (!nextItem) {
      setError("這個區塊目前不支援新增項目。");
      return;
    }

    const insertIndex = afterItemId
      ? Math.max(currentItems.findIndex((item) => item.id === afterItemId) + 1, 0)
      : currentItems.length;

    const nextItems = [...currentItems];
    nextItems.splice(insertIndex, 0, nextItem as { id?: string });
    updateCollection(collectionPath, nextItems);

    setSelected({
      id: `${collectionPath}.${(nextItem as { id: string }).id}.block`,
      kind: "block",
      label: "新卡片",
      stylePath: `${collectionPath}.${insertIndex}.blockStyle`,
      collectionPath,
      itemPath: `${collectionPath}.${insertIndex}`,
      itemId: (nextItem as { id: string }).id,
      itemIndex: insertIndex,
    });
  }

  function duplicateArrayItem(collectionPath: CmsArrayCollectionPath, itemId: string) {
    const currentItems = [...getCollectionItems(collectionPath)];
    const sourceIndex = currentItems.findIndex((item) => item.id === itemId);

    if (sourceIndex < 0) {
      return;
    }

    const duplicate = cloneArrayItemWithFreshIds(currentItems[sourceIndex]);
    const nextItems = [...currentItems];
    nextItems.splice(sourceIndex + 1, 0, duplicate as { id?: string });
    updateCollection(collectionPath, nextItems);
  }

  function removeArrayItem(collectionPath: CmsArrayCollectionPath, itemId: string) {
    const currentItems = [...getCollectionItems(collectionPath)];

    if (currentItems.length <= 1) {
      setError("至少要保留一個項目，避免公開頁內容整塊消失。");
      return;
    }

    const nextItems = currentItems.filter((item) => item.id !== itemId);
    updateCollection(collectionPath, nextItems);
  }

  function moveArrayItem(collectionPath: CmsArrayCollectionPath, itemId: string, direction: "up" | "down") {
    const currentItems = [...getCollectionItems(collectionPath)];
    const currentIndex = currentItems.findIndex((item) => item.id === itemId);

    if (currentIndex < 0) {
      return;
    }

    const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;

    if (targetIndex < 0 || targetIndex >= currentItems.length) {
      return;
    }

    const nextItems = [...currentItems];
    const [moved] = nextItems.splice(currentIndex, 1);
    nextItems.splice(targetIndex, 0, moved);
    updateCollection(collectionPath, nextItems);
  }

  async function uploadImage(imagePath: string, file: File, uploadKey?: string) {
    const finalUploadKey = uploadKey ?? getImageUploadKey(imagePath, selected?.itemId);

    setUploadingPaths((current) => ({ ...current, [imagePath]: true }));
    setError(null);
    setMessage(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("uploadKey", finalUploadKey);

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
    addArrayItem,
    duplicateArrayItem,
    removeArrayItem,
    moveArrayItem,
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
