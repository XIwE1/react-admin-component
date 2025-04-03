import dayjs, { Dayjs } from "dayjs";

/**
 * 将配置规则根据type和params 转换为 antd Form 规则
 */
export const transformRules = (configRules: any[]) => {
  if (!configRules) return [];

  return configRules.map((rule) => {
    if (!rule) return null;
    const { type, min, max } = rule;
    let message;
    let prefixFn;
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
        prefixFn = formatRangeMessage("字符长度");
        message = prefixFn(min, max);
        return {
          type: "string",
          min: min,
          max: max,
          message,
        };
      case "multipleLimit":
        prefixFn = formatRangeMessage("选项数量");
        message = prefixFn(min, max);
        return {
          type: "array",
          min: min,
          max: max,
          message,
        };
      case "range":
        prefixFn = formatRangeMessage("数值");
        message = prefixFn(min, max);
        return {
          type: "number",
          min: min,
          max: max,
          message,
        };

      case "dateRange":
        const startDate = dayjs(min);
        const endDate = dayjs(max);
        message =
          startDate &&
          endDate &&
          `日期应在 ${startDate.format("YYYY-MM-DD")} - ${endDate.format(
            "YYYY-MM-DD"
          )} 以内`;
        const validator = (_: any, source: any) => {
          const [begin, end] = formatDateSource(source);
          if (!begin || !end) return Promise.resolve();
          if (min && begin.isBefore(startDate, "day")) {
            return Promise.reject(
              message || `日期不能早于 ${startDate.format("YYYY-MM-DD")}`
            );
          }
          if (max && end.isAfter(endDate, "day")) {
            return Promise.reject(
              message || `日期不能晚于 ${endDate.format("YYYY-MM-DD")}`
            );
          }
          return Promise.resolve();
        };
        return {
          type: "date",
          validator,
          // min: new Date(min),
          // max: new Date(max),
          // message: `日期应在 ${min || 0} - ${max || "∞"} 以内`,
        };
      case "arrayLength":
        prefixFn = formatRangeMessage("字段项个数");
        message = prefixFn(min, max);
        return {
          type: "array",
          min: min,
          max: max,
          message,
        };
      case "fileCount":
        return {
          type: "array",
          max: max,
          message: `文件数量不能超过 ${max || 1} 个`,
        };
      default:
        return {};
    }
  });
};

function formatDateSource(
  dateSource: string | Date | Dayjs | Array<string | Date | Dayjs>
) {
  if (!dateSource) return [];
  if (Array.isArray(dateSource) && !dateSource.length) return [];
  const value = Array.isArray(dateSource)
    ? dateSource
    : [dateSource, dateSource];
  const begin = dayjs(value[0]);
  const end = dayjs(value[1]);
  return [begin, end];
}

function formatRangeMessage(typeStr: string) {
  let message = "";
  const prefix = typeStr;
  message = `${prefix}应在`;
  return function (min: number, max: number) {
    if (min && max) {
      return `${message} ${min} - ${max} 之间`;
    } else if (min && !max) {
      return `${message} ${min} 及以上`;
    } else if (!min && max) {
      return `${message} ${max} 及以内`;
    }
  };
}
