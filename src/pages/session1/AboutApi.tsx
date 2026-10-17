import { PageHeader } from "@/components/PageHeader";
import { Callout } from "@/components/Callout";
import { Quiz } from "@/components/Quiz";
import { ProgressCheck } from "@/components/ProgressCheck";
import { NextLink } from "@/components/NextLink";
import { CopyBlock } from "@/components/CopyBlock";
import { ApiExchangeFigure } from "@/components/figures/ApiExchangeFigure";
import { HttpAnatomyFigure } from "@/components/figures/HttpAnatomyFigure";
import { StatusCodeFigure } from "@/components/figures/StatusCodeFigure";
import { MultiClientFigure } from "@/components/figures/MultiClientFigure";
import { SecurityFigure } from "@/components/figures/SecurityFigure";

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
          冒険者「ポーションを3本ください」<br />
          店主「はいよ。150ゴールドね」<br />
          冒険者「…エリクサーって売ってる？」<br />
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
        Reactは画面（UI）を作るためのJavaScriptの道具です（詳しくは02で整理します）。
        今回の講座では、完成済みのReactアプリ（フロントエンド）からのお願いを受け取って、
        アイテムの情報を返したり、売り買いの処理をしたりする
        <span className="font-medium">バックエンド側の窓口（APIサーバー）</span>をHonoで作ります。
      </p>

      <ApiExchangeFigure />

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

      <p className="mt-4 leading-relaxed">
        1枚の「伝票」として見ると、お願いとお返事はそれぞれ次の部品でできています。
        この後の3つの見出しで、部品を1つずつ見ていきます。
      </p>
      <HttpAnatomyFigure />

      <h3 className="mt-8 text-lg font-semibold">HTTPメソッド = お願いの種類</h3>
      <p className="mt-2 leading-relaxed">
        「見せて」（取得）は <span className="font-medium">GET</span>、
        「これを処理して」（登録・購入など）は <span className="font-medium">POST</span> が代表的です。
        ほかにも PUT（更新）・DELETE（削除）などがありますが、第1回ではこの2つだけ使います。
      </p>

      <h3 className="mt-8 text-lg font-semibold">JSON = やりとりの伝票</h3>
      <p className="mt-2 leading-relaxed">
        リクエストとレスポンスの中身（データ）は、JSONという書き方でやりとりするのが一般的です。
        JavaScriptのオブジェクトに似た形をしているので、フロントエンドとの相性が抜群です
        （JavaScriptはWebブラウザで動くプログラミング言語。詳しくは02で整理します）。
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
      <StatusCodeFigure />

      <h2 className="mt-10 text-xl font-bold">なぜ画面とデータを分けるの？</h2>
      <p className="mt-3 leading-relaxed">
        画面の中に商品データや計算処理を全部書いてしまうこともできます。
        それでもわざわざAPIという窓口を挟んで、フロントエンド（見た目）とバックエンド（データ・計算）を分けるのには、
        いくつかの理由があります。
      </p>

      <h3 className="mt-8 text-lg font-semibold">1. 大事なものを店の奥にしまえる（セキュリティ）</h3>
      <p className="mt-2 leading-relaxed">
        フロントエンドのコードは、冒険者のブラウザにダウンロードされてから動きます。
        つまり<span className="font-medium">冒険者の手元にあるもの</span>です。
        ブラウザの開発者ツールを使えば誰でも中身を読めますし、
        APIへ送るお願いの中身を書き換えたり、curlで直接お願いを送ったりすることもできます。
      </p>
      <p className="mt-3 leading-relaxed">
        だから、データベースのパスワードのような秘密の情報や、値段・所持金の計算といった
        <span className="font-medium">ごまかされては困る処理は、サーバー（店の奥）に置きます</span>。
        画面側の入力チェックは「うっかりミスを防ぐ親切」にすぎません。
        最後の判断は必ずサーバーで行います。
      </p>
      <SecurityFigure />
      <Callout variant="warn" title="サーバーに置いても、チェックを忘れると穴が開く">
        <p>
          この講座の購入APIは、冒険者から「どれを・いくつ」だけを受け取り、値段はサーバー側で計算します。
          ただし、届いた個数そのものを疑わないと、マイナスの個数で所持金が増える穴が残ります。
          第2回では、この穴を実際に開けてからふさぎます。
        </p>
      </Callout>

      <h3 className="mt-8 text-lg font-semibold">2. 画面がいくつ増えても使い回せる</h3>
      <p className="mt-2 leading-relaxed">
        画面を作り替えても、データの仕組みはそのまま使い回せます。
        よろず屋が将来「スマホアプリ」や「魔王城向け特別窓口」を出店しても、
        同じAPIを呼ぶだけで済みます。
      </p>
      <MultiClientFigure />

      <h3 className="mt-8 text-lg font-semibold">3. 窓口の約束さえ守れば、別々に作り替えられる</h3>
      <p className="mt-2 leading-relaxed">
        「このURLにこう頼めば、こういうJSONが返る」という約束（API）さえ変えなければ、
        画面とサーバーはお互いを気にせず作り替えられます。
      </p>
      <ul className="mt-3 list-disc space-y-1.5 pl-6 text-sm leading-relaxed">
        <li>フロント担当とバックエンド担当が、約束を決めたあとは同時に作業を進められる</li>
        <li>値段の計算ミスなどをサーバー側で直せば、アプリを入れ直してもらわなくても全員にすぐ反映される</li>
        <li>
          第3回では、データの置き場所をメモリからデータベースに差し替えます。
          URLとレスポンスの形を変えないので、画面側は一切書き換えません
        </li>
      </ul>

      <Callout variant="tip" title="ひとことで言うと">
        <p>
          画面は「冒険者に見せる店頭」、サーバーは「店主しか入れない店の奥」。
          APIはその間にある<span className="font-medium">ただ1つの窓口</span>です。
          窓口を1つにしぼるから、守りやすく、使い回しやすく、作り替えやすくなります。
        </p>
      </Callout>

      <h2 className="mt-10 text-xl font-bold">理解度チェック</h2>
      <Quiz
        question="冒険者が「ポーションを1本買いたい」とき、APIへのお願いとして適切なのはどれ？"
        choices={[
          "GET /api/purchase",
          "POST /api/purchase",
          "DELETE /api/items",
        ]}
        answerIndex={1}
        explanation="「購入する」はデータを書き換えるお願いなのでPOSTを使います。GETは「見せて」、DELETEは「消して」の合図です。"
      />
      <Quiz
        question="冒険者が売っていない「まほうのじゅうたん」を GET /api/items/50 でリクエストしたとき、返ってくるステータスコードとして適切なのはどれ？"
        choices={["200", "404", "500"]}
        answerIndex={1}
        explanation="「指定されたものが存在しない」ことを表すのは404です。500は「サーバー側で予期しないトラブルが起きた」ときに使うもので、意味が異なります。"
      />
      <Quiz
        question="購入するときの合計金額（値段×個数）は、どこで計算するのが安全？"
        choices={[
          "ブラウザで計算して、合計金額をAPIに送る",
          "APIには「どれを・いくつ」だけ送り、サーバーで計算する",
          "どちらでも同じ",
        ]}
        answerIndex={1}
        explanation="ブラウザで計算した金額は、冒険者が開発者ツールなどで書き換えられます。値段はサーバーが持つデータで計算すれば、ごまかしようがありません。"
      />

      <h2 className="mt-10 text-xl font-bold">よくあるつまずき</h2>
      <ul className="mt-3 list-disc space-y-2 pl-6 text-sm leading-relaxed">
        <li>
          「APIって難しそう…」→ 中身は「お願いに応答を返すだけ」のシンプルな仕組みです。実際に手を動かすのが一番の近道です。
        </li>
        <li>
          GETとPOSTの使い分けに迷う → 「画面に表示するための取得」ならGET、「お店の状態を変える（在庫・所持金など）」ならPOST、と考えると整理しやすいです。
        </li>
        <li>
          ステータスコードの種類が多すぎて覚えきれない → 実際は数十種類ありますが、全部を暗記する必要はありません。まずは200（成功）・400（お願いの中身がおかしい）・404（そもそも無い）・500（お店側のトラブル）の4つをまず押さえれば十分です。細かい種類は必要になったときに調べれば大丈夫です。
        </li>
      </ul>

      <Callout variant="info" title="参考リンク">
        <ul className="list-disc space-y-1 pl-5">
          <li>
            <a
              href="https://developer.mozilla.org/ja/docs/Web/HTTP/Overview"
              target="_blank"
              rel="noreferrer"
              className="text-primary underline-offset-4 hover:underline"
            >
              MDN: HTTP の概要
            </a>
          </li>
          <li>
            <a
              href="https://developer.mozilla.org/ja/docs/Web/HTTP/Reference/Status"
              target="_blank"
              rel="noreferrer"
              className="text-primary underline-offset-4 hover:underline"
            >
              MDN: HTTP レスポンスステータスコード一覧
            </a>
          </li>
        </ul>
      </Callout>

      <ProgressCheck id="s1-01-about-api" label="APIの基本（リクエスト・レスポンス・JSON・ステータスコード）を理解した" />
      <NextLink current="/session1/01-about-api" />
    </div>
  );
}
