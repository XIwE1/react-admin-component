import { useState, useCallback, useRef } from "react";
import { message } from "antd";
import {
  normalizePath,
  parseJsonBody,
  executeHttpDebugRequest,
  serializeCaughtError,
} from "./httpDebug";
import type { HttpDebugMethod } from "./types";
import { DEFAULT_HOST, DEFAULT_PORT } from "./constants";

export function useHttpDebugger() {
  const [host, setHost] = useState(DEFAULT_HOST);
  const [port, setPort] = useState(DEFAULT_PORT);
  const [method, setMethod] = useState<HttpDebugMethod>("GET");
  const [uri, setUri] = useState("");
  const [bodyText, setBodyText] = useState("");
  const [responseText, setResponseText] = useState("");
  const [sending, setSending] = useState(false);
  const sendingRef = useRef(false);

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
      const parsed = parseJsonBody(bodyText);
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
    } catch (err) {
      setResponseText(serializeCaughtError(err));
    } finally {
      sendingRef.current = false;
      setSending(false);
    }
  }, [host, port, method, uri, bodyText]);

  return {
    host,
    setHost,
    port,
    setPort,
    method,
    setMethod,
    uri,
    setUri,
    bodyText,
    setBodyText,
    responseText,
    sending,
    send,
  };
}
