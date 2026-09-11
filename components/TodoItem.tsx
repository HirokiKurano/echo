"use client";

import type { Todo } from "@/lib/types";

type TodoItemProps = {
  todo: Todo;
  freshlyAdded: boolean;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
};

export function TodoItem({
  todo,
  freshlyAdded,
  onToggle,
  onDelete,
}: TodoItemProps) {
  return (
    <li
      className={`group flex min-h-12 items-center gap-3 rounded-xl px-1 py-1.5 transition-colors hover:bg-white/[0.04] ${
        freshlyAdded ? "animate-todo-in" : ""
      }`}
    >
      <button
        type="button"
        onClick={() => onToggle(todo.id)}
        aria-label={todo.completed ? "Mark as not done" : "Mark as done"}
        aria-pressed={todo.completed}
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-zinc-500"
      >
        <span
          className={`flex h-5 w-5 items-center justify-center rounded-full border transition ${
            todo.completed
              ? "border-zinc-100 bg-zinc-100 text-zinc-950"
              : "border-zinc-500 bg-transparent"
          }`}
        >
          {todo.completed ? (
            <svg viewBox="0 0 12 12" className="h-3 w-3" aria-hidden="true">
              <path
                d="M2.5 6.2 4.8 8.5 9.5 3.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ) : null}
        </span>
      </button>

      <span
        className={`min-w-0 flex-1 text-[15px] leading-6 font-medium tracking-[-0.01em] sm:text-base ${
          todo.completed
            ? "text-zinc-500 line-through decoration-zinc-600"
            : "text-zinc-100"
        }`}
      >
        {todo.title}
      </span>

      <button
        type="button"
        onClick={() => onDelete(todo.id)}
        aria-label={`Delete ${todo.title}`}
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-zinc-500 opacity-100 outline-none transition hover:bg-white/8 hover:text-zinc-200 focus-visible:ring-2 focus-visible:ring-zinc-500 [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:opacity-100 [@media(hover:hover)]:group-focus-within:opacity-100"
      >
        <svg viewBox="0 0 16 16" className="h-4 w-4" aria-hidden="true">
          <path
            d="M4 4l8 8M12 4l-8 8"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </button>
    </li>
  );
}
