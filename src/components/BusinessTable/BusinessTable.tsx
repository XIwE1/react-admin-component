import { useCallback, useEffect, useMemo, useState } from "react";
import type { ComponentProps, Key, ReactNode } from "react";
import { Button, Space, Table, message } from "antd";
import type { TableProps } from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import type { ListLoadResult, ListMeta, ListQueryParams, ListSort } from "./types";

export interface BusinessTableFilterApi<TFilter extends Record<string, unknown>> {
  filters: TFilter;
  setFilters: (patch: Partial<TFilter> | ((prev: TFilter) => TFilter)) => void;
  loading: boolean;
  /** 应用当前筛选并从第 1 页拉数 */
  submitSearch: () => void;
  /** 使用当前分页与已应用筛选重新拉数 */
  reload: () => void;
}

export interface BusinessTableProps<
  TRecord,
  TFilter extends Record<string, unknown> = Record<string, unknown>,
> {
  columns: ColumnsType<TRecord>;
  /** 初始筛选；字段可任意扩展，由 renderFilters + onLoad 共同约定 */
  initialFilters: TFilter;
  defaultPageSize?: number;
  pageSizeOptions?: number[];
  /** 表头筛选区（仅筛选项，查询/重置由组件统一提供） */
  renderFilters: (api: BusinessTableFilterApi<TFilter>) => ReactNode;
  /** 由调用方组 URL、调接口并把响应映射为 rows + meta */
  onLoad: (params: ListQueryParams<TFilter>) => Promise<ListLoadResult<TRecord>>;
  rowKey?: keyof TRecord | ((record: TRecord) => Key);
  tableProps?: Omit<
    ComponentProps<typeof Table<TRecord>>,
    "columns" | "dataSource" | "loading" | "pagination" | "rowKey"
  >;
  /** 挂载后提供 reload，便于行内删除/编辑后刷新列表 */
  onReady?: (ctrl: { reload: () => void }) => void;
  /** 插在「查询」与「重置筛选」之间，例如「创建」 */
  toolbarExtra?: ReactNode;
  /**
   * 服务端排序：表头 dataIndex 与列一致，sortKey 会出现在 {@link ListQueryParams.sort} 的 `field` 中。
   * 不配置则无排序交互。
   */
  serverSortable?: { dataIndex: string; sortKey: string }[];
}

const emptyMeta: ListMeta = { page: 1, size: 10, total: 0 };

export function BusinessTable<TRecord, TFilter extends Record<string, unknown>>(
  props: BusinessTableProps<TRecord, TFilter>
) {
  const {
    columns,
    initialFilters,
    defaultPageSize = 10,
    pageSizeOptions = [10, 20, 50],
    renderFilters,
    onLoad,
    rowKey = "id" as keyof TRecord,
    tableProps,
    onReady,
    toolbarExtra,
    serverSortable,
  } = props;

  const [draftFilters, setDraftFilters] = useState<TFilter>(() => ({ ...initialFilters }));
  const [appliedFilters, setAppliedFilters] = useState<TFilter>(() => ({ ...initialFilters }));
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(defaultPageSize);
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState<TRecord[]>([]);
  const [meta, setMeta] = useState<ListMeta>(emptyMeta);
  const [reloadTick, setReloadTick] = useState(0);
  const [listSort, setListSort] = useState<{
    dataIndex: string;
    sortKey: string;
    order: "asc" | "desc";
  } | null>(null);

  const setFilters = useCallback((patch: Partial<TFilter> | ((prev: TFilter) => TFilter)) => {
    setDraftFilters((prev) => (typeof patch === "function" ? patch(prev) : { ...prev, ...patch }));
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const sort: ListSort | null = listSort
          ? { field: listSort.sortKey, order: listSort.order }
          : null;
        const result = await onLoad({
          page,
          size: pageSize,
          filters: appliedFilters,
          sort,
        });
        if (!cancelled) {
          setRows(result.rows);
          setMeta(result.meta);
        }
      } catch (e) {
        if (!cancelled) {
          setRows([]);
          setMeta((m) => ({ ...m, total: 0 }));
          message.error(e instanceof Error ? e.message : "列表加载失败");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [page, pageSize, appliedFilters, onLoad, reloadTick, listSort]);

  const submitSearch = useCallback(() => {
    setAppliedFilters({ ...draftFilters });
    setPage(1);
  }, [draftFilters]);

  const reload = useCallback(() => {
    setReloadTick((t) => t + 1);
  }, []);

  useEffect(() => {
    onReady?.({ reload });
  }, [onReady, reload]);

  const resetFilters = useCallback(() => {
    const next = { ...initialFilters } as TFilter;
    setDraftFilters(next);
    setAppliedFilters(next);
    setPage(1);
    if (serverSortable?.length) {
      setListSort(null);
    }
  }, [initialFilters, serverSortable]);

  const filterApi: BusinessTableFilterApi<TFilter> = {
    filters: draftFilters,
    setFilters,
    loading,
    submitSearch,
    reload,
  };

  const pagination: TablePaginationConfig = {
    current: page,
    pageSize,
    total: meta.total,
    showSizeChanger: true,
    pageSizeOptions: pageSizeOptions.map(String),
    showTotal: (t) => `共 ${t} 条`,
  };

  const resolveRowKey =
    typeof rowKey === "function" ? rowKey : (record: TRecord) => record[rowKey] as Key;

  const displayedColumns: ColumnsType<TRecord> = useMemo(() => {
    if (!serverSortable?.length) {
      return columns;
    }
    return columns.map((col) => {
      const dataIndex = (col as { dataIndex?: string | string[] }).dataIndex;
      const key = Array.isArray(dataIndex) ? dataIndex.join(".") : dataIndex;
      if (typeof key !== "string") {
        return col;
      }
      const cfg = serverSortable.find((s) => s.dataIndex === key);
      if (!cfg) {
        return col;
      }
      const active = listSort?.dataIndex === key;
      return {
        ...col,
        sorter: true,
        sortOrder: active
          ? listSort!.order === "asc"
            ? "ascend"
            : "descend"
          : undefined,
      };
    });
  }, [columns, serverSortable, listSort]);

  const { onChange: userTableOnChange, ...restTableProps } = tableProps ?? {};

  const handleTableChange: NonNullable<TableProps<TRecord>["onChange"]> = useCallback(
    (pag, filters, sorter, extra) => {
      if (serverSortable?.length && extra?.action === "sort") {
        const s = Array.isArray(sorter) ? sorter[0] : sorter;
        if (!s) {
          setListSort(null);
          setPage(1);
          userTableOnChange?.(pag, filters, sorter, extra);
          return;
        }
        if (s.order == null) {
          setListSort(null);
          setPage(1);
          userTableOnChange?.(pag, filters, sorter, extra);
          return;
        }
        if (s.field === undefined || s.field === null) {
          setListSort(null);
          setPage(1);
          userTableOnChange?.(pag, filters, sorter, extra);
          return;
        }
        const name = String(s.field);
        const cfg = serverSortable.find((c) => c.dataIndex === name);
        if (!cfg) {
          userTableOnChange?.(pag, filters, sorter, extra);
          return;
        }
        setListSort({
          dataIndex: cfg.dataIndex,
          sortKey: cfg.sortKey,
          order: s.order === "ascend" ? "asc" : "desc",
        });
        setPage(1);
        userTableOnChange?.(pag, filters, sorter, extra);
        return;
      }

      if (pag?.pageSize !== undefined && pag.pageSize !== pageSize) {
        setPageSize(pag.pageSize);
        setPage(1);
      } else if (pag?.current !== undefined) {
        setPage(pag.current);
      }
      userTableOnChange?.(pag, filters, sorter, extra);
    },
    [serverSortable, pageSize, userTableOnChange]
  );

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-end gap-3 rounded border border-black/[0.08] bg-black/[0.02] px-4 py-3">
        <div className="flex min-w-0 flex-1 flex-wrap items-end gap-3">{renderFilters(filterApi)}</div>
        <Space className="shrink-0">
          <Button type="primary" loading={loading} onClick={submitSearch}>
            查询
          </Button>
          {toolbarExtra}
          <Button disabled={loading} onClick={resetFilters}>
            重置筛选
          </Button>
        </Space>
      </div>

      <Table<TRecord>
        size="small"
        rowKey={resolveRowKey}
        columns={displayedColumns}
        dataSource={rows}
        loading={loading}
        onChange={handleTableChange}
        pagination={pagination}
        scroll={{ x: "max-content" }}
        {...restTableProps}
      />
    </div>
  );
}
