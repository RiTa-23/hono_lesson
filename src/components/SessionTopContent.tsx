import { useEffect, useState, type ReactNode } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { ClearedBadge } from "@/components/ClearedBadge";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import type { PageDef } from "@/lib/routes";
import { getAllProgress } from "@/lib/storage";

type Props = {
  sessionNumber: 1 | 2 | 3 | 4;
  icon: ReactNode;
  title: string;
  description: string;
  pages: PageDef[];
};

// 各回のトップページ（表紙・進捗・タイムテーブル）の共通レイアウト。
// session{N}/Session{N}Top.tsx はこのコンポーネントにデータを渡すだけの薄いラッパー
export function SessionTopContent({ sessionNumber, icon, title, description, pages }: Props) {
  const [progress, setProgress] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setProgress(getAllProgress());
    const refresh = () => setProgress(getAllProgress());
    window.addEventListener("progress-updated", refresh);
    window.addEventListener("progress-cleared", refresh);
    return () => {
      window.removeEventListener("progress-updated", refresh);
      window.removeEventListener("progress-cleared", refresh);
    };
  }, []);

  const withId = pages.filter((p) => p.progressId);
  const done = withId.filter((p) => progress[p.progressId!]).length;
  const total = withId.length;
  const percent = total === 0 ? 0 : Math.round((done / total) * 100);
  const cleared = total > 0 && done === total;

  // 未達成の最初のページ（続きから）。全達成なら最初のページに戻す
  const nextPage = pages.find((p) => p.progressId && !progress[p.progressId]) ?? pages[0];
  const ctaLabel = cleared ? "最初から見直す" : done > 0 ? "続きから進める" : "クエストを開始する";

  return (
    <div>
      {/* 表紙 */}
      <section className="relative border-2 border-primary bg-card p-2">
        <span aria-hidden="true" className="pointer-events-none absolute -left-1 -top-1 h-4 w-4 border-l-2 border-t-2 border-gold" />
        <span aria-hidden="true" className="pointer-events-none absolute -right-1 -top-1 h-4 w-4 border-r-2 border-t-2 border-gold" />
        <span aria-hidden="true" className="pointer-events-none absolute -bottom-1 -left-1 h-4 w-4 border-b-2 border-l-2 border-gold" />
        <span aria-hidden="true" className="pointer-events-none absolute -bottom-1 -right-1 h-4 w-4 border-b-2 border-r-2 border-gold" />
        <div className="border border-gold/50 px-5 py-8 text-center sm:px-8">
          <p className="font-serif text-xs tracking-[0.5em] text-gold">冒険者ギルド 公式テキスト</p>
          <Badge variant="secondary" className="mb-3 mt-5">
            第{sessionNumber}回
          </Badge>
          <h1 className="flex items-center justify-center gap-2 text-3xl font-bold tracking-tight sm:text-4xl">
            {icon}
            {title}
          </h1>
          <div className="mx-auto mt-3 flex w-24 justify-center gap-1" aria-hidden="true">
            <span className="h-0.5 w-16 bg-gold" />
            <span className="h-0.5 w-3 bg-gold/60" />
          </div>
          <p className="mx-auto mt-4 max-w-2xl text-left leading-relaxed text-muted-foreground">
            {description}
          </p>
        </div>
      </section>

      {/* この回の進捗 */}
      <section className="mt-8 rounded-md border-2 border-primary bg-card p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-bold">第{sessionNumber}回の進捗</h2>
          <span className="flex items-center gap-2 text-sm font-bold text-muted-foreground">
            {done}/{total} ステップ完了（{percent}%）
            {cleared && <ClearedBadge />}
          </span>
        </div>
        <Progress
          value={percent}
          className="mt-3 h-2.5 rounded-none border border-primary bg-card [&>div]:bg-gold"
        />
      </section>

      {/* タイムテーブル */}
      <h2 className="mt-10 text-xl font-bold">第{sessionNumber}回のタイムテーブル（目安）</h2>
      <div className="mt-4 overflow-hidden rounded-sm border border-primary">
        <table className="w-full text-sm">
          <thead className="border-b border-gold bg-secondary/60 font-serif">
            <tr>
              <th className="px-4 py-2 text-left font-bold">時間</th>
              <th className="px-4 py-2 text-left font-bold">内容</th>
            </tr>
          </thead>
          <tbody>
            {pages.map((p, i) => (
              <tr key={p.path} className="border-t border-border">
                <td className="whitespace-nowrap px-4 py-2 text-muted-foreground">
                  約{p.minutes ?? "-"}分
                </td>
                <td className="px-4 py-2">
                  <a href={`#${p.path}`} className="font-medium text-primary underline-offset-4 hover:underline">
                    {String(i + 1).padStart(2, "0")}. {p.title}
                  </a>
                  {p.progressId && progress[p.progressId] && (
                    <CheckCircle2
                      size={14}
                      className="ml-2 inline-block text-gold"
                      aria-label="完了"
                    />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {nextPage && (
        <div className="mt-10 flex justify-center">
          <a
            href={`#${nextPage.path}`}
            className="inline-flex items-center gap-2 rounded-sm border border-primary bg-primary px-6 py-3 font-serif font-bold text-primary-foreground transition hover:opacity-90"
          >
            {ctaLabel}
            <ArrowRight size={18} />
          </a>
        </div>
      )}
    </div>
  );
}
