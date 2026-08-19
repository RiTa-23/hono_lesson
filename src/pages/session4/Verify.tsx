import { PageHeader } from "@/components/PageHeader";
import { Callout } from "@/components/Callout";
import { Quiz } from "@/components/Quiz";
import { ProgressCheck } from "@/components/ProgressCheck";
import { NextLink } from "@/components/NextLink";
import { CopyBlock } from "@/components/CopyBlock";

export function Verify() {
  return (
    <div>
      <PageHeader
        title="動作確認・よくあるトラブル"
        chapter="03"
        goal="本番のReact画面から実際に売り買いできる状態にし、本番特有のトラブルに対処できる"
        minutes={15}
      />

      <Callout variant="quest">
        <p>
          backendは公開できました。最後に、フロントエンド（React）を本番のbackend URLにつなぎ替えて、
          「本物のよろず屋」を完成させましょう。ここでは本番ならではのつまずきポイントをまとめて紹介します。
        </p>
      </Callout>

      <h2 className="mt-8 text-xl font-bold">1. フロントの接続先を本番backendに変える</h2>
      <p className="mt-3 leading-relaxed">
        <code className="rounded bg-muted px-1.5 py-0.5 text-xs">frontend/</code>
        側でAPIを呼んでいる箇所（<code className="rounded bg-muted px-1.5 py-0.5 text-xs">http://localhost:3000</code>
        を指定している部分）を、第4回02で確認した本番URLに変更します。
      </p>

      <h2 className="mt-10 text-xl font-bold">2. 本番のCORS設定を見直す</h2>
      <p className="mt-3 leading-relaxed">
        第1回では<code className="rounded bg-muted px-1.5 py-0.5 text-xs">cors()</code>
        （すべてのオリジンを許可）を使いましたが、本番では
        <span className="font-medium">許可するオリジンを絞る</span>のがより安全です。
      </p>
      <CopyBlock
        lang="ts"
        title="backend/src/index.ts（本番向けの例）"
        code={`app.use(
  '/api/*',
  cors({
    origin: 'https://あなたのフロントのURL.pages.dev',
  })
)`}
      />

      <h2 className="mt-10 text-xl font-bold">3. よくあるトラブルと対処</h2>
      <ul className="mt-4 space-y-4 text-sm leading-relaxed">
        <li>
          <p className="font-medium">CORSエラーが出る</p>
          <p className="mt-1">
            → <code className="rounded bg-muted px-1.5 py-0.5 text-xs">origin</code>
            に指定したURLと、実際にアクセスしているフロントのURLが1文字でも違うと弾かれます
            （末尾のスラッシュの有無なども要注意）。ブラウザのDevToolsのエラーメッセージに
            表示される実際のオリジンをコピーして確認しましょう。
          </p>
        </li>
        <li>
          <p className="font-medium">compatibility_dateに関する警告が出る</p>
          <p className="mt-1">
            → <code className="rounded bg-muted px-1.5 py-0.5 text-xs">wrangler.jsonc</code>
            の<code className="rounded bg-muted px-1.5 py-0.5 text-xs">compatibility_date</code>
            が古いままだと警告が出ることがあります。最新の日付に更新して再デプロイしましょう。
          </p>
        </li>
        <li>
          <p className="font-medium">「バインディングが見つからない」というエラーになる</p>
          <p className="mt-1">
            → <code className="rounded bg-muted px-1.5 py-0.5 text-xs">wrangler.jsonc</code>
            の<code className="rounded bg-muted px-1.5 py-0.5 text-xs">binding</code>
            名（例：<code className="rounded bg-muted px-1.5 py-0.5 text-xs">"DB"</code>）と、
            コードの<code className="rounded bg-muted px-1.5 py-0.5 text-xs">c.env.DB</code>
            の名前が一致しているか確認してください。
          </p>
        </li>
      </ul>

      <h2 className="mt-10 text-xl font-bold">4. 本番のログを見る</h2>
      <p className="mt-3 leading-relaxed">
        本番で何が起きているかは、<code className="rounded bg-muted px-1.5 py-0.5 text-xs">wrangler tail</code>
        でリアルタイムに確認できます。
      </p>
      <CopyBlock lang="bash" title="ターミナル" code={`bun wrangler tail`} />
      <p className="mt-3 leading-relaxed">
        これを実行したまま、ブラウザで購入・売却を試すと、リクエストのログが流れてくるのが見えます。
      </p>

      <h2 className="mt-10 text-xl font-bold">理解度チェック</h2>
      <Quiz
        question="本番のフロントからAPIを呼んだときにCORSエラーが出た。まず確認すべきことは？"
        choices={[
          "cors()のoriginに指定したURLと、実際にアクセスしているフロントのURLが完全に一致しているか",
          "backendのコードを全部書き直す",
          "D1データベースを作り直す",
        ]}
        answerIndex={0}
        explanation="CORSエラーの多くは、許可リストのオリジンと実際のオリジンが1文字違い（末尾のスラッシュなど）で起きます。まずはブラウザのエラーメッセージに表示される実際のオリジンを確認しましょう。"
      />

      <h2 className="mt-10 text-xl font-bold">よくあるつまずき</h2>
      <ul className="mt-3 list-disc space-y-2 pl-6 text-sm leading-relaxed">
        <li>
          フロントを本番に向けたつもりが、ビルドし直していなくて古いlocalhost向けのままだった →
          フロントも変更後は改めてビルド・デプロイし直す必要があります。
        </li>
        <li>
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">wrangler tail</code>
          を実行してもログが何も出ない → 対象のWorker名を指定していないか確認してください
          （<code className="rounded bg-muted px-1.5 py-0.5 text-xs">wrangler tail backend</code>
          のように明示できます）。
        </li>
      </ul>

      <ProgressCheck id="s4-03-verify" label="本番環境でのCORS設定・よくあるトラブルへの対処法を理解した" />
      <NextLink current="/session4/03-verify" />
    </div>
  );
}
