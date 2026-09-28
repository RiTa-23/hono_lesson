import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { AchievementStamp } from "@/components/AchievementStamp";
import { isAllCleared } from "@/lib/clear";

// 表示時間（ミリ秒）。テストからも参照する。
export const OVERLAY_MS = 4000;
const FADE_MS = 300;

// 全メインフローのクエストが揃った瞬間に表示する達成演出。
// 「未達成 → 全達成」の遷移したときだけ発火し、自動でフェードアウトする。
// 初回マウント時点で既に全達成済みの場合は表示しない（Home側の常時表示に任せる）。
export function AllClearOverlay() {
  const [show, setShow] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const clearedRef = useRef(isAllCleared());

  useEffect(() => {
    const onUpdate = () => {
      const cleared = isAllCleared();
      if (cleared && !clearedRef.current) {
        setShow(true);
        setLeaving(false);
      } else if (!cleared) {
        // 表示中に未達成へ戻されたら即非表示（達成状態が崩れたため）
        setShow(false);
        setLeaving(false);
      }
      clearedRef.current = cleared;
    };
    const onClear = () => {
      clearedRef.current = false;
      setShow(false);
      setLeaving(false);
    };
    window.addEventListener("progress-updated", onUpdate);
    window.addEventListener("progress-cleared", onClear);
    return () => {
      window.removeEventListener("progress-updated", onUpdate);
      window.removeEventListener("progress-cleared", onClear);
    };
  }, []);

  useEffect(() => {
    if (!show) return;
    const t1 = window.setTimeout(() => setLeaving(true), OVERLAY_MS - FADE_MS);
    const t2 = window.setTimeout(() => setShow(false), OVERLAY_MS);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [show]);

  // 手動で閉じる（自動フェードと同じ動きで即座に消す）
  function handleClose() {
    setLeaving(true);
    window.setTimeout(() => setShow(false), FADE_MS);
  }

  if (!show) return null;

  return (
    <div
      role="status"
      className="pointer-events-none fixed inset-0 z-[60] flex items-center justify-center p-4"
    >
      <div className="absolute inset-0 bg-black/40" aria-hidden="true" />
      <div
        className={[
          "pointer-events-auto relative transition-opacity duration-300",
          leaving ? "opacity-0" : "opacity-100",
        ].join(" ")}
      >
        <div className="relative border-2 border-primary bg-card p-1.5">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -left-[3px] -top-[3px] h-4 w-4 border-l-2 border-t-2 border-gold"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -right-[3px] -top-[3px] h-4 w-4 border-r-2 border-t-2 border-gold"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-[3px] -left-[3px] h-4 w-4 border-b-2 border-l-2 border-gold"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-[3px] -right-[3px] h-4 w-4 border-b-2 border-r-2 border-gold"
          />
          <button
            type="button"
            onClick={handleClose}
            aria-label="閉じる"
            className="absolute right-2 top-2 rounded-sm p-1 text-muted-foreground transition hover:bg-secondary/60 hover:text-foreground"
          >
            <X size={18} />
          </button>
          <div className="border border-gold/50 px-8 py-8 text-center sm:px-12">
            <p className="font-serif text-xs tracking-[0.5em] text-gold">
              冒険者ギルド 公式テキスト
            </p>
            <div className="mt-5 flex justify-center">
              <AchievementStamp />
            </div>
            <div className="mx-auto mt-5 flex w-24 justify-center gap-1" aria-hidden="true">
              <span className="h-0.5 w-16 bg-gold" />
              <span className="h-0.5 w-3 bg-gold/60" />
            </div>
            <p className="mt-4 font-serif text-sm font-bold">
              すべてのクエストを達成した！
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              よろず屋は満を持して開店だ。冒険者の名声はここに極まれり。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}