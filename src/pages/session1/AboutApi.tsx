import { PageHeader } from "@/components/PageHeader";
import { Callout } from "@/components/Callout";
import { Quiz } from "@/components/Quiz";
import { ProgressCheck } from "@/components/ProgressCheck";
import { NextLink } from "@/components/NextLink";
import { CopyBlock } from "@/components/CopyBlock";

export function AboutApi() {
  return (
    <div>
      <PageHeader
        title="APIとは？"
        chapter="01"
        goal="API・リクエスト・レスポンスの関係を、よろず屋のやりとりに例えて説明できるようになる"
        minutes={10}
      />

      <Callout variant="quest">
        <p>
          よろず屋の店頭では、こんなやりとりが毎日行われています。
        </p>
        <p className="mt-2 border-l-4 border-primary/40 pl-3">
          勇者「ポーションを3本ください」<br />
          店主「はいよ。150ゴールドね」<br />
          勇者「…エリクサーって売ってる？」<br />
          店主「残念、品切れだよ」
        </p>
        <p className="mt-2">
          実はこれがそのままAPIの姿です。<span className="font-medium">「お願い（リクエスト）」に「お返事（レスポンス）」を返す</span>、
          ただそれだけの仕組みなのです。
        </p>
      </Callout>

      <h2 className="mt-8 text-xl font-bold">API = 店頭の窓口</h2>
      <p className="mt-3 leading-relaxed">
        API（Application Programming Interface）は、
        <span className="font-medium">プログラム同士がやりとりするための窓口</span>のことです。
        Webの世界では、フロントエンド（画面）がバックエンド（サーバー）に対して
        HTTPというルールでお願いを送り、結果を受け取ります。
      </p>
      <p className="mt-3 leading-relaxed">
        今回の講座では、完成済みのReactアプリ（フロントエンド）からのお願いを受け取って、
        アイテムの情報を返したり、売り買いの処理をしたりする
        <span className="font-medium">バックエンド側の窓口（APIサーバー）</span>をHonoで作ります。
      </p>

      <h2 className="mt-10 text-xl font-bold">リクエストとレスポンス</h2>
      <p className="mt-3 leading-relaxed">
        店頭のやりとりをAPIの言葉に翻訳すると、こうなります。
      </p>

      <div className="mt-4 overflow-hidden rounded-lg border">
        <table className="w-full text-sm">
          <thead className="border-b border-gold bg-secondary/60 font-serif">
            <tr>
              <th className="px-4 py-2 text-left font-medium">店頭でのやりとり</th>
              <th className="px-4 py-2 text-left font-medium">APIの世界</th>
            </tr>
          </thead>
          <tbody className="[&>tr]:border-t">
            <tr>
              <td className="px-4 py-2">「商品一覧を見せて」</td>
              <td className="px-4 py-2">
                <code className="rounded bg-muted px-1.5 py-0.5 text-xs">GET /api/items</code>
              </td>
            </tr>
            <tr>
              <td className="px-4 py-2">「はい、どうぞ」（商品の棚を見せる）</td>
              <td className="px-4 py-2">JSON形式のデータ + ステータス 200</td>
            </tr>
            <tr>
              <td className="px-4 py-2">「ポーションを1本ください」</td>
              <td className="px-4 py-2">
                <code className="rounded bg-muted px-1.5 py-0.5 text-xs">POST /api/purchase</code>
              </td>
            </tr>
            <tr>
              <td className="px-4 py-2">「そんな商品はないよ」</td>
              <td className="px-4 py-2">エラーのJSON + ステータス 404</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3 className="mt-8 text-lg font-semibold">HTTPメソッド = お願いの種類</h3>
      <p className="mt-2 leading-relaxed">
        「見せて」（取得）は <span className="font-medium">GET</span>、
        「これを処理して」（登録・購入など）は <span className="font-medium">POST</span> が代表的です。
        ほかにも PUT（更新）・DELETE（削除）などがありますが、第1回ではこの2つだけ使います。
      </p>

      <h3 className="mt-8 text-lg font-semibold">JSON = やりとりの伝票</h3>
      <p className="mt-2 leading-relaxed">
        リクエストとレスポンスの中身（データ）は、JSONという書き方でやりとりするのが一般的です。
        JavaScriptのオブジェクトに似た形をしているので、フロントエンドとの相性が抜群です。
      </p>
      <CopyBlock
        lang="json"
        title="レスポンスの例（GET /api/items）"
        code={`[
  { "id": 1, "name": "やくそう",   "price": 8,  "stock": 99, "description": "HPを少量回復する" },
  { "id": 2, "name": "ポーション", "price": 50, "stock": 10, "description": "HPを大きく回復する" }
]`}
      />

      <h3 className="mt-8 text-lg font-semibold">ステータスコード = 結果の合図</h3>
      <p className="mt-2 leading-relaxed">
        レスポンスには3桁の数字（ステータスコード）が付いていて、結果の種類を表します。
      </p>
      <ul className="mt-3 list-disc space-y-1.5 pl-6 text-sm leading-relaxed">
        <li>
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">200</code> … 成功（「はい、どうぞ」）
        </li>
        <li>
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">400</code> … お願いの内容がおかしい（「何を買いたいか分からないよ」）
        </li>
        <li>
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">404</code> … 指定されたものが存在しない（「そんな商品は置いてないよ」）
        </li>
        <li>
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">500</code> … サーバー側のトラブル（「店が大変なことに…」）
        </li>
      </ul>

      <Callout variant="tip" title="なぜ画面とデータを分けるの？">
        <p>
          フロントエンド（見た目）とバックエンド（データ・計算）を分けると、
          画面を作り替えてもデータの仕組みはそのまま使い回せます。
          よろず屋が将来「スマホアプリ」や「魔王城向け特別窓口」を出店しても、
          同じAPIを呼ぶだけで済むのです。
        </p>
      </Callout>

      <h2 className="mt-10 text-xl font-bold">理解度チェック</h2>
      <Quiz
        question="勇者が「ポーションを1本買いたい」とき、APIへのお願いとして適切なのはどれ？"
        choices={[
          "GET /api/purchase",
          "POST /api/purchase",
          "DELETE /api/items",
        ]}
        answerIndex={1}
        explanation="「購入する」はデータを書き換えるお願いなのでPOSTを使います。GETは「見せて」、DELETEは「消して」の合図です。"
      />

      <h2 className="mt-10 text-xl font-bold">よくあるつまずき</h2>
      <ul className="mt-3 list-disc space-y-2 pl-6 text-sm leading-relaxed">
        <li>
          「APIって難しそう…」→ 中身は「お願いに応答を返すだけ」のシンプルな仕組みです。実際に手を動かすのが一番の近道です。
        </li>
        <li>
          GETとPOSTの使い分けに迷う → 「画面に表示するための取得」ならGET、「お店の状態を変える（在庫・所持金など）」ならPOST、と考えると整理しやすいです。
        </li>
      </ul>

      <ProgressCheck id="s1-01-about-api" label="APIの基本（リクエスト・レスポンス・JSON・ステータスコード）を理解した" />
      <NextLink current="/session1/01-about-api" />
    </div>
  );
}
