import { PageHeader } from "@/components/PageHeader";
import { Callout } from "@/components/Callout";
import { Quiz } from "@/components/Quiz";
import { ProgressCheck } from "@/components/ProgressCheck";
import { NextLink } from "@/components/NextLink";
import { CopyBlock } from "@/components/CopyBlock";
import { LocalRemoteFigure } from "@/components/figures/LocalRemoteFigure";

export function RemoteMigration() {
  return (
    <div>
      <PageHeader
        title="本番D1へのマイグレーション"
        chapter="01"
        goal="本番のD1データベースにテーブルと初期データを反映できている"
        minutes={15}
      />

      <Callout variant="quest">
        <p>
          いよいよ最終回です。第3回まではすべて手元（ローカル）だけで完結していました。
          今日は、世界中の冒険者がアクセスできる「本番のよろず屋」を開店させます。
        </p>
      </Callout>

      <h2 className="mt-8 text-xl font-bold">1. 本番D1にマイグレーションを反映する</h2>
      <p className="mt-3 leading-relaxed">
        第3回で使った<code className="rounded bg-muted px-1.5 py-0.5 text-xs">--local</code>
        を、<code className="rounded bg-muted px-1.5 py-0.5 text-xs">--remote</code>
        に変えるだけです。
      </p>

      <LocalRemoteFigure />
      <CopyBlock
        lang="bash"
        title="ターミナル（backendディレクトリで）"
        code={`bun wrangler d1 migrations apply yorozuya-db --remote`}
      />
      <p className="mt-3 leading-relaxed">
        確認のプロンプトが出るので、内容を確認してから進めてください。これはCloudflare上の
        <span className="font-medium">本物のデータベース</span>に対する操作です。
      </p>

      <h2 className="mt-10 text-xl font-bold">2. 本番に初期データを投入する</h2>
      <CopyBlock
        lang="bash"
        title="ターミナル"
        code={`bun wrangler d1 execute yorozuya-db --remote --file ./seed.sql`}
      />

      <h2 className="mt-10 text-xl font-bold">3. 反映されたか確認する</h2>
      <CopyBlock
        lang="bash"
        title="ターミナル"
        code={`bun wrangler d1 execute yorozuya-db --remote --command "SELECT * FROM items"`}
      />

      <Callout variant="warn" title="--local と --remote を取り違えない">
        <p>
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">--remote</code>
          を付け忘れると、本番に反映したつもりが実はローカルにしか反映されていない、ということが起こります。
          逆に、動作確認のつもりで<code className="rounded bg-muted px-1.5 py-0.5 text-xs">--remote</code>
          付きの削除・更新コマンドを実行してしまうと、本番データを壊しかねません。
          実行前に、コマンドのフラグを指差し確認する癖をつけましょう。
        </p>
      </Callout>

      <h2 className="mt-10 text-xl font-bold">理解度チェック</h2>
      <Quiz
        question="--local と --remote の違いとして正しいものはどれ？"
        choices={[
          "--localは手元のシミュレーション環境、--remoteはCloudflare上の本番データベースに対する操作",
          "--localはWindows専用、--remoteはMac専用のオプション",
          "どちらも同じ場所に反映されるが、実行速度が違うだけ",
        ]}
        answerIndex={0}
        explanation="--localはローカルマシン上のシミュレーション用D1、--remoteはCloudflare上の実際のデータベースを操作します。第3回はすべて--localで進めてきました。"
      />

      <h2 className="mt-10 text-xl font-bold">よくあるつまずき</h2>
      <ul className="mt-3 list-disc space-y-2 pl-6 text-sm leading-relaxed">
        <li>
          本番のdatabase_idと<code className="rounded bg-muted px-1.5 py-0.5 text-xs">wrangler.jsonc</code>
          の記述がずれている → <code className="rounded bg-muted px-1.5 py-0.5 text-xs">bun wrangler d1 list</code>
          で正しいIDを再確認しましょう（第3回で作成したデータベースがそのまま本番用です。ローカルと本番で
          データベース自体は同じものを使います）。
        </li>
        <li>
          初期データ投入コマンドを2回実行してしまい、商品が重複登録される →
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">SELECT * FROM items</code>
          で件数を確認してから投入する習慣をつけましょう。重複してしまった場合は
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">DELETE FROM items</code>
          で一度空にしてからやり直せます。
        </li>
      </ul>

      <ProgressCheck id="s4-01-remote-migration" label="本番D1にマイグレーションと初期データを反映できた" />
      <NextLink current="/session4/01-remote-migration" />
    </div>
  );
}
