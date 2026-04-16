import { Button, Input, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import type { BodyKVRow } from "../types";
import { apiTw } from "../constants";

export interface RequestBodyTableProps {
  rows: BodyKVRow[];
  onChangeKey: (id: string, key: string) => void;
  onChangeValue: (id: string, value: string) => void;
  onAddRow: () => void;
  onRemoveRow: (id: string) => void;
  disabled?: boolean;
}

/**
 * 请求体：键值表格。无字段名时仅填「值」列，按整段 JSON 解析（与原先文本域一致）。
 */
export function RequestBodyTable({
  rows,
  onChangeKey,
  onChangeValue,
  onAddRow,
  onRemoveRow,
  disabled,
}: RequestBodyTableProps) {
  const columns: ColumnsType<BodyKVRow> = [
    {
      title: "字段名",
      dataIndex: "key",
      width: "28%",
      render: (_: unknown, record) => (
        <Input
          className={apiTw.mono}
          placeholder="例如 name"
          value={record.key}
          disabled={disabled}
          onChange={(e) => onChangeKey(record.id, e.target.value)}
          allowClear
        />
      ),
    },
    {
      title: "值",
      dataIndex: "value",
      render: (_: unknown, record) => (
        <Input
          className={apiTw.mono}
          placeholder='字符串或 JSON 片段，如 "a" 或 123 或 {"x":1}'
          value={record.value}
          disabled={disabled}
          onChange={(e) => onChangeValue(record.id, e.target.value)}
          allowClear
        />
      ),
    },
    {
      title: <span className="tabular-nums">操作</span>,
      key: "action",
      width: 72,
      align: "center",
      render: (_: unknown, record) => (
        <Button type="link" size="small" danger disabled={disabled} onClick={() => onRemoveRow(record.id)}>
          删除
        </Button>
      ),
    },
  ];

  return (
    <div className="overflow-x-auto rounded border border-black/[0.08]">
      <Table<BodyKVRow>
        pagination={false}
        rowKey="id"
        dataSource={rows}
        columns={columns}
        className="[&_.ant-table-cell]:align-middle"
        locale={{ emptyText: "暂无行，点击下方添加" }}
      />
      <div className="border-t border-black/[0.08] bg-black/[0.02] px-5 py-5">
        <Button
          type="dashed"
          // size="large"
          block
          disabled={disabled}
          onClick={onAddRow}
          className="!h-auto !px-6 !py-3.5 "
        >
          添加一行
        </Button>
      </div>
    </div>
  );
}
