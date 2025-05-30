import React from "react";
import { FormSchemaItem } from "../Form.types";
import {
  Cascader,
  Checkbox,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Select,
  Switch,
  Radio,
  Upload,
  Button,
} from "antd";
import { InboxOutlined, PlusOutlined } from "@ant-design/icons";
import { transformRules } from "@/utils/rules";

export interface FormItemProps extends FormSchemaItem {
  isPreview?: boolean;
}
const FormItem = (props: FormItemProps) => {
  const {
    field_key,
    field,
    extra,
    rules,
    tooltip,
    hidden,
    defaultValue,
    required,
    isPreview,
  } = props;

  const itemRules = transformRules(rules || []);

  const componentMap = {
    input: renderInputComponent,
    password: renderInputComponent,
    textarea: renderInputComponent,
    number: renderInputComponent,
    select: renderSelectComponent,
    cascader: renderSelectComponent,
    dynamic: renderDynamicComponent,
    checkbox: renderCheckComponent,
    radio: renderRadioComponent,
    date: renderDateComponent,
    range: renderDateComponent,
    switch: renderSwitchComponent,
    upload: renderUploadComponent,
    custom: renderCustomComponent,
  };

  const renderFieldComponent = (schemaItem: FormSchemaItem) => {
    const { type, customRender, componentProps, reactions, disabled } =
      schemaItem;
    const renderFunction = componentMap[type] || renderEmpty;
    const Component = renderFunction(type) || <></>;
    return React.cloneElement(Component, {
      disabled,
      ...componentProps,
    });
  };

  function renderInputComponent(type: string) {
    if (type === "input") {
      return <Input />;
    } else if (type === "number") {
      return <InputNumber />;
    } else if (type === "password") {
      return <Input.Password />;
    } else if (type === "textarea") {
      return <Input.TextArea />;
    }
  }
  function renderSelectComponent(type: string) {
    if (type === "select") {
      return <Select showSearch />;
    } else if (type === "cascader") {
      return <Cascader />;
    }
  }
  function renderDynamicComponent() {
    return (
      <Form.List name={field_key}>
        {(fields, { add, remove }, { errors }) => (
          <>
            {fields.map((item, index) => {
              return (
                <div key={index} style={{ display: "flex", marginBottom: 8 }}>
                  <Form.Item
                    name={[item.name]}
                    style={{ marginBottom: 0, padding: 0, flex: 1 }}
                    validateTrigger={["onChange", "onBlur"]}
                    rules={[
                      {
                        required: true,
                        whitespace: true,
                        message: "请输入内容或删除该项",
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                  <Button type="link" danger onClick={() => remove(item.name)}>
                    删除
                  </Button>
                </div>
              );
            })}
            <Button
              block
              type="dashed"
              icon={<PlusOutlined />}
              onClick={() => add()}
            >
              添加
            </Button>
            {errors.length > 0 && <div style={{ color: "red" }}>{errors}</div>}
          </>
        )}
      </Form.List>
    );
  }
  function renderDateComponent(type: string) {
    if (type === "date") {
      return <DatePicker />;
    } else if (type === "range") {
      return <DatePicker.RangePicker />;
    }
  }
  function renderCheckComponent() {
    return <Checkbox.Group />;
  }
  function renderRadioComponent() {
    return <Radio.Group />;
  }
  function renderSwitchComponent() {
    return <Switch />;
  }
  function renderUploadComponent() {
    return (
      <Upload.Dragger name="files" action="/upload.do">
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">
          Click or drag file to this area to upload
        </p>
        <p className="ant-upload-hint">Support for a single or bulk upload.</p>
      </Upload.Dragger>
    );
  }
  function renderCustomComponent(customRender: FormSchemaItem["customRender"]) {
    return <>renderCustomComponent</>;
  }
  function renderEmpty() {
    return <></>;
  }

  return (
    <Form.Item
      extra={extra}
      key={field_key}
      name={field_key}
      label={field}
      rules={[{ required }, ...itemRules]}
      tooltip={tooltip}
      hidden={hidden}
      // required={required}
      initialValue={defaultValue}
    >
      {renderFieldComponent(props)}
    </Form.Item>
  );
};

export default FormItem;
