import { useState } from "react";
import Tiptap from "@/components/Tiptap";

const INIT_CONTENT = `
<p>Hello World!</p>
<img src="https://placehold.co/600x400" alt="image" />
`;

export default function Editor() {
  const [textContent, setTextContent] = useState(null);
  const [wordCount, setWordCount] = useState(0);
  // const [selection, setSelection] = useState(null);

  const handleChange = (editor) => {
    setTextContent(editor.getText());
    setWordCount(editor.getText().trim().length);
    // setSelection(editor.state.selection);
  };

  return (
    <div>
      <div className="p-4 max-h-[800px] border-1 border-gray-300">
        <Tiptap content={INIT_CONTENT} onChange={handleChange} />
      </div>
      <div className="mt-4 p-4 bg-gray-100">
        <p>当前字数: {wordCount}</p>
        <p>文本内容: {textContent}</p>
        {/* <p>当前选中: {selection}</p> */}
      </div>
    </div>
  );
}
