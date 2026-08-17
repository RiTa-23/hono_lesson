import type { ReactNode } from "react";
import { Info, AlertTriangle, Lightbulb, ScrollText } from "lucide-react";
import { cn } from "@/lib/utils";

type Variant = "info" | "warn" | "tip" | "quest";

const styles: Record<Variant, { box: string; icon: ReactNode; label: string }> = {
  info: {
    box: "border-sky-500/60 bg-sky-500/10",
    icon: <Info size={18} className="text-sky-600 dark:text-sky-400" />,
    label: "補足",
  },
  warn: {
    box: "border-amber-500/60 bg-amber-500/10",
    icon: <AlertTriangle size={18} className="text-amber-600 dark:text-amber-400" />,
    label: "注意",
  },
  tip: {
    box: "border-emerald-500/60 bg-emerald-500/10",
    icon: <Lightbulb size={18} className="text-emerald-600 dark:text-emerald-400" />,
    label: "ポイント",
  },
  quest: {
    box: "border-primary/50 bg-primary/10",
    icon: <ScrollText size={18} className="text-primary" />,
    label: "ストーリー",
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
    <aside className={cn("my-4 rounded-lg border px-4 py-3", s.box)}>
      <div className="flex items-center gap-2 font-medium">
        {s.icon}
        <span>{title ?? s.label}</span>
      </div>
      <div className="mt-2 text-[0.92rem] leading-relaxed [&>p]:my-1">
        {children}
      </div>
    </aside>
  );
}
