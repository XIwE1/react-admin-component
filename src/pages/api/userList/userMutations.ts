import axios, { type AxiosResponse } from "axios";
import { USER_CREATE_PATH, USER_DELETE_PATH, USER_UPDATE_PATH } from "./constants";
import type { UserCreatePayload, UserMutationApiResponse, UserUpdatePayload } from "./types";

function assertMutationOk(res: AxiosResponse<UserMutationApiResponse>, action: string): void {
  if (res.status !== 200) {
    throw new Error(`${action} HTTP ${res.status}`);
  }
  const body = res.data;
  if (typeof body !== "object" || body === null) {
    throw new Error(`${action} 响应无效`);
  }
  if (body.code !== 0) {
    throw new Error(body.msg || `${action} 失败（code ${body.code}）`);
  }
}

export async function deleteUserById(origin: string, id: number): Promise<void> {
  const base = origin.replace(/\/$/, "");
  const url = `${base}${USER_DELETE_PATH}`;
  const res = await axios.post<UserMutationApiResponse>(
    url,
    { Id: id },
    {
      headers: { "Content-Type": "application/json" },
      validateStatus: () => true,
      timeout: 60_000,
    }
  );
  assertMutationOk(res, "删除用户");
}

export async function updateUser(origin: string, payload: UserUpdatePayload): Promise<void> {
  const base = origin.replace(/\/$/, "");
  const url = `${base}${USER_UPDATE_PATH}`;
  const res = await axios.post<UserMutationApiResponse>(url, payload, {
    headers: { "Content-Type": "application/json" },
    validateStatus: () => true,
    timeout: 60_000,
  });
  assertMutationOk(res, "更新用户");
}

export async function createUser(origin: string, payload: UserCreatePayload): Promise<void> {
  const base = origin.replace(/\/$/, "");
  const url = `${base}${USER_CREATE_PATH}`;
  const res = await axios.post<UserMutationApiResponse>(url, payload, {
    headers: { "Content-Type": "application/json" },
    validateStatus: () => true,
    timeout: 60_000,
  });
  assertMutationOk(res, "创建用户");
}
