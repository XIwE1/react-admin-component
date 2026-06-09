import React from "react";
import Select from "antd/es/select";
import type { SelectProps } from "antd/es/select";
import clsx from "clsx";

import "./index.css";

const DEFAULT_PLACEHOLDER = "请选择";

function BaseSelect(props: SelectProps) {
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

  return (
    <Select
      className={clsx("base-select", className)}
      popupClassName={clsx("base-select-dropdown", popupClassName)}
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

export default BaseSelect;
