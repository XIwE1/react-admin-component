import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/zh-cn";

// 配置 dayjs
dayjs.extend(relativeTime);
dayjs.locale("zh-cn");

/**
 * 日期筛选类型枚举
 */
export enum DateFilterType {
  ALL = "all",         // 显示所有
  TODAY = "today",     // 今日到期
  UPCOMING = "upcoming", // 即将到期
  OVERDUE = "overdue",   // 已过期
  NO_DATE = "no-date"   // 无截止日期
}

/**
 * 缓存键生成器
 */
const generateCacheKey = (todos: any[], filter: DateFilterType) => {
  return `${JSON.stringify(todos)}_${filter}_${dayjs().format('YYYY-MM-DD')}`;
};

/**
 * 缓存对象
 */
const todoCache = {
  filterCache: new Map<string, any[]>(),
  statusCache: new Map<string, any>(),
  statsCache: new Map<string, any>(),
  completionRateCache: new Map<string, number>(),
  avgTimeCache: new Map<string, number>(),

  /**
   * 清除缓存（当日期变化时）
   */
  clear: () => {
    todoCache.filterCache.clear();
    todoCache.statusCache.clear();
    todoCache.statsCache.clear();
    todoCache.completionRateCache.clear();
    todoCache.avgTimeCache.clear();
  },

  /**
   * 获取缓存
   */
  getFilter: (key: string) => todoCache.filterCache.get(key),
  getStatus: (key: string) => todoCache.statusCache.get(key),
  getStats: (key: string) => todoCache.statsCache.get(key),
  getCompletionRate: (key: string) => todoCache.completionRateCache.get(key),
  getAvgTime: (key: string) => todoCache.avgTimeCache.get(key),

  /**
   * 设置缓存
   */
  setFilter: (key: string, value: any[]) => todoCache.filterCache.set(key, value),
  setStatus: (key: string, value: any) => todoCache.statusCache.set(key, value),
  setStats: (key: string, value: any) => todoCache.statsCache.set(key, value),
  setCompletionRate: (key: string, value: number) => todoCache.completionRateCache.set(key, value),
  setAvgTime: (key: string, value: number) => todoCache.avgTimeCache.set(key, value),
};

// 每日自动清除缓存
const checkAndClearCache = () => {
  const today = dayjs().format('YYYY-MM-DD');
  const lastClearDate = localStorage.getItem('todo-cache-clear-date');

  if (lastClearDate !== today) {
    todoCache.clear();
    localStorage.setItem('todo-cache-clear-date', today);
  }
};

/**
 * 待办事项状态枚举
 */
export enum TodoStatus {
  PENDING = "pending",      // 待处理
  TODAY = "today",          // 今日到期
  OVERDUE = "overdue",      // 已过期
  COMPLETED = "completed"   // 已完成
}

/**
 * 获取待办事项状态
 * @param dueDate 截止日期 ISO 字符串
 * @param completed 是否已完成
 * @returns 待办事项状态
 */
export const getTodoStatus = (dueDate: string, completed: boolean): TodoStatus => {
  if (completed) return TodoStatus.COMPLETED;

  const due = dayjs(dueDate);
  const now = dayjs();

  if (due.isBefore(now)) {
    return TodoStatus.OVERDUE;
  }

  if (due.isSame(now, "day")) {
    return TodoStatus.TODAY;
  }

  return TodoStatus.PENDING;
};

/**
 * 判断是否过期
 * @param dueDate 截止日期 ISO 字符串
 * @param completed 是否已完成
 * @returns 是否过期
 */
export const isOverdue = (dueDate: string, completed: boolean): boolean => {
  const due = dayjs(dueDate);
  const now = dayjs();
  return !completed && due.isBefore(now);
};

/**
 * 获取剩余时间字符串
 * @param dueDate 截止日期 ISO 字符串
 * @returns 剩余时间描述字符串
 */
export const getRemainingTime = (dueDate: string): string => {
  const due = dayjs(dueDate);
  const now = dayjs();

  if (due.isBefore(now)) {
    // 已过期
    const days = now.diff(due, "day");
    if (days === 0) return "已到期";

    if (days < 7) {
      return `${days}天前`;
    }
    return due.fromNow();
  }

  // 未到期
  if (due.diff(now, "minute") <= 5) {
    return "即将到期";
  }

  return due.fromNow();
};

/**
 * 格式化日期显示
 * @param date 日期 ISO 字符串
 * @param format 格式化模式，默认 YYYY-MM-DD HH:mm:ss
 * @returns 格式化后的日期字符串
 */
export const formatDate = (date: string, format: string = "YYYY-MM-DD HH:mm:ss"): string => {
  return dayjs(date).format(format);
};

/**
 * 格式化日期时间
 * @param isoString ISO 日期字符串
 * @returns 格式化后的日期时间字符串 YYYY-MM-DD HH:mm:ss
 */
export const formatDateTime = (isoString: string): string => {
  return dayjs(isoString).format("YYYY-MM-DD HH:mm:ss");
};

/**
 * 根据筛选条件过滤待办事项（带缓存）
 * @param todos 待办事项列表
 * @param filter 筛选条件
 * @returns 过滤后的待办事项列表
 */
export const filterTodosByDate = (
  todos: Array<{
    id: string;
    text: string;
    completed: boolean;
    createdAt: string;
    dueDate?: string;
  }>,
  filter: DateFilterType
): Array<{
  id: string;
  text: string;
  completed: boolean;
  createdAt: string;
  dueDate?: string;
}> => {
  // 检查并清除缓存
  checkAndClearCache();

  // 如果是 ALL 类型，直接返回副本（不需要缓存）
  if (filter === DateFilterType.ALL) {
    return [...todos];
  }

  // 生成缓存键
  const cacheKey = generateCacheKey(todos, filter);

  // 尝试从缓存获取
  const cached = todoCache.getFilter(cacheKey);
  if (cached) {
    return cached;
  }

  const today = dayjs().startOf('day');
  const tomorrow = today.add(1, 'day');

  const filtered = todos.filter(todo => {
    // 处理无截止日期的情况
    if (!todo.dueDate) {
      return filter === DateFilterType.NO_DATE;
    }

    const dueDate = dayjs(todo.dueDate);

    switch (filter) {
      case DateFilterType.TODAY:
        return dueDate.isSame(today, 'day') && !todo.completed;

      case DateFilterType.UPCOMING:
        return dueDate.isAfter(today) && dueDate.isBefore(tomorrow) && !todo.completed;

      case DateFilterType.OVERDUE:
        return dueDate.isBefore(today) && !todo.completed;

      case DateFilterType.NO_DATE:
        return !todo.dueDate;

      default:
        return true;
    }
  });

  // 缓存结果
  todoCache.setFilter(cacheKey, filtered);

  return filtered;
};

/**
 * 根据状态分类待办事项（带缓存）
 * @param todos 待办事项列表
 * @returns 按状态分类的待办事项对象
 */
export const getTodosByStatus = (
  todos: Array<{
    id: string;
    text: string;
    completed: boolean;
    createdAt: string;
    dueDate?: string;
  }>
) => {
  // 检查并清除缓存
  checkAndClearCache();

  // 生成缓存键
  const cacheKey = generateCacheKey(todos, 'status');

  // 尝试从缓存获取
  const cached = todoCache.getStatus(cacheKey);
  if (cached) {
    return cached;
  }

  const today = dayjs().startOf('day');
  const tomorrow = today.add(1, 'day');

  const result = todos.reduce((acc, todo) => {
    // 无截止日期的
    if (!todo.dueDate) {
      acc.noDate.push(todo);
      return acc;
    }

    const dueDate = dayjs(todo.dueDate);

    // 已完成的
    if (todo.completed) {
      acc.completed.push(todo);
      return acc;
    }

    // 已过期的
    if (dueDate.isBefore(today)) {
      acc.overdue.push(todo);
      return acc;
    }

    // 今日到期的
    if (dueDate.isSame(today, 'day')) {
      acc.today.push(todo);
      return acc;
    }

    // 即将到期的（未来1天内）
    if (dueDate.isAfter(today) && dueDate.isBefore(tomorrow)) {
      acc.upcoming.push(todo);
      return acc;
    }

    // 未来的
    acc.pending.push(todo);
    return acc;
  }, {
    pending: [] as typeof todos,
    today: [] as typeof todos,
    upcoming: [] as typeof todos,
    overdue: [] as typeof todos,
    noDate: [] as typeof todos,
    completed: [] as typeof todos,
  });

  // 缓存结果
  todoCache.setStatus(cacheKey, result);

  return result;
};

/**
 * 获取待办事项统计数据（带缓存）
 * @param todos 待办事项列表
 * @returns 统计数据对象
 */
export const getTodoStatistics = (
  todos: Array<{
    id: string;
    text: string;
    completed: boolean;
    createdAt: string;
    dueDate?: string;
  }>
) => {
  // 检查并清除缓存
  checkAndClearCache();

  // 生成缓存键
  const cacheKey = generateCacheKey(todos, 'stats');

  // 尝试从缓存获取
  const cached = todoCache.getStats(cacheKey);
  if (cached) {
    return cached;
  }

  const todosByStatus = getTodosByStatus(todos);

  const stats = {
    total: todos.length,
    pending: todosByStatus.pending.length,
    today: todosByStatus.today.length,
    upcoming: todosByStatus.upcoming.length,
    overdue: todosByStatus.overdue.length,
    noDate: todosByStatus.noDate.length,
    completed: todosByStatus.completed.length,
  };

  // 缓存结果
  todoCache.setStats(cacheKey, stats);

  return stats;
};

/**
 * 获取待办事项完成率（带缓存）
 * @param todos 待办事项列表
 * @returns 完成率（0-1之间的数值）
 */
export const getCompletionRate = (
  todos: Array<{
    id: string;
    text: string;
    completed: boolean;
    createdAt: string;
    dueDate?: string;
  }>
): number => {
  // 检查并清除缓存
  checkAndClearCache();

  // 生成缓存键
  const cacheKey = generateCacheKey(todos, 'completion');

  // 尝试从缓存获取
  const cached = todoCache.getCompletionRate(cacheKey);
  if (cached !== undefined) {
    return cached;
  }

  if (todos.length === 0) {
    todoCache.setCompletionRate(cacheKey, 0);
    return 0;
  }

  const completedCount = todos.filter(todo => todo.completed).length;
  const rate = completedCount / todos.length;

  // 缓存结果
  todoCache.setCompletionRate(cacheKey, rate);

  return rate;
};

/**
 * 获取待办事项平均剩余时间（仅针对未完成的）（带缓存）
 * @param todos 待办事项列表
 * @returns 平均剩余时间（小时），如果无有效数据返回 Infinity
 */
export const getAverageRemainingTime = (
  todos: Array<{
    id: string;
    text: string;
    completed: boolean;
    createdAt: string;
    dueDate?: string;
  }>
): number => {
  // 检查并清除缓存
  checkAndClearCache();

  // 生成缓存键
  const cacheKey = generateCacheKey(todos, 'avgTime');

  // 尝试从缓存获取
  const cached = todoCache.getAvgTime(cacheKey);
  if (cached !== undefined) {
    return cached;
  }

  const pendingTodos = todos.filter(todo => !todo.completed && todo.dueDate);

  if (pendingTodos.length === 0) {
    todoCache.setAvgTime(cacheKey, Infinity);
    return Infinity;
  }

  const now = dayjs();
  const totalHours = pendingTodos.reduce((sum, todo) => {
    const dueDate = dayjs(todo.dueDate);
    const hoursDiff = dueDate.diff(now, 'hour');
    return sum + Math.max(0, hoursDiff);
  }, 0);

  const avgTime = totalHours / pendingTodos.length;

  // 缓存结果
  todoCache.setAvgTime(cacheKey, avgTime);

  return avgTime;
};

/**
 * 手动清除缓存
 */
export const clearTodoCache = () => {
  todoCache.clear();
};

/**
 * 获取缓存统计信息
 */
export const getCacheStats = () => {
  return {
    filterCacheSize: todoCache.filterCache.size,
    statusCacheSize: todoCache.statusCache.size,
    statsCacheSize: todoCache.statsCache.size,
    completionRateCacheSize: todoCache.completionRateCache.size,
    avgTimeCacheSize: todoCache.avgTimeCache.size,
  };
};

