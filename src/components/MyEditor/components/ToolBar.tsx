import { Editor } from "@tiptap/react";
import { Button, Upload } from "antd";
import React from "react";
import { UploadOutlined } from "@ant-design/icons";
import { handleImageUpload, MyUploadApi } from "../utils/ImageUtils";

interface ToolBarProps {
  editor: Editor;
}

function sidebarBtnClass(active = false) {
  const base = [
    "!h-9 !w-full !rounded-md !border !px-3",
    "!text-[13px] !font-medium !shadow-sm",
    "!inline-flex !items-center !justify-center",
    "transition-all",
  ].join(" ");
  const state = active
    ? "!border-[#bfdbfe] !bg-[#eff6ff] !text-[#1d4ed8]"
    : "!border-neutral-200 !bg-white !text-neutral-700 hover:!border-neutral-300 hover:!bg-neutral-50 hover:!text-neutral-900";
  return [base, state].join(" ");
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
      className="block w-full [&_.ant-upload]:!block [&_.ant-upload]:!w-full"
      beforeUpload={(file) => handleImageUpload(editor, file, MyUploadApi)}
    >
      <Button
        block
        type="default"
        className={sidebarBtnClass()}
        icon={<UploadOutlined />}
      >
        上传图片
      </Button>
    </Upload>
  );
};

export default function ToolBar({ editor }: ToolBarProps) {
  return (
    <div className="flex w-full flex-col gap-1.5">
      <Button
        block
        type="default"
        className={sidebarBtnClass()}
        onClick={() => handleInsertCollapse(editor)}
      >
        插入折叠
      </Button>
      <Button
        block
        type="default"
        className={sidebarBtnClass()}
        onClick={() => handleInsertCodeBlock(editor)}
      >
        插入代码块
      </Button>
      <Button
        block
        type="default"
        className={sidebarBtnClass()}
        onClick={() => handleInserImage(editor)}
      >
        插入图片
      </Button>
      {renderUploadImage(editor)}
    </div>
  );
}
