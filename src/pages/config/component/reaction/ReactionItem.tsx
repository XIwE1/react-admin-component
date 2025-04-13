import { Input, Select, SelectProps, Space } from "antd";
import { ConfigItemType } from "../../../../store/configStore";
import React from "react";
import { FormSchemaItem } from "../../../../components/Form/Form.types";

type ReactionItemProps = {
  /**
   * @description 主动影响/被动依赖
   */
  isActive: boolean;
  fields: ConfigItemType[];
  fieldItem: FormSchemaItem;
};

// dependencies/target + when/fulfill/otherwise
const ReactionItem = (props: ReactionItemProps) => {
  const { isActive, fields, fieldItem } = props;
  console.log("ReactionItem", fields, fieldItem);
  const field_options = fields.map((item) => ({
    label: item.field,
    value: item.field_key,
  }));

  const renderSelectField = () => {
    let seletItem = <Select  style={{minWidth: '98px'}}showSearch options={field_options}></Select>;
    if (isActive) {
      const value = fieldItem.field_key;
      seletItem = (
        <Select  style={{minWidth: '98px'}}showSearch options={field_options} value={value} disabled></Select>
      );
    }
    const stateOrValue = renderFieldStateOrValue(fieldItem);
    return (
      <Space>
        当 {seletItem} {stateOrValue} 时，
      </Space>
    );
  };

  //  根据type渲染 字段的状态/值的选项
  //  number、date、range: 大于/小于/等于/不等于/范围
  //  input、textarea: 包含/不包含
  //  select、checkbox、dynamic、radio: 包含/不包含
  //  switch: 开启/关闭
  const renderFieldStateOrValue = (item: FormSchemaItem) => {
    const { type } = item;
    const nums = ["number", "date", "range"];
    const strs = ["input", "textarea"];
    const selects = ["select", "checkbox", "dynamic", "radio"];
    const switchs = ["switch"];
    let pre_options: any[] = [];
    let extra_item = <></>;
    if (nums.includes(type)) {
      pre_options = [
        { label: "大于", value: ">" },
        { label: "小于", value: "<" },
        { label: "等于", value: "=" },
      ];
      extra_item = <Input style={{maxWidth: '100px'}}></Input>;
    } else if (strs.includes(type)) {
      pre_options = [
        { label: "包含", value: "contain" },
        { label: "不包含", value: "notContain" },
      ];
      extra_item = <Input style={{maxWidth: '100px'}}></Input>;
    } else if (selects.includes(type)) {
      pre_options = [
        { label: "包含", value: "contain" },
        { label: "不包含", value: "notContain" },
      ];
      extra_item = <Input style={{maxWidth: '100px'}}></Input>;
    } else if (switchs.includes(type)) {
      pre_options = [
        { label: "开启", value: "open" },
        { label: "关闭", value: "close" },
      ];
    }
    const seletItem = <Select  style={{minWidth: '98px'}}showSearch options={pre_options}></Select>;
    return (
      <Space>
        {seletItem} {extra_item}
      </Space>
    );
  };

  const renderEffectField = () => {
    const visible_options = [
      { label: "显示", value: true },
      { label: "隐藏", value: false },
    ];
    let effectItem = <Select  style={{minWidth: '98px'}}showSearch options={field_options}></Select>;
    if (!isActive) {
      const value = fieldItem.field_key;
      effectItem = (
        <Select  style={{minWidth: '98px'}}showSearch options={field_options} value={value} disabled></Select>
      );
    }
    const statusItem = <Select  style={{minWidth: '98px'}}showSearch options={visible_options}></Select>;
    return (
      <Space>
        {effectItem} 的状态 {statusItem}
      </Space>
    );
  };

  const renderReaction = () => {
    const target = renderSelectField();
    const effect = renderEffectField();
    return (
      <Space direction="vertical">
        {target} {effect}
      </Space>
    );
  };
  return <>{renderReaction()}</>;
};

export default ReactionItem;
