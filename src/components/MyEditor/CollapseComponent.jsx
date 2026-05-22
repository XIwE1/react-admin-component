import { Collapse } from "antd";
import { NodeViewContent, NodeViewWrapper } from "@tiptap/react";

export default function TiptapCollapseComponent() {
  return (
    <NodeViewWrapper>
      <Collapse>
        <Collapse.Panel header="This is panel header">
          <NodeViewContent />
        </Collapse.Panel>
      </Collapse>
    </NodeViewWrapper>
  );
}
