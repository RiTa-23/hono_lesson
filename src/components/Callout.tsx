import type { ReactNode } from "react";
import { Info, AlertTriangle, Lightbulb, ScrollText } from "lucide-react";
import { cn } from "@/lib/utils";

type Variant = "info" | "warn" | "tip" | "quest";

// 依頼書風: 縦罫＋明朝ラベル。金（ストーリー/ポイント）・朱（注意）・茶（補足）
const styles: Record<Variant, { box: string; label: string; labelClass: string; icon: ReactNode }> = {
  info: {
    box: "border-l-4 border-primary/70 bg-secondary/40",
    label: "【補足】",
    labelClass: "text-primary",
    icon: <Info size={16} className="text-primary" />,
  },
  warn: {
    box: "border-l-4 border-destructive bg-destructive/5",
    label: "【注意】",
    labelClass: "text-destructive",
    icon: <AlertTriangle size={16} className="text-destructive" />,
  },
  tip: {
    box: "border-l-4 border-gold bg-gold/5",
    label: "【ポイント】",
    labelClass: "text-gold",
    icon: <Lightbulb size={16} className="text-gold" />,
  },
  quest: {
    box: "border-l-4 border-gold bg-gold/5",
    label: "【ストーリー】",
    labelClass: "text-gold",
    icon: <ScrollText size={16} className="text-gold" />,
  },
};

type Props = {
  variant?: Variant;
  title?: string;
  children: ReactNode;
};

export function Callout({ variant = "info", title, children }: Props) {
  const s = styles[variant];
  return (
    <aside className={cn("my-4 rounded-sm border-l-4 px-4 py-3", s.box)}>
      <div
        className={cn(
          "flex items-center gap-2 font-serif text-sm font-bold tracking-wide",
          s.labelClass
        )}
      >
        {s.icon}
        <span>{title ?? s.label}</span>
      </div>
      <div className="mt-2 text-[0.92rem] leading-relaxed [&>p]:my-1">
        {children}
      </div>
    </aside>
  );
}
