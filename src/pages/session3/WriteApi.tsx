import { PageHeader } from "@/components/PageHeader";
import { Callout } from "@/components/Callout";
import { Quiz } from "@/components/Quiz";
import { ProgressCheck } from "@/components/ProgressCheck";
import { NextLink } from "@/components/NextLink";
import { CopyBlock } from "@/components/CopyBlock";

export function WriteApi() {
  return (
    <div>
      <PageHeader
        title="purchase/sellをDB更新処理に書き換える"
        chapter="07"
        goal="購入・売却APIとplayer取得APIを、在庫・所持金・所持アイテムをD1に読み書きする実装に書き換えられている"
        minutes={25}
      />

      <Callout variant="quest">
        <p>
          最後の仕上げです。購入・売却のロジックはそのまま、
          「メモリの配列を書き換える」部分だけを「D1のテーブルを読み書きする」に置き換えます。
        </p>
      </Callout>

      <h2 className="mt-8 text-xl font-bold">1. importを書き換える</h2>
      <p className="mt-3 leading-relaxed">
        売り買いのAPIは<code className="rounded bg-muted px-1.5 py-0.5 text-xs">routes/trade.ts</code>
        にまとめてあるので、書き換えるのはこのファイルだけです。まず先頭のimportを次のようにします
        （<code className="rounded bg-muted px-1.5 py-0.5 text-xs">'../data'</code>
        からのimportは削除し、Drizzle関連とDBスキーマを追加）。
      </p>
      <CopyBlock
        lang="ts"
        title="backend/src/routes/trade.ts（先頭のimportを置き換え）"
        code={`import { OpenAPIHono, createRoute } from '@hono/zod-openapi'
import { drizzle } from 'drizzle-orm/d1'
import { and, eq } from 'drizzle-orm'
import { items, player, playerItems } from '../db/schema'
import { purchaseBodySchema, sellBodySchema, playerSchema, errorSchema } from '../schemas'
import type { Bindings } from '../types'`}
      />
      <Callout variant="info" title="レスポンスの形は変えない">
        <p>
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{'{ gold, items: [{ itemId, quantity }] }'}</code>
          という形は、フロントエンド（React側）が期待しているAPI契約です。中身の実装がD1に変わっても、
          <span className="font-medium">この形だけは絶対に崩さない</span>ようにしましょう。
          そうすればフロントのコードは一切書き換える必要がありません。
          第2回で<code className="rounded bg-muted px-1.5 py-0.5 text-xs">schemas.ts</code>
          に書いた<code className="rounded bg-muted px-1.5 py-0.5 text-xs">playerSchema</code>
          も、そのまま使えます。
        </p>
      </Callout>

      <h2 className="mt-10 text-xl font-bold">2. 現在のplayer状態を組み立てるヘルパーを作る</h2>
      <p className="mt-3 leading-relaxed">
        purchase・sell・GET /api/player の3か所で「最新のplayer状態を返す」処理が必要になるので、共通の関数にしておきます。
        2つの<code className="rounded bg-muted px-1.5 py-0.5 text-xs">createRoute</code>
        の後、<code className="rounded bg-muted px-1.5 py-0.5 text-xs">export const tradeApp</code>
        の前に追記します。
      </p>
      <CopyBlock
        lang="ts"
        title="backend/src/routes/trade.ts（tradeApp の前に追記）"
        code={`// 現在のplayer状態（{ gold, items }）をDBから組み立てる
async function getPlayerState(db: ReturnType<typeof drizzle>) {
  const playerRow = await db.select().from(player).where(eq(player.id, 1)).get()
  const ownedItems = await db.select().from(playerItems).where(eq(playerItems.playerId, 1))

  return {
    gold: playerRow?.gold ?? 0,
    items: ownedItems.map((i) => ({ itemId: i.itemId, quantity: i.quantity })),
  }
}`}
      />

      <h2 className="mt-10 text-xl font-bold">3. 購入APIを書き換える</h2>
      <p className="mt-3 leading-relaxed">
        <code className="rounded bg-muted px-1.5 py-0.5 text-xs">.openapi(purchaseRoute, ...)</code>
        のブロックを丸ごと置き換えます。ハンドラが<code className="rounded bg-muted px-1.5 py-0.5 text-xs">async</code>
        になる点に注意してください。
      </p>
      <CopyBlock
        lang="ts"
        title="backend/src/routes/trade.ts（.openapi(purchaseRoute, ...) のブロックを置き換え）"
        code={`  // アイテムを購入する
  .openapi(purchaseRoute, async (c) => {
    const db = drizzle(c.env.DB)
    const { itemId, quantity: rawQuantity } = c.req.valid('json')
    const quantity = rawQuantity ?? 1

    const item = await db.select().from(items).where(eq(items.id, itemId)).get()
    if (!item) {
      return c.json({ message: 'そんな商品は置いてないよ' }, 404)
    }

    const total = item.price * quantity
    if (item.stock < quantity) {
      return c.json({ message: '在庫が足りないよ' }, 400)
    }

    const playerRow = await db.select().from(player).where(eq(player.id, 1)).get()
    if (!playerRow || playerRow.gold < total) {
      return c.json({ message: 'お金が足りないよ' }, 400)
    }

    // 在庫を減らし、お金を受け取る
    await db.update(items).set({ stock: item.stock - quantity }).where(eq(items.id, itemId))
    await db.update(player).set({ gold: playerRow.gold - total }).where(eq(player.id, 1))

    // 所持品を更新（すでに持っていれば加算、なければ新規追加）
    const owned = await db
      .select()
      .from(playerItems)
      .where(and(eq(playerItems.playerId, 1), eq(playerItems.itemId, itemId)))
      .get()

    if (owned) {
      await db
        .update(playerItems)
        .set({ quantity: owned.quantity + quantity })
        .where(eq(playerItems.id, owned.id))
    } else {
      await db.insert(playerItems).values({ playerId: 1, itemId, quantity })
    }

    return c.json(await getPlayerState(db), 200)
  })`}
      />

      <h2 className="mt-10 text-xl font-bold">4. 売却APIを書き換える</h2>
      <CopyBlock
        lang="ts"
        title="backend/src/routes/trade.ts（.openapi(sellRoute, ...) のブロックを置き換え）"
        code={`  // アイテムを売却する（買取価格は半額！）
  .openapi(sellRoute, async (c) => {
    const db = drizzle(c.env.DB)
    const { itemId, quantity: rawQuantity } = c.req.valid('json')
    const quantity = rawQuantity ?? 1

    const item = await db.select().from(items).where(eq(items.id, itemId)).get()
    const owned = await db
      .select()
      .from(playerItems)
      .where(and(eq(playerItems.playerId, 1), eq(playerItems.itemId, itemId)))
      .get()

    if (!item || !owned || owned.quantity < quantity) {
      return c.json({ message: '持っている数より多くは売れないよ' }, 400)
    }

    const refund = Math.floor(item.price / 2) * quantity

    await db.update(items).set({ stock: item.stock + quantity }).where(eq(items.id, itemId))

    const playerRow = await db.select().from(player).where(eq(player.id, 1)).get()
    await db
      .update(player)
      .set({ gold: (playerRow?.gold ?? 0) + refund })
      .where(eq(player.id, 1))

    if (owned.quantity === quantity) {
      await db.delete(playerItems).where(eq(playerItems.id, owned.id))
    } else {
      await db
        .update(playerItems)
        .set({ quantity: owned.quantity - quantity })
        .where(eq(playerItems.id, owned.id))
    }

    return c.json(await getPlayerState(db), 200)
  })`}
      />

      <h2 className="mt-10 text-xl font-bold">5. GET /api/player もDBから返す</h2>
      <p className="mt-3 leading-relaxed">
        所持金・所持品を返すAPIも、メモリ上の<code className="rounded bg-muted px-1.5 py-0.5 text-xs">player</code>
        ではなくDBから組み立てるようにします。ここを忘れると、購入は保存されているのに
        <code className="rounded bg-muted px-1.5 py-0.5 text-xs">/api/player</code>
        だけ常に500Gを返す、という状態になります。
      </p>
      <CopyBlock
        lang="ts"
        title="backend/src/routes/trade.ts（.get('/api/player', ...) のブロックを置き換え）"
        code={`  // 所持金と所持アイテムを返す
  .get('/api/player', async (c) => {
    const db = drizzle(c.env.DB)
    return c.json(await getPlayerState(db))
  })`}
      />

      <h2 className="mt-10 text-xl font-bold">6. data.ts を削除する</h2>
      <p className="mt-3 leading-relaxed">
        これで<code className="rounded bg-muted px-1.5 py-0.5 text-xs">data.ts</code>
        のメモリ上のデータを使うファイルはなくなりました。
        <code className="rounded bg-muted px-1.5 py-0.5 text-xs">backend/src/data.ts</code>
        は削除して構いません（残っていても動きますが、「使われていないデータ」が残るのは混乱のもとです）。
      </p>

      <h2 className="mt-10 text-xl font-bold">7. 動作確認する</h2>
      <CopyBlock
        lang="bash"
        title="ターミナル"
        code={`# ポーションを1本購入
curl -X POST -H "Content-Type: application/json" \\
  -d '{"itemId": 2, "quantity": 1}' \\
  http://localhost:3000/api/purchase

# サーバーを一度再起動してから、もう一度確認
curl http://localhost:3000/api/player
# → 購入した内容が残っていれば成功！`}
      />
      <p className="mt-3 leading-relaxed">
        開発サーバーを再起動しても所持金・所持品が消えなければ、D1への移行は完璧です。
      </p>

      <h2 className="mt-10 text-xl font-bold">理解度チェック</h2>
      <Quiz
        question="購入APIのレスポンスの形（{ gold, items: [...] }）を、DB移行の前後で変えなかったのはなぜ？"
        choices={[
          "フロントエンド（React側）のコードを一切変更せずに動かし続けるため",
          "Drizzleがその形でしかデータを返せない仕様だから",
          "OpenAPIの仕様上、レスポンスの形を変更してはいけないルールがあるから",
        ]}
        answerIndex={0}
        explanation="APIのレスポンスの形はフロントエンドとの「契約」です。バックエンドの実装（メモリ→D1）が変わっても、この契約さえ守れば、フロント側は何も知らずに動き続けられます。"
      />

      <h2 className="mt-10 text-xl font-bold">よくあるつまずき</h2>
      <ul className="mt-3 list-disc space-y-2 pl-6 text-sm leading-relaxed">
        <li>
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">.get()</code>
          を付け忘れて、1件のはずのデータが配列のまま扱われエラーになる →
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">select().from(...).where(...)</code>
          は常に配列を返すため、1件だけ欲しいときは必ず<code className="rounded bg-muted px-1.5 py-0.5 text-xs">.get()</code>
          を付けます。
        </li>
        <li>
          購入はできるのに<code className="rounded bg-muted px-1.5 py-0.5 text-xs">/api/player</code>
          が500Gのまま → 手順5の<code className="rounded bg-muted px-1.5 py-0.5 text-xs">.get('/api/player', ...)</code>
          の書き換え忘れです。<code className="rounded bg-muted px-1.5 py-0.5 text-xs">return c.json(player)</code>
          のままだと、メモリ上の古いデータを返し続けます。
        </li>
        <li>
          第2回で書いた<code className="rounded bg-muted px-1.5 py-0.5 text-xs">routes/trade.test.ts</code>
          が<code className="rounded bg-muted px-1.5 py-0.5 text-xs">bun test</code>
          で失敗するようになった → <code className="rounded bg-muted px-1.5 py-0.5 text-xs">tradeApp</code>
          が<code className="rounded bg-muted px-1.5 py-0.5 text-xs">c.env.DB</code>
          を必要とするようになったためで、想定どおりの挙動です。
          <span className="font-medium">削除もskipも不要です</span>。本編はこのまま進めてかまいません。
          直したい人は、第3回を終えたあとにサブクエスト「
          <a href="#/extra/testing-d1" className="text-primary underline-offset-4 hover:underline">
            第2回のテストをD1対応にする
          </a>
          」で、テスト用のD1を渡して全部PASSに戻せます。
        </li>
        <li>
          複数の<code className="rounded bg-muted px-1.5 py-0.5 text-xs">update</code>
          を順番に実行しているため、途中でエラーが起きると一部だけ更新されてしまう可能性がある →
          実際のサービスではトランザクション（すべて成功するか、すべて失敗するかのどちらかにする仕組み）を使いますが、
          今回は学習のためシンプルな実装のままにしています。
        </li>
      </ul>

      <ProgressCheck id="s3-07-write-api" label="購入・売却APIをD1の読み書きに書き換え、再起動してもデータが残ることを確認した" />
      <NextLink current="/session3/07-write-api" />
    </div>
  );
}
