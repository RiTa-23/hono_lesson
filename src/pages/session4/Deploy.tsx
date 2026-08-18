import { PageHeader } from "@/components/PageHeader";
import { Callout } from "@/components/Callout";
import { Quiz } from "@/components/Quiz";
import { ProgressCheck } from "@/components/ProgressCheck";
import { NextLink } from "@/components/NextLink";
import { CopyBlock } from "@/components/CopyBlock";

export function Deploy() {
  return (
    <div>
      <PageHeader
        title="Cloudflare Workersへデプロイする"
        chapter="02"
        goal="backendをCloudflare Workersにデプロイし、インターネット上に公開できている"
        minutes={15}
      />

      <h2 className="text-xl font-bold">1. Cloudflareにログインする</h2>
      <CopyBlock lang="bash" title="ターミナル（backendディレクトリで）" code={`bun wrangler login`} />
      <p className="mt-3 leading-relaxed">
        ブラウザが開くので、Cloudflareアカウントでログインし、アクセスを許可してください。
        すでにログイン済みの場合はこの手順は不要です。
      </p>

      <h2 className="mt-10 text-xl font-bold">2. デプロイする</h2>
      <p className="mt-3 leading-relaxed">
        <code className="rounded bg-muted px-1.5 py-0.5 text-xs">bun create hono@latest</code>
        で作成したプロジェクトには、すでにデプロイ用のscriptが入っています。
      </p>
      <CopyBlock lang="bash" title="ターミナル" code={`bun run deploy`} />
      <p className="mt-3 leading-relaxed">
        内部的には<code className="rounded bg-muted px-1.5 py-0.5 text-xs">wrangler deploy</code>
        が実行されます。しばらく待つと、次のようなURLが表示されます。
      </p>
      <CopyBlock
        lang="text"
        title="出力例"
        code={`Uploaded backend (x.xx sec)
Deployed backend triggers (x.xx sec)
  https://backend.あなたのサブドメイン.workers.dev
Current Version ID: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`}
      />

      <h2 className="mt-10 text-xl font-bold">3. 本番URLで動作確認する</h2>
      <p className="mt-3 leading-relaxed">
        表示されたURLに対して、今までlocalhostで試していたのと同じようにcurlしてみましょう。
      </p>
      <CopyBlock
        lang="bash"
        title="ターミナル"
        code={`curl https://backend.あなたのサブドメイン.workers.dev/api/items`}
      />
      <p className="mt-3 leading-relaxed">
        第3回で本番D1に投入した商品データが返ってくれば、デプロイは成功です。
        「開発サーバーを起動しているPCの電源を切っても」このURLはずっと動き続けます。
      </p>

      <Callout variant="tip" title="第1回のデプロイと同じ仕組み">
        <p>
          教材サイト自体（このWebページ）もCloudflare Pagesにデプロイされていますが、今回のbackendは
          <span className="font-medium">Cloudflare Workers</span>という別のサービスにデプロイします。
          Pagesは主に静的なフロントエンド、Workersはこのようなサーバーサイドのプログラムを動かす場所と考えると
          整理しやすいです。
        </p>
      </Callout>

      <h2 className="mt-10 text-xl font-bold">理解度チェック</h2>
      <Quiz
        question="wrangler loginは何のための操作？"
        choices={[
          "自分のCloudflareアカウントに対して、デプロイなどの操作を許可するための認証",
          "D1データベースのパスワードを設定する操作",
          "GitHubリポジトリとCloudflareを連携する操作",
        ]}
        answerIndex={0}
        explanation="wrangler loginは、ローカルのwranglerコマンドがあなたのCloudflareアカウントを操作できるように認証する手順です。ログインしていないとwrangler deployやd1コマンドは実行できません。"
      />

      <h2 className="mt-10 text-xl font-bold">よくあるつまずき</h2>
      <ul className="mt-3 list-disc space-y-2 pl-6 text-sm leading-relaxed">
        <li>
          学校・会社のネットワークでブラウザ認可がブロックされる → 個人のスマホのテザリングなど、
          別のネットワークで試すか、別の端末でログインを済ませてから戻ってきましょう。
        </li>
        <li>
          デプロイ後もlocalhost:3000を叩き続けて「反映されない」と混乱する →
          デプロイ後は、表示された<code className="rounded bg-muted px-1.5 py-0.5 text-xs">workers.dev</code>
          のURLに対してアクセスする必要があります。localhostはあくまで開発用サーバーです。
        </li>
      </ul>

      <ProgressCheck id="s4-02-deploy" label="Cloudflare Workersにbackendをデプロイし、本番URLで動作確認できた" />
      <NextLink current="/session4/02-deploy" />
    </div>
  );
}
