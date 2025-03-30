export const LOCAL_CONFIG_KEY = "configs";

/**
 * 预设规则配置
 */
export const PRESET_RULES = {
  // required: {
  //   label: "必填",
  //   description: "字段不能为空",
  //   supportTypes: "all", // 支持所有类型
  // },

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
  range: {
    label: "数值范围",
    description: "数值范围限制",
    supportTypes: ["number"],
    params: [
      {
        name: "min",
        label: "最小值",
        type: "number",
      },
      {
        name: "max",
        label: "最大值",
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
  // pattern: {
  //   label: "格式校验",
  //   description: "检查邮箱/手机号等格式",
  //   supportTypes: ["input", "password"],
  //   params: [
  //     {
  //       name: "email",
  //       label: "电子邮箱",
  //       type: "string",
  //     },
  //     {
  //       name: "phone",
  //       label: "手机号码",
  //       type: "string",
  //     },
  //   ],
  // }
  // 其他规则
};
