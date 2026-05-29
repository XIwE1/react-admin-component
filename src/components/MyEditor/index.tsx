import React from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { all, createLowlight } from "lowlight";
import { Mention } from "@tiptap/extension-mention";
// import DragHandle from "@tiptap/extension-drag-handle-react";
import { DragExtension } from "./extensions/DragHandle";

// 自定义的工具栏 菜单栏 样式
import { Collapse, CollapseExtension } from "./Collapse";
import { SelectAllExtension } from "./extensions/SelectAllExtension";
import { CustomFileHandler } from "./extensions/FileHandler";
import MenuBar from "./components/MenuBar";
import ToolBar from "./components/ToolBar";
import BlockTitle from "@/components/BlockTitle";
import "./index.scss";
import { CustomImage } from "./extensions/CustomImage";
import { MyUploadApi } from "./utils/ImageUtils";

export default function MyEditor({ content, onChange }) {
  const lowlight = createLowlight(all);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Collapse,
      CollapseExtension,
      CodeBlockLowlight.configure({
        lowlight,
      }),
      SelectAllExtension,
      DragExtension.configure({
        render() {
          const el = document.createElement("div");
          el.classList.add("custom-drag-handle");
          return el;
        },
      }),
      Mention.configure({
        HTMLAttributes: {
          class: "mention",
        },
        suggestion: {
          char: "@",
        },
      }),
      CustomImage.configure({
        uploadApi: MyUploadApi,
        resize: {
          enabled: true,
          alwaysPreserveAspectRatio: true,
        },
      }),
      CustomFileHandler,
    ],
    content,
    // 传递一个扩展或扩展名称的数组
    // 以仅允许特定输入、粘贴规则,默认不传 = 全部
    // enableInputRules: [Link, "horizontalRule"],
    // enablePasteRules: [Link, 'horizontalRule'],
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
        class:
          "tiptap min-h-full px-2 py-1 text-[15px] leading-[1.75] text-neutral-800 outline-none focus:outline-none sm:px-4",
      },
    },
  });

  return (
    <div className="my-editor flex h-full min-h-0 w-full overflow-hidden rounded-lg border border-neutral-200 bg-neutral-100">
      <aside className="flex w-[172px] shrink-0 flex-col gap-2.5 overflow-y-auto border-r border-neutral-200 bg-[#fafafa] px-2.5 py-3">
        <BlockTitle title="Tiptap" />
        <ToolBar editor={editor} />
      </aside>

      <div className="flex min-h-0 min-w-0 flex-1 flex-col bg-white">
        <MenuBar editor={editor} />
        <div className="relative min-h-0 flex-1 overflow-y-auto">
          <div className="h-full w-full max-w-4xl px-8 py-4">
            {/* <DragHandle
          editor={editor}
          nested={{
            edgeDetection: 'none',
          }}
        >
          <div className="custom-drag-handle" />
        </DragHandle> */}
            <EditorContent editor={editor} />
          </div>
        </div>
      </div>
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
