import type { ReactNode } from "react";
import { CircleCheck, CircleHelp, Flame, PackageX } from "lucide-react";
import { cn } from "@/lib/utils";
import { Figure } from "./Figure";

type Code = { code: string; icon: ReactNode; meaning: string; line: string };

type Group = {
  range: string;
  who: string;
  tone: "ok" | "ng" | "fire";
  codes: Code[];
};

const GROUPS: Group[] = [
  {
    range: "2xx",
    who: "成功",
    tone: "ok",
    codes: [
      { code: "200", icon: <CircleCheck size={18} />, meaning: "成功", line: "はい、どうぞ" },
    ],
  },
  {
    range: "4xx",
    who: "お願いする側（冒険者）の問題",
    tone: "ng",
    codes: [
      { code: "400", icon: <CircleHelp size={18} />, meaning: "お願いの内容がおかしい", line: "何を買いたいか分からないよ" },
      { code: "404", icon: <PackageX size={18} />, meaning: "指定されたものが存在しない", line: "そんな商品は置いてないよ" },
    ],
  },
  {
    range: "5xx",
    who: "お店（サーバー）側の問題",
    tone: "fire",
    codes: [
      { code: "500", icon: <Flame size={18} />, meaning: "サーバー側のトラブル", line: "店が大変なことに…" },
    ],
  },
];

const toneClass = {
  ok: { head: "bg-gold/20 text-foreground", code: "text-gold", border: "border-gold/60" },
  ng: { head: "bg-destructive/10 text-destructive", code: "text-destructive", border: "border-destructive/50" },
  fire: { head: "bg-destructive text-destructive-foreground", code: "text-destructive", border: "border-destructive" },
};

export function StatusCodeFigure() {
  return (
    <Figure
      title="ステータスコードの見分け方"
      caption="まずは百の位を見る。2なら成功、4ならお願いの側、5ならお店の側に原因がある"
    >
      <div className="space-y-2">
        {GROUPS.map((g) => {
          const t = toneClass[g.tone];
          return (
            <div
              key={g.range}
              className={cn("grid grid-cols-1 overflow-hidden rounded-sm border sm:grid-cols-[11rem_1fr]", t.border)}
            >
              <div className={cn("flex flex-col justify-center px-3 py-1.5 font-serif text-xs font-bold", t.head)}>
                <span className="font-mono text-base">{g.range}</span>
                <span>{g.who}</span>
              </div>
              <div className="grid gap-2 p-2 grid-cols-1 sm:grid-cols-2">
                {g.codes.map((c) => (
                  <div key={c.code} className="flex items-start gap-2 rounded-sm bg-background px-3 py-2">
                    <div className={cn("flex shrink-0 items-center gap-1", t.code)}>
                      {c.icon}
                      <span className="font-mono text-lg font-bold leading-none">{c.code}</span>
                    </div>
                    <div className="text-xs leading-snug">
                      <p className="font-medium">{c.meaning}</p>
                      <p className="mt-0.5 text-muted-foreground">「{c.line}」</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </Figure>
  );
}
