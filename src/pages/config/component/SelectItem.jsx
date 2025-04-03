import { Form, Input, Space, Radio, Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";

const SelectItem = (props) => {
  const { type, options, onChange } = props;

  return (
    <>
      {type === "select" && (
        <Form.Item
          label="选择类型"
          name={["componentProps", "mode"]}
          initialValue="radio"
        >
          <Radio.Group>
            <Radio value="radio">单选</Radio>
            <Radio value="multiple">多选</Radio>
          </Radio.Group>
        </Form.Item>
      )}
      <Form.Item key="options" label="可选项" required>
        <Form.List
          name={["componentProps", "options"]}
          rules={[
            {
              required: true,
              message: "请添加选项",
            },
          ]}
        >
          {(fields, { add, remove }, { errors }) => (
            <>
              {fields.map((item, index) => {
                return (
                  <Space key={index} style={{ marginBottom: 8 }}>
                    <Form.Item
                      // noStyle
                      style={{ marginBottom: 0 }}
                      name={[item.name, "label"]}
                      validateTrigger={["onChange", "onBlur"]}
                      rules={[
                        {
                          required: true,
                          whitespace: true,
                          message: "请输入标签",
                        },
                      ]}
                    >
                      <Input placeholder="选项标签" />
                    </Form.Item>
                    <Form.Item
                      // noStyle
                      style={{ marginBottom: 0 }}
                      name={[item.name, "value"]}
                      validateTrigger={["onChange", "onBlur"]}
                      rules={[
                        {
                          required: true,
                          whitespace: true,
                          message: "请输入值",
                        },
                      ]}
                    >
                      <Input placeholder="选项值" />
                    </Form.Item>
                    <Button
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
                onClick={() => add({ label: "", value: "" })}
                // onClick={addOption}
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
    </>
  );
};

export default SelectItem;
