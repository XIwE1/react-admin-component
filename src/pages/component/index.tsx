import React from "react";
import { Form, Input, message, Space, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";

import BlockTitle from "../../components/BlockTitle";
import ProTable from "../../components/ProTable";
import {
  fetchMockComponentTable,
  type ComponentTableRow,
} from "../../mock/componentTable";
import CustomButton from "../../components/CustomButton";
import BaseSelect from "../../components/BaseSelect";

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
      <BlockTitle title="选择" />
      <Space size="middle" className="w-full">
        <BaseSelect
          options={[
            { label: "选项1", value: "1" },
            { label: "选项2", value: "2" },
          ]}
        />
      </Space>
      <BlockTitle title="按钮" />
      <Space size="middle" className="w-full">
        <CustomButton
          permission={["button:create"]}
          variant="primary"
          size="small"
        >
          Primary
        </CustomButton>
        <CustomButton variant="secondary" size="medium">
          Secondary
        </CustomButton>
        <CustomButton variant="danger" size="large">
          Danger
        </CustomButton>
        <CustomButton variant="warning" className="!text-red-500">
          Warning
        </CustomButton>
        <CustomButton
          variant="success"
          onClick={() => message.success("Success")}
        >
          Success
        </CustomButton>
        <CustomButton variant="info">Info</CustomButton>
        <CustomButton variant="link">Link</CustomButton>
        <CustomButton variant="ghost">Ghost</CustomButton>
      </Space>

      <BlockTitle title="表格" />
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
