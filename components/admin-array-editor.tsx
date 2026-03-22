"use client";

import type { ReactNode } from "react";

type AdminArrayEditorProps<T> = {
  label: string;
  description?: string;
  items: T[];
  createItem: () => T;
  onChange: (items: T[]) => void;
  renderItem: (
    item: T,
    index: number,
    helpers: {
      update: (nextItem: T) => void;
      remove: () => void;
    },
  ) => ReactNode;
};

export function AdminArrayEditor<T>({
  label,
  description,
  items,
  createItem,
  onChange,
  renderItem,
}: AdminArrayEditorProps<T>) {
  return (
    <div className="space-y-4 rounded-[1.75rem] border border-slate-200 bg-slate-50 p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h4 className="text-sm font-bold text-slate-900">{label}</h4>
          {description ? <p className="mt-1 text-xs text-slate-500">{description}</p> : null}
        </div>
        <button
          type="button"
          onClick={() => onChange([...items, createItem()])}
          className="rounded-full border border-slate-300 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 transition hover:border-blue-500 hover:text-blue-600"
        >
          Add Item
        </button>
      </div>

      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={index} className="rounded-[1.25rem] border border-slate-200 bg-white p-4">
            {renderItem(item, index, {
              update: (nextItem) =>
                onChange(
                  items.map((currentItem, currentIndex) =>
                    currentIndex === index ? nextItem : currentItem,
                  ),
                ),
              remove: () => onChange(items.filter((_, currentIndex) => currentIndex !== index)),
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
