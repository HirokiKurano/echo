"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { openGlanceWindow } from "@/lib/glance";
import { isCreatedToday, loadTodos, saveTodos } from "@/lib/storage";
import type { Todo } from "@/lib/types";
import { LockWidget } from "./LockWidget";
import { SparkMark } from "./SparkMark";
import { TodoInput } from "./TodoInput";
import { TodoList } from "./TodoList";

function greetingForNow(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [draft, setDraft] = useState("");
  const [ready, setReady] = useState(false);
  const [freshlyAddedId, setFreshlyAddedId] = useState<string | null>(null);
  const [greeting, setGreeting] = useState("Good afternoon");

  useEffect(() => {
    const stored = loadTodos();
    setTodos((current) => {
      if (current.length === 0) return stored;
      const ids = new Set(current.map((todo) => todo.id));
      return [...current, ...stored.filter((todo) => !ids.has(todo.id))];
    });
    setGreeting(greetingForNow());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    saveTodos(todos);
  }, [todos, ready]);

  const { today, later, done } = useMemo(() => {
    const incomplete = todos.filter((todo) => !todo.completed);
    const completed = todos.filter((todo) => todo.completed);

    return {
      today: incomplete.filter((todo) => isCreatedToday(todo.createdAt)),
      later: incomplete.filter((todo) => !isCreatedToday(todo.createdAt)),
      done: completed,
    };
  }, [todos]);

  function addTodo() {
    const title = draft.trim();
    if (!title) return;

    const next: Todo = {
      id: crypto.randomUUID(),
      title,
      completed: false,
      createdAt: new Date().toISOString(),
    };

    setTodos((current) => [next, ...current]);
    setDraft("");
    setFreshlyAddedId(next.id);
  }

  function toggleTodo(id: string) {
    setTodos((current) =>
      current.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    );
  }

  function deleteTodo(id: string) {
    setTodos((current) => current.filter((todo) => todo.id !== id));
  }

  const isEmpty = ready && todos.length === 0;

  return (
    <div className="mx-auto w-full max-w-xl px-5 py-10 sm:px-6 sm:py-16">
      <header className="mb-8 sm:mb-10">
        <div className="mb-8 flex items-center gap-2.5 text-zinc-50">
          <SparkMark className="h-[18px] w-[18px]" />
          <span className="font-display text-[13px] font-semibold tracking-[0.22em] uppercase">
            Spark
          </span>
        </div>
        <p className="font-display text-[11px] font-semibold tracking-[0.22em] text-zinc-500 uppercase">
          {greeting}
        </p>
        <h1 className="font-display mt-3 text-[1.85rem] font-semibold leading-[1.15] tracking-[-0.04em] text-zinc-50 sm:text-[2.4rem]">
          What do you need to do?
        </h1>
        <p className="mt-3 text-sm font-medium tracking-wide text-zinc-500">
          The fastest place to capture a thought.
        </p>
      </header>

      <TodoInput value={draft} onChange={setDraft} onSubmit={addTodo} />

      {ready ? (
        <div className="mt-8">
          <LockWidget todos={todos} onToggle={toggleTodo} />
          <p className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 px-1 text-sm font-medium tracking-wide">
            <Link
              href="/widget"
              className="text-zinc-500 outline-none transition hover:text-zinc-300 focus-visible:text-zinc-200"
            >
              Open glance
            </Link>
            <button
              type="button"
              onClick={openGlanceWindow}
              className="text-zinc-500 outline-none transition hover:text-zinc-300 focus-visible:text-zinc-200"
            >
              Pop out window
            </button>
          </p>
        </div>
      ) : null}

      {isEmpty ? (
        <p className="mt-12 px-1 text-sm font-medium tracking-wide text-zinc-500">
          Nothing here yet. What&apos;s on your mind?
        </p>
      ) : (
        <>
          <TodoList
            heading="Today"
            todos={today}
            freshlyAddedId={freshlyAddedId}
            onToggle={toggleTodo}
            onDelete={deleteTodo}
          />
          <TodoList
            heading="Later"
            todos={later}
            freshlyAddedId={freshlyAddedId}
            onToggle={toggleTodo}
            onDelete={deleteTodo}
          />
          <TodoList
            heading="Done"
            todos={done}
            freshlyAddedId={freshlyAddedId}
            onToggle={toggleTodo}
            onDelete={deleteTodo}
          />
        </>
      )}
    </div>
  );
}
