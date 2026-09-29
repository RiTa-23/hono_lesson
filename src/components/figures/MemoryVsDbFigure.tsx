import { useState, type ReactNode } from "react";
import { Database, Power, RotateCcw, ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";
import { Figure } from "./Figure";
import { anim } from "./anim";

type Player = { gold: number; potions: number };

const INITIAL: Player = { gold: 500, potions: 0 };
const AFTER_SHOPPING: Player = { gold: 450, potions: 1 };

function PlayerData({ p, tone }: { p: Player; tone?: "reset" }) {
  return (
    <div className={cn("rounded-sm border px-2 py-1.5 font-mono text-[11px] leading-relaxed", tone === "reset" ? "border-destructive bg-destructive/10" : "border-gold bg-gold/10")}>
      <div>gold: {p.gold}</div>
      <div>ポーション: {p.potions}本</div>
    </div>
  );
}

function ServerBox({ restarting, children }: { restarting: boolean; children?: ReactNode }) {
  return (
    <div className="rounded-sm border-2 border-primary/80 bg-card p-2">
      <div className="flex items-center justify-between font-serif text-[11px] font-bold">
        サーバー（Hono）
        <Power size={13} className={restarting ? "text-destructive" : "text-gold"} />
      </div>
      <div className="mt-1.5 min-h-[3.4rem]">{children}</div>
    </div>
  );
}

export function MemoryVsDbFigure() {
  // restarts: 再起動した回数（アニメーションの再生キーを兼ねる）
  const [restarts, setRestarts] = useState(0);
  const [memory, setMemory] = useState<Player>(AFTER_SHOPPING);
  // D1側はサーバーの再起動で変わらないので固定
  const db = AFTER_SHOPPING;

  const restart = () => {
    setRestarts((n) => n + 1);
    setMemory(INITIAL);
  };
  const shop = () => {
    setRestarts(0);
    setMemory(AFTER_SHOPPING);
  };

  const restarted = restarts > 0;

  return (
    <Figure
      title="サーバーを再起動すると、データはどうなる？"
      caption="メモリ上のデータはサーバーと一緒に消えて初期値に戻る。D1のデータはサーバーの外にあるので残る"
    >
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={restart}
          className="inline-flex items-center gap-1 rounded-sm border border-destructive bg-destructive/10 px-2.5 py-1 text-xs font-bold text-destructive transition hover:bg-destructive/20"
        >
          <Power size={13} />
          サーバーを再起動する
        </button>
        <button
          type="button"
          onClick={shop}
          className="inline-flex items-center gap-1 rounded-sm border border-border bg-background px-2.5 py-1 text-xs transition hover:border-gold hover:bg-gold/10"
        >
          {restarted ? <RotateCcw size={13} /> : <ShoppingBag size={13} />}
          ポーションを1本買った状態に戻す
        </button>
      </div>

      <div className="mt-4 grid gap-4 grid-cols-1 sm:grid-cols-2">
        {/* メモリ */}
        <div className="rounded-sm border border-border bg-background p-3">
          <p className="font-serif text-sm font-bold">第1・2回：メモリに置く</p>
          <div className="mt-2" key={`m-${restarts}`} style={restarted ? anim("fig-shake", 0.4, 0) : undefined}>
            <ServerBox restarting={restarted}>
              <p className="mb-1 text-[10px] text-muted-foreground">const player = {"{ … }"}</p>
              <div key={`md-${restarts}`} style={restarted ? anim("fig-pop", 0.4, 0.4) : undefined}>
                <PlayerData p={memory} tone={restarted ? "reset" : undefined} />
              </div>
            </ServerBox>
          </div>
          <p className={cn("mt-2 text-xs leading-relaxed", restarted && "font-bold text-destructive")}>
            {restarted ? "初期値（500G・所持品なし）に巻き戻った…" : "買い物の結果はサーバーの中だけにある"}
          </p>
        </div>

        {/* D1 */}
        <div className="rounded-sm border border-gold/60 bg-background p-3">
          <p className="font-serif text-sm font-bold">第3回〜：D1に置く</p>
          <div className="mt-2" key={`d-${restarts}`} style={restarted ? anim("fig-shake", 0.4, 0) : undefined}>
            <ServerBox restarting={restarted}>
              <p className="text-[10px] leading-relaxed text-muted-foreground">
                データは持っていない。
                <br />
                必要なときにD1へ読み書きしに行く
              </p>
            </ServerBox>
          </div>
          <div className="my-1 text-center text-xs text-gold" aria-hidden="true">
            ▲▼ 読み書き
          </div>
          <div className="rounded-sm border-2 border-gold bg-card p-2">
            <div className="flex items-center gap-1 font-serif text-[11px] font-bold">
              <Database size={13} className="text-gold" />
              D1（サーバーの外）
            </div>
            <div className="mt-1.5">
              <PlayerData p={db} />
            </div>
          </div>
          <p className={cn("mt-2 text-xs leading-relaxed", restarted && "font-bold")}>
            {restarted ? "再起動しても450G・ポーション1本のまま！" : "買い物の結果はD1に保存されている"}
          </p>
        </div>
      </div>
    </Figure>
  );
}
