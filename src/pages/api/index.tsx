import { Input, Select, Button, Typography } from "antd";
import { FieldRow } from "./components/FieldRow";
import { LabeledBlock } from "./components/LabeledBlock";
import { UriWithHistoryInput } from "./components/UriWithHistoryInput";
import { RequestBodyTable } from "./components/RequestBodyTable";
import { apiTw, DEFAULT_HOST, DEFAULT_PORT, HTTP_METHOD_OPTIONS } from "./constants";
import { useHttpDebugger } from "./useHttpDebugger";
import type { HttpDebugMethod } from "./types";

const { TextArea } = Input;

export default function Api() {
  const {
    host,
    setHost,
    port,
    setPort,
    method,
    setMethod,
    uri,
    setUri,
    bodyRows,
    updateBodyKey,
    updateBodyValue,
    addBodyRow,
    removeBodyRow,
    bodyTextForHistory,
    responseText,
    sending,
    send,
    requestHistory,
    clearRequestHistory,
    applyHistoryItem,
  } = useHttpDebugger();

  return (
    <div className={apiTw.page}>
      <Typography.Title level={5} className="!mb-0">
        HTTP 调试
      </Typography.Title>

      <FieldRow label="地址">
        <Input
          className="max-w-[280px]"
          placeholder={DEFAULT_HOST}
          value={host}
          onChange={(e) => setHost(e.target.value)}
          allowClear
        />
        <span className="text-black/45">:</span>
        <Input
          className="max-w-[100px]"
          placeholder={DEFAULT_PORT}
          value={port}
          onChange={(e) => setPort(e.target.value)}
          allowClear
        />
      </FieldRow>

      <FieldRow label="请求">
        <Select<HttpDebugMethod>
          className="w-[100px]"
          value={method}
          onChange={setMethod}
          options={HTTP_METHOD_OPTIONS}
        />
        <UriWithHistoryInput
          placeholder="URI，如 /api/user"
          value={uri}
          onChange={setUri}
          history={requestHistory}
          bodyText={bodyTextForHistory}
          onPickHistory={applyHistoryItem}
          onSend={send}
          disabled={sending}
        />
        <Button danger type="default" disabled={sending} onClick={clearRequestHistory}>
          清空缓存
        </Button>
      </FieldRow>

      <LabeledBlock label="请求体（非 GET 时生效）">
        <RequestBodyTable
          rows={bodyRows}
          onChangeKey={updateBodyKey}
          onChangeValue={updateBodyValue}
          onAddRow={addBodyRow}
          onRemoveRow={removeBodyRow}
          disabled={sending}
        />
      </LabeledBlock>

      <div>
        <Button type="primary" loading={sending} disabled={sending} onClick={send}>
          发送请求
        </Button>
      </div>

      <LabeledBlock label="响应" className="flex min-h-0 flex-1 flex-col">
        <TextArea
          value={responseText}
          readOnly
          placeholder="发送请求后在此展示状态码、响应头与响应体"
          rows={14}
          className={`${apiTw.mono} ${apiTw.responseArea} min-h-[200px] flex-1`}
        />
      </LabeledBlock>
    </div>
  );
}
