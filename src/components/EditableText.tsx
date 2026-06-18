"use client";

import {
  useCallback,
  useEffect,
  useRef,
  type CSSProperties,
  type KeyboardEvent,
} from "react";

interface EditableTextProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  style?: CSSProperties;
  multiline?: boolean;
  as?: "div" | "span" | "p" | "h1" | "h2" | "h3";
}

export function EditableText({
  value,
  onChange,
  placeholder = "Click to edit",
  className = "",
  style,
  multiline = false,
  as: Tag = "div",
}: EditableTextProps) {
  const ref = useRef<HTMLElement>(null);
  const isFocused = useRef(false);

  useEffect(() => {
    if (ref.current && !isFocused.current) {
      const current = ref.current.textContent ?? "";
      if (current !== value) {
        ref.current.textContent = value;
      }
    }
  }, [value]);

  const handleInput = useCallback(() => {
    if (!ref.current) return;
    onChange(ref.current.textContent ?? "");
  }, [onChange]);

  const handleFocus = useCallback(() => {
    isFocused.current = true;
  }, []);

  const handleBlur = useCallback(() => {
    isFocused.current = false;
    handleInput();
  }, [handleInput]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLElement>) => {
      if (!multiline && e.key === "Enter") {
        e.preventDefault();
        ref.current?.blur();
      }
    },
    [multiline]
  );

  return (
    <Tag
      ref={ref as React.RefObject<never>}
      contentEditable
      suppressContentEditableWarning
      onInput={handleInput}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      data-placeholder={placeholder}
      className={`editable-text outline-none cursor-text rounded-sm transition-colors hover:ring-2 hover:ring-white/20 focus:ring-2 focus:ring-white/40 ${className}`}
      style={style}
    />
  );
}
