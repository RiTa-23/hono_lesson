import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { getProgress, setProgress } from "@/lib/storage";

type Props = {
  id: string;
  label?: string;
  children?: React.ReactNode;
};

export function ProgressCheck({ id, label, children }: Props) {
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    setChecked(getProgress(id));
    const onUpdate = (e: Event) => {
      const ce = e as CustomEvent<{ id: string; value: boolean }>;
      if (ce.detail?.id === id) setChecked(ce.detail.value);
    };
    const onClear = () => setChecked(false);
    window.addEventListener("progress-updated", onUpdate);
    window.addEventListener("progress-cleared", onClear);
    return () => {
      window.removeEventListener("progress-updated", onUpdate);
      window.removeEventListener("progress-cleared", onClear);
    };
  }, [id]);

  const toggle = () => {
    const next = !checked;
    setChecked(next);
    setProgress(id, next);
  };

  const text = label ?? children;

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={checked}
      className={[
        "group my-6 flex w-full items-center gap-3 rounded-md border px-4 py-3 text-left transition",
        "min-h-[52px]",
        checked
          ? "border-emerald-500/70 bg-emerald-500/10 text-foreground"
          : "border-border bg-card hover:bg-secondary/60",
      ].join(" ")}
    >
      <span
        aria-hidden="true"
        className={[
          "inline-flex h-6 w-6 shrink-0 items-center justify-center rounded border-2 transition",
          checked
            ? "border-emerald-600 bg-emerald-600 text-white"
            : "border-border bg-background group-hover:border-primary/60",
        ].join(" ")}
      >
        {checked ? <Check size={14} strokeWidth={3} /> : null}
      </span>
      <span className="flex-1 text-[0.95rem] leading-snug">
        {checked ? (
          <span className="font-medium text-emerald-700 dark:text-emerald-400">
            クエスト達成: {text}
          </span>
        ) : (
          <span className="text-foreground">{text}</span>
        )}
      </span>
      <span className="shrink-0 text-xs text-muted-foreground">
        {checked ? "クリックで戻す" : "クリックで完了"}
      </span>
    </button>
  );
}
