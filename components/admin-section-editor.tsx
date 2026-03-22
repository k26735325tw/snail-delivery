"use client";

import { AdminArrayEditor } from "@/components/admin-array-editor";
import type { CmsContentItem, CmsSection } from "@/lib/cms-schema";

type AdminSectionEditorProps = {
  title: string;
  sections: CmsSection[];
  onChange: (sections: CmsSection[]) => void;
};

const emptyItem = (): CmsContentItem => ({
  eyebrow: "",
  title: "",
  description: "",
  icon: "",
});

const emptySection = (): CmsSection => ({
  id: "",
  badge: "",
  title: "",
  description: "",
  items: [emptyItem()],
});

function TextField({
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
          rows={3}
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

export function AdminSectionEditor({
  title,
  sections,
  onChange,
}: AdminSectionEditorProps) {
  return (
    <AdminArrayEditor
      label={title}
      description="Edit section metadata and repeatable cards."
      items={sections}
      createItem={emptySection}
      onChange={onChange}
      renderItem={(section, index, helpers) => (
        <div className="space-y-4">
          <div className="flex items-start justify-between gap-4">
            <p className="text-sm font-bold text-slate-900">Section {index + 1}</p>
            <button
              type="button"
              onClick={helpers.remove}
              className="rounded-full border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-bold text-red-600 transition hover:border-red-300 hover:bg-red-100"
            >
              Remove Section
            </button>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <TextField
              label="Section Id"
              value={section.id}
              onChange={(value) => helpers.update({ ...section, id: value })}
            />
            <TextField
              label="Badge"
              value={section.badge}
              onChange={(value) => helpers.update({ ...section, badge: value })}
            />
          </div>

          <TextField
            label="Title"
            value={section.title}
            onChange={(value) => helpers.update({ ...section, title: value })}
          />
          <TextField
            label="Description"
            value={section.description}
            onChange={(value) => helpers.update({ ...section, description: value })}
            multiline
          />

          <AdminArrayEditor
            label="Section Items"
            items={section.items}
            createItem={emptyItem}
            onChange={(items) => helpers.update({ ...section, items })}
            renderItem={(item, itemIndex, itemHelpers) => (
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <p className="text-sm font-bold text-slate-900">Card {itemIndex + 1}</p>
                  <button
                    type="button"
                    onClick={itemHelpers.remove}
                    className="rounded-full border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-bold text-red-600 transition hover:border-red-300 hover:bg-red-100"
                  >
                    Remove Card
                  </button>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <TextField
                    label="Eyebrow"
                    value={item.eyebrow ?? ""}
                    onChange={(value) => itemHelpers.update({ ...item, eyebrow: value })}
                  />
                  <TextField
                    label="Icon"
                    value={item.icon ?? ""}
                    onChange={(value) => itemHelpers.update({ ...item, icon: value })}
                  />
                </div>

                <TextField
                  label="Title"
                  value={item.title}
                  onChange={(value) => itemHelpers.update({ ...item, title: value })}
                />
                <TextField
                  label="Description"
                  value={item.description}
                  onChange={(value) =>
                    itemHelpers.update({ ...item, description: value })
                  }
                  multiline
                />
              </div>
            )}
          />
        </div>
      )}
    />
  );
}
