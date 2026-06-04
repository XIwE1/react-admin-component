import React, { createContext, useContext, useEffect, useState } from "react";
import { Button, Form, Result, Space, Table } from "antd";
import useTable from "./useTable";
import { WithPermission } from "../Permission";


// 筛选
// 分页
// 权限
// 多模板

const TableContext = createContext({});

interface ProTableProps {
  request: any;
  columns?: any[];
  children?: React.ReactNode;
}

interface ProTableWithPermissionProps extends ProTableProps {
  permission?: string[];
}
function ProTable(props: any) {
  const { request } = props;

  // const { data, loading, setPagination, pagination, fetchData } =
  const table = useTable(request);

  return (
    <TableContext.Provider value={table}>
      {props.children}
    </TableContext.Provider>
  );
}

PermissionProTable.Header = function (props: any) {
  const table = useContext(TableContext);
  const [form] = Form.useForm();
  return (
    <Form
      form={form}
      layout="inline"
      className="mb-4"
      onFinish={(values) => table.fetchData({ ...values, page: 1 })}
    >
      <Form.Item className="mb-0">
        <Space>
          {props.children}
          <Button type="primary" htmlType="submit">
            查询
          </Button>
          <Button
            onClick={() => {
              form.resetFields();
              table.fetchData({ page: 1 });
            }}
          >
            重置
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

PermissionProTable.Table = function (props: Pick<ProTableProps, "columns">) {
  const table = useContext(TableContext);
  const { data, loading, setPagination, pagination, fetchData } = table as any;

  return (
    <Table
      rowKey={"id"}
      pagination={pagination}
      columns={props.columns}
      dataSource={data}
      loading={loading}
      onChange={(pag) => {
        setPagination((prev) => ({
          ...prev,
          current: pag.current!,
          pageSize: pag.pageSize!,
        }));
      }}
    />
  );
};

export default function PermissionProTable(props: ProTableWithPermissionProps) {
  const { permission, ...rest } = props;
  return (
    <WithPermission permission={permission} fallback={<Result status="403" />}>
      <ProTable {...rest} />
      {/* {props.children} */}
    </WithPermission>
  );
};

// ProTable.Pagination = Pagination;
// ProTable.ToolBar = ToolBar;
