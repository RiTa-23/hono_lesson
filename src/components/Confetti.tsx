import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";

// 紙吹雪（描画のたびに変わらないよう、位置は決め打ちで生成する）
// 視差効果を減らす設定の環境では表示しない
const COLORS = ["bg-gold", "bg-[#b3402a]", "bg-primary"];

function burstPieces(count: number, spread: number) {
  return Array.from({ length: count }, (_, i) => {
    const angle = (i / count) * Math.PI * 2 + (i % 2 ? 0.12 : -0.08);
    const dist = spread + ((i * 53) % 150);
    return {
      tx: Math.round(Math.cos(angle) * dist),
      ty: Math.round(Math.sin(angle) * dist * 0.8 - 40),
      rot: ((i * 67) % 360) - 180,
      color: COLORS[i % COLORS.length],
      diamond: i % 4 === 0,
      delay: (i % 5) * 25,
    };
  });
}

// 画面中央から四方へ飛び散る紙吹雪
export function ConfettiBurst({
  delayMs,
  count = 28,
  spread = 190,
}: {
  delayMs: number;
  count?: number;
  spread?: number;
}) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 overflow-hidden motion-reduce:hidden"
    >
      <div className="absolute left-1/2 top-1/2">
        {burstPieces(count, spread).map((c, i) => (
          <span
            key={i}
            className={cn(
              "absolute animate-confetti opacity-0",
              c.color,
              c.diamond ? "h-2 w-2" : "h-3 w-1.5"
            )}
            style={
              {
                "--tx": `${c.tx}px`,
                "--ty": `${c.ty}px`,
                "--rot": `${c.rot}deg`,
                animationDelay: `${delayMs + c.delay}ms`,
              } as CSSProperties
            }
          />
        ))}
      </div>
    </div>
  );
}

// 画面の上から降りそそぐ紙吹雪
export function ConfettiShower({ delayMs, count = 36 }: { delayMs: number; count?: number }) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 overflow-hidden motion-reduce:hidden"
    >
      {Array.from({ length: count }, (_, i) => (
        <span
          key={i}
          className={cn(
            "absolute -top-4 animate-confetti-fall opacity-0",
            COLORS[i % COLORS.length],
            i % 4 === 0 ? "h-2 w-2" : "h-3 w-1.5"
          )}
          style={
            {
              left: `${(i * 37) % 100}%`,
              "--sway": `${((i * 29) % 80) - 40}px`,
              animationDelay: `${delayMs + ((i * 173) % 1800)}ms`,
              animationDuration: `${2600 + ((i * 211) % 1400)}ms`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}
