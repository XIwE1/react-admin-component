import { Editor } from "@tiptap/react";
import { Button, Divider, Space } from "antd";
import React, { useCallback, useEffect, useState } from "react";
import {
  BoldOutlined,
  ItalicOutlined,
  StrikethroughOutlined,
  UnderlineOutlined,
} from "@ant-design/icons";

interface MenuBarProps {
  editor: Editor;
}

export default function MenuBar({ editor }: MenuBarProps) {
  const [count, setCount] = useState(0);

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

  const renderTextMarkItems = () => {
    const BoldComponent = BoldButton(editor);
    const ItalicComponent = ItalicButton(editor);
    const StrikeComponent = StrikeButton(editor);
    const UnderlineComponent = UnderlineButton(editor);

    return (
      <Space>
        {BoldComponent}
        {ItalicComponent}
        {StrikeComponent}
        {UnderlineComponent}
      </Space>
    );
  };

  const renderTitleItems = () => {
    const HeadLv1Component = HeadLv1Button(editor);
    const HeadLv2Component = HeadLv2Button(editor);
    const HeadLv3Component = HeadLv3Button(editor);

    return (
      <Space>
        {HeadLv1Component}
        {HeadLv2Component}
        {HeadLv3Component}
      </Space>
    );
  };

  return (
    <Space split={<Divider type="vertical" />}>
      {renderTextMarkItems()}
      {renderTitleItems()}
    </Space>
  );
}

// 文本样式
const BoldButton = (editor: Editor) => {
  const isActive = editor.isActive("bold");

  return (
    <Button
      type={isActive ? "primary" : "default"}
      icon={<BoldOutlined />}
      onClick={() => editor.chain().focus().toggleBold().run()}
      disabled={!editor.can().chain().focus().toggleBold().run()}
    />
  );
};

const ItalicButton = (editor: Editor) => {
  const isActive = editor.isActive("italic");
  return (
    <Button
      type={isActive ? "primary" : "default"}
      icon={<ItalicOutlined />}
      onClick={() => editor.chain().focus().toggleItalic().run()}
      disabled={!editor.can().chain().focus().toggleItalic().run()}
    />
  );
};

const StrikeButton = (editor: Editor) => {
  const isActive = editor.isActive("strike");
  return (
    <Button
      type={isActive ? "primary" : "default"}
      icon={<StrikethroughOutlined />}
      onClick={() => editor.chain().focus().toggleStrike().run()}
      disabled={!editor.can().chain().focus().toggleStrike().run()}
    />
  );
};

const UnderlineButton = (editor: Editor) => {
  const isActive = editor.isActive("underline");
  return (
    <Button
      type={isActive ? "primary" : "default"}
      icon={<UnderlineOutlined />}
      onClick={() => editor.chain().focus().toggleUnderline().run()}
      disabled={!editor.can().chain().focus().toggleUnderline().run()}
    />
  );
};
// 标题
const HeadLv1Button = (editor: Editor) => {
  const isActive = editor.isActive("heading", { level: 1 });
  return (
    <Button
      type={isActive ? "primary" : "default"}
      onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
      disabled={!editor.can().chain().focus().toggleHeading({ level: 2 }).run()}
    >
      H1
    </Button>
  );
};
const HeadLv2Button = (editor: Editor) => {
  const isActive = editor.isActive("heading", { level: 2 });
  return (
    <Button
      type={isActive ? "primary" : "default"}
      onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
      disabled={!editor.can().chain().focus().toggleHeading({ level: 2 }).run()}
    >
      H2
    </Button>
  );
};
const HeadLv3Button = (editor: Editor) => {
  const isActive = editor.isActive("heading", { level: 3 });
  return (
    <Button
      type={isActive ? "primary" : "default"}
      onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
      disabled={!editor.can().chain().focus().toggleHeading({ level: 3 }).run()}
    >
      H3
    </Button>
  );
};
