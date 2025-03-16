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

export {
  storeLocalConfig,
  getLocalConfig,
  getLocalTargetConfig,
  storeLocalTargetConfig,
};
