import { PageHeader } from "@/components/PageHeader";
import { Callout } from "@/components/Callout";
import { Quiz } from "@/components/Quiz";
import { ProgressCheck } from "@/components/ProgressCheck";
import { NextLink } from "@/components/NextLink";
import { CopyBlock } from "@/components/CopyBlock";

export function Migration() {
  return (
    <div>
      <PageHeader
        title="マイグレーションを実行する（ローカル）"
        chapter="05"
        goal="スキーマからマイグレーションSQLを生成し、ローカルのD1にテーブルと初期データを反映できている"
        minutes={15}
      />

      <Callout variant="quest">
        <p>
          テーブルの設計図（スキーマ）は描けました。ここからは、その設計図を実際のデータベースに
          反映する「マイグレーション」という作業を行います。
        </p>
      </Callout>

      <h2 className="mt-8 text-xl font-bold">1. マイグレーションSQLを生成する</h2>
      <CopyBlock lang="bash" title="ターミナル（backendディレクトリで）" code={`bunx drizzle-kit generate`} />
      <p className="mt-3 leading-relaxed">
        <code className="rounded bg-muted px-1.5 py-0.5 text-xs">drizzle/migrations/0000_xxxx.sql</code>
        のようなファイルが生成されます。中身を開いてみましょう。
      </p>
      <CopyBlock
        lang="sql"
        title="drizzle/migrations/0000_xxxx.sql（生成例・抜粋）"
        code={`CREATE TABLE \`items\` (
  \`id\` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  \`name\` text NOT NULL,
  \`price\` integer NOT NULL,
  \`stock\` integer NOT NULL,
  \`description\` text NOT NULL
);
-- player, player_items も同様に生成される`}
      />
      <p className="mt-3 leading-relaxed">
        <code className="rounded bg-muted px-1.5 py-0.5 text-xs">schema.ts</code>
        に書いたTypeScriptの定義が、そのままSQLの<code className="rounded bg-muted px-1.5 py-0.5 text-xs">CREATE TABLE</code>
        文になっていることが分かります。これがdrizzle-kitの役割です。
      </p>

      <h2 className="mt-10 text-xl font-bold">2. ローカルのD1に反映する</h2>
      <CopyBlock
        lang="bash"
        title="ターミナル"
        code={`bun wrangler d1 migrations apply yorozuya-db --local`}
      />
      <p className="mt-3 leading-relaxed">
        <code className="rounded bg-muted px-1.5 py-0.5 text-xs">--local</code>
        を付けると、手元のマシン上でシミュレーションされたD1（本番とは別物）にテーブルが作られます。
        実体は<code className="rounded bg-muted px-1.5 py-0.5 text-xs">backend/.wrangler/</code>
        の下に置かれるSQLiteファイルで、<code className="rounded bg-muted px-1.5 py-0.5 text-xs">bun run dev</code>
        （wrangler dev）が使うものと同じです。Cloudflareへのログインも不要なので、
        まずはここで安心して試行錯誤しましょう。
      </p>
      <Callout variant="info" title="このコマンドが見ているのはmigrations_dir">
        <p>
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">migrations apply</code>
          は、<code className="rounded bg-muted px-1.5 py-0.5 text-xs">wrangler.jsonc</code>
          の<code className="rounded bg-muted px-1.5 py-0.5 text-xs">migrations_dir</code>
          に書いた場所（この講座では
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">drizzle/migrations</code>）
          にあるSQLを、古い順に適用していきます。
          どのファイルを適用したかはD1側に記録されるので、同じコマンドを2回実行しても
          テーブルが二重に作られることはありません。
        </p>
      </Callout>

      <h2 className="mt-10 text-xl font-bold">3. 初期データを投入する</h2>
      <p className="mt-3 leading-relaxed">
        <code className="rounded bg-muted px-1.5 py-0.5 text-xs">backend/seed.sql</code>
        を作成し、第1回で使っていた商品データと初期所持金を入れます。
      </p>
      <CopyBlock
        lang="sql"
        title="backend/seed.sql（新規作成）"
        code={`INSERT INTO items (name, price, stock, description) VALUES
  ('やくそう', 8, 99, 'HPを少量回復する'),
  ('ポーション', 50, 10, 'HPを大きく回復する'),
  ('エリクサー', 5000, 1, 'HPとMPを全回復する伝説の薬'),
  ('鉄の剣', 300, 3, '頼りになる冒険者の相棒'),
  ('魔法の杖', 800, 2, '使うほど魔力が増す杖');

INSERT INTO player (gold) VALUES (500);`}
      />
      <CopyBlock
        lang="bash"
        title="ターミナル"
        code={`bun wrangler d1 execute yorozuya-db --local --file ./seed.sql`}
      />

      <h2 className="mt-10 text-xl font-bold">4. 反映されたか確認する</h2>
      <CopyBlock
        lang="bash"
        title="ターミナル"
        code={`bun wrangler d1 execute yorozuya-db --local --command "SELECT * FROM items"`}
      />
      <p className="mt-3 leading-relaxed">
        5件の商品データがテーブル形式で表示されれば成功です。
      </p>

      <h2 className="mt-10 text-xl font-bold">理解度チェック</h2>
      <Quiz
        question="--local フラグを付けて実行したマイグレーション・データ投入は、どこに反映される？"
        choices={[
          "手元のマシン上のシミュレーション用D1（Cloudflare上の本番D1にはまだ反映されない）",
          "Cloudflare上の本番D1に直接反映される",
          "反映されず、コマンドの動作確認だけが行われる",
        ]}
        answerIndex={0}
        explanation="--localはローカル環境でのシミュレーションです。本番のD1に反映するには、第4回で扱う--remoteフラグを使います。"
      />

      <h2 className="mt-10 text-xl font-bold">よくあるつまずき</h2>
      <ul className="mt-3 list-disc space-y-2 pl-6 text-sm leading-relaxed">
        <li>
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">drizzle-kit generate</code>
          だけ実行して満足してしまう → これはSQLファイルを「生成」するだけです。実際にDBへ反映するには
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">wrangler d1 migrations apply</code>
          を忘れずに実行してください。
        </li>
        <li>
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">seed.sql</code>
          のシングルクォートやカンマを書き間違えてSQLエラーになる → エラーメッセージに表示される行番号を頼りに、
          カンマの数や引用符の対応を確認しましょう。
        </li>
        <li>
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">No migrations present at ...\backend\migrations</code>
          と言われる → SQLは生成できているのに、wranglerが別の場所（既定の
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">./migrations</code>）を探しています。
          依頼No.03の<code className="rounded bg-muted px-1.5 py-0.5 text-xs">migrations_dir</code>
          と、依頼No.04の<code className="rounded bg-muted px-1.5 py-0.5 text-xs">out</code>
          が<code className="rounded bg-muted px-1.5 py-0.5 text-xs">drizzle/migrations</code>
          で揃っているか確認してください。
        </li>
        <li>
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">seed.sql</code>
          を2回実行してしまい、商品が重複して登録される →
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">bun wrangler d1 execute yorozuya-db --local --command "DELETE FROM items"</code>
          で一度空にしてから、もう一度投入し直せます（<code className="rounded bg-muted px-1.5 py-0.5 text-xs">player</code>
          も同様です）。
        </li>
        <li>
          （Windows）<code className="rounded bg-muted px-1.5 py-0.5 text-xs">workerd.exe</code>
          が<code className="rounded bg-muted px-1.5 py-0.5 text-xs">access violation</code>
          や<code className="rounded bg-muted px-1.5 py-0.5 text-xs">vcruntime140_1.dll が見つかりません</code>
          で落ちる →{" "}
          <a
            href="https://aka.ms/vs/17/release/vc_redist.x64.exe"
            target="_blank"
            rel="noreferrer"
            className="text-primary underline-offset-4 hover:underline"
          >
            Microsoft Visual C++ 再頒布可能パッケージ（x64）
          </a>
          を入れてから、ターミナルを開き直して再実行してください（
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">--local</code>
          のD1はworkerd上で動くため、これが必要になります）。
        </li>
      </ul>

      <ProgressCheck id="s3-05-migration" label="ローカルのD1にマイグレーションと初期データを反映できた" />
      <NextLink current="/session3/05-migration" />
    </div>
  );
}
