import { PageHeader } from "@/components/PageHeader";
import { Callout } from "@/components/Callout";
import { Quiz } from "@/components/Quiz";
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

      <h2 className="mt-8 text-xl font-bold">1. やりとりするデータを決める</h2>
      <p className="mt-3 leading-relaxed">
        コードを書く前に、この窓口で<span className="font-medium">どんな伝票をやりとりするか</span>を先に決めます。
        GETは「見せて」と言うだけで済みましたが、POSTでは冒険者側から
        「どのアイテムを・いくつ」という注文の中身を渡す必要があります。
        購入・売却のどちらも、送る伝票と返す伝票は次の形にします。
      </p>

      <h3 className="mt-8 text-lg font-semibold">冒険者が送るデータ（リクエストボディ）</h3>
      <div className="mt-4 overflow-hidden rounded-lg border">
        <table className="w-full text-sm">
          <thead className="border-b border-gold bg-secondary/60 font-serif">
            <tr>
              <th className="px-4 py-2 text-left font-medium">項目</th>
              <th className="px-4 py-2 text-left font-medium">型</th>
              <th className="px-4 py-2 text-left font-medium">必須</th>
              <th className="px-4 py-2 text-left font-medium">意味</th>
            </tr>
          </thead>
          <tbody className="[&>tr]:border-t">
            <tr>
              <td className="px-4 py-2">
                <code className="rounded bg-muted px-1.5 py-0.5 text-xs">itemId</code>
              </td>
              <td className="px-4 py-2">数値</td>
              <td className="px-4 py-2">必須</td>
              <td className="px-4 py-2">
                買う（売る）アイテムのid。
                <code className="rounded bg-muted px-1.5 py-0.5 text-xs">GET /api/items</code>
                で返ってくる id と同じものです
              </td>
            </tr>
            <tr>
              <td className="px-4 py-2">
                <code className="rounded bg-muted px-1.5 py-0.5 text-xs">quantity</code>
              </td>
              <td className="px-4 py-2">数値</td>
              <td className="px-4 py-2">任意</td>
              <td className="px-4 py-2">個数。省略されたら1個として扱います</td>
            </tr>
          </tbody>
        </table>
      </div>

      <CopyBlock
        lang="json"
        title="リクエストボディの例（ポーションを1本）"
        code={`{
  "itemId": 2,
  "quantity": 1
}`}
      />

      <h3 className="mt-8 text-lg font-semibold">お店が返すデータ（レスポンスボディ）</h3>
      <p className="mt-3 leading-relaxed">
        売り買いのあとは<span className="font-medium">冒険者の最新の状態</span>を返すことにします。
        こうしておくと、画面側は返ってきた値をそのまま表示するだけで、
        「今いくら持っていて、何を持っているか」を更新できます。
      </p>
      <div className="mt-4 overflow-hidden rounded-lg border">
        <table className="w-full text-sm">
          <thead className="border-b border-gold bg-secondary/60 font-serif">
            <tr>
              <th className="px-4 py-2 text-left font-medium">項目</th>
              <th className="px-4 py-2 text-left font-medium">型</th>
              <th className="px-4 py-2 text-left font-medium">意味</th>
            </tr>
          </thead>
          <tbody className="[&>tr]:border-t">
            <tr>
              <td className="px-4 py-2">
                <code className="rounded bg-muted px-1.5 py-0.5 text-xs">gold</code>
              </td>
              <td className="px-4 py-2">数値</td>
              <td className="px-4 py-2">取引後の所持金</td>
            </tr>
            <tr>
              <td className="px-4 py-2">
                <code className="rounded bg-muted px-1.5 py-0.5 text-xs">items</code>
              </td>
              <td className="px-4 py-2">配列</td>
              <td className="px-4 py-2">所持アイテムの一覧（何も持っていなければ空の配列）</td>
            </tr>
            <tr>
              <td className="px-4 py-2">
                <code className="rounded bg-muted px-1.5 py-0.5 text-xs">items[].itemId</code>
              </td>
              <td className="px-4 py-2">数値</td>
              <td className="px-4 py-2">持っているアイテムのid</td>
            </tr>
            <tr>
              <td className="px-4 py-2">
                <code className="rounded bg-muted px-1.5 py-0.5 text-xs">items[].quantity</code>
              </td>
              <td className="px-4 py-2">数値</td>
              <td className="px-4 py-2">その所持数</td>
            </tr>
          </tbody>
        </table>
      </div>

      <CopyBlock
        lang="json"
        title="レスポンスの例（所持金500Gでポーション50Gを1本買ったあと）"
        code={`{
  "gold": 450,
  "items": [
    { "itemId": 2, "quantity": 1 }
  ]
}`}
      />

      <h3 className="mt-8 text-lg font-semibold">失敗したときに返すデータ（エラーレスポンス）</h3>
      <p className="mt-3 leading-relaxed">
        在庫切れやお金不足など、注文を受けられないときは
        <code className="rounded bg-muted px-1.5 py-0.5 text-xs">message</code>
        に理由を入れて、ステータスコードと一緒に返します。
      </p>
      <div className="mt-4 overflow-hidden rounded-lg border">
        <table className="w-full text-sm">
          <thead className="border-b border-gold bg-secondary/60 font-serif">
            <tr>
              <th className="px-4 py-2 text-left font-medium">状況</th>
              <th className="px-4 py-2 text-left font-medium">ステータス</th>
              <th className="px-4 py-2 text-left font-medium">ボディ</th>
            </tr>
          </thead>
          <tbody className="[&>tr]:border-t">
            <tr>
              <td className="px-4 py-2">そのidの商品が存在しない</td>
              <td className="px-4 py-2">404</td>
              <td className="px-4 py-2">
                <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{`{ "message": "そんな商品は置いてないよ" }`}</code>
              </td>
            </tr>
            <tr>
              <td className="px-4 py-2">在庫が足りない</td>
              <td className="px-4 py-2">400</td>
              <td className="px-4 py-2">
                <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{`{ "message": "在庫が足りないよ" }`}</code>
              </td>
            </tr>
            <tr>
              <td className="px-4 py-2">所持金が足りない</td>
              <td className="px-4 py-2">400</td>
              <td className="px-4 py-2">
                <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{`{ "message": "お金が足りないよ" }`}</code>
              </td>
            </tr>
            <tr>
              <td className="px-4 py-2">持っていないアイテムを売ろうとした</td>
              <td className="px-4 py-2">400</td>
              <td className="px-4 py-2">
                <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{`{ "message": "そのアイテムは持っていないよ" }`}</code>
              </td>
            </tr>
            <tr>
              <td className="px-4 py-2">持っている数より多く売ろうとした</td>
              <td className="px-4 py-2">400</td>
              <td className="px-4 py-2">
                <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{`{ "message": "持っている数より多くは売れないよ" }`}</code>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <Callout variant="tip" title="先に形を決めてから作る">
        <p>
          このように「どんなデータを受け取り、どんなデータを返すか」を先に決めることを
          <span className="font-medium">API設計</span>と呼びます。
          ここが決まっていれば、あとのコードは「決めた形どおりに動かす」だけの作業になります。
          第2回では、この形をzodというライブラリでコードとして書き、
          形の違うデータを自動で弾く方法を学びます。
        </p>
      </Callout>

      <h2 className="mt-10 text-xl font-bold">2. 冒険者の状態を用意する</h2>
      <p className="mt-3 leading-relaxed">
        売り買いの結果を覚えておくため、冒険者の所持金と所持アイテムをメモリ上に用意します。
        <code className="rounded bg-muted px-1.5 py-0.5 text-xs">items</code> 配列の下に追記してください。
      </p>

      <CopyBlock
        lang="ts"
        title="backend/src/index.ts（追記）"
        code={`// 冒険者の状態（第3回でデータベースに置き換えます）
const player = {
  gold: 500,
  items: [] as { itemId: number; quantity: number }[],
}

// 所持金と所持アイテムを返すAPI
app.get('/api/player', (c) => {
  return c.json(player)
})`}
      />

      <h2 className="mt-10 text-xl font-bold">3. 購入API（POST /api/purchase）</h2>
      <p className="mt-3 leading-relaxed">
        POSTでは、リクエストの<span className="font-medium">ボディ</span>（伝票の中身）に
        データを載せて送ります。Honoでは
        <code className="rounded bg-muted px-1.5 py-0.5 text-xs">await c.req.json()</code>
        で取り出せます。1で決めたとおり、受け取るのは
        <code className="rounded bg-muted px-1.5 py-0.5 text-xs">itemId</code> と
        <code className="rounded bg-muted px-1.5 py-0.5 text-xs">quantity</code>、
        返すのは冒険者の状態です。
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

  // 売り買いの処理：在庫を減らし、お金を受け取り、冒険者に渡す
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

      <h2 className="mt-10 text-xl font-bold">4. 売却API（POST /api/sell）</h2>
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

      <h2 className="mt-10 text-xl font-bold">5. 動作確認する</h2>
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

      <h2 className="mt-10 text-xl font-bold">理解度チェック</h2>
      <Quiz
        question="購入APIで「在庫チェック」と「所持金チェック」の両方を行っているのはなぜ？"
        choices={[
          "片方だけチェックすればもう片方は自動的に守られるから",
          "在庫が足りないまま購入を許すと在庫がマイナスになり、所持金が足りないまま購入を許すと所持金がマイナスになってしまうから",
          "Honoの仕様上、チェックを2つ以上書かないとエラーになるから",
        ]}
        answerIndex={1}
        explanation="在庫・所持金はそれぞれ独立した値なので、どちらか一方でもチェックを怠るとマイナスの値が生まれ、お店のデータが壊れてしまいます。"
      />

      <h2 className="mt-10 text-xl font-bold">よくあるつまずき</h2>
      <ul className="mt-3 list-disc space-y-2 pl-6 text-sm leading-relaxed">
        <li>
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">c.req.json()</code> でエラーになる
          → <code className="rounded bg-muted px-1.5 py-0.5 text-xs">-H "Content-Type: application/json"</code>
          の付け忘れが典型例です。これがないと「これはJSONだよ」と伝わりません。
        </li>
        <li>
          Windowsで「パラメーター名 'X' に一致するパラメーターが見つかりません」などのエラーが出る
          → PowerShellで実行している可能性があります。行末の
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">\</code> による改行や
          JSONの <code className="rounded bg-muted px-1.5 py-0.5 text-xs">"</code> の扱いが違うため、
          <span className="font-medium">Git Bash</span>で実行してください（03のセットアップ参照）。
        </li>
        <li>
          購入したはずなのに所持金が戻っている → ホットリロードで状態がリセットされただけです（上の「注意」参照）。
        </li>
        <li>
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">body.quantity ?? 1</code>
          の意味が分からない → 「quantityが未指定なら1」という書き方（null合体演算子）です。
        </li>
      </ul>

      <Callout variant="info" title="参考リンク">
        <ul className="list-disc space-y-1 pl-5">
          <li>
            <a
              href="https://hono.dev/docs/api/request"
              target="_blank"
              rel="noreferrer"
              className="text-primary underline-offset-4 hover:underline"
            >
              Hono 公式ドキュメント（HonoRequest：req.json など）
            </a>
          </li>
          <li>
            <a
              href="https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing"
              target="_blank"
              rel="noreferrer"
              className="text-primary underline-offset-4 hover:underline"
            >
              MDN: Null合体演算子（??）
            </a>
          </li>
        </ul>
      </Callout>

      <ProgressCheck id="s1-06-post-api" label="購入・売却APIで所持金と在庫が変わることを確認できた" />
      <NextLink current="/session1/06-post-api" />
    </div>
  );
}
