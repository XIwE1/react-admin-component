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
  filter: 'all' | 'today' | 'upcoming' | 'overdue' | 'no-date';
  addTodo: (text: string, dueDate?: string) => void;
  toggleTodo: (id: string) => void;
  deleteTodo: (id: string) => void;
  editTodo: (id: string, text: string) => void;
  clearCompleted: () => void;
  setDueDate: (id: string, dueDate: string | null) => void;
  setFilter: (filter: 'all' | 'today' | 'upcoming' | 'overdue' | 'no-date') => void;
}

const generateId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

export const useTodoStore = create<TodoState>()(
  persist(
    (set, get) => ({
      todos: [],
      filter: 'all',

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

      setFilter: (filter) =>
        set(() => ({
          filter,
        })),
    }),
    {
      name: LOCAL_TODO_KEY,
      partialize: (state) => ({ todos: state.todos }),
    }
  )
);

// Helper function to get filtered todos
const getFilteredTodos = (todos: TodoItem[], filter: 'all' | 'today' | 'upcoming' | 'overdue' | 'no-date'): TodoItem[] => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return todos.filter(todo => {
    if (filter === 'all') return true;

    if (!todo.dueDate) {
      return filter === 'no-date';
    }

    const dueDate = new Date(todo.dueDate);
    dueDate.setHours(0, 0, 0, 0);

    const isToday = dueDate.getTime() === today.getTime();
    const isUpcoming = dueDate > today;
    const isOverdue = dueDate < today;

    switch (filter) {
      case 'today':
        return isToday;
      case 'upcoming':
        return isUpcoming;
      case 'overdue':
        return isOverdue;
      case 'no-date':
        return !todo.dueDate;
      default:
        return true;
    }
  });
};

// Selector for filtered todos
export const useFilteredTodos = () => {
  const { todos, filter } = useTodoStore();
  return getFilteredTodos(todos, filter);
};
