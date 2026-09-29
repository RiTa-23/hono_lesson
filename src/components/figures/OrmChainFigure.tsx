import type { ReactNode } from "react";
import { Database } from "lucide-react";
import { cn } from "@/lib/utils";
import { Figure } from "./Figure";

function Stage({ title, role, className, children }: { title: string; role: string; className?: string; children: ReactNode }) {
  return (
    <div className={cn("flex-1 rounded-sm border-2 bg-background px-3 py-2", className)}>
      <p className="font-serif text-sm font-bold">{title}</p>
      <p className="text-[11px] text-muted-foreground">{role}</p>
      <div className="mt-1.5">{children}</div>
    </div>
  );
}

// 矢印（横並びのときは右向き、縦並びのときは下向き）。点が流れる
function Flow({ label }: { label: string }) {
  return (
    <div className="flex shrink-0 items-center justify-center gap-1 text-[10px] text-gold md:flex-col" aria-hidden="true">
      <svg viewBox="0 0 40 12" className="h-3 w-10 rotate-90 md:rotate-0">
        <path
          d="M 2 6 H 32"
          className="stroke-gold"
          strokeWidth={2}
          strokeDasharray="4 4"
          style={{ animation: "fig-flow 0.8s linear infinite" }}
        />
        <path d="M 30 1 L 38 6 L 30 11" fill="none" className="stroke-gold" strokeWidth={2} />
      </svg>
      <span className="whitespace-nowrap">{label}</span>
    </div>
  );
}

export function OrmChainFigure() {
  return (
    <Figure
      title="Drizzle ORMは翻訳係"
      caption="TypeScriptで書いた呼び出しを、DrizzleがSQLに翻訳してD1に届ける。APIのURLやレスポンスの形は変わらない"
    >
      <div className="flex flex-col items-stretch gap-2 md:flex-row md:items-center">
        <Stage title="Honoのコード" role="TypeScriptで書く" className="border-border">
          <code className="block rounded-sm bg-[#2b2118] px-2 py-1 font-mono text-[11px] text-[#f0e6d2]">
            db.select().from(items)
          </code>
        </Stage>
        <Flow label="型つきで呼ぶ" />
        <Stage title="Drizzle ORM" role="翻訳係" className="border-gold bg-gold/10">
          <code className="block rounded-sm bg-[#2b2118] px-2 py-1 font-mono text-[11px] text-[#f0e6d2]">
            SELECT * FROM items
          </code>
        </Stage>
        <Flow label="SQLで頼む" />
        <Stage title="D1" role="データの保存先" className="border-primary">
          <div className="flex items-center gap-1.5 text-xs">
            <Database size={16} className="shrink-0 text-gold" />
            items・player・player_items テーブル
          </div>
        </Stage>
      </div>
    </Figure>
  );
}
