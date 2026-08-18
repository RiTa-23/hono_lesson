import { PageHeader } from "@/components/PageHeader";
import { Callout } from "@/components/Callout";
import { Quiz } from "@/components/Quiz";
import { ProgressCheck } from "@/components/ProgressCheck";
import { NextLink } from "@/components/NextLink";
import { CopyBlock } from "@/components/CopyBlock";

export function ReadApi() {
  return (
    <div>
      <PageHeader
        title="items一覧・詳細をDBから取得する"
        chapter="05"
        goal="GET /api/items と GET /api/items/:id を、配列操作からDrizzle経由のD1クエリに書き換えられている"
        minutes={15}
      />

      <h2 className="text-xl font-bold">1. Drizzleのインスタンスを作る</h2>
      <p className="mt-3 leading-relaxed">
        <code className="rounded bg-muted px-1.5 py-0.5 text-xs">c.env.DB</code>
        （D1のバインディング）を、Drizzleが扱える形に変換します。
      </p>
      <CopyBlock
        lang="ts"
        title="backend/src/index.ts（先頭に追記）"
        code={`import { drizzle } from 'drizzle-orm/d1'
import { eq } from 'drizzle-orm'
import { items } from './db/schema'`}
      />

      <h2 className="mt-10 text-xl font-bold">2. 商品一覧APIを書き換える</h2>
      <p className="mt-3 leading-relaxed">
        第1回で書いた<code className="rounded bg-muted px-1.5 py-0.5 text-xs">const items = [...]</code>
        の配列宣言は削除し（スキーマの<code className="rounded bg-muted px-1.5 py-0.5 text-xs">items</code>
        と名前が被るので忘れずに）、ハンドラの中身をDrizzleのクエリに置き換えます。
      </p>
      <CopyBlock
        lang="ts"
        title="backend/src/index.ts（GET /api/items を置き換え）"
        code={`app.get('/api/items', async (c) => {
  const db = drizzle(c.env.DB)
  const allItems = await db.select().from(items)
  return c.json(allItems)
})`}
      />

      <h2 className="mt-10 text-xl font-bold">3. 商品詳細APIを書き換える</h2>
      <CopyBlock
        lang="ts"
        title="backend/src/index.ts（GET /api/items/:id を置き換え）"
        code={`app.get('/api/items/:id', async (c) => {
  const db = drizzle(c.env.DB)
  const id = Number(c.req.param('id'))

  const item = await db.select().from(items).where(eq(items.id, id)).get()

  if (!item) {
    return c.json({ message: 'そんな商品は置いてないよ' }, 404)
  }
  return c.json(item)
})`}
      />

      <ul className="mt-4 list-disc space-y-2 pl-6 text-sm leading-relaxed">
        <li>
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">drizzle(c.env.DB)</code>
          … リクエストのたびに、そのリクエスト用のDB接続を作ります。
        </li>
        <li>
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">db.select().from(items)</code>
          … SQLの<code className="rounded bg-muted px-1.5 py-0.5 text-xs">SELECT * FROM items</code>
          にあたります。
        </li>
        <li>
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">.where(eq(items.id, id))</code>
          … <code className="rounded bg-muted px-1.5 py-0.5 text-xs">WHERE id = ?</code>
          にあたります。
        </li>
        <li>
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">.get()</code>
          … 結果を配列ではなく1件（またはundefined）で受け取ります。
        </li>
      </ul>

      <h2 className="mt-10 text-xl font-bold">4. 動作確認する</h2>
      <CopyBlock
        lang="bash"
        title="ターミナル"
        code={`curl http://localhost:3000/api/items
curl http://localhost:3000/api/items/3`}
      />
      <p className="mt-3 leading-relaxed">
        第1回・第2回と同じ形のJSONが返ってくれば成功です。中身はメモリの配列ではなく、
        ローカルD1から読み出されたデータに変わっています。
      </p>

      <Callout variant="warn" title="drizzle()はグローバルで1回だけ作らない">
        <p>
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">drizzle(c.env.DB)</code>
          は、必ずハンドラの中（<code className="rounded bg-muted px-1.5 py-0.5 text-xs">c</code>
          が使える場所）で呼び出してください。Cloudflare Workersはリクエストごとに実行環境が用意されるため、
          ファイルの先頭でグローバルに1回だけ作ってしまうと正しく動作しません。
        </p>
      </Callout>

      <h2 className="mt-10 text-xl font-bold">理解度チェック</h2>
      <Quiz
        question="db.select().from(items).where(eq(items.id, id)) は、SQLで言うとどの文にあたる？"
        choices={[
          "SELECT * FROM items WHERE id = ?",
          "INSERT INTO items (id) VALUES (?)",
          "DELETE FROM items WHERE id = ?",
        ]}
        answerIndex={0}
        explanation="select().from(items) がSELECT * FROM items、.where(eq(items.id, id)) がWHERE id = ? に対応します。Drizzleは、このようにSQLの構文をTypeScriptのメソッドチェーンで表現します。"
      />

      <h2 className="mt-10 text-xl font-bold">よくあるつまずき</h2>
      <ul className="mt-3 list-disc space-y-2 pl-6 text-sm leading-relaxed">
        <li>
          第1回の<code className="rounded bg-muted px-1.5 py-0.5 text-xs">const items = [...]</code>
          を消し忘れて、<code className="rounded bg-muted px-1.5 py-0.5 text-xs">items</code>
          という名前がスキーマのimportと衝突する → 配列の宣言は不要になったので削除しましょう。
        </li>
        <li>
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">.get()</code>
          を付け忘れて、1件のはずのデータが配列のまま返ってくる →
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">where()</code>
          だけでは配列が返る点に注意してください。
        </li>
      </ul>

      <ProgressCheck id="s3-05-read-api" label="items一覧・詳細のAPIをD1から取得するように書き換えられた" />
      <NextLink current="/session3/05-read-api" />
    </div>
  );
}
