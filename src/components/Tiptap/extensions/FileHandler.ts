import FileHandler from "@tiptap/extension-file-handler";
import {
  generateUploadId,
  handleImageUpload,
  updateImageStatus,
} from "../utils/ImageUtils";
import { DEFAULT_LOADING_SRC } from "../utils/ImageUtils";
import { Editor } from "@tiptap/react";

function insertUploadingImage(editor: Editor, pos: number, uploadId: string) {
  editor
    .chain()
    .insertContentAt(pos, {
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

export const CustomFileHandler = FileHandler.configure({
  allowedMimeTypes: ["image/png", "image/jpeg", "image/gif", "image/webp"],
  onDrop: (editor, files, pos) => {},
  onPaste: (editor, files, htmlContent) => {
    console.log("onPaste", files, htmlContent);
    if (htmlContent) {
      // 有htmlContent，停止手动插入，让其他扩展通过inputRule处理插入
      // 例如，可以从该url字符串中提取粘贴的文件并将其上传到服务器
      console.log(htmlContent); // eslint-disable-line no-console
      return false;
    }

    files.forEach((file) => {
      const uploadId = generateUploadId();
      insertUploadingImage(editor, editor.state.selection.anchor, uploadId);
      handleImageUpload(file, uploadId).then(({ status, src }) => {
        updateImageStatus(editor, uploadId, { status, src });
      });
    });
  },
});
