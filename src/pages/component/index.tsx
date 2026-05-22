import React from "react";
import { Space, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import ProTable from "../../components/ProTable";
import {
  fetchMockComponentTable,
  type ComponentTableRow,
} from "../../mock/componentTable";

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
    <Space direction="vertical" size="middle" className="w-full">
      <ProTable
        request={{ request: fetchMockComponentTable }}
      >
        <ProTable.Table columns={columns} />
      </ProTable>
    </Space>
  );
}
