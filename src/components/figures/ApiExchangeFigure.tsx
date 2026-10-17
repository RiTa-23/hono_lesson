import { useState, type CSSProperties } from "react";
import { RotateCcw, ScrollText } from "lucide-react";
import { cn } from "@/lib/utils";
import { Figure, FigureButton, MiniCode } from "./Figure";
import { Adventurer, Counter, Floor, Shelf, SHELF_H, SHELF_W, Shopkeeper } from "./Characters";
import { useInView } from "./useInView";
import { anim } from "./anim";

type Scenario = {
  label: string;
  method: "GET" | "POST";
  path: string;
  body?: string;
  status: number;
  reply: string;
  response: string;
};

const SCENARIOS: Scenario[] = [
  {
    label: "商品一覧を見せて",
    method: "GET",
    path: "/api/items",
    status: 200,
    reply: "はい、どうぞ",
    response: `[
  { "id": 1, "name": "やくそう", "price": 8, … },
  { "id": 2, "name": "ポーション", "price": 50, … },
  …
]`,
  },
  {
    label: "ポーションを1本ください",
    method: "POST",
    path: "/api/purchase",
    body: `{ "itemId": 2, "quantity": 1 }`,
    status: 200,
    reply: "はいよ、50ゴールドね",
    response: `{
  "gold": 450,
  "items": [{ "itemId": 2, "quantity": 1 }]
}`,
  },
  {
    label: "エリクサーを1本ください",
    method: "POST",
    path: "/api/purchase",
    body: `{ "itemId": 3, "quantity": 1 }`,
    status: 400,
    reply: "お金が足りないよ",
    response: `{ "message": "お金が足りないよ" }`,
  },
  {
    label: "じゅうたんを見せて",
    method: "GET",
    path: "/api/items/50",
    status: 404,
    reply: "そんな商品は置いてないよ",
    response: `{ "message": "そんな商品は置いてないよ" }`,
  },
];

// キャラクターの横位置（%）。下のラベル（3列グリッド）の中心と揃えている
const FRONT = "16.7%";
const API = "50%";
// 倉庫（棚）の左端。棚の中心が右列の中心（83.3%）に来るようにする
const SHELF_X = 533 - SHELF_W / 2;

// アニメーションのタイミング（秒）
const T = {
  say: 0,
  request: 0.3,
  requestDur: 1.2,
  lookup: 1.5,
  reply: 2.1,
  response: 2.2,
  responseDur: 1.2,
};


function isOk(status: number) {
  return status >= 200 && status < 300;
}

// セリフ（HTML。位置は%指定で絵に重ねる）。RPGのメッセージウィンドウ風：焦茶の窓に白い二重枠
function Bubble({
  left,
  style,
  tone,
  more,
  children,
}: {
  left: string;
  style: CSSProperties;
  tone?: "ok" | "ng";
  // 末尾に点滅する「▼」を付ける（話の続きがある合図）
  more?: boolean;
  children: string;
}) {
  // 位置合わせ（translate）と演出（animationのtransform）がぶつからないよう、外側と内側に分ける
  return (
    <div className="absolute top-[18%] w-max max-w-[34%] -translate-x-1/2" style={{ left }}>
      <div
        className={cn(
          "relative rounded-md border-2 border-[#f4efe3] bg-[#2b2118] px-2 py-1 text-center text-[11px] leading-snug shadow-[0_0_0_2px_#2b2118] sm:px-2.5 sm:text-xs",
          tone === "ng" ? "text-[#f5a58f]" : "text-[#f4efe3]",
          more && "pb-2.5"
        )}
        style={style}
      >
        {children}
        {more && (
          <span
            aria-hidden="true"
            className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 text-[8px] text-[#f4efe3]"
            style={{ animation: "fig-frame-a 0.8s step-end infinite" }}
          >
            ▼
          </span>
        )}
      </div>
    </div>
  );
}

export function ApiExchangeFigure() {
  const [index, setIndex] = useState(0);
  const [playId, setPlayId] = useState(0);
  const { ref, inView } = useInView<HTMLDivElement>();
  const s = SCENARIOS[index];
  const ok = isOk(s.status);

  const play = (i: number) => {
    setIndex(i);
    setPlayId((n) => n + 1);
  };

  return (
    <Figure
      title="よろず屋の店頭 ＝ APIのやりとり"
      caption="冒険者（フロントエンド）がお願い（リクエスト）を出し、店主（API）が倉庫（データ）を確認してお返事（レスポンス）を返す"
    >
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-serif text-xs text-muted-foreground">お願いを選ぶ：</span>
        {SCENARIOS.map((sc, i) => (
          <FigureButton key={sc.label} active={i === index} onClick={() => play(i)}>
            {sc.label}
          </FigureButton>
        ))}
        <button
          type="button"
          onClick={() => play(index)}
          className="ml-auto inline-flex items-center gap-1 rounded-sm px-2 py-1 text-xs text-muted-foreground transition hover:bg-gold/10 hover:text-foreground"
        >
          <RotateCcw size={12} />
          もう一度
        </button>
      </div>

      {/* 絵（SVG）＋ 動く伝票・吹き出し（HTML） */}
      <div ref={ref} className="relative mt-4 overflow-hidden rounded-sm border border-border bg-background">
        <svg viewBox="0 0 640 300" className="block w-full" role="img" aria-label="冒険者・店主・倉庫の絵">
          <Floor x={0} y={280} width={640} />
          <Adventurer x={107} y={280} />
          <Shopkeeper x={320} y={225} />
          <Counter x={320} y={225} width={160} height={55} />
          {/* 店主 → 倉庫：確認しに行く点線 */}
          <path d="M 408 205 H 458" className="stroke-gold" strokeWidth={3} strokeDasharray="5 5" fill="none" />
          <Shelf x={SHELF_X} y={280 - SHELF_H} />
          {inView && (
            <rect
              key={`glow-${playId}`}
              x={SHELF_X - 6}
              y={280 - SHELF_H - 6}
              width={SHELF_W + 12}
              height={SHELF_H + 6}
              fill="none"
              className="stroke-gold"
              strokeWidth={4}
              style={anim("fig-glow", 0.7, T.lookup)}
            />
          )}
        </svg>

        {inView && (
          <div key={playId} aria-hidden="true">
            <Bubble left={FRONT} style={anim("fig-fade-in", 0.3, T.say)}>
              {`「${s.label}」`}
            </Bubble>

            {/* リクエストの伝票：冒険者 → 店主（届いたら消える） */}
            <div
              className="absolute top-[3%] inline-flex -translate-x-1/2 items-center gap-1 whitespace-nowrap rounded-sm border border-foreground/70 bg-card px-2 py-1 font-mono text-[10px] shadow-sm sm:text-xs"
              style={anim("fig-travel-vanish", T.requestDur, T.request, {
                "--fig-from": FRONT,
                "--fig-to": API,
              } as CSSProperties)}
            >
              <ScrollText size={12} className="shrink-0 text-gold" />
              {s.method} {s.path}
            </div>

            <Bubble left={API} tone={ok ? "ok" : "ng"} more style={anim("fig-pop", 0.3, T.reply)}>
              {`「${s.reply}」`}
            </Bubble>

            {/* レスポンスの伝票：店主 → 冒険者（届いたら残る） */}
            <div
              className={cn(
                "absolute top-[3%] inline-flex -translate-x-1/2 items-center gap-1 whitespace-nowrap rounded-sm border px-2 py-1 font-mono text-[10px] font-bold shadow-sm sm:text-xs",
                ok ? "border-gold bg-gold/15" : "border-destructive bg-destructive/10 text-destructive"
              )}
              style={anim("fig-travel", T.responseDur, T.response, {
                "--fig-from": API,
                "--fig-to": FRONT,
              } as CSSProperties)}
            >
              {s.status} ＋ JSON
            </div>
          </div>
        )}
      </div>

      {/* キャラクターの役割（絵の真下に3列で揃える） */}
      <div className="mt-2 grid grid-cols-3 gap-2 text-center text-xs leading-snug">
        <div>
          <div className="font-serif font-bold">冒険者</div>
          <div className="text-muted-foreground">フロントエンド（React・完成済み）</div>
        </div>
        <div>
          <div className="font-serif font-bold">店主</div>
          <div className="text-muted-foreground">
            API（Hono）
            <span className="ml-1 whitespace-nowrap rounded-sm bg-gold/20 px-1 font-bold text-gold">今回作る</span>
          </div>
        </div>
        <div>
          <div className="font-serif font-bold">倉庫</div>
          <div className="text-muted-foreground">データ（商品・所持金）</div>
        </div>
      </div>

      {/* 伝票の中身 */}
      <div key={`detail-${playId}`} className="mt-4 grid gap-3 grid-cols-1 sm:grid-cols-2">
        <MiniCode
          label="お願い（リクエスト）"
          code={`${s.method} ${s.path}${s.body ? `\n\n${s.body}` : ""}`}
        />
        <div style={inView ? anim("fig-fade-in", 0.4, T.response) : { opacity: 0 }}>
          <MiniCode label={`お返事（レスポンス）… ステータス ${s.status}`} code={s.response} />
        </div>
      </div>
    </Figure>
  );
}
