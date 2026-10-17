import { PageHeader } from "@/components/PageHeader";
import { Callout } from "@/components/Callout";
import { Quiz } from "@/components/Quiz";
import { ProgressCheck } from "@/components/ProgressCheck";
import { NextLink } from "@/components/NextLink";
import { CopyBlock } from "@/components/CopyBlock";
import { ZodGateFigure } from "@/components/figures/ZodGateFigure";

export function ZodBasics() {
  return (
    <div>
      <PageHeader
        title="zodとは？バリデーションの基本"
        chapter="02"
        goal="zodでスキーマ（データの形のルール）を定義し、safeParseで検証できるようになる"
        minutes={10}
      />

      <h2 className="text-xl font-bold">zod = データの「形」を定義するライブラリ</h2>
      <p className="mt-3 leading-relaxed">
        zodは、TypeScriptと相性のよい<span className="font-medium">バリデーション（検証）ライブラリ</span>です。
        「このデータはこういう形であるべき」というルール（スキーマ）を書いておくと、
        実際に来たデータがそのルールに合っているかをチェックしてくれます。
      </p>

      <ZodGateFigure />

      <h2 className="mt-10 text-xl font-bold">1. インストールする</h2>
      <CopyBlock lang="bash" title="ターミナル（backendディレクトリで）" code={`bun add zod`} />

      <h2 className="mt-10 text-xl font-bold">2. スキーマを定義してみる</h2>
      <p className="mt-3 leading-relaxed">
        Honoにはまだ組み込まず、まずはzod単体の動きを確認しましょう。
        <code className="rounded bg-muted px-1.5 py-0.5 text-xs">backend/src/</code>
        の中に<code className="rounded bg-muted px-1.5 py-0.5 text-xs">zod-try.ts</code>
        という新しいファイルを作り、次のコードを貼り付けます
        （<code className="rounded bg-muted px-1.5 py-0.5 text-xs">index.ts</code>
        には触りません）。
      </p>
      <CopyBlock
        lang="ts"
        title="backend/src/zod-try.ts（新規作成・お試し用）"
        code={`import { z } from 'zod'

// 「purchaseのリクエストはこういう形であるべき」というルール
const purchaseSchema = z.object({
  itemId: z.number().int().positive(),
  quantity: z.number().int().positive().optional(),
})

const result = purchaseSchema.safeParse({ itemId: 2, quantity: -5 })

if (!result.success) {
  console.log('バリデーションエラー：', result.error.issues)
} else {
  console.log('OK：', result.data)
}`}
      />

      <h3 className="mt-6 text-lg font-bold">動かしてみる</h3>
      <p className="mt-3 leading-relaxed">
        このファイルはHonoのサーバーとは無関係な単なるスクリプトなので、
        <code className="rounded bg-muted px-1.5 py-0.5 text-xs">bun run dev</code>
        は不要です。Bunに直接ファイルを渡して実行します（Bunは
        <code className="rounded bg-muted px-1.5 py-0.5 text-xs">.ts</code>
        をそのまま実行できます）。
      </p>
      <CopyBlock lang="bash" title="ターミナル（backendディレクトリで）" code={`bun run src/zod-try.ts`} />
      <p className="mt-3 leading-relaxed">
        <code className="rounded bg-muted px-1.5 py-0.5 text-xs">quantity: -5</code>
        がルール違反なので、次のようなエラーが表示されれば成功です。
      </p>
      <CopyBlock
        lang="text"
        title="実行結果（例）"
        code={`バリデーションエラー： [
  {
    origin: "number",
    code: "too_small",
    minimum: 0,
    inclusive: false,
    path: [ "quantity" ],
    message: "Too small: expected number to be >0",
  }
]`}
      />
      <p className="mt-3 leading-relaxed">
        次に<code className="rounded bg-muted px-1.5 py-0.5 text-xs">quantity: -5</code>
        を<code className="rounded bg-muted px-1.5 py-0.5 text-xs">quantity: 3</code>
        に書き換えてもう一度実行し、
        <code className="rounded bg-muted px-1.5 py-0.5 text-xs">OK： {'{ itemId: 2, quantity: 3 }'}</code>
        のように出ることも確認しておきましょう。
      </p>

      <Callout variant="info" title="お試しファイルは消してOK">
        <p>
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">zod-try.ts</code>
          はzodの動きを見るためだけのファイルで、この後の手順では使いません。
          確認が終わったら削除して構いません（残しておいても動作に影響はありません）。
        </p>
      </Callout>

      <ul className="mt-4 list-disc space-y-2 pl-6 text-sm leading-relaxed">
        <li>
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">z.object({'{...}'})</code>
          … 「オブジェクトで、こういうキーを持つ」というスキーマを作ります。
        </li>
        <li>
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">z.number().int().positive()</code>
          … 「数値」「整数」「正の数」という3つのルールをチェーンでつなげています。
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">-5</code>はここで弾かれます。
        </li>
        <li>
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">.optional()</code>
          … 「なくてもよい」を表します。第1回の
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">body.quantity ?? 1</code>
          と同じ意図です。
        </li>
        <li>
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">safeParse(data)</code>
          … データを検証します。成功しても失敗しても例外を投げず、
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{'{ success, data | error }'}</code>
          の形で結果を返してくれます。
        </li>
      </ul>

      <Callout variant="tip" title="parse() との違い">
        <p>
          zodには<code className="rounded bg-muted px-1.5 py-0.5 text-xs">parse()</code>
          という関数もありますが、こちらは検証に失敗すると<span className="font-medium">例外を投げます</span>。
          Honoのハンドラの中で使うときは、失敗を自分でハンドリングしやすい
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">safeParse()</code>
          の方が扱いやすい場面が多いです（次のページで使う
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">@hono/zod-openapi</code>
          は、内部でこの検証を自動的にやってくれます）。
        </p>
      </Callout>

      <h2 className="mt-10 text-xl font-bold">理解度チェック</h2>
      <Quiz
        question="purchaseSchema.safeParse({ itemId: 2, quantity: -5 }) の結果はどうなる？"
        choices={[
          "quantityがpositive()のルールに違反しているので、success: falseになる",
          "quantityはoptionalなので、マイナスでも無視されてsuccess: trueになる",
          "itemIdが不正なのでエラーになる",
        ]}
        answerIndex={0}
        explanation="quantityは「指定するなら正の整数」というルールです。指定されている以上、-5はpositive()に違反するためバリデーションエラーになります。"
      />

      <h2 className="mt-10 text-xl font-bold">よくあるつまずき</h2>
      <ul className="mt-3 list-disc space-y-2 pl-6 text-sm leading-relaxed">
        <li>
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">parse()</code>
          を使ってしまい、不正な値のたびにエラーで処理が落ちる → 自分でエラーをハンドリングしたい場合は
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">safeParse()</code>
          を使いましょう。
        </li>
        <li>
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">z.number()</code>
          だけだと<code className="rounded bg-muted px-1.5 py-0.5 text-xs">1.5</code>のような小数も通ってしまう →
          個数を扱うときは<code className="rounded bg-muted px-1.5 py-0.5 text-xs">.int()</code>
          を忘れずに付けましょう。
        </li>
      </ul>

      <ProgressCheck id="s2-02-zod-basics" label="zodでスキーマを定義し、safeParseで検証できることを理解した" />
      <NextLink current="/session2/02-zod-basics" />
    </div>
  );
}
