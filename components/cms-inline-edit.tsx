"use client";

import type { CSSProperties, ElementType, ReactNode } from "react";
import { useId, useRef } from "react";

import { useCmsVisualEditor, type CmsVisualSelection } from "@/components/cms-visual-context";

const interactiveClass =
  "relative rounded-[1rem] outline-none transition duration-200 after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:border-2 after:border-dashed after:border-transparent";
const hoverClass =
  "hover:bg-[#fff7c4]/58 hover:shadow-[0_16px_40px_rgba(27,111,255,0.08)] hover:after:border-[#1b6fff]/55";
const selectedClass =
  "bg-[#fff7c4]/76 shadow-[0_20px_54px_rgba(27,111,255,0.16)] ring-4 ring-[#1b6fff]/28 after:border-[#1b6fff]/70";

function getTextDisplayStyle(style: CSSProperties | undefined, value: string): CSSProperties | undefined {
  if (!value.includes("\n")) {
    return style;
  }

  return {
    ...style,
    whiteSpace: "pre-wrap",
  };
}

function useSelection(selection: CmsVisualSelection) {
  const editor = useCmsVisualEditor();
  const selected = Boolean(
    editor &&
      (editor.selected?.id === selection.id ||
        (selection.kind === "block" &&
          selection.itemPath &&
          editor.selected?.itemPath === selection.itemPath)),
  );

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
  const displayStyle = getTextDisplayStyle(style, value);

  if (!editor) {
    return <Tag className={className} style={displayStyle}>{value}</Tag>;
  }

  return (
    <Wrapper className={`${interactiveClass} ${hoverClass} ${selected ? selectedClass : ""} ${as === "span" ? "inline-block" : ""}`} onClick={handleSelect}>
      {selected ? (
        <textarea
          autoFocus
          value={value}
          rows={Math.max(value.split("\n").length, multiline ? 3 : 2)}
          onClick={(event) => event.stopPropagation()}
          onChange={(event) => editor.updateValue(selection.fieldPath ?? "", event.target.value)}
          className={`w-full resize-y rounded-[1rem] border border-[#1b6fff]/25 bg-white/86 px-3 py-2 font-inherit text-inherit outline-none ${className}`}
          style={style}
        />
      ) : (
        <Tag className={className} style={displayStyle}>{value}</Tag>
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
  const displayStyle = getTextDisplayStyle(style, value);

  if (!editor) {
    return (
      <a href={href} className={className} style={displayStyle}>
        {value}
      </a>
    );
  }

  return (
    <div className={`${interactiveClass} ${hoverClass} ${selected ? selectedClass : ""} inline-flex`} onClick={handleSelect}>
      {selected ? (
        <textarea
          autoFocus
          value={value}
          rows={Math.max(value.split("\n").length, 2)}
          onClick={(event) => event.stopPropagation()}
          onChange={(event) => editor.updateValue(selection.fieldPath ?? "", event.target.value)}
          className={`resize-y rounded-[1rem] border border-[#1b6fff]/25 bg-white/86 px-3 py-2 font-inherit text-inherit outline-none ${className}`}
          style={style}
        />
      ) : (
        <a
          href={href}
          onClick={handleSelect}
          className={className}
          style={displayStyle}
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
            await editor.uploadImage(selection.imagePath, file, selection.uploadKey);
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
