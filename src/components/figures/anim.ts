import type { CSSProperties } from "react";

// index.css の fig-* キーフレームを再生するstyleを作る
// fill-mode は both（開始前は0%の状態、終了後は100%の状態で止まる）
export function anim(name: string, dur: number, delay: number, extra?: CSSProperties): CSSProperties {
  return { animation: `${name} ${dur}s ease-in-out ${delay}s both`, ...extra };
}
