import { PageHeader } from "@/components/PageHeader";
import { Callout } from "@/components/Callout";
import { Quiz } from "@/components/Quiz";
import { ProgressCheck } from "@/components/ProgressCheck";
import { NextLink } from "@/components/NextLink";
import { CopyBlock } from "@/components/CopyBlock";

export function D1Setup() {
  return (
    <div>
      <PageHeader
        title="D1データベースを作る"
        chapter="02"
        goal="wranglerコマンドでD1データベースを作成し、backendから使える状態になっている"
        minutes={15}
      />

      <h2 className="text-xl font-bold">1. D1データベースを作成する</h2>
      <p className="mt-3 leading-relaxed">
        backendディレクトリで、次のコマンドを実行します。
      </p>
      <CopyBlock lang="bash" title="ターミナル" code={`bun wrangler d1 create yorozuya-db`} />
      <p className="mt-3 leading-relaxed">
        実行すると、次のような案内と<code className="rounded bg-muted px-1.5 py-0.5 text-xs">database_id</code>
        が表示されます。この<code className="rounded bg-muted px-1.5 py-0.5 text-xs">database_id</code>
        は次の手順で使うので、コピーしておいてください。
      </p>
      <CopyBlock
        lang="text"
        title="出力例"
        code={`✅ Successfully created DB 'yorozuya-db'

[[d1_databases]]
binding = "DB"
database_name = "yorozuya-db"
database_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"`}
      />

      <h2 className="mt-10 text-xl font-bold">2. wrangler.jsoncに設定を追記する</h2>
      <p className="mt-3 leading-relaxed">
        <code className="rounded bg-muted px-1.5 py-0.5 text-xs">backend/wrangler.jsonc</code>
        を開いて、表示された情報を追記します。
      </p>
      <CopyBlock
        lang="jsonc"
        title="backend/wrangler.jsonc（追記）"
        code={`{
  "name": "backend",
  // ...既存の設定...
  "d1_databases": [
    {
      "binding": "DB",
      "database_name": "yorozuya-db",
      "database_id": "さっき表示されたIDに置き換える"
    }
  ]
}`}
      />

      <h2 className="mt-10 text-xl font-bold">3. Honoのコードから型を参照できるようにする</h2>
      <p className="mt-3 leading-relaxed">
        Honoアプリに、環境変数（bindings）の型を教えてあげます。これで
        <code className="rounded bg-muted px-1.5 py-0.5 text-xs">c.env.DB</code>
        が型付きで使えるようになります。型は複数のファイルから使うので、専用のファイルに置きます。
      </p>
      <CopyBlock
        lang="ts"
        title="backend/src/types.ts（新規作成）"
        code={`// wrangler.jsonc で設定した bindings を、TypeScriptに教えるための型
export type Bindings = {
  DB: D1Database
}`}
      />
      <p className="mt-3 leading-relaxed">
        次に、<code className="rounded bg-muted px-1.5 py-0.5 text-xs">c.env.DB</code>
        を使うことになる<code className="rounded bg-muted px-1.5 py-0.5 text-xs">routes/</code>
        の2ファイルで、この型を<code className="rounded bg-muted px-1.5 py-0.5 text-xs">OpenAPIHono</code>
        に渡します。<code className="rounded bg-muted px-1.5 py-0.5 text-xs">routes/items.ts</code>
        と<code className="rounded bg-muted px-1.5 py-0.5 text-xs">routes/trade.ts</code>
        の両方で、importの追加と<code className="rounded bg-muted px-1.5 py-0.5 text-xs">new OpenAPIHono()</code>
        の行を書き換えます。
      </p>
      <CopyBlock
        lang="ts"
        title="backend/src/routes/items.ts（importに追加＋1行書き換え）"
        code={`import type { Bindings } from '../types' // 追加

// new OpenAPIHono() を、次のように書き換える
export const itemsApp = new OpenAPIHono<{ Bindings: Bindings }>()`}
      />
      <CopyBlock
        lang="ts"
        title="backend/src/routes/trade.ts（importに追加＋1行書き換え）"
        code={`import type { Bindings } from '../types' // 追加

// new OpenAPIHono() を、次のように書き換える
export const tradeApp = new OpenAPIHono<{ Bindings: Bindings }>()`}
      />
      <Callout variant="info" title="index.ts はそのままでOK">
        <p>
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">index.ts</code>
          の<code className="rounded bg-muted px-1.5 py-0.5 text-xs">app</code>
          は<code className="rounded bg-muted px-1.5 py-0.5 text-xs">c.env</code>
          を直接使わない（取り付けと設定だけ）ので、型を渡す必要はありません。
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">app.route()</code>
          で取り付けるサブアプリの型が違っていても問題なく動きます。
        </p>
      </Callout>
      <Callout variant="info" title="D1Databaseの型はどこから来る？">
        <p>
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">D1Database</code>
          は、Cloudflare Workersの型定義パッケージ（<code className="rounded bg-muted px-1.5 py-0.5 text-xs">@cloudflare/workers-types</code>
          ）に含まれるグローバルな型です。<code className="rounded bg-muted px-1.5 py-0.5 text-xs">bun create hono@latest</code>
          でCloudflare Workers向けテンプレートを選んでいれば、すでにインストール・設定済みのはずです。
        </p>
      </Callout>

      <h2 className="mt-10 text-xl font-bold">理解度チェック</h2>
      <Quiz
        question="wrangler.jsoncのd1_databasesに設定するdatabase_idは何のため？"
        choices={[
          "作成したD1データベースを一意に特定し、backendから接続できるようにするため",
          "データベースのパスワードとして使うため",
          "フロントエンドのAPI通信先URLを決めるため",
        ]}
        answerIndex={0}
        explanation="database_idは、wrangler d1 createで作成したD1データベースの識別子です。wrangler.jsoncに登録することで、backendのコードからc.env.DB経由でそのデータベースにアクセスできるようになります。"
      />

      <h2 className="mt-10 text-xl font-bold">よくあるつまずき</h2>
      <ul className="mt-3 list-disc space-y-2 pl-6 text-sm leading-relaxed">
        <li>
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">database_id</code>
          をコピーし忘れて、プレースホルダーのまま残ってしまう → もう一度
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">bun wrangler d1 list</code>
          を実行すれば、作成済みのデータベース一覧とIDを確認できます。
        </li>
        <li>
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">wrangler.jsonc</code>
          を編集しても反映されない → bindingsの設定変更は開発サーバーの再起動が必要な場合があります。
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">bun run dev</code>
          をCtrl+Cで止めて、もう一度起動してみましょう。
        </li>
      </ul>

      <ProgressCheck id="s3-02-d1-setup" label="D1データベースを作成し、wrangler.jsoncに設定できた" />
      <NextLink current="/session3/02-d1-setup" />
    </div>
  );
}
