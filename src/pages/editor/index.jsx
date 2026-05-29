import { useState } from "react";
import { Button, Space } from "antd";
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

const debugBtnClass =
  "!h-8 !min-w-8 !w-full !justify-start !border !px-2 !text-[13px] !shadow-none transition-colors !border-neutral-200 !bg-white !text-neutral-600 hover:!border-neutral-300 hover:!bg-neutral-50 hover:!text-neutral-800";
const wrapperClass =
  "overflow-hidden rounded-lg border border-neutral-200 bg-[#fafafa] p-3 sm:w-64";
export default function Editor() {
  const [editor, setEditor] = useState(null);
  const [wordCount, setWordCount] = useState(0);

  const handleChange = (ed) => {
    setEditor(ed);
    setWordCount(ed.getText().trim().length);
  };

  return (
    <div className="flex h-full min-h-0 w-full flex-col gap-3">
      <div className="flex min-h-0 flex-1 gap-3">
        <div className="min-h-0 min-w-0 flex-1">
          <MyEditor content={INIT_CONTENT} onChange={handleChange} />
        </div>

        <Space direction="vertical">
          <div className={wrapperClass}>
            <BlockTitle title="统计" />
            <Space>
              <NumberScroll value={wordCount} options={{ decimals: 0 }} />
              <span className="text-xs text-neutral-500">字符</span>
            </Space>
          </div>

          <div className={wrapperClass}>
            <BlockTitle title="调试" />
            {editor ? (
              <div className="flex flex-col gap-1">
                <Button
                  type="default"
                  className={debugBtnClass}
                  onClick={() => editor.commands.clearContent()}
                >
                  清空内容
                </Button>
                <Button
                  type="default"
                  className={debugBtnClass}
                  onClick={() => console.log(editor.getJSON())}
                >
                  打印 JSON
                </Button>
                <Button
                  type="default"
                  className={debugBtnClass}
                  onClick={() => console.log(editor.getHTML())}
                >
                  打印 HTML
                </Button>
              </div>
            ) : null}
          </div>
        </Space>
      </div>
    </div>
  );
}
