import dayjs from "dayjs";

/**
 * 将配置规则根据type和params 转换为 antd Form 规则
 */
export const transformRules = (configRules: any[]) => {
  if (!configRules) return [];

  return configRules.map((rule) => {
    if (!rule) return null;
    const { type, min, max } = rule;

    switch (type) {
      case "required":
        return { required: true, message: "该字段为必填项" };

      // case 'email':
      //   return {
      //     pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      //     message: '请输入有效的邮箱地址'
      //   };

      // case 'phone':
      //   return {
      //     pattern: /^1[3-9]\d{9}$/,
      //     message: '请输入有效的手机号码'
      //   };

      // case 'url':
      //   return {
      //     pattern: /^https?:\/\/.+/,
      //     message: '请输入有效的URL地址'
      //   };

      case "length":
        return {
          type: "string",
          min: min,
          max: max,
          message: `字符长度必须在 ${min || 0} - ${max || "∞"} 之间`,
        };
      case "multipleLimit":
        return {
          type: "array",
          min: min,
          max: max,
          message: `选项数量必须在 ${min || 0} - ${max || "∞"} 之间`,
        };
      case "range":
        return {
          type: "number",
          min: min,
          max: max,
          message: `数值必须在 ${min || 0} - ${max || "∞"} 之间`,
        };

      case "dateRange":
        const startDate = dayjs(min);
        const endDate = dayjs(max);
        const validator = (_: any, value: string) => {
          if (!value) return Promise.resolve();
          const date = dayjs(value);
          if (min && date.isBefore(startDate, "day")) {
            return Promise.reject(`日期不能早于 ${startDate.format("YYYY-MM-DD")}`);
          }
          if (max && date.isAfter(endDate, "day")) {
            return Promise.reject(`日期不能晚于 ${endDate.format("YYYY-MM-DD")}`);
          }
          return Promise.resolve();
        };
        return {
          type: "date",
          validator,
          // min: new Date(min),
          // max: new Date(max),
          // message: `日期必须在 ${min || 0} - ${max || "∞"} 之间`,
        };
      case "arrayLength":
        return {
          type: "array",
          min: min,
          max: max,
          message: `项数必须在 ${min || 0} - ${max || "∞"} 之间`,
        };
      case "fileCount":
        return {
          type: "array",
          max: max,
          message: `文件数量不能超过 ${max || "∞"} 个`,
        };
      default:
        return {};
    }
  });
};
