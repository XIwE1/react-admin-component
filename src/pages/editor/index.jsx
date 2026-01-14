import { useState } from "react";
import Tiptap from "@/components/Tiptap";
import NumberScroll from "../../components/NumberScroll";
import { Button, Space } from "antd";

const INIT_CONTENT = `
<p>Hello World!</p>
<img src="https://placehold.co/600x400" alt="image" />
<img src="https://placehold.co/400x800" alt="image" />
`;

export default function MyEditor() {
  const [textContent, setTextContent] = useState(null);
  const [wordCount, setWordCount] = useState(0);
  const [numberValue, setNumberValue] = useState(100);
  // const [selection, setSelection] = useState(null);

  const handleChange = (editor) => {
    setTextContent(editor.getText());
    setWordCount(editor.getText().trim().length);
    // setSelection(editor.state.selection);
  };

  return (
    <div>
      <div className="my-4 p-4 border-1 border-gray-300">
        <Space>
          <div>{numberValue}</div>
          <NumberScroll value={numberValue} options={{ decimals: 2 }} className="justify-center self-center" />
          <Space direction="vertical">
            <Button onClick={() => setNumberValue(numberValue + 10)}>
              +10
            </Button>
            <Button onClick={() => setNumberValue(numberValue - 10)}>
              -10
            </Button>
          </Space>
        </Space>
      </div>
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
