import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Props = {
  title: string;
  // 図の下に添える一言（任意）
  caption?: ReactNode;
  className?: string;
  children: ReactNode;
};

// 図解の共通枠。依頼書に貼られた「挿絵」のイメージで、金の見出しラベル＋点線の注記
// .fig-anim を付けておくと、reduced-motion 環境ではアニメーションが最終状態で止まる
export function Figure({ title, caption, className, children }: Props) {
  return (
    <figure className={cn("fig-anim my-6 rounded-sm border border-gold/50 bg-card", className)}>
      <figcaption className="border-b border-gold/30 px-4 py-2 font-serif text-xs font-bold tracking-wider text-gold">
        図解 ─ {title}
      </figcaption>
      <div className="p-4 sm:p-5">{children}</div>
      {caption && (
        <p className="border-t border-dotted border-gold/60 px-4 py-2 text-center text-xs leading-relaxed text-muted-foreground">
          {caption}
        </p>
      )}
    </figure>
  );
}

// 図の中の小さなコード表示（CopyBlockと同じ焦茶地＋金ラベル）
export function MiniCode({ label, code }: { label?: string; code: string }) {
  return (
    <div className="min-w-0 overflow-hidden rounded-sm border border-gold/40 bg-[#2b2118] text-[#f0e6d2]">
      {label && (
        <div className="border-b border-gold/25 px-3 py-1 font-serif text-[11px] font-bold tracking-wider text-gold">
          {label}
        </div>
      )}
      <pre className="px-3 py-2 text-xs leading-relaxed">
        <code>{code}</code>
      </pre>
    </div>
  );
}

// 図の中の選択ボタン（シナリオ切替など）
export function FigureButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "rounded-sm border px-2.5 py-1 text-xs transition",
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-background hover:border-gold hover:bg-gold/10"
      )}
    >
      {children}
    </button>
  );
}
