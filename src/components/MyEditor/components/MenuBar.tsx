import { Editor } from "@tiptap/react";
import { Button, Divider } from "antd";
import React, { useEffect, useState } from "react";
import {
  BoldOutlined,
  ItalicOutlined,
  StrikethroughOutlined,
  UnderlineOutlined,
} from "@ant-design/icons";

interface MenuBarProps {
  editor: Editor;
}

function formatToolbarBtnClass(active = false) {
  const base =
    "!h-8 !min-w-8 !border !px-2 !text-[13px] !shadow-none transition-colors";
  const state = active
    ? "!border-neutral-400 !bg-neutral-400 !text-neutral-800"
    : "!border-transparent !bg-neutral-100 !text-neutral-600 hover:!bg-neutral-200/70 hover:!text-neutral-500";
  return [base, state].join(" ");
}

export default function MenuBar({ editor }: MenuBarProps) {
  const [, setCount] = useState(0);

  useEffect(() => {
    if (!editor) return;

    const update = () => setCount((prev) => prev + 1);

    editor.on("selectionUpdate", update);
    editor.on("transaction", update);
    editor.on("update", update);

    return () => {
      editor.off("selectionUpdate", update);
      editor.off("transaction", update);
      editor.off("update", update);
    };
  }, [editor]);

  return (
    <div className="flex shrink-0 flex-wrap items-center gap-2 border-b border-neutral-200/80 bg-neutral-50 px-4 py-2">
      <span className="text-[11px] font-bold text-neutral-600">样式</span>
      <div className="flex gap-1">
        <BoldButton editor={editor} />
        <ItalicButton editor={editor} />
        <StrikeButton editor={editor} />
        <UnderlineButton editor={editor} />
      </div>
      <Divider type="vertical" className="mx-0 h-5 border-neutral-200" />
      <span className="text-[11px] font-bold text-neutral-600">标题</span>
      <div className="flex gap-1">
        <HeadLv1Button editor={editor} />
        <HeadLv2Button editor={editor} />
        <HeadLv3Button editor={editor} />
      </div>
    </div>
  );
}

const BoldButton = ({ editor }: { editor: Editor }) => {
  const isActive = editor.isActive("bold");
  return (
    <Button
      type="default"
      className={formatToolbarBtnClass(isActive)}
      icon={<BoldOutlined />}
      onClick={() => editor.chain().focus().toggleBold().run()}
      disabled={!editor.can().chain().focus().toggleBold().run()}
    />
  );
};

const ItalicButton = ({ editor }: { editor: Editor }) => {
  const isActive = editor.isActive("italic");
  return (
    <Button
      type="default"
      className={formatToolbarBtnClass(isActive)}
      icon={<ItalicOutlined />}
      onClick={() => editor.chain().focus().toggleItalic().run()}
      disabled={!editor.can().chain().focus().toggleItalic().run()}
    />
  );
};

const StrikeButton = ({ editor }: { editor: Editor }) => {
  const isActive = editor.isActive("strike");
  return (
    <Button
      type="default"
      className={formatToolbarBtnClass(isActive)}
      icon={<StrikethroughOutlined />}
      onClick={() => editor.chain().focus().toggleStrike().run()}
      disabled={!editor.can().chain().focus().toggleStrike().run()}
    />
  );
};

const UnderlineButton = ({ editor }: { editor: Editor }) => {
  const isActive = editor.isActive("underline");
  return (
    <Button
      type="default"
      className={formatToolbarBtnClass(isActive)}
      icon={<UnderlineOutlined />}
      onClick={() => editor.chain().focus().toggleUnderline().run()}
      disabled={!editor.can().chain().focus().toggleUnderline().run()}
    />
  );
};

const HeadLv1Button = ({ editor }: { editor: Editor }) => {
  const isActive = editor.isActive("heading", { level: 1 });
  return (
    <Button
      type="default"
      className={formatToolbarBtnClass(isActive)}
      onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
      disabled={!editor.can().chain().focus().toggleHeading({ level: 1 }).run()}
    >
      H1
    </Button>
  );
};

const HeadLv2Button = ({ editor }: { editor: Editor }) => {
  const isActive = editor.isActive("heading", { level: 2 });
  return (
    <Button
      type="default"
      className={formatToolbarBtnClass(isActive)}
      onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
      disabled={!editor.can().chain().focus().toggleHeading({ level: 2 }).run()}
    >
      H2
    </Button>
  );
};

const HeadLv3Button = ({ editor }: { editor: Editor }) => {
  const isActive = editor.isActive("heading", { level: 3 });
  return (
    <Button
      type="default"
      className={formatToolbarBtnClass(isActive)}
      onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
      disabled={!editor.can().chain().focus().toggleHeading({ level: 3 }).run()}
    >
      H3
    </Button>
  );
};
