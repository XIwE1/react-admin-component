import {
  Node,
  Extension,
  type CommandProps,
  type RawCommands,
} from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import CollapseComponent from "./CollapseComponent";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    insertCollapse: (text?: string) => ReturnType;
  }
}

export const Collapse = Node.create({
  name: "collapse",
  content: "text*",
  group: "block",
  parseHTML: () => [{ tag: "collapse" }],
  addCommands() {
    return {
      insertCollapse:
        (text: string) =>
        ({ commands }) =>
          commands.insertContent(`<collapse>${text}</collapse>`),
    } as Partial<RawCommands>;
  },
  addNodeView() {
    return ReactNodeViewRenderer(CollapseComponent);
  },
});

export const CollapseExtension = Extension.create({
  addKeyboardShortcuts() {
    return {
      "Mod-i": () => {
        return (this.editor.commands as any).insertCollapse("");
      },
    };
  },
});

// 示例

// renderHTML({ HTMLAttributes }) {
//   return (
//     <div {...HTMLAttributes}>
//       <p>这是您的自定义节点。这里是您的内容孔：</p>
//       <slot />
//     </div>
//   )
// }
// <slot /> 标签用于通过 JSX 定义 Prosemirror 的内容孔。这是您的可编辑内容将被渲染的位置。

// 设置 atom: true 的节点不可直接编辑，应视为一个单元
// 例如@ 但复制时会为空 可以用renderText来处理
// 用于将原子节点转换为纯文本
// renderText({ node }) {
//   return `@${node.attrs.id}`
// },


// Node.create({
//   // 必须有一个或多个块
//   content: 'block+',

//   // 必须有零个或多个块
//   content: 'block*',

//   // 允许所有类型的“内联”内容（文本或硬换行）
//   content: 'inline*',

//   // 不能有除“文本”之外的其他内容
//   content: 'text*',

//   // 可以有一个或多个段落，或列表（如果使用列表）
//   content: '(paragraph|list?)+',

//   // 必须在顶部有一个确切的标题，并在下面有一个或多个块
//   content: 'heading block+',

// // 添加到“block”组
// group: 'block',

// // 添加到“inline”组
// group: 'inline',

// // 添加到“block”和“list”组
// group: 'block list',
// })

// Node.create({
//   // 只允许“粗体”标记
//   marks: 'bold',

//   // 只允许“粗体”和“斜体”标记
//   marks: 'bold italic',

//   // 允许所有标记
//   marks: '_',

//   // 不允许所有标记
//   marks: '',
// })
