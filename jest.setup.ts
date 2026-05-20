import '@testing-library/jest-dom';

// Mock Ant Design components
vi.mock('antd', () => ({
  Input: vi.fn(({ ...props }) => <input {...props} />),
  Button: vi.fn(({ children, ...props }) => <button {...props}>{children}</button>),
  Checkbox: vi.fn(({ children, ...props }) => <input type="checkbox" {...props} />),
  DatePicker: vi.fn(({ ...props }) => <input type="date" {...props} />),
  Progress: vi.fn(({ ...props }) => <div {...props} />),
  Card: vi.fn(({ children, ...props }) => <div {...props}>{children}</div>),
  Row: vi.fn(({ children, ...props }) => <div {...props}>{children}</div>),
  Col: vi.fn(({ children, ...props }) => <div {...props}>{children}</div>),
  Statistic: vi.fn(({ children, ...props }) => <div {...props}>{children}</div>),
  Empty: vi.fn(({ description }) => <div>{description}</div>),
  Popconfirm: vi.fn(({ children, ...props }) => <div {...props}>{children}</div>),
}));

// Mock CSS modules
vi.mock('*.css', () => ({}));

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // Deprecated
    removeListener: vi.fn(), // Deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});