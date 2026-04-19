import type { UserListFilters } from "./types";

/** 列表接口路径；换资源时只改此处 */
export const USER_LIST_PATH = "/user/list" as const;

export const USER_LIST_INITIAL_FILTERS: UserListFilters = {
  name: "",
  email: "",
};
