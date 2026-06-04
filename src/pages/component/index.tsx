import React from "react";
import { Form, Input, Space, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import ProTable from "../../components/ProTable";
import {
  fetchMockComponentTable,
  type ComponentTableRow,
} from "../../mock/componentTable";
import CustomButton from "../../components/CustomButton";

const columns: ColumnsType<ComponentTableRow> = [
  { title: "ID", dataIndex: "id", width: 80 },
  { title: "名称", dataIndex: "name", width: 200 },
  {
    title: "状态",
    dataIndex: "status",
    width: 100,
  },
  {
    title: "金额",
    dataIndex: "amount",
    width: 120,
    render: (amount: number) => `$${amount.toFixed(2)}`,
  },
  { title: "创建时间", dataIndex: "createTime", width: 180 },
];

export default function Component() {
  return (
    <Space direction="vertical" size="middle" className="m-3 w-full" wrap>
      <Space size="middle" className="w-full">
        <CustomButton permission={["button:create"]} customVariant="primary">
          Primary
        </CustomButton>
        <CustomButton customVariant="secondary">Secondary</CustomButton>
        <CustomButton customVariant="danger">Danger</CustomButton>
        <CustomButton customVariant="warning">Warning</CustomButton>
        <CustomButton customVariant="success">Success</CustomButton>
        <CustomButton customVariant="info">Info</CustomButton>
        <CustomButton customVariant="link">Link</CustomButton>
        <CustomButton customVariant="ghost">Ghost</CustomButton>
      </Space>

      <ProTable
        permission={["table:view"]}
        request={{ request: fetchMockComponentTable }}
      >
        <Space direction="vertical" size="middle" className="w-full">
          <ProTable.Header>
            {columns.map((item) => {
              return (
                <Form.Item label={item.title} key={item.dataIndex}>
                  <Input />
                </Form.Item>
              );
            })}
          </ProTable.Header>
          <ProTable.Table columns={columns} />
        </Space>
      </ProTable>
      {/* <Table
        rowKey={"id"}
        pagination={pagination}
        columns={columns}
        dataSource={data}
        loading={loading}
        onChange={(pag) => {
          setPagination((prev) => ({
            ...prev,
            current: pag.current!,
            pageSize: pag.pageSize!,
          }));
        }}
      /> */}
    </Space>
  );
}
