import type { ApiEnvelope, PaginatedListData } from "@/components/BusinessTable";

/** 用户行：与后端字段对齐；新增列时在此补类型 */
export interface UserRow {
  ID: number;
  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt: string | null;
  name: string;
  email: string;
}

/** 列表筛选：后续增加筛选项时在此扩展 */
export interface UserListFilters extends Record<string, string> {
  name: string;
  email: string;
}

export type UserListData = PaginatedListData<UserRow, "userList">;

export type UserListApiResponse = ApiEnvelope<UserListData>;
