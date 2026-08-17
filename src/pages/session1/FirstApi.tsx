import { PageHeader } from "@/components/PageHeader";
import { Callout } from "@/components/Callout";
import { ProgressCheck } from "@/components/ProgressCheck";
import { NextLink } from "@/components/NextLink";
import { CopyBlock } from "@/components/CopyBlock";

export function FirstApi() {
  return (
    <div>
      <PageHeader
        title="最初のAPI：商品一覧"
        goal="GET /api/items で、よろず屋の商品一覧をJSONで返せるようになっている"
        minutes={15}
      />

      <Callout variant="quest">
        <p>
          いよいよお店の倉庫を整えます。まずは一番簡単な窓口から。
          「商品一覧を見せて」と言われたら、棚の商品データをそのまま返す窓口を作りましょう。
        </p>
      </Callout>

      <h2 className="mt-8 text-xl font-bold">1. 商品データを用意する</h2>
      <p className="mt-3 leading-relaxed">
        <code className="rounded bg-muted px-1.5 py-0.5 text-xs">backend/src/index.ts</code>
        を開いて、商品データを書き加えます。
        今回はメモリ上の配列で管理します（サーバーを再起動すると元に戻る、
        「開店前の棚」のようなものです。第3回でデータベースに置き換えます）。
      </p>

      <CopyBlock
        lang="ts"
        title="backend/src/index.ts"
        code={`import { Hono } from 'hono'

const app = new Hono()

// よろず屋の商品データ（第3回でデータベースに置き換えます）
const items = [
  { id: 1, name: 'やくそう', price: 8, stock: 99, description: 'HPを少量回復する' },
  { id: 2, name: 'ポーション', price: 50, stock: 10, description: 'HPを大きく回復する' },
  { id: 3, name: 'エリクサー', price: 5000, stock: 1, description: 'HPとMPを全回復する伝説の薬' },
  { id: 4, name: '鉄の剣', price: 300, stock: 3, description: '頼りになる冒険者の相棒' },
  { id: 5, name: '魔法の杖', price: 800, stock: 2, description: '使うほど魔力が増す杖' },
]

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

export default app`}
      />

      <h2 className="mt-10 text-xl font-bold">2. 商品一覧のAPIを追加する</h2>
      <p className="mt-3 leading-relaxed">
        先ほどのファイルの
        <code className="rounded bg-muted px-1.5 py-0.5 text-xs">app.get('/', ...)</code>
        の下に、次のコードを追加してください。
      </p>

      <CopyBlock
        lang="ts"
        title="backend/src/index.ts（追記）"
        code={`// 商品一覧を返すAPI
app.get('/api/items', (c) => {
  return c.json(items)
})`}
      />

      <p className="mt-4 leading-relaxed">1行ずつ見てみましょう。</p>
      <ul className="mt-3 list-disc space-y-2 pl-6 text-sm leading-relaxed">
        <li>
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">app.get('/api/items', (c) =&gt; ...)</code>
          … 「<span className="font-medium">GET /api/items</span> というお願いが来たら、この処理でお返事する」という窓口を作っています。
        </li>
        <li>
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">c</code>
          … コンテキストと呼ばれる入れ物。リクエストの情報を取り出したり、レスポンスを作ったりします。
        </li>
        <li>
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">c.json(items)</code>
          … 渡したデータをJSONに変換してレスポンスとして返します。ステータスコードは自動で200になります。
        </li>
      </ul>

      <h2 className="mt-10 text-xl font-bold">3. 動作確認する</h2>
      <p className="mt-3 leading-relaxed">
        開発サーバーが起動したままの状態で、次のどちらかを試してください。
      </p>
      <ul className="mt-3 list-disc space-y-2 pl-6 text-sm leading-relaxed">
        <li>
          ブラウザで
          <a
            href="http://localhost:3000/api/items"
            target="_blank"
            rel="noreferrer"
            className="text-primary underline-offset-4 hover:underline"
          >
            http://localhost:3000/api/items
          </a>
          を開く（GETはブラウザのアドレスバーからでも試せます）
        </li>
        <li>ターミナルで curl を実行する</li>
      </ul>
      <CopyBlock
        lang="bash"
        title="ターミナル"
        code={`curl http://localhost:3000/api/items`}
      />
      <p className="mt-3 leading-relaxed">
        商品データのJSONが表示されれば成功です。よろず屋に、最初の窓口ができました。
      </p>

      <Callout variant="tip" title="パスとメソッドを眺める癖をつけよう">
        <p>
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">GET /api/items</code>
          のように「メソッド + パス」の組み合わせを
          <span className="font-medium">エンドポイント</span>と呼びます。
          APIは「どのエンドポイントに、何を送ると、何が返ってくるか」の集合体です。
        </p>
      </Callout>

      <h2 className="mt-10 text-xl font-bold">よくあるつまずき</h2>
      <ul className="mt-3 list-disc space-y-2 pl-6 text-sm leading-relaxed">
        <li>
          コードを直したのに結果が変わらない → ファイルの保存忘れ、または別のディレクトリでサーバーを起動している可能性があります。
        </li>
        <li>
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">404 Not Found</code>
          が返ってくる → URLのタイポを確認しましょう（
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">/api/item</code>
          など単数形にしていませんか？）。
        </li>
      </ul>

      <ProgressCheck id="s1-04-first-api" label="GET /api/items で商品一覧のJSONを返せた" />
      <NextLink current="/session1/04-first-api" />
    </div>
  );
}
