import { useEffect, useRef, useState, type CSSProperties } from "react";
import { ArrowRight, Star, X } from "lucide-react";
import { PUBLISHED_UP_TO, SESSION_TOP_PAGES } from "@/lib/routes";
import {
  getClearedSessions,
  getSessionFlow,
  isAllCleared,
  type SessionNumber,
} from "@/lib/clear";
import { cn } from "@/lib/utils";

const FADE_MS = 300;

// 回ごとの達成報告書の文面
const SESSION_INFO: Record<
  SessionNumber,
  { kanji: string; title: string; honor: string; flavor: string }
> = {
  1: {
    kanji: "壱",
    title: "Honoでよろず屋APIを作ろう",
    honor: "駆け出しAPI職人",
    flavor: "よろず屋の看板が掲げられた。はじめてのAPIが、冒険者たちの注文を受け付けはじめる。",
  },
  2: {
    kanji: "弐",
    title: "堅牢なAPIにしよう",
    honor: "堅牢なる検証士",
    flavor: "怪しい注文はもう通さない。zodの盾とテストの目が、店を守っている。",
  },
  3: {
    kanji: "参",
    title: "データベースを導入しよう",
    honor: "帳簿を刻む者",
    flavor: "店を閉めても在庫は消えない。D1の帳簿に、商いの記録が刻まれた。",
  },
  4: {
    kanji: "肆",
    title: "本番デプロイでよろず屋を開店しよう",
    honor: "よろず屋の店主",
    flavor: "よろず屋は世界に向けて店を開いた。どこの冒険者でも、このAPIに手が届く。",
  },
};

// 演出のタイムライン（ミリ秒）
const T = {
  stamp: 450, // 判子が押される
  impact: 650, // 押した衝撃（報告書が沈む・紙吹雪が舞う）
  rewards: 900, // 報酬の行が順に出る
  rank: 1400,
  actions: 1700,
};
const EXP_COUNT_MS = 700;

// 紙吹雪（描画のたびに変わらないよう、位置は決め打ちで生成する）
const CONFETTI_COLORS = ["bg-gold", "bg-[#b3402a]", "bg-primary"];
const CONFETTI = Array.from({ length: 28 }, (_, i) => {
  const angle = (i / 28) * Math.PI * 2 + (i % 2 ? 0.12 : -0.08);
  const dist = 190 + ((i * 53) % 150);
  return {
    tx: Math.round(Math.cos(angle) * dist),
    ty: Math.round(Math.sin(angle) * dist * 0.8 - 40),
    rot: ((i * 67) % 360) - 180,
    color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
    diamond: i % 4 === 0,
    delay: (i % 5) * 25,
  };
});

function delay(ms: number): CSSProperties {
  return { animationDelay: `${ms}ms` };
}

type Shown = { session: SessionNumber; rank: number };

// ある回のメインフローのクエストが揃った瞬間に表示する「達成報告書」。
// 「未達成 → 達成」に変わった回についてだけ発火する。
// 全回がそろった瞬間は AllClearOverlay に任せるため表示しない。
export function SessionClearOverlay() {
  const [shown, setShown] = useState<Shown | null>(null);
  const [leaving, setLeaving] = useState(false);
  const [exp, setExp] = useState(0);
  const clearedRef = useRef<SessionNumber[]>(getClearedSessions());
  const dialogRef = useRef<HTMLDivElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const onUpdate = () => {
      const cleared = getClearedSessions();
      const newly = cleared.find((n) => !clearedRef.current.includes(n));
      clearedRef.current = cleared;
      if (newly && !isAllCleared()) {
        setShown({ session: newly, rank: cleared.length });
        setLeaving(false);
        return;
      }
      // 表示中の回が未達成へ戻されたら即非表示
      setShown((cur) => (cur && !cleared.includes(cur.session) ? null : cur));
    };
    const onClear = () => {
      clearedRef.current = [];
      setShown(null);
      setLeaving(false);
    };
    window.addEventListener("progress-updated", onUpdate);
    window.addEventListener("progress-cleared", onClear);
    return () => {
      window.removeEventListener("progress-updated", onUpdate);
      window.removeEventListener("progress-cleared", onClear);
    };
  }, []);

  const totalExp = shown
    ? getSessionFlow(shown.session).reduce((sum, p) => sum + (p.minutes ?? 0), 0)
    : 0;

  // 経験値のカウントアップ
  useEffect(() => {
    if (!shown) return;
    setExp(0);
    const steps = 20;
    let step = 0;
    let interval: number | undefined;
    const start = window.setTimeout(() => {
      interval = window.setInterval(() => {
        step += 1;
        setExp(Math.round((totalExp * step) / steps));
        if (step >= steps) window.clearInterval(interval);
      }, EXP_COUNT_MS / steps);
    }, T.rewards);
    return () => {
      window.clearTimeout(start);
      window.clearInterval(interval);
    };
  }, [shown, totalExp]);

  // 開いたら報告書にフォーカスを移し、閉じたら元の場所へ戻す
  useEffect(() => {
    if (!shown) return;
    returnFocusRef.current = document.activeElement as HTMLElement | null;
    dialogRef.current?.focus();
    return () => {
      returnFocusRef.current?.focus?.();
    };
  }, [shown]);

  useEffect(() => {
    if (!shown) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [shown]);

  function handleClose() {
    setLeaving(true);
    window.setTimeout(() => setShown(null), FADE_MS);
  }

  if (!shown) return null;

  const n = shown.session;
  const info = SESSION_INFO[n];
  const questCount = getSessionFlow(n).length;
  const nextNumber = n + 1;
  const nextTop =
    nextNumber <= PUBLISHED_UP_TO
      ? SESSION_TOP_PAGES.find((p) => p.section === `session${nextNumber}`)
      : undefined;
  const nextInfo = nextTop ? SESSION_INFO[nextNumber as SessionNumber] : undefined;

  return (
    <div
      className={cn(
        "fixed inset-0 z-[60] flex overflow-y-auto p-4 transition-opacity duration-300",
        leaving ? "opacity-0" : "opacity-100"
      )}
    >
      <div className="fixed inset-0 bg-black/50" onClick={handleClose} aria-hidden="true" />

      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="session-clear-title"
        tabIndex={-1}
        className="relative m-auto w-full max-w-md animate-report-in outline-none"
      >
        {/* 四隅できらめく金の星 */}
        {[
          "-left-3 -top-4",
          "-right-4 top-10",
          "-bottom-4 left-8",
          "-right-2 -bottom-3",
        ].map((pos, i) => (
          <span
            key={pos}
            aria-hidden="true"
            className={cn(
              "pointer-events-none absolute text-lg text-gold animate-twinkle motion-reduce:animate-none",
              pos
            )}
            style={delay(i * 450)}
          >
            ✦
          </span>
        ))}

        <div
          className="relative animate-report-thud border-2 border-primary bg-card p-1.5"
          style={delay(T.impact)}
        >
          <span aria-hidden="true" className="pointer-events-none absolute -left-[3px] -top-[3px] h-4 w-4 border-l-2 border-t-2 border-gold" />
          <span aria-hidden="true" className="pointer-events-none absolute -right-[3px] -top-[3px] h-4 w-4 border-r-2 border-t-2 border-gold" />
          <span aria-hidden="true" className="pointer-events-none absolute -bottom-[3px] -left-[3px] h-4 w-4 border-b-2 border-l-2 border-gold" />
          <span aria-hidden="true" className="pointer-events-none absolute -bottom-[3px] -right-[3px] h-4 w-4 border-b-2 border-r-2 border-gold" />
          <button
            type="button"
            onClick={handleClose}
            aria-label="閉じる"
            className="absolute right-2 top-2 z-10 rounded-sm p-1 text-muted-foreground transition hover:bg-secondary/60 hover:text-foreground"
          >
            <X size={18} />
          </button>

          <div className="border border-gold/50 px-6 pb-6 pt-7 text-center sm:px-10">
            <p className="font-serif text-xs tracking-[0.5em] text-gold">
              冒険者ギルド 達成報告書
            </p>
            <p className="mt-4 font-serif text-sm font-bold tracking-[0.4em] text-gold">
              ✦ QUEST CLEAR ✦
            </p>
            <p id="session-clear-title" className="mt-2 font-serif text-xl font-bold leading-snug">
              <span className="block text-sm text-muted-foreground">第{n}回</span>
              {info.title}
            </p>

            {/* 朱の判子（少し遅れて押される） */}
            <div className="mt-5 flex justify-center">
              <span
                className={cn(
                  "inline-flex -rotate-[8deg] animate-stamp-in items-center rounded [animation-fill-mode:backwards]",
                  "border-[3px] border-[#b3402a] bg-[#b3402a] px-5 py-2",
                  "outline outline-2 -outline-offset-[6px] outline-white/90",
                  "font-serif text-lg font-bold tracking-widest text-white",
                  "shadow-sm"
                )}
                style={delay(T.stamp)}
              >
                第{info.kanji}回 踏破
              </span>
            </div>

            <p
              className="mt-5 animate-reveal-up text-sm leading-relaxed text-muted-foreground [animation-fill-mode:backwards]"
              style={delay(T.rewards - 150)}
            >
              {info.flavor}
            </p>

            {/* 獲得報酬 */}
            <div className="mt-5 text-left">
              <p className="flex items-center gap-2 font-serif text-xs font-bold tracking-widest text-gold">
                <span className="h-px flex-1 bg-gold/60" aria-hidden="true" />
                獲得報酬
                <span className="h-px flex-1 bg-gold/60" aria-hidden="true" />
              </p>
              <dl className="mt-2 text-sm">
                <RewardRow label="経験値" delayMs={T.rewards}>
                  <span aria-hidden="true" className="tabular-nums">+{exp} EXP</span>
                  <span className="sr-only">+{totalExp} EXP</span>
                </RewardRow>
                <RewardRow label="達成クエスト" delayMs={T.rewards + 150}>
                  {questCount} / {questCount}
                </RewardRow>
                <RewardRow label="称号" delayMs={T.rewards + 300}>
                  <span className="font-serif font-bold text-[#b3402a] dark:text-destructive">
                    「{info.honor}」
                  </span>
                </RewardRow>
              </dl>
            </div>

            {/* ギルドランク（クリアした回の数だけ星が灯る） */}
            <div
              className="mt-4 flex animate-reveal-up items-center justify-center gap-3 [animation-fill-mode:backwards]"
              style={delay(T.rank)}
            >
              <span className="font-serif text-xs font-bold tracking-widest text-muted-foreground">
                ギルドランク
              </span>
              <span className="flex gap-0.5" role="img" aria-label={`星${shown.rank}つ（全4つ）`}>
                {[0, 1, 2, 3].map((i) => (
                  <Star
                    key={i}
                    size={18}
                    aria-hidden="true"
                    className={cn(
                      i < shown.rank ? "fill-gold text-gold" : "text-border",
                      i === shown.rank - 1 && "animate-star-pop [animation-fill-mode:backwards]"
                    )}
                    style={i === shown.rank - 1 ? delay(T.rank + 150) : undefined}
                  />
                ))}
              </span>
              <span className="font-serif text-xs font-bold text-[#b3402a] dark:text-destructive">
                ランクアップ！
              </span>
            </div>

            <div
              className="mt-6 flex animate-reveal-up flex-col items-center gap-2 [animation-fill-mode:backwards]"
              style={delay(T.actions)}
            >
              {nextTop && nextInfo ? (
                <a
                  href={`#${nextTop.path}`}
                  onClick={handleClose}
                  className="inline-flex items-center gap-2 rounded-sm border border-primary bg-primary px-5 py-2.5 font-serif text-sm font-bold text-primary-foreground transition hover:opacity-90"
                >
                  第{nextNumber}回へ進む
                  <ArrowRight size={16} />
                </a>
              ) : (
                <p className="text-sm text-muted-foreground">
                  {n === 4
                    ? "残りの回のクエストもすべて達成すると、講座修了だ。"
                    : "次の依頼書はただいま準備中。公開をお楽しみに！"}
                </p>
              )}
              <button
                type="button"
                onClick={handleClose}
                className="rounded-sm px-3 py-1.5 text-xs text-muted-foreground underline-offset-4 transition hover:text-foreground hover:underline"
              >
                報告書をしまう
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 判子の衝撃で舞う紙吹雪 */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 overflow-hidden motion-reduce:hidden"
      >
        <div className="absolute left-1/2 top-1/2">
          {CONFETTI.map((c, i) => (
            <span
              key={i}
              className={cn(
                "absolute animate-confetti opacity-0",
                c.color,
                c.diamond ? "h-2 w-2" : "h-3 w-1.5"
              )}
              style={
                {
                  "--tx": `${c.tx}px`,
                  "--ty": `${c.ty}px`,
                  "--rot": `${c.rot}deg`,
                  animationDelay: `${T.impact + c.delay}ms`,
                } as CSSProperties
              }
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function RewardRow({
  label,
  delayMs,
  children,
}: {
  label: string;
  delayMs: number;
  children: React.ReactNode;
}) {
  return (
    <div
      className="flex animate-reveal-up items-baseline gap-2 border-b border-dotted border-gold/60 py-1.5 [animation-fill-mode:backwards]"
      style={delay(delayMs)}
    >
      <dt className="shrink-0 text-muted-foreground">{label}</dt>
      <dd className="ml-auto text-right font-bold">{children}</dd>
    </div>
  );
}
