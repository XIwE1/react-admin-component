import { Editor } from "@tiptap/react";
import { Button, Space } from "antd";
import React from "react";

interface ToolBarProps {
  editor: Editor;
}

const handleInsertCollapse = (editor: Editor) => {
  if (!editor) return;
  editor.chain().insertCollapse("test").run();
};

const handleInsertCodeBlock = (editor: Editor) => {
  if (!editor) return;
  editor
    .chain()
    .insertContent("\n")
    .setCodeBlock()
    .insertContent("const a = 1;")
    .run();
};

const handleInserImage = (editor: Editor) => {
  if (!editor) return;
  const url = window.prompt("URL");

  if (url) {
    editor.chain().focus().setImage({ src: url }).run();
  }
};

export default function ToolBar({ editor }: ToolBarProps) {
  return (
    <Space>
      <Button onClick={() => handleInsertCollapse(editor)}>插入折叠</Button>
      <Button onClick={() => handleInsertCodeBlock(editor)}>插入代码块</Button>
      <Button onClick={() => handleInserImage(editor)}>插入图片</Button>
    </Space>
  );
}
