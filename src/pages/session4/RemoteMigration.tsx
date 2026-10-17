import { PageHeader } from "@/components/PageHeader";
import { Callout } from "@/components/Callout";
import { Quiz } from "@/components/Quiz";
import { ProgressCheck } from "@/components/ProgressCheck";
import { NextLink } from "@/components/NextLink";
import { CopyBlock } from "@/components/CopyBlock";

export function RemoteMigration() {
  return (
    <div>
      <PageHeader
        title="本番D1へのマイグレーション"
        chapter="01"
        goal="Cloudflareにログインして本番のD1データベースを作り、テーブルと初期データを反映できている"
        minutes={20}
      />

      <Callout variant="quest">
        <p>
          いよいよ最終回です。第3回まではすべて手元（ローカル）だけで完結していました。
          今日は、世界中の冒険者がアクセスできる「本番のよろず屋」を開店させます。
          まずは本物のデータベースを用意しましょう。
        </p>
      </Callout>

      <h2 className="mt-8 text-xl font-bold">1. Cloudflareにログインする</h2>
      <p className="mt-3 leading-relaxed">
        ここから先はCloudflare上のリソースを操作するので、アカウントが必要です。まだ持っていない人は
        <a
          href="https://dash.cloudflare.com/sign-up"
          target="_blank"
          rel="noreferrer"
          className="text-primary underline-offset-4 hover:underline"
        >
          Cloudflareの登録ページ
        </a>
        で無料アカウントを作ってください（クレジットカードの登録は不要です）。
      </p>
      <CopyBlock lang="bash" title="ターミナル（backendディレクトリで）" code={`bun wrangler login`} />
      <p className="mt-3 leading-relaxed">
        ブラウザが開くので、Cloudflareアカウントでログインし、アクセスを許可してください。
        ターミナルに<code className="rounded bg-muted px-1.5 py-0.5 text-xs">Successfully logged in</code>
        のような表示が出ればOKです。ログインできているかは、次のコマンドでも確認できます。
      </p>
      <CopyBlock lang="bash" title="確認" code={`bun wrangler whoami`} />

      <h2 className="mt-10 text-xl font-bold">2. 本番のD1データベースを作る</h2>
      <p className="mt-3 leading-relaxed">
        第3回で使っていたのは、手元のマシンの中だけにあるD1でした。
        Cloudflare上に本物のD1を作るのは、ここが初めてです。
      </p>
      <CopyBlock lang="bash" title="ターミナル" code={`bun wrangler d1 create yorozuya-db`} />
      <p className="mt-3 leading-relaxed">
        実行すると、次のような案内と<code className="rounded bg-muted px-1.5 py-0.5 text-xs">database_id</code>
        が表示されます。この<code className="rounded bg-muted px-1.5 py-0.5 text-xs">database_id</code>
        は次の手順で使うので、コピーしておいてください。
      </p>
      <CopyBlock
        lang="text"
        title="出力例"
        code={`✅ Successfully created DB 'yorozuya-db'

[[d1_databases]]
binding = "DB"
database_name = "yorozuya-db"
database_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"`}
      />

      <h2 className="mt-10 text-xl font-bold">3. wrangler.jsoncのdatabase_idを差し替える</h2>
      <p className="mt-3 leading-relaxed">
        第3回では<code className="rounded bg-muted px-1.5 py-0.5 text-xs">database_id</code>
        に仮の文字列を入れていました（
        <code className="rounded bg-muted px-1.5 py-0.5 text-xs">--local</code>
        では参照されないため）。本番に向けるために、表示された本物のIDへ書き換えます。
      </p>
      <CopyBlock
        lang="jsonc"
        title="backend/wrangler.jsonc（database_idだけ書き換え）"
        code={`  "d1_databases": [
    {
      "binding": "DB",
      "database_name": "yorozuya-db",
      "database_id": "さっき表示されたIDに置き換える",
      "migrations_dir": "drizzle/migrations"
    }
  ]`}
      />
      <Callout variant="info" title="ローカルのデータはそのまま残る">
        <p>
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">database_id</code>
          を本物にしても、<code className="rounded bg-muted px-1.5 py-0.5 text-xs">--local</code>
          で作ったテーブルやデータは手元に残っています。ローカルのD1と本番のD1は、
          同じ設定を共有しつつ中身はまったく別物です。
        </p>
      </Callout>

      <h2 className="mt-10 text-xl font-bold">4. 本番D1にマイグレーションを反映する</h2>
      <p className="mt-3 leading-relaxed">
        第3回で使った<code className="rounded bg-muted px-1.5 py-0.5 text-xs">--local</code>
        を、<code className="rounded bg-muted px-1.5 py-0.5 text-xs">--remote</code>
        に変えるだけです。
      </p>
      <CopyBlock
        lang="bash"
        title="ターミナル（backendディレクトリで）"
        code={`bun wrangler d1 migrations apply yorozuya-db --remote`}
      />
      <p className="mt-3 leading-relaxed">
        確認のプロンプトが出るので、内容を確認してから進めてください。これはCloudflare上の
        <span className="font-medium">本物のデータベース</span>に対する操作です。
      </p>

      <h2 className="mt-10 text-xl font-bold">5. 本番に初期データを投入する</h2>
      <CopyBlock
        lang="bash"
        title="ターミナル"
        code={`bun wrangler d1 execute yorozuya-db --remote --file ./seed.sql`}
      />

      <h2 className="mt-10 text-xl font-bold">6. 反映されたか確認する</h2>
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
          学校・会社のネットワークでブラウザ認可がブロックされ、
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">bun wrangler login</code>
          が完了しない → 個人のスマホのテザリングなど、別のネットワークで試してみましょう。
        </li>
        <li>
          ログインを省略しようとして<code className="rounded bg-muted px-1.5 py-0.5 text-xs">--temporary</code>
          （一時アカウント）でしのごうとする → 権限が足りず、D1の作成はできません。
          通常のアカウントでログインしてください。
        </li>
        <li>
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">database_id</code>
          の差し替えを忘れて、仮の値のまま
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">--remote</code>
          を実行する → IDが見つからないというエラーになります。
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">bun wrangler d1 list</code>
          で正しいIDを確認して、<code className="rounded bg-muted px-1.5 py-0.5 text-xs">wrangler.jsonc</code>
          に貼り直しましょう。
        </li>
        <li>
          初期データ投入コマンドを2回実行してしまい、商品が重複登録される →
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">SELECT * FROM items</code>
          で件数を確認してから投入する習慣をつけましょう。重複してしまった場合は
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">DELETE FROM items</code>
          で一度空にしてからやり直せます。
        </li>
      </ul>

      <ProgressCheck id="s4-01-remote-migration" label="Cloudflareにログインして本番D1を作成し、マイグレーションと初期データを反映できた" />
      <NextLink current="/session4/01-remote-migration" />
    </div>
  );
}
