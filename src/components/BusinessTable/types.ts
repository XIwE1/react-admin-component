/** 与后端 meta 对齐；后续若增加字段可在此扩展 */
export interface ListMeta {
  page: number;
  size: number;
  total: number;
}

/** 拉取列表时传入的分页 + 筛选（筛选键由业务泛型 TFilter 决定） */
export interface ListQueryParams<TFilter extends Record<string, unknown> = Record<string, unknown>> {
  page: number;
  size: number;
  filters: TFilter;
}

/** 表格内部使用的统一结果结构，与具体接口里的 list 字段名解耦 */
export interface ListLoadResult<TRecord> {
  rows: TRecord[];
  meta: ListMeta;
}

/**
 * 通用「分页 + 列表」接口 data 形态：任意 list 字段名 + meta。
 * 例：{ userList: User[], meta: {...} }
 */
export type PaginatedListData<TItem, TListKey extends string> = {
  meta: ListMeta;
} & { [K in TListKey]: TItem[] };

/** 常见外层 { code, data } 包一层；code 语义由业务约定 */
export interface ApiEnvelope<TData, TCode = number> {
  code: TCode;
  data: TData;
}
