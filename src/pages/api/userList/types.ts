import type { ApiEnvelope, PaginatedListData } from "@/components/BusinessTable";

/** 用户行：与后端字段对齐；新增列时在此补类型 */
export interface UserRow {
  ID: number;
  created_at: string;
  updated_at: string;
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

/** 更新用户请求体（字段名与后端约定） */
export interface UserUpdatePayload {
  Id: number;
  name: string;
  email: string;
}

/** 创建用户请求体 */
export interface UserCreatePayload {
  name: string;
  email: string;
}

/** 简单 code 响应 */
export interface UserMutationApiResponse {
  code: number;
  msg?: string;
  data?: unknown;
}
