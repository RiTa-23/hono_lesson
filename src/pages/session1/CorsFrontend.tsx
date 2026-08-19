import { PageHeader } from "@/components/PageHeader";
import { Callout } from "@/components/Callout";
import { Quiz } from "@/components/Quiz";
import { ProgressCheck } from "@/components/ProgressCheck";
import { NextLink } from "@/components/NextLink";
import { CopyBlock } from "@/components/CopyBlock";

export function CorsFrontend() {
  return (
    <div>
      <PageHeader
        title="フロントとつなげよう（CORS）"
        chapter="07"
        goal="CORSを設定して、Reactの画面からよろず屋APIを操作できるようになっている"
        minutes={20}
      />

      <Callout variant="quest">
        <p>
          いよいよ完成間近です。できあがった倉庫とレジ（API）に、店舗の外観（React）をつなげて、
          <span className="font-medium">画面からアイテムを売り買いできるよろず屋</span>を開店させましょう。
        </p>
      </Callout>

      <h2 className="mt-8 text-xl font-bold">1. CORSとは？</h2>
      <p className="mt-3 leading-relaxed">
        フロントエンドは <code className="rounded bg-muted px-1.5 py-0.5 text-xs">localhost:5173</code>、
        バックエンドは <code className="rounded bg-muted px-1.5 py-0.5 text-xs">localhost:3000</code>。
        このように<span className="font-medium">オリジン（ドメイン＋ポート）が違う</span>場所への通信は、
        ブラウザが安全のためにデフォルトでブロックします。
      </p>
      <p className="mt-3 leading-relaxed">
        このブロックを「うちのお店は、このフロントからのアクセスなら許可します」と
        サーバー側で宣言して解除する仕組みが
        <span className="font-medium">CORS（Cross-Origin Resource Sharing）</span>です。
        Honoには組み込みのCORSミドルウェアがあります（Batteries Included！）。
      </p>

      <h2 className="mt-10 text-xl font-bold">2. CORSミドルウェアを設定する</h2>
      <p className="mt-3 leading-relaxed">
        <code className="rounded bg-muted px-1.5 py-0.5 text-xs">backend/src/index.ts</code>
        の先頭部分を、次のように書き換えます。
      </p>
      <CopyBlock
        lang="ts"
        title="backend/src/index.ts（先頭部分）"
        code={`import { Hono } from 'hono'
import { cors } from 'hono/cors'  // 追加

const app = new Hono()

// フロントエンド（別オリジン）からのアクセスを許可する
// ※ APIの定義より上に書くのがポイント
app.use('/api/*', cors())`}
      />
      <p className="mt-3 leading-relaxed">
        <code className="rounded bg-muted px-1.5 py-0.5 text-xs">app.use</code>
        は「すべてのリクエストに共通して通す関所」（ミドルウェア）を設定する書き方です。
        <code className="rounded bg-muted px-1.5 py-0.5 text-xs">/api/*</code>
        に来たリクエストには、CORSの許可ヘッダーを付けて返すようになりました。
      </p>

      <Callout variant="warn" title="書く場所に注意">
        <p>
          ミドルウェアは<span className="font-medium">APIの定義より上</span>に書きます。
          Honoは上から順に処理を積み重ねるため、下に書くと関所を通らずに窓口へ行ってしまいます。
        </p>
      </Callout>

      <h2 className="mt-10 text-xl font-bold">3. フロントエンドを起動する</h2>
      <p className="mt-3 leading-relaxed">
        バックエンドのサーバーは起動したまま、
        <span className="font-medium">新しいターミナルをもう1枚開いて</span>ください。
        そこでフロントエンドを起動します。
      </p>
      <CopyBlock
        lang="bash"
        title="ターミナル（新しい方）"
        code={`cd yorozuya/frontend
bun install
bun run dev`}
      />
      <p className="mt-3 leading-relaxed">
        起動したら
        <a
          href="http://localhost:5173"
          target="_blank"
          rel="noreferrer"
          className="text-primary underline-offset-4 hover:underline"
        >
          http://localhost:5173
        </a>
        を開きましょう。
      </p>

      <h2 className="mt-10 text-xl font-bold">4. よろず屋、開店！</h2>
      <p className="mt-3 leading-relaxed">
        画面に商品一覧が表示され、購入・売却ボタンで所持金が増減すれば完成です。
      </p>
      <ul className="mt-3 list-disc space-y-2 pl-6 text-sm leading-relaxed">
        <li>商品一覧が表示される → <code className="rounded bg-muted px-1.5 py-0.5 text-xs">GET /api/items</code> が動いている</li>
        <li>購入すると所持金が減る → <code className="rounded bg-muted px-1.5 py-0.5 text-xs">POST /api/purchase</code> が動いている</li>
        <li>売却すると所持金が（半額で）増える → <code className="rounded bg-muted px-1.5 py-0.5 text-xs">POST /api/sell</code> が動いている</li>
      </ul>
      <p className="mt-3 leading-relaxed">
        DevToolsはブラウザに内蔵された「のぞき窓」のような開発者ツールで、F12キーで開きます。
        その中のNetworkタブを開くと、画面の裏でAPIへのリクエストが飛んでいる様子が見えます。
        ぜひ覗いてみてください。
      </p>

      <Callout variant="tip" title="ここまでの仕組みを振り返る">
        <p>
          画面（React）→ リクエスト → 関所（CORS）→ 窓口（HonoのAPI）→ JSONのお返事。
          この流れが、今日作った「よろず屋のネット販売システム」の全体像です。
        </p>
      </Callout>

      <h2 className="mt-10 text-xl font-bold">理解度チェック</h2>
      <Quiz
        question="CORSの許可設定は、フロントエンドとバックエンドのどちらで行う？"
        choices={["フロントエンド（React側）", "バックエンド（Hono側）", "ブラウザの設定画面"]}
        answerIndex={1}
        explanation="CORSは「サーバー側が、どのオリジンからのアクセスを許可するか」を宣言する仕組みです。今回はHonoにcors()ミドルウェアを設定しました。"
      />

      <h2 className="mt-10 text-xl font-bold">よくあるつまずき</h2>
      <ul className="mt-3 list-disc space-y-2 pl-6 text-sm leading-relaxed">
        <li>
          画面が真っ白・「通信エラー」と出る → バックエンド（
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">bun run dev</code>
          ）が起動しているか確認。ターミナルは「backend用」「frontend用」の2枚必要です。
        </li>
        <li>
          DevToolsのコンソールに <span className="font-medium">CORS error</span> と出る
          → <code className="rounded bg-muted px-1.5 py-0.5 text-xs">app.use('/api/*', cors())</code>
          の位置（API定義より上か）と保存忘れを確認してください。
        </li>
        <li>
          購入しても画面の数字が変わらない → ホットリロードでバックエンドの状態がリセットされているだけかもしれません。
          もう一度購入してみましょう。
        </li>
        <li>
          Networkタブに <span className="font-medium">OPTIONS</span> という見慣れないリクエストが表示される
          → POSTでJSONを送るとき、ブラウザは本番のリクエストの前に「送っても大丈夫か」を確認する
          preflightリクエスト（OPTIONS）を自動で送ります。<code className="rounded bg-muted px-1.5 py-0.5 text-xs">cors()</code>
          はこれにも対応しているので、特に何もしなくて大丈夫です。
        </li>
      </ul>

      <Callout variant="info" title="参考リンク">
        <ul className="list-disc space-y-1 pl-5">
          <li>
            <a
              href="https://developer.mozilla.org/ja/docs/Web/HTTP/Guides/CORS"
              target="_blank"
              rel="noreferrer"
              className="text-primary underline-offset-4 hover:underline"
            >
              MDN: オリジン間リソース共有（CORS）
            </a>
          </li>
          <li>
            <a
              href="https://hono.dev/docs/middleware/builtin/cors"
              target="_blank"
              rel="noreferrer"
              className="text-primary underline-offset-4 hover:underline"
            >
              Hono 公式ドキュメント（CORS Middleware）
            </a>
          </li>
        </ul>
      </Callout>

      <ProgressCheck id="s1-07-cors-frontend" label="Reactの画面からアイテムの購入・売却ができた" />
      <NextLink current="/session1/07-cors-frontend" />
    </div>
  );
}
