import type { HttpDebugMethod } from "./types";

export const DEFAULT_HOST = "localhost";
export const DEFAULT_PORT = "8080";

export const HTTP_METHOD_OPTIONS: { value: HttpDebugMethod; label: string }[] = [
  { value: "GET", label: "GET" },
  { value: "POST", label: "POST" },
];

export const apiTw = {
  page: "mx-[15px] flex h-full min-h-0 flex-col gap-4 pb-4",
  row: "flex flex-wrap items-center gap-3",
  fieldLabel: "min-w-[72px] shrink-0 text-black/65",
  blockLabel: "mb-2 text-black/65",
  mono: "font-mono text-[13px]",
  responseArea: "min-h-[200px] resize-y",
};
