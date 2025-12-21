import { Editor } from "@tiptap/react";

export interface IUploadApi {
  (file: File, id: string): Promise<{ status: string; uploadId: string; src: string }>;
}

type UploadResult = ReturnType<IUploadApi>;

// 图片与id的map，用于记录和重试，todo：增删改为函数式
const ImageMap: Map<string, File> = new Map();

const getRandomTime = () => 2000 * Math.random();
const getRandomStatus = () =>
  ["error", "success"][Math.floor(Math.random() * 2)];
const SUCCESS_URL =
  "https://img.tukuppt.com/png_preview/00/50/01/84qJlNNfgA.jpg!/fw/780";
const ERROR_URL = "https://pic.616pic.com/ys_img/00/58/28/A1lMAEemor.jpg";

export async function MyUploadApi(file: File, id: string) {
  // 假设这里获取了token
  // const token = window.localStorage.getItem("user-token");

  // 假设这里上传文件到服务端
  await new Promise((resolve) => setTimeout(resolve, getRandomTime()));
  const status = getRandomStatus();
  return { status, uploadId: id, src: status === "success" ? SUCCESS_URL : ERROR_URL };
}

// 通过 uploadId 找到对应 image 节点在文档中的位置（pos）
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
  };

  editor.view.dispatch(editor.state.tr.setNodeMarkup(pos, undefined, attrs));
  return true;
}

// 图片上传
export async function UploadImageToServer(
  file: File,
  uploadId: string,
  uploadApi: IUploadApi
) {
  const form = new FormData();
  form.append("file", file);
  const res = await uploadApi(file, uploadId);
  if (res.status === "success") ImageMap.delete(uploadId);

  return {
    status: res.status,
    uploadId: res.uploadId,
    // 假设服务器返回的src正常，这里先用本地的预设内容
    src: res.status === "success" ? res.src : ERROR_URL,
  };
}

// 插入上传中的图片节点
export function insertUploadingImage(
  editor: Editor,
  uploadId: string,
  pos?: number
) {
  const insertPos = pos ?? editor.state.selection.anchor;
  editor
    .chain()
    .insertContentAt(insertPos, {
      type: "image",
      attrs: {
        src: DEFAULT_LOADING_SRC,
        uploadStatus: "uploading",
        uploadId,
      },
    })
    .focus()
    .run();
}

// 通用的图片上传函数
export function handleImageUpload(
  editor: Editor,
  files: File | File[] | FileList,
  uploadApi: IUploadApi,
  pos?: number
) {
  if (!editor) return;

  const fileArray = Array.isArray(files)
    ? files
    : files instanceof FileList
    ? Array.from(files)
    : [files];

  fileArray.forEach((file) => {
    console.log("file", file);
    if (!file.type.startsWith("image/")) return;
    const uploadId = generateUploadId();
    ImageMap.set(uploadId, file);
    insertUploadingImage(editor, uploadId, pos);
    UploadImageToServer(file, uploadId, uploadApi).then(({ status, src }) => {
      updateImageStatus(editor, uploadId, { status, src });
    });
  });
}

// 重新上传图片
export async function retryUploadImage(
  editor: Editor,
  uploadId: string,
  uploadApi: IUploadApi
) {
  if (!editor || !uploadId) return false;

  const file = ImageMap.get(uploadId);
  if (!file) {
    console.warn(`File not found for uploadId: ${uploadId}`);
    return false;
  }

  updateImageStatus(editor, uploadId, {
    status: "uploading",
    src: DEFAULT_LOADING_SRC,
  });

  // 重新上传
  try {
    const { status, src } = await UploadImageToServer(file, uploadId, uploadApi);
    updateImageStatus(editor, uploadId, { status, src });
    return true;
  } catch (error) {
    console.error("Retry upload failed:", error);
    updateImageStatus(editor, uploadId, {
      status: "error",
      src: ERROR_URL,
    });
    return false;
  }
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
