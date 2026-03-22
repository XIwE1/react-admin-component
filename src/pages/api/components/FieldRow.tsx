import type { ReactNode } from "react";
import { apiTw } from "../constants";
import React from "react";

interface FieldRowProps {
  label: string;
  children: ReactNode;
  className?: string;
}

/** 横向：左侧固定宽标签 + 右侧表单项 */
export function FieldRow({ label, children, className = "" }: FieldRowProps) {
  return (
    <div className={`${apiTw.row} ${className}`.trim()}>
      <span className={apiTw.fieldLabel}>{label}</span>
      {children}
    </div>
  );
}
