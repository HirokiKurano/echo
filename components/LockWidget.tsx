"use client";

import type { Todo } from "@/lib/types";
import { SparkMark } from "./SparkMark";

type LockWidgetProps = {
  todos: Todo[];
  onToggle?: (id: string) => void;
};

export function LockWidget({ todos, onToggle }: LockWidgetProps) {
  const open = todos.filter((todo) => !todo.completed);
  const preview = open.slice(0, 3);
  const remaining = open.length;

  return (
    <section
      aria-label="Spark today widget"
      className="rounded-[28px] border border-white/10 bg-white/[0.06] px-5 py-4 shadow-[0_12px_40px_rgba(0,0,0,0.35)] backdrop-blur-xl"
    >
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-zinc-50">
          <SparkMark className="h-3.5 w-3.5" />
          <span className="font-display text-[11px] font-semibold tracking-[0.2em] uppercase">
            Spark
          </span>
        </div>
        <p className="font-display text-[10px] font-semibold tracking-[0.18em] text-zinc-500 uppercase">
          {remaining === 0 ? "Clear" : remaining === 1 ? "1 left" : `${remaining} left`}
        </p>
      </div>

      {preview.length === 0 ? (
        <p className="py-3 text-sm font-medium tracking-wide text-zinc-500">
          Nothing waiting. Capture a thought.
        </p>
      ) : (
        <ul className="flex flex-col gap-2.5">
          {preview.map((todo) => (
            <li key={todo.id}>
              {onToggle ? (
                <button
                  type="button"
                  onClick={() => onToggle(todo.id)}
                  aria-label={`Mark ${todo.title} as done`}
                  className="flex w-full items-center gap-3 rounded-xl py-0.5 text-left outline-none focus-visible:ring-2 focus-visible:ring-zinc-500"
                >
                  <WidgetDot />
                  <span className="min-w-0 flex-1 truncate text-[15px] font-medium tracking-[-0.01em] text-zinc-100">
                    {todo.title}
                  </span>
                </button>
              ) : (
                <div className="flex items-center gap-3">
                  <WidgetDot />
                  <span className="min-w-0 flex-1 truncate text-[15px] font-medium tracking-[-0.01em] text-zinc-100">
                    {todo.title}
                  </span>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function WidgetDot() {
  return (
    <span
      className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-zinc-500"
      aria-hidden="true"
    />
  );
}
