import { useMemo, useCallback } from "react";
import { Input, Space } from "antd";
import type { ColumnsType } from "antd/es/table";
import { BusinessTable } from "@/components/BusinessTable";
import type { ListQueryParams } from "@/components/BusinessTable";
import { USER_LIST_INITIAL_FILTERS } from "../userList/constants";
import { fetchUserListPage, resolveUserListOrigin } from "../userList/fetchUserList";
import type { UserRow, UserListFilters } from "../userList/types";

function formatTime(iso: string): string {
  if (!iso) return "";
  return iso.slice(0, 19).replace("T", " ");
}

export interface UserListSectionProps {
  host: string;
  port: string;
}

export function UserListSection({ host, port }: UserListSectionProps) {
  const columns: ColumnsType<UserRow> = useMemo(
    () => [
      { title: "ID", dataIndex: "ID", width: 72, fixed: "left" },
      { title: "姓名", dataIndex: "name", width: 140 },
      { title: "邮箱", dataIndex: "email", ellipsis: true },
      { title: "创建时间", dataIndex: "CreatedAt", width: 180, render: (v: string) => formatTime(v) },
      { title: "更新时间", dataIndex: "UpdatedAt", width: 180, render: (v: string) => formatTime(v) },
    ],
    []
  );

  const onLoad = useCallback(
    async (params: ListQueryParams<UserListFilters>) => {
      const origin = resolveUserListOrigin(host, port);
      return fetchUserListPage(origin, params);
    },
    [host, port]
  );

  return (
    <BusinessTable<UserRow, UserListFilters>
      rowKey="ID"
      columns={columns}
      initialFilters={USER_LIST_INITIAL_FILTERS}
      defaultPageSize={10}
      onLoad={onLoad}
      renderFilters={({ filters, setFilters }) => (
        <Space wrap size="middle">
          <Space size="small">
            <span className="text-black/65">name</span>
            <Input
              allowClear
              placeholder="按姓名筛选"
              value={filters.name}
              onChange={(e) => setFilters({ name: e.target.value })}
              style={{ width: 200 }}
            />
          </Space>
          <Space size="small">
            <span className="text-black/65">email</span>
            <Input
              allowClear
              placeholder="按邮箱筛选"
              value={filters.email}
              onChange={(e) => setFilters({ email: e.target.value })}
              style={{ width: 220 }}
            />
          </Space>
        </Space>
      )}
    />
  );
}
