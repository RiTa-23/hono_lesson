import { Clock } from "lucide-react";

type Props = {
  title: string;
  goal: string;
  minutes?: number;
  chapter?: string; // 例: "04"（依頼番号）
};

// 依頼書の四隅飾り
function Corner({ className }: { className: string }) {
  return (
    <span
      aria-hidden="true"
      className={`pointer-events-none absolute h-4 w-4 border-gold ${className}`}
    />
  );
}

// 各ステップページ冒頭の共通ヘッダー（冒険者ギルドの依頼書体裁）
export function PageHeader({ title, goal, minutes, chapter }: Props) {
  return (
    <header className="mb-8">
      <div className="relative border-2 border-primary bg-card p-1.5">
        <Corner className="-left-[3px] -top-[3px] border-l-2 border-t-2" />
        <Corner className="-right-[3px] -top-[3px] border-r-2 border-t-2" />
        <Corner className="-bottom-[3px] -left-[3px] border-b-2 border-l-2" />
        <Corner className="-bottom-[3px] -right-[3px] border-b-2 border-r-2" />
        <div className="border border-gold/50 px-5 py-6 sm:px-8">
          <p className="text-center font-serif text-xs tracking-[0.5em] text-gold">
            冒険者ギルド 公式依頼書
          </p>
          <h1 className="mt-3 text-center text-2xl font-bold tracking-tight sm:text-3xl">
            {chapter ? `依頼 No.${chapter}「${title}」` : title}
          </h1>
          {minutes !== undefined && (
            <p className="mt-2 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
              <Clock size={13} className="shrink-0" />
              所要時間の目安：約{minutes}分
            </p>
          )}
          <div className="mx-auto mt-3 flex w-24 justify-center gap-1" aria-hidden="true">
            <span className="h-0.5 w-16 bg-gold" />
            <span className="h-0.5 w-3 bg-gold/60" />
          </div>
          <div className="mt-4 border-y-[3px] border-double border-y-gold py-3">
            <p className="font-serif text-sm font-bold">【依頼内容】</p>
            <p className="mt-1 text-sm leading-relaxed">{goal}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
