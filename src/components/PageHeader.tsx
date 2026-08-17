import { Clock, Target } from "lucide-react";

type Props = {
  title: string;
  goal: string;
  minutes?: number;
};

// 各ステップページ冒頭の共通ヘッダー（タイトル＋ゴール＋所要時間）
export function PageHeader({ title, goal, minutes }: Props) {
  return (
    <header className="mb-8">
      <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{title}</h1>
      <div className="mt-3 flex gap-1" aria-hidden="true">
        <span className="h-1 w-10 rounded-full bg-amber-500" />
        <span className="h-1 w-3 rounded-full bg-amber-400/70" />
      </div>
      <div className="mt-4 rounded-lg border bg-card p-4">
        <p className="flex items-start gap-2 text-sm leading-relaxed">
          <Target size={16} className="mt-0.5 shrink-0 text-primary" />
          <span>
            <span className="font-medium">ゴール：</span>
            {goal}
          </span>
        </p>
        {minutes !== undefined && (
          <p className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
            <Clock size={16} className="shrink-0" />
            所要時間の目安：約{minutes}分
          </p>
        )}
      </div>
    </header>
  );
}
