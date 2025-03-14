import React from "react";
import { FormSchemaItem } from "../Form.types";
import { Form } from "antd";

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
    checkbox: renderCheckComponent,
    radio: renderRadioComponent,
    date: renderDateComponent,
    range: renderDateComponent,
    switch: renderSwitchComponent,
    custom: renderCustomComponent,
  };
  
  function renderInputComponent() {
    return;
  }
  function renderSelectComponent() {}
  function renderDateComponent() {}
  function renderCheckComponent() {}
  function renderRadioComponent() {}
  function renderSwitchComponent() {}
  function renderCustomComponent() {}
  function renderEmpty() {
    return <></>;
  }

  return (
    <Form.Item
      extra={extra}
      key={key}
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
