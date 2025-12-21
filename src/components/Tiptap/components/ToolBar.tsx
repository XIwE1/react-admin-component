import { Editor } from "@tiptap/react";
import { Button, Space, Upload } from "antd";
import React from "react";
import { UploadOutlined } from "@ant-design/icons";
import { handleImageUpload, MyUploadApi } from "../utils/ImageUtils";
import type { UploadProps } from "antd";

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

const handleClearContent = (editor: Editor) => {
  if (!editor) return;
  editor.commands.clearContent();
};

const renderUploadImage = (editor: Editor) => {
  return (
    <Upload
      showUploadList={false}
      multiple
      accept="image/*"
      beforeUpload={(file) => handleImageUpload(editor, file, MyUploadApi)}
    >
      <Button icon={<UploadOutlined />}>上传图片</Button>
    </Upload>
  );
};

export default function ToolBar({ editor }: ToolBarProps) {
  return (
    <Space>
      <Button onClick={() => handleInsertCollapse(editor)}>插入折叠</Button>
      <Button onClick={() => handleInsertCodeBlock(editor)}>插入代码块</Button>
      <Button onClick={() => handleInserImage(editor)}>插入图片</Button>
      {renderUploadImage(editor)}
      <Button onClick={() => handleClearContent(editor)}>清空内容</Button>
    </Space>
  );
}
