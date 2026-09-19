import { PageHeader } from "@/components/PageHeader";
import { Callout } from "@/components/Callout";
import { Quiz } from "@/components/Quiz";
import { ProgressCheck } from "@/components/ProgressCheck";
import { NextLink } from "@/components/NextLink";
import { CopyBlock } from "@/components/CopyBlock";

export function SwaggerUi() {
  return (
    <div>
      <PageHeader
        title="Swagger UIでドキュメントを見る"
        chapter="04"
        goal="OpenAPIの仕様書を自動生成し、Swagger UIでブラウザから確認・実行できるようになっている"
        minutes={15}
      />

      <Callout variant="quest">
        <p>
          さっき定義した<code className="rounded bg-muted px-1.5 py-0.5 text-xs">createRoute</code>
          の情報は、実はそのまま<span className="font-medium">API仕様書</span>としても使えます。
          「このAPIは何を受け取って何を返すのか」を、コードを読まなくてもブラウザで確認できるようにしましょう。
        </p>
      </Callout>

      <h2 className="mt-8 text-xl font-bold">1. インストールする</h2>
      <CopyBlock lang="bash" title="ターミナル" code={`bun add @hono/swagger-ui`} />

      <h2 className="mt-10 text-xl font-bold">2. 仕様書とUIのエンドポイントを追加する</h2>
      <p className="mt-3 leading-relaxed">
        仕様書は「アプリ全体」の情報なので、組み立て役の
        <code className="rounded bg-muted px-1.5 py-0.5 text-xs">index.ts</code>
        に追加します。<span className="font-medium">「追加」とコメントした2か所</span>
        （importと、末尾のエンドポイント2つ）を書き足してください。
      </p>
      <CopyBlock
        lang="ts"
        title="backend/src/index.ts（全体。「追加」の行を書き足す）"
        code={`import { OpenAPIHono } from '@hono/zod-openapi'
import { cors } from 'hono/cors'
import { swaggerUI } from '@hono/swagger-ui' // 追加
import { itemsApp } from './routes/items'
import { tradeApp } from './routes/trade'

const app = new OpenAPIHono()

// 今回のフロントエンド（Viteの開発サーバー）だけを許可する
app.use(
  '/api/*',
  cors({
    origin: 'http://localhost:5173',
  })
)

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

// 各ファイルに分けたAPIを、このアプリに取り付ける
app.route('/', itemsApp)
app.route('/', tradeApp)

// 追加：OpenAPI仕様（JSON）を返すエンドポイント
app.doc('/doc', {
  openapi: '3.0.0',
  info: {
    title: 'よろず屋API',
    version: '1.0.0',
  },
})

// 追加：ブラウザで見られるドキュメント画面
app.get('/ui', swaggerUI({ url: '/doc' }))

export default app`}
      />
      <ul className="mt-4 list-disc space-y-2 pl-6 text-sm leading-relaxed">
        <li>
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">app.doc('/doc', ...)</code>
          … これまでに<code className="rounded bg-muted px-1.5 py-0.5 text-xs">createRoute</code>
          で定義したエンドポイント情報をまとめて、OpenAPI形式のJSONとして返す窓口を作ります。
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">app.route()</code>
          で取り付けたサブアプリ（<code className="rounded bg-muted px-1.5 py-0.5 text-xs">tradeApp</code>
          ）の定義も自動的に集められます。
        </li>
        <li>
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">swaggerUI({'{ url: \'/doc\' }'})</code>
          … その仕様書を人が読みやすい画面（Swagger UI）として表示するミドルウェアです。
        </li>
      </ul>

      <h2 className="mt-10 text-xl font-bold">3. ブラウザで確認する</h2>
      <p className="mt-3 leading-relaxed">
        開発サーバーを起動したまま
        <a
          href="http://localhost:3000/ui"
          target="_blank"
          rel="noreferrer"
          className="text-primary underline-offset-4 hover:underline"
        >
          http://localhost:3000/ui
        </a>
        を開いてみましょう。<code className="rounded bg-muted px-1.5 py-0.5 text-xs">/api/purchase</code>
        の項目を開くと、「Try it out」ボタンからブラウザ上で直接リクエストを送って試せます。
        試しに<code className="rounded bg-muted px-1.5 py-0.5 text-xs">quantity: -5</code>
        を送って、400エラーが返ってくることを確認してみましょう。
      </p>

      <Callout variant="tip" title="何がうれしいの？">
        <p>
          フロントエンド担当者に「仕様書見てください」の一言で済むようになります。
          コードを読まなくても、どんなリクエストを送れば何が返るかが一目でわかり、
          実際に試すこともできる。しかも仕様書はコード（<code className="rounded bg-muted px-1.5 py-0.5 text-xs">createRoute</code>
          ）から自動生成されるので、コードと仕様書がズレる心配もありません。
        </p>
      </Callout>

      <h2 className="mt-10 text-xl font-bold">理解度チェック</h2>
      <Quiz
        question="/doc エンドポイントは何を返す？"
        choices={[
          "createRouteで定義したAPI仕様（OpenAPI形式）のJSON",
          "商品一覧のJSON",
          "Swagger UIの画面そのもの（HTML）",
        ]}
        answerIndex={0}
        explanation="/doc はOpenAPI仕様のJSONを返すエンドポイントです。それを人間が読みやすいUIとして描画しているのが /ui（Swagger UI）です。"
      />

      <h2 className="mt-10 text-xl font-bold">よくあるつまずき</h2>
      <ul className="mt-3 list-disc space-y-2 pl-6 text-sm leading-relaxed">
        <li>
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">/ui</code>
          にアクセスしても真っ白 → <code className="rounded bg-muted px-1.5 py-0.5 text-xs">app.doc('/doc', ...)</code>
          の設定忘れ、または<code className="rounded bg-muted px-1.5 py-0.5 text-xs">swaggerUI</code>
          に渡す<code className="rounded bg-muted px-1.5 py-0.5 text-xs">url</code>
          が<code className="rounded bg-muted px-1.5 py-0.5 text-xs">/doc</code>と一致しているか確認しましょう。
        </li>
        <li>
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">/api/items</code>
          や<code className="rounded bg-muted px-1.5 py-0.5 text-xs">/api/player</code>
          が仕様書に出てこない → <code className="rounded bg-muted px-1.5 py-0.5 text-xs">.get(...)</code>
          で書いたエンドポイントは、仕様書（Swagger UI）には表示されません。
          あくまで<code className="rounded bg-muted px-1.5 py-0.5 text-xs">createRoute</code>
          + <code className="rounded bg-muted px-1.5 py-0.5 text-xs">.openapi(...)</code>
          で定義したものだけが対象です。
        </li>
        <li>
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">app.doc</code>
          が存在しないと言われる → <code className="rounded bg-muted px-1.5 py-0.5 text-xs">index.ts</code>
          の<code className="rounded bg-muted px-1.5 py-0.5 text-xs">app</code>
          が<code className="rounded bg-muted px-1.5 py-0.5 text-xs">new OpenAPIHono()</code>
          になっているか確認しましょう（前のページの手順7）。
        </li>
      </ul>

      <ProgressCheck id="s2-04-swagger-ui" label="Swagger UIでAPI仕様書を確認・実行できることを確認した" />
      <NextLink current="/session2/04-swagger-ui" />
    </div>
  );
}
