import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import { vi } from 'vitest';
import TodoList from './index';
import { useTodoStore } from '@/store/todoStore';
import { MockStoreProvider } from '@/test-utils';

// Mock the todo store
const mockTodos = [
  {
    id: '1',
    text: 'Task 1',
    completed: false,
    createdAt: '2024-01-01T10:00:00.000Z',
    dueDate: '2024-01-15T18:00:00.000Z' // 今天
  },
  {
    id: '2',
    text: 'Task 2',
    completed: true,
    createdAt: '2024-01-02T10:00:00.000Z',
    dueDate: '2024-01-14T10:00:00.000Z' // 已完成
  },
  {
    id: '3',
    text: 'Task 3',
    completed: false,
    createdAt: '2024-01-03T10:00:00.000Z',
    dueDate: '2024-01-16T10:00:00.000Z' // 未来
  },
  {
    id: '4',
    text: 'Task 4',
    completed: false,
    createdAt: '2024-01-04T10:00:00.000Z',
    dueDate: '2024-01-13T10:00:00.000Z' // 过期
  },
  {
    id: '5',
    text: 'Task 5',
    completed: false,
    createdAt: '2024-01-05T10:00:00.000Z' // 无截止日期
  },
];

const mockStore = {
  todos: mockTodos,
  filter: 'all',
  setFilter: vi.fn(),
  addTodo: vi.fn(),
  toggleTodo: vi.fn(),
  deleteTodo: vi.fn(),
  editTodo: vi.fn(),
  clearCompleted: vi.fn(),
  setDueDate: vi.fn(),
};

// Mock FilterButtonGroup
vi.mock('./FilterButtonGroup', () => ({
  __esModule: true,
  default: () => <div data-testid="filter-button-group">Filter Button Group</div>,
}));

describe('TodoList Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render TodoList component', () => {
    render(
      <MockStoreProvider value={mockStore}>
        <TodoList />
      </MockStoreProvider>
    );

    expect(screen.getByText('待办事项')).toBeInTheDocument();
    expect(screen.getByTestId('filter-button-group')).toBeInTheDocument();
  });

  it('should display input field and add button', () => {
    render(
      <MockStoreProvider value={mockStore}>
        <TodoList />
      </MockStoreProvider>
    );

    const input = screen.getByPlaceholderText('输入待办事项...');
    const addButton = screen.getByText('添加');
    const datePicker = screen.getByPlaceholderText('选择截止日期');

    expect(input).toBeInTheDocument();
    expect(addButton).toBeInTheDocument();
    expect(datePicker).toBeInTheDocument();
  });

  it('should show statistics cards', () => {
    render(
      <MockStoreProvider value={mockStore}>
        <TodoList />
      </MockStoreProvider>
    );

    // Check for completion progress
    expect(screen.getByText('完成进度')).toBeInTheDocument();
    expect(screen.getByText('完成率')).toBeInTheDocument();

    // Check for overview statistics
    expect(screen.getByText('总项')).toBeInTheDocument();
    expect(screen.getByText('待完成')).toBeInTheDocument();
    expect(screen.getByText('今日')).toBeInTheDocument();
    expect(screen.getByText('已过期')).toBeInTheDocument();

    // Check for status distribution
    expect(screen.getByText('状态分布')).toBeInTheDocument();
    expect(screen.getByText('📅')).toBeInTheDocument();
    expect(screen.getByText('🔮')).toBeInTheDocument();
    expect(screen.getByText('⚠️')).toBeInTheDocument();
    expect(screen.getByText('⏰')).toBeInTheDocument();
    expect(screen.getByText('📌')).toBeInTheDocument();
    expect(screen.getByText('✅')).toBeInTheDocument();
  });

  it('should display correct statistics', () => {
    render(
      <MockStoreProvider value={mockStore}>
        <TodoList />
      </MockStoreProvider>
    );

    // Check total completion rate
    expect(screen.getByText('20%')).toBeInTheDocument();

    // Check todo counts
    expect(screen.getByText('4 项待完成')).toBeInTheDocument();
    expect(screen.getByText('显示 5/5 项')).toBeInTheDocument();
  });

  it('should show statistics correctly when filtered', () => {
    const filteredStore = {
      ...mockStore,
      filter: 'today',
    };

    render(
      <MockStoreProvider value={filteredStore}>
        <TodoList />
      </MockStoreProvider>
    );

    // Should show filtered counts
    expect(screen.getByText('显示 1/5 项')).toBeInTheDocument();
    // Should still show completion rate based on filtered list
    expect(screen.getByText('0%')).toBeInTheDocument();
  });

  it('should allow adding new todo', async () => {
    const mockAddTodo = vi.fn();
    const storeWithAdd = {
      ...mockStore,
      addTodo: mockAddTodo,
    };

    render(
      <MockStoreProvider value={storeWithAdd}>
        <TodoList />
      </MockStoreProvider>
    );

    const input = screen.getByPlaceholderText('输入待办事项...');
    const addButton = screen.getByText('添加');

    fireEvent.change(input, { target: { value: 'New Task' } });
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(mockAddTodo).toHaveBeenCalledWith('New Task', undefined);
    });
  });

  it('should not add empty todo', async () => {
    const mockAddTodo = vi.fn();
    const storeWithAdd = {
      ...mockStore,
      addTodo: mockAddTodo,
    };

    const mockMessage = vi.spyOn(require('antd').message, 'warning').mockImplementation(() => {});

    render(
      <MockStoreProvider value={storeWithAdd}>
        <TodoList />
      </MockStoreProvider>
    );

    const addButton = screen.getByText('添加');
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(mockAddTodo).not.toHaveBeenCalled();
      expect(mockMessage).toHaveBeenCalledWith('请输入待办事项');
    });

    mockMessage.mockRestore();
  });

  it('should allow toggling todo completion', async () => {
    const mockToggleTodo = vi.fn();
    const storeWithToggle = {
      ...mockStore,
      toggleTodo: mockToggleTodo,
    };

    render(
      <MockStoreProvider value={storeWithToggle}>
        <TodoList />
      </MockStoreProvider>
    );

    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes.length).toBeGreaterThan(0);

    fireEvent.click(checkboxes[0]);

    await waitFor(() => {
      expect(mockToggleTodo).toHaveBeenCalledWith('1');
    });
  });

  it('should allow clearing completed todos', async () => {
    const mockClearCompleted = vi.fn();
    const mockMessage = vi.spyOn(require('antd').message, 'success').mockImplementation(() => {});

    const storeWithClear = {
      ...mockStore,
      clearCompleted: mockClearCompleted,
    };

    render(
      <MockStoreProvider value={storeWithClear}>
        <TodoList />
      </MockStoreProvider>
    );

    const clearButton = screen.getByText('清除已完成');
    fireEvent.click(clearButton);

    await waitFor(() => {
      expect(mockClearCompleted).toHaveBeenCalled();
      expect(mockMessage).toHaveBeenCalledWith('已清除 1 条已完成项');
    });

    mockMessage.mockRestore();
  });

  it('should handle empty todo list', () => {
    const emptyStore = {
      ...mockStore,
      todos: [],
    };

    render(
      <MockStoreProvider value={emptyStore}>
        <TodoList />
      </MockStoreProvider>
    );

    expect(screen.getByText('暂无待办事项')).toBeInTheDocument();
  });

  it('should render responsive layout', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 320, // Mobile screen width
    });

    render(
      <MockStoreProvider value={mockStore}>
        <TodoList />
      </MockStoreProvider>
    );

    // Should be responsive and not break
    expect(screen.getByText('待办事项')).toBeInTheDocument();
    expect(screen.getByText('完成进度')).toBeInTheDocument();
    expect(screen.getByText('状态分布')).toBeInTheDocument();
  });

  it('should update statistics when todos change', async () => {
    const updatedStore = {
      ...mockStore,
      todos: [
        ...mockTodos,
        {
          id: '6',
          text: 'New Task',
          completed: false,
          createdAt: '2024-01-06T10:00:00.000Z',
        },
      ],
    };

    render(
      <MockStoreProvider value={updatedStore}>
        <TodoList />
      </MockStoreProvider>
    );

    // Should show updated statistics
    expect(screen.getByText('5/6 已完成')).toBeInTheDocument();
    expect(screen.getByText('5 项待完成')).toBeInTheDocument();
  });
});