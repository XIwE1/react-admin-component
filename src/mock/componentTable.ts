export interface ComponentTableRow {
  id: number;
  name: string;
  status: "active" | "inactive";
  amount: number;
  createTime: string;
}

export interface ComponentTableQuery {
  page: number;
  pageSize: number;
  field?: string;
  sortBy?: string;
}

export interface ComponentTableResult {
  list: ComponentTableRow[];
  total: number;
}

const MOCK_ROWS: ComponentTableRow[] = Array.from({ length: 53 }, (_, i) => {
  const id = i + 1;
  return {
    id,
    name: `商品-${String(id).padStart(3, "0")}`,
    status: id % 3 === 0 ? "inactive" : "active",
    amount: Math.round((id * 137.5 + 99) * 100) / 100,
    createTime: `2025-${String((id % 12) + 1).padStart(2, "0")}-${String(
      (id % 28) + 1
    ).padStart(2, "0")} 10:00:00`,
  };
});

function delay(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

/** 模拟分页列表接口，入参与 useTable 中 request 调用一致 */
export async function fetchMockComponentTable(
  params: ComponentTableQuery
): Promise<ComponentTableResult> {
  await delay(400);

  const page = Math.max(1, params.page ?? 1);
  const pageSize = Math.max(1, params.pageSize ?? 10);
  const total = MOCK_ROWS.length;
  const start = (page - 1) * pageSize;
  const list =
    start >= total ? [] : MOCK_ROWS.slice(start, start + pageSize);

  return {
    list,
    total,
  };
}
