"use client";

import { useEffect, useRef } from "react";

type TodoInputProps = {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
};

export function TodoInput({ value, onChange, onSubmit }: TodoInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const isShortcut =
        event.shiftKey &&
        event.code === "Space" &&
        (event.metaKey || event.ctrlKey);

      if (!isShortcut) return;

      event.preventDefault();
      inputRef.current?.focus();
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
    >
      <label className="block">
        <span className="sr-only">New task</span>
        <input
          ref={inputRef}
          type="text"
          value={value}
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          placeholder="Type something..."
          aria-label="New task"
          onChange={(event) => onChange(event.target.value)}
          className="h-14 w-full rounded-2xl border border-white/10 bg-surface px-4 text-base font-medium tracking-[-0.01em] text-zinc-50 shadow-[0_8px_32px_rgba(0,0,0,0.35)] outline-none transition placeholder:text-zinc-500 placeholder:font-normal focus:border-white/25 focus:ring-4 focus:ring-white/10 sm:h-16 sm:px-5 sm:text-lg"
        />
      </label>
    </form>
  );
}
