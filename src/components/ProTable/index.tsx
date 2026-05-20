import React, { useEffect, useState } from "react";
import { Table } from "antd";
import useTable from "./useTable";

// 排序
// 筛选
// 分页
// 选择
// 虚拟列表
// 权限
// 操作列
// 自定义render
// 固定列
// 拖拽
// 多模板

interface ProTableProps {
  request: any;
  columns: any[];
}

export default function ProTable(props: ProTableProps) {
  const { request, columns } = props;

  const { data, loading, setPagination, pagination, fetchData } =
    useTable(request);

  return (
    <div>
      <Table
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
      />
      {/* <Pagination {...props} /> */}
    </div>
  );
}

// ProTable.Pagination = Pagination;
// ProTable.ToolBar = ToolBar;
