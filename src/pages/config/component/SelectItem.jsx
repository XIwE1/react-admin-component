import { Form, Input, Space, Radio, Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";

const SelectItem = (props) => {
  const { multiple = false, options, onChange } = props;

  const [cloneOptions, setCloneOptions] = useState([]);

  useEffect(() => {
    setCloneOptions(options);
  }, [options]);

  //   useEffect(() => {
  //     onChange?.("options", cloneOptions);
  //     // onChange?.({ cloneOptions, selectType, ...changedValue });
  //   }, [cloneOptions]);

  // 选项变化处理
  const triggerChange = (changedValue) => {
    console.log("changedValue", changedValue);
    
    onChange?.("options", changedValue);
  };

  // 添加选项
  const addOption = () => {
    const newOptions = [...cloneOptions, { label: "", value: "" }];
    setCloneOptions(newOptions);
    triggerChange(newOptions);
  };

  // 删除选项
  const removeOption = (index) => {
    const newOptions = cloneOptions.filter((_, i) => i !== index);
    setCloneOptions(newOptions);
    triggerChange(newOptions);
  };

  // 修改选项内容
  const handleOptionChange = (index, key, val) => {
    const newOptions = cloneOptions.map((item, i) =>
      i === index ? { ...item, [key]: val } : item
    );
    setCloneOptions(newOptions);
    triggerChange(newOptions);
  };

  return (
    <>
      <Form.Item
        label="选择类型"
        name={["componentProps", "selectType"]}
        initialValue="radio"
      >
        <Radio.Group>
          <Radio value="radio">单选</Radio>
          <Radio value="checkbox">多选</Radio>
        </Radio.Group>
      </Form.Item>
      <Form.Item
        key="options"
        label="可选项"
        required
        rules={[{ required: true, message: "请添加选项" }]}
      >
        {cloneOptions.map((item, index) => {
          return (
            <Space key={index} style={{ marginBottom: 8 }}>
              <Input
                placeholder="选项标签"
                value={item.label}
                onChange={(e) =>
                  handleOptionChange(index, "label", e.target.value)
                }
              />
              <Input
                placeholder="选项值"
                value={item.value}
                onChange={(e) =>
                  handleOptionChange(index, "value", e.target.value)
                }
              />
              <Button type="link" danger onClick={() => removeOption(index)}>
                删除
              </Button>
            </Space>
          );
        })}
        <Button block type="dashed" icon={<PlusOutlined />} onClick={addOption}>
          添加
        </Button>
      </Form.Item>
    </>
  );
};

export default SelectItem;
