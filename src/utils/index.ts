import dayjs from "dayjs";
import { FormSchemaItem } from "@/components/Form/Form.types.js";

// 获取和更新全局配置
function getLocalConfig(configKey: string) {
  const config = localStorage.getItem(configKey);
  if (!config) return {};
  return JSON.parse(config);
}

function storeLocalConfig(configKey: string, configs: any[]) {
  const result = Object.create({});
  for (let item of configs) {
    const [key, config] = item;
    result[key] = config;
  }
  // localStorage.removeItem(configKey);
  localStorage.setItem(configKey, JSON.stringify(result));
}

// 获取和更新目标配置
function getLocalTargetConfig(configKey: string, targetKey: string) {
  const localConfig = getLocalConfig(configKey);
  const target = localConfig[targetKey];
  if (!target) return {};
  return target;
}

function storeLocalTargetConfig(
  configKey: string,
  targetKey: string,
  config: any
) {
  const localConfig = getLocalConfig(configKey);
  localConfig[targetKey] = config;

  storeLocalConfig(configKey, Object.entries(localConfig));
}

// 转换日期格式的数据
const dateFormatList = ["YYYY-MM-DD", "YYYY/MM/DD", "YY-MM-DD", "YY/MM/DD"];
function transformToDayjs(date: number | string | Date) {
  const value = dayjs(date, dateFormatList);
  if (value.isValid()) return value;
  return;
}

// 根据type将defaultValue转换为用于使用的值
const formatValueByType = (type: string, value: any) => {
  if (!value) return value;
  if (type === "date") return transformToDayjs(value);
  if (type === "range")
    return [transformToDayjs(value[0]), transformToDayjs(value[1])];
  return value;
};

// 根据type将defaultValue转换为用于展示的值
const formatDefaultValueByConfigItem = (configItem: FormSchemaItem) => {
  const { type, defaultValue: value } = configItem;
  if (!value) return value;
  if (type === "date") return transformToDayjs(value)?.format("YYYY-MM-DD");
  if (type === "range" && value && value.length === 2)
    return [
      transformToDayjs(value[0])?.format("YYYY-MM-DD"),
      transformToDayjs(value[1])?.format("YYYY-MM-DD"),
    ].join(",");
  if (type === "select") {
    const {
      componentProps: { options, mode },
    } = configItem;
    if (!options || options.length === 0) return value;
    if (mode === "radio") {
      const option = options.find((item: any) => item.value === value);
      return option ? option.label : value;
    } else if (mode === "multiple") {
      const option = options.filter((item: any) => value.includes(item.value));
      return option.map((item: any) => item.label).join(",");
    }
  }
  if (type === "checkbox" || type === "radio") {
    const {
      componentProps: { options },
    } = configItem;
    if (!options || options.length === 0) return value;
    const _value = Array.isArray(value) ? value : [value];
    const option = options.filter((item: any) => _value.includes(item.value));
    return option.map((item: any) => item.label).join(",");
  }
  if (type === "dynamic") {
    return value.join(",");
  }
  return value;
};
export {
  storeLocalConfig,
  getLocalConfig,
  getLocalTargetConfig,
  storeLocalTargetConfig,
  transformToDayjs,
  formatValueByType,
  formatDefaultValueByConfigItem,
};
