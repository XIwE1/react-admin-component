const SELECT_TYPES = ["select", "cascader", "radio", "checkbox"];

const TYPES_KEYNAME_MAP = {
  input: "输入框 - input",
  password: "密码框 - password",
  textarea: "文本域 - textarea",
  number: "数字输入框 - number",
  select: "下拉框 - select",
  dynamic: "动态项 - dynamic",
  checkbox: "多选框 - checkbox",
  cascader: "级联选择 - cascader",
  radio: "单选框 - radio",
  date: "日期 - date",
  range: "日期范围 - range",
  switch: "开关 - switch",
  upload: "文件上传 - upload",
  custom: "自定义组件 - custom",
};

const TYPE_RULES_MAP = {
  input: ["required", "length", "email", "url", "pattern"],
  textarea: ["required", "length"],
  number: ["required", "range"],
  password: ["required", "length"],
  select: ["required", "multipleLimit"],
  checkbox: ["required", "multipleLimit"],
  radio: ["required"],
  date: ["required", "dateRange"],
  range: ["required", "dateRange"],
  upload: ["required", "fileSize", "fileType", "fileCount"],
  dynamic: ["required", "arrayLength", "pattern"],
  switch: ["required"],
};

export { SELECT_TYPES, TYPES_KEYNAME_MAP, TYPE_RULES_MAP };
