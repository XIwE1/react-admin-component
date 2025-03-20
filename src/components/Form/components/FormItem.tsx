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
  const { field_key, field, extra, rules, tooltip, hidden, defaultValue } =
    props;
  console.log("props", field_key, field, hidden, defaultValue);
  console.log("defaultValue", defaultValue);

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

  const renderFieldComponent = (schemaItem: FormSchemaItem) => {
    const { type, customRender, componentProps, reactions, disabled } = schemaItem;
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
