import { useState } from "react";
import MyEditor from "@/components/MyEditor";

const INIT_CONTENT = `
<p>Hello World!</p>
<h1>Best Practices</h1>
<p>Following established best practices ensures your code remains maintainable and scalable.</p>
<p>Always write code as if the person who ends up maintaining it is a violent psychopath who knows where you live.</p>
<p>Before diving into the technical details, it's important to understand the foundational concepts that make modern web development possible.</p>
<p>"The best code is no code at all. Every new line of code you willingly bring into the world is code that has to be debugged, code that has to be read and understood." - Jeff Atwood</p>
<p>This philosophy guides much of modern development practices, emphasizing simplicity and maintainability over complexity.</p>
<ul>
        <li>HTML5 and semantic markup</li>
        <li>CSS3 with modern layout techniques
          <ul>
            <li>Flexbox for one-dimensional layouts</li>
            <li>Grid for two-dimensional layouts</li>
            <li>Custom properties (CSS variables)</li>
          </ul>
        </li>
        <li>JavaScript (ES6+)</li>
        <li>TypeScript for type safety</li>
      </ul>
<h1>Code Organization</h1>
<p>A well-organized codebase is crucial for long-term project success. Consider these principles:</p>
<ul>
    <li>Separation of concerns</li>
    <li>DRY (Don't Repeat Yourself)</li>
    <li>KISS (Keep It Simple, Stupid)</li>
</ul>

<p>By following these guidelines, you'll create applications that are easier to maintain, test, and extend over time.</p>
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
