import { PageHeader } from "@/components/PageHeader";
import { Callout } from "@/components/Callout";
import { Quiz } from "@/components/Quiz";
import { ProgressCheck } from "@/components/ProgressCheck";
import { NextLink } from "@/components/NextLink";
import { CopyBlock } from "@/components/CopyBlock";
import { Badge } from "@/components/ui/badge";

export function TestingWithD1() {
  return (
    <div>
      <Badge variant="secondary" className="mb-4">
        サブクエスト（本編の進行には含まれません）
      </Badge>
      <PageHeader
        title="第2回のテストをD1対応にする"
        goal="第2回で書いたテストが落ちる理由を説明でき、テスト用のD1を渡して bun test を再び全部緑にできている"
        minutes={20}
      />

      <Callout variant="info" title="第3回を最後まで終えた人向けです">
        <p>
          このサブクエストは、第3回の依頼No.07（purchase/sellをDB更新処理に書き換える）までが
          終わっていることを前提にしています。本編の第4回に進むだけなら、やらなくても困りません。
        </p>
      </Callout>

      <Callout variant="quest">
        <p>
          第3回でAPIの書き換えは完了しましたが、まだ片付いていないものが1つあります。
          第2回で書いた<code className="rounded bg-muted px-1.5 py-0.5 text-xs">trade.test.ts</code>
          です。ためしに<code className="rounded bg-muted px-1.5 py-0.5 text-xs">bun test</code>
          を実行してみてください。<span className="font-medium">赤く落ちているはずです。</span>
          これを直すのが、このサブクエストの依頼です。
        </p>
      </Callout>

      <h2 className="mt-8 text-xl font-bold">1. なぜ落ちるのかを確かめる</h2>
      <CopyBlock lang="bash" title="ターミナル（backendディレクトリで）" code={`bun test`} />
      <p className="mt-3 leading-relaxed">
        3件のうち<span className="font-medium">2件が失敗し、1件だけ通る</span>という結果になります。
        この「1件だけ通る」のがヒントです。
      </p>
      <div className="mt-4 overflow-hidden rounded-lg border">
        <table className="w-full text-sm">
          <thead className="border-b border-gold bg-secondary/60 font-serif">
            <tr>
              <th className="px-4 py-2 text-left font-medium">第2回で書いたテスト</th>
              <th className="px-4 py-2 text-left font-medium">結果</th>
              <th className="px-4 py-2 text-left font-medium">理由</th>
            </tr>
          </thead>
          <tbody className="[&>tr]:border-t">
            <tr>
              <td className="px-4 py-2">正常に購入できる（200を期待）</td>
              <td className="px-4 py-2 font-medium text-destructive">500で失敗</td>
              <td className="px-4 py-2">DBを読もうとして落ちる</td>
            </tr>
            <tr>
              <td className="px-4 py-2">quantityがマイナスだと400</td>
              <td className="px-4 py-2 font-medium">通る</td>
              <td className="px-4 py-2">
                zodがハンドラに入る<span className="font-medium">前</span>に弾くので、DBに触らない
              </td>
            </tr>
            <tr>
              <td className="px-4 py-2">存在しないitemIdだと404</td>
              <td className="px-4 py-2 font-medium text-destructive">500で失敗</td>
              <td className="px-4 py-2">404を返す前にDBを引いているので</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="mt-4 leading-relaxed">
        ターミナルには次のようなエラーが出ています。
      </p>
      <CopyBlock
        lang="bash"
        title="bun test の出力（抜粋）"
        code={`TypeError: undefined is not an object (evaluating 'c.env.DB')`}
      />
      <p className="mt-3 leading-relaxed">
        第3回の依頼No.02で学んだとおり、<code className="rounded bg-muted px-1.5 py-0.5 text-xs">c.env.DB</code>
        は<span className="font-medium">Cloudflareのランタイムがリクエストごとに渡してくれる値</span>でした。
        <code className="rounded bg-muted px-1.5 py-0.5 text-xs">bun test</code>
        はwranglerを通さずテストコードを直接実行するので、誰も
        <code className="rounded bg-muted px-1.5 py-0.5 text-xs">env</code>
        を渡してくれません。つまりこれは<span className="font-medium">バグではなく、当然の結果</span>です。
        テストの書き方が、D1化したAPIに追いついていないのです。
      </p>

      <h2 className="mt-10 text-xl font-bold">2. 方針：テスト専用のD1を自分で渡す</h2>
      <p className="mt-3 leading-relaxed">
        <code className="rounded bg-muted px-1.5 py-0.5 text-xs">testClient()</code>
        は、第2引数に<code className="rounded bg-muted px-1.5 py-0.5 text-xs">env</code>
        を渡せるようになっています。
        <code className="rounded bg-muted px-1.5 py-0.5 text-xs">wrangler dev</code>
        がやっていた「<code className="rounded bg-muted px-1.5 py-0.5 text-xs">DB</code>
        を渡す」役を、テストでは自分で引き受ける、という考え方です。
      </p>
      <CopyBlock
        lang="ts"
        title="考え方（このあと実際に書きます）"
        code={`// 第2回：envを渡していない → c.env が空
const client = testClient(tradeApp)

// 第3回：テスト用のD1を自分で渡す
const client = testClient(tradeApp, { DB: testDb })`}
      />
      <p className="mt-3 leading-relaxed">
        では、その<code className="rounded bg-muted px-1.5 py-0.5 text-xs">testDb</code>
        をどこから持ってくるのか。
        <code className="rounded bg-muted px-1.5 py-0.5 text-xs">wrangler dev</code>
        がローカルD1を動かすのに使っているシミュレーターは
        <span className="font-medium">Miniflare（ミニフレア）</span>という名前で、
        これはライブラリとして単体でも呼び出せます。
        つまり<span className="font-medium">本物と同じD1の実装</span>を、テストの中から直接借りられるのです。
      </p>
      <Callout variant="info" title="なぜこの方法を選ぶのか">
        <p>
          Cloudflareには<code className="rounded bg-muted px-1.5 py-0.5 text-xs">@cloudflare/vitest-pool-workers</code>
          という、より本格的なテスト用の仕組みもあります（実際の開発ではこちらが推奨です）。
          ただしこれを使うには、<span className="font-medium">テストランナーをbun testからVitestに乗り換える</span>
          必要があります。第2回で覚えた<code className="rounded bg-muted px-1.5 py-0.5 text-xs">bun test</code>
          をそのまま使い続けられること、そして
          <span className="font-medium">第2回で書いたテストの中身（expect）を1行も変えずに済むこと</span>
          を優先して、この講座ではMiniflareを直接使う方法を採ります。
        </p>
      </Callout>

      <h2 className="mt-10 text-xl font-bold">3. miniflareをインストールする</h2>
      <CopyBlock lang="bash" title="ターミナル（backendディレクトリで）" code={`bun add -D miniflare`} />
      <Callout variant="warn" title="wranglerが内部で持っているものとは別物">
        <p>
          wranglerもMiniflareを内部に抱えていますが、それはwrangler専用の控えなので、
          自分のコードからは参照しないでください（バージョンも別に管理されています）。
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">import</code>
          して使うなら、上のコマンドで自分の依存として入れるのが正しい形です。
        </p>
      </Callout>

      <h2 className="mt-10 text-xl font-bold">4. テスト用のD1を作るヘルパーを書く</h2>
      <p className="mt-3 leading-relaxed">
        「空のD1を用意して、テーブルを作って、初期データを入れる」という準備は、
        テストファイルが増えても使い回せるように別ファイルに切り出します。
        <code className="rounded bg-muted px-1.5 py-0.5 text-xs">backend/src/test/d1.ts</code>
        を新規作成してください。
      </p>
      <CopyBlock
        lang="ts"
        title="backend/src/test/d1.ts（新規作成）"
        code={`import { Miniflare } from 'miniflare'
import { drizzle } from 'drizzle-orm/d1'
import { migrate } from 'drizzle-orm/d1/migrator'
import { items, player } from '../db/schema'

// テスト用のD1を1つ用意する
export async function createTestDb() {
  const mf = new Miniflare({
    modules: true,
    script: 'export default {}', // D1だけ借りるので、Worker本体は空でよい
    d1Databases: { DB: ':memory:' },
  })

  const DB = await mf.getD1Database('DB')
  const db = drizzle(DB)

  // 第3回の依頼No.05でdrizzle-kitが生成したSQLを、そのまま適用する
  await migrate(db, { migrationsFolder: './drizzle/migrations' })

  // テストの前提になる初期データ（seed.sqlと同じ内容）
  await db.insert(items).values([
    { name: 'やくそう', price: 8, stock: 99, description: 'HPを少量回復する' },
    { name: 'ポーション', price: 50, stock: 10, description: 'HPを大きく回復する' },
    { name: 'エリクサー', price: 5000, stock: 1, description: 'HPとMPを全回復する伝説の薬' },
    { name: '鉄の剣', price: 300, stock: 3, description: '頼りになる冒険者の相棒' },
    { name: '魔法の杖', price: 800, stock: 2, description: '使うほど魔力が増す杖' },
  ])
  await db.insert(player).values({ gold: 500 })

  return { DB, dispose: () => mf.dispose() }
}`}
      />
      <ul className="mt-3 list-disc space-y-2 pl-6 text-sm leading-relaxed">
        <li>
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">d1Databases: {'{ DB: \':memory:\' }'}</code>
          … メモリ上にD1を作ります。<code className="rounded bg-muted px-1.5 py-0.5 text-xs">bun run dev</code>
          で使っている<code className="rounded bg-muted px-1.5 py-0.5 text-xs">.wrangler/</code>
          のDBとは<span className="font-medium">完全に別物</span>です。
          テストで買い物をしても開発中のデータは汚れませんし、毎回まっさらな状態から始まります。
        </li>
        <li>
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">migrate(db, {'{ migrationsFolder }'})</code>
          … <code className="rounded bg-muted px-1.5 py-0.5 text-xs">bun wrangler d1 migrations apply</code>
          のDrizzle版です。第3回の依頼No.05で生成済みのSQLを使うので、
          <span className="font-medium">テスト用にスキーマを書き直す必要はありません</span>
          （スキーマを二重管理すると、必ずどちらかが古くなります）。
        </li>
        <li>
          初期データは<code className="rounded bg-muted px-1.5 py-0.5 text-xs">seed.sql</code>
          ではなく<code className="rounded bg-muted px-1.5 py-0.5 text-xs">db.insert()</code>
          で入れています。「このテストは所持金500Gから始まる」という前提が、
          テストのコードを読むだけで分かるようにするためです。
        </li>
        <li>
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">dispose</code>
          … 起動したシミュレーターを後片付けするための関数です。呼び出し側で使います。
        </li>
      </ul>

      <h2 className="mt-10 text-xl font-bold">5. trade.test.ts を書き換える</h2>
      <p className="mt-3 leading-relaxed">
        いよいよテスト本体です。
        <span className="font-medium">
          書き換えるのは先頭（clientを作る部分）だけで、
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">describe</code>から下は第2回のまま
        </span>
        です。見比べながら書いてみてください。
      </p>
      <CopyBlock
        lang="ts"
        title="backend/src/routes/trade.test.ts（全体を置き換え）"
        code={`import { afterAll, beforeAll, describe, expect, it } from 'bun:test'
import { testClient } from 'hono/testing'
import { tradeApp } from './trade'
import { createTestDb } from '../test/d1'

let client: ReturnType<typeof testClient<typeof tradeApp>>
let dispose: () => Promise<void>

// テストが始まる前に、テスト用のD1を用意してアプリに渡す
beforeAll(async () => {
  const testDb = await createTestDb()
  dispose = testDb.dispose
  client = testClient(tradeApp, { DB: testDb.DB })
})

// 全部終わったら後片付け
afterAll(async () => {
  await dispose()
})

// ===== ここから下は第2回のまま =====
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
      <ul className="mt-3 list-disc space-y-2 pl-6 text-sm leading-relaxed">
        <li>
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">beforeAll</code>
          … そのファイルのテストが始まる前に1回だけ実行されます。D1の用意は非同期処理なので、
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">const client = testClient(...)</code>
          をファイルの先頭に書く第2回の形から、ここに移動させる必要がありました。
        </li>
        <li>
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{'{ DB: testDb.DB }'}</code>
          … <code className="rounded bg-muted px-1.5 py-0.5 text-xs">wrangler.jsonc</code>
          の<code className="rounded bg-muted px-1.5 py-0.5 text-xs">binding</code>
          に書いた名前と<span className="font-medium">同じ</span>でなければいけません。
          第3回の依頼No.03で<code className="rounded bg-muted px-1.5 py-0.5 text-xs">"binding": "DB"</code>
          としたので、ここも<code className="rounded bg-muted px-1.5 py-0.5 text-xs">DB</code>です。
        </li>
      </ul>
      <Callout variant="info" title="expectを1行も変えなかったことに注目">
        <p>
          実装はメモリの配列からD1へ、まるごと作り替えました。それでも
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">toMatchObject({'{ gold: 450, ... }'})</code>
          のような<span className="font-medium">「APIの外から見たふるまい」を確かめるテストは、そのまま使えています</span>。
          これはテストの書き方が良かったということです。もし
          「<code className="rounded bg-muted px-1.5 py-0.5 text-xs">data.ts</code>
          の配列の中身がこうなっているはず」というテストを書いていたら、今日まとめて書き直しになっていました。
        </p>
      </Callout>

      <h2 className="mt-10 text-xl font-bold">6. 実行する</h2>
      <CopyBlock lang="bash" title="ターミナル（backendディレクトリで）" code={`bun test`} />
      <p className="mt-3 leading-relaxed">
        3件すべてPASSになれば完了です。
        <code className="rounded bg-muted px-1.5 py-0.5 text-xs">bun run dev</code>
        を起動していなくても通ります（テスト用のD1は、テストが自分で用意しているからです）。
      </p>
      <Callout variant="tip" title="壊して確かめる">
        <p>
          第2回と同じように、わざとコードを壊して赤くなることも確認しておきましょう。たとえば
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">trade.ts</code>
          の購入処理で<code className="rounded bg-muted px-1.5 py-0.5 text-xs">playerRow.gold - total</code>
          を<code className="rounded bg-muted px-1.5 py-0.5 text-xs">playerRow.gold + total</code>
          に変えると、1件目のテストが落ちます。
          <span className="font-medium">D1に書き込む処理のバグを、テストが捕まえてくれる</span>ようになりました。
        </p>
      </Callout>

      <h2 className="mt-10 text-xl font-bold">理解度チェック</h2>
      <Quiz
        question="D1化した直後、第2回のテスト3件のうち「quantityがマイナスだと400になる」だけが通り続けたのはなぜ？"
        choices={[
          "zodのバリデーションがハンドラに入る前にリクエストを弾くので、DBに触らないまま400を返せるから",
          "400番のエラーだけは、DBがなくても返せるようHonoが特別扱いしているから",
          "バリデーションのテストは、実際にはAPIを呼び出していないから",
        ]}
        answerIndex={0}
        explanation="zod-openapiのバリデーションは、ハンドラの手前で動きます。そこで弾かれたリクエストはdrizzle(c.env.DB)の行にたどり着かないため、DBがなくても400を返せます。逆に言えば、ハンドラの中まで進むテストはすべてDBを必要とします。"
      />

      <h2 className="mt-10 text-xl font-bold">よくあるつまずき</h2>
      <ul className="mt-3 list-disc space-y-2 pl-6 text-sm leading-relaxed">
        <li>
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">
            TypeError: undefined is not an object (evaluating 'c.env.DB')
          </code>
          → <code className="rounded bg-muted px-1.5 py-0.5 text-xs">testClient()</code>
          の第2引数を渡していません。
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">testClient(tradeApp)</code>
          のまま残っていないか確認してください。
        </li>
        <li>
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">
            TypeError: undefined is not an object (evaluating 'this.client.prepare')
          </code>
          → envは渡せているが、<span className="font-medium">キーの名前が違います</span>。
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{'{ db: ... }'}</code>
          や<code className="rounded bg-muted px-1.5 py-0.5 text-xs">{'{ DB1: ... }'}</code>
          になっていないか見てみましょう。正しくは
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{'{ DB: testDb.DB }'}</code>
          です（第3回の依頼No.03のbindingと同じ名前）。
        </li>
        <li>
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">Can't find meta/_journal.json file</code>
          → <code className="rounded bg-muted px-1.5 py-0.5 text-xs">migrationsFolder</code>
          のパスがずれています。これは<span className="font-medium">コマンドを実行したディレクトリから見た相対パス</span>
          なので、<code className="rounded bg-muted px-1.5 py-0.5 text-xs">bun test</code>
          はbackendディレクトリで実行してください。
          第3回の依頼No.05の<code className="rounded bg-muted px-1.5 py-0.5 text-xs">bunx drizzle-kit generate</code>
          が済んでいない場合も、このエラーになります。
        </li>
        <li>
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">Cannot find module 'miniflare'</code>
          → 手順3の<code className="rounded bg-muted px-1.5 py-0.5 text-xs">bun add -D miniflare</code>
          を忘れています。wranglerを入れただけでは使えません。
        </li>
        <li>
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">Cannot find name 'D1Database'</code>
          のような型エラーが<code className="rounded bg-muted px-1.5 py-0.5 text-xs">test/d1.ts</code>
          で出る → 第3回の依頼No.03の<code className="rounded bg-muted px-1.5 py-0.5 text-xs">bun wrangler types</code>
          が済んでいるか確認してください。
        </li>
        <li>
          2回目の<code className="rounded bg-muted px-1.5 py-0.5 text-xs">bun test</code>
          でも所持金が450Gになる？ → なります。
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">:memory:</code>
          のD1はテストが終わると消えるので、毎回500Gから始まります。
          第2回で「テストのたびに500Gから始まる」と説明したのと、同じ状態を保てています。
        </li>
        <li>
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">routes/items.ts</code>
          のテストも書きたい → 同じ
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">createTestDb()</code>
          を呼んで<code className="rounded bg-muted px-1.5 py-0.5 text-xs">testClient(itemsApp, {'{ DB }'})</code>
          とすれば、まったく同じ形で書けます。ヘルパーに切り出したのはこのためです。
        </li>
      </ul>

      <ProgressCheck
        id="extra-testing-d1"
        label="テスト用のD1をtestClientに渡して、bun testを再び全部PASSにできた"
      />
      <NextLink current="/extra/testing-d1" />
    </div>
  );
}
