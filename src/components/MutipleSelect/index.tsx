import React from "react";
import BaseSelect from "../BaseSelect";

interface MutipleSelectProps extends SelectProps {
  
}

export default function MutipleSelect(props: SelectProps) {
  return <BaseSelect {...props} mode="multiple" />;
}