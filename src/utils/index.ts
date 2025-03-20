import dayjs from "dayjs";

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

const dateFormatList = ["YYYY-MM-DD", "YYYY/MM/DD", "YY-MM-DD", "YY/MM/DD"];
function transformToDayjs(date: number | string | Date) {
  const value = dayjs(date, dateFormatList);
  if (value.isValid()) return value;
  return;
}

const formatValueByType = (type: string, value: any) => {
  if (type === "date") return transformToDayjs(value);
  if (type === "range")
    return [transformToDayjs(value[0]), transformToDayjs(value[1])];
  return value;
};

export {
  storeLocalConfig,
  getLocalConfig,
  getLocalTargetConfig,
  storeLocalTargetConfig,
  transformToDayjs,
  formatValueByType,
};
