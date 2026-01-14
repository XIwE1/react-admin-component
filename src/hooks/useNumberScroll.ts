import { useEffect, useRef, useState, useMemo, useCallback } from "react";

// 缓动函数
const easeOutExpo = (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));
const linear = (t: number) => t;

export interface UseNumberDurationProps {
  value: number;
  duration?: number;
  decimals?: number;
  split?: string;
}

const useNumberScroll = ({
  value,
  duration = 5500,
  decimals = 2,
  split = ",",
}: UseNumberDurationProps) => {
  const rafRef = useRef<number>();
  const currentRef = useRef<number>(0);
  const durationRef = useRef<number>(duration);

  const startTime = useRef<number>();
  const startValue = useRef<number>(0);
  /** 线性变化的值 */
  const EasingThreshold = useMemo(() => {
    const diff = value - startValue.current;
    const threshold = (Math.abs(diff) * 2) / 3;
    return startValue.current + (diff > 0 ? threshold : -threshold);
  }, [value]);

  /** 滑动变化的值 */
  const EasingAmount = useMemo(() => {
    const amount = value - EasingThreshold;
    return amount;
  }, [value, EasingThreshold]);

  // 当前的实际值
  const [currentValue, setCurrentValue] = useState(0);
  // 格式化后用于展示的值
  const _current = useMemo(
    () =>
      currentValue.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, split),
    [currentValue, decimals, split]
  );

  // 当前目标的结束值
  const endValue = useRef<number>(value);
  // 最终值
  const finalValue = useRef<number | null>(null);
  const result = useMemo(
    () => value.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, split),
    [value, decimals, split]
  );

  // determine - 判断变化采用线性还是缓动，设置最终值final和当前目标结束值end
  const determine = useCallback(() => {
    const end =
      finalValue.current !== null ? finalValue.current : endValue.current;
    const animateAmount = Math.abs(end - startValue.current);

    if (animateAmount > Math.abs(EasingThreshold)) {
      finalValue.current = end;
      endValue.current = end - EasingAmount;
      // 拿出小部分时间用于线性变化
      durationRef.current = duration / 3;
    } else {
      finalValue.current = null;
      endValue.current = end;
      durationRef.current = duration; // 这样动画滑动更明显一点
      // durationRef.current = (duration * 2) / 3;
    }
  }, [duration, EasingThreshold, EasingAmount]);

  const count = useCallback(
    (timestamp: number) => {
      if (!startTime.current) startTime.current = timestamp;
      // 根据时间差计算当前进度
      const elapsed = timestamp - startTime.current;
      const progress = Math.min(elapsed / durationRef.current, 1);
      const eased =
        finalValue.current !== null ? linear(progress) : easeOutExpo(progress);

      const currentValue =
        startValue.current + (endValue.current - startValue.current) * eased;

      currentRef.current = currentValue;
      setCurrentValue(currentValue);

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(count);
      } else {
        startValue.current = currentValue;
        // 最终值不为空 = 还未到最终值 = 剩下的值要平滑增加
        if (finalValue.current !== null) {
          cancelAnimationFrame(rafRef.current!);
          startTime.current = undefined;
          endValue.current = finalValue.current;
          finalValue.current = null;
          determine();
          rafRef.current = requestAnimationFrame(count);
        }
      }
    },
    [determine]
  );

  useEffect(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    // 变化时重置状态
    endValue.current = value;
    finalValue.current = null;
    durationRef.current = duration;
    startValue.current = currentRef.current;
    startTime.current = undefined;
    // 判断当前的变化方式,并开始动画循环
    determine();
    rafRef.current = requestAnimationFrame(count);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      startTime.current = undefined;
    };
  }, [value, duration]);

  return { current: _current, result };
};

export default useNumberScroll;
