"use client";

import type { Todo } from "@/lib/types";
import { TodoItem } from "./TodoItem";

type TodoListProps = {
  heading: string;
  todos: Todo[];
  freshlyAddedId: string | null;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
};

export function TodoList({
  heading,
  todos,
  freshlyAddedId,
  onToggle,
  onDelete,
}: TodoListProps) {
  if (todos.length === 0) return null;

  return (
    <section className="mt-10">
      <h2 className="font-display mb-3 px-1 text-[11px] font-semibold tracking-[0.22em] text-zinc-500 uppercase">
        {heading}
      </h2>
      <ul className="flex flex-col">
        {todos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            freshlyAdded={todo.id === freshlyAddedId}
            onToggle={onToggle}
            onDelete={onDelete}
          />
        ))}
      </ul>
    </section>
  );
}
