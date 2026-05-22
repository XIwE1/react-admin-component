import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from 'react'
import { Table, Spin } from 'antd'

/**
 * =========================
 * types
 * =========================
 */

interface TableContextType {
  data: any[]
  loading: boolean
  pagination: {
    current: number
    pageSize: number
    total: number
  }

  setPagination: React.Dispatch<
    React.SetStateAction<{
      current: number
      pageSize: number
      total: number
    }>
  >

  columns: any[]
  refresh: () => void
}

interface ProTableProps {
  request: (params: any) => Promise<{
    list: any[]
    total: number
  }>

  columns: any[]

  children: ReactNode
}

interface ToolbarProps {
  children: ReactNode
}

interface SearchProps {
  children: ReactNode
}

interface TableViewProps {
  bordered?: boolean
}

/**
 * =========================
 * context
 * =========================
 */

const TableContext = createContext<TableContextType | null>(null)

function useTableContext() {
  const context = useContext(TableContext)

  if (!context) {
    throw new Error(
      'ProTable compound components must be used inside <ProTable>'
    )
  }

  return context
}

/**
 * =========================
 * root component
 * =========================
 */

function ProTable({
  request,
  columns,
  children,
}: ProTableProps) {
  const [data, setData] = useState<any[]>([])

  const [loading, setLoading] = useState(false)

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  })

  async function fetchData(extraParams = {}) {
    setLoading(true)

    try {
      const res = await request({
        page: pagination.current,
        pageSize: pagination.pageSize,
        ...extraParams,
      })

      setData(res.list)

      setPagination((prev) => ({
        ...prev,
        total: res.total,
      }))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [pagination.current, pagination.pageSize])

  const contextValue = useMemo(
    () => ({
      data,
      loading,
      pagination,
      setPagination,
      columns,
      refresh: fetchData,
    }),
    [data, loading, pagination, columns]
  )

  return (
    <TableContext.Provider value={contextValue}>
      <div className="pro-table">
        {children}
      </div>
    </TableContext.Provider>
  )
}

/**
 * =========================
 * toolbar
 * =========================
 */

function Toolbar({ children }: ToolbarProps) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: 16,
      }}
    >
      {children}
    </div>
  )
}

/**
 * =========================
 * search
 * =========================
 */

function Search({ children }: SearchProps) {
  return (
    <div
      style={{
        background: '#fff',
        padding: 16,
        borderRadius: 8,
        marginBottom: 16,
      }}
    >
      {children}
    </div>
  )
}

/**
 * =========================
 * table view
 * =========================
 */

function TableView({
  bordered = true,
}: TableViewProps) {
  const {
    data,
    loading,
    columns,
    pagination,
    setPagination,
  } = useTableContext()

  return (
    <Table
      rowKey="id"
      bordered={bordered}
      loading={loading}
      columns={columns}
      dataSource={data}
      pagination={pagination}
      onChange={(pageInfo) => {
        setPagination((prev) => ({
          ...prev,
          current: pageInfo.current || 1,
          pageSize: pageInfo.pageSize || 10,
        }))
      }}
    />
  )
}

/**
 * =========================
 * loading
 * =========================
 */

function Loading() {
  const { loading } = useTableContext()

  if (!loading) return null

  return (
    <div
      style={{
        padding: 24,
        textAlign: 'center',
      }}
    >
      <Spin />
    </div>
  )
}

/**
 * =========================
 * compound exports
 * =========================
 */

ProTable.Toolbar = Toolbar
ProTable.Search = Search
ProTable.Table = TableView
ProTable.Loading = Loading

export default ProTable