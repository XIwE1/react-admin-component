import React, { useMemo, useCallback, useRef, useState } from "react";
import { Button, Input, Popconfirm, Space, message } from "antd";
import type { ColumnsType } from "antd/es/table";
import { BusinessTable } from "@/components/BusinessTable";
import type { ListQueryParams } from "@/components/BusinessTable";
import { USER_LIST_INITIAL_FILTERS } from "../userList/constants";
import { fetchUserListPage, resolveUserListOrigin } from "../userList/fetchUserList";
import { createUser, deleteUserById, updateUser } from "../userList/userMutations";
import type { UserRow, UserListFilters } from "../userList/types";
import { UserFormModal, type UserFormModalMode } from "./UserFormModal";

function formatTime(iso: string): string {
  if (!iso) return "";
  return iso.slice(0, 19).replace("T", " ");
}

export interface UserListSectionProps {
  host: string;
  port: string;
}

type UserModalState =
  | null
  | { mode: "create" }
  | { mode: "edit"; record: UserRow };

export function UserListSection({ host, port }: UserListSectionProps) {
  const reloadRef = useRef<() => void>(() => {});
  const [userModal, setUserModal] = useState<UserModalState>(null);

  const onTableReady = useCallback((c: { reload: () => void }) => {
    reloadRef.current = c.reload;
  }, []);

  const origin = useMemo(() => resolveUserListOrigin(host, port), [host, port]);

  const closeUserModal = useCallback(() => {
    setUserModal(null);
  }, []);

  const handleDelete = useCallback(
    async (record: UserRow) => {
      try {
        await deleteUserById(origin, record.ID);
        message.success("已删除");
        reloadRef.current();
      } catch (e) {
        message.error(e instanceof Error ? e.message : "删除失败");
      }
    },
    [origin]
  );

  const columns: ColumnsType<UserRow> = useMemo(
    () => [
      { title: "ID", dataIndex: "ID", width: 72, fixed: "left" },
      { title: "姓名", dataIndex: "name", width: 140 },
      { title: "邮箱", dataIndex: "email", ellipsis: true },
      { title: "创建时间", dataIndex: "created_at", width: 180, render: (v: string) => formatTime(v) },
      { title: "更新时间", dataIndex: "updated_at", width: 180, render: (v: string) => formatTime(v) },
      {
        title: "操作",
        key: "actions",
        width: 140,
        fixed: "right",
        render: (_: unknown, record) => (
          <Space size="small">
            <Button type="link" size="small" onClick={() => setUserModal({ mode: "edit", record })}>
              修改
            </Button>
            <Popconfirm
              title="确定删除该用户？"
              okText="删除"
              cancelText="取消"
              okButtonProps={{ danger: true }}
              onConfirm={() => handleDelete(record)}
            >
              <Button type="link" size="small" danger>
                删除
              </Button>
            </Popconfirm>
          </Space>
        ),
      },
    ],
    [handleDelete]
  );

  const onLoad = useCallback(
    async (params: ListQueryParams<UserListFilters>) => {
      return fetchUserListPage(origin, params);
    },
    [origin]
  );

  const modalMode: UserFormModalMode | null = userModal?.mode ?? null;
  const modalOpen = userModal !== null;
  const editingUser = userModal?.mode === "edit" ? userModal.record : null;

  return (
    <>
      <BusinessTable<UserRow, UserListFilters>
        rowKey="ID"
        columns={columns}
        initialFilters={USER_LIST_INITIAL_FILTERS}
        defaultPageSize={10}
        onLoad={onLoad}
        onReady={onTableReady}
        serverSortable={[
          { dataIndex: "created_at", sortKey: "created_at" },
          { dataIndex: "updated_at", sortKey: "updated_at" },
        ]}
        toolbarExtra={
          <Button type="default" onClick={() => setUserModal({ mode: "create" })}>
            创建
          </Button>
        }
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

      {modalMode ? (
        <UserFormModal
          open={modalOpen}
          mode={modalMode}
          editingUser={editingUser}
          onClose={closeUserModal}
          onSuccess={() => reloadRef.current()}
          onCreate={(payload) => createUser(origin, payload)}
          onUpdate={(payload) => updateUser(origin, payload)}
        />
      ) : null}
    </>
  );
}
