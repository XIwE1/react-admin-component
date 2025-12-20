import Image from "@tiptap/extension-image";
import React, { Suspense } from "react";
import {
  NodeViewWrapper,
  ReactNodeViewRenderer,
  type NodeViewProps,
} from "@tiptap/react";
import { DEFAULT_LOADING_SRC } from "../utils/ImageUtils";

const UploadImageComponent = (props: NodeViewProps) => {
  const { node, updateAttributes } = props;
  const { src, uploadId, uploadStatus } = node.attrs;

  const renderImageContent = () => {
    const isUploading =
      (!!uploadId && uploadStatus === "uploading") ||
      uploadStatus === "loading";
    return (
      <img
        src={isUploading ? DEFAULT_LOADING_SRC : src}
        data-uploadId={uploadId}
        data-uploadStatus={uploadStatus}
      />
    );
  };

  return (
    <NodeViewWrapper>
      <Suspense fallback={<div>Loading...</div>}>
        {renderImageContent()}
      </Suspense>
    </NodeViewWrapper>
  );
};

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
  addNodeView() {
    return ReactNodeViewRenderer(UploadImageComponent);
  },
});
