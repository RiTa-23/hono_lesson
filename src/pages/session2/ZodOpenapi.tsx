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
        goal="backendを役割ごとのファイルに分け、@hono/zod-openapiでpurchase・sellのリクエストを検証し、不正な値を自動的に400で弾けるようになっている"
        minutes={30}
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
      <CopyBlock lang="bash" title="ターミナル（backendディレクトリで）" code={`bun add @hono/zod-openapi`} />

      <h2 className="mt-10 text-xl font-bold">2. ファイル構成を決める</h2>
      <p className="mt-3 leading-relaxed">
        第1回では<code className="rounded bg-muted px-1.5 py-0.5 text-xs">backend/src/index.ts</code>
        1つにすべてを書いてきました。ここから「スキーマ」や「ルート定義」が加わると1ファイルでは長くなりすぎるので、
        このタイミングで<span className="font-medium">役割ごとにファイルを分けます</span>。
        Honoでは、別ファイルで作った小さなアプリを
        <code className="rounded bg-muted px-1.5 py-0.5 text-xs">app.route()</code>
        で本体に取り付けられるので、ファイルを分けても機能は何も失われません。
      </p>
      <CopyBlock
        lang="text"
        title="backend/src の構成（このページの完成形）"
        code={`backend/src/
├── index.ts        # アプリの組み立て（CORS・各ファイルのAPIの取り付け）
├── data.ts         # メモリ上のデータ（items / player）← 第1回の配列を移動
├── schemas.ts      # zodスキーマ（リクエスト・レスポンスの「形」）
└── routes/
    ├── items.ts    # 商品棚のAPI（GET /api/items 系）← 第1回のコードを移動
    └── trade.ts    # 売り買いのAPI（GET /api/player, POST /api/purchase, POST /api/sell）`}
      />
      <Callout variant="info" title="作業の途中でエラーが出ても慌てない">
        <p>
          この後の手順3〜7は「コードを別ファイルへ移す」作業なので、途中の状態では
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">bun run dev</code>
          のターミナルやエディタにエラーが出ます。手順7で
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">index.ts</code>
          を書き換えた時点で全部つながるので、そこまで一気に進めてください。
        </p>
      </Callout>

      <h2 className="mt-10 text-xl font-bold">3. データを data.ts に移す</h2>
      <p className="mt-3 leading-relaxed">
        第1回で<code className="rounded bg-muted px-1.5 py-0.5 text-xs">index.ts</code>
        に書いた<code className="rounded bg-muted px-1.5 py-0.5 text-xs">items</code>配列と
        <code className="rounded bg-muted px-1.5 py-0.5 text-xs">player</code>オブジェクトを、
        新しいファイルに<span className="font-medium">切り取って貼り付け</span>ます。
        他のファイルから使えるように、先頭に
        <code className="rounded bg-muted px-1.5 py-0.5 text-xs">export</code>を付けるのを忘れずに。
      </p>
      <CopyBlock
        lang="ts"
        title="backend/src/data.ts（新規作成）"
        code={`// よろず屋の商品データ（第3回でデータベースに置き換えます）
export const items = [
  { id: 1, name: 'やくそう', price: 8, stock: 99, description: 'HPを少量回復する' },
  { id: 2, name: 'ポーション', price: 50, stock: 10, description: 'HPを大きく回復する' },
  { id: 3, name: 'エリクサー', price: 5000, stock: 1, description: 'HPとMPを全回復する伝説の薬' },
  { id: 4, name: '鉄の剣', price: 300, stock: 3, description: '頼りになる冒険者の相棒' },
  { id: 5, name: '魔法の杖', price: 800, stock: 2, description: '使うほど魔力が増す杖' },
]

// 冒険者の状態（第3回でデータベースに置き換えます）
export const player = {
  gold: 500,
  items: [] as { itemId: number; quantity: number }[],
}`}
      />

      <h2 className="mt-10 text-xl font-bold">4. スキーマを schemas.ts に定義する</h2>
      <p className="mt-3 leading-relaxed">
        リクエストの形・レスポンスの形を、それぞれzodのスキーマで表します。
        前のページで試した書き方そのままですが、
        <code className="rounded bg-muted px-1.5 py-0.5 text-xs">z</code>は
        <code className="rounded bg-muted px-1.5 py-0.5 text-xs">'zod'</code>ではなく
        <code className="rounded bg-muted px-1.5 py-0.5 text-xs">'@hono/zod-openapi'</code>
        からimportします（zod本体と同じように使えるうえ、仕様書生成に必要な情報も付けられる版です）。
      </p>
      <CopyBlock
        lang="ts"
        title="backend/src/schemas.ts（新規作成）"
        code={`import { z } from '@hono/zod-openapi'

// リクエストボディのスキーマ（「purchaseのリクエストはこういう形であるべき」というルール）
export const purchaseBodySchema = z.object({
  itemId: z.number().int().positive(),
  quantity: z.number().int().positive().optional(),
})

// sellのリクエストも同じ形（itemId と quantity）
export const sellBodySchema = purchaseBodySchema

// レスポンスのスキーマ（player の形）
export const playerSchema = z.object({
  gold: z.number(),
  items: z.array(z.object({ itemId: z.number(), quantity: z.number() })),
})

// エラー時のレスポンスの形
export const errorSchema = z.object({ message: z.string() })`}
      />

      <h2 className="mt-10 text-xl font-bold">5. 売り買いのAPIを routes/trade.ts に書く</h2>
      <p className="mt-3 leading-relaxed">
        ここがこのページの本題です。
        <code className="rounded bg-muted px-1.5 py-0.5 text-xs">createRoute</code>
        で「POST /api/purchase はこういうAPIだ」という定義を作り、
        <code className="rounded bg-muted px-1.5 py-0.5 text-xs">OpenAPIHono</code>
        の<code className="rounded bg-muted px-1.5 py-0.5 text-xs">.openapi(定義, ハンドラ)</code>
        で結びつけます。第1回の<code className="rounded bg-muted px-1.5 py-0.5 text-xs">app.post('/api/purchase', ...)</code>
        と<code className="rounded bg-muted px-1.5 py-0.5 text-xs">app.post('/api/sell', ...)</code>、
        それに<code className="rounded bg-muted px-1.5 py-0.5 text-xs">app.get('/api/player', ...)</code>
        は、このファイルに引っ越したうえで書き換えるので、
        <code className="rounded bg-muted px-1.5 py-0.5 text-xs">index.ts</code>からは削除します。
      </p>
      <Callout variant="info" title="OpenAPIHono = Honoの拡張版">
        <p>
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">@hono/zod-openapi</code>
          が提供する<code className="rounded bg-muted px-1.5 py-0.5 text-xs">OpenAPIHono</code>
          は、<code className="rounded bg-muted px-1.5 py-0.5 text-xs">Hono</code>
          を拡張したものです。<code className="rounded bg-muted px-1.5 py-0.5 text-xs">.get(...)</code>
          などはこれまで通り使えて、それに加えて
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">.openapi(...)</code>
          が使えるようになります。バリデーションが必要なのはリクエストボディを受け取るPOST系だけなので、
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">/api/player</code>
          は<code className="rounded bg-muted px-1.5 py-0.5 text-xs">.get</code>のままで大丈夫です。
        </p>
      </Callout>
      <CopyBlock
        lang="ts"
        title="backend/src/routes/trade.ts（新規作成）"
        code={`import { OpenAPIHono, createRoute } from '@hono/zod-openapi'
import { items, player } from '../data'
import { purchaseBodySchema, sellBodySchema, playerSchema, errorSchema } from '../schemas'

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
})

// 「POST /api/sell はこういうAPIだ」という定義
const sellRoute = createRoute({
  method: 'post',
  path: '/api/sell',
  request: {
    body: {
      content: { 'application/json': { schema: sellBodySchema } },
    },
  },
  responses: {
    200: {
      content: { 'application/json': { schema: playerSchema } },
      description: '売却成功',
    },
    400: {
      content: { 'application/json': { schema: errorSchema } },
      description: 'リクエストが不正、または持っていない・数が足りない',
    },
  },
})

// 冒険者の所持金・所持品と、売り買いのAPI
export const tradeApp = new OpenAPIHono()
  // アイテムを購入する
  .openapi(purchaseRoute, (c) => {
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

    // 売り買いの処理：在庫を減らし、お金を受け取り、冒険者に渡す
    item.stock -= quantity
    player.gold -= total
    const owned = player.items.find((i) => i.itemId === item.id)
    if (owned) {
      owned.quantity += quantity
    } else {
      player.items.push({ itemId: item.id, quantity })
    }

    return c.json(player, 200)
  })
  // アイテムを売却する（買取価格は半額！）
  .openapi(sellRoute, (c) => {
    const { itemId, quantity: rawQuantity } = c.req.valid('json')
    const quantity = rawQuantity ?? 1

    const item = items.find((i) => i.id === itemId)
    const owned = player.items.find((i) => i.itemId === itemId)

    if (!item || !owned) {
      return c.json({ message: 'そのアイテムは持っていないよ' }, 400)
    }
    if (owned.quantity < quantity) {
      return c.json({ message: '持っている数より多くは売れないよ' }, 400)
    }

    owned.quantity -= quantity
    player.gold += Math.floor(item.price / 2) * quantity
    item.stock += quantity
    // 0個になったアイテムは所持品から消す
    player.items = player.items.filter((i) => i.quantity > 0)

    return c.json(player, 200)
  })
  // 所持金と所持アイテムを返す（第1回のまま）
  .get('/api/player', (c) => {
    return c.json(player)
  })`}
      />
      <ul className="mt-4 list-disc space-y-2 pl-6 text-sm leading-relaxed">
        <li>
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">createRoute({'{...}'})</code>
          … メソッド・パス・リクエストの形・レスポンスの形（ステータスごと）を1つにまとめた「APIの定義書」です。
          次のページで、これがそのままSwagger UIの仕様書になります。
        </li>
        <li>
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">.openapi(purchaseRoute, handler)</code>
          … 第1回の<code className="rounded bg-muted px-1.5 py-0.5 text-xs">app.post(path, handler)</code>
          の代わりです。中身のロジックは第1回とほぼ同じですが、
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">c.req.json()</code>
          の代わりに<code className="rounded bg-muted px-1.5 py-0.5 text-xs">c.req.valid('json')</code>
          で<span className="font-medium">検証済みの値</span>を受け取ります。
        </li>
        <li>
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">c.json(player, 200)</code>
          … 成功時も<span className="font-medium">ステータスコードを明示</span>しています。
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">createRoute</code>
          の<code className="rounded bg-muted px-1.5 py-0.5 text-xs">responses</code>
          で宣言した形と照合されるため、省略すると型エラーになります。
        </li>
        <li>
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">export const tradeApp</code>
          … このファイルで作った小さなアプリを、手順7で
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">index.ts</code>
          から取り付けるためにexportしています。
        </li>
      </ul>
      <Callout variant="tip" title="なぜ「.」でつなげて（チェーンして）書くの？">
        <p>
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">new OpenAPIHono().openapi(...).openapi(...).get(...)</code>
          のように連鎖させると、「どのパスに、どんなリクエスト・レスポンスのAPIがあるか」が
          <span className="font-medium">1つの型にまとまります</span>。次のページのテストでパスやレスポンスの補完が効くのはこのおかげです
          （第1回のように<code className="rounded bg-muted px-1.5 py-0.5 text-xs">tradeApp.openapi(...)</code>
          を1文ずつ並べても動きますが、型はまとまりません）。
        </p>
        <p className="mt-2">
          1つだけ順番の決まりがあります。<code className="rounded bg-muted px-1.5 py-0.5 text-xs">.get(...)</code>
          の後ろには<code className="rounded bg-muted px-1.5 py-0.5 text-xs">.openapi(...)</code>
          を続けられないので、<span className="font-medium">.openapi を先、.get を後</span>に書きます。
        </p>
      </Callout>

      <h2 className="mt-10 text-xl font-bold">6. 商品のAPIを routes/items.ts に移す</h2>
      <p className="mt-3 leading-relaxed">
        第1回で書いた<code className="rounded bg-muted px-1.5 py-0.5 text-xs">GET /api/items</code>と
        <code className="rounded bg-muted px-1.5 py-0.5 text-xs">GET /api/items/:id</code>
        も、同じ形で別ファイルに移します。中身のロジックは変えず、
        <code className="rounded bg-muted px-1.5 py-0.5 text-xs">app.get(...)</code>
        を<code className="rounded bg-muted px-1.5 py-0.5 text-xs">.get(...)</code>のチェーンに書き換えるだけです。
      </p>
      <CopyBlock
        lang="ts"
        title="backend/src/routes/items.ts（新規作成）"
        code={`import { OpenAPIHono } from '@hono/zod-openapi'
import { items } from '../data'

// 商品棚のAPI（第1回のコードをそのまま移動）
export const itemsApp = new OpenAPIHono()
  // 商品一覧を返す
  .get('/api/items', (c) => {
    return c.json(items)
  })
  // 商品を1件返す
  .get('/api/items/:id', (c) => {
    const id = Number(c.req.param('id'))
    const item = items.find((i) => i.id === id)

    if (!item) {
      return c.json({ message: 'そんな商品は置いてないよ' }, 404)
    }
    return c.json(item)
  })`}
      />
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
        第1回の発展で<code className="rounded bg-muted px-1.5 py-0.5 text-xs">?maxPrice=</code>
        の絞り込みを実装した人は、その<code className="rounded bg-muted px-1.5 py-0.5 text-xs">if</code>
        文も一緒に持ってきてください。
      </p>

      <h2 className="mt-10 text-xl font-bold">7. index.ts を「組み立て役」に書き換える</h2>
      <p className="mt-3 leading-relaxed">
        APIの中身はすべて<code className="rounded bg-muted px-1.5 py-0.5 text-xs">routes/</code>
        に移ったので、<code className="rounded bg-muted px-1.5 py-0.5 text-xs">index.ts</code>
        の仕事は「CORSの設定」と「各ファイルのAPIを取り付けること」だけになります。
        <span className="font-medium">ファイル全体を次の内容に置き換えて</span>ください。
      </p>
      <CopyBlock
        lang="ts"
        title="backend/src/index.ts（全体を置き換え）"
        code={`import { OpenAPIHono } from '@hono/zod-openapi'
import { cors } from 'hono/cors'
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

export default app`}
      />
      <ul className="mt-4 list-disc space-y-2 pl-6 text-sm leading-relaxed">
        <li>
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">new Hono()</code>
          → <code className="rounded bg-muted px-1.5 py-0.5 text-xs">new OpenAPIHono()</code>
          … 次のページで仕様書を出す<code className="rounded bg-muted px-1.5 py-0.5 text-xs">app.doc()</code>
          を使うため、本体も<code className="rounded bg-muted px-1.5 py-0.5 text-xs">OpenAPIHono</code>にします。
        </li>
        <li>
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">app.route('/', itemsApp)</code>
          … 「<code className="rounded bg-muted px-1.5 py-0.5 text-xs">itemsApp</code>
          の中のAPIを、そのままのパスで取り付ける」という意味です。
          サブアプリ側に<code className="rounded bg-muted px-1.5 py-0.5 text-xs">/api/items</code>
          とフルパスで書いてあるので、ここは<code className="rounded bg-muted px-1.5 py-0.5 text-xs">'/'</code>
          にします。
        </li>
        <li>
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">app.use('/api/*', cors(...))</code>
          … 取り付けたAPIにもCORSは効きます。
          <span className="font-medium">取り付け（route）より上に書く</span>のは第1回と同じ理由です。
        </li>
      </ul>

      <h2 className="mt-10 text-xl font-bold">8. 動作確認する</h2>
      <p className="mt-3 leading-relaxed">
        まず、ファイルを分けても第1回のAPIがそのまま動くことを確認します。
      </p>
      <CopyBlock
        lang="bash"
        title="ターミナル"
        code={`# 商品一覧（第1回と同じJSONが返るはず）
curl http://localhost:3000/api/items

# 正常な購入（200 と player の状態が返るはず）
curl -i -X POST -H "Content-Type: application/json" \\
  -d '{"itemId": 2, "quantity": 1}' \\
  http://localhost:3000/api/purchase`}
      />
      <p className="mt-3 leading-relaxed">
        次に、このページの目的だった「穴」がふさがっているかを確認します。
      </p>
      <CopyBlock
        lang="bash"
        title="ターミナル"
        code={`curl -i -X POST -H "Content-Type: application/json" \\
  -d '{"itemId": 2, "quantity": -5}' \\
  http://localhost:3000/api/purchase
# → 400 Bad Request と、zodが生成したエラーメッセージが返るはず

# 所持金が減っていない（増えてもいない）ことを確認
curl http://localhost:3000/api/player`}
      />
      <p className="mt-3 leading-relaxed">
        今度は所持金が増えることなく、リクエストの時点でしっかり弾かれれば成功です。
      </p>

      <h2 className="mt-10 text-xl font-bold">理解度チェック</h2>
      <Quiz
        question=".openapi(purchaseRoute, handler) に登録したエンドポイントへ、purchaseBodySchemaに違反するリクエストを送るとどうなる？"
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
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">Cannot find module '../data'</code>
          のようなエラー → importのパスを確認しましょう。
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">routes/</code>
          の中のファイルからは1つ上の階層を指す<code className="rounded bg-muted px-1.5 py-0.5 text-xs">../</code>
          が必要で、<code className="rounded bg-muted px-1.5 py-0.5 text-xs">index.ts</code>
          からは<code className="rounded bg-muted px-1.5 py-0.5 text-xs">./routes/items</code>のように書きます。
        </li>
        <li>
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">.openapi</code>
          が存在しないと言われる → <code className="rounded bg-muted px-1.5 py-0.5 text-xs">.get(...)</code>
          の後ろに<code className="rounded bg-muted px-1.5 py-0.5 text-xs">.openapi(...)</code>
          を書いていないか（順番は openapi → get）、
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">'hono'</code>の
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">Hono</code>
          をnewしていないかを確認しましょう。
        </li>
        <li>
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">c.json(player)</code>
          で型エラーになる → <code className="rounded bg-muted px-1.5 py-0.5 text-xs">.openapi</code>
          のハンドラでは、成功時も<code className="rounded bg-muted px-1.5 py-0.5 text-xs">c.json(player, 200)</code>
          とステータスを明示します。
        </li>
        <li>
          既存のGET系エンドポイントも全部<code className="rounded bg-muted px-1.5 py-0.5 text-xs">createRoute</code>
          にしないといけない？ → 不要です。バリデーションが必要なのはリクエストボディを受け取るPOST系だけ。
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">.get</code>
          と<code className="rounded bg-muted px-1.5 py-0.5 text-xs">.openapi</code>
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

      <ProgressCheck id="s2-03-zod-openapi" label="backendをファイルに分け、zod-openapiでpurchase/sellのリクエストを検証できるようになった" />
      <NextLink current="/session2/03-zod-openapi" />
    </div>
  );
}
