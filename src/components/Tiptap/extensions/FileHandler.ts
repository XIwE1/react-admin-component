import React from "react";
import FileHandler from "@tiptap/extension-file-handler";

export const CustomFileHandler = FileHandler.configure({
  allowedMimeTypes: ["image/png", "image/jpeg", "image/gif", "image/webp"],
  onDrop: (editor, files, pos) => {
    files.forEach((file) => {
      const fileReader = new FileReader();

      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        editor
          .chain()
          .insertContentAt(pos, {
            type: "image",
            attrs: {
              src: fileReader.result,
            },
          })
          .focus()
          .run();
      };
    });
  },
  onPaste: (editor, files, htmlContent) => {
    files.forEach((file) => {
      if (htmlContent) {
        // 有htmlContent，停止手动插入，让其他扩展通过inputRule处理插入
        // 例如，可以从该url字符串中提取粘贴的文件并将其上传到服务器
        console.log(htmlContent); // eslint-disable-line no-console
        return false;
      }

      const fileReader = new FileReader();

      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        editor
          .chain()
          .insertContentAt(editor.state.selection.anchor, {
            type: "image",
            attrs: {
              src: fileReader.result,
            },
          })
          .focus()
          .run();
      };
    });
  },
});
