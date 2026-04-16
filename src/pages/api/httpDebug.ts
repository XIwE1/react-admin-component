import axios, { type AxiosResponse } from "axios";
import type { BodyKVRow, HttpDebugMethod } from "./types";

export function normalizePath(raw: string): string {
  const t = raw.trim();
  if (!t) return "";
  return t.startsWith("/") ? t : `/${t}`;
}

export function buildRequestUrl(host: string, port: string, path: string): string {
  return `http://${host.trim()}:${port.trim()}${path}`;
}

export function parseJsonBody(raw: string): { ok: true; data: unknown } | { ok: false } {
  const t = raw.trim();
  if (!t) return { ok: true, data: undefined };
  try {
    return { ok: true, data: JSON.parse(t) as unknown };
  } catch {
    return { ok: false };
  }
}

function newRowId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `row-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function createEmptyBodyRow(): BodyKVRow {
  return { id: newRowId(), key: "", value: "" };
}

/**
 * 表格行 → 请求体：
 * - 有「字段名」时拼成 JSON 对象；值列优先 JSON.parse，失败则按字符串
 * - 全部无字段名时，将所有值列合并为一段文本，按整段 JSON 解析（兼容原 textarea）
 */
export function rowsToBodyData(
  rows: BodyKVRow[]
): { ok: true; data: unknown | undefined } | { ok: false } {
  const keyed = rows.filter((r) => r.key.trim());
  if (keyed.length === 0) {
    const raw = rows
      .map((r) => r.value.trim())
      .filter(Boolean)
      .join("\n")
      .trim();
    if (!raw) return { ok: true, data: undefined };
    try {
      return { ok: true, data: JSON.parse(raw) as unknown };
    } catch {
      return { ok: false };
    }
  }
  const obj: Record<string, unknown> = {};
  for (const row of keyed) {
    const k = row.key.trim();
    const v = row.value.trim();
    if (v === "") {
      obj[k] = "";
      continue;
    }
    try {
      obj[k] = JSON.parse(v) as unknown;
    } catch {
      obj[k] = row.value;
    }
  }
  return { ok: true, data: obj };
}

/** 历史记录 / 粘贴的 JSON 文本 → 表格行 */
export function bodyTextToRows(bodyText: string): BodyKVRow[] {
  const t = bodyText.trim();
  if (!t) return [createEmptyBodyRow()];
  try {
    const data = JSON.parse(t) as unknown;
    if (data !== null && typeof data === "object" && !Array.isArray(data)) {
      return Object.entries(data as Record<string, unknown>).map(([key, val]) => ({
        id: newRowId(),
        key,
        value: typeof val === "string" ? val : JSON.stringify(val),
      }));
    }
  } catch {
    /* 整段当原始 JSON 文本 */
  }
  return [{ id: newRowId(), key: "", value: t }];
}

/** 用于历史去重与 URI 旁路展示的 JSON 字符串 */
export function serializeBodyForHistory(data: unknown | undefined): string {
  if (data === undefined) return "";
  return JSON.stringify(data);
}

export function serializeSuccessResponse(res: AxiosResponse): string {
  return JSON.stringify(
    {
      status: res.status,
      statusText: res.statusText,
      headers: res.headers,
      data: res.data,
    },
    null,
    2
  );
}

export function serializeCaughtError(err: unknown): string {
  if (axios.isAxiosError(err)) {
    const out: Record<string, unknown> = {
      error: true,
      message: err.message,
      code: err.code,
    };
    if (err.response) {
      out.status = err.response.status;
      out.statusText = err.response.statusText;
      out.data = err.response.data;
      out.headers = err.response.headers;
    }
    return JSON.stringify(out, null, 2);
  }
  return JSON.stringify(
    {
      error: true,
      message: err instanceof Error ? err.message : String(err),
    },
    null,
    2
  );
}

export interface HttpDebugRequestInput {
  host: string;
  port: string;
  path: string;
  method: HttpDebugMethod;
  /** 非 GET 时已解析的 JSON；无请求体则为 undefined */
  bodyData?: unknown;
}

export async function executeHttpDebugRequest(input: HttpDebugRequestInput): Promise<string> {
  const { host, port, path, method, bodyData } = input;
  const url = buildRequestUrl(host, port, path);
  const res = await axios({
    method: method.toLowerCase() as Lowercase<HttpDebugMethod>,
    url,
    data: method === "GET" ? undefined : bodyData,
    validateStatus: () => true,
    timeout: 120_000,
  });
  return serializeSuccessResponse(res);
}
