import type { HttpDebugMethod } from "./types";

const STORAGE_KEY = "http-debug:request-history:v2";

export interface RequestHistoryItem {
  method: HttpDebugMethod;
  uri: string;
  /** 原始 JSON 文本；GET 通常为空字符串 */
  bodyText: string;
}

export type RequestHistoryPayload = {
  version: 2;
  /** 新使用的在前，不重复 */
  items: RequestHistoryItem[];
};

function safeParse(raw: string): RequestHistoryPayload | null {
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object") return null;
    const p = parsed as Partial<RequestHistoryPayload>;
    if (p.version !== 2 || !Array.isArray(p.items)) return null;
    const items: RequestHistoryItem[] = [];
    for (const it of p.items) {
      if (!it || typeof it !== "object") continue;
      const item = it as Partial<RequestHistoryItem>;
      if (
        (item.method !== "GET" && item.method !== "POST" && item.method !== "PUT" && item.method !== "DELETE") ||
        typeof item.uri !== "string" ||
        typeof item.bodyText !== "string"
      ) {
        continue;
      }
      items.push({ method: item.method, uri: item.uri, bodyText: item.bodyText });
    }
    return { version: 2, items };
  } catch {
    return null;
  }
}

function loadPayload(): RequestHistoryPayload {
  if (typeof localStorage === "undefined") {
    return { version: 2, items: [] };
  }
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return { version: 2, items: [] };
  return safeParse(raw) ?? { version: 2, items: [] };
}

function savePayload(payload: RequestHistoryPayload): void {
  if (typeof localStorage === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
}

/** 读取请求历史（新 → 旧） */
export function readRequestHistory(): RequestHistoryItem[] {
  return [...loadPayload().items];
}

/**
 * 记录请求历史：method + uri + bodyText 三元组去重，最新置顶
 */
export function appendRequestHistory(item: RequestHistoryItem): void {
  const method = item.method;
  const uri = item.uri.trim();
  const bodyText = item.bodyText;
  if (!uri) return;
  const payload = loadPayload();
  const next: RequestHistoryItem[] = [{ method, uri, bodyText }];
  for (const prev of payload.items) {
    if (
      prev.method === method &&
      prev.uri === uri &&
      prev.bodyText === bodyText
    ) {
      continue;
    }
    next.push(prev);
  }
  payload.items = next;
  savePayload(payload);
}

/** 清空请求缓存 */
export function clearAllRequestHistory(): void {
  savePayload({ version: 2, items: [] });
}
