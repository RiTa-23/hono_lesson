import { Check } from "lucide-react";

// 回の全クエスト達成時に表示する「クリア！」ラベル（金の小さな判子）
export function ClearedBadge() {
  return (
    <span className="inline-flex -rotate-3 items-center gap-0.5 rounded-sm border border-gold bg-gold/10 px-1.5 py-0.5 font-serif text-[0.65rem] font-bold tracking-widest text-gold">
      <Check size={10} strokeWidth={3} aria-hidden="true" />
      クリア！
    </span>
  );
}