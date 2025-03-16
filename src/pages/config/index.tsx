import { useEffect } from "react";
import ConfigItem from "./ConfigItem.jsx";
import "./index.css";
import React from "react";
import { Spin } from "antd";
import { DataItem, useConfigStore } from "../../store/configStore.js";

const Config = () => {
  const { loading, configs, fetchConfigData, updateTargetConfigData } =
    useConfigStore();

  // 模拟请求后台数据
  useEffect(() => {
    fetchConfigData();
  }, []);

  // 增删改回调
  const handleAdd = () => {
    console.log("add");
  };
  const handleDelete = () => {
    console.log("delete");
  };
  const handleChange = (targetKey: string, newData: DataItem[]) => {
    console.log("handleChange");
    updateTargetConfigData(targetKey, newData);
  };

  return (
    <Spin
      spinning={loading}
      wrapperClassName="config_container"
      size="large"
      tip="Loading..."
    >
      <div>
        {configs.map((item) => {
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
