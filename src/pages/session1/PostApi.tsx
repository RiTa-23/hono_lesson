import { PageHeader } from "@/components/PageHeader";
import { Callout } from "@/components/Callout";
import { ProgressCheck } from "@/components/ProgressCheck";
import { NextLink } from "@/components/NextLink";
import { CopyBlock } from "@/components/CopyBlock";

export function PostApi() {
  return (
    <div>
      <PageHeader
        title="購入・売却API（POST）"
        chapter="06"
        goal="POST /api/purchase と POST /api/sell で、所持金と在庫が変わる売り買いができるようになっている"
        minutes={20}
      />

      <Callout variant="quest">
        <p>
          ここからが本番です。「見せて」（GET）だけでなく、
          <span className="font-medium">「買います」「売ります」（POST）</span>で
          お店の状態が変わる窓口を作りましょう。質屋らしく、買取価格は
          <span className="font-medium">半額</span>です。
        </p>
      </Callout>

      <h2 className="mt-8 text-xl font-bold">1. 勇者の状態を用意する</h2>
      <p className="mt-3 leading-relaxed">
        売り買いの結果を覚えておくため、勇者の所持金と所持アイテムをメモリ上に用意します。
        <code className="rounded bg-muted px-1.5 py-0.5 text-xs">items</code> 配列の下に追記してください。
      </p>

      <CopyBlock
        lang="ts"
        title="backend/src/index.ts（追記）"
        code={`// 勇者の状態（第3回でデータベースに置き換えます）
const player = {
  gold: 500,
  items: [] as { itemId: number; quantity: number }[],
}

// 所持金と所持アイテムを返すAPI
app.get('/api/player', (c) => {
  return c.json(player)
})`}
      />

      <h2 className="mt-10 text-xl font-bold">2. 購入API（POST /api/purchase）</h2>
      <p className="mt-3 leading-relaxed">
        POSTでは、リクエストの<span className="font-medium">ボディ</span>（伝票の中身）に
        データを載せて送ります。Honoでは
        <code className="rounded bg-muted px-1.5 py-0.5 text-xs">await c.req.json()</code>
        で取り出せます。
      </p>

      <CopyBlock
        lang="ts"
        title="backend/src/index.ts（追記）"
        code={`// アイテムを購入するAPI
app.post('/api/purchase', async (c) => {
  const body = await c.req.json()
  const item = items.find((i) => i.id === body.itemId)

  if (!item) {
    return c.json({ message: 'そんな商品は置いてないよ' }, 404)
  }

  const quantity = body.quantity ?? 1
  const total = item.price * quantity

  if (item.stock < quantity) {
    return c.json({ message: '在庫が足りないよ' }, 400)
  }
  if (player.gold < total) {
    return c.json({ message: 'お金が足りないよ' }, 400)
  }

  // 売り買いの処理：在庫を減らし、お金を受け取り、勇者に渡す
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

      <ul className="mt-4 list-disc space-y-2 pl-6 text-sm leading-relaxed">
        <li>
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">async</code> が付いているのは、
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">await c.req.json()</code>
          を使うためです。ボディの読み取りは少し時間がかかる処理なので、結果が来るまで待つ印を付けます。
        </li>
        <li>在庫不足・所持金不足には 400 を返します。お店のルールをコードにしたものです。</li>
      </ul>

      <h2 className="mt-10 text-xl font-bold">3. 売却API（POST /api/sell）</h2>
      <CopyBlock
        lang="ts"
        title="backend/src/index.ts（追記）"
        code={`// アイテムを売却するAPI（買取価格は半額！）
app.post('/api/sell', async (c) => {
  const body = await c.req.json()
  const item = items.find((i) => i.id === body.itemId)
  const owned = player.items.find((i) => i.itemId === body.itemId)

  if (!item || !owned) {
    return c.json({ message: 'そのアイテムは持っていないよ' }, 400)
  }

  const quantity = body.quantity ?? 1
  if (owned.quantity < quantity) {
    return c.json({ message: '持っている数より多くは売れないよ' }, 400)
  }

  owned.quantity -= quantity
  player.gold += Math.floor(item.price / 2) * quantity
  item.stock += quantity
  // 0個になったアイテムは所持品から消す
  player.items = player.items.filter((i) => i.quantity > 0)

  return c.json(player)
})`}
      />

      <h2 className="mt-10 text-xl font-bold">4. 動作確認する</h2>
      <p className="mt-3 leading-relaxed">
        POSTはブラウザのアドレスバーからは送れないので、curlで確認します。
      </p>
      <CopyBlock
        lang="bash"
        title="ターミナル"
        code={`# ポーション（id: 2）を1本買う
curl -X POST -H "Content-Type: application/json" \\
  -d '{"itemId": 2, "quantity": 1}' \\
  http://localhost:3000/api/purchase

# 所持金・所持アイテムを確認（500G → 450G になっているはず）
curl http://localhost:3000/api/player

# ポーションを1本売る（買取価格は半額の25G）
curl -X POST -H "Content-Type: application/json" \\
  -d '{"itemId": 2, "quantity": 1}' \\
  http://localhost:3000/api/sell`}
      />

      <Callout variant="warn" title="サーバーを再起動するとどうなる？">
        <p>
          データはメモリ上にあるだけなので、開発サーバーを止める（またはファイル保存でホットリロードされる）と
          <span className="font-medium">所持金も在庫も初期値にリセット</span>されます。
          「さっき買ったのに！」と思ったらそれが原因です。
          この不便さこそ、第3回でデータベースを導入する理由です。
        </p>
      </Callout>

      <h2 className="mt-10 text-xl font-bold">よくあるつまずき</h2>
      <ul className="mt-3 list-disc space-y-2 pl-6 text-sm leading-relaxed">
        <li>
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">c.req.json()</code> でエラーになる
          → <code className="rounded bg-muted px-1.5 py-0.5 text-xs">-H "Content-Type: application/json"</code>
          の付け忘れが典型例です。これがないと「これはJSONだよ」と伝わりません。
        </li>
        <li>
          購入したはずなのに所持金が戻っている → ホットリロードで状態がリセットされただけです（上の「注意」参照）。
        </li>
        <li>
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">body.quantity ?? 1</code>
          の意味が分からない → 「quantityが未指定なら1」という書き方（null合体演算子）です。
        </li>
      </ul>

      <ProgressCheck id="s1-06-post-api" label="購入・売却APIで所持金と在庫が変わることを確認できた" />
      <NextLink current="/session1/06-post-api" />
    </div>
  );
}
