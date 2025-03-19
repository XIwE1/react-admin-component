import { useState } from "react";
import { Button, Space, Table, Switch, Popconfirm } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";

import BlockTitle from "@/components/BlockTitle";
import ConfigItemModal from "./component/ConfigItemModal";

import "./ConfigItem.css";

const ConfigItem = (props) => {
  const {
    title,
    configKey,
    data: dataSource,
    onAdd,
    onDelete,
    onChange,
  } = props;

  const [modalVisible, setModalVisible] = useState(false);
  const [activeItem, setActiveItem] = useState(null);

  const handleSwitchChange = (record, field, checked) => {
    const newData = dataSource.map((item) => {
      const newItem =
        item.field_key === record.field_key ? { ...item, [field]: !checked } : item;
      return newItem;
    });

    onChange?.(configKey, newData);
  };

  const handleChange = (newDataItem) => {
    const newData = dataSource.map((item) => {
      const newItem = item.field_key === newDataItem.field_key ? newDataItem : item;
      return newItem;
    });
    onChange?.(configKey, newData);
  };

  const handleAdd = (newDataItem) => {
    onAdd?.(configKey, newDataItem);
  };

  const handleDelete = (dataItemKey) => {
    onDelete?.(configKey, dataItemKey);
  };

  const handleSubmit = (newDataItem) => {
    if (!newDataItem) return;
    activeItem ? handleChange(newDataItem) : handleAdd(newDataItem);
    clearModal();
  };

  const clearModal = () => {
    setActiveItem(null);
    setModalVisible(false);
  };

  const columns = [
    {
      title: "字段",
      dataIndex: "field",
      key: "field",
    },
    {
      title: "类型",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "默认值",
      dataIndex: "defaultValue",
      key: "defaultValue",
    },
    {
      title: "可编辑",
      dataIndex: "disabled",
      key: "disabled",
      render: (_, record) => (
        <Switch
          size="normal"
          value={!record?.disabled}
          onChange={(checked) =>
            handleSwitchChange(record, "disabled", checked)
          }
        />
      ),
    },
    {
      title: "显示",
      dataIndex: "hidden",
      key: "hidden",
      render: (_, record) => (
        <Switch
          size="normal"
          value={!record?.hidden}
          onChange={(checked) => handleSwitchChange(record, "hidden", checked)}
        />
      ),
    },
    {
      title: "关联字段",
      dataIndex: "reactions",
      key: "reactions",
    },
    {
      title: "操作",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <a onClick={() => onClickEdit(record)}>设置</a>
          <Popconfirm
            // title={`删除`}
            title={
              <span>
                确定要删除 <strong>字段-{record.field}</strong> 吗？
              </span>
            }
            onConfirm={() => handleDelete(record.field_key)}
            okText="确定"
            cancelText="取消"
            okType="danger"
          >
            <Button type="link" danger>
              删除
            </Button>
          </Popconfirm>
          {/* <a>删除</a> */}
        </Space>
      ),
    },
  ];

  const onClickAdd = () => {
    setActiveItem(null);
    setModalVisible(true);
  };
  const onClickEdit = (fieldItem) => {
    setActiveItem({ ...fieldItem });
    setModalVisible(true);
  };

  return (
    <div className="config_item">
      <div className="item_title">
        <BlockTitle title={title} />
      </div>
      <div className="item_content">
        <div className="item_buttons">
          <Space>
            <Button icon={<PlusOutlined />} onClick={onClickAdd}>
              添加
            </Button>
            <Button danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Space>
        </div>
        <div className="item_list">
          <Table
            dataSource={dataSource}
            columns={columns}
            bordered
            rowKey="field_key"
            pagination={false}
            size="small"
          />
        </div>
        <Button
          block
          type="dashed"
          icon={<PlusOutlined />}
          onClick={onClickAdd}
        >
          添加
        </Button>
      </div>
      <ConfigItemModal
        isOpen={modalVisible}
        onSubmit={handleSubmit}
        onCancel={clearModal}
        fieldItem={activeItem}
      />
    </div>
  );
};

export default ConfigItem;
