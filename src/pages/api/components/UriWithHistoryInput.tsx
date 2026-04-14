import { Input } from "antd";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { apiTw } from "../constants";
import type { RequestHistoryItem } from "../uriHistoryStorage";

export interface UriWithHistoryInputProps {
  value: string;
  onChange: (value: string) => void;
  /** 新 → 旧，与 localStorage 一致 */
  history: RequestHistoryItem[];
  bodyText: string;
  onPickHistory: (item: RequestHistoryItem) => void;
  onSend: () => void;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
}

/**
 * URI 输入：Enter 发送；↑↓ 打开历史并切换；历史打开时 Enter 仅选中不发送
 */
export function UriWithHistoryInput({
  value,
  onChange,
  history,
  bodyText,
  onPickHistory,
  onSend,
  disabled,
  placeholder,
  className,
}: UriWithHistoryInputProps) {
  const [pickerOpen, setPickerOpen] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(0);
  const pickerOpenRef = useRef(false);
  const highlightIndexRef = useRef(0);

  const closePicker = useCallback(() => {
    pickerOpenRef.current = false;
    setPickerOpen(false);
  }, []);

  const keyword = value.trim().toLowerCase();
  const bodyKeyword = bodyText.trim().toLowerCase();
  const matchedHistory = history.filter((item) => {
    if (!keyword && !bodyKeyword) return true;
    const inUri = keyword ? item.uri.toLowerCase().includes(keyword) : false;
    const inBody = bodyKeyword ? item.bodyText.toLowerCase().includes(bodyKeyword) : false;
    return inUri || inBody;
  });

  useEffect(() => {
    if (!pickerOpen) return;
    if (!matchedHistory.length) {
      closePicker();
      return;
    }
    setHighlightIndex((i) => {
      const next = Math.min(Math.max(0, i), matchedHistory.length - 1);
      highlightIndexRef.current = next;
      return next;
    });
  }, [matchedHistory, pickerOpen, closePicker]);

  const pickItem = useCallback(
    (index: number) => {
      const item = matchedHistory[index];
      if (item === undefined) return;
      onPickHistory(item);
      closePicker();
    },
    [matchedHistory, onPickHistory, closePicker]
  );

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape" && pickerOpen) {
      e.preventDefault();
      closePicker();
      return;
    }

    if (e.key === "ArrowUp") {
      if (!matchedHistory.length) return;
      e.preventDefault();
      if (!pickerOpenRef.current) {
        pickerOpenRef.current = true;
        highlightIndexRef.current = 0;
        setPickerOpen(true);
        setHighlightIndex(0);
      } else {
        const next = Math.min(matchedHistory.length - 1, highlightIndexRef.current + 1);
        highlightIndexRef.current = next;
        setHighlightIndex(next);
      }
      return;
    }

    if (e.key === "ArrowDown") {
      if (!matchedHistory.length) return;
      e.preventDefault();
      if (!pickerOpenRef.current) {
        pickerOpenRef.current = true;
        highlightIndexRef.current = 0;
        setPickerOpen(true);
        setHighlightIndex(0);
      } else if (highlightIndexRef.current <= 0) {
        closePicker();
      } else {
        const next = highlightIndexRef.current - 1;
        highlightIndexRef.current = next;
        setHighlightIndex(next);
      }
      return;
    }

    if (e.key === "Enter") {
      if (pickerOpenRef.current && matchedHistory.length > 0) {
        e.preventDefault();
        pickItem(highlightIndexRef.current);
        return;
      }
      e.preventDefault();
      onSend();
    }
  };

  const renderHighlight = (text: string, query: string) => {
    const q = query.trim();
    if (!q) return text;
    const rawLower = text.toLowerCase();
    const qLower = q.toLowerCase();
    const idx = rawLower.indexOf(qLower);
    if (idx < 0) return text;
    const end = idx + q.length;
    return (
      <>
        {text.slice(0, idx)}
        <span className="rounded bg-yellow-200/80 px-[1px]">{text.slice(idx, end)}</span>
        {text.slice(end)}
      </>
    );
  };

  return (
    <div className={`relative min-w-[200px] max-w-[560px] flex-1 ${className ?? ""}`.trim()}>
      <Input
        className="w-full"
        placeholder={placeholder}
        value={value}
        disabled={disabled}
        onChange={(ev) => {
          onChange(ev.target.value);
          if (!pickerOpenRef.current && matchedHistory.length > 0) {
            pickerOpenRef.current = true;
            highlightIndexRef.current = 0;
            setPickerOpen(true);
            setHighlightIndex(0);
          }
        }}
        onFocus={() => {
          if (!matchedHistory.length) return;
          pickerOpenRef.current = true;
          highlightIndexRef.current = 0;
          setPickerOpen(true);
          setHighlightIndex(0);
        }}
        onKeyDown={onKeyDown}
        onBlur={() => {
          // 延迟关闭，便于 mousedown 选中列表项
          window.setTimeout(() => closePicker(), 120);
        }}
        allowClear
      />
      {pickerOpen && matchedHistory.length > 0 ? (
        <div
          className="absolute left-0 right-0 top-full z-20 mt-0.5 max-h-[220px] overflow-auto rounded border border-black/10 bg-white py-1 shadow-md"
          onMouseDown={(ev) => {
            ev.preventDefault();
          }}
        >
          {matchedHistory.map((item, idx) => (
            <button
              key={`${idx}:${item.method}:${item.uri}:${item.bodyText}`}
              type="button"
              className={`${apiTw.mono} block w-full cursor-pointer border-0 bg-transparent px-2 py-1.5 text-left text-[13px] hover:bg-black/[0.04] ${
                idx === highlightIndex ? "bg-blue-50 ring-1 ring-inset ring-blue-300" : ""
              }`}
              onMouseEnter={() => {
                highlightIndexRef.current = idx;
                setHighlightIndex(idx);
              }}
              onMouseDown={(ev) => {
                ev.preventDefault();
                pickItem(idx);
              }}
            >
              <div className="flex items-center gap-2">
                <span className="rounded bg-black/5 px-1.5 text-[11px] leading-5">{item.method}</span>
                <span>{renderHighlight(item.uri, value)}</span>
              </div>
              {item.bodyText ? (
                <div className="mt-0.5 truncate text-[11px] text-black/45">
                  body: {renderHighlight(item.bodyText, bodyText)}
                </div>
              ) : null}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
