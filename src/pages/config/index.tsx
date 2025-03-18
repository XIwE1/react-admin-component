import { useEffect } from "react";
import ConfigItem from "./ConfigItem.jsx";
import "./index.css";
import React from "react";
import { message, Spin } from "antd";
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
    console.log("add", targetKey, newDataItem);
    addTargetConfigData(targetKey, newDataItem);
    message.success("添加成功");
  };
  const handleDelete = () => {
    console.log("delete");
  };
  const handleChange = (targetKey: string, newData: DataItem[]) => {
    console.log("handleChange");
    updateTargetConfigData(targetKey, newData);
    message.success("修改成功");
  };

  return (
    <Spin spinning={loading} size="large" tip="Loading...">
      <div className="config_container">
        {configs.map((item: ConfigItemType) => {
          return (
            <ConfigItem
              onAdd={handleAdd}
              onDelete={handleDelete}
              onChange={handleChange}
              {...item}
              key={item.key}
              configKey={item.key}
            />
          );
        })}
      </div>
    </Spin>
  );
};

export default Config;
