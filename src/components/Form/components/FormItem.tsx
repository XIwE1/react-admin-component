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
} from "antd";
import Radio from "antd/es/radio/radio";

const FormItem = (props: FormSchemaItem) => {
  const { key, label, extra, rules, tooltip, hidden } = props;

  const renderFieldComponent = (options: FormSchemaItem) => {
    const { type, customRender, componentProps, reactions } = options;
    const renderFunction = componentMap[type] || renderEmpty;
    const component = renderFunction();
    return component;
  };

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
    custom: renderCustomComponent,
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
      return <Select />;
    } else if (type === "cascader") {
      return <Cascader />;
    }
  }
  function renderDateComponent() {
    return <DatePicker />;
  }
  function renderCheckComponent() {
    return <Checkbox />;
  }
  function renderRadioComponent() {
    return <Radio />;
  }
  function renderSwitchComponent() {
    return <Switch />;
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
      key={key}
      name={key}
      label={label}
      rules={rules}
      tooltip={tooltip}
      hidden={hidden}
    >
      {renderFieldComponent(props)}
    </Form.Item>
  );
};

export default FormItem;
