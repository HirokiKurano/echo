"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { openGlanceWindow } from "@/lib/glance";
import { loadTodos, saveTodos, subscribeTodos } from "@/lib/storage";
import type { Todo } from "@/lib/types";
import { LockWidget } from "./LockWidget";

function formatClock(now: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(now);
}

function formatDate(now: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(now);
}

export function WidgetLockScreen() {
  const searchParams = useSearchParams();
  const isGlance = searchParams.get("glance") === "1";
  const [todos, setTodos] = useState<Todo[]>([]);
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    function refresh() {
      setTodos(loadTodos());
    }

    refresh();
    setNow(new Date());

    const timer = window.setInterval(() => {
      setNow((current) => {
        const next = new Date();
        if (
          current &&
          current.getHours() === next.getHours() &&
          current.getMinutes() === next.getMinutes()
        ) {
          return current;
        }
        return next;
      });
    }, 1000);
    const unsubscribe = subscribeTodos(refresh);

    return () => {
      window.clearInterval(timer);
      unsubscribe();
    };
  }, []);

  function toggleTodo(id: string) {
    setTodos((current) => {
      const next = current.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      );
      saveTodos(next);
      return next;
    });
  }

  return (
    <div className="flex min-h-full flex-col items-center px-5 py-12 sm:py-20">
      <div className="flex min-h-[8.75rem] flex-col items-center">
        {now ? (
          <>
            <p className="font-display text-xs font-semibold tracking-[0.22em] text-zinc-500 uppercase">
              {formatDate(now)}
            </p>
            <p className="font-display mt-3 text-7xl font-semibold tracking-tight text-zinc-50 tabular-nums sm:text-8xl">
              {formatClock(now)}
            </p>
          </>
        ) : null}
      </div>

      <div className="mt-12 w-full max-w-sm">
        <LockWidget todos={todos} onToggle={toggleTodo} />
      </div>

      {isGlance ? (
        <p className="mt-10 text-center text-xs font-medium tracking-wide text-zinc-600">
          Keep this window on your desktop for a quick glance.
        </p>
      ) : (
        <div className="mt-10 flex flex-col items-center gap-3 text-sm font-medium tracking-wide">
          <button
            type="button"
            onClick={openGlanceWindow}
            className="text-zinc-400 outline-none transition hover:text-zinc-200 focus-visible:text-zinc-200"
          >
            Pop out window
          </button>
          <p className="max-w-xs text-center text-xs leading-5 text-zinc-600">
            On a phone, open Share and add this page to your Home Screen. It
            stays a glance, not a lock-screen widget.
          </p>
        </div>
      )}

      <Link
        href="/"
        className="mt-6 text-sm font-medium tracking-wide text-zinc-500 outline-none transition hover:text-zinc-300 focus-visible:text-zinc-300"
      >
        Back to Spark
      </Link>
    </div>
  );
}
