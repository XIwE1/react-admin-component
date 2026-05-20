import {
  getTodoStatus,
  isOverdue,
  getRemainingTime,
  formatDate,
  formatDateTime,
  TodoStatus,
  DateFilterType,
  filterTodosByDate,
  getTodosByStatus,
  getTodoStatistics,
  getCompletionRate,
  getAverageRemainingTime,
  clearTodoCache,
  getCacheStats,
} from "./utils";

describe("Date Utility Functions", () => {
  describe("getTodoStatus", () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it("should return COMPLETED status for completed todo", () => {
      const now = new Date("2026-05-20T10:00:00.000Z");
      const dueDate = "2026-05-22T10:00:00.000Z";

      jest.setSystemTime(now);

      const result = getTodoStatus(dueDate, true);
      expect(result).toBe(TodoStatus.COMPLETED);
    });

    it("should return OVERDUE status for past date and not completed", () => {
      const now = new Date("2026-05-20T10:00:00.000Z");
      const dueDate = "2026-05-18T10:00:00.000Z";

      jest.setSystemTime(now);

      const result = getTodoStatus(dueDate, false);
      expect(result).toBe(TodoStatus.OVERDUE);
    });

    it("should return TODAY status for today's date", () => {
      const now = new Date("2026-05-20T10:00:00.000Z");
      const dueDate = "2026-05-20T22:00:00.000Z"; // Same day, different time

      jest.setSystemTime(now);

      const result = getTodoStatus(dueDate, false);
      expect(result).toBe(TodoStatus.TODAY);
    });

    it("should return PENDING status for future date", () => {
      const now = new Date("2026-05-20T10:00:00.000Z");
      const dueDate = "2026-05-25T10:00:00.000Z";

      jest.setSystemTime(now);

      const result = getTodoStatus(dueDate, false);
      expect(result).toBe(TodoStatus.PENDING);
    });
  });

  describe("formatDate", () => {
    it("should format date with default format", () => {
      const isoDate = "2026-05-20T14:30:45.000Z";
      const result = formatDate(isoDate);

      expect(result).toBe("2026-05-20 14:30:45");
    });

    it("should format date with custom format", () => {
      const isoDate = "2026-05-20T14:30:45.000Z";
      const result = formatDate(isoDate, "YYYY年MM月DD日");

      expect(result).toBe("2026年05月20日");
    });

    it("should format date with time format", () => {
      const isoDate = "2026-05-20T14:30:45.000Z";
      const result = formatDate(isoDate, "HH:mm:ss");

      expect(result).toBe("14:30:45");
    });

    it("should handle invalid date", () => {
      const result = formatDate("invalid-date");
      expect(result).toBe("无效日期");
    });
  });

  describe("Time Utility Functions", () => {
  describe("getRemainingTime", () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it("should return remaining time for future date", () => {
      const now = new Date("2026-05-20T10:00:00.000Z");
      const dueDate = "2026-05-22T10:00:00.000Z"; // 2 days later

      jest.setSystemTime(now);

      const result = getRemainingTime(dueDate);
      expect(result).toBe("2天后");
    });

    it("should return hours when less than a day", () => {
      const now = new Date("2026-05-20T10:00:00.000Z");
      const dueDate = "2026-05-20T14:30:00.000Z"; // 4.5 hours later

      jest.setSystemTime(now);

      const result = getRemainingTime(dueDate);
      expect(result).toBe("4.5小时后");
    });

    it("should return minutes when less than an hour", () => {
      const now = new Date("2026-05-20T10:00:00.000Z");
      const dueDate = "2026-05-20T10:45:00.000Z"; // 45 minutes later

      jest.setSystemTime(now);

      const result = getRemainingTime(dueDate);
      expect(result).toBe("45分钟后");
    });

    it("should return '即将到期' when less than 5 minutes", () => {
      const now = new Date("2026-05-20T10:00:00.000Z");
      const dueDate = "2026-05-20T10:00:30.000Z"; // 30 seconds later

      jest.setSystemTime(now);

      const result = getRemainingTime(dueDate);
      expect(result).toBe("即将到期");
    });

    it("should return '已到期' when exactly at due date", () => {
      const now = new Date("2026-05-20T10:00:00.000Z");
      const dueDate = "2026-05-20T10:00:00.000Z"; // Same time

      jest.setSystemTime(now);

      const result = getRemainingTime(dueDate);
      expect(result).toBe("已到期");
    });

    it("should return '2天前' for past date less than a week", () => {
      const now = new Date("2026-05-20T10:00:00.000Z");
      const dueDate = "2026-05-18T10:00:00.000Z"; // 2 days before

      jest.setSystemTime(now);

      const result = getRemainingTime(dueDate);
      expect(result).toBe("2天前");
    });

    it("should return relative time for past date more than a week", () => {
      const now = new Date("2026-05-20T10:00:00.000Z");
      const dueDate = "2026-05-10T10:00:00.000Z"; // 10 days before

      jest.setSystemTime(now);

      const result = getRemainingTime(dueDate);
      expect(result).toBe("10天前");
    });

    it("should handle invalid date string", () => {
      const result = getRemainingTime("invalid-date");
      expect(result).toBe("无效日期");
    });

    it("should handle empty string", () => {
      const result = getRemainingTime("");
      expect(result).toBe("无效日期");
    });
  });

  describe("isOverdue", () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it("should return true for past date and not completed", () => {
      const now = new Date("2026-05-20T10:00:00.000Z");
      const dueDate = "2026-05-18T10:00:00.000Z";

      jest.setSystemTime(now);

      const result = isOverdue(dueDate, false);
      expect(result).toBe(true);
    });

    it("should return false for past date but completed", () => {
      const now = new Date("2026-05-20T10:00:00.000Z");
      const dueDate = "2026-05-18T10:00:00.000Z";

      jest.setSystemTime(now);

      const result = isOverdue(dueDate, true);
      expect(result).toBe(false);
    });

    it("should return false for future date", () => {
      const now = new Date("2026-05-20T10:00:00.000Z");
      const dueDate = "2026-05-22T10:00:00.000Z";

      jest.setSystemTime(now);

      const result = isOverdue(dueDate, false);
      expect(result).toBe(false);
    });

    it("should return false for completed item regardless of date", () => {
      const now = new Date("2026-05-20T10:00:00.000Z");
      const pastDueDate = "2026-05-18T10:00:00.000Z";

      jest.setSystemTime(now);

      const result = isOverdue(pastDueDate, true);
      expect(result).toBe(false);
    });

    it("should return false for today's date and not completed", () => {
      const now = new Date("2026-05-20T10:00:00.000Z");
      const dueDate = "2026-05-20T22:00:00.000Z";

      jest.setSystemTime(now);

      const result = isOverdue(dueDate, false);
      expect(result).toBe(false);
    });
  });

  describe("formatDateTime", () => {
    it("should format ISO date string to readable format", () => {
      const isoDate = "2026-05-20T14:30:45.000Z";
      const result = formatDateTime(isoDate);

      expect(result).toBe("2026-05-20 14:30:45");
    });

    it("should handle single digit month and day", () => {
      const isoDate = "2026-01-05T09:05:09.000Z";
      const result = formatDateTime(isoDate);

      expect(result).toBe("2026-01-05 09:05:09");
    });

    it("should handle double digit month and day", () => {
      const isoDate = "2026-12-31T23:59:59.000Z";
      const result = formatDateTime(isoDate);

      expect(result).toBe("2026-12-31 23:59:59");
    });

    it("should return '无效日期' for invalid date string", () => {
      const result = formatDateTime("invalid-date");
      expect(result).toBe("无效日期");
    });

    it("should return '无效日期' for empty string", () => {
      const result = formatDateTime("");
      expect(result).toBe("无效日期");
    });

    it("should handle UTC timezone and convert to local", () => {
      const isoDate = "2026-05-20T14:30:00.000Z";
      const result = formatDateTime(isoDate);

      expect(typeof result).toBe("string");
      expect(result).toMatch(/\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/);
    });
  });
});

describe("DateFilterType Enum", () => {
  it("should have all filter types", () => {
    expect(DateFilterType.ALL).toBe("all");
    expect(DateFilterType.TODAY).toBe("today");
    expect(DateFilterType.UPCOMING).toBe("upcoming");
    expect(DateFilterType.OVERDUE).toBe("overdue");
    expect(DateFilterType.NO_DATE).toBe("no-date");
  });
});

describe("filterTodosByDate Function", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    // 清除缓存
    clearTodoCache();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  const mockTodos = [
    {
      id: "1",
      text: "Task 1",
      completed: false,
      createdAt: "2026-05-20T10:00:00.000Z",
      dueDate: "2026-05-20T18:00:00.000Z", // 今天
    },
    {
      id: "2",
      text: "Task 2",
      completed: false,
      createdAt: "2026-05-20T10:00:00.000Z",
      dueDate: "2026-05-22T10:00:00.000Z", // 未来
    },
    {
      id: "3",
      text: "Task 3",
      completed: false,
      createdAt: "2026-05-20T10:00:00.000Z",
      dueDate: "2026-05-18T10:00:00.000Z", // 过期
    },
    {
      id: "4",
      text: "Task 4",
      completed: true,
      createdAt: "2026-05-20T10:00:00.000Z",
      dueDate: "2026-05-18T10:00:00.000Z", // 已完成
    },
    {
      id: "5",
      text: "Task 5",
      completed: false,
      createdAt: "2026-05-20T10:00:00.000Z", // 无截止日期
    },
  ];

  it("should return all todos when filter is 'all'", () => {
    const now = new Date("2026-05-20T10:00:00.000Z");
    jest.setSystemTime(now);

    const result = filterTodosByDate(mockTodos, DateFilterType.ALL);
    expect(result).toHaveLength(5);
    expect(result).toEqual(mockTodos);
  });

  it("should return only today's todos when filter is 'today'", () => {
    const now = new Date("2026-05-20T10:00:00.000Z");
    jest.setSystemTime(now);

    const result = filterTodosByDate(mockTodos, DateFilterType.TODAY);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("1");
  });

  it("should return only upcoming todos when filter is 'upcoming'", () => {
    const now = new Date("2026-05-20T10:00:00.000Z");
    jest.setSystemTime(now);

    const result = filterTodosByDate(mockTodos, DateFilterType.UPCOMING);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("2");
  });

  it("should return only overdue todos when filter is 'overdue'", () => {
    const now = new Date("2026-05-20T10:00:00.000Z");
    jest.setSystemTime(now);

    const result = filterTodosByDate(mockTodos, DateFilterType.OVERDUE);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("3");
  });

  it("should return only todos without due date when filter is 'no-date'", () => {
    const result = filterTodosByDate(mockTodos, DateFilterType.NO_DATE);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("5");
  });

  it("should handle empty todos array", () => {
    const result = filterTodosByDate([], DateFilterType.ALL);
    expect(result).toEqual([]);
  });

  it("should use cache when available", () => {
    const now = new Date("2026-05-20T10:00:00.000Z");
    jest.setSystemTime(now);

    // 第一次调用
    const firstCall = filterTodosByDate(mockTodos, DateFilterType.TODAY);
    // 第二次调用应该使用缓存
    const secondCall = filterTodosByDate(mockTodos, DateFilterType.TODAY);

    expect(secondCall).toEqual(firstCall);
    expect(getCacheStats().filterCacheSize).toBeGreaterThan(0);
  });
});

describe("getTodosByStatus Function", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    // 清除缓存
    clearTodoCache();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  const mockTodos = [
    {
      id: "1",
      text: "Task 1",
      completed: false,
      createdAt: "2026-05-20T10:00:00.000Z",
      dueDate: "2026-05-20T18:00:00.000Z", // 今天
    },
    {
      id: "2",
      text: "Task 2",
      completed: false,
      createdAt: "2026-05-20T10:00:00.000Z",
      dueDate: "2026-05-22T10:00:00.000Z", // 未来
    },
    {
      id: "3",
      text: "Task 3",
      completed: false,
      createdAt: "2026-05-20T10:00:00.000Z",
      dueDate: "2026-05-18T10:00:00.000Z", // 过期
    },
    {
      id: "4",
      text: "Task 4",
      completed: true,
      createdAt: "2026-05-20T10:00:00.000Z",
      dueDate: "2026-05-18T10:00:00.000Z", // 已完成
    },
    {
      id: "5",
      text: "Task 5",
      completed: false,
      createdAt: "2026-05-20T10:00:00.000Z", // 无截止日期
    },
  ];

  it("should categorize todos by status correctly", () => {
    const now = new Date("2026-05-20T10:00:00.000Z");
    jest.setSystemTime(now);

    const result = getTodosByStatus(mockTodos);

    expect(result.pending).toHaveLength(1);
    expect(result.pending[0].id).toBe("2");

    expect(result.today).toHaveLength(1);
    expect(result.today[0].id).toBe("1");

    expect(result.upcoming).toHaveLength(0);

    expect(result.overdue).toHaveLength(1);
    expect(result.overdue[0].id).toBe("3");

    expect(result.noDate).toHaveLength(1);
    expect(result.noDate[0].id).toBe("5");

    expect(result.completed).toHaveLength(1);
    expect(result.completed[0].id).toBe("4");
  });

  it("should use cache when available", () => {
    const now = new Date("2026-05-20T10:00:00.000Z");
    jest.setSystemTime(now);

    // 第一次调用
    const firstCall = getTodosByStatus(mockTodos);
    // 第二次调用应该使用缓存
    const secondCall = getTodosByStatus(mockTodos);

    expect(secondCall).toEqual(firstCall);
    expect(getCacheStats().statusCacheSize).toBeGreaterThan(0);
  });

  it("should handle empty todos array", () => {
    const result = getTodosByStatus([]);
    expect(result.pending).toEqual([]);
    expect(result.today).toEqual([]);
    expect(result.upcoming).toEqual([]);
    expect(result.overdue).toEqual([]);
    expect(result.noDate).toEqual([]);
    expect(result.completed).toEqual([]);
  });
});

describe("getTodoStatistics Function", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    // 清除缓存
    clearTodoCache();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  const mockTodos = [
    {
      id: "1",
      text: "Task 1",
      completed: false,
      createdAt: "2026-05-20T10:00:00.000Z",
      dueDate: "2026-05-20T18:00:00.000Z", // 今天
    },
    {
      id: "2",
      text: "Task 2",
      completed: false,
      createdAt: "2026-05-20T10:00:00.000Z",
      dueDate: "2026-05-22T10:00:00.000Z", // 未来
    },
    {
      id: "3",
      text: "Task 3",
      completed: false,
      createdAt: "2026-05-20T10:00:00.000Z",
      dueDate: "2026-05-18T10:00:000Z", // 过期
    },
    {
      id: "4",
      text: "Task 4",
      completed: true,
      createdAt: "2026-05-20T10:00:00.000Z",
      dueDate: "2026-05-18T10:00:00.000Z", // 已完成
    },
    {
      id: "5",
      text: "Task 5",
      completed: false,
      createdAt: "2026-05-20T10:00:00.000Z", // 无截止日期
    },
  ];

  it("should return correct statistics", () => {
    const now = new Date("2026-05-20T10:00:00.000Z");
    jest.setSystemTime(now);

    const stats = getTodoStatistics(mockTodos);

    expect(stats.total).toBe(5);
    expect(stats.pending).toBe(1);
    expect(stats.today).toBe(1);
    expect(stats.upcoming).toBe(0);
    expect(stats.overdue).toBe(1);
    expect(stats.noDate).toBe(1);
    expect(stats.completed).toBe(1);
  });

  it("should use cache when available", () => {
    const now = new Date("2026-05-20T10:00:00.000Z");
    jest.setSystemTime(now);

    // 第一次调用
    const firstCall = getTodoStatistics(mockTodos);
    // 第二次调用应该使用缓存
    const secondCall = getTodoStatistics(mockTodos);

    expect(secondCall).toEqual(firstCall);
    expect(getCacheStats().statsCacheSize).toBeGreaterThan(0);
  });

  it("should handle empty todos array", () => {
    const stats = getTodoStatistics([]);
    expect(stats.total).toBe(0);
    expect(stats.pending).toBe(0);
    expect(stats.today).toBe(0);
    expect(stats.upcoming).toBe(0);
    expect(stats.overdue).toBe(0);
    expect(stats.noDate).toBe(0);
    expect(stats.completed).toBe(0);
  });
});

describe("getCompletionRate Function", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    // 清除缓存
    clearTodoCache();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("should return correct completion rate", () => {
    const todos = [
      { id: "1", text: "Task 1", completed: true, createdAt: "2026-05-20T10:00:00.000Z" },
      { id: "2", text: "Task 2", completed: false, createdAt: "2026-05-20T10:00:00.000Z" },
      { id: "3", text: "Task 3", completed: true, createdAt: "2026-05-20T10:00:00.000Z" },
    ];

    const rate = getCompletionRate(todos);
    expect(rate).toBe(2/3);
  });

  it("should return 0 for empty todos", () => {
    const rate = getCompletionRate([]);
    expect(rate).toBe(0);
  });

  it("should return 1 when all todos are completed", () => {
    const todos = [
      { id: "1", text: "Task 1", completed: true, createdAt: "2026-05-20T10:00:00.000Z" },
      { id: "2", text: "Task 2", completed: true, createdAt: "2026-05-20T10:00:00.000Z" },
    ];

    const rate = getCompletionRate(todos);
    expect(rate).toBe(1);
  });

  it("should use cache when available", () => {
    const todos = [
      { id: "1", text: "Task 1", completed: true, createdAt: "2026-05-20T10:00:00.000Z" },
      { id: "2", text: "Task 2", completed: false, createdAt: "2026-05-20T10:00:00.000Z" },
    ];

    // 第一次调用
    const firstCall = getCompletionRate(todos);
    // 第二次调用应该使用缓存
    const secondCall = getCompletionRate(todos);

    expect(secondCall).toEqual(firstCall);
    expect(getCacheStats().completionRateCacheSize).toBeGreaterThan(0);
  });
});

describe("getAverageRemainingTime Function", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    // 清除缓存
    clearTodoCache();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("should return correct average remaining time", () => {
    const now = new Date("2026-05-20T10:00:00.000Z");
    jest.setSystemTime(now);

    const todos = [
      {
        id: "1",
        text: "Task 1",
        completed: false,
        createdAt: "2026-05-20T10:00:00.000Z",
        dueDate: "2026-05-21T10:00:00.000Z", // 24小时后
      },
      {
        id: "2",
        text: "Task 2",
        completed: false,
        createdAt: "2026-05-20T10:00:00.000Z",
        dueDate: "2026-05-22T10:00:00.000Z", // 48小时后
      },
    ];

    const avgTime = getAverageRemainingTime(todos);
    expect(avgTime).toBe(36); // (24 + 48) / 2 = 36
  });

  it("should return Infinity when no pending todos", () => {
    const todos = [
      { id: "1", text: "Task 1", completed: true, createdAt: "2026-05-20T10:00:00.000Z" },
      { id: "2", text: "Task 2", completed: false, createdAt: "2026-05-20T10:00:00.000Z" }, // 无截止日期
    ];

    const avgTime = getAverageRemainingTime(todos);
    expect(avgTime).toBe(Infinity);
  });

  it("should use cache when available", () => {
    const now = new Date("2026-05-20T10:00:00.000Z");
    jest.setSystemTime(now);

    const todos = [
      {
        id: "1",
        text: "Task 1",
        completed: false,
        createdAt: "2026-05-20T10:00:00.000Z",
        dueDate: "2026-05-21T10:00:00.000Z",
      },
    ];

    // 第一次调用
    const firstCall = getAverageRemainingTime(todos);
    // 第二次调用应该使用缓存
    const secondCall = getAverageRemainingTime(todos);

    expect(secondCall).toEqual(firstCall);
    expect(getCacheStats().avgTimeCacheSize).toBeGreaterThan(0);
  });
});

describe("Cache Functions", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    // 清除缓存
    clearTodoCache();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("should clear cache correctly", () => {
    const todos = [
      { id: "1", text: "Task 1", completed: false, createdAt: "2026-05-20T10:00:00.000Z" },
    ];

    // 执行一些操作来填充缓存
    filterTodosByDate(todos, DateFilterType.ALL);
    getTodosByStatus(todos);
    getTodoStatistics(todos);

    expect(getCacheStats().filterCacheSize).toBeGreaterThan(0);

    // 清除缓存
    clearTodoCache();

    expect(getCacheStats().filterCacheSize).toBe(0);
    expect(getCacheStats().statusCacheSize).toBe(0);
    expect(getCacheStats().statsCacheSize).toBe(0);
  });

  it("should provide cache statistics", () => {
    const todos = [
      { id: "1", text: "Task 1", completed: false, createdAt: "2026-05-20T10:00:00.000Z" },
    ];

    // 初始状态应该没有缓存
    let stats = getCacheStats();
    expect(stats.filterCacheSize).toBe(0);
    expect(stats.statusCacheSize).toBe(0);
    expect(stats.statsCacheSize).toBe(0);
    expect(stats.completionRateCacheSize).toBe(0);
    expect(stats.avgTimeCacheSize).toBe(0);

    // 执行一些操作
    filterTodosByDate(todos, DateFilterType.ALL);
    getTodosByStatus(todos);
    getTodoStatistics(todos);
    getCompletionRate(todos);

    // 应该有缓存
    stats = getCacheStats();
    expect(stats.filterCacheSize).toBeGreaterThan(0);
    expect(stats.statusCacheSize).toBeGreaterThan(0);
    expect(stats.statsCacheSize).toBeGreaterThan(0);
  });
});
