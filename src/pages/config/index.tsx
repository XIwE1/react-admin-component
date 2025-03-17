import { useEffect } from "react";
import ConfigItem from "./ConfigItem.jsx";
import "./index.css";
import React from "react";
import { Spin } from "antd";
import {
  DataItem,
  useConfigStore,
  ConfigItemType,
} from "@/store/configStore.js";

const Config = () => {
  const {
    loading,
    configs,
    fetchConfigData,
    updateTargetConfigData,
    addTargetConfigData,
  } = useConfigStore();

  // 模拟请求后台数据
  useEffect(() => {
    fetchConfigData();
  }, []);

  // 增删改回调
  const handleAdd = (targetKey: string, newDataItem: DataItem) => {
    console.log("add");
    addTargetConfigData(targetKey, newDataItem);
  };
  const handleDelete = () => {
    console.log("delete");
  };
  const handleChange = (targetKey: string, newData: DataItem[]) => {
    console.log("handleChange");
    updateTargetConfigData(targetKey, newData);
  };

  return (
    <Spin spinning={loading} size="large" tip="Loading...">
      <div className="config_container">
        {configs.map((item: ConfigItemType) => {
          return (
            <ConfigItem
              onAdd={handleAdd}
              onDelete={handleDelete}
              onChange={(newData: DataItem[]) =>
                handleChange(item.key, newData)
              }
              {...item}
              key={item.key}
            />
          );
        })}
      </div>
    </Spin>
  );
};

export default Config;
