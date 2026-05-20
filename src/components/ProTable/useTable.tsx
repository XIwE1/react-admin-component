import { useEffect, useState } from "react";

type SortFields = "default" | "asc" | "desc";

interface TableProps {
  request: any;
}

export default function useTable(props: TableProps) {
  const { request } = props;
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [sort, setSort] = useState({ field: "", sort: "" });

  async function fetchData(params: { page?: number; pageSize?: number } = {}) {
    setLoading(true);

    const page = params.page ?? pagination.current;
    const pageSize = params.pageSize ?? pagination.pageSize;

    const res = await request({
      page,
      pageSize,
      field: sort.field,
      sortBy: sort.sort,
      ...params,
    });

    setData(res.list ?? []);
    setPagination((prev) => ({
      ...prev,
      current: page,
      pageSize,
      total: res.total ?? 0,
    }));
    setLoading(false);
  }

  useEffect(() => {
    fetchData();
  }, [pagination.current, pagination.pageSize]);

  return {
    data,
    loading,
    pagination,
    fetchData,
    setPagination,
  };
}
