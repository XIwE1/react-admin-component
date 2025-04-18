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
    const { type = "input", defaultValue, reactions } = fieldItem;
    const effects = reactions?.filter((r) => r.target) || [];
    const dependencies = reactions?.filter((r) => !r.target) || [];
    const clone = {
      ...fieldItem,
      type,
      effects,
      dependencies,
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
    const fieldsValue = formInstance.getFieldsValue();
    const { effects, dependencies } = fieldsValue;
    const reactions = [...effects, ...dependencies];
    onSubmit?.({ ...cloneItem, ...fieldsValue, reactions });
  };

  // 根据isActive 生成不同的item模板
  const getReactionItemModel = (isActive) => {
    const model = {
      isActive,
      whenTarget: isActive ? fieldItem.field_key : null,
      whenState: "",
      whenValue: "",
      effectTarget: isActive ? null : fieldItem.field_key,
      effectState: "",
      effectValue: "",
    };
    return model;
  };

  const handleCancel = () => {
    onCancel?.();
    setTimeout(() => {
      formInstance.resetFields();
    }, 160);
  };

  const renderReactionFields = (instance, isActive) => {
    if (!instance) return null;
    const list_name = isActive ? "effects" : "dependencies";
    return (
      <Form.Item key={list_name} required>
        <Form.List name={list_name}>
          {(_fields, { add, remove }, { errors }) => (
            <>
              {_fields.map((item, index) => {
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
                      type={fieldItem.type}
                      fieldItem={item}
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
                onClick={() => add(getReactionItemModel(isActive))}
              >
                添加
              </Button>
              {errors.length > 0 && (
                <div style={{ color: "red" }}>{errors}</div>
              )}
            </>
          )}
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
        <Form
          form={formInstance}
          labelCol={{ span: 4 }}
          onValuesChange={(changesValue, allValues) => {
            console.log("changesValue", changesValue);
            console.log("allValues", allValues);
          }}
        >
          <BlockTitle title={"主动影响"} />

          {renderReactionFields(formInstance, true)}

          <BlockTitle title={"被动依赖"} />

          {renderReactionFields(formInstance, false)}
        </Form>
      </div>
    </Modal>
  );
};

export default ReactionItemModal;
