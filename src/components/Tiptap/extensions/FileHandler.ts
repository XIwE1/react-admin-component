import FileHandler from "@tiptap/extension-file-handler";
import { handleImageUpload, MyUploadApi } from "../utils/ImageUtils";

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

    handleImageUpload(editor, files, MyUploadApi);
  },
});
