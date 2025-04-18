import { Form, FormItemProps, Input, Select, SelectProps, Space } from "antd";
import { ConfigItemType } from "../../../../store/configStore";
import React, { useCallback } from "react";
import { FormSchemaItem } from "../../../../components/Form/Form.types";

type ReactionItemProps = {
  /**
   * @description 主动影响/被动依赖
   */
  isActive: boolean;
  fields: ConfigItemType[];
  fieldItem: FormItemProps;
  type: string;
};

// dependencies/target + when/fulfill/otherwise
const ReactionItem = (props: ReactionItemProps) => {
  const { isActive, fields, type, fieldItem } = props;

  const field_options = fields.map((item) => ({
    label: item.field,
    value: item.field_key,
  }));

  const renderSelectField = () => {
    let seletItem = (
      <Select
        style={{ minWidth: "98px" }}
        showSearch
        options={field_options}
        disabled={isActive}
      ></Select>
    );

    return (
      <Space>
        <span>当 </span>
        <Form.Item name={[fieldItem.name, "whenTarget"]} noStyle>
          {seletItem}
        </Form.Item>
        <Form.Item noStyle>{renderFieldStateOrValue(type)}</Form.Item>
        <span>时，</span>
      </Space>
    );
  };

  //  根据type渲染 字段的状态/值的选项
  //  number、date、range: 大于/小于/等于/不等于/范围
  //  input、textarea: 包含/不包含
  //  select、checkbox、dynamic、radio: 包含/不包含
  //  switch: 开启/关闭
  const renderFieldStateOrValue = (itemType: string) => {
    const nums = ["number", "date", "range"];
    const strs = ["input", "textarea"];
    const selects = ["select", "checkbox", "dynamic", "radio"];
    const switchs = ["switch"];
    let pre_options: any[] = [];
    let extra_item = <></>;
    if (nums.includes(itemType)) {
      pre_options = [
        { label: "大于", value: ">" },
        { label: "小于", value: "<" },
        { label: "等于", value: "=" },
      ];
      extra_item = <Input style={{ maxWidth: "100px" }}></Input>;
    } else if (strs.includes(itemType)) {
      pre_options = [
        { label: "包含", value: "contain" },
        { label: "不包含", value: "notContain" },
      ];
      extra_item = <Input style={{ maxWidth: "100px" }}></Input>;
    } else if (selects.includes(itemType)) {
      pre_options = [
        { label: "包含", value: "contain" },
        { label: "不包含", value: "notContain" },
      ];
      extra_item = <Input style={{ maxWidth: "100px" }}></Input>;
    } else if (switchs.includes(itemType)) {
      pre_options = [
        { label: "开启", value: true },
        { label: "关闭", value: false },
      ];
    }
    const seletItem = (
      <Select
        style={{ minWidth: "98px" }}
        showSearch
        options={pre_options}
      ></Select>
    );
    return (
      <Space>
        <Form.Item name={[fieldItem.name, "whenState"]} noStyle>
          {seletItem}
        </Form.Item>
        <Form.Item name={[fieldItem.name, "whenValue"]} noStyle>
          {extra_item}
        </Form.Item>
      </Space>
    );
  };

  const renderEffectField = () => {
    const visible_options = [
      { label: "显示", value: true },
      { label: "隐藏", value: false },
    ];
    let effectItem = (
      <Select
        style={{ minWidth: "98px" }}
        showSearch
        options={field_options}
      ></Select>
    );
    if (!isActive) {
      effectItem = (
        <Select
          style={{ minWidth: "98px" }}
          showSearch
          options={field_options}
          disabled
        ></Select>
      );
    }
    const statusItem = (
      <Select
        style={{ minWidth: "98px" }}
        showSearch
        options={visible_options}
      ></Select>
    );
    return (
      <Space>
        <Form.Item name={[fieldItem.name, "effectTarget"]} noStyle>
          {effectItem}
        </Form.Item>
        <span>的状态</span>
        <Form.Item name={[fieldItem.name, "effectState"]} noStyle>
          {statusItem}
        </Form.Item>
      </Space>
    );
  };

  const renderReaction = () => {
    return (
      <Space direction="vertical">
        {renderSelectField()}
        {renderEffectField()}
      </Space>
    );
  };

  return <>{renderReaction()}</>;
};

export default ReactionItem;
