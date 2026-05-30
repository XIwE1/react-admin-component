# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

这是一个基于 React 18 + Vite + TypeScript 的后台管理系统组件库，包含多个独立的功能模块演示。项目使用 Ant Design 作为 UI 框架，Zustand 进行状态管理。样式多使用 TailwindCSS

## 常用命令

```bash
pnpm dev          # 启动开发服务器 (127.0.0.1，自动打开浏览器)
pnpm build        # 构建生产版本
pnpm lint         # 运行 ESLint 检查
pnpm preview      # 预览构建结果
```

## 架构概览

### 目录结构

```
src/
├── components/       # 可复用组件
│   ├── Form/         # 动态表单组件 (基于 Ant Design Form)
│   ├── DynamicForm/  # 动态表单容器，封装 IForm
│   ├── Tiptap/       # 富文本编辑器 (基于 TipTap)
│   ├── BusinessTable/# 业务表格组件
│   └── DndWrapper/   # 拖拽排序封装 (基于 @dnd-kit)
├── pages/            # 页面模块
│   ├── config/       # 表单配置器页面
│   ├── editor/       # 富文本编辑器演示
│   ├── api/          # HTTP 调试工具 & 用户列表演示
│   ├── todo/         # 待办事项列表
├── store/            # Zustand 状态管理
├── api/              # HTTP 客户端 (axios 封装)
├── hooks/            # 自定义 Hooks
├── constants/        # 常量配置 (表单规则、预设等)
├── locales/          # 国际化文件 (zh-CN, en-US)
└── layout/           # 页面布局组件
```

### 状态管理

项目使用 Zustand，主要 Store:

- `configStore`: 表单配置管理，支持本地持久化
- `formDataStore`: 表单数据存储

### 国际化

使用 `i18next` + `react-i18next`，支持中文 (默认) 和英文。命名空间包括 `common` 和 `editor`。

## 路径别名

配置在 `vite.config.js`:

```javascript
resolve: {
  alias: { "@": path.resolve(__dirname, "./src") },
  extensions: [".ts", ".tsx", ".js", ".jsx"],
}
```

使用示例: `import { xxx } from "@/components/Form"`

## Karpathy Guidelines

Behavioral guidelines to reduce common LLM coding mistakes, derived from [Andrej Karpathy's observations](https://x.com/karpathy/status/2015883857489522876) on LLM coding pitfalls.

**Tradeoff:** These guidelines bias toward caution over speed. For trivial tasks, use judgment.

## 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:
- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

## 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

## 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:
- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it - don't delete it.

When your changes create orphans:
- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.

## 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:
- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:
```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

## 测试

框架：Jest + React 测试库
配置：（jest.config.ts）
设置文件：（jest.setup.ts导入@testing-library/jest-dom）
测试文件位置：与源文件位于同一目录
测试文件命名：*.test.ts或*.test.tsx

## 工作流
当涉及到需求、开发、修复、测试等操作时，严格按照以下工作流执行程序:
@.claude/workflows/orchestrator.md