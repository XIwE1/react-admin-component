import { create } from "zustand";
import { persist } from "zustand/middleware";
import { LOCAL_CONFIG_KEY } from "../constants/config";
import { FormItemType } from "@/components/Form/Form.types.js";
import { mock_configs } from "../mock/config";

export interface ConfigItemType {
  key: string;
  title: string;
  data: DataItem[];
  createAt: string;
  lastUpdateAt: string;
  [key: string]: any;
}

export interface DataItem {
  key: string;
  field: string;
  type: FormItemType;
  defaultValue: any;
  disabled: boolean;
  hidden: boolean;
  reactions?: string;
  [key: string]: any;
}

type ConfigState = {
  configs: ConfigItemType[];
  loading: boolean;
  updateConfigs: (configs: ConfigItemType[]) => void;
  updateTargetConfigData: (targetKey: string, targetConfig: DataItem[]) => void;
  fetchConfigData: () => Promise<ConfigItemType[]>;
};

// 解析配置数据
const parseConfigItem = (rawItem: ConfigItemType) => {
  return {
    ...rawItem,
    // 一些转换操作
    data: rawItem.data.map((item: DataItem) => ({
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
          let targetIndex = state.configs.findIndex(
            (item) => item.key === targetKey
          );
          state.configs[targetIndex].data = targetConfigData;
          return { configs: state.configs };
        }),

      // 删除配置数据
      // 删除目标配置数据

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
              _response = localConfigs ? localConfigs : _response;
            }
            resolve(_response);
          }, 1000);
        });
        const parsedItems = (response as ConfigItemType[]).map(parseConfigItem);

        // 更新状态
        set({ loading: false });
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
