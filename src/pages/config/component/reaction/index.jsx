import { Modal, Form, Space, Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useCallback, useEffect, useState } from "react";

import BlockTitle from "@/components/BlockTitle";
import ReactionItem from "./ReactionItem";

import { FORM_ITEM_TYPES } from "@/components/Form/Form.types.js";
import { formatValueByType } from "@/utils";

const ReactionItemModal = (props) => {
  const { onSubmit, isOpen, onCancel, fields, fieldItem } = props;

  const [cloneItem, setCloneItem] = useState({});

  const [formInstance] = Form.useForm();

  useEffect(() => {
    if (!fieldItem) {
      setCloneItem({});
      return;
    }
    const { type = "input", defaultValue } = fieldItem;
    const clone = {
      ...fieldItem,
      defaultValue: formatValueByType(type, defaultValue),
    };
    setCloneItem(clone);
  }, [fieldItem]);

  useEffect(() => {
    formInstance.setFieldsValue(cloneItem);
  }, [cloneItem]);

  const computedTitle = (fieldItem) => {
    const name = fieldItem ? "- " + fieldItem.field : "";
    return `编辑 - 配置项 ${name}`;
  };

  const beforeSubmit = async (formInstance) => {
    return await formInstance.validateFields();
  };

  const handleSubmit = async () => {
    const isValid = await beforeSubmit(formInstance);
    if (!isValid) return;
    // 提交前对数据进行格式化，例如Date -> String
    const fieldsValue = formInstance.getFieldsValue();
    onSubmit?.({ ...cloneItem, ...fieldsValue });
  };

  const handleCancel = () => {
    onCancel?.();
    setTimeout(() => {
      formInstance.resetFields();
    }, 160);
  };

  const renderReactionFields = (formInstance, isActive) => {
    if (!formInstance) return null;
    const reactions = formInstance.getFieldValue("reactions");
    return (
      <Form.Item key="options" required>
        <Form.List name={"reactions"} >
          {(_fields, { add, remove }, { errors }) => {
            
            return (
              <>
                {_fields.map((item, index) => {
                  // 排除不符合当前目标的reaction项
                  const source = formInstance.getFieldValue(["reactions", index]);
                  const isActiveItem = source?.target || source?.isActive;
                  if (isActiveItem !== isActive) return null;

                  return (
                    <Space
                      key={index}
                      style={{
                        marginBottom: 8,
                        width: "100%",
                        justifyContent: "space-around",
                      }}
                    >
                      <ReactionItem
                        fields={fields}
                        fieldItem={fieldItem}
                        isActive={isActive}
                      />
                      <Button
                        size="small"
                        type="link"
                        danger
                        onClick={() => remove(item.name)}
                      >
                        删除
                      </Button>
                    </Space>
                  );
                })}
                <Button
                  block
                  type="dashed"
                  icon={<PlusOutlined />}
                  onClick={() => add({ isActive })}
                >
                  添加
                </Button>
                {errors.length > 0 && (
                  <div style={{ color: "red" }}>{errors}</div>
                )}
              </>
            );
          }}
        </Form.List>
      </Form.Item>
    );
  };
  return (
    <Modal
      open={isOpen}
      onOk={handleSubmit}
      onCancel={handleCancel}
      title={computedTitle(fieldItem)}
      destroyOnClose
      zIndex={999}
    >
      <div className="modal_content">
        <Form form={formInstance} labelCol={{ span: 4 }}>
          <BlockTitle title={"主动影响"} />

          {renderReactionFields(formInstance, true)}

          <BlockTitle title={"被动依赖"} />

          {renderReactionFields(formInstance, false)}

          {/* <Form.Item key="reactions" label="关联字段"></Form.Item> */}
        </Form>
      </div>
    </Modal>
  );
};

export default ReactionItemModal;
