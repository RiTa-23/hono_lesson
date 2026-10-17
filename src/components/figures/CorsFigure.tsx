import { useState, type CSSProperties } from "react";
import { Ban, Check, RotateCcw, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { Figure, FigureButton } from "./Figure";
import { useInView } from "./useInView";
import { anim } from "./anim";

// 横位置（%）
const PAGE = "18%";
const GATE = "56%";
const SERVER = "84%";


function Chip({ className, style, children }: { className?: string; style: CSSProperties; children: string }) {
  return (
    <div
      className={cn(
        "absolute inline-flex -translate-x-1/2 whitespace-nowrap rounded-sm border px-1.5 py-0.5 font-mono text-[10px] shadow-sm sm:text-xs",
        className
      )}
      style={style}
    >
      {children}
    </div>
  );
}

export function CorsFigure() {
  const [allowed, setAllowed] = useState(false);
  const [playId, setPlayId] = useState(0);
  const { ref, inView } = useInView<HTMLDivElement>();

  const play = (next: boolean) => {
    setAllowed(next);
    setPlayId((n) => n + 1);
  };

  return (
    <Figure
      title="CORSの門番はブラウザにいる"
      caption="サーバーはお返事を返している。それを画面に渡すかどうかを、ブラウザが許可ヘッダーを見て決めている"
    >
      <div className="flex flex-wrap items-center gap-2">
        <FigureButton active={!allowed} onClick={() => play(false)}>
          CORS設定なし
        </FigureButton>
        <FigureButton active={allowed} onClick={() => play(true)}>
          CORS設定あり（cors()）
        </FigureButton>
        <button
          type="button"
          onClick={() => play(allowed)}
          className="ml-auto inline-flex items-center gap-1 rounded-sm px-2 py-1 text-xs text-muted-foreground transition hover:bg-gold/10 hover:text-foreground"
        >
          <RotateCcw size={12} />
          もう一度
        </button>
      </div>

      <div ref={ref} className="relative mt-4 h-52 overflow-hidden rounded-sm border border-border bg-background sm:h-48">
        {/* ブラウザの枠（画面＋門番） */}
        <div className="absolute inset-y-3 left-[2%] w-[60%] rounded-sm border-2 border-primary/80">
          <div className="border-b border-primary/40 px-2 py-0.5 font-serif text-[11px] font-bold">ブラウザ</div>
        </div>
        {/* 画面 */}
        <div className="absolute bottom-6 w-[30%] -translate-x-1/2 rounded-sm border border-foreground/60 bg-card px-1.5 py-1.5 text-center text-[11px] leading-tight" style={{ left: PAGE }}>
          <div className="font-bold">画面（React）</div>
          <div className="mt-0.5 font-mono text-[10px] text-muted-foreground">localhost:5173</div>
        </div>
        {/* 門番 */}
        <div className="absolute inset-y-9 w-px -translate-x-1/2 border-l-2 border-dashed border-gold" style={{ left: GATE }} />
        <div className="absolute bottom-6 -translate-x-1/2 text-center text-[10px] leading-tight text-gold" style={{ left: GATE }}>
          <ShieldCheck size={18} className="mx-auto" />
          <div className="bg-background font-bold">門番</div>
        </div>
        {/* サーバー */}
        <div className="absolute bottom-6 w-[26%] -translate-x-1/2 rounded-sm border-2 border-gold bg-gold/10 px-1.5 py-1.5 text-center text-[11px] leading-tight" style={{ left: SERVER }}>
          <div className="font-bold">API（Hono）</div>
          <div className="mt-0.5 font-mono text-[10px] text-muted-foreground">localhost:3000</div>
        </div>

        {inView && (
          <div key={playId} aria-hidden="true">
            {/* リクエスト：画面 → サーバー（門番は出ていくお願いは止めない） */}
            <Chip
              className="top-[24%] border-foreground/70 bg-card"
              style={anim("fig-travel-vanish", 1.4, 0.2, { "--fig-from": PAGE, "--fig-to": SERVER } as CSSProperties)}
            >
              GET /api/items
            </Chip>

            {/* レスポンス：サーバー → 門番（→ 許可があれば画面まで） */}
            <Chip
              className={cn("top-[40%]", allowed ? "border-gold bg-gold/15" : "border-foreground/70 bg-card")}
              style={anim("fig-travel", allowed ? 1.8 : 1, 1.7, {
                "--fig-from": SERVER,
                "--fig-to": allowed ? PAGE : GATE,
              } as CSSProperties)}
            >
              {allowed ? "200 ＋ JSON ＋ 許可ヘッダー" : "200 ＋ JSON"}
            </Chip>

            {/* 判定 */}
            <div
              className="absolute top-[58%] -translate-x-1/2"
              style={{ left: allowed ? PAGE : GATE }}
            >
              {/* 出現（pop）と揺れ（shake）はどちらもtransformを使うので要素を分ける */}
              <div style={anim("fig-pop", 0.3, allowed ? 3.5 : 2.7)}>
                <div
                  className={cn(
                    "inline-flex items-center gap-1 whitespace-nowrap rounded-sm px-1.5 py-0.5 text-[10px] font-bold sm:text-xs",
                    allowed ? "bg-gold text-primary-foreground" : "bg-destructive text-destructive-foreground"
                  )}
                  style={allowed ? undefined : anim("fig-shake", 0.4, 3.0)}
                >
                  {allowed ? <Check size={12} /> : <Ban size={12} />}
                  {allowed ? "受け取れた！" : "画面には渡さない！"}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <p className="mt-3 text-xs leading-relaxed">
        {allowed ? (
          <>
            <span className="font-bold">CORS設定あり：</span>
            お返事に
            <code className="mx-1 rounded bg-muted px-1 py-0.5">Access-Control-Allow-Origin</code>
            という許可ヘッダーが付くので、門番（ブラウザ）が「このお店は許可している」と判断して画面に渡します。
          </>
        ) : (
          <>
            <span className="font-bold text-destructive">CORS設定なし：</span>
            お願いはサーバーに届き、お返事も返ってきます。ところが許可ヘッダーがないため、
            門番（ブラウザ）が画面に渡さず、コンソールにCORSエラーが表示されます。
          </>
        )}
      </p>
    </Figure>
  );
}
