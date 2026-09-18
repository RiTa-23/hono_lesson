import { PageHeader } from "@/components/PageHeader";
import { Callout } from "@/components/Callout";
import { Quiz } from "@/components/Quiz";
import { ProgressCheck } from "@/components/ProgressCheck";
import { NextLink } from "@/components/NextLink";
import { CopyBlock } from "@/components/CopyBlock";

export function ApiHoles() {
  return (
    <div>
      <PageHeader
        title="今のAPIの穴"
        chapter="01"
        goal="第1回で作ったAPIの弱点を実際に再現し、今回のゴール（バリデーションとテスト）を理解する"
        minutes={10}
      />

      <Callout variant="quest">
        <p>
          よろず屋のネット販売は好調ですが、第1回の終わりにこんな注意がありました。
          「quantityにマイナスの数を送られると、お金が増えてしまうかもしれません」。
          今日はまず、その穴を実際に開けてみましょう。
        </p>
      </Callout>

      <h2 className="mt-8 text-xl font-bold">1. 本当に穴が開くのか試す</h2>
      <p className="mt-3 leading-relaxed">
        バックエンドの開発サーバーを起動したまま、
        <code className="rounded bg-muted px-1.5 py-0.5 text-xs">quantity</code>
        にマイナスの数を入れて購入してみましょう。
      </p>
      <CopyBlock
        lang="bash"
        title="ターミナル"
        code={`# 所持金を確認（500Gのはず）
curl http://localhost:3000/api/player

# quantityにマイナスを指定してポーション(id:2)を「購入」
curl -X POST -H "Content-Type: application/json" \\
  -d '{"itemId": 2, "quantity": -5}' \\
  http://localhost:3000/api/purchase

# もう一度所持金を確認
curl http://localhost:3000/api/player`}
      />
      <p className="mt-3 leading-relaxed">
        所持金が<span className="font-medium">減るどころか増えて</span>いませんか？
        しかも、お店の在庫（ポーションのstock）まで増えているはずです。
      </p>

      <h2 className="mt-10 text-xl font-bold">2. なぜこうなるのか</h2>
      <p className="mt-3 leading-relaxed">
        第1回で書いたコードを振り返ってみましょう。
      </p>
      <CopyBlock
        lang="ts"
        title="backend/src/index.ts（第1回で書いたコード・抜粋）"
        code={`const quantity = body.quantity ?? 1
const total = item.price * quantity

if (item.stock < quantity) {
  return c.json({ message: '在庫が足りないよ' }, 400)
}
if (player.gold < total) {
  return c.json({ message: 'お金が足りないよ' }, 400)
}

item.stock -= quantity
player.gold -= total`}
      />
      <p className="mt-3 leading-relaxed">
        <code className="rounded bg-muted px-1.5 py-0.5 text-xs">quantity</code>
        が<code className="rounded bg-muted px-1.5 py-0.5 text-xs">-5</code>のとき、
        <code className="rounded bg-muted px-1.5 py-0.5 text-xs">total</code>
        は <code className="rounded bg-muted px-1.5 py-0.5 text-xs">50 × -5 = -250</code>
        というマイナスの値になります。すると
        <code className="rounded bg-muted px-1.5 py-0.5 text-xs">item.stock &lt; quantity</code>
        （<code className="rounded bg-muted px-1.5 py-0.5 text-xs">10 &lt; -5</code>）も
        <code className="rounded bg-muted px-1.5 py-0.5 text-xs">player.gold &lt; total</code>
        （<code className="rounded bg-muted px-1.5 py-0.5 text-xs">500 &lt; -250</code>）もどちらも
        <span className="font-medium">false</span>になり、チェックをすり抜けてしまいます。
        そして<code className="rounded bg-muted px-1.5 py-0.5 text-xs">-=</code>
        にマイナスの数を渡すと、結果的に足し算になってしまうのです。
      </p>

      <Callout variant="warn" title="quantityが文字列だったら？">
        <p>
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{'{"quantity": "abc"}'}</code>
          のような値を送ると、<code className="rounded bg-muted px-1.5 py-0.5 text-xs">item.price * quantity</code>
          は<code className="rounded bg-muted px-1.5 py-0.5 text-xs">NaN</code>になります。
          NaNはどんな比較でも<span className="font-medium">false</span>になるため、両方のチェックをすり抜けたうえ、
          在庫や所持金の値そのものがNaNで壊れてしまいます。マイナス値以上にたちが悪い問題です。
        </p>
      </Callout>

      <h2 className="mt-10 text-xl font-bold">3. 今回のゴール</h2>
      <p className="mt-3 leading-relaxed">
        「quantityは1以上の整数でなければならない」というルールを、
        <span className="font-medium">API自身に守らせる</span>
        仕組みを作ります。今回学ぶのは次の3つです。
      </p>
      <ul className="mt-3 list-disc space-y-1.5 pl-6 text-sm leading-relaxed">
        <li><span className="font-medium">zod</span> … リクエストの形を定義し、検査するライブラリ</li>
        <li>
          <span className="font-medium">@hono/zod-openapi</span> … zodのスキーマをHonoのルートに組み込み、
          さらにそのスキーマからAPI仕様書（OpenAPI）を自動生成するライブラリ。
          「ルートに組み込む」だけなら<span className="font-medium">@hono/zod-validator</span>
          という軽量なライブラリもありますが、今回は仕様書とSwagger UIまで一気に作るのでこちらを使います
        </li>
        <li><span className="font-medium">テストコード</span> … 「quantityがマイナスなら400になる」を自動で確認し続ける仕組み</li>
      </ul>

      <h2 className="mt-10 text-xl font-bold">理解度チェック</h2>
      <Quiz
        question="quantityにマイナスの数を送ると在庫・所持金チェックをすり抜けてしまうのはなぜ？"
        choices={[
          "マイナス×価格でtotalがマイナスになり、「足りない」を判定する不等号の向きと噛み合わなくなるから",
          "Honoがマイナスの数値を自動的に0に変換してしまうから",
          "curlコマンドがマイナスの値を送れない仕様だから",
        ]}
        answerIndex={0}
        explanation="item.stock < quantity や player.gold < total という比較は、quantity・totalが正の数であることを前提にしています。マイナスになると比較の結果が想定と逆になり、チェックが機能しなくなります。"
      />

      <h2 className="mt-10 text-xl font-bold">よくあるつまずき</h2>
      <ul className="mt-3 list-disc space-y-2 pl-6 text-sm leading-relaxed">
        <li>
          「見た目は動いているし、直さなくてもいいのでは？」→ 今回のように悪意のあるリクエスト（あるいは単なるバグ）で
          お店のデータが壊れてしまうのは、実際のサービスでは致命的な問題です。今のうちに直す習慣をつけましょう。
        </li>
        <li>
          「quantityを毎回if文でチェックすればいいのでは？」→ その通りですが、エンドポイントが増えるたびに同じチェックを書くのは
          抜け漏れの元になります。今回学ぶzodは、この手作業のチェックを仕組み化してくれます。
        </li>
      </ul>

      <ProgressCheck id="s2-01-intro" label="第1回のAPIに存在する穴を再現し、今回のゴールを理解した" />
      <NextLink current="/session2/01-intro" />
    </div>
  );
}
