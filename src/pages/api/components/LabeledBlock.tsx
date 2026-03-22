import type { ReactNode } from "react";
import { apiTw } from "../constants";
import React from "react";

interface LabeledBlockProps {
  label: string;
  children: ReactNode;
  className?: string;
}

/** 纵向：标题 + 内容区（请求体、响应等） */
export function LabeledBlock({ label, children, className = "" }: LabeledBlockProps) {
  return (
    <div className={className.trim()}>
      <div className={apiTw.blockLabel}>{label}</div>
      {children}
    </div>
  );
}
