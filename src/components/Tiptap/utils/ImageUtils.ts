import { Editor } from "@tiptap/react";

const getRandomTime = () => 2000 * Math.random();
const getRandomStatus = () =>
  ["error", "success"][Math.floor(Math.random() * 2)];
const SUCCESS_URL =
  "https://img.tukuppt.com/png_preview/00/50/01/84qJlNNfgA.jpg!/fw/780";
const ERROR_URL = "https://pic.616pic.com/ys_img/00/58/28/A1lMAEemor.jpg";

// 通过 uploadId 找到对应 image 节点在文档中的位置（pos）
// 注意：pos 是 ProseMirror 的 position，可直接给 tr.setNodeMarkup(pos, ...)
export function findImagePosByUploadId(editor: Editor, uploadId: string) {
  if (!editor || !uploadId) return null;
  const { doc } = editor.state ?? {};
  if (!doc) return null;

  let foundPos: number | null = null;
  doc.descendants((node: any, pos: number) => {
    if (node?.type?.name === "image" && node?.attrs?.uploadId === uploadId) {
      foundPos = pos;
      return false; // 停止遍历
    }
    return true;
  });

  return foundPos;
}

// 生成唯一的上传ID
export function generateUploadId(): string {
  return `upload_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

// 更新图片节点状态
export function updateImageStatus(
  editor: Editor,
  uploadId: string,
  next: { status: string; src: string }
) {
  const pos = findImagePosByUploadId(editor, uploadId);
  if (pos == null) return false;

  const node = editor.state.doc.nodeAt(pos);
  if (!node) return false;

  const attrs = {
    ...node.attrs,
    src: next.src,
    uploadStatus: next.status,
  } ;

  editor.view.dispatch(editor.state.tr.setNodeMarkup(pos, undefined, attrs));
  return true;
}

// 图片上传
export async function handleImageUpload(file: File, uploadId: string) {
  const form = new FormData();
  form.append("file", file);
  // 假设这里上传文件到服务端
  await new Promise((resolve) => setTimeout(resolve, getRandomTime()));
  const status = getRandomStatus();

  return {
    status,
    uploadId,
    src: status === "success" ? SUCCESS_URL : ERROR_URL,
  };
}

// 默认加载图
export const DEFAULT_LOADING_SRC =
  "data:image/svg+xml;charset=utf-8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="240" height="140" viewBox="0 0 240 140">
      <rect width="240" height="140" fill="#f3f4f6"/>
      <g fill="none" stroke="#9ca3af" stroke-width="6" stroke-linecap="round">
        <path d="M120 48a22 22 0 1 0 0 44a22 22 0 1 0 0-44" opacity="0.35"/>
        <path d="M142 70a22 22 0 0 1-22 22">
          <animateTransform attributeName="transform" type="rotate" from="0 120 70" to="360 120 70" dur="1s" repeatCount="indefinite"/>
        </path>
      </g>
      <text x="120" y="118" text-anchor="middle" font-size="14" fill="#6b7280" font-family="Arial, sans-serif">Uploading…</text>
    </svg>`
  );
