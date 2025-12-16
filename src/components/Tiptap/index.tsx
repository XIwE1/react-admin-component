import React, { useEffect } from "react";
import { Space } from "antd";
// tiptap扩展
import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Collapse, CollapseExtension } from "./Collapse";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { all, createLowlight } from "lowlight";
import { SelectAllExtension } from "./extensions/SelectAllExtension";
import Image from '@tiptap/extension-image';

// 自定义的工具栏 菜单栏 样式
import MenuBar from "./components/MenuBar";
import ToolBar from "./components/ToolBar";
import "./index.scss";

export default function Tiptap({ content, onChange }) {

  const lowlight = createLowlight(all);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // undoRedo: false,
        // codeBlock: false,
        // code: false,
        heading: { levels: [1, 2, 3] },
      }),
      Collapse,
      CollapseExtension,
      CodeBlockLowlight.configure({
        lowlight,
      }),
      // TaskList,
      // TaskItem,
      SelectAllExtension,
      Image
    ],
    // editable: true,
    // autofocus: true,
    content,
    // 传递一个扩展或扩展名称的数组
    // 以仅允许特定输入、粘贴规则,默认不传 = 全部
    // enableInputRules: [Link, "horizontalRule"],
    // enablePasteRules: [Link, 'horizontalRule'],
    onCreate(props) {
      onChange?.(editor);
    },
    onUpdate(props) {
      // editor.setEditable 会触发 onUpdate
      // 调用外部 onChange 回调
      onChange?.(editor);
    },
    editorProps: {
      attributes: {
        class: "p-4 border-1 border-gray-200",
      },
    },
  });

  return (
    <div style={{ position: "relative", maxHeight: "100%", overflow: "auto" }}>
      <Space>
        <MenuBar editor={editor} />
        <ToolBar editor={editor} />
      </Space>
      <EditorContent editor={editor} className="my-4" />
    </div>
  );
}

// 示例
// 或者 editor.on("xxx", ({ editor }) => {})
// 亦或者写到Extension中，Extension.create，作为插件引入
// onBeforeCreate({ editor }) {
//   // 在视图创建之前。
// },
// onCreate({ editor }) {
//   // 编辑器已准备好。
// },
// onUpdate({ editor }) {
//   // 内容已改变。
// },
// onSelectionUpdate({ editor }) {
//   // 选择已改变。
// },
// onTransaction({ editor, transaction }) {
//   // 编辑器状态已改变。
// },
// onFocus({ editor, event }) {
//   // 编辑器获得了焦点。
// },
// onBlur({ editor, event }) {
//   // 编辑器不再获得焦点。
// },
// onDestroy() {
//   // 编辑器正在被销毁。
// },
// onPaste(event: ClipboardEvent, slice: Slice) {
//   // 内容正在被粘贴到编辑器中。
// },
// onDrop(event: DragEvent, slice: Slice, moved: boolean) {
//   // 内容正在被拖放到编辑器中。
// },
// onDelete({ type, deletedRange, newRange, partial, node, mark, from, to, newFrom, newTo }) {
//   // 内容已从编辑器中删除（节点或标记）。
// },
// onContentError({ editor, error, disableCollaboration }) {
//   // 编辑器内容与模式不匹配。
// },
