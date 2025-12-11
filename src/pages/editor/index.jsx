import { useState } from "react";
import Tiptap from "@/components/Tiptap";

export default function Editor() {
  const [textContent, setTextContent] = useState(null);
  const [wordCount, setWordCount] = useState(0);

  const handleChange = (editor) => {
    console.log("editor", editor);
    setTextContent(editor.getText());
    setWordCount(editor.getText().trim().length);
  };

  return (
    <div>
      <div style={{ position: "relative", maxHeight: "800px", padding: "10px", border: "1px solid #ccc" }}>
        <Tiptap content="<p>Hello World!bbb</p>" onChange={handleChange} />
      </div>
      <div
        style={{ marginTop: "10px", padding: "10px", background: "#f5f5f5" }}
      >
        <p>当前字数: {wordCount}</p>
        <p>文本内容: {textContent}</p>
      </div>
    </div>
  );
}
