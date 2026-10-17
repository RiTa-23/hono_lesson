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
        title="ローカルD1をbackendにつなぐ"
        chapter="03"
        goal="wrangler.jsoncにD1の設定を書き、c.env.DBを型付きで使える状態になっている"
        minutes={15}
      />

      <Callout variant="info" title="第3回では、Cloudflareのアカウントは必要ありません">
        <p>
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">--local</code>
          を付けて使うD1は、手元のマシンの中に作られるSQLiteのファイルです
          （<code className="rounded bg-muted px-1.5 py-0.5 text-xs">backend/.wrangler/</code>
          の下に自動で作られます）。そのため、この回では
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">wrangler login</code>
          や<code className="rounded bg-muted px-1.5 py-0.5 text-xs">wrangler d1 create</code>
          は実行しません。Cloudflare上に本物のD1を作るのは第4回です。
        </p>
      </Callout>

      <h2 className="mt-8 text-xl font-bold">1. wrangler.jsoncにD1の設定を追記する</h2>
      <p className="mt-3 leading-relaxed">
        前のページで作った<code className="rounded bg-muted px-1.5 py-0.5 text-xs">backend/wrangler.jsonc</code>
        に、<code className="rounded bg-muted px-1.5 py-0.5 text-xs">d1_databases</code>
        の設定を足します。ファイル全体が次のようになるように書いてください。
      </p>
      <CopyBlock
        lang="jsonc"
        title="backend/wrangler.jsonc（d1_databasesを追記）"
        code={`{
  "$schema": "node_modules/wrangler/config-schema.json",
  "name": "backend",
  "main": "src/index.ts",
  "compatibility_date": "2026-10-01",
  "d1_databases": [
    {
      "binding": "DB",
      "database_name": "yorozuya-db",
      "database_id": "local-yorozuya-db",
      "migrations_dir": "drizzle/migrations"
    }
  ]
}`}
      />
      <ul className="mt-3 list-disc space-y-2 pl-6 text-sm leading-relaxed">
        <li>
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">binding</code>
          … コードから見える名前。<code className="rounded bg-muted px-1.5 py-0.5 text-xs">"DB"</code>
          にすると<code className="rounded bg-muted px-1.5 py-0.5 text-xs">c.env.DB</code>
          で受け取れます。
        </li>
        <li>
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">database_name</code>
          … データベースの名前。この後のコマンドで
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">yorozuya-db</code>
          と指定するときの名前です。
        </li>
        <li>
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">database_id</code>
          … Cloudflare上のデータベースを一意に指すID。
          <span className="font-medium">
            <code className="rounded bg-muted px-1.5 py-0.5 text-xs">--local</code>
            で動かしている間は参照されないので、今は仮の文字列でかまいません
          </span>
          （第4回で、本物のIDに差し替えます）。
        </li>
        <li>
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">migrations_dir</code>
          … マイグレーションSQLの置き場所。wranglerは既定で
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">./migrations</code>
          を見にいきますが、次のページで導入するdrizzle-kitは
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">./drizzle/migrations</code>
          に出力します。両者の場所を合わせるための設定です。
        </li>
      </ul>
      <Callout variant="warn" title="migrations_dirを書き忘れると、後で必ずつまずく">
        <p>
          この1行がないと、このあとの依頼No.05（マイグレーション）で
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">No migrations present at ...\backend\migrations</code>
          と言われて止まります。SQLは生成できているのに「ない」と言われるのは、
          wranglerが別の場所を探しているからです。
        </p>
      </Callout>

      <h2 className="mt-10 text-xl font-bold">2. Workersの型を生成する</h2>
      <p className="mt-3 leading-relaxed">
        D1を扱う型（<code className="rounded bg-muted px-1.5 py-0.5 text-xs">D1Database</code>
        など）は、wranglerに生成してもらいます。
      </p>
      <CopyBlock lang="bash" title="ターミナル（backendディレクトリで）" code={`bun wrangler types`} />
      <p className="mt-3 leading-relaxed">
        <code className="rounded bg-muted px-1.5 py-0.5 text-xs">backend/worker-configuration.d.ts</code>
        というファイルが生成されます。中にはCloudflare Workersの型定義（
        <code className="rounded bg-muted px-1.5 py-0.5 text-xs">D1Database</code>
        もここにあります）と、<code className="rounded bg-muted px-1.5 py-0.5 text-xs">wrangler.jsonc</code>
        の設定から作られたバインディングの型が入っています。自動生成されるファイルなので、
        自分で編集する必要はありません。
      </p>
      <p className="mt-3 leading-relaxed">
        ただし、このままだとエディタのProblemsパネルに
        <code className="rounded bg-muted px-1.5 py-0.5 text-xs">worker-configuration.d.ts</code>
        の赤いエラーが数十件並びます。第1回に作った
        <code className="rounded bg-muted px-1.5 py-0.5 text-xs">tsconfig.json</code>
        にはブラウザ用の型（DOM）やBunの型が入っていて、生成されたWorkersの型と同じ名前がぶつかるためです。
        <code className="rounded bg-muted px-1.5 py-0.5 text-xs">backend/tsconfig.json</code>
        に2行足して、ぶつからないようにします。
      </p>
      <CopyBlock
        lang="json"
        title="backend/tsconfig.json（lib と skipLibCheck を追記）"
        code={`{
  "compilerOptions": {
    "strict": true,
    "lib": ["ESNext"],
    "skipLibCheck": true,
    "types": ["bun"],
    "jsx": "react-jsx",
    "jsxImportSource": "hono/jsx"
  }
}`}
      />
      <ul className="mt-3 list-disc space-y-2 pl-6 text-sm leading-relaxed">
        <li>
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">"lib": ["ESNext"]</code>
          … ブラウザ用の型（DOM）を読み込まないようにします。
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">lib</code>
          を書かないと、TypeScriptはDOMの型を自動で読み込みます。Workersにはブラウザの画面（DOM）がないので、外しておくのが正確です。
        </li>
        <li>
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">"skipLibCheck": true</code>
          … ライブラリの型定義ファイル（<code className="rounded bg-muted px-1.5 py-0.5 text-xs">.d.ts</code>
          ）同士の食い違いはチェックしないようにします。テストで使うBunの型とWorkersの型の重複は残るため、これも必要です。
          自分で書いた<code className="rounded bg-muted px-1.5 py-0.5 text-xs">src/</code>
          のコードは、これまでどおりチェックされます。
        </li>
        <li>
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">"types": ["bun"]</code>
          … そのまま残します。消すと、テストの
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">import ... from 'bun:test'</code>
          が型エラーになります。
        </li>
      </ul>
      <p className="mt-3 leading-relaxed">
        保存すると、エディタが設定を読み込み直してProblemsパネルのエラーが消えます。
        しばらく待っても残っている場合は、VS Codeのコマンドパレットで
        <code className="rounded bg-muted px-1.5 py-0.5 text-xs">TypeScript: Restart TS Server</code>
        を実行してください。
      </p>
      <Callout variant="warn" title="@cloudflare/workers-types は入れない">
        <p>
          ネットで調べると「<code className="rounded bg-muted px-1.5 py-0.5 text-xs">types</code>
          に<code className="rounded bg-muted px-1.5 py-0.5 text-xs">@cloudflare/workers-types</code>
          を指定する」という解決策が見つかりますが、これは
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">wrangler types</code>
          が今の形になる前の方法です。
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">worker-configuration.d.ts</code>
          がその代わりになるので、両方を入れるとまた型がぶつかります。
        </p>
      </Callout>
      <Callout variant="tip" title="wrangler.jsoncを変えたら、もう一度実行する">
        <p>
          バインディングを追加・変更したときは、
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">bun wrangler types</code>
          を実行し直すと型も追いついてきます。
        </p>
      </Callout>

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

      <h2 className="mt-10 text-xl font-bold">理解度チェック</h2>
      <Quiz
        question={`wrangler.jsoncのd1_databasesで binding に "DB" と書くと、どうなる？`}
        choices={[
          "Honoのコードから c.env.DB としてD1データベースを受け取れるようになる",
          "D1データベースの名前が「DB」に変更される",
          "データベースのパスワードが「DB」に設定される",
        ]}
        answerIndex={0}
        explanation="bindingは「コードから見えるときの名前」です。binding に DB と書いたので c.env.DB、たとえば CACHE と書けば c.env.CACHE として受け取れます。database_nameはコマンドで指定するデータベース自身の名前で、別のものです。"
      />

      <h2 className="mt-10 text-xl font-bold">よくあるつまずき</h2>
      <ul className="mt-3 list-disc space-y-2 pl-6 text-sm leading-relaxed">
        <li>
          エディタで<code className="rounded bg-muted px-1.5 py-0.5 text-xs">Cannot find name 'D1Database'</code>
          と出る → 手順2の<code className="rounded bg-muted px-1.5 py-0.5 text-xs">bun wrangler types</code>
          を実行したか確認してください。実行済みなのに赤線が消えない場合は、エディタのTypeScriptを読み込み直します
          （VS Codeならコマンドパレットで
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">TypeScript: Restart TS Server</code>）。
        </li>
        <li>
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">bun wrangler types</code>
          のあと、Problemsパネルに
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">Definitions of the following identifiers conflict with those in another file</code>
          や<code className="rounded bg-muted px-1.5 py-0.5 text-xs">Subsequent variable declarations must have the same type</code>
          が大量に出る → 手順2の<code className="rounded bg-muted px-1.5 py-0.5 text-xs">tsconfig.json</code>
          の修正（<code className="rounded bg-muted px-1.5 py-0.5 text-xs">lib</code>
          と<code className="rounded bg-muted px-1.5 py-0.5 text-xs">skipLibCheck</code>
          の追記）が抜けています。<code className="rounded bg-muted px-1.5 py-0.5 text-xs">bun run dev</code>
          は型チェックをしないのでサーバーは動きますが、自分のコードのエラーが埋もれてしまうので、必ず直しておきましょう。
        </li>
        <li>
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">wrangler.jsonc</code>
          を編集しても反映されない → 設定ファイルの変更は再起動が必要です。
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">bun run dev</code>
          をCtrl+Cで止めて、もう一度起動してみましょう。
        </li>
        <li>
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">bun wrangler d1 list</code>
          でデータベースを確認しようとしたらログインを求められた → これはCloudflare上の一覧を取りに行くコマンドです。
          ローカルのD1は一覧に出ないので、第3回では使いません（第4回で使います）。
        </li>
        <li>
          JSONCのカンマ・波かっこを崩してしまい、
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">Unexpected token</code>
          のようなエラーになる → 上のコードブロックをコピーして、
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">database_id</code>
          などの値だけ書き換えるのが安全です。
        </li>
      </ul>

      <ProgressCheck id="s3-03-d1-setup" label="wrangler.jsoncにD1の設定を書き、c.env.DBを型付きで使えるようになった" />
      <NextLink current="/session3/03-d1-setup" />
    </div>
  );
}
