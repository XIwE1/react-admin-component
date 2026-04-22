import type { UserListFilters } from "./types";

/** 列表接口路径；换资源时只改此处 */
export const USER_LIST_PATH = "/user/list" as const;

export const USER_DELETE_PATH = "/user/delete" as const;

export const USER_UPDATE_PATH = "/user/update" as const;

export const USER_CREATE_PATH = "/user/add" as const;

export const USER_LIST_INITIAL_FILTERS: UserListFilters = {
  name: "",
  email: "",
};
