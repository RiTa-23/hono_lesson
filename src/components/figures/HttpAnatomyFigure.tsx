import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Figure } from "./Figure";

// 伝票の1行：左に実物（コード片）、右に「それが何か」の注記
function Part({ chip, chipClass, note, sub }: { chip: ReactNode; chipClass: string; note: string; sub: string }) {
  return (
    <div className="grid grid-cols-1 items-center gap-1 sm:grid-cols-[minmax(0,1fr)_auto_11rem] sm:gap-3">
      <div className={cn("min-w-0 rounded-sm border px-2 py-1.5 font-mono text-xs", chipClass)}>{chip}</div>
      <span aria-hidden="true" className="hidden text-gold sm:inline">
        ◀
      </span>
      <div className="text-xs leading-snug">
        <span className="font-serif font-bold">{note}</span>
        <span className="text-muted-foreground"> … {sub}</span>
      </div>
    </div>
  );
}

// 伝票の枠
function Slip({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="relative border-2 border-primary/80 bg-background p-1">
      <div className="border border-gold/50 px-3 py-3">
        <p className="mb-3 text-center font-serif text-xs font-bold tracking-[0.3em] text-gold">{title}</p>
        <div className="space-y-2.5">{children}</div>
      </div>
    </div>
  );
}

export function HttpAnatomyFigure() {
  return (
    <Figure
      title="お願いとお返事の「伝票」の中身"
      caption="お願いは「種類（メソッド）＋窓口（パス）＋中身（JSON）」、お返事は「結果の合図（ステータスコード）＋中身（JSON）」でできている"
    >
      <div className="space-y-4">
        <Slip title="お願いの伝票（リクエスト）">
          <Part
            chip="POST"
            chipClass="border-primary bg-primary text-primary-foreground font-bold"
            note="HTTPメソッド"
            sub="お願いの種類（見せて？処理して？）"
          />
          <Part
            chip="/api/purchase"
            chipClass="border-gold bg-gold/10"
            note="パス"
            sub="どの窓口へのお願いか"
          />
          <Part
            chip={'{ "itemId": 2, "quantity": 1 }'}
            chipClass="border-border bg-muted"
            note="ボディ（JSON）"
            sub="注文の中身。GETでは付けないことが多い"
          />
        </Slip>

        <div aria-hidden="true" className="text-center font-serif text-xs text-muted-foreground">
          ▼ 店主（API）が処理して… ▼
        </div>

        <Slip title="お返事の伝票（レスポンス）">
          <Part
            chip="200"
            chipClass="border-gold bg-gold/20 font-bold"
            note="ステータスコード"
            sub="結果の合図（成功？失敗？）"
          />
          <Part
            chip={'{ "gold": 450, "items": [ … ] }'}
            chipClass="border-border bg-muted"
            note="ボディ（JSON）"
            sub="結果のデータ"
          />
        </Slip>
      </div>
    </Figure>
  );
}
