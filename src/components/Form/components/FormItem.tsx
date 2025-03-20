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
} from "antd";
import { InboxOutlined } from "@ant-design/icons";

const FormItem = (props: FormSchemaItem) => {
  const { field_key, field, extra, rules, tooltip, hidden, defaultValue } =
    props;

  const componentMap = {
    input: renderInputComponent,
    password: renderInputComponent,
    textarea: renderInputComponent,
    number: renderInputComponent,
    select: renderSelectComponent,
    cascader: renderSelectComponent,
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
  function renderDateComponent(type: string) {
    if (type === "date") {
      return <DatePicker />;
    } else if (type === "range") {
      return <DatePicker.RangePicker />;
    }
  }
  function renderCheckComponent() {
    return <Checkbox />;
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
      rules={rules}
      tooltip={tooltip}
      hidden={hidden}
      initialValue={defaultValue}
    >
      {renderFieldComponent(props)}
    </Form.Item>
  );
};

export default FormItem;
