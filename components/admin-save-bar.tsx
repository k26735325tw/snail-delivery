"use client";

type AdminSaveBarProps = {
  isSaving: boolean;
  isDirty: boolean;
  message: string | null;
  error: string | null;
  onSave: () => void;
};

export function AdminSaveBar({
  isSaving,
  isDirty,
  message,
  error,
  onSave,
}: AdminSaveBarProps) {
  return (
    <div className="sticky bottom-4 z-20 mt-8 flex flex-wrap items-center gap-3 rounded-[1.75rem] border border-slate-200 bg-white/96 px-5 py-4 shadow-[0_20px_50px_rgba(15,23,42,0.12)] backdrop-blur">
      <button
        type="button"
        onClick={onSave}
        disabled={isSaving || !isDirty}
        className="rounded-full bg-blue-600 px-5 py-3 text-sm font-extrabold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
      >
        {isSaving ? "儲存中..." : "儲存 CMS"}
      </button>
      <p className="text-sm text-slate-500">{isDirty ? "尚有未儲存變更" : "所有變更已儲存"}</p>
      {message ? <p className="text-sm font-medium text-emerald-600">{message}</p> : null}
      {error ? <p className="text-sm font-medium text-red-600">{error}</p> : null}
    </div>
  );
}
