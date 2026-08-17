import { ArrowLeft, ArrowRight } from "lucide-react";
import { getNextPage, getPrevPage } from "@/lib/routes";

type Props = {
  current: string;
};

// メインフローのページ下部に配置する「前へ / 次へ」ナビゲーション
export function NextLink({ current }: Props) {
  const prev = getPrevPage(current);
  const next = getNextPage(current);

  if (!prev && !next) return null;

  return (
    <nav
      aria-label="ページナビゲーション"
      className="mt-10 flex items-stretch justify-between gap-3 border-t pt-6"
    >
      {prev ? (
        <a
          href={`#${prev.path}`}
          className="flex max-w-[48%] items-center gap-2 rounded-md border px-4 py-3 text-sm transition hover:bg-secondary/60"
        >
          <ArrowLeft size={16} className="shrink-0" />
          <span>
            <span className="block text-xs text-muted-foreground">前のステップ</span>
            {prev.title}
          </span>
        </a>
      ) : (
        <span />
      )}
      {next ? (
        <a
          href={`#${next.path}`}
          className="flex max-w-[48%] items-center gap-2 rounded-md border bg-primary/5 px-4 py-3 text-right text-sm font-medium text-primary transition hover:bg-primary/10"
        >
          <span className="flex-1">
            <span className="block text-xs font-normal text-muted-foreground">
              次のステップ
            </span>
            {next.title}
          </span>
          <ArrowRight size={16} className="shrink-0" />
        </a>
      ) : (
        <a
          href="#/"
          className="flex items-center gap-2 rounded-md border bg-primary/5 px-4 py-3 text-sm font-medium text-primary transition hover:bg-primary/10"
        >
          ホームへ戻る
        </a>
      )}
    </nav>
  );
}
