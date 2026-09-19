import { PageHeader } from "@/components/PageHeader";
import { Callout } from "@/components/Callout";
import { CopyBlock } from "@/components/CopyBlock";
import { NextLink } from "@/components/NextLink";
import { ProgressCheck } from "@/components/ProgressCheck";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PUBLISHED_UP_TO } from "@/lib/routes";

const BEFORE2_CODE = `const app = new Hono()

app.use('/api/*', cors())

// チェインさせて変数に入れる
const routes = app
  .get('/api/items', (c) => c.json(items))
  .get('/api/items/:id', (c) => {
    // ...省略...
  })
  .get('/api/player', (c) => c.json(player))
  .post('/api/purchase', async (c) => {
    // ...省略...
  })
  .post('/api/sell', async (c) => {
    // ...省略...
  })

// クライアント側で使えるように「型」としてエクスポート
export type AppType = typeof routes

export default app`;

const AFTER2_CODE = `import { OpenAPIHono } from '@hono/zod-openapi'
import { cors } from 'hono/cors'
import { itemsApp } from './routes/items'
import { tradeApp } from './routes/trade'

const app = new OpenAPIHono()

app.use('/api/*', cors({ origin: 'http://localhost:5173' }))

// route() もチェイン可能。取り付けた結果を変数に入れる
const routes = app.route('/', itemsApp).route('/', tradeApp)

// クライアント側で使えるように「型」としてエクスポート
export type AppType = typeof routes

export default app`;

export function Rpc() {
  return (
    <div>
      <Badge variant="secondary" className="mb-4">
        サブクエスト（本編の進行には含まれません）
      </Badge>
      <PageHeader
        title="RPCで型安全な連携"
        goal="HonoのRPC機能で、フロントエンドとバックエンドを型でつなぐ体験をする"
        minutes={15}
      />

      <Callout variant="quest">
        <p>
          よろず屋のネット販売が軌道に乗り、フロントの開発者からこんな相談が。
          「APIのパスをタイポしても気づけないし、レスポンスの形を毎回確認するのが大変…」
          Honoの<span className="font-medium">RPC</span>機能は、この悩みを型で解決します。
        </p>
      </Callout>

      <h2 className="mt-8 text-xl font-bold">1. 型情報をエクスポートする</h2>
      <p className="mt-3 leading-relaxed">
        HonoのAPI定義は、そのまま「型」としてフロント側に共有できます。
        <code className="rounded bg-muted px-1.5 py-0.5 text-xs">backend/src/index.ts</code>
        のAPI定義を、次のように<span className="font-medium">チェイン（連鎖）</span>させて変数に入れ、
        型としてエクスポートします。
      </p>

      {PUBLISHED_UP_TO >= 2 ? (
        <>
          <p className="mt-3 leading-relaxed">
            第2回で<code className="rounded bg-muted px-1.5 py-0.5 text-xs">OpenAPIHono</code>
            に切り替えた人も、まだ第1回の<code className="rounded bg-muted px-1.5 py-0.5 text-xs">Hono</code>
            のままの人も、どちらもこのままRPCを試せます。今のあなたのコードに近い方を見てください。
          </p>

          <Tabs defaultValue="after2" className="mt-4">
            <TabsList>
              <TabsTrigger value="before2">第1回完了時点（Hono / app.post）</TabsTrigger>
              <TabsTrigger value="after2">第2回完了後（OpenAPIHono / app.openapi）</TabsTrigger>
            </TabsList>
            <TabsContent value="before2">
              <CopyBlock lang="ts" title="backend/src/index.ts（イメージ）" code={BEFORE2_CODE} />
            </TabsContent>
            <TabsContent value="after2">
              <CopyBlock lang="ts" title="backend/src/index.ts（イメージ）" code={AFTER2_CODE} />
              <Callout variant="tip" title="routes/ 側はすでにチェーン済み">
                <p>
                  第2回で<code className="rounded bg-muted px-1.5 py-0.5 text-xs">routes/items.ts</code>
                  と<code className="rounded bg-muted px-1.5 py-0.5 text-xs">routes/trade.ts</code>
                  を<code className="rounded bg-muted px-1.5 py-0.5 text-xs">.openapi(...).get(...)</code>
                  のチェーンで書いたので、各ファイルの型はもうまとまっています。
                  <code className="rounded bg-muted px-1.5 py-0.5 text-xs">index.ts</code>
                  側は<code className="rounded bg-muted px-1.5 py-0.5 text-xs">app.route(...)</code>
                  の戻り値を変数に受けて、その型をexportするだけです。
                  <code className="rounded bg-muted px-1.5 py-0.5 text-xs">createRoute</code>
                  で定義したリクエストボディの型（quantityは正の整数、など）もそのまま
                  <code className="rounded bg-muted px-1.5 py-0.5 text-xs">AppType</code>
                  に乗るので、RPCクライアント側の入力補完もより正確になります。
                </p>
              </Callout>
            </TabsContent>
          </Tabs>
        </>
      ) : (
        <CopyBlock lang="ts" title="backend/src/index.ts（イメージ）" code={BEFORE2_CODE} />
      )}

      <Callout variant="info" title="なぜチェインさせるの？">
        <p>
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">app.get(...).get(...)</code>
          のように連鎖させることで、「どのパスに、どんなレスポンスの窓口があるか」という情報が
          1つの型にまとまります。詳しくは
          <a
            href="https://hono.dev/docs/guides/best-practices#if-you-want-to-use-rpc-features"
            target="_blank"
            rel="noreferrer"
            className="text-primary underline-offset-4 hover:underline"
          >
            Hono公式のベストプラクティス
          </a>
          を参照してください。
        </p>
      </Callout>

      <h2 className="mt-10 text-xl font-bold">2. 型安全なクライアントを作る</h2>
      <p className="mt-3 leading-relaxed">
        試しに、APIを呼び出すだけの小さなクライアントを作ってみましょう。
        <code className="rounded bg-muted px-1.5 py-0.5 text-xs">backend/src/client.ts</code>
        を新規作成します。
      </p>

      <CopyBlock
        lang="ts"
        title="backend/src/client.ts（新規作成）"
        code={`import type { AppType } from './index'
import { hc } from 'hono/client'

// AppTypeをジェネリクスに渡すだけで、型安全なクライアントに！
const client = hc<AppType>('http://localhost:3000/')

// パスもレスポンスも補完が効く
const res = await client.api.items.$get()

if (res.ok) {
  const items = await res.json()
  // items は { id, name, price, stock, description }[] 型として扱える
  for (const item of items) {
    console.log(\`\${item.name}: \${item.price}G（在庫 \${item.stock}）\`)
  }
}`}
      />

      <p className="mt-3 leading-relaxed">
        バックエンドを起動したまま、別のターミナルで実行してみます。
      </p>
      <CopyBlock
        lang="bash"
        title="ターミナル"
        code={`cd yorozuya/backend
bun run src/client.ts

# やくそう: 8G（在庫 99）... のように表示されればOK`}
      />

      <h2 className="mt-10 text-xl font-bold">3. 何がうれしいの？</h2>
      <ul className="mt-3 list-disc space-y-2 pl-6 text-sm leading-relaxed">
        <li>
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">client.api.items.$get()</code>
          と入力する途中で、存在するパスが<span className="font-medium">補完</span>されます。
          タイポはその場でエラーになります。
        </li>
        <li>
          レスポンスに型が付くので、<code className="rounded bg-muted px-1.5 py-0.5 text-xs">item.name</code>
          なども補完が効き、存在しないプロパティはエラーになります。
        </li>
        <li>
          APIの仕様変更（例：price を gold に改名）をすると、フロント側が自動でエラー表示に。
          「直すべき場所」が一目で分かります。
        </li>
      </ul>

      <Callout variant="tip" title="実際のフロントエンドから使う場合">
        <p>
          同じリポジトリ内のフロントエンド（frontend/）からは、
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">import type {'{ AppType }'} from '../../backend/src/index'</code>
          のように相対パスで型だけを取り込んで使います（型のimportなので実行コードは含まれません）。
          モノレポ構成との相性がとても良い機能です。
        </p>
      </Callout>

      <h2 className="mt-10 text-xl font-bold">よくあるつまずき</h2>
      <ul className="mt-3 list-disc space-y-2 pl-6 text-sm leading-relaxed">
        <li>
          補完が効かない・型が unknown になる → API定義がチェインされていないか、
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">export type AppType</code>
          の忘れがないか確認してください。
        </li>
        <li>
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">import type</code>
          の type を付け忘れる → 型だけを取り込む場合は必ず付けます（実体をimportすると循環参照や不要なバンドルの原因に）。
        </li>
      </ul>

      <ProgressCheck id="extra-rpc" label="RPCで型安全な連携を体験した" />
      <NextLink current="/extra/rpc" />
    </div>
  );
}
