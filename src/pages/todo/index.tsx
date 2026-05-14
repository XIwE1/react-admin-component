import React, { useState } from "react";
import { Input, Checkbox, Button, Empty, Popconfirm, message, DatePicker } from "antd";
import { DeleteOutlined, EditOutlined, CheckOutlined, CloseOutlined, ClockCircleOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { useTodoStore, TodoItem } from "@/store/todoStore";
import { getRemainingTime, isOverdue, formatDateTime } from "./utils";

const TodoList = () => {
  const { todos, addTodo, toggleTodo, deleteTodo, editTodo, clearCompleted, setDueDate } = useTodoStore();
  const [inputValue, setInputValue] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [dateEditingId, setDateEditingId] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs | null>(null);

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

  const remaining = todos.filter((t) => !t.completed).length;

  return (
    <div className="p-6 max-w-2xl mx-auto">
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

      {/* 统计信息 */}
      <div className="flex justify-between items-center mb-4 text-gray-500">
        <span>{remaining} 项待完成</span>
        <Popconfirm
          title="确定清除所有已完成的待办事项吗？"
          onConfirm={handleClearCompleted}
          okText="确定"
          cancelText="取消"
        >
          <Button size="small" danger>
            清除已完成
          </Button>
        </Popconfirm>
      </div>

      {/* 列表区域 */}
      {todos.length === 0 ? (
        <Empty description="暂无待办事项" />
      ) : (
        <div className="space-y-2">
          {todos.map((todo) => (
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
