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
        "group my-6 flex w-full items-center gap-3 rounded-sm border border-primary bg-card px-4 py-3 text-left transition",
        "min-h-[52px]",
        "hover:bg-secondary/60",
      ].join(" ")}
    >
      <span
        aria-hidden="true"
        className={[
          "inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition",
          checked
            ? "border-primary bg-primary text-primary-foreground"
            : "border-primary/60 bg-card group-hover:bg-secondary",
        ].join(" ")}
      >
        {checked ? <Check size={14} strokeWidth={3} /> : null}
      </span>
      <span className="flex-1 text-[0.95rem] leading-snug text-foreground">
        {text}
      </span>
      {checked ? (
        // 朱色の判子スタンプ（白抜きリング付き）
        <span
          aria-hidden="true"
          className={[
            "inline-flex shrink-0 -rotate-[8deg] animate-stamp-in items-center",
            "rounded border-2 border-[#b3402a] bg-[#b3402a] px-3 py-1.5",
            "outline outline-1 -outline-offset-4 outline-white/90",
            "font-serif text-xs font-bold tracking-widest text-white",
            "shadow-sm",
          ].join(" ")}
        >
          クエスト達成
        </span>
      ) : (
        <span className="shrink-0 text-xs text-muted-foreground">
          クリックで完了
        </span>
      )}
    </button>
  );
}
