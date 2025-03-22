import { Modal } from "antd";

import DynamicForm from "@/components/DynamicForm";

const PreviewModal = (props) => {
  const { isOpen, config, onCancel } = props;
  console.log("config", config);

  return (
    <div className="config_item">
      <Modal
        title="表单预览"
        open={isOpen}
        onCancel={onCancel}
        destroyOnClose
        width={"80%"}
        footer={null}
      >
        <DynamicForm config={config} isPreview={true} />
      </Modal>
    </div>
  );
};

export default PreviewModal;
