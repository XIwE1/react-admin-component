import BlockTitle from "@/components/BlockTitle";
import { Button, Space, Table, Switch } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import "./ConfigItem.css";

const ConfigItem = (props) => {
  const { title, data: dataSource, onAdd, onDelete, onChange } = props;

  const handleSwitchChange = (record, field, checked) => {
    const newData = dataSource.map((item) => {
      const newItem =
        item.key === record.key ? { ...item, [field]: !checked } : item;
      return newItem;
    });

    onChange?.(newData);
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
          <a>设置</a>
          <a>删除</a>
        </Space>
      ),
    },
  ];

  return (
    <div className="config_item">
      <div className="item_title">
        <BlockTitle title={title} />
      </div>
      <div className="item_content">
        <div className="item_buttons">
          <Space>
            <Button icon={<PlusOutlined />} onClick={onAdd}>
              添加
            </Button>
            <Button icon={<DeleteOutlined />} onClick={onDelete}>
              删除
            </Button>
          </Space>
        </div>
        <div className="item_list">
          <Table
            dataSource={dataSource}
            columns={columns}
            bordered
            rowKey="key"
            pagination={false}
            size="small"
          />
        </div>
        <Button block type="dashed" icon={<PlusOutlined />} onClick={onAdd}>
          添加
        </Button>
      </div>
    </div>
  );
};

export default ConfigItem;
