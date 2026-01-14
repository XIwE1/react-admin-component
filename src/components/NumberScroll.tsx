import React, { useRef, useLayoutEffect, useState } from "react";
import useNumberScroll, { UseNumberDurationProps } from "../hooks/useNumberScroll";

interface NumberScrollProps {
  value: number;
  options?: Omit<UseNumberDurationProps, 'value'>;
  className?: string;
  suffix?: string;
  style?: React.CSSProperties;
}

const NumberScroll: React.FC<NumberScrollProps> = ({
  value,
  options,
  suffix = "",
  className,
  style,
}) => {
  const { current, result } = useNumberScroll({
    value,
    ...options
  });

  const measureRef = useRef<HTMLSpanElement>(null);
  const [fixedWidth, setFixedWidth] = useState<number | undefined>(undefined);

  useLayoutEffect(() => {
    if (measureRef.current) {
      const { width } = measureRef.current.getBoundingClientRect();
      setFixedWidth(width);
    }
  }, [result]);

  return (
    <>
      {/* estimate width */}
      <span
        className={className}
        ref={measureRef}
        style={{
          position: "absolute",
          visibility: "hidden",
          height: "auto",
          width: "auto",
          whiteSpace: "nowrap",
          ...style,
        }}
      >
        {result}
        {suffix}
      </span>

      <span
        className={className}
        style={{
          display: "inline-block",
          width: fixedWidth,
          ...style,
        }}
      >
        {current}
        {suffix}
      </span>
    </>
  );
};

export default NumberScroll;
