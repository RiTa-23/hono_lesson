import { PageHeader } from "@/components/PageHeader";
import { Callout } from "@/components/Callout";
import { Quiz } from "@/components/Quiz";
import { ProgressCheck } from "@/components/ProgressCheck";
import { NextLink } from "@/components/NextLink";
import { MemoryVsDbFigure } from "@/components/figures/MemoryVsDbFigure";
import { OrmChainFigure } from "@/components/figures/OrmChainFigure";

export function D1Intro() {
  return (
    <div>
      <PageHeader
        title="メモリ管理の限界とD1"
        chapter="01"
        goal="今のAPIがデータを保持できない理由を理解し、D1・Drizzle ORMの役割を説明できるようになる"
        minutes={10}
      />

      <Callout variant="quest">
        <p>
          第2回でAPIの穴は塞ぎましたが、よろず屋の店主からまだ苦情が来ています。
          「さっき買ったばかりのポーションが、いつの間にか消えているのじゃが…？」
        </p>
      </Callout>

      <h2 className="mt-8 text-xl font-bold">1. 思い出そう：データはどこにある？</h2>
      <p className="mt-3 leading-relaxed">
        第1回で書いたコードを振り返ってみましょう。
      </p>
      <ul className="mt-3 list-disc space-y-1.5 pl-6 text-sm leading-relaxed">
        <li>
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">const items = [...]</code>
          … 商品データは、ただのJavaScriptの配列
        </li>
        <li>
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">const player = {'{ gold: 500, items: [] }'}</code>
          … 所持金・所持品も、ただのオブジェクト
        </li>
      </ul>
      <p className="mt-3 leading-relaxed">
        これらは<span className="font-medium">サーバーが起動している間だけ</span>メモリ上に存在するデータです。
        ホットリロードやサーバーの再起動が起きると、
        <code className="rounded bg-muted px-1.5 py-0.5 text-xs">const items = [...]</code>
        の行がもう一度実行され、初期値に巻き戻ってしまいます。
      </p>

      <MemoryVsDbFigure />

      <h2 className="mt-10 text-xl font-bold">2. D1 = Cloudflareが提供するデータベース</h2>
      <p className="mt-3 leading-relaxed">
        <span className="font-medium">D1</span>は、Cloudflare Workers上で使える
        SQLite互換のデータベースです。Cloudflareのネットワーク上（Workersと同じ場所）で動くため、
        Workersから低いレイテンシでアクセスできます。無料枠でも十分に開発・小規模運用ができます。
      </p>
      <p className="mt-3 leading-relaxed">
        D1にデータを書き込めば、サーバー（Worker）が何度再起動しても、
        <span className="font-medium">データそのものは別の場所に残り続けます</span>。
        これが今回のゴールです。
      </p>

      <h2 className="mt-10 text-xl font-bold">3. Drizzle ORM = TypeScriptでDB操作するための道具</h2>
      <p className="mt-3 leading-relaxed">
        D1に対して直接SQL文（<code className="rounded bg-muted px-1.5 py-0.5 text-xs">SELECT * FROM items WHERE id = ?</code>
        のような文字列）を書くこともできますが、タイプミスに気づきにくく、型の恩恵も受けられません。
        <span className="font-medium">Drizzle ORM</span>を使うと、テーブルの構造をTypeScriptのコードで定義し、
        SQLをTypeScriptの関数呼び出しのように書けるようになります。
      </p>

      <Callout variant="tip" title="今回の全体像">
        <p>
          <span className="font-medium">D1</span>（データの保存先）＋
          <span className="font-medium">Drizzle ORM</span>（TypeScriptから安全に読み書きする道具）
          の組み合わせで、第1回の配列・オブジェクトをデータベースのテーブルに置き換えていきます。
          APIのURLやレスポンスの形（フロントとの約束）は変えません。中身の実装だけを差し替えます。
        </p>
        <p className="mt-2">
          ただしD1は、Cloudflare Workersのランタイム上でしか動きません。
          そこで次のページでは、そのランタイムを手元で動かすための道具
          （<code className="rounded bg-muted px-1.5 py-0.5 text-xs">wrangler</code>）を先に整えます。
          今回はすべてローカルで完結するので、Cloudflareのアカウントはまだ必要ありません。
        </p>
      </Callout>

      <OrmChainFigure />

      <h2 className="mt-10 text-xl font-bold">理解度チェック</h2>
      <Quiz
        question="第1回・第2回のAPIで、開発サーバーを再起動すると何が起きた？"
        choices={[
          "所持金や在庫がすべて初期値に戻ってしまう",
          "APIのURLが変わってしまう",
          "何も変わらない（データはずっと保持される）",
        ]}
        answerIndex={0}
        explanation="items・playerはメモリ上のただの変数なので、サーバーの再起動（＝プログラムの再実行）で初期値に巻き戻ります。これを解決するのがデータベースです。"
      />

      <h2 className="mt-10 text-xl font-bold">よくあるつまずき</h2>
      <ul className="mt-3 list-disc space-y-2 pl-6 text-sm leading-relaxed">
        <li>
          「D1」という名前の由来が気になる → Cloudflareの製品名です。特別な略語を覚える必要はありません。
        </li>
        <li>
          ORMって結局何をしてくれるの？ → TypeScriptのオブジェクト・関数呼び出しと、DBのテーブル・SQL文を
          対応づけてくれる翻訳係です。SQLを直接書かなくても、型の補完を効かせながらDB操作ができます。
        </li>
      </ul>

      <ProgressCheck id="s3-01-intro" label="メモリ管理の限界を理解し、D1とDrizzle ORMの役割を説明できるようになった" />
      <NextLink current="/session3/01-intro" />
    </div>
  );
}
