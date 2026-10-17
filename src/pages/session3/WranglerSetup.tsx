import { PageHeader } from "@/components/PageHeader";
import { Callout } from "@/components/Callout";
import { Quiz } from "@/components/Quiz";
import { ProgressCheck } from "@/components/ProgressCheck";
import { NextLink } from "@/components/NextLink";
import { CopyBlock } from "@/components/CopyBlock";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function WranglerSetup() {
  return (
    <div>
      <PageHeader
        title="wrangler環境のセットアップ"
        chapter="02"
        goal="wranglerを導入し、開発サーバーをwrangler dev（Cloudflareと同じランタイム）で起動できている"
        minutes={20}
      />

      <Callout variant="quest">
        <p>
          D1を使うには、まず「Cloudflareと同じ実行環境」を手元に用意する必要があります。
          そのための道具が<span className="font-medium">wrangler</span>（ラングラー）です。
          このページではまだデータベースの中身には触りません。お店を建てる前の地ならしだと思って進めてください。
        </p>
      </Callout>

      <h2 className="mt-8 text-xl font-bold">1. なぜwranglerが必要なのか</h2>
      <p className="mt-3 leading-relaxed">
        第1回・第2回の<code className="rounded bg-muted px-1.5 py-0.5 text-xs">bun run dev</code>
        は、BunがそのままHonoのコードを実行していました。
        一方これから使うD1は、<span className="font-medium">Cloudflare Workersのランタイム（workerd）が
        <code className="rounded bg-muted px-1.5 py-0.5 text-xs">c.env.DB</code>として渡してくれる</span>
        仕組みです。つまりBunで直接実行している間は、設定をどれだけ正しく書いても
        <code className="rounded bg-muted px-1.5 py-0.5 text-xs">c.env.DB</code>は存在しません。
      </p>
      <p className="mt-3 leading-relaxed">
        <code className="rounded bg-muted px-1.5 py-0.5 text-xs">wrangler</code>
        は、そのworkerdを手元で動かすためのCloudflare公式のコマンドラインツールです。
        第3回からは、開発サーバーもwrangler経由で起動します。
      </p>
      <div className="mt-4 overflow-hidden rounded-lg border">
        <table className="w-full text-sm">
          <thead className="border-b border-gold bg-secondary/60 font-serif">
            <tr>
              <th className="px-4 py-2 text-left font-medium">起動のしかた</th>
              <th className="px-4 py-2 text-left font-medium">実行環境</th>
              <th className="px-4 py-2 text-left font-medium">c.env.DB</th>
            </tr>
          </thead>
          <tbody className="[&>tr]:border-t">
            <tr>
              <td className="px-4 py-2">
                <code className="rounded bg-muted px-1.5 py-0.5 text-xs">bun run --hot src/index.ts</code>
                <span className="block text-xs text-muted-foreground">第1回・第2回のdev script</span>
              </td>
              <td className="px-4 py-2">Bun</td>
              <td className="px-4 py-2 font-medium text-destructive">使えない</td>
            </tr>
            <tr>
              <td className="px-4 py-2">
                <code className="rounded bg-muted px-1.5 py-0.5 text-xs">wrangler dev</code>
                <span className="block text-xs text-muted-foreground">第3回からのdev script</span>
              </td>
              <td className="px-4 py-2">workerd（Cloudflareと同じ）</td>
              <td className="px-4 py-2 font-medium">使える</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 className="mt-10 text-xl font-bold">2. Node.js（v22以上）を用意する</h2>
      <p className="mt-3 leading-relaxed">
        wranglerのコマンド本体はNode.jsで動きます。この講座ではここまでBunだけで進めてきましたが、
        wranglerを使うにはNode.jsのv22以上が別途必要です。まずは入っているか確認しましょう。
      </p>
      <CopyBlock lang="bash" title="確認" code={`node -v`} />
      <p className="mt-3 leading-relaxed">
        <code className="rounded bg-muted px-1.5 py-0.5 text-xs">v22.x.x</code>
        以上が表示されればOKです。表示されない・バージョンが古い場合は、次のいずれかでインストールしてください。
      </p>
      <Tabs defaultValue="mac" className="mt-4">
        <TabsList>
          <TabsTrigger value="mac">macOS / Linux</TabsTrigger>
          <TabsTrigger value="win">Windows</TabsTrigger>
        </TabsList>
        <TabsContent value="mac">
          <CopyBlock lang="bash" title="Homebrewを使う場合" code={`brew install node`} />
          <p className="mt-2 text-sm leading-relaxed">
            Homebrewを使っていない場合は、
            <a
              href="https://nodejs.org/"
              target="_blank"
              rel="noreferrer"
              className="text-primary underline-offset-4 hover:underline"
            >
              Node.js公式サイト
            </a>
            のLTS版インストーラーを使うのが簡単です。
          </p>
        </TabsContent>
        <TabsContent value="win">
          <CopyBlock lang="powershell" title="PowerShell（wingetを使う場合）" code={`winget install OpenJS.NodeJS.LTS`} />
          <p className="mt-2 text-sm leading-relaxed">
            うまくいかない場合は、
            <a
              href="https://nodejs.org/"
              target="_blank"
              rel="noreferrer"
              className="text-primary underline-offset-4 hover:underline"
            >
              Node.js公式サイト
            </a>
            のLTS版インストーラー（.msi）を使ってください。インストール後はターミナルを開き直します。
          </p>
        </TabsContent>
      </Tabs>
      <Callout variant="info" title="BunとNode.jsは共存できる">
        <p>
          Node.jsを入れても、これまでの進め方は変わりません。パッケージの追加は
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">bun add</code>、
          テストは<code className="rounded bg-muted px-1.5 py-0.5 text-xs">bun test</code>
          のままで、Node.jsはwranglerコマンドの内部で使われるだけです。
        </p>
      </Callout>

      <h2 className="mt-10 text-xl font-bold">3. wranglerをインストールする</h2>
      <p className="mt-3 leading-relaxed">
        第1回で選んだ<code className="rounded bg-muted px-1.5 py-0.5 text-xs">bun</code>
        テンプレートにはwranglerが含まれていないので、開発用の依存として自分で追加します。
      </p>
      <CopyBlock lang="bash" title="ターミナル（backendディレクトリで）" code={`bun add -D wrangler`} />
      <p className="mt-3 leading-relaxed">入ったかどうかは、バージョン表示で確認できます。</p>
      <CopyBlock lang="bash" title="確認" code={`bun wrangler --version`} />
      <p className="mt-3 leading-relaxed">
        <code className="rounded bg-muted px-1.5 py-0.5 text-xs">4.x.x</code>
        のようなバージョンが表示されればOKです。
      </p>

      <h2 className="mt-10 text-xl font-bold">4. wrangler.jsoncを作る</h2>
      <p className="mt-3 leading-relaxed">
        <code className="rounded bg-muted px-1.5 py-0.5 text-xs">wrangler.jsonc</code>
        は、wranglerに「何を」「どう動かすか」を伝える設定ファイルです。これもbunテンプレートには
        入っていないので、<span className="font-medium">backendディレクトリの直下に新規作成</span>します。
      </p>
      <CopyBlock
        lang="jsonc"
        title="backend/wrangler.jsonc（新規作成）"
        code={`{
  "$schema": "node_modules/wrangler/config-schema.json",
  "name": "backend",
  "main": "src/index.ts",
  "compatibility_date": "2026-10-01"
}`}
      />
      <ul className="mt-3 list-disc space-y-2 pl-6 text-sm leading-relaxed">
        <li>
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">name</code>
          … Workerの名前。第4回でデプロイしたときの公開URLにも使われます。
        </li>
        <li>
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">main</code>
          … アプリの入口になるファイル。<code className="rounded bg-muted px-1.5 py-0.5 text-xs">src/index.ts</code>
          が<code className="rounded bg-muted px-1.5 py-0.5 text-xs">export default app</code>
          しているので、ここを指定します。
        </li>
        <li>
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">compatibility_date</code>
          … ランタイムの挙動の基準日。作業している日の日付を入れておけば大丈夫です
          （新しすぎて警告が出る場合は、少し前の日付にしてください）。
        </li>
      </ul>

      <h2 className="mt-10 text-xl font-bold">5. 開発サーバーをwrangler devに切り替える</h2>
      <p className="mt-3 leading-relaxed">
        <code className="rounded bg-muted px-1.5 py-0.5 text-xs">backend/package.json</code>
        を開いて、<code className="rounded bg-muted px-1.5 py-0.5 text-xs">scripts</code>
        の中身を書き換えます（元は
        <code className="rounded bg-muted px-1.5 py-0.5 text-xs">"dev": "bun run --hot src/index.ts"</code>
        のようになっているはずです）。
      </p>
      <CopyBlock
        lang="jsonc"
        title="backend/package.json（scriptsを書き換え）"
        code={`{
  // ...既存の設定...
  "scripts": {
    "dev": "wrangler dev --port 3000",
    "deploy": "wrangler deploy"
  }
}`}
      />
      <ul className="mt-3 list-disc space-y-2 pl-6 text-sm leading-relaxed">
        <li>
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">--port 3000</code>
          … wrangler devの既定ポートは8787番なので、第1回からの約束（APIは3000番）に合わせて指定します。
          これを忘れるとフロントエンドからつながりません。
        </li>
        <li>
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">deploy</code>
          … 第4回のデプロイで使うscriptです。ここで一緒に足しておきます。
        </li>
      </ul>
      <p className="mt-3 leading-relaxed">
        書き換えたら、これまでと同じコマンドで起動できます（中身がwrangler devに変わっただけです）。
      </p>
      <CopyBlock lang="bash" title="ターミナル（backendディレクトリで）" code={`bun run dev`} />
      <p className="mt-3 leading-relaxed">
        ターミナルの表示がwranglerのものに変わり、
        <a
          href="http://localhost:3000"
          target="_blank"
          rel="noreferrer"
          className="text-primary underline-offset-4 hover:underline"
        >
          http://localhost:3000
        </a>
        で今までどおり<span className="font-medium">「Hello Hono!」</span>
        が表示されれば成功です。第2回で作ったSwagger UI（
        <code className="rounded bg-muted px-1.5 py-0.5 text-xs">/doc</code>
        ）も、そのまま同じように見られます。
      </p>

      <Callout variant="tip" title="ホットリロードもそのまま使える">
        <p>
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">wrangler dev</code>
          もファイルの保存を検知して自動で読み込み直します。起動したままコードを編集してOKです。
          設定ファイル（<code className="rounded bg-muted px-1.5 py-0.5 text-xs">wrangler.jsonc</code>）
          を変えたときだけ、Ctrl+Cで止めて起動し直してください。
        </p>
      </Callout>
      <Callout variant="warn" title="このあとD1で500エラーが出たら、まずここを疑う">
        <p>
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">
            TypeError: undefined is not an object (evaluating 'this.client.prepare')
          </code>
          のようなエラーでAPIが500になる場合、ほぼ確実に
          <span className="font-medium">Bunで直接起動したサーバー</span>（書き換え前のdev script）で
          動かしています。<code className="rounded bg-muted px-1.5 py-0.5 text-xs">c.env.DB</code>
          がundefinedなので、Drizzleがデータベースに触れないのです。
          起動しているサーバーがwrangler devかどうかを確認してください。
        </p>
      </Callout>

      <h2 className="mt-10 text-xl font-bold">理解度チェック</h2>
      <Quiz
        question="第3回から開発サーバーをwrangler devで起動するのはなぜ？"
        choices={[
          "D1のバインディング（c.env.DB）は、Cloudflareと同じランタイム（workerd）でしか注入されないから",
          "Bunで起動すると動作が遅く、D1の処理が間に合わないから",
          "wrangler devを使うと、コードを書かなくてもデータベースが自動生成されるから",
        ]}
        answerIndex={0}
        explanation="c.env.DBは、Workersのランタイムがアプリに渡してくれる値です。Bunがそのままコードを実行している状態では存在しないため、設定を正しく書いてもD1にはアクセスできません。"
      />

      <h2 className="mt-10 text-xl font-bold">よくあるつまずき</h2>
      <ul className="mt-3 list-disc space-y-2 pl-6 text-sm leading-relaxed">
        <li>
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">error: Script not found "wrangler"</code>
          → wranglerがインストールされていません。
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">bun add -D wrangler</code>
          をbackendディレクトリで実行したか確認してください（frontend側で実行していないかも要確認）。
        </li>
        <li>
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">Wrangler requires at least Node.js v22.0.0</code>
          → Node.jsが未導入か、バージョンが古いです。
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">node -v</code>
          を確認し、手順2でv22以上を入れてターミナルを開き直してください。
        </li>
        <li>
          8787番で起動してしまう →
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">--port 3000</code>
          の指定漏れです。フロントエンドは3000番を見ているので、このままだと画面からつながりません。
        </li>
        <li>
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">The entry-point ... was not found</code>
          のようなエラーで起動しない →
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">wrangler.jsonc</code>
          の<code className="rounded bg-muted px-1.5 py-0.5 text-xs">"main": "src/index.ts"</code>
          を書き忘れていないか確認しましょう。
        </li>
        <li>
          （Windows）<code className="rounded bg-muted px-1.5 py-0.5 text-xs">workerd.exe</code>
          の起動に失敗する（<code className="rounded bg-muted px-1.5 py-0.5 text-xs">access violation</code>
          や<code className="rounded bg-muted px-1.5 py-0.5 text-xs">vcruntime140_1.dll が見つかりません</code>）
          → workerdの実行に必要な
          <a
            href="https://aka.ms/vs/17/release/vc_redist.x64.exe"
            target="_blank"
            rel="noreferrer"
            className="text-primary underline-offset-4 hover:underline"
          >
            Microsoft Visual C++ 再頒布可能パッケージ（x64）
          </a>
          を入れて、ターミナルを開き直してください。
        </li>
        <li>
          Cloudflareのアカウントを求められる（<code className="rounded bg-muted px-1.5 py-0.5 text-xs">CLOUDFLARE_API_TOKEN</code>
          やブラウザのログイン画面） → 第3回はローカルだけで完結するので、ログインは不要です。
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">wrangler dev</code>
          やこの後の<code className="rounded bg-muted px-1.5 py-0.5 text-xs">--local</code>
          付きコマンド以外（<code className="rounded bg-muted px-1.5 py-0.5 text-xs">d1 create</code>、
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">d1 list</code>など）を実行していないか確認しましょう。
          アカウントの作成とログインは第4回で行います。
        </li>
      </ul>

      <ProgressCheck
        id="s3-02-wrangler-setup"
        label="wranglerを導入し、bun run dev（wrangler dev）でbackendを起動できた"
      />
      <NextLink current="/session3/02-wrangler-setup" />
    </div>
  );
}
