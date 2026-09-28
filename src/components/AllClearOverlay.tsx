import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Star, X } from "lucide-react";
import { AchievementStamp } from "@/components/AchievementStamp";
import { ConfettiBurst, ConfettiShower } from "@/components/Confetti";
import { ShareOnXButton } from "@/components/ShareOnXButton";
import { isAllCleared, SESSION_CLEAR_CLOSED_EVENT } from "@/lib/clear";
import { MAIN_FLOW } from "@/lib/routes";
import { rankStars } from "@/lib/share";
import { useCountUp } from "@/lib/useCountUp";
import { cn } from "@/lib/utils";

const FADE_MS = 300;

// 講座修了で授与する最終称号（第4回の「よろず屋マスター」より上の位）
const FINAL_HONOR = "伝説のよろず屋";

// 回ごとの判子に押す漢数字
const SESSION_KANJI = ["壱", "弐", "参", "肆"];

// 演出のタイムライン（ミリ秒）
const T = {
  title: 300, // 題字が浮かび上がる
  sessionStamps: 900, // 回ごとの判子が1つずつ押される（間隔 STAMP_GAP）
  bigStamp: 1900, // 「全クエスト達成」の大判子
  impact: 2100, // 大判子の衝撃（修了証が沈む・紙吹雪）
  stats: 2400, // 戦績が順に出る
  honor: 3100, // 最終称号
  actions: 3600,
};
const STAMP_GAP = 220;
const EXP_COUNT_MS = 900;

// 修了証の後ろでゆっくり回る金の後光（グラデーションを使わず、塗りの扇形を並べる）
const RAY_COUNT = 24;
const RAYS = Array.from({ length: RAY_COUNT }, (_, i) => {
  const a1 = (i / RAY_COUNT) * Math.PI * 2;
  const a2 = ((i + 0.35) / RAY_COUNT) * Math.PI * 2;
  return `M50 50 L${50 + 50 * Math.cos(a1)} ${50 + 50 * Math.sin(a1)} L${50 + 50 * Math.cos(a2)} ${50 + 50 * Math.sin(a2)} Z`;
});

function delay(ms: number): CSSProperties {
  return { animationDelay: `${ms}ms` };
}

// 全メインフローのクエストが揃ったときに表示する「講座修了証」。
// 「未達成 → 全達成」の遷移したときだけ発火する。
// 全クリの瞬間は最後の回のクリア演出（SessionClearOverlay）も出るため、
// そちらが閉じられる（SESSION_CLEAR_CLOSED_EVENT）のを待ってから表示する。
// 初回マウント時点で既に全達成済みの場合は表示しない（Home側の常時表示に任せる）。
export function AllClearOverlay() {
  // 表示を開始した時刻（非表示のときは null）。カウントアップのやり直しの合図にも使う
  const [openedAt, setOpenedAt] = useState<number | null>(null);
  const [leaving, setLeaving] = useState(false);
  const clearedRef = useRef(isAllCleared());
  // 全達成したが、回クリア演出が閉じられるのを待っている状態
  const pendingRef = useRef(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const onUpdate = () => {
      const cleared = isAllCleared();
      if (cleared && !clearedRef.current) {
        pendingRef.current = true;
      } else if (!cleared) {
        // 待機中・表示中に未達成へ戻されたら取り消す（達成状態が崩れたため）
        pendingRef.current = false;
        setOpenedAt(null);
        setLeaving(false);
      }
      clearedRef.current = cleared;
    };
    const onSessionClearClosed = () => {
      if (!pendingRef.current) return;
      pendingRef.current = false;
      setOpenedAt(Date.now());
      setLeaving(false);
    };
    const onClear = () => {
      clearedRef.current = false;
      pendingRef.current = false;
      setOpenedAt(null);
      setLeaving(false);
    };
    window.addEventListener("progress-updated", onUpdate);
    window.addEventListener("progress-cleared", onClear);
    window.addEventListener(SESSION_CLEAR_CLOSED_EVENT, onSessionClearClosed);
    return () => {
      window.removeEventListener("progress-updated", onUpdate);
      window.removeEventListener("progress-cleared", onClear);
      window.removeEventListener(SESSION_CLEAR_CLOSED_EVENT, onSessionClearClosed);
    };
  }, []);

  const totalExp = MAIN_FLOW.reduce((sum, p) => sum + (p.minutes ?? 0), 0);
  const questCount = MAIN_FLOW.length;
  const exp = useCountUp(totalExp, openedAt, {
    delayMs: T.stats + 300,
    durationMs: EXP_COUNT_MS,
  });

  // 開いたら修了証にフォーカスを移し、閉じたら元の場所へ戻す
  useEffect(() => {
    if (openedAt == null) return;
    returnFocusRef.current = document.activeElement as HTMLElement | null;
    dialogRef.current?.focus();
    return () => {
      returnFocusRef.current?.focus?.();
    };
  }, [openedAt]);

  useEffect(() => {
    if (openedAt == null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openedAt]);

  function handleClose() {
    setLeaving(true);
    window.setTimeout(() => setOpenedAt(null), FADE_MS);
  }

  if (openedAt == null) return null;

  return (
    <div
      className={cn(
        "fixed inset-0 z-[60] flex overflow-y-auto p-4 transition-opacity duration-300",
        leaving ? "opacity-0" : "opacity-100"
      )}
    >
      <div className="fixed inset-0 bg-black/60" onClick={handleClose} aria-hidden="true" />

      {/* 金の後光 */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 flex items-center justify-center overflow-hidden"
      >
        <svg
          viewBox="0 0 100 100"
          className="h-[160vmax] w-[160vmax] shrink-0 animate-[spin_80s_linear_infinite] fill-gold opacity-[0.12] motion-reduce:animate-none"
        >
          {RAYS.map((d) => (
            <path key={d} d={d} />
          ))}
        </svg>
      </div>

      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="all-clear-title"
        tabIndex={-1}
        className="relative m-auto w-full max-w-lg animate-report-in outline-none"
      >
        {/* 周りできらめく金の星 */}
        {[
          "-left-4 -top-5 text-2xl",
          "-right-5 top-16 text-xl",
          "-left-6 top-1/2 text-lg",
          "-right-3 bottom-24 text-2xl",
          "-bottom-5 left-10 text-xl",
          "-top-6 right-20 text-lg",
        ].map((pos, i) => (
          <span
            key={pos}
            aria-hidden="true"
            className={cn(
              "pointer-events-none absolute text-gold animate-twinkle motion-reduce:animate-none",
              pos
            )}
            style={delay(i * 300)}
          >
            ✦
          </span>
        ))}

        <div
          className="relative animate-report-thud border-[3px] border-double border-primary bg-card p-2"
          style={delay(T.impact)}
        >
          <span aria-hidden="true" className="pointer-events-none absolute -left-[4px] -top-[4px] h-6 w-6 border-l-[3px] border-t-[3px] border-gold" />
          <span aria-hidden="true" className="pointer-events-none absolute -right-[4px] -top-[4px] h-6 w-6 border-r-[3px] border-t-[3px] border-gold" />
          <span aria-hidden="true" className="pointer-events-none absolute -bottom-[4px] -left-[4px] h-6 w-6 border-b-[3px] border-l-[3px] border-gold" />
          <span aria-hidden="true" className="pointer-events-none absolute -bottom-[4px] -right-[4px] h-6 w-6 border-b-[3px] border-r-[3px] border-gold" />
          <button
            type="button"
            onClick={handleClose}
            aria-label="閉じる"
            className="absolute right-3 top-3 z-10 rounded-sm p-1 text-muted-foreground transition hover:bg-secondary/60 hover:text-foreground"
          >
            <X size={18} />
          </button>

          <div className="border-2 border-gold/60 px-6 pb-7 pt-8 text-center sm:px-10">
            <p className="font-serif text-xs tracking-[0.5em] text-gold">
              冒険者ギルド 公式認定
            </p>
            <p
              id="all-clear-title"
              className="mt-4 animate-title-in pl-[0.3em] font-serif text-3xl font-bold tracking-[0.3em] [animation-fill-mode:backwards] sm:text-4xl"
              style={delay(T.title)}
            >
              講座修了証
            </p>
            <p className="mt-1 font-serif text-sm text-muted-foreground">よろず屋API講座</p>
            <div className="mx-auto mt-3 flex w-32 flex-col gap-0.5" aria-hidden="true">
              <span className="h-0.5 bg-gold" />
              <span className="h-px bg-gold/60" />
            </div>

            <p
              className="mt-4 animate-reveal-up font-serif text-sm leading-loose [animation-fill-mode:backwards]"
              style={delay(T.title + 300)}
            >
              右の者、全四回の依頼をことごとく果たし、
              <br className="hidden sm:inline" />
              よろず屋を開店へと導いた。
              <br />
              その功績をたたえ、ここに講座の修了を証する。
            </p>

            {/* 回ごとの踏破印（1つずつ押される） */}
            <div className="mt-5 flex justify-center gap-3" aria-label="全4回踏破" role="img">
              {SESSION_KANJI.map((k, i) => (
                <span
                  key={k}
                  aria-hidden="true"
                  className={cn(
                    "inline-flex h-12 w-12 animate-stamp-in flex-col items-center justify-center rounded-sm [animation-fill-mode:backwards]",
                    "border-2 border-[#b3402a] bg-[#b3402a] font-serif font-bold leading-none text-white",
                    "outline outline-1 -outline-offset-4 outline-white/90",
                    ["-rotate-6", "rotate-3", "-rotate-2", "rotate-6"][i]
                  )}
                  style={delay(T.sessionStamps + i * STAMP_GAP)}
                >
                  <span className="text-lg">{k}</span>
                  <span className="mt-0.5 text-[0.55rem] tracking-widest">踏破</span>
                </span>
              ))}
            </div>

            <div className="mt-5 flex justify-center">
              <AchievementStamp
                className="[animation-fill-mode:backwards]"
                style={delay(T.bigStamp)}
              />
            </div>

            {/* 戦績 */}
            <dl className="mt-6 grid grid-cols-2 gap-2 text-left">
              <Stat label="踏破した回" delayMs={T.stats}>
                4 / 4
              </Stat>
              <Stat label="達成クエスト" delayMs={T.stats + 150}>
                {questCount} / {questCount}
              </Stat>
              <Stat label="総経験値" delayMs={T.stats + 300}>
                <span aria-hidden="true" className="tabular-nums">+{exp} EXP</span>
                <span className="sr-only">+{totalExp} EXP</span>
              </Stat>
              <Stat label="ギルドランク" delayMs={T.stats + 450}>
                <span className="flex gap-0.5" role="img" aria-label="星4つ（最高ランク）">
                  {[0, 1, 2, 3].map((i) => (
                    <Star
                      key={i}
                      size={16}
                      aria-hidden="true"
                      className="animate-star-pop fill-gold text-gold [animation-fill-mode:backwards]"
                      style={delay(T.stats + 550 + i * 120)}
                    />
                  ))}
                </span>
              </Stat>
            </dl>

            {/* 最終称号 */}
            <div
              className="relative mt-4 animate-reveal-up border-2 border-gold px-4 py-3 [animation-fill-mode:backwards]"
              style={delay(T.honor)}
            >
              <p className="font-serif text-xs font-bold tracking-[0.4em] text-gold">
                ✦ 最終称号 ✦
              </p>
              <p
                className="mt-1 animate-star-pop font-serif text-2xl font-bold text-[#b3402a] [animation-fill-mode:backwards] dark:text-destructive"
                style={delay(T.honor + 150)}
              >
                「{FINAL_HONOR}」
              </p>
            </div>

            <div
              className="mt-5 animate-reveal-up [animation-fill-mode:backwards]"
              style={delay(T.honor + 300)}
            >
              <p className="font-serif text-sm font-bold">すべてのクエストを達成した！</p>
              <p className="mt-1 text-sm text-muted-foreground">
                よろず屋は満を持して開店だ。冒険者の名声はここに極まれり。
              </p>
            </div>

            <div
              className="mt-6 flex animate-reveal-up flex-col items-center gap-2 [animation-fill-mode:backwards]"
              style={delay(T.actions)}
            >
              <ShareOnXButton
                text={[
                  "よろず屋API講座 全4回を完走した！",
                  `総獲得：+${totalExp} EXP／${questCount}クエスト達成`,
                  `最終称号「${FINAL_HONOR}」 ギルドランク ${rankStars(4)}`,
                ].join("\n")}
              />
              <button
                type="button"
                onClick={handleClose}
                className="rounded-sm px-3 py-1.5 text-xs text-muted-foreground underline-offset-4 transition hover:text-foreground hover:underline"
              >
                修了証をしまう
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 大判子の衝撃で飛び散る紙吹雪と、そのあと降りそそぐ紙吹雪 */}
      <ConfettiBurst delayMs={T.impact} count={44} spread={220} />
      <ConfettiShower delayMs={T.impact + 200} />
    </div>
  );
}

function Stat({
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
      className="animate-reveal-up border border-dotted border-gold/70 px-3 py-2 [animation-fill-mode:backwards]"
      style={delay(delayMs)}
    >
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="mt-0.5 font-bold">{children}</dd>
    </div>
  );
}
