import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import { message } from "antd";
import {
  normalizePath,
  executeHttpDebugRequest,
  serializeCaughtError,
  rowsToBodyData,
  bodyTextToRows,
  serializeBodyForHistory,
  createEmptyBodyRow,
} from "./httpDebug";
import type { BodyKVRow, HttpDebugMethod } from "./types";
import { DEFAULT_HOST, DEFAULT_PORT } from "./constants";
import {
  appendRequestHistory,
  clearAllRequestHistory,
  readRequestHistory,
  type RequestHistoryItem,
} from "./uriHistoryStorage";

export function useHttpDebugger() {
  const [host, setHost] = useState(DEFAULT_HOST);
  const [port, setPort] = useState(DEFAULT_PORT);
  const [method, setMethod] = useState<HttpDebugMethod>("GET");
  const [uri, setUri] = useState("");
  const [bodyRows, setBodyRows] = useState<BodyKVRow[]>(() => [createEmptyBodyRow()]);
  const [responseText, setResponseText] = useState("");
  const [sending, setSending] = useState(false);
  const sendingRef = useRef(false);
  const [requestHistory, setRequestHistory] = useState<RequestHistoryItem[]>(() => readRequestHistory());

  useEffect(() => {
    setRequestHistory(readRequestHistory());
  }, []);

  const clearRequestHistory = useCallback(() => {
    clearAllRequestHistory();
    setRequestHistory([]);
  }, []);

  const applyHistoryItem = useCallback((item: RequestHistoryItem) => {
    setMethod(item.method);
    setUri(item.uri);
    setBodyRows(bodyTextToRows(item.bodyText));
  }, []);

  const updateBodyKey = useCallback((id: string, key: string) => {
    setBodyRows((rows) => rows.map((r) => (r.id === id ? { ...r, key } : r)));
  }, []);

  const updateBodyValue = useCallback((id: string, value: string) => {
    setBodyRows((rows) => rows.map((r) => (r.id === id ? { ...r, value } : r)));
  }, []);

  const addBodyRow = useCallback(() => {
    setBodyRows((rows) => [...rows, createEmptyBodyRow()]);
  }, []);

  const removeBodyRow = useCallback((id: string) => {
    setBodyRows((rows) => {
      if (rows.length <= 1) return [createEmptyBodyRow()];
      return rows.filter((r) => r.id !== id);
    });
  }, []);

  /** 与历史记录、URI 下拉筛选用的 JSON 文本（与原先 bodyText 语义一致） */
  const bodyTextForHistory = useMemo(() => {
    const r = rowsToBodyData(bodyRows);
    if (!r.ok) return "";
    return serializeBodyForHistory(r.data);
  }, [bodyRows]);

  const send = useCallback(async () => {
    if (sendingRef.current) return;

    const h = host.trim() || DEFAULT_HOST;
    const p = port.trim() || DEFAULT_PORT;
    const path = normalizePath(uri);

    if (!h) {
      message.error("请输入 IP 或主机名");
      return;
    }
    if (!p) {
      message.error("请输入端口");
      return;
    }
    if (!path) {
      message.error("请输入请求 URI");
      return;
    }

    let bodyData: unknown | undefined = undefined;
    if (method !== "GET") {
      const parsed = rowsToBodyData(bodyRows);
      if (!parsed.ok) {
        message.error("请求体不是合法 JSON");
        return;
      }
      bodyData = parsed.data;
    }

    sendingRef.current = true;
    setSending(true);
    setResponseText("");
    try {
      const text = await executeHttpDebugRequest({
        host: h,
        port: p,
        path,
        method,
        bodyData,
      });
      setResponseText(text);
      appendRequestHistory({
        method,
        uri: path,
        bodyText: serializeBodyForHistory(bodyData),
      });
      setRequestHistory(readRequestHistory());
    } catch (err) {
      setResponseText(serializeCaughtError(err));
    } finally {
      sendingRef.current = false;
      setSending(false);
    }
  }, [host, port, method, uri, bodyRows]);

  return {
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
  };
}
