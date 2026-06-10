import React, { useEffect, useState } from "react";
import BaseSelect from "../BaseSelect";
import type { SelectProps } from "antd/es/select";
import { Checkbox, CheckboxChangeEvent, Divider } from "antd";

interface MutipleSelectProps extends SelectProps {
  selected?: Array<string | number>;
  defaultValue?: Array<string | number>;
}

export default function MutipleSelect(props: MutipleSelectProps) {
  const { selected, defaultValue = [], options, ...restProps } = props;

  const [selects, setSelects] = useState(selected || defaultValue);
  const [indeterminate, setIndeterminate] = useState(false);
  const [checkAll, setCheckAll] = useState(false);

  useEffect(() => {
    const isAll = selects.length === options!.length;
    setCheckAll(isAll);
    setIndeterminate(!isAll && !!selects?.length);
  }, [selects, checkAll]);

  const onCheckAllChange = (e: CheckboxChangeEvent) => {
    const isCheck = e.target.checked;
    setSelects(isCheck ? options!.map((item) => item.value!) : []);
  };

  const dropdownRender = (menu: React.ReactNode) => (
    <>
      <Checkbox
        indeterminate={indeterminate}
        checked={checkAll}
        onChange={onCheckAllChange}
        className="p-2"
      >
        全选
      </Checkbox>
      <Divider className="mx-0 my-2" />
      {menu}
    </>
  );

  return (
    <BaseSelect
      mode="multiple"
      value={selected}
      defaultValue={defaultValue}
      dropdownRender={dropdownRender}
      options={options}
      {...restProps}
    />
  );
}
