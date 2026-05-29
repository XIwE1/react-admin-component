import { useState } from "react";
import MyEditor from "@/components/MyEditor";
import BlockTitle from "@/components/BlockTitle";
import NumberScroll from "@/components/NumberScroll";

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

  const handleChange = (editor) => {
    setTextContent(editor.getText());
    setWordCount(editor.getText().trim().length);
  };

  return (
    <div className="flex h-full min-h-0 w-full flex-col gap-4">
      <div className="shrink-0 flex flex-col gap-1">
        <BlockTitle title={"TipTap"} />
      </div>

      <div className="min-h-0 flex-1">
        <MyEditor content={INIT_CONTENT} onChange={handleChange} />
      </div>
      <BlockTitle title={"统计"} />

      <aside className="shrink-0 grid gap-4 rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm sm:grid-cols-[auto_1fr] sm:items-start sm:gap-6 sm:p-5">
        <div className="flex flex-col gap-1 border-slate-200 sm:border-r sm:pr-6">
          <NumberScroll value={wordCount} options={{ decimals: 0 }}  />
          <span className="text-sm text-slate-500">字符</span>
        </div>
        <div className="min-w-0">
          <span className="mb-2 block text-xs font-medium uppercase tracking-wide text-slate-400">
            文本内容
          </span>
          <pre className="max-h-40 overflow-auto rounded-lg border border-slate-200/80 bg-slate-50 p-3 text-xs leading-relaxed text-slate-600 whitespace-pre-wrap break-words">
            {textContent}
          </pre>
        </div>
      </aside>
    </div>
  );
}
