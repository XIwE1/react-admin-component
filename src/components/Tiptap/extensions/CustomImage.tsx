import Image from "@tiptap/extension-image";
import React, { Suspense } from "react";
import {
  NodeViewWrapper,
  ReactNodeViewRenderer,
  type NodeViewProps,
} from "@tiptap/react";
import { DEFAULT_LOADING_SRC } from "../utils/ImageUtils";

// const UploadImageComponent = (props: NodeViewProps) => {
//   const { node, selected } = props;
//   const { src, uploadId, uploadStatus, alt, title } = node.attrs;

//   const renderImageContent = () => {
//     const isUploading =
//       (!!uploadId && uploadStatus === "uploading") ||
//       uploadStatus === "loading";
//     return (
//       <img
//         alt={alt || ""}
//         title={title || ""}
//         src={isUploading ? DEFAULT_LOADING_SRC : src}
//         data-uploadId={uploadId}
//         data-uploadStatus={uploadStatus}
//         draggable="true"
//         data-drag-handle
//         className={selected ? "ProseMirror-selectednode" : ""}
//       />
//     );
//   };

//   return <NodeViewWrapper>{renderImageContent()}</NodeViewWrapper>;
// };

export const CustomImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      uploadStatus: {
        default: null,
        parseHTML: (element) => element.getAttribute("data-uploadStatus"),
        renderHTML: (attributes) => {
          if (!attributes.uploadStatus) return {};
          return { "data-uploadStatus": attributes.uploadStatus };
        },
      },
      uploadId: {
        default: null,
        parseHTML: (element) => element.getAttribute("data-upload-id"),
        renderHTML: (attributes) => {
          if (!attributes.uploadId) return {};
          return { "data-upload-id": attributes.uploadId };
        },
      },
    };
  },
  renderHTML({ HTMLAttributes }) {
    const { src, uploadId, uploadStatus } = HTMLAttributes;

    const isUploading =
      (!!uploadId && uploadStatus === "uploading") ||
      uploadStatus === "loading";
    const imageSrc = isUploading ? DEFAULT_LOADING_SRC : src;

    return [
      "img",
      {
        ...HTMLAttributes,
        src: imageSrc,
        draggable: "true",
      },
    ];
  },

  // addNodeView() {
  //   return ReactNodeViewRenderer(UploadImageComponent, {
  //     contentDOMElementTag: "img",
  //   });
  // },
});
