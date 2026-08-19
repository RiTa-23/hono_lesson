import { useEffect, useState } from "react";
import { CheckCircle2, MapPin } from "lucide-react";
import { ClearedBadge } from "@/components/ClearedBadge";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { EXTRA_PAGES, isPagePublished } from "@/lib/routes";
import { getAllProgress } from "@/lib/storage";

// サブクエストページごとの一言説明。routes.tsのPageDefに項目を増やすほどでは
// ないため、pathをキーにこのページだけで持つ
const BLURBS: Record<string, string> = {
  "/extra/rpc": "HonoのRPC機能で、フロントエンドとバックエンドを型でつなぐ体験をします。",
  "/extra/glossary": "第1回で出てきた用語をいつでも引けるようにまとめました。",
  "/extra/glossary-2": "zod・OpenAPI・テストまわりの用語をまとめました。",
  "/extra/glossary-3": "D1・Drizzle ORMまわりの用語をまとめました。",
  "/extra/glossary-4": "本番デプロイまわりの用語をまとめました。",
};

export function ExtraTop() {
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

  const pages = EXTRA_PAGES.filter(isPagePublished);
  const withId = pages.filter((p) => p.progressId);
  const done = withId.filter((p) => progress[p.progressId!]).length;
  const total = withId.length;
  const percent = total === 0 ? 0 : Math.round((done / total) * 100);
  const cleared = total > 0 && done === total;

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
            サブクエスト
          </Badge>
          <h1 className="flex items-center justify-center gap-2 text-3xl font-bold tracking-tight sm:text-4xl">
            <MapPin size={28} className="text-primary" />
            サブクエスト
          </h1>
          <div className="mx-auto mt-3 flex w-24 justify-center gap-1" aria-hidden="true">
            <span className="h-0.5 w-16 bg-gold" />
            <span className="h-0.5 w-3 bg-gold/60" />
          </div>
          <p className="mx-auto mt-4 max-w-2xl text-left leading-relaxed text-muted-foreground">
            本編の進行には含まれない、寄り道コンテンツです。余力があるときに、気になるものから覗いてみてください。
          </p>
        </div>
      </section>

      {/* サブクエストの進捗 */}
      <section className="mt-8 rounded-md border-2 border-primary bg-card p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-bold">サブクエストの進捗</h2>
          <span className="flex items-center gap-2 text-sm font-bold text-muted-foreground">
            {done}/{total} 達成（{percent}%）
            {cleared && <ClearedBadge />}
          </span>
        </div>
        <Progress
          value={percent}
          className="mt-3 h-2.5 rounded-none border border-primary bg-card [&>div]:bg-gold"
        />
      </section>

      {/* サブクエスト一覧 */}
      <h2 className="mt-10 text-xl font-bold">サブクエスト一覧</h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {pages.map((p) => {
          const isDone = !!(p.progressId && progress[p.progressId]);
          return (
            <a
              key={p.path}
              href={`#${p.path}`}
              className="flex items-start gap-3 rounded-lg border p-4 transition hover:bg-secondary/60"
            >
              <MapPin size={18} className="mt-0.5 shrink-0 text-primary" />
              <span className="flex-1">
                <span className="flex items-center gap-2">
                  <span className="block font-medium">{p.title}</span>
                  {isDone && (
                    <CheckCircle2 size={14} className="shrink-0 text-gold" aria-label="達成済み" />
                  )}
                </span>
                <span className="mt-1 block text-sm text-muted-foreground">
                  {BLURBS[p.path] ?? ""}
                </span>
              </span>
            </a>
          );
        })}
      </div>
    </div>
  );
}
