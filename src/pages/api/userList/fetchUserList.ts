import axios from "axios";
import type { ListLoadResult, ListQueryParams } from "@/components/BusinessTable";
import { DEFAULT_HOST, DEFAULT_PORT } from "../constants";
import { USER_LIST_PATH } from "./constants";
import type { UserListApiResponse, UserListFilters, UserRow } from "./types";

export function resolveUserListOrigin(host: string, port: string): string {
  const h = host.trim() || DEFAULT_HOST;
  const p = port.trim() || DEFAULT_PORT;
  return `http://${h}:${p}`;
}

/**
 * 拉取用户分页列表。
 * 查询参数与 {@link ListQueryParams} 对齐，便于与表格组件组合；URL 上可再追加其它键。
 */
export async function fetchUserListPage(
  origin: string,
  params: ListQueryParams<UserListFilters>
): Promise<ListLoadResult<UserRow>> {
  const usp = new URLSearchParams();
  usp.set("page", String(params.page));
  usp.set("size", String(params.size));
  const name = params.filters.name.trim();
  const email = params.filters.email.trim();
  if (name) usp.set("name", name);
  if (email) usp.set("email", email);

  const base = origin.replace(/\/$/, "");
  const url = `${base}${USER_LIST_PATH}?${usp.toString()}`;

  const res = await axios.get<UserListApiResponse>(url, {
    validateStatus: () => true,
    timeout: 60_000,
  });

  if (res.status !== 200) {
    throw new Error(`HTTP ${res.status}`);
  }

  const body = res.data;
  if (typeof body !== "object" || body === null) {
    throw new Error("响应格式错误");
  }
  if (body.code !== 0) {
    throw new Error(`业务 code: ${body.code}`);
  }

  const d = body.data;
  if (!d?.meta || !Array.isArray(d.userList)) {
    throw new Error("data 结构不符合分页列表");
  }

  return {
    rows: d.userList,
    meta: d.meta,
  };
}
