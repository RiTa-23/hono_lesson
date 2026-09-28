import { useEffect, useState } from "react";

const STEPS = 20;

// trigger が null 以外に変わるたびに、delayMs 待ってから durationMs かけて 0 → target まで数える
// （演出を表示した瞬間の状態オブジェクトを trigger に渡す想定）
export function useCountUp(
  target: number,
  trigger: unknown,
  { delayMs, durationMs }: { delayMs: number; durationMs: number }
): number {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (trigger == null) return;
    setValue(0);
    let step = 0;
    let interval: number | undefined;
    const start = window.setTimeout(() => {
      interval = window.setInterval(() => {
        step += 1;
        setValue(Math.round((target * step) / STEPS));
        if (step >= STEPS) window.clearInterval(interval);
      }, durationMs / STEPS);
    }, delayMs);
    return () => {
      window.clearTimeout(start);
      window.clearInterval(interval);
    };
  }, [trigger, target, delayMs, durationMs]);

  return value;
}
