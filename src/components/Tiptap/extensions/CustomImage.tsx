import Image from "@tiptap/extension-image";
import React from "react";
import {
  NodeViewWrapper,
  ReactNodeViewRenderer,
  type NodeViewProps,
} from "@tiptap/react";
import {
  DEFAULT_LOADING_SRC,
  retryUploadImage,
  type IUploadApi,
} from "../utils/ImageUtils";
import { Button } from "antd";

export interface CustomImageOptions {
  uploadApi?: IUploadApi;
}

const UploadImageComponent = (props: NodeViewProps) => {
  const { node, selected, editor, extension } = props;
  const { src, uploadId, uploadStatus, alt, title } = node.attrs;
  const uploadApi = (extension.options as CustomImageOptions).uploadApi;

  const handleRetry = () => {
    if (!uploadApi) {
      console.warn("uploadApi is not configured");
      return;
    }
    retryUploadImage(editor, uploadId, uploadApi);
  };

  const renderImageContent = () => {
    const isUploading = !!uploadId && uploadStatus === "uploading";
    return (
      <img
        alt={alt || ""}
        title={title || ""}
        src={isUploading ? DEFAULT_LOADING_SRC : src}
        data-uploadId={uploadId}
        data-uploadStatus={uploadStatus}
        draggable="true"
        data-drag-handle
        className={
          selected
            ? "ProseMirror-selectednode position-relative"
            : "position-relative"
        }
      />
    );
  };

  return (
    <NodeViewWrapper>
      <div style={{ position: "relative", display: "inline-block" }}>
        {renderImageContent()}
        {uploadId && uploadStatus === "error" && (
          <div className="display-block absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
            <Button onClick={handleRetry} block>
              重试
            </Button>
          </div>
        )}
      </div>
    </NodeViewWrapper>
  );
};

export const CustomImage = Image.extend<CustomImageOptions>({
  addOptions() {
    return {
      ...this.parent?.(),
      uploadApi: undefined,
    };
  },

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
  // renderHTML({ HTMLAttributes }) {
  //   const { src, uploadId, uploadStatus } = HTMLAttributes;

  //   const isUploading =
  //     (!!uploadId && uploadStatus === "uploading") ||
  //     uploadStatus === "loading";
  //   const imageSrc = isUploading ? DEFAULT_LOADING_SRC : src;

  //   return [
  //     "img",
  //     {
  //       ...HTMLAttributes,
  //       src: imageSrc,
  //       draggable: "true",
  //     },
  //   ];
  // },

  addNodeView() {
    return ReactNodeViewRenderer(UploadImageComponent, {
      contentDOMElementTag: "img",
    });
  },
});
