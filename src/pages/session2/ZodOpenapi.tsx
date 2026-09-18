import { PageHeader } from "@/components/PageHeader";
import { Callout } from "@/components/Callout";
import { Quiz } from "@/components/Quiz";
import { ProgressCheck } from "@/components/ProgressCheck";
import { NextLink } from "@/components/NextLink";
import { CopyBlock } from "@/components/CopyBlock";

export function ZodOpenapi() {
  return (
    <div>
      <PageHeader
        title="zod-openapiでリクエストを検証する"
        chapter="03"
        goal="@hono/zod-openapiでpurchase・sellのリクエストを検証し、不正な値を自動的に400で弾けるようになっている"
        minutes={25}
      />

      <Callout variant="quest">
        <p>
          いよいよ穴をふさぎます。<span className="font-medium">@hono/zod-openapi</span>
          を使うと、「このAPIはこういうリクエストしか受け付けない」というルールをHonoのルート定義そのものに
          組み込めます。ルールに違反したリクエストは、ハンドラの中身が実行される前に自動的に400で弾かれます。
        </p>
      </Callout>

      <Callout variant="info" title="zod-validatorとzod-openapi、どっちを使う？">
        <p>
          zodをHonoのルートに組み込む方法は2つあります。
        </p>
        <ul className="mt-2 list-disc space-y-1.5 pl-5">
          <li>
            <code className="rounded bg-muted px-1.5 py-0.5 text-xs">@hono/zod-validator</code>
            … <code className="rounded bg-muted px-1.5 py-0.5 text-xs">zValidator('json', schema)</code>
            をミドルウェアとして挟むだけの軽量版。違反したリクエストは自動的に400になり、ハンドラでは
            <code className="rounded bg-muted px-1.5 py-0.5 text-xs">c.req.valid('json')</code>
            で検証済みの値を取り出せます。バリデーションだけが目的ならこれで十分です
          </li>
          <li>
            <code className="rounded bg-muted px-1.5 py-0.5 text-xs">@hono/zod-openapi</code>
            … バリデーションに加えて、同じスキーマから<span className="font-medium">OpenAPI仕様書を自動生成</span>
            できます。そのぶん<code className="rounded bg-muted px-1.5 py-0.5 text-xs">createRoute</code>
            でリクエスト・レスポンスの形をきちんと書く必要があり、少し記述量が増えます
          </li>
        </ul>
        <p className="mt-2">
          この講座では次のページでSwagger UI（仕様書を画面で見られるツール）まで作りたいので、
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">@hono/zod-openapi</code>
          を選びます。「検証だけできればよい」場面なら
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">zod-validator</code>
          の方が手軽なので、覚えておくと使い分けができます。
        </p>
      </Callout>

      <h2 className="mt-8 text-xl font-bold">1. インストールする</h2>
      <CopyBlock lang="bash" title="ターミナル" code={`bun add @hono/zod-openapi`} />

      <h2 className="mt-10 text-xl font-bold">2. HonoをOpenAPIHonoに置き換える</h2>
      <p className="mt-3 leading-relaxed">
        <code className="rounded bg-muted px-1.5 py-0.5 text-xs">backend/src/index.ts</code>
        で書き換えるのは<span className="font-medium">次の2行だけ</span>です。
        <code className="rounded bg-muted px-1.5 py-0.5 text-xs">import {'{ cors }'}</code>
        や<code className="rounded bg-muted px-1.5 py-0.5 text-xs">app.use(...)</code>
        など、それ以外の行はそのまま残します。
      </p>
      <CopyBlock
        lang="ts"
        title="変更前（第1回で書いた内容）"
        code={`import { Hono } from 'hono'

const app = new Hono()`}
      />
      <CopyBlock
        lang="ts"
        title="変更後（この2行に置き換える）"
        code={`import { OpenAPIHono, z, createRoute } from '@hono/zod-openapi'

const app = new OpenAPIHono()`}
      />
      <p className="mt-3 leading-relaxed">
        <code className="rounded bg-muted px-1.5 py-0.5 text-xs">@hono/zod-openapi</code>
        は<code className="rounded bg-muted px-1.5 py-0.5 text-xs">OpenAPIHono</code>
        に加えて、独自の<code className="rounded bg-muted px-1.5 py-0.5 text-xs">z</code>
        （zod本体と同じように使えます）と
        <code className="rounded bg-muted px-1.5 py-0.5 text-xs">createRoute</code>
        をセットで提供しています。
        <code className="rounded bg-muted px-1.5 py-0.5 text-xs">z</code>と
        <code className="rounded bg-muted px-1.5 py-0.5 text-xs">createRoute</code>
        はこの後の手順で使います。
      </p>
      <Callout variant="info" title="app.get / app.postはそのまま使える">
        <p>
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">OpenAPIHono</code>
          は<code className="rounded bg-muted px-1.5 py-0.5 text-xs">Hono</code>を拡張したものなので、
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">app.get(...)</code>
          はこれまで通り動きます。今回はbody（購入・売却の中身）を検証したい
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">/api/purchase</code>
          と<code className="rounded bg-muted px-1.5 py-0.5 text-xs">/api/sell</code>
          だけを書き換えます。
        </p>
      </Callout>

      <h2 className="mt-10 text-xl font-bold">3. スキーマとルートを定義する</h2>
      <p className="mt-3 leading-relaxed">
        リクエストの形・レスポンスの形をそれぞれzodのスキーマで表し、
        <code className="rounded bg-muted px-1.5 py-0.5 text-xs">createRoute</code>
        で1つのエンドポイント定義にまとめます。
      </p>
      <CopyBlock
        lang="ts"
        title="backend/src/index.ts（追記）"
        code={`// リクエストボディのスキーマ
const purchaseBodySchema = z.object({
  itemId: z.number().int().positive(),
  quantity: z.number().int().positive().optional(),
})

// レスポンスのスキーマ（player の形）
const playerSchema = z.object({
  gold: z.number(),
  items: z.array(z.object({ itemId: z.number(), quantity: z.number() })),
})

const errorSchema = z.object({ message: z.string() })

// 「POST /api/purchase はこういうAPIだ」という定義
const purchaseRoute = createRoute({
  method: 'post',
  path: '/api/purchase',
  request: {
    body: {
      content: { 'application/json': { schema: purchaseBodySchema } },
    },
  },
  responses: {
    200: {
      content: { 'application/json': { schema: playerSchema } },
      description: '購入成功',
    },
    400: {
      content: { 'application/json': { schema: errorSchema } },
      description: 'リクエストが不正、または在庫・所持金が足りない',
    },
    404: {
      content: { 'application/json': { schema: errorSchema } },
      description: '商品が存在しない',
    },
  },
})`}
      />

      <h2 className="mt-10 text-xl font-bold">4. ルートにハンドラを結びつける</h2>
      <p className="mt-3 leading-relaxed">
        <code className="rounded bg-muted px-1.5 py-0.5 text-xs">app.post(...)</code>
        ではなく<code className="rounded bg-muted px-1.5 py-0.5 text-xs">app.openapi(route, handler)</code>
        という書き方に変わります。中身のロジックは第1回とほぼ同じですが、
        <code className="rounded bg-muted px-1.5 py-0.5 text-xs">c.req.json()</code>
        の代わりに<code className="rounded bg-muted px-1.5 py-0.5 text-xs">c.req.valid('json')</code>
        を使います。
      </p>
      <CopyBlock
        lang="ts"
        title="backend/src/index.ts（既存のapp.post('/api/purchase', ...)を置き換え）"
        code={`app.openapi(purchaseRoute, (c) => {
  // ここに来た時点でバリデーション済み。型も付いている
  const { itemId, quantity: rawQuantity } = c.req.valid('json')
  const quantity = rawQuantity ?? 1

  const item = items.find((i) => i.id === itemId)
  if (!item) {
    return c.json({ message: 'そんな商品は置いてないよ' }, 404)
  }

  const total = item.price * quantity
  if (item.stock < quantity) {
    return c.json({ message: '在庫が足りないよ' }, 400)
  }
  if (player.gold < total) {
    return c.json({ message: 'お金が足りないよ' }, 400)
  }

  item.stock -= quantity
  player.gold -= total
  const owned = player.items.find((i) => i.itemId === item.id)
  if (owned) {
    owned.quantity += quantity
  } else {
    player.items.push({ itemId: item.id, quantity })
  }

  return c.json(player)
})`}
      />
      <p className="mt-3 leading-relaxed">
        <code className="rounded bg-muted px-1.5 py-0.5 text-xs">/api/sell</code>
        も同じ手順（<code className="rounded bg-muted px-1.5 py-0.5 text-xs">sellBodySchema</code> /
        <code className="rounded bg-muted px-1.5 py-0.5 text-xs">sellRoute</code>
        を定義して<code className="rounded bg-muted px-1.5 py-0.5 text-xs">app.openapi</code>
        に置き換え）で書き換えましょう。中身のロジックは第1回のままで大丈夫です。
      </p>

      <h2 className="mt-10 text-xl font-bold">5. 動作確認する</h2>
      <CopyBlock
        lang="bash"
        title="ターミナル"
        code={`curl -i -X POST -H "Content-Type: application/json" \\
  -d '{"itemId": 2, "quantity": -5}' \\
  http://localhost:3000/api/purchase
# → 400 Bad Request と、zodが生成したエラーメッセージが返るはず`}
      />
      <p className="mt-3 leading-relaxed">
        今度は所持金が増えることなく、リクエストの時点でしっかり弾かれれば成功です。
      </p>

      <h2 className="mt-10 text-xl font-bold">理解度チェック</h2>
      <Quiz
        question="app.openapi(purchaseRoute, handler) に登録したエンドポイントへ、purchaseBodySchemaに違反するリクエストを送るとどうなる？"
        choices={[
          "ハンドラの中身は実行されず、自動的に400エラーが返る",
          "ハンドラは実行されるが、itemIdやquantityがundefinedになる",
          "サーバーがクラッシュして500エラーになる",
        ]}
        answerIndex={0}
        explanation="createRouteで定義したスキーマに違反するリクエストは、Honoが自動的に検証してハンドラを呼ぶ前に400エラーを返します。ハンドラの中身が実行されるのは、検証を通過した場合だけです。"
      />

      <h2 className="mt-10 text-xl font-bold">よくあるつまずき</h2>
      <ul className="mt-3 list-disc space-y-2 pl-6 text-sm leading-relaxed">
        <li>
          既存のGET系エンドポイント（<code className="rounded bg-muted px-1.5 py-0.5 text-xs">/api/items</code>
          など）も全部書き換えないといけない？ → 不要です。バリデーションが必要なのはリクエストボディを受け取るPOST系だけ。
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">app.get</code>
          と<code className="rounded bg-muted px-1.5 py-0.5 text-xs">app.openapi</code>
          は同じアプリの中で共存できます。
        </li>
        <li>
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">c.req.json()</code>
          をそのまま使ってしまう → バリデーション済みの値を安全に受け取るには
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">c.req.valid('json')</code>
          を使います。<code className="rounded bg-muted px-1.5 py-0.5 text-xs">json()</code>
          のままだと検証をすり抜けた生のデータになってしまいます。
        </li>
      </ul>

      <ProgressCheck id="s2-03-zod-openapi" label="zod-openapiでpurchase/sellのリクエストを検証できるようになった" />
      <NextLink current="/session2/03-zod-openapi" />
    </div>
  );
}
