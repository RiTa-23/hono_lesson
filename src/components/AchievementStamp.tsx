import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";

// 全クエスト達成時の大型判子（朱色 #b3402a 直書き・ProgressCheckの判子と同系デザイン）
export function AchievementStamp({
  className,
  style,
}: {
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <span
      style={style}
      className={cn(
        "inline-flex -rotate-[8deg] animate-stamp-in items-center rounded",
        "border-[3px] border-[#b3402a] bg-[#b3402a] px-6 py-3",
        "outline outline-2 -outline-offset-[6px] outline-white/90",
        "font-serif text-lg font-bold tracking-widest text-white",
        "shadow-sm",
        className
      )}
    >
      全クエスト達成
    </span>
  );
}