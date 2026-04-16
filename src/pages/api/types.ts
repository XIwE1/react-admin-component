export type HttpDebugMethod = "GET" | "POST" | "PUT" | "DELETE";

/** 请求体表单单行（键值） */
export interface BodyKVRow {
  id: string;
  key: string;
  value: string;
}
