import { useEffect, useState } from "react";
import ConfigItem from "./ConfigItem.jsx";
import "./index.css";
import { FormItemType } from "@/components/Form/Form.types.js";
import React from "react";
import { Spin } from "antd";

interface ConfigItemType {
  key: string;
  title: string;
  data: DataItem[];
  createAt: string;
  lastUpdateAt: string;
  [key: string]: any;
}

interface DataItem {
  key: string;
  field: string;
  type: FormItemType;
  defaultValue: any;
  disabled: boolean;
  hidden: boolean;
  reactions?: string;
  [key: string]: any;
}

const _dataSource: DataItem[] = [
  {
    key: "money",
    field: "金额",
    type: "number",
    defaultValue: 100,
    disabled: false,
    hidden: false,
    reactions: "count,price",
  },
  {
    key: "price",
    field: "单价",
    type: "number",
    defaultValue: 10,
    disabled: false,
    hidden: false,
    reactions: "money,price",
  },
];

const _configs: ConfigItemType[] = [
  {
    key: "form1",
    title: "动态表单Form_1",
    data: _dataSource,
    createAt: "2025-03-14",
    lastUpdateAt: "2025-03-15",
    // ...模拟后端返回的数据
  },
  {
    key: "form2",
    title: "动态表单Form_2",
    data: _dataSource,
    createAt: "2025-03-15",
    lastUpdateAt: "2025-03-15",
  },
];

const Config = () => {
  const [configItems, setConfigItems] = useState([] as ConfigItemType[]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const response = await requestConfigsAPI();
      const parsedItems = response.map(parseConfigItem);
      setConfigItems(parsedItems);
      setLoading(false);
    };
    fetchData();
  }, []);

  // 模拟请求后台数据
  const requestConfigsAPI = async () => {
    const response = await new Promise((resolve) => {
      setTimeout(() => {
        resolve(_configs);
      }, 1000);
    });
    return response as ConfigItemType[];
  };

  // 解析配置数据
  const parseConfigItem = (rawItem: ConfigItemType) => {
    return {
      ...rawItem,
      // 一些转换操作
      // 例如 字段名从 hidden 转为 isShow
      data: rawItem.data.map((item: DataItem) => ({
        ...item,
        disabled: !!item.disabled,
        hidden: !!item.hidden,
      })),
      // 例如 将时间字符串转换为 Date 对象
      // createAt: formatDate(rawItem.createAt),
      // lastUpdateAt: formatDate(rawItem.lastUpdateAt),
    };
  };

  // 增删改回调
  const handleAdd = () => {
    console.log("add");
  };
  const handleDelete = () => {
    console.log("delete");
  };
  const handleChange = (targetKey: string, newData: DataItem[]) => {
    setConfigItems((prev) =>
      prev.map((item) =>
        item.key === targetKey
          ? {
              ...item,
              data: newData,
            }
          : item
      )
    );
  };

  return (
    <Spin
      spinning={loading}
      wrapperClassName="config_container"
      size="large"
      tip="Loading..."
    >
      <div>
        {configItems.map((item) => {
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
