import React, { memo } from "react";
import type { DefaultOptionType } from "antd/es/select";
import Select from "antd/es/select";
import type { SelectProps } from "antd/es/select";
import "./index.css";

/**
 * 选项类型，与 antd Select 保持一致
 */
export interface BaseSelectOption extends DefaultOptionType {
  label: React.ReactNode;
  value?: string | number | null;
}

export interface BaseSelectProps<
  ValueType = any,
  OptionType extends BaseSelectOption = BaseSelectOption
> extends SelectProps<ValueType, OptionType> {
  /** 是否开启搜索，默认 true */
  showSearch?: boolean;
  /** 搜索时过滤的属性，默认 "label" */
  optionFilterProp?: string;
  /** 是否允许清空，默认 true */
  allowClear?: boolean;
}

const DEFAULT_PLACEHOLDER = "请选择";

function BaseSelectInner<
  ValueType = any,
  OptionType extends BaseSelectOption = BaseSelectOption
>(props: BaseSelectProps<ValueType, OptionType>) {
  const {
    options = [],
    showSearch = true,
    optionFilterProp = "label",
    allowClear = true,
    placeholder = DEFAULT_PLACEHOLDER,
    loading = false,
    filterOption = true,
    notFoundContent = "暂无数据",
    className,
    popupClassName,
    ...restProps
  } = props;

  const mergedClassName = ["base-select", className].filter(Boolean).join(" ");
  const mergedPopupClassName = ["base-select-dropdown", popupClassName]
    .filter(Boolean)
    .join(" ");

  return (
    <Select<ValueType, OptionType>
      className={mergedClassName}
      popupClassName={mergedPopupClassName}
      options={options}
      showSearch={showSearch}
      optionFilterProp={optionFilterProp}
      allowClear={allowClear}
      placeholder={placeholder}
      loading={loading}
      filterOption={filterOption}
      notFoundContent={notFoundContent}
      {...restProps}
    />
  );
}

/**
 * 二次封装的 Select 组件
 *
 * - 默认开启搜索 (showSearch)
 * - 默认按 label 过滤 (optionFilterProp="label")
 * - 默认允许清空 (allowClear)
 * - 与 antd Form.Item 完全兼容
 *
 * @example
 * // 基础用法
 * <BaseSelect options={[{ label: '选项1', value: '1' }]} />
 *
 * @example
 * // 表单中用法
 * <Form.Item name="type" label="类型">
 *   <BaseSelect options={options} />
 * </Form.Item>
 */
const BaseSelect = memo(BaseSelectInner) as <
  ValueType = any,
  OptionType extends BaseSelectOption = BaseSelectOption
>(
  props: BaseSelectProps<ValueType, OptionType>
) => React.ReactElement;

(BaseSelect as React.MemoExoticComponent<typeof BaseSelectInner> & {
  displayName?: string;
}).displayName = "BaseSelect";

export default BaseSelect;
