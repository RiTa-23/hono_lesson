import { PageHeader } from "@/components/PageHeader";
import { NextLink } from "@/components/NextLink";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const TERMS: { term: string; reading?: string; body: string }[] = [
  {
    term: "--remote",
    body: "wranglerのd1コマンドに付けるフラグ。Cloudflare上の本物（本番）のD1データベースに対して操作を行う。--localと取り違えないよう注意。",
  },
  {
    term: "wrangler login",
    body: "ローカルのwranglerコマンドが、自分のCloudflareアカウントを操作できるように認証する手順。ブラウザでログインして許可する。",
  },
  {
    term: "wrangler deploy",
    body: "backendのコードをCloudflare Workersにアップロードし、インターネット上に公開するコマンド。bun run deployのscript経由で実行することが多い。",
  },
  {
    term: "Cloudflare Workers",
    body: "Cloudflareのネットワーク上でサーバーサイドのプログラム（今回のbackend）を実行するサービス。教材サイトなどの静的なフロントエンドを配信するCloudflare Pagesとは役割が異なる。",
  },
  {
    term: "workers.dev",
    body: "Cloudflare Workersにデプロイすると発行される、標準のドメイン。https://backend.あなたのサブドメイン.workers.dev のような形になる。",
  },
  {
    term: "compatibility_date",
    body: "wrangler.jsoncに設定する、Workersのランタイム挙動の基準日。古いままだと警告が出ることがあるため、定期的に最新化する。",
  },
  {
    term: "wrangler tail",
    body: "デプロイ済みのWorkerに届いたリクエストのログを、リアルタイムで確認できるコマンド。本番のトラブルシューティングに使う。",
  },
  {
    term: "本番のCORS設定",
    body: "cors()のoriginを本番フロントエンドのURLに絞る設定。開発中はすべて許可していたが、本番では許可するオリジンを限定するのが望ましい。",
  },
];

export function Glossary4() {
  return (
    <div>
      <Badge variant="secondary" className="mb-4">
        おまけ
      </Badge>
      <PageHeader
        title="用語集（第4回）"
        goal="第4回で出てきた用語をいつでも引けるようにする"
      />
      <Accordion type="multiple" className="w-full">
        {TERMS.map((t) => (
          <AccordionItem key={t.term} value={t.term}>
            <AccordionTrigger>
              <span>
                {t.term}
                {t.reading && (
                  <span className="ml-2 text-xs font-normal text-muted-foreground">
                    （{t.reading}）
                  </span>
                )}
              </span>
            </AccordionTrigger>
            <AccordionContent className="leading-relaxed">{t.body}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      <NextLink current="/extra/glossary-4" />
    </div>
  );
}
