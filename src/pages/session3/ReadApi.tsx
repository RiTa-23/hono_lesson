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
        chapter="06"
        goal="GET /api/items と GET /api/items/:id を、配列操作からDrizzle経由のD1クエリに書き換えられている"
        minutes={15}
      />

      <h2 className="text-xl font-bold">1. routes/items.ts を書き換える</h2>
      <p className="mt-3 leading-relaxed">
        商品のAPIは第2回で<code className="rounded bg-muted px-1.5 py-0.5 text-xs">routes/items.ts</code>
        にまとめたので、書き換えるのはこのファイルだけです。
        <code className="rounded bg-muted px-1.5 py-0.5 text-xs">c.env.DB</code>
        （D1のバインディング）をDrizzleが扱える形に変換し、配列操作をクエリに置き換えます。
        <span className="font-medium">ファイル全体を次の内容に置き換えて</span>ください。
      </p>
      <CopyBlock
        lang="ts"
        title="backend/src/routes/items.ts（全体を置き換え）"
        code={`import { OpenAPIHono } from '@hono/zod-openapi'
import { drizzle } from 'drizzle-orm/d1'
import { eq } from 'drizzle-orm'
import { items } from '../db/schema'
import type { Bindings } from '../types'

// 商品棚のAPI（D1から読み出す）
export const itemsApp = new OpenAPIHono<{ Bindings: Bindings }>()
  // 商品一覧を返す
  .get('/api/items', async (c) => {
    const db = drizzle(c.env.DB)
    const allItems = await db.select().from(items)
    return c.json(allItems)
  })
  // 商品を1件返す
  .get('/api/items/:id', async (c) => {
    const db = drizzle(c.env.DB)
    const id = Number(c.req.param('id'))

    const item = await db.select().from(items).where(eq(items.id, id)).get()

    if (!item) {
      return c.json({ message: 'そんな商品は置いてないよ' }, 404)
    }
    return c.json(item)
  })`}
      />
      <p className="mt-3 leading-relaxed">
        変わったのは3点です。<code className="rounded bg-muted px-1.5 py-0.5 text-xs">import {'{ items }'} from '../data'</code>
        が<code className="rounded bg-muted px-1.5 py-0.5 text-xs">'../db/schema'</code>
        からのimportに変わり（名前が同じ<code className="rounded bg-muted px-1.5 py-0.5 text-xs">items</code>
        なので、古い方を消さないと衝突します）、ハンドラが
        <code className="rounded bg-muted px-1.5 py-0.5 text-xs">async</code>
        になり、中身がDrizzleのクエリになりました。
      </p>

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

      <h2 className="mt-10 text-xl font-bold">2. 動作確認する</h2>
      <p className="mt-3 leading-relaxed">
        開発サーバーを<code className="rounded bg-muted px-1.5 py-0.5 text-xs">bun run dev</code>
        （依頼No.02で<code className="rounded bg-muted px-1.5 py-0.5 text-xs">wrangler dev</code>
        に差し替えたもの）で起動したまま、別のターミナルで叩いてみましょう。
      </p>
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
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">import {'{ items }'} from '../data'</code>
          を消し忘れて、<code className="rounded bg-muted px-1.5 py-0.5 text-xs">items</code>
          という名前がスキーマのimportと衝突する → このファイルではメモリ上の配列はもう使わないので、
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">'../data'</code>
          のimportは削除しましょう（<code className="rounded bg-muted px-1.5 py-0.5 text-xs">data.ts</code>
          自体は次のページまで<code className="rounded bg-muted px-1.5 py-0.5 text-xs">routes/trade.ts</code>
          が使うので、まだ残しておきます）。
        </li>
        <li>
          第1回の発展で<code className="rounded bg-muted px-1.5 py-0.5 text-xs">?maxPrice=</code>
          の絞り込みを付けていた人 → <code className="rounded bg-muted px-1.5 py-0.5 text-xs">'drizzle-orm'</code>
          から<code className="rounded bg-muted px-1.5 py-0.5 text-xs">lte</code>
          もimportし、<code className="rounded bg-muted px-1.5 py-0.5 text-xs">db.select().from(items).where(lte(items.price, Number(maxPrice)))</code>
          のように書けます（<code className="rounded bg-muted px-1.5 py-0.5 text-xs">lte</code>
          = less than or equal、「以下」）。
        </li>
        <li>
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">.get()</code>
          を付け忘れて、1件のはずのデータが配列のまま返ってくる →
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">where()</code>
          だけでは配列が返る点に注意してください。
        </li>
        <li>
          500エラーになり、ターミナルに
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">
            TypeError: undefined is not an object (evaluating 'this.client.prepare')
          </code>
          と出る → <code className="rounded bg-muted px-1.5 py-0.5 text-xs">c.env.DB</code>
          がundefinedです。サーバーがBunで直接起動されている（依頼No.02のdev script書き換えが済んでいない、
          または古いサーバーが残っている）可能性が高いので、Ctrl+Cで止めて
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">bun run dev</code>
          で起動し直してください。起動時のターミナルにwranglerの表示が出ていればOKです。
        </li>
        <li>
          商品が0件（<code className="rounded bg-muted px-1.5 py-0.5 text-xs">[]</code>）で返ってくる →
          テーブルはあるが中身が空の状態です。依頼No.05の
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">seed.sql</code>
          の投入が済んでいるか確認しましょう。
        </li>
      </ul>

      <ProgressCheck id="s3-06-read-api" label="items一覧・詳細のAPIをD1から取得するように書き換えられた" />
      <NextLink current="/session3/06-read-api" />
    </div>
  );
}
