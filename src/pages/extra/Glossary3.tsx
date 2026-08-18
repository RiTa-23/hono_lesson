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
    term: "D1",
    body: "Cloudflare Workers上で使えるSQLite互換のデータベース。Cloudflareのネットワーク上で動くため低いレイテンシでアクセスでき、サーバーを再起動してもデータが消えない。",
  },
  {
    term: "Drizzle ORM",
    body: "TypeScriptのコードでデータベースのテーブル定義・読み書きができるORM（オブジェクト・リレーショナル・マッパー）。SQLを直接書かなくても型の恩恵を受けながらDB操作できる。",
  },
  {
    term: "sqliteTable",
    body: "drizzle-orm/sqlite-coreが提供する、テーブルのスキーマ（列名・型）を定義するための関数。integer・textなどの列型と組み合わせて使う。",
  },
  {
    term: "drizzle-kit",
    body: "schema.tsの定義から、実際にテーブルを作るためのマイグレーションSQLを生成する開発ツール。drizzle-kit generateで使う。",
  },
  {
    term: "マイグレーション",
    body: "データベースの構造（テーブルなど）を作成・変更する作業、またはそのためのSQLファイル。drizzle-kitで生成し、wrangler d1 migrations applyで反映する。",
  },
  {
    term: "wrangler d1 create",
    body: "Cloudflare上にD1データベースを新規作成するコマンド。実行するとdatabase_idが発行され、wrangler.jsoncに登録して使う。",
  },
  {
    term: "d1_databases（wrangler.jsoncの設定）",
    body: "backendのコードからD1に接続するための紐づけ情報（binding名・database_name・database_id）。これを書くとc.env.DBが使えるようになる。",
  },
  {
    term: "Bindings",
    body: "Cloudflare Workersが環境から受け取る値・接続先の総称。D1やKV、環境変数などが含まれる。Honoでは new Hono<{ Bindings: ... }>() のように型を教える。",
  },
  {
    term: "drizzle(c.env.DB)",
    body: "D1のbinding（c.env.DB）を、Drizzle ORMが扱える形に変換する関数。リクエストのたびにハンドラの中で呼び出す。",
  },
  {
    term: "select / where / eq",
    body: "Drizzleでデータを取得するときの基本パーツ。db.select().from(テーブル).where(eq(列, 値)) のように組み合わせて、SQLのSELECT文を表現する。",
  },
  {
    term: "--local",
    body: "wranglerのd1コマンドに付けるフラグ。手元のマシン上のシミュレーション用D1に対して操作を行う（Cloudflare上の本番D1には影響しない）。",
  },
  {
    term: "中間テーブル",
    body: "多対多の関係（例：プレイヤーとアイテム）を表現するためのテーブル。player_itemsのように、両方のIDと付随する情報（数量など）を1行にまとめて持つ。",
  },
];

export function Glossary3() {
  return (
    <div>
      <Badge variant="secondary" className="mb-4">
        おまけ
      </Badge>
      <PageHeader
        title="用語集（第3回）"
        goal="第3回で出てきた用語をいつでも引けるようにする"
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
      <NextLink current="/extra/glossary-3" />
    </div>
  );
}
