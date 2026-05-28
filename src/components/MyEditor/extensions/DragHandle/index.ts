import { Extension } from "@tiptap/core";
import { type Editor } from '@tiptap/core'
import { DragHandlePlugin } from "./plugin";
import type { Node } from '@tiptap/pm/model'

interface DraghandleProps {
  // 控制手柄渲染
  render(): HTMLElement
  // 锁定手柄位置与状态
  locked?: boolean
  // 是否支持嵌套
  nested?: boolean
  // hover节点变化时回调
  onNodeChange?: (options: { editor: Editor, node: Node | null }) => void
  onElementDragEnd?: (e: DragEvent) => void
  onElementDragStart?: (e: DragEvent) => void 
}

export const DragExtension = Extension.create<DraghandleProps>({
  name: "DragHandle",

  // 用户可配置的选项
  addOptions() {
    return {
      render: () => {
        const element = document.createElement('div')
        element.classList.add('drag-handle')
        return element
      },
      locked: false,
      nested: true,
      onNodeChange: () => null,
      onElementDragStart: undefined,
      onElementDragEnd: undefined,
    };
  },
  // 用户可以执行的命令
  addCommands() {
    return {};
  },
  // 定义正则表达式以监听用户输入
  addInputRules() {
    return [];
  },
  // 向扩展添加 ProseMirror 插件
  addProseMirrorPlugins() {
    const handleElement = this.options.render()

    return [DragHandlePlugin({
      pluginKey: this.name,
      handleElement: handleElement,
      editor: this.editor,
      nested: this.options.nested,
      onNodeChange: this.options.onNodeChange,
      onElementDragStart: this.options.onElementDragStart,
      onElementDragEnd: this.options.onElementDragEnd
    })];
  },
  // 向扩展添加更多扩展
  addExtensions() {
    // 例如创建一组属于同一类别的扩展
    return []
  },
  // 事件监听
  onBeforeCreate() {
    // 编辑器创建之前
  },
  onCreate() {
    // 编辑器创建完成
  },
  onUpdate() {
    // 内容更新
  },
  onSelectionUpdate({ editor }) {
    // 选区更新
  },
  onTransaction({ transaction }) {
    // 编辑器状态更新
  },
  onFocus({ event }) {
    // 编辑器聚焦
  },
  onBlur({ event }) {
    // 编辑器失焦
  },
  onDestroy() {
    // 编辑器销毁
  },
});
