import { PageHeader } from "@/components/PageHeader";
import { NextLink } from "@/components/NextLink";
import { ProgressCheck } from "@/components/ProgressCheck";
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
    term: "wrangler",
    body: "Cloudflare公式のコマンドラインツール。Workersの開発サーバー起動・D1の操作・デプロイをこれ1つで行う。bunテンプレートには同梱されていないのでbun add -D wranglerで追加し、コマンド本体の実行にはNode.js v22以上が必要。",
  },
  {
    term: "wrangler dev",
    body: "workerd（Cloudflareと同じランタイム）でbackendを起動する開発サーバー。c.env.DBが使えるのはこの状態のときだけ。既定ポートは8787なので、この講座では--port 3000を付けて起動する。",
  },
  {
    term: "workerd",
    body: "Cloudflare Workersのランタイム（実行環境）そのもの。wrangler devは手元でこれを動かしている。Bunで直接実行している間はこれが使われないため、D1のバインディングもアプリに渡されない。",
  },
  {
    term: "wrangler.jsonc",
    body: "wranglerの設定ファイル。Worker名（name）・入口のファイル（main）・compatibility_date・d1_databasesなどを書く。bunテンプレートには無いので自分で新規作成する。",
  },
  {
    term: "database_id",
    body: "Cloudflare上のD1データベースを一意に指すID。--localで動かしている間は参照されないため、第3回では仮の文字列でよい（第4回で本物のIDに差し替える）。",
  },
  {
    term: "migrations_dir",
    body: "wranglerがマイグレーションSQLを探す場所の設定（wrangler.jsoncのd1_databasesの中に書く）。既定は./migrationsなので、drizzle-kitのoutと同じdrizzle/migrationsに揃えておく。",
  },
  {
    term: "wrangler types / worker-configuration.d.ts",
    body: "bun wrangler typesで生成される型定義ファイル。D1DatabaseなどWorkersの型と、wrangler.jsoncのバインディングの型が入る。これがないとD1Databaseが「見つからない型」になる。",
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
  {
    term: "Miniflare",
    reading: "ミニフレア",
    body: "Workersの実行環境を手元で再現するシミュレーター。wrangler devが内部で使っているものと同じで、ライブラリとしても呼び出せる。テストの中でnew Miniflare({ d1Databases: { DB: ':memory:' } })とすれば、本物と同じD1の実装をテスト用に借りられる。",
  },
  {
    term: "testClient(app, env)",
    body: "hono/testingのtestClientは、第2引数でbindings（env）を渡せる。wrangler devがc.env.DBを渡してくれる役を、テストでは自分で引き受ける形になる。キー名はwrangler.jsoncのbindingと揃える必要がある。",
  },
  {
    term: ":memory:",
    body: "「ファイルではなくメモリ上にデータベースを作る」という指定。テストが終われば消えるので、毎回まっさらな状態から始められ、開発用の.wrangler/のデータも汚さない。",
  },
];

export function Glossary3() {
  return (
    <div>
      <Badge variant="secondary" className="mb-4">
        サブクエスト
      </Badge>
      <PageHeader
        title="用語集（第3回）"
        goal="第3回で出てきた用語を振り返って復習しよう"
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
      <ProgressCheck id="extra-glossary-3" label="第3回の用語集にひととおり目を通した" />
      <NextLink current="/extra/glossary-3" />
    </div>
  );
}
