import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import FilterButtonGroup from './FilterButtonGroup';
import { useTodoStore } from '@/store/todoStore';
import { MockStoreProvider } from '@/test-utils';

// Mock the todo store
const mockTodos = [
  { id: '1', text: 'Test 1', completed: false, createdAt: '2024-01-01', dueDate: '2024-01-15' },
  { id: '2', text: 'Test 2', completed: true, createdAt: '2024-01-02', dueDate: '2024-01-14' },
  { id: '3', text: 'Test 3', completed: false, createdAt: '2024-01-03', dueDate: '2024-01-16' },
  { id: '4', text: 'Test 4', completed: false, createdAt: '2024-01-04' }, // no due date
];

const mockStore = {
  todos: mockTodos,
  filter: 'all',
  setFilter: jest.fn(),
  addTodo: jest.fn(),
  toggleTodo: jest.fn(),
  deleteTodo: jest.fn(),
  editTodo: jest.fn(),
  clearCompleted: jest.fn(),
  setDueDate: jest.fn(),
};

describe('FilterButtonGroup', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all filter buttons with counts', () => {
    render(
      <MockStoreProvider value={mockStore}>
        <FilterButtonGroup />
      </MockStoreProvider>
    );

    expect(screen.getByText('📋 All')).toBeInTheDocument();
    expect(screen.getByText('📅 Today')).toBeInTheDocument();
    expect(screen.getByText('🔮 Upcoming')).toBeInTheDocument();
    expect(screen.getByText('⚠️ Overdue')).toBeInTheDocument();
    expect(screen.getByText('📌 No date')).toBeInTheDocument();
  });

  it('displays correct counts for each filter', () => {
    render(
      <MockStoreProvider value={mockStore}>
        <FilterButtonGroup />
      </MockStoreProvider>
    );

    // Check if buttons contain count tags
    const allButton = screen.getByText('📋 All').closest('button');
    const todayButton = screen.getByText('📅 Today').closest('button');

    expect(allButton).toContainHTML('4'); // All todos
    expect(todayButton).toContainHTML('0'); // No todos for today
  });

  it('highlights active filter button', () => {
    mockStore.filter = 'upcoming';

    render(
      <MockStoreProvider value={mockStore}>
        <FilterButtonGroup />
      </MockStoreProvider>
    );

    const upcomingButton = screen.getByText('🔮 Upcoming').closest('button');
    expect(upcomingButton).toHaveClass('ant-btn-primary');
  });

  it('calls setFilter when filter button is clicked', () => {
    render(
      <MockStoreProvider value={mockStore}>
        <FilterButtonGroup />
      </MockStoreProvider>
    );

    const overdueButton = screen.getByText('⚠️ Overdue').closest('button');
    fireEvent.click(overdueButton);

    expect(mockStore.setFilter).toHaveBeenCalledWith('overdue');
  });

  it('shows current filter status when not "all"', () => {
    mockStore.filter = 'today';

    render(
      <MockStoreProvider value={mockStore}>
        <FilterButtonGroup />
      </MockStoreProvider>
    );

    expect(screen.getByText('当前筛选: Today')).toBeInTheDocument();
  });

  it('does not show current filter status when filter is "all"', () => {
    mockStore.filter = 'all';

    render(
      <MockStoreProvider value={mockStore}>
        <FilterButtonGroup />
      </MockStoreProvider>
    );

    expect(screen.queryByText('当前筛选:')).not.toBeInTheDocument();
  });
});