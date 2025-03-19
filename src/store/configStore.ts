import { create } from "zustand";
import { persist } from "zustand/middleware";
import { LOCAL_CONFIG_KEY } from "../constants/config";
import { FormItemType, FormSchemaItem } from "@/components/Form/Form.types.js";
import { mock_configs } from "../mock/config";

export interface ConfigItemType {
  key: string;
  title: string;
  data: FormSchemaItem[];
  createAt: string;
  lastUpdateAt: string;
  [key: string]: any;
}

type ConfigState = {
  configs: ConfigItemType[];
  loading: boolean;
  updateConfigs: (configs: ConfigItemType[]) => void;
  updateTargetConfigData: (targetKey: string, targetConfig: FormSchemaItem[]) => void;
  addTargetConfigData: (targetKey: string, dataItem: FormSchemaItem) => void;
  deleteTargetConfigData: (targetKey: string, dataItemKey: string) => void;
  fetchConfigData: () => Promise<ConfigItemType[]>;
};

// 解析配置数据
const parseConfigItem = (rawItem: ConfigItemType) => {
  return {
    ...rawItem,
    // 一些转换操作
    data: rawItem.data.map((item: FormSchemaItem) => ({
      ...item,
      disabled: !!item.disabled,
      hidden: !!item.hidden,
      // 例如 字段名从 hidden 转为 isShow
      // isShow: !item.hidden,
    })),
    // 例如 将时间字符串转换为 Date 对象
    // createAt: new Date(rawItem.createAt),
    // lastUpdateAt: formatDate(rawItem.lastUpdateAt),
  };
};

export const useConfigStore = create<ConfigState>()(
  persist(
    (set, get) => ({
      configs: [],
      loading: false,
      // 更新配置数据
      updateConfigs: (configs) => set({ configs }),

      // 更新目标配置数据
      updateTargetConfigData: (targetKey, targetConfigData) =>
        set((state) => {
          const targetConfig = state.configs.find(
            (item) => item.key === targetKey
          );
          if (!targetConfig) return { configs: state.configs };
          targetConfig.data = targetConfigData;
          return { configs: state.configs };
        }),

      // 添加目标配置数据项
      addTargetConfigData: (targetKey, dataItem) =>
        set((state) => {
          const targetConfig = state.configs.find(
            (item) => item.key === targetKey
          );
          if (!targetConfig) return { configs: state.configs };
          targetConfig.data.push(dataItem);
          return { configs: state.configs };
        }),

      // 删除配置数据
      // 删除目标配置数据项
      deleteTargetConfigData: (targetKey, dataItemKey) =>
        set((state) => {
          const targetConfig = state.configs.find(
            (item) => item.key === targetKey
          );
          if (!targetConfig) return { configs: state.configs };
          const targetDataIndex = targetConfig.data.findIndex(
            (item) => item.key === dataItemKey
          );
          targetConfig.data.splice(targetDataIndex, 1);
          return { configs: state.configs };
        }),

      // 模拟异步获取数据
      fetchConfigData: async () => {
        set({ loading: true });
        // 使用 持久化数据 或 mock数据
        const response = await new Promise((resolve) => {
          setTimeout(() => {
            let _response = mock_configs;
            // 优先读取本地存储
            const localState = localStorage.getItem(LOCAL_CONFIG_KEY);
            if (localState) {
              const parsed_localState = JSON.parse(localState);
              const localConfigs = parsed_localState?.state?.configs;
              _response = localConfigs.length ? localConfigs : _response;
            }
            resolve(_response);
            set({ loading: false });
          }, 1000);
        });
        const parsedItems = (response as ConfigItemType[]).map(parseConfigItem);

        // 更新状态
        get().updateConfigs(parsedItems);

        return parsedItems;
      },
    }),
    {
      name: LOCAL_CONFIG_KEY, // 本地存储的 key
      partialize: (state) => ({ configs: state.configs }), // 仅持久化 configs
    }
  )
);
