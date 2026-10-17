import type { ReactNode } from "react";
import { Check, Eye, Lock, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Figure } from "./Figure";

function Zone({
  icon,
  title,
  note,
  className,
  children,
}: {
  icon: ReactNode;
  title: string;
  note: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn("rounded-sm border-2 bg-background p-3", className)}>
      <p className="flex items-center gap-1.5 font-serif text-sm font-bold">
        {icon}
        {title}
      </p>
      <p className="mt-0.5 text-[11px] text-muted-foreground">{note}</p>
      <ul className="mt-2 space-y-1 text-xs leading-snug">{children}</ul>
    </div>
  );
}

function Li({ ng, children }: { ng?: boolean; children: ReactNode }) {
  return (
    <li className={cn("flex items-start gap-1", ng && "text-destructive")}>
      {ng ? <X size={13} className="mt-px shrink-0" /> : <Check size={13} className="mt-px shrink-0 text-gold" />}
      <span>{children}</span>
    </li>
  );
}

export function SecurityFigure() {
  return (
    <Figure
      title="冒険者の手元と、店の奥"
      caption="ブラウザに届いたものは冒険者に丸見え。大事な計算・最終チェック・秘密の鍵は、サーバー（店の奥）に置く"
    >
      {/* どこに何を置くか */}
      <div className="grid grid-cols-1 items-stretch gap-2 sm:grid-cols-[1fr_auto_1fr]">
        <Zone
          icon={<Eye size={15} className="text-destructive" />}
          title="ブラウザ（冒険者の手元）"
          note="誰でも中身を見られる・書き換えられる"
          className="border-border"
        >
          <Li>画面の表示・ボタン</Li>
          <Li>入力のチェック（うっかりミスを防ぐ親切）</Li>
          <Li ng>DBのパスワード・秘密の鍵は置かない</Li>
          <Li ng>値段や所持金の最終的な計算はしない</Li>
        </Zone>

        <div className="flex items-center justify-center gap-1 py-1 text-center font-serif text-[11px] font-bold text-gold sm:flex-col sm:px-1">
          <span aria-hidden="true" className="sm:hidden">▼▲</span>
          <span aria-hidden="true" className="hidden sm:inline">◀▶</span>
          <span>
            API（窓口）
            <br className="hidden sm:inline" />
            だけが出入り口
          </span>
        </div>

        <Zone
          icon={<Lock size={15} className="text-gold" />}
          title="サーバー（店の奥）"
          note="冒険者は直接さわれない"
          className="border-gold bg-gold/5"
        >
          <Li>値段・所持金の計算、在庫の確定</Li>
          <Li>DBのパスワード・秘密の鍵</Li>
          <Li>届いたお願いの最終チェック</Li>
        </Zone>
      </div>
    </Figure>
  );
}
