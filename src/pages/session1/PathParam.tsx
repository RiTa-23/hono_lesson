import { PageHeader } from "@/components/PageHeader";
import { Callout } from "@/components/Callout";
import { ProgressCheck } from "@/components/ProgressCheck";
import { NextLink } from "@/components/NextLink";
import { CopyBlock } from "@/components/CopyBlock";
import { Quiz } from "@/components/Quiz";

export function PathParam() {
  return (
    <div>
      <PageHeader
        title="商品詳細と404"
        goal="GET /api/items/:id で1件の商品を返し、存在しないIDには404を返せるようになっている"
        minutes={15}
      />

      <Callout variant="quest">
        <p>
          勇者「この『エリクサー』って、どんな効果があるの？」
          商品を1つだけ詳しく教える窓口を作ります。ポイントは、
          <span className="font-medium">URLの一部（ID）を受け取る</span>ことと、
          <span className="font-medium">存在しない商品へのお返事</span>です。
        </p>
      </Callout>

      <h2 className="mt-8 text-xl font-bold">1. パスパラメータを受け取る</h2>
      <p className="mt-3 leading-relaxed">
        <code className="rounded bg-muted px-1.5 py-0.5 text-xs">/api/items/3</code>
        の「3」のように、URLの一部に入ってくる値を
        <span className="font-medium">パスパラメータ</span>と呼びます。
        Honoではパスに <code className="rounded bg-muted px-1.5 py-0.5 text-xs">:id</code>
        と書くことで、その部分を変数として受け取れます。
      </p>

      <CopyBlock
        lang="ts"
        title="backend/src/index.ts（追記）"
        code={`// 商品を1件返すAPI
app.get('/api/items/:id', (c) => {
  const id = Number(c.req.param('id'))
  const item = items.find((i) => i.id === id)

  if (!item) {
    return c.json({ message: 'そんな商品は置いてないよ' }, 404)
  }
  return c.json(item)
})`}
      />

      <p className="mt-4 leading-relaxed">新しく出てきた書き方を確認しましょう。</p>
      <ul className="mt-3 list-disc space-y-2 pl-6 text-sm leading-relaxed">
        <li>
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">c.req.param('id')</code>
          … パスパラメータを取り出します。戻り値は<span className="font-medium">文字列</span>なので、
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">Number()</code> で数値に変換しています。
        </li>
        <li>
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">items.find(...)</code>
          … 配列から条件に合う1件を探します。見つからなければ undefined になります。
        </li>
        <li>
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">c.json(data, 404)</code>
          … 第2引数でステータスコードを指定できます。存在しない商品には404を返す、というお店のルールです。
        </li>
      </ul>

      <h2 className="mt-10 text-xl font-bold">2. 動作確認する</h2>
      <CopyBlock
        lang="bash"
        title="ターミナル"
        code={`# 存在する商品（エリクサー）
curl http://localhost:3000/api/items/3

# 存在しない商品
curl http://localhost:3000/api/items/999`}
      />
      <p className="mt-3 leading-relaxed">
        1件目はエリクサーのJSON、2件目は
        <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{"{ \"message\": \"そんな商品は置いてないよ\" }"}</code>
        が返ってくればOKです。ステータスコードも確認したい場合は
        <code className="rounded bg-muted px-1.5 py-0.5 text-xs">-i</code> オプションを付けます。
      </p>
      <CopyBlock
        lang="bash"
        title="ターミナル"
        code={`curl -i http://localhost:3000/api/items/999
# 先頭行に HTTP/1.1 404 Not Found と表示される`}
      />

      <h2 className="mt-10 text-xl font-bold">3. 発展：クエリパラメータで絞り込む</h2>
      <p className="mt-3 leading-relaxed">
        <code className="rounded bg-muted px-1.5 py-0.5 text-xs">/api/items?maxPrice=100</code>
        のように <code className="rounded bg-muted px-1.5 py-0.5 text-xs">?</code> の後ろに付ける値を
        <span className="font-medium">クエリパラメータ</span>と呼びます。
        「値段で絞り込んで」といったお願いに使えます。余裕がある人は試してみましょう。
      </p>
      <CopyBlock
        lang="ts"
        title="backend/src/index.ts（発展・追記）"
        code={`// 商品一覧（?maxPrice=100 のように価格で絞り込める）
app.get('/api/items', (c) => {
  const maxPrice = c.req.query('maxPrice')
  if (maxPrice) {
    return c.json(items.filter((i) => i.price <= Number(maxPrice)))
  }
  return c.json(items)
})`}
      />
      <Callout variant="info" title="すでにあるGET /api/itemsを書き換える形になります">
        <p>
          同じエンドポイントを2つ定義すると先に書いた方が優先されるため、
          既存の <code className="rounded bg-muted px-1.5 py-0.5 text-xs">app.get('/api/items', ...)</code>
          をこのコードに置き換えてください。
        </p>
      </Callout>

      <h2 className="mt-10 text-xl font-bold">理解度チェック</h2>
      <Quiz
        question="c.req.param('id') で受け取った値をそのまま items.find((i) => i.id === id) に使うと、なぜ見つからないことがある？"
        choices={[
          "パスパラメータは文字列なので、数値のidと一致しないから",
          "findは先頭の1件しか見られないから",
          "Honoが勝手に数値に変換してくれないのはバグだから",
        ]}
        answerIndex={0}
        explanation="URLの一部として受け取る値はすべて文字列です。'3'（文字列）と 3（数値）は厳密比較（===）で一致しないため、Number() で変換します。"
      />

      <h2 className="mt-10 text-xl font-bold">よくあるつまずき</h2>
      <ul className="mt-3 list-disc space-y-2 pl-6 text-sm leading-relaxed">
        <li>
          すべてのIDで404が返る → <code className="rounded bg-muted px-1.5 py-0.5 text-xs">Number()</code>
          による変換忘れが典型例です（上のクイズ参照）。
        </li>
        <li>
          詳細のURLが商品一覧と被って動かない → Honoは上から順にマッチします。
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">/api/items/:id</code> は
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">/api/items</code> とは別パスとして扱われるので安心してください。
        </li>
      </ul>

      <ProgressCheck id="s1-05-path-param" label="GET /api/items/:id で商品詳細と404を返せた" />
      <NextLink current="/session1/05-path-param" />
    </div>
  );
}
