import { PageHeader } from "@/components/PageHeader";
import { Callout } from "@/components/Callout";
import { Quiz } from "@/components/Quiz";
import { ProgressCheck } from "@/components/ProgressCheck";
import { NextLink } from "@/components/NextLink";

export function AboutHono() {
  return (
    <div>
      <PageHeader
        title="Honoとは？"
        chapter="02"
        goal="Honoの特徴と、今回の講座でHonoを使う理由を説明できるようになる"
        minutes={10}
      />

      <h2 className="text-xl font-bold">Hono = 国産の軽量Webフレームワーク</h2>
      <p className="mt-3 leading-relaxed">
        Hono（ほの）は、日本人エンジニアの
        <a
          href="https://github.com/yusukebe"
          target="_blank"
          rel="noreferrer"
          className="text-primary underline-offset-4 hover:underline"
        >
          和田裕介（yusukebe）さん
        </a>
        が開発した、TypeScript / JavaScript製のWebアプリケーションフレームワークです。
        名前は日本語の「炎（ほのお）」に由来し
        （<a
          href="https://hono.dev/docs/concepts/motivation"
          target="_blank"
          rel="noreferrer"
          className="text-primary underline-offset-4 hover:underline"
        >
          公式ドキュメント
        </a>
        参照）、もともとCloudflare Workers上で動く
        良いフレームワークがなかったことから生まれました。
      </p>

      <h2 className="mt-10 text-xl font-bold">言葉を整理しよう</h2>
      <p className="mt-3 leading-relaxed">
        ここから先でよく出てくる言葉を、先にまとめておきます。
        すべて覚える必要はなく、「なんとなくの役割」が分かれば十分です。
      </p>
      <div className="mt-4 overflow-hidden rounded-lg border">
        <table className="w-full text-sm">
          <thead className="border-b border-gold bg-secondary/60 font-serif">
            <tr>
              <th className="px-4 py-2 text-left font-medium">言葉</th>
              <th className="px-4 py-2 text-left font-medium">ざっくりした説明</th>
              <th className="px-4 py-2 text-left font-medium">登場する場面</th>
            </tr>
          </thead>
          <tbody className="[&>tr]:border-t">
            <tr>
              <td className="px-4 py-2 font-medium">JavaScript</td>
              <td className="px-4 py-2">Webブラウザで動くプログラミング言語。今ではサーバー側でも広く使われています。</td>
              <td className="px-4 py-2">今回書くAPIのコードそのもの</td>
            </tr>
            <tr>
              <td className="px-4 py-2 font-medium">TypeScript</td>
              <td className="px-4 py-2">JavaScriptに「型（データの種類）のチェック」を足した言語。書いたコードはJavaScriptに変換されて動きます。</td>
              <td className="px-4 py-2">今回のAPIコード（.ts ファイル）</td>
            </tr>
            <tr>
              <td className="px-4 py-2 font-medium">Node.js</td>
              <td className="px-4 py-2">ブラウザの外でJavaScriptを動かすための実行環境。昔からよく使われています。</td>
              <td className="px-4 py-2">HonoやExpressが動く土台の代表例</td>
            </tr>
            <tr>
              <td className="px-4 py-2 font-medium">Bun</td>
              <td className="px-4 py-2">Node.jsより高速な新しい実行環境。インストールやテストもまとめてこなせます。</td>
              <td className="px-4 py-2">第1・2回でAPIを動かす環境</td>
            </tr>
            <tr>
              <td className="px-4 py-2 font-medium">Cloudflare Workers</td>
              <td className="px-4 py-2">Cloudflare社が提供する、世界中のサーバー上でコードを動かせる実行環境。</td>
              <td className="px-4 py-2">第3回・第4回（本番デプロイ）</td>
            </tr>
            <tr>
              <td className="px-4 py-2 font-medium">RPC</td>
              <td className="px-4 py-2">APIの関数を、まるで隣のファイルを呼ぶように使えるHonoの機能。フロントと型を共有できます。</td>
              <td className="px-4 py-2">まとめページのサブクエスト</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 className="mt-10 text-xl font-bold">ExpressではなくHonoを選ぶ理由</h2>
      <p className="mt-3 leading-relaxed">
        Node.jsの世界で昔からよく使われているフレームワークにExpressがあります。
        Expressは「必要な機能はすべてプラグインとして追加する」という思想の、
        とてもミニマルなフレームワークです。自由度が高い反面、
        <span className="font-medium">
          「広大な平原に降ろされて『はい、お店を建ててください！』と言われる」
        </span>
        ような心もと無さを感じることがあります。
      </p>
      <p className="mt-3 leading-relaxed">
        一方Honoの公式サイトには、こう書かれています。
      </p>

      <blockquote className="mt-4 rounded-lg border-l-4 border-primary bg-primary/5 px-4 py-3 text-sm leading-relaxed">
        Batteries Included —— 必要なものは全部入り。
        Honoには組み込みミドルウェア、カスタムミドルウェア、サードパーティ製ミドルウェア、
        ヘルパーが揃っています。
      </blockquote>

      <ul className="mt-4 list-disc space-y-2 pl-6 text-sm leading-relaxed">
        <li>ルーティング・JSONレスポンス・CORSなど、必要な機能が最初から入っている</li>
        <li>TypeScriptとの相性が抜群（型補完がしっかり効く）</li>
        <li>基本的な書き方がExpressとほぼ同じで、学習コストが低い</li>
        <li>
          Cloudflare Workers・Bun・Node.js・Denoなど、
          <span className="font-medium">どの実行環境でも同じコードが動く</span>
        </li>
      </ul>

      <Callout variant="tip" title="第3回への伏線">
        <p>
          「どの実行環境でも同じコードが動く」は大きなポイントです。
          第1・2回ではBunで動かし、第3回でCloudflare Workersにデプロイしますが、
          APIのコード自体はほぼ書き換えずに動かせます。
        </p>
      </Callout>

      <h2 className="mt-10 text-xl font-bold">Honoの書き味（予告）</h2>
      <p className="mt-3 leading-relaxed">
        HonoのAPIは、このように書きます。「パス」と「メソッド」と「処理」を並べるだけ、という
        分かりやすさが魅力です。
      </p>

      <div className="my-4 overflow-hidden rounded-sm border border-gold/40 bg-[#2b2118] text-[#f0e6d2]">
        <div className="border-b border-gold/25 px-4 py-2 font-serif text-xs font-bold tracking-wider text-gold">src/index.ts</div>
        <pre className="p-4 text-sm leading-relaxed">
          <code>{`import { Hono } from 'hono'

const app = new Hono()

// GET /api/items へのお返事
app.get('/api/items', (c) => {
  return c.json([{ id: 1, name: 'ポーション', price: 50 }])
})

export default app`}</code>
        </pre>
      </div>

      <ul className="mt-3 list-disc space-y-2 pl-6 text-sm leading-relaxed">
        <li>
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">app.get(パス, 処理)</code> … GETリクエストを受け付ける窓口を作る
        </li>
        <li>
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">c</code>（コンテキスト）… リクエストの中身を取り出したり、レスポンスを返したりするための入れ物
        </li>
        <li>
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">c.json(...)</code> … JSON形式でレスポンスを返す
        </li>
        <li>
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">import</code>
          は「ほかのファイルやライブラリから部品を取り込む」宣言です。
          1行目は <code className="rounded bg-muted px-1.5 py-0.5 text-xs">'hono'</code> という
          ライブラリから、Hono本体を取り込んでいます
        </li>
      </ul>

      <h2 className="mt-10 text-xl font-bold">理解度チェック</h2>
      <Quiz
        question="Honoの特徴「Batteries Included」の意味として正しいものはどれ？"
        choices={[
          "電池で動作する軽量フレームワークである",
          "必要な機能が最初から揃っていて、追加インストールが少なくて済む",
          "バッテリー消費が少ない設計になっている",
        ]}
        answerIndex={1}
        explanation="「必要なものは全部入り」という意味の慣用句です。CORSやJSONなど、今回使う機能もHonoに内蔵されています。"
      />

      <h2 className="mt-10 text-xl font-bold">よくあるつまずき</h2>
      <ul className="mt-3 list-disc space-y-2 pl-6 text-sm leading-relaxed">
        <li>
          「フレームワークって何？」→ APIサーバーを作るための土台セットです。生のNode.jsだけでも作れますが、ルーティングやJSONの扱いを毎回自前で書くことになります。
        </li>
        <li>
          HonoとBunの関係が混ざる → BunはJavaScriptを「実行する環境」、Honoはその上で動く「APIの土台」です。料理で言えば、Bunが厨房、Honoが調理器具セットのイメージです。
        </li>
        <li>
          「実行環境ごとにコードを書き換える必要があるのでは？」→ 基本的なAPIのコード（<code className="rounded bg-muted px-1.5 py-0.5 text-xs">app.get</code> や <code className="rounded bg-muted px-1.5 py-0.5 text-xs">c.json</code> など）はどの実行環境でも共通です。書き換えが必要なのは、サーバーを起動する末尾の数行だけです。
        </li>
      </ul>

      <Callout variant="info" title="参考リンク">
        <ul className="list-disc space-y-1 pl-5">
          <li>
            <a href="https://hono.dev/" target="_blank" rel="noreferrer" className="text-primary underline-offset-4 hover:underline">
              Hono 公式サイト
            </a>
          </li>
          <li>
            <a
              href="https://hono.dev/docs/"
              target="_blank"
              rel="noreferrer"
              className="text-primary underline-offset-4 hover:underline"
            >
              公式ドキュメント（Getting Started）
            </a>
          </li>
          <li>
            <a
              href="https://zenn.dev/yuzunosk55/articles/09275c72cf051b"
              target="_blank"
              rel="noreferrer"
              className="text-primary underline-offset-4 hover:underline"
            >
              参考記事：TypeScript初心者の私がHonoでバックエンドサーバー構築してみた（Zenn）
            </a>
          </li>
        </ul>
      </Callout>

      <ProgressCheck id="s1-02-about-hono" label="Honoの特徴と選定理由を理解した" />
      <NextLink current="/session1/02-about-hono" />
    </div>
  );
}
