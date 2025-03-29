export const LOCAL_CONFIG_KEY = "configs";

/**
 * 预设规则配置
 */
export const PRESET_RULES = {
  required: {
    label: "必填",
    description: "字段不能为空",
    supportTypes: "all", // 支持所有类型
  },

  length: {
    label: "字符长度",
    description: "字符串长度限制",
    supportTypes: ["input", "textarea", "password"],
    params: [
      {
        name: "min",
        label: "最小长度",
        type: "number",
      },
      {
        name: "max",
        label: "最大长度",
        type: "number",
      },
    ],
  },

  multipleLimit: {
    label: "选择数量",
    description: "多选时可选择的最大/最小数量",
    supportTypes: ["select", "checkbox"],
    params: [
      {
        name: "min",
        label: "最少选择",
        type: "number",
      },
      {
        name: "max",
        label: "最多选择",
        type: "number",
      },
    ],
  },

  dateRange: {
    label: "日期范围",
    description: "限制可选择的日期范围",
    supportTypes: ["date", "range"],
    params: [
      {
        name: "min",
        label: "开始日期",
        type: "date",
      },
      {
        name: "max",
        label: "结束日期",
        type: "date",
      },
    ],
  },

  fileSize: {
    label: "文件大小",
    description: "限制上传文件的大小",
    supportTypes: ["upload"],
    params: [
      {
        name: "maxSize",
        label: "最大大小(MB)",
        type: "number",
      },
    ],
  },

  fileCount: {
    label: "文件数量",
    description: "限制可上传的文件数量",
    supportTypes: ["upload"],
    params: [
      {
        name: "max",
        label: "最大数量",
        type: "number",
      },
    ],
  },

  arrayLength: {
    label: "数组长度",
    description: "限制动态表单项的数量",
    supportTypes: ["dynamic"],
    params: [
      {
        name: "min",
        label: "最少数量",
        type: "number",
      },
      {
        name: "max",
        label: "最多数量",
        type: "number",
      },
    ],
  },
  // ... 其他规则
};
