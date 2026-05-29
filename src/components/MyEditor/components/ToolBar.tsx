import { Editor } from "@tiptap/react";
import { Button, Upload } from "antd";
import React from "react";
import { UploadOutlined } from "@ant-design/icons";
import { handleImageUpload, MyUploadApi } from "../utils/ImageUtils";

interface ToolBarProps {
  editor: Editor;
}

function toolbarBtnClass(active = false, fullWidth = false) {
  const base =
    "!h-8 !min-w-8 !border !px-2 !text-[13px] !shadow-none transition-colors";
  const width = fullWidth ? "!w-full !justify-start" : "";
  const state = active
    ? "!border-[#bfdbfe] !bg-[#eff6ff] !text-[#1d4ed8]"
    : "!border-neutral-200 !bg-white !text-neutral-600 hover:!border-neutral-300 hover:!bg-neutral-50 hover:!text-neutral-800";
  return [base, width, state].filter(Boolean).join(" ");
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

const renderUploadImage = (editor: Editor) => {
  return (
    <Upload
      showUploadList={false}
      multiple
      accept="image/*"
      beforeUpload={(file) => handleImageUpload(editor, file, MyUploadApi)}
    >
      <Button
        type="default"
        className={toolbarBtnClass(false, true)}
        icon={<UploadOutlined />}
      >
        上传图片
      </Button>
    </Upload>
  );
};

export default function ToolBar({ editor }: ToolBarProps) {
  return (
    <div className="flex flex-col gap-1">
      <Button
        type="default"
        className={toolbarBtnClass(false, true)}
        onClick={() => handleInsertCollapse(editor)}
      >
        插入折叠
      </Button>
      <Button
        type="default"
        className={toolbarBtnClass(false, true)}
        onClick={() => handleInsertCodeBlock(editor)}
      >
        插入代码块
      </Button>
      <Button
        type="default"
        className={toolbarBtnClass(false, true)}
        onClick={() => handleInserImage(editor)}
      >
        插入图片
      </Button>
      {renderUploadImage(editor)}
    </div>
  );
}
