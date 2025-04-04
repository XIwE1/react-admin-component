import dayjs, { Dayjs } from "dayjs";

/**
 * 将配置规则根据type和params 转换为 antd Form 规则
 */
export const transformRules = (configRules: any[]) => {
  if (!configRules) return [];

  return configRules.map((rule) => {
    if (!rule) return null;
    const { type, min, max, pattern } = rule;
    let message: string;
    let prefixFn: (min: number, max: number) => string;
    switch (type) {
      case "required":
        return { required: true, message: "该字段为必填项" };

      case "pattern": {
        let _RegEx: RegExp;
        message = "请输入有效的";
        if (pattern === "email") {
          _RegEx = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
          message += "邮箱地址";
        } else if (pattern === "phone") {
          _RegEx = /^1[3-9]\d{9}$/;
          message += "手机号码";
        } else if (pattern === "url") {
          _RegEx = /^https?:\/\/.+/;
          message += "URL地址";
        }
        const validator = (_: any, source: any) => {
          const value = Array.isArray(source) ? source : [source];
          if (!value || !value.length) return Promise.resolve();
          for (let item of value) {
            if (!_RegEx.test(item)) {
              return Promise.reject(message);
            }
          }
          return Promise.resolve();
        };
        return {
          validator,
        };
      }

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

      case "dateRange": {
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
      }
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
          validator: (_: any, source: any) => {
            const { fileList } = source;
            if (!fileList || !fileList.length) return Promise.resolve();
            if (max && fileList.length > max) {
              return Promise.reject(`文件数量不能超过 ${max || 1} 个`);
            }
            return Promise.resolve();
          },
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
    return "";
  };
}
