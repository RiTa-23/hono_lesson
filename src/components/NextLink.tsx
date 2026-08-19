import { useEffect } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { getNextPage, getPrevPage } from "@/lib/routes";
import { preloadPage } from "@/lib/pageResolver";

type Props = {
  current: string;
};

// メインフローのページ下部に配置する「前へ / 次へ」ナビゲーション（依頼書風）
export function NextLink({ current }: Props) {
  const prev = getPrevPage(current);
  const next = getNextPage(current);

  // 次のページを先読みしておく。セッションをまたぐ移動でも
  // 遷移時に「依頼書を開いています…」が表示されないようにする
  useEffect(() => {
    if (next?.file) preloadPage(next.file);
  }, [next?.file]);

  if (!prev && !next) return null;

  return (
    <nav
      aria-label="ページナビゲーション"
      className="mt-10 flex items-stretch justify-between gap-3 border-t border-double border-t-4 border-primary pt-6"
    >
      {prev ? (
        <a
          href={`#${prev.path}`}
          className="flex max-w-[48%] items-center gap-2 rounded-sm border border-primary bg-card px-4 py-3 text-sm transition hover:bg-secondary/60"
        >
          <ArrowLeft size={16} className="shrink-0" />
          <span>
            <span className="block font-serif text-xs font-bold tracking-widest text-muted-foreground">
              前の依頼
            </span>
            {prev.title}
          </span>
        </a>
      ) : (
        <span />
      )}
      {next ? (
        <a
          href={`#${next.path}`}
          className="flex max-w-[48%] items-center gap-2 rounded-sm border border-primary bg-primary px-4 py-3 text-right text-sm font-bold text-primary-foreground transition hover:opacity-90"
        >
          <span className="flex-1">
            <span className="block font-serif text-xs font-normal tracking-widest opacity-80">
              次の依頼
            </span>
            {next.title}
          </span>
          <ArrowRight size={16} className="shrink-0" />
        </a>
      ) : (
        <a
          href="#/"
          className="flex items-center gap-2 rounded-sm border border-primary bg-primary px-4 py-3 text-sm font-bold text-primary-foreground transition hover:opacity-90"
        >
          ホームへ戻る
        </a>
      )}
    </nav>
  );
}
