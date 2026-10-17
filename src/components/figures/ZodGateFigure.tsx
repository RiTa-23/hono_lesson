import { useState, type CSSProperties } from "react";
import { Ban, Check, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { Figure, FigureButton } from "./Figure";
import { useInView } from "./useInView";
import { anim } from "./anim";

type Case = { input: string; ok: boolean; result: string };

const CASES: Case[] = [
  { input: "{ itemId: 2, quantity: 3 }", ok: true, result: "success: true" },
  {
    input: "{ itemId: 2, quantity: -5 }",
    ok: false,
    result: 'quantity: "Too small: expected number to be >0"',
  },
  {
    input: '{ itemId: "ポーション" }',
    ok: false,
    result: 'itemId: "Invalid input: expected number, received string"',
  },
];

const IN = "16%";
const GATE = "50%";
const OUT = "80%";

export function ZodGateFigure() {
  const [index, setIndex] = useState(1);
  const [playId, setPlayId] = useState(0);
  const { ref, inView } = useInView<HTMLDivElement>();
  const c = CASES[index];

  const play = (i: number) => {
    setIndex(i);
    setPlayId((n) => n + 1);
  };

  return (
    <Figure
      title="スキーマ ＝ データの検問所"
      caption="ルールに合うデータだけが通り、合わないデータは「どこが・なぜダメか」の理由つきで止められる"
    >
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-serif text-xs text-muted-foreground">届いたデータ：</span>
        {CASES.map((cs, i) => (
          <FigureButton key={cs.input} active={i === index} onClick={() => play(i)}>
            <span className="font-mono">{cs.input}</span>
          </FigureButton>
        ))}
      </div>

      <div ref={ref} className="relative mt-4 h-56 overflow-hidden rounded-sm border border-border bg-background sm:h-48">
        {/* 検問所（スキーマ） */}
        <div
          className="absolute bottom-3 w-[44%] -translate-x-1/2 rounded-sm border-2 border-gold bg-gold/10 px-2 py-1.5 sm:w-[36%]"
          style={{ left: GATE }}
        >
          <div className="flex items-center justify-center gap-1 font-serif text-[11px] font-bold text-gold">
            <ShieldCheck size={14} />
            purchaseSchema
          </div>
          <ul className="mt-1 space-y-0.5 text-[10px] leading-snug sm:text-[11px]">
            <li>
              <span className="font-mono">itemId</span>：数値・整数・正の数
            </li>
            <li>
              <span className="font-mono">quantity</span>：数値・整数・正の数（省略OK）
            </li>
          </ul>
        </div>
        <div className="absolute bottom-3 -translate-x-1/2 text-center text-[11px] text-muted-foreground" style={{ left: IN }}>
          リクエスト
        </div>
        <div className="absolute bottom-3 -translate-x-1/2 text-center text-[11px] text-muted-foreground" style={{ left: OUT }}>
          API本体の処理へ
        </div>

        {inView && (
          <div key={playId} aria-hidden="true">
            {/* データの小包：検問所まで → OKならその先へ */}
            <div
              className={cn(
                "absolute top-[10%] -translate-x-1/2 whitespace-nowrap rounded-sm border px-1.5 py-0.5 font-mono text-[10px] shadow-sm sm:text-xs",
                c.ok ? "border-gold bg-card" : "border-foreground/70 bg-card"
              )}
              style={anim("fig-travel", c.ok ? 1.8 : 1.1, 0.2, {
                "--fig-from": IN,
                "--fig-to": c.ok ? OUT : GATE,
              } as CSSProperties)}
            >
              {c.input}
            </div>

            {/* safeParse の結果 */}
            <div className="absolute top-[30%] w-max max-w-[92%] -translate-x-1/2" style={{ left: c.ok ? OUT : GATE }}>
              <div style={anim("fig-pop", 0.3, c.ok ? 1.9 : 1.3)}>
                <div
                  className={cn(
                    "inline-flex items-center gap-1 rounded-sm px-1.5 py-0.5 font-mono text-[10px] font-bold sm:text-xs",
                    c.ok ? "bg-gold text-primary-foreground" : "bg-destructive text-destructive-foreground"
                  )}
                  style={c.ok ? undefined : anim("fig-shake", 0.4, 1.6)}
                >
                  {c.ok ? <Check size={12} className="shrink-0" /> : <Ban size={12} className="shrink-0" />}
                  <span className="whitespace-normal break-all">{c.result}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Figure>
  );
}
