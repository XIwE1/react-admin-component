import axios, { type AxiosResponse } from "axios";
import type { HttpDebugMethod } from "./types";

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
