import { create } from "zustand";
import { persist } from "zustand/middleware";

export const LOCAL_TODO_KEY = "todo-storage";

export interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
  createdAt: string;
  dueDate?: string;
}

interface TodoState {
  todos: TodoItem[];
  addTodo: (text: string, dueDate?: string) => void;
  toggleTodo: (id: string) => void;
  deleteTodo: (id: string) => void;
  editTodo: (id: string, text: string) => void;
  clearCompleted: () => void;
  setDueDate: (id: string, dueDate: string | null) => void;
}

const generateId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

export const useTodoStore = create<TodoState>()(
  persist(
    (set) => ({
      todos: [],

      addTodo: (text, dueDate) =>
        set((state) => ({
          todos: [
            ...state.todos,
            {
              id: generateId(),
              text,
              completed: false,
              createdAt: new Date().toISOString(),
              dueDate,
            },
          ],
        })),

      toggleTodo: (id) =>
        set((state) => ({
          todos: state.todos.map((todo) =>
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
          ),
        })),

      deleteTodo: (id) =>
        set((state) => ({
          todos: state.todos.filter((todo) => todo.id !== id),
        })),

      editTodo: (id, text) =>
        set((state) => ({
          todos: state.todos.map((todo) =>
            todo.id === id ? { ...todo, text } : todo
          ),
        })),

      clearCompleted: () =>
        set((state) => ({
          todos: state.todos.filter((todo) => !todo.completed),
        })),

      setDueDate: (id, dueDate) =>
        set((state) => ({
          todos: state.todos.map((todo) =>
            todo.id === id ? { ...todo, dueDate: dueDate ?? undefined } : todo
          ),
        })),
    }),
    {
      name: LOCAL_TODO_KEY,
      partialize: (state) => ({ todos: state.todos }),
    }
  )
);
