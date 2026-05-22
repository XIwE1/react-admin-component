import { useState } from "react";
import MyEditor from "@/components/MyEditor";

const INIT_CONTENT = `
<p>Hello World!</p>
<img src="https://placehold.co/600x400" alt="image" />
<img src="https://placehold.co/400x800" alt="image" />
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
      <div className="px-4 pt-1 max-h-[800px]">
        <MyEditor content={INIT_CONTENT} onChange={handleChange} />
      </div>
      
      {/* 编辑器信息 */}
      <div className="mt-4 p-4 bg-gray-100">
        <p>当前字数: {wordCount}</p>
        <p>文本内容: {textContent}</p>
        {/* <p>当前选中: {selection}</p> */}
      </div>
    </div>
  );
}
