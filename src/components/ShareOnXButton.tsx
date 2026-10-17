import { buildShareUrl } from "@/lib/share";

// 本文を載せたX（旧Twitter）の投稿画面を新しいタブで開くボタン
export function ShareOnXButton({ text }: { text: string }) {
  return (
    <a
      href={buildShareUrl(text)}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 rounded-sm border border-primary bg-card px-4 py-2 font-serif text-sm font-bold text-foreground transition hover:bg-secondary/60"
    >
      <XLogo />
      でポストする
      <span className="sr-only">（新しいタブで開く）</span>
    </a>
  );
}

// Xのロゴ（lucide-reactにはブランドアイコンがないため直書き）
function XLogo() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" role="img" aria-label="X">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}
