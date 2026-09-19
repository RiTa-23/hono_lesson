import { PageHeader } from "@/components/PageHeader";
import { Callout } from "@/components/Callout";
import { Quiz } from "@/components/Quiz";
import { ProgressCheck } from "@/components/ProgressCheck";
import { NextLink } from "@/components/NextLink";
import { CopyBlock } from "@/components/CopyBlock";

export function Testing() {
  return (
    <div>
      <PageHeader
        title="テストコードを書こう"
        chapter="05"
        goal="hono/testingのtestClientを使い、購入APIの正常系・異常系をテストコードで確認できるようになっている"
        minutes={20}
      />

      <Callout variant="quest">
        <p>
          ここまで「curlで手動確認」を繰り返してきましたが、機能が増えるたびに毎回手で確認するのは大変です。
          「quantityがマイナスなら400になる」を、コードを直すたびに自動でチェックしてくれる仕組みを作りましょう。
        </p>
      </Callout>

      <h2 className="mt-8 text-xl font-bold">1. テストファイルを作る</h2>
      <p className="mt-3 leading-relaxed">
        Bunにはテストランナーが内蔵されているので、追加のインストールは不要です。
        Honoにも<code className="rounded bg-muted px-1.5 py-0.5 text-xs">hono/testing</code>
        というテスト用のヘルパーが用意されています。
        テストしたいのは売り買いのAPIなので、その隣に
        <code className="rounded bg-muted px-1.5 py-0.5 text-xs">backend/src/routes/trade.test.ts</code>
        を新規作成してください（Bunは<code className="rounded bg-muted px-1.5 py-0.5 text-xs">.test.ts</code>
        で終わるファイルを自動的にテストとして見つけてくれます）。
      </p>
      <CopyBlock
        lang="ts"
        title="backend/src/routes/trade.test.ts（新規作成）"
        code={`import { describe, expect, it } from 'bun:test'
import { testClient } from 'hono/testing'
import { tradeApp } from './trade'

const client = testClient(tradeApp)

describe('POST /api/purchase', () => {
  it('正常に購入できる', async () => {
    const res = await client.api.purchase.$post({
      json: { itemId: 2, quantity: 1 },
    })

    expect(res.status).toBe(200)
    const player = await res.json()
    // 500G でポーション（50G）を1本買ったので 450G になり、所持品に加わる
    expect(player).toMatchObject({ gold: 450, items: [{ itemId: 2, quantity: 1 }] })
  })

  it('quantityがマイナスだと400になる', async () => {
    const res = await client.api.purchase.$post({
      json: { itemId: 2, quantity: -5 },
    })

    expect(res.status).toBe(400)
  })

  it('存在しないitemIdだと404になる', async () => {
    const res = await client.api.purchase.$post({
      json: { itemId: 999, quantity: 1 },
    })

    expect(res.status).toBe(404)
  })
})`}
      />

      <h2 className="mt-10 text-xl font-bold">2. コードを読み解く</h2>
      <ul className="mt-3 list-disc space-y-2 pl-6 text-sm leading-relaxed">
        <li>
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">testClient(tradeApp)</code>
          … Honoアプリを直接テストするためのクライアントです。
          <span className="font-medium">開発サーバーを起動していなくても</span>動きます（サーバーを経由せず、
          アプリの処理を直接呼び出しているため）。ファイルを分けたおかげで、
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">index.ts</code>
          全体ではなく「売り買いのAPI」だけを切り出してテストできます。
        </li>
        <li>
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">client.api.purchase.$post(...)</code>
          … パス（<code className="rounded bg-muted px-1.5 py-0.5 text-xs">/api/purchase</code>）が
          そのままメソッドチェーンの形で補完されます。
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">tradeApp</code>
          を<code className="rounded bg-muted px-1.5 py-0.5 text-xs">.openapi(...).openapi(...)</code>
          とチェーンで書いたので、パスもリクエストの形も1つの型にまとまっているためです。
        </li>
        <li>
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">toMatchObject({'{...}'})</code>
          … 「レスポンスにこのキーと値が含まれている」を確認します。
          テストは上から順に実行されるので、1つ目のテストで買った結果（450G・ポーション1本）をそのまま検証しています。
        </li>
        <li>
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">describe</code> /
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">it</code> /
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">expect</code>
          … 「〜について」「〜のとき」「〜であるはず」を表すテストの基本の3点セットです。
        </li>
      </ul>

      <h2 className="mt-10 text-xl font-bold">3. 実行する</h2>
      <CopyBlock lang="bash" title="ターミナル（backendディレクトリで）" code={`bun test`} />
      <p className="mt-3 leading-relaxed">
        3つのテストがすべて緑色（PASS）になれば成功です。試しに、
        わざと<code className="rounded bg-muted px-1.5 py-0.5 text-xs">item.stock &lt; quantity</code>
        の不等号を反対にするなど、コードを壊してもう一度<code className="rounded bg-muted px-1.5 py-0.5 text-xs">bun test</code>
        を実行してみましょう。テストが赤く（FAIL）なり、壊れたことにすぐ気づけるはずです。
      </p>

      <Callout variant="info" title="package.jsonにも登録しておこう">
        <p>
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">package.json</code>
          の<code className="rounded bg-muted px-1.5 py-0.5 text-xs">scripts</code>
          に<code className="rounded bg-muted px-1.5 py-0.5 text-xs">{'"test": "bun test"'}</code>
          を追加しておくと、<code className="rounded bg-muted px-1.5 py-0.5 text-xs">bun run test</code>
          でも実行できるようになり、他の講座資料（第1回のフロント側）と揃った呼び出し方になります。
        </p>
      </Callout>

      <h2 className="mt-10 text-xl font-bold">理解度チェック</h2>
      <Quiz
        question="testClient(app) を使ったテストを実行するために、事前に bun run dev で開発サーバーを起動しておく必要はある？"
        choices={[
          "不要。testClientはHonoアプリの処理を直接呼び出すので、サーバー起動は必要ない",
          "必要。サーバーが起動していないとリクエストを送れない",
          "必要だが、ポート番号だけ一致していればよい",
        ]}
        answerIndex={0}
        explanation="testClientは実際にHTTP通信をするのではなく、Honoアプリのルーティング処理を直接呼び出します。そのため開発サーバーの起動有無に関わらずbun testだけで完結します。"
      />

      <h2 className="mt-10 text-xl font-bold">よくあるつまずき</h2>
      <ul className="mt-3 list-disc space-y-2 pl-6 text-sm leading-relaxed">
        <li>
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">client.api.purchase.$post</code>
          が補完されない・<code className="rounded bg-muted px-1.5 py-0.5 text-xs">client</code>
          が<code className="rounded bg-muted px-1.5 py-0.5 text-xs">unknown</code>型になる →
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">tradeApp</code>
          がチェーン（<code className="rounded bg-muted px-1.5 py-0.5 text-xs">new OpenAPIHono().openapi(...).openapi(...)</code>
          ）で書かれているか確認しましょう。<code className="rounded bg-muted px-1.5 py-0.5 text-xs">tradeApp.openapi(...)</code>
          を1文ずつ並べた書き方だと、型がまとまらず補完が効きません。
        </li>
        <li>
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">import {'{ tradeApp }'} from './trade'</code>
          でエラーになる → <code className="rounded bg-muted px-1.5 py-0.5 text-xs">routes/trade.ts</code>
          で<code className="rounded bg-muted px-1.5 py-0.5 text-xs">export const tradeApp</code>
          と書いているか、テストファイルを<code className="rounded bg-muted px-1.5 py-0.5 text-xs">routes/</code>
          の中に置いているかを確認してください。
        </li>
        <li>
          2回目以降の<code className="rounded bg-muted px-1.5 py-0.5 text-xs">bun test</code>
          でも同じ結果になる？ → なります。テストのたびにファイルが読み直され、
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">data.ts</code>
          の所持金は毎回500Gから始まります。
        </li>
      </ul>

      <ProgressCheck id="s2-05-testing" label="testClientで購入APIの正常系・異常系のテストを書けた" />
      <NextLink current="/session2/05-testing" />
    </div>
  );
}
