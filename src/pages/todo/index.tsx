import React, { useState, useMemo } from "react";
import { Input, Checkbox, Button, Empty, Popconfirm, message, DatePicker, Progress, Card, Row, Col, Statistic } from "antd";
import { DeleteOutlined, EditOutlined, CheckOutlined, CloseOutlined, ClockCircleOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { useTodoStore, TodoItem } from "@/store/todoStore";
import { useFilteredTodos } from "@/store/todoStore";
import {
  getRemainingTime,
  isOverdue,
  formatDateTime,
  getTodoStatistics,
  getCompletionRate,
  getTodosByStatus,
  DateFilterType
} from "./utils";
import FilterButtonGroup from "./FilterButtonGroup";

const TodoList = () => {
  const { todos, addTodo, toggleTodo, deleteTodo, editTodo, clearCompleted, setDueDate, setFilter, filter } = useTodoStore();
  const filteredTodos = useFilteredTodos();
  const [inputValue, setInputValue] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [dateEditingId, setDateEditingId] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs | null>(null);

  // 计算统计数据
  const stats = useMemo(() => {
    if (filter === 'all') {
      return getTodoStatistics(todos);
    } else {
      return getTodoStatistics(filteredTodos);
    }
  }, [todos, filteredTodos, filter]);

  // 计算完成率
  const completionRate = useMemo(() => {
    if (filter === 'all') {
      return getCompletionRate(todos);
    } else {
      return getCompletionRate(filteredTodos);
    }
  }, [todos, filteredTodos, filter]);

  // 计算各状态数量
  const statusCounts = useMemo(() => {
    if (filter === 'all') {
      return getTodosByStatus(todos);
    } else {
      return getTodosByStatus(filteredTodos);
    }
  }, [todos, filteredTodos, filter]);

  const remaining = filteredTodos.filter((t) => !t.completed).length;

  // 状态显示配置
  const statusConfigs = [
    { key: 'today', label: '今日', color: '#1890ff', icon: '📅' },
    { key: 'upcoming', label: '即将到期', color: '#52c41a', icon: '🔮' },
    { key: 'overdue', label: '已过期', color: '#f5222d', icon: '⚠️' },
    { key: 'pending', label: '待处理', color: '#722ed1', icon: '⏰' },
    { key: 'noDate', label: '无截止日期', color: '#faad14', icon: '📌' },
    { key: 'completed', label: '已完成', color: '#13c2c2', icon: '✅' },
  ];

  const handleAdd = () => {
    const trimmed = inputValue.trim();
    if (!trimmed) {
      message.warning("请输入待办事项");
      return;
    }
    const dueDate = selectedDate ? selectedDate.toISOString() : undefined;
    addTodo(trimmed, dueDate);
    setInputValue("");
    setSelectedDate(null);
    message.success("添加成功");
  };

  const handleEdit = (todo: TodoItem) => {
    setEditingId(todo.id);
    setEditText(todo.text);
  };

  const handleSaveEdit = (id: string) => {
    const trimmed = editText.trim();
    if (!trimmed) {
      message.warning("待办事项不能为空");
      return;
    }
    editTodo(id, trimmed);
    setEditingId(null);
    setEditText("");
    message.success("修改成功");
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditText("");
  };

  const handleClearCompleted = () => {
    const completedCount = todos.filter((t) => t.completed).length;
    if (completedCount === 0) {
      message.info("没有已完成的待办事项");
      return;
    }
    clearCompleted();
    message.success(`已清除 ${completedCount} 条已完成项`);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">待办事项</h1>

      {/* 输入区域 */}
      <div className="flex gap-2 mb-6">
        <Input
          placeholder="输入待办事项..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onPressEnter={handleAdd}
          className="flex-1"
        />
        <DatePicker
          showTime
          placeholder="选择截止日期"
          value={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          format="YYYY-MM-DD HH:mm"
        />
        <Button type="primary" onClick={handleAdd}>
          添加
        </Button>
      </div>

      {/* 筛选器 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* 筛选按钮组 */}
        <div className="lg:col-span-2">
          <FilterButtonGroup />
        </div>

        {/* 统计信息卡片 */}
        <Card
          className="shadow-sm border"
          styles={{ body: { padding: '16px' } }}
        >
          <div className="text-center">
            <div className="text-lg font-semibold mb-3">完成进度</div>
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-500">完成率</span>
                <span className="text-sm font-medium">
                  {Math.round(completionRate * 100)}%
                </span>
              </div>
              <Progress
                percent={Math.round(completionRate * 100)}
                strokeColor={{
                  '0%': '#108ee9',
                  '100%': '#87d068',
                }}
                trailColor="#f0f0f0"
                strokeWidth={8}
                showInfo={false}
                className="mb-2"
              />
              <div className="text-xs text-gray-500">
                {stats.completed} / {stats.total} 已完成
              </div>
            </div>

            {/* 总览统计 */}
            <Row gutter={[8, 8]} className="mt-4">
              <Col xs={12} sm={8} md={6}>
                <Statistic
                  title="总项"
                  value={stats.total}
                  valueStyle={{ color: '#1890ff' }}
                  prefix="📋"
                />
              </Col>
              <Col xs={12} sm={8} md={6}>
                <Statistic
                  title="待完成"
                  value={remaining}
                  valueStyle={{ color: '#fa8c16' }}
                  prefix="⏳"
                />
              </Col>
              <Col xs={12} sm={8} md={6}>
                <Statistic
                  title="今日"
                  value={stats.today}
                  valueStyle={{ color: '#52c41a' }}
                  prefix="📅"
                />
              </Col>
              <Col xs={12} sm={8} md={6}>
                <Statistic
                  title="已过期"
                  value={stats.overdue}
                  valueStyle={{ color: '#f5222d' }}
                  prefix="⚠️"
                />
              </Col>
            </Row>
          </div>
        </Card>
      </div>

      {/* 详细状态统计 */}
      <Card
        className="mb-6 shadow-sm border hover:shadow-md transition-shadow duration-300"
        title="状态分布"
        styles={{ body: { padding: '16px' } }}
      >
        <Row gutter={[16, 16]}>
          {statusConfigs.map((config) => (
            <Col
              xs={6}
              sm={4}
              md={2}
              lg={2}
              key={config.key}
              className="flex justify-center"
            >
              <div
                className="text-center cursor-pointer hover:scale-110 transition-all duration-300 animate-pulse-once"
                style={{ color: config.color }}
                onClick={() => {
                  // 点击状态统计可以快速筛选到对应状态
                  if (config.key === 'completed') {
                    // 已完成的不需要筛选，因为已经完成了
                    return;
                  }
                  // 设置筛选条件
                  setFilter(config.key as 'all' | 'today' | 'upcoming' | 'overdue' | 'no-date');
                }}
              >
                <div className="text-2xl mb-1">{config.icon}</div>
                <div className="text-sm font-medium">{config.label}</div>
                <div className="text-xs font-bold mt-1 animate-count-up">
                  {statusCounts[config.key as keyof typeof statusCounts]?.length || 0}
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </Card>

      {/* 筛选结果统计 */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100 transition-all duration-500 hover:shadow-md">
        <div className="text-sm text-gray-600">
          <span className="font-medium">筛选结果：</span>
          <span className="text-gray-900 font-semibold animate-fade-in">{filteredTodos.length}</span> 项
        </div>
        <div className="text-sm text-gray-600">
          <span className="font-medium">待完成：</span>
          <span className="text-gray-900 font-semibold animate-fade-in">{remaining}</span> 项
        </div>
        <div className="text-sm text-gray-600">
          <span className="font-medium">显示：</span>
          <span className="text-gray-900 font-semibold animate-fade-in">{filteredTodos.length}/{stats.total}</span> 项
        </div>
        <Popconfirm
          title="确定清除所有已完成的待办事项吗？"
          onConfirm={handleClearCompleted}
          okText="确定"
          cancelText="取消"
        >
          <Button size="small" danger className="hover:scale-105 transition-transform duration-200">
            清除已完成
          </Button>
        </Popconfirm>
      </div>

      {/* 列表区域 */}
      {filteredTodos.length === 0 ? (
        <Empty description="暂无待办事项" />
      ) : (
        <div className="space-y-2">
          {filteredTodos.map((todo) => (
            <div
              key={todo.id}
              className={`flex items-center gap-3 p-3 rounded border ${
                todo.completed ? "bg-gray-50" : "bg-white"
              }`}
            >
              <Checkbox
                checked={todo.completed}
                onChange={() => toggleTodo(todo.id)}
              />

              {editingId === todo.id ? (
                <div className="flex-1 flex gap-2">
                  <Input
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    onPressEnter={() => handleSaveEdit(todo.id)}
                    className="flex-1"
                  />
                  <Button
                    type="text"
                    icon={<CheckOutlined />}
                    onClick={() => handleSaveEdit(todo.id)}
                  />
                  <Button
                    type="text"
                    icon={<CloseOutlined />}
                    onClick={handleCancelEdit}
                  />
                </div>
              ) : (
                <>
                  <div className="flex-1 flex flex-col gap-1">
                    <span
                      className={`${
                        todo.completed ? "line-through text-gray-400" : ""
                      } ${todo.dueDate ? (isOverdue(todo.dueDate, todo.completed) ? "text-red-500" : "") : ""}`}
                    >
                      {todo.text}
                    </span>
                    {todo.dueDate && (
                      <div className="text-xs text-gray-500 flex items-center gap-1">
                        <ClockCircleOutlined />
                        <span>
                          {getRemainingTime(todo.dueDate)} (目标: {formatDateTime(todo.dueDate)})
                        </span>
                      </div>
                    )}
                  </div>
                  <Button
                    type="text"
                    icon={<EditOutlined />}
                    onClick={() => handleEdit(todo)}
                    disabled={todo.completed}
                  />
                  {dateEditingId === todo.id ? (
                    <DatePicker
                      showTime
                      value={todo.dueDate ? dayjs(todo.dueDate) : null}
                      onChange={(date) => {
                        setDueDate(todo.id, date ? date.toISOString() : null);
                        setDateEditingId(null);
                      }}
                      onBlur={() => setDateEditingId(null)}
                      open
                      format="YYYY-MM-DD HH:mm"
                    />
                  ) : (
                    <Button
                      type="text"
                      icon={<ClockCircleOutlined />}
                      onClick={() => setDateEditingId(todo.id)}
                      disabled={todo.completed}
                    />
                  )}
                  <Popconfirm
                    title="确定删除此待办事项吗？"
                    onConfirm={() => {
                      deleteTodo(todo.id);
                      message.success("删除成功");
                    }}
                    okText="确定"
                    cancelText="取消"
                  >
                    <Button type="text" danger icon={<DeleteOutlined />} />
                  </Popconfirm>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TodoList;
