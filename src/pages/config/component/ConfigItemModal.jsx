import { Modal, Form, Input, Select, Switch, Space } from "antd";
import { useEffect, useState } from "react";

import "./ConfigItemModal.css";

const ConfigItemModal = (props) => {
  const { onSubmit, isOpen, onCancel, fieldItem } = props;

  const [cloneItem, setCloneItem] = useState({});
  const [formInstance] = Form.useForm();

  useEffect(() => {
    const clone = {
      ...fieldItem,
    };
    setCloneItem(clone);
  }, [fieldItem]);

  useEffect(() => {
    formInstance.setFieldsValue(cloneItem);
  }, [cloneItem]);

  const computedTitle = (fieldItem) => {
    const edit = fieldItem ? "编辑 - " : "新增 - ";
    const name = fieldItem ? "- " + fieldItem.field : "";
    return `${edit} 配置项 ${name}`;
  };

  const beforeSubmit = async (formInstance) => {
    console.log("formInstance", formInstance.getFieldsValue());

    return await formInstance.validateFields();
  };

  const handleSubmit = async () => {
    const isValid = await beforeSubmit(formInstance);
    if (!isValid) return;
    onSubmit?.({ ...cloneItem, ...formInstance.getFieldsValue() });
  };

  const handleCancel = () => {
    onCancel?.();
    setTimeout(() => {
      formInstance.resetFields();
    }, 160);
  };

  return (
    <Modal
      open={isOpen}
      onOk={handleSubmit}
      onCancel={handleCancel}
      title={computedTitle(fieldItem)}
    >
      <div className="modal_content">
        <Form form={formInstance} labelCol={{ span: 4 }}>
          <Form.Item
            key="key"
            name="key"
            label="key"
            rules={[{ required: true, message: "key不能为空" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            key="field"
            name="field"
            label="字段"
            rules={[{ required: true, message: "字段不能为空" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            key="type"
            name="type"
            label="类型"
            rules={[{ required: true, message: "请选择类型" }]}
          >
            <Select />
          </Form.Item>
          <Form.Item key="defaultValue" name="defaultValue" label="默认值">
            <Input />
          </Form.Item>
          <Form.Item label="状态" style={{ marginBottom: 0 }}>
            <Space size={30}>
              <Form.Item
                key="disabled"
                name="disabled"
                getValueProps={(value) => ({ checked: !value })}
                getValueFromEvent={(checked) => !checked}
              >
                <Switch checkedChildren="可编辑" unCheckedChildren="不可编辑" />
              </Form.Item>
              <Form.Item
                key="hidden"
                name="hidden"
                getValueProps={(value) => ({ checked: !value })}
                getValueFromEvent={(checked) => !checked}
              >
                <Switch checkedChildren="显示" unCheckedChildren="隐藏" />
              </Form.Item>
            </Space>
          </Form.Item>
          <Form.Item key="reactions" label="关联字段"></Form.Item>
        </Form>
      </div>
    </Modal>
  );
};

export default ConfigItemModal;
