import { renderHook, act } from "@testing-library/react";
import { useTodoStore } from "./todoStore";

describe("TodoStore", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe("addTodo", () => {
    it("should add a new todo without dueDate", () => {
      const { result } = renderHook(() => useTodoStore());

      act(() => {
        result.current.addTodo("Test todo");
      });

      expect(result.current.todos).toHaveLength(1);
      expect(result.current.todos[0].text).toBe("Test todo");
      expect(result.current.todos[0].completed).toBe(false);
      expect(result.current.todos[0].dueDate).toBeUndefined();
    });

    it("should add a new todo with dueDate", () => {
      const { result } = renderHook(() => useTodoStore());
      const dueDate = "2026-05-20T14:30:00.000Z";

      act(() => {
        result.current.addTodo("Test todo", dueDate);
      });

      expect(result.current.todos).toHaveLength(1);
      expect(result.current.todos[0].dueDate).toBe(dueDate);
    });

    it("should generate unique id for each todo", () => {
      const { result } = renderHook(() => useTodoStore());

      act(() => {
        result.current.addTodo("Todo 1");
        result.current.addTodo("Todo 2");
      });

      expect(result.current.todos[0].id).not.toBe(result.current.todos[1].id);
    });
  });

  describe("toggleTodo", () => {
    it("should toggle completed status", () => {
      const { result } = renderHook(() => useTodoStore());

      act(() => {
        result.current.addTodo("Test todo");
      });
      const id = result.current.todos[0].id;

      act(() => {
        result.current.toggleTodo(id);
      });

      expect(result.current.todos[0].completed).toBe(true);

      act(() => {
        result.current.toggleTodo(id);
      });

      expect(result.current.todos[0].completed).toBe(false);
    });
  });

  describe("deleteTodo", () => {
    it("should remove todo by id", () => {
      const { result } = renderHook(() => useTodoStore());

      act(() => {
        result.current.addTodo("Todo 1");
        result.current.addTodo("Todo 2");
      });
      const id = result.current.todos[0].id;

      act(() => {
        result.current.deleteTodo(id);
      });

      expect(result.current.todos).toHaveLength(1);
      expect(result.current.todos[0].text).toBe("Todo 2");
    });
  });

  describe("editTodo", () => {
    it("should update todo text", () => {
      const { result } = renderHook(() => useTodoStore());

      act(() => {
        result.current.addTodo("Original text");
      });
      const id = result.current.todos[0].id;

      act(() => {
        result.current.editTodo(id, "Updated text");
      });

      expect(result.current.todos[0].text).toBe("Updated text");
      expect(result.current.todos[0].id).toBe(id);
    });
  });

  describe("clearCompleted", () => {
    it("should remove all completed todos", () => {
      const { result } = renderHook(() => useTodoStore());

      act(() => {
        result.current.addTodo("Todo 1");
        result.current.addTodo("Todo 2");
        result.current.addTodo("Todo 3");
      });

      const id1 = result.current.todos[0].id;
      const id2 = result.current.todos[1].id;

      act(() => {
        result.current.toggleTodo(id1);
        result.current.toggleTodo(id2);
      });

      expect(result.current.todos).toHaveLength(3);

      act(() => {
        result.current.clearCompleted();
      });

      expect(result.current.todos).toHaveLength(1);
      expect(result.current.todos[0].text).toBe("Todo 3");
      expect(result.current.todos[0].completed).toBe(false);
    });
  });

  describe("setDueDate", () => {
    it("should set due date for existing todo", () => {
      const { result } = renderHook(() => useTodoStore());
      const dueDate = "2026-05-20T14:30:00.000Z";

      act(() => {
        result.current.addTodo("Test todo");
      });
      const id = result.current.todos[0].id;

      expect(result.current.todos[0].dueDate).toBeUndefined();

      act(() => {
        result.current.setDueDate(id, dueDate);
      });

      expect(result.current.todos[0].dueDate).toBe(dueDate);
    });

    it("should clear due date when passing null", () => {
      const { result } = renderHook(() => useTodoStore());
      const dueDate = "2026-05-20T14:30:00.000Z";

      act(() => {
        result.current.addTodo("Test todo", dueDate);
      });
      const id = result.current.todos[0].id;

      expect(result.current.todos[0].dueDate).toBe(dueDate);

      act(() => {
        result.current.setDueDate(id, null);
      });

      expect(result.current.todos[0].dueDate).toBeUndefined();
    });
  });

  describe("persistence", () => {
    it("should persist todos to localStorage", () => {
      const { result } = renderHook(() => useTodoStore());

      act(() => {
        result.current.addTodo("Test todo");
      });

      const stored = localStorage.getItem("todo-storage");
      expect(stored).toBeTruthy();

      const parsed = JSON.parse(stored!);
      expect(parsed.state.todos).toHaveLength(1);
      expect(parsed.state.todos[0].text).toBe("Test todo");
    });
  });
});
