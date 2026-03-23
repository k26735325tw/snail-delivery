"use client";

import type { CSSProperties, ElementType, ReactNode } from "react";
import { useId, useRef } from "react";

import { useCmsVisualEditor, type CmsVisualSelection } from "@/components/cms-visual-context";

const interactiveClass =
  "relative rounded-[1rem] transition duration-200 after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:border after:border-dashed after:border-transparent";
const hoverClass =
  "hover:bg-[#fff7c4]/55 hover:shadow-[0_16px_40px_rgba(27,111,255,0.08)] hover:after:border-[#1b6fff]/45";
const selectedClass =
  "bg-[#fff7c4]/72 shadow-[0_20px_54px_rgba(27,111,255,0.14)] ring-2 ring-[#1b6fff]/45 after:border-[#1b6fff]/55";

function useSelection(selection: CmsVisualSelection) {
  const editor = useCmsVisualEditor();
  const selected = Boolean(editor && editor.selected?.id === selection.id);

  function handleSelect(event?: { preventDefault?: () => void; stopPropagation?: () => void }) {
    event?.preventDefault?.();
    event?.stopPropagation?.();
    editor?.select(selection);
  }

  return { editor, selected, handleSelect };
}

export function EditableBlock({
  selection,
  className = "",
  style,
  children,
}: {
  selection: CmsVisualSelection;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}) {
  const { editor, selected, handleSelect } = useSelection(selection);

  if (!editor) {
    return <div className={className} style={style}>{children}</div>;
  }

  return (
    <div
      className={`${interactiveClass} ${hoverClass} ${selected ? selectedClass : ""} ${className}`}
      style={style}
      onClick={handleSelect}
    >
      <div className="pointer-events-none absolute right-3 top-3 rounded-full bg-white/92 px-2 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-[#1b6fff] shadow-sm">
        區塊
      </div>
      {children}
    </div>
  );
}

export function EditableText<T extends ElementType>({
  as,
  value,
  selection,
  className = "",
  style,
  multiline = false,
}: {
  as: T;
  value: string;
  selection: CmsVisualSelection;
  className?: string;
  style?: CSSProperties;
  multiline?: boolean;
}) {
  const Tag = as as ElementType;
  const Wrapper = as === "span" ? "span" : "div";
  const { editor, selected, handleSelect } = useSelection(selection);

  if (!editor) {
    return <Tag className={className} style={style}>{value}</Tag>;
  }

  return (
    <Wrapper className={`${interactiveClass} ${hoverClass} ${selected ? selectedClass : ""} ${as === "span" ? "inline-block" : ""}`} onClick={handleSelect}>
      {selected ? (
        multiline ? (
          <textarea
            autoFocus
            value={value}
            rows={Math.max(value.split("\n").length, 3)}
            onClick={(event) => event.stopPropagation()}
            onChange={(event) => editor.updateValue(selection.fieldPath ?? "", event.target.value)}
            className={`w-full resize-y rounded-[1rem] border border-[#1b6fff]/25 bg-white/86 px-3 py-2 font-inherit text-inherit outline-none ${className}`}
            style={style}
          />
        ) : (
          <input
            autoFocus
            value={value}
            onClick={(event) => event.stopPropagation()}
            onChange={(event) => editor.updateValue(selection.fieldPath ?? "", event.target.value)}
            className={`w-full rounded-[1rem] border border-[#1b6fff]/25 bg-white/86 px-3 py-2 font-inherit text-inherit outline-none ${className}`}
            style={style}
          />
        )
      ) : (
        <Tag className={className} style={style}>{value}</Tag>
      )}
    </Wrapper>
  );
}

export function EditableLink({
  href,
  value,
  selection,
  className = "",
  style,
}: {
  href: string;
  value: string;
  selection: CmsVisualSelection;
  className?: string;
  style?: CSSProperties;
}) {
  const { editor, selected, handleSelect } = useSelection(selection);

  if (!editor) {
    return (
      <a href={href} className={className} style={style}>
        {value}
      </a>
    );
  }

  return (
    <div className={`${interactiveClass} ${hoverClass} ${selected ? selectedClass : ""} inline-flex`} onClick={handleSelect}>
      {selected ? (
        <input
          autoFocus
          value={value}
          onClick={(event) => event.stopPropagation()}
          onChange={(event) => editor.updateValue(selection.fieldPath ?? "", event.target.value)}
          className={`rounded-[1rem] border border-[#1b6fff]/25 bg-white/86 px-3 py-2 font-inherit text-inherit outline-none ${className}`}
          style={style}
        />
      ) : (
        <a
          href={href}
          onClick={handleSelect}
          className={className}
          style={style}
        >
          {value}
        </a>
      )}
    </div>
  );
}

export function EditableImageFrame({
  selection,
  className = "",
  children,
}: {
  selection: CmsVisualSelection;
  className?: string;
  children: ReactNode;
}) {
  const { editor, selected, handleSelect } = useSelection(selection);
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement | null>(null);

  if (!editor) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div className={`${interactiveClass} ${hoverClass} ${selected ? selectedClass : ""} ${className}`} onClick={handleSelect}>
      <div className="pointer-events-none absolute inset-x-4 top-4 z-10 flex items-center justify-between rounded-full bg-white/92 px-3 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-[#1b6fff] shadow-sm">
        <span>圖片</span>
        {editor.isUploadingPath(selection.imagePath ?? "") ? <span>上傳中</span> : null}
      </div>
      {children}
      <input
        ref={inputRef}
        id={inputId}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={async (event) => {
          const file = event.target.files?.[0];

          if (file && selection.imagePath) {
            await editor.uploadImage(selection.imagePath, file);
          }

          event.target.value = "";
        }}
      />
      {selected ? (
        <button
          type="button"
          className="absolute bottom-4 right-4 z-10 rounded-full bg-[#1b6fff] px-4 py-2 text-xs font-black text-white shadow-[0_18px_36px_rgba(27,111,255,0.24)]"
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            inputRef.current?.click();
          }}
        >
          更換圖片
        </button>
      ) : null}
    </div>
  );
}
