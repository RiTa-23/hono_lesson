import { PageHeader } from "@/components/PageHeader";
import { Callout } from "@/components/Callout";
import { Quiz } from "@/components/Quiz";
import { ProgressCheck } from "@/components/ProgressCheck";
import { NextLink } from "@/components/NextLink";
import { CopyBlock } from "@/components/CopyBlock";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function Setup() {
  return (
    <div>
      <PageHeader
        title="プロジェクトのセットアップ"
        chapter="03"
        goal="Bunをインストールし、講座用リポジトリをcloneして、Honoの開発サーバーが起動している"
        minutes={20}
      />

      <Callout variant="quest">
        <p>
          まずはお店のシステムを作る工事現場を整えましょう。完成済みのフロントエンド（店舗の外観）が入った
          リポジトリをcloneします。そのリポジトリの中に、フロントエンドと同じ階層にバックエンド
          （店の倉庫と窓口）をこれから建てていきます。
        </p>
      </Callout>

      <h2 className="mt-8 text-xl font-bold">1. Bunをインストールする</h2>
      <p className="mt-3 leading-relaxed">
        BunはNode.jsの代替となる高速なJavaScript実行環境です。
        パッケージのインストールもテストもこれ1つで行えます。
      </p>

      <Tabs defaultValue="mac" className="mt-4">
        <TabsList>
          <TabsTrigger value="mac">macOS / Linux</TabsTrigger>
          <TabsTrigger value="win">Windows</TabsTrigger>
        </TabsList>
        <TabsContent value="mac">
          <CopyBlock
            lang="bash"
            title="ターミナル"
            code={`curl -fsSL https://bun.sh/install | bash`}
          />
        </TabsContent>
        <TabsContent value="win">
          <CopyBlock
            lang="powershell"
            title="PowerShell"
            code={`powershell -c "irm bun.sh/install.ps1 | iex"`}
          />
        </TabsContent>
      </Tabs>

      <Callout variant="warn" title="Windowsの方は、ここから先はGit Bashで">
        <p>
          講座のコマンド（特にcurl）はMac/Linuxのターミナルと同じ書き方になっていて、
          PowerShellではそのまま動かないものがあります。Bunのインストールが終わったら、
          以降のコマンドはすべて<span className="font-medium">Git Bash</span>
          （Git for Windowsに付属）で実行してください。
        </p>
        <p className="mt-2">
          VS Codeのターミナルなら、右上の「＋」の横の「∨」から「Git Bash」を選べます。
          「既定のプロファイルの選択」でGit Bashにしておくと、毎回切り替えずに済みます。
        </p>
      </Callout>

      <p className="mt-3 leading-relaxed">
        インストール後、以下のコマンドでバージョンが表示されればOKです。
      </p>
      <CopyBlock
        lang="bash"
        title="確認"
        code={`bun --version`}
      />

      <h2 className="mt-10 text-xl font-bold">2. 講座用リポジトリをcloneする</h2>
      <p className="mt-3 leading-relaxed">
        任意のディレクトリに移動して、フロントエンド（React）が完成済みのリポジトリをcloneします。
      </p>
      <Tabs defaultValue="https" className="mt-4">
        <TabsList>
          <TabsTrigger value="https">HTTPS</TabsTrigger>
          <TabsTrigger value="ssh">SSH</TabsTrigger>
        </TabsList>
        <TabsContent value="https">
          <CopyBlock
            lang="bash"
            title="ターミナル"
            code={`git clone https://github.com/RiTa-23/yorozuya.git`}
          />
        </TabsContent>
        <TabsContent value="ssh">
          <CopyBlock
            lang="bash"
            title="ターミナル"
            code={`git clone git@github.com:RiTa-23/yorozuya.git`}
          />
        </TabsContent>
      </Tabs>
      <Callout variant="info" title="cloneするときのポイント">
        <p>
          SSHはGitHubに事前にSSH鍵を登録している人向けです。
          特に準備していない場合は<span className="font-medium">HTTPS</span>を選んでください。
        </p>
        <p className="mt-2">
          clone先は日本語やスペースを含まないパスがおすすめです
          （例: <code className="rounded bg-muted px-1.5 py-0.5 text-xs">~/Develop</code> や
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">C:\Develop</code>）。
        </p>
      </Callout>
      <p className="mt-3 leading-relaxed">cloneが完了したらディレクトリに移動します。</p>
      <CopyBlock
        lang="bash"
        title="ターミナル"
        code={`cd yorozuya`}
      />
      <p className="mt-3 leading-relaxed">cloneしたリポジトリの構成はこうなっています。</p>
      <CopyBlock
        lang="text"
        title="リポジトリ構成"
        code={`yorozuya/\n├── frontend/   # 完成済みのReactアプリ（店舗の外観）\n└── backend/    # ← これから自分で作ります（倉庫と窓口）`}
      />

      <h2 className="mt-10 text-xl font-bold">3. VS Codeでプロジェクトを開く</h2>
      <p className="mt-3 leading-relaxed">
        環境が整いました。ここからは<span className="font-medium">VS Codeで作業をしていきます！</span>
        いまターミナルで開いているディレクトリ（<code className="rounded bg-muted px-1.5 py-0.5 text-xs">yorozuya</code>）を
        そのままVS Codeで開くには、次のコマンドを実行します。
      </p>
      <CopyBlock
        lang="bash"
        title="ターミナル"
        code={`code .`}
      />
      <p className="mt-3 leading-relaxed">
        <code className="rounded bg-muted px-1.5 py-0.5 text-xs">.</code> は「今いるディレクトリ」の意味です。
        VS Codeが起動して、左のサイドバー（エクスプローラー）に
        <code className="rounded bg-muted px-1.5 py-0.5 text-xs">frontend/</code>
        が見えればOKです（<code className="rounded bg-muted px-1.5 py-0.5 text-xs">backend/</code>
        は次のステップで作るので、まだありません）。
        これ以降は「<span className="font-medium">ファイルの編集はVS Code、コマンド実行はターミナル</span>」という
        使い分けで進めていきます。
      </p>
      <Callout variant="tip" title="「code .」が効かないときは">
        <p>
          VS Code本体は入っているのに、codeコマンドだけがターミナルから認識されていない状態です。
          まずはVS Codeを普通に起動して、「File → Open Folder」からyorozuyaフォルダを選んでもOKです。
        </p>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <span className="font-medium">macOS:</span> VS Codeを開き、Cmd+Shift+Pでコマンドパレットを出して
            「Shell Command: Install 'code' command in PATH」を実行すると、次回からcodeコマンドが使えます。
          </li>
          <li>
            <span className="font-medium">Windows:</span> Git Bashを一度閉じて開き直すと認識されることが多いです。
            それでもダメな場合は、VS Codeのインストーラーで「PATHへの追加（Add to PATH）」に
            チェックが入っているか確認してください。
          </li>
        </ul>
      </Callout>

      <h2 className="mt-10 text-xl font-bold">4. backendディレクトリにHonoを作成する</h2>
      <p className="mt-3 leading-relaxed">
        HonoにはBun用のプロジェクト作成コマンドが用意されています。
        <code className="rounded bg-muted px-1.5 py-0.5 text-xs">yorozuya</code>
        ディレクトリにいる状態で、次のコマンドを実行してください。
      </p>
      <CopyBlock
        lang="bash"
        title="ターミナル"
        code={`bun create hono@latest backend`}
      />
      <p className="mt-3 leading-relaxed">
        いくつか質問されるので、以下のように答えます。
      </p>
      <div className="mt-4 overflow-hidden rounded-lg border">
        <table className="w-full text-sm">
          <thead className="border-b border-gold bg-secondary/60 font-serif">
            <tr>
              <th className="px-4 py-2 text-left font-medium">質問</th>
              <th className="px-4 py-2 text-left font-medium">回答</th>
            </tr>
          </thead>
          <tbody className="[&>tr]:border-t">
            <tr>
              <td className="px-4 py-2">Which template do you want to use?</td>
              <td className="px-4 py-2 font-medium">bun</td>
            </tr>
            <tr>
              <td className="px-4 py-2">Do you want to install project dependencies?</td>
              <td className="px-4 py-2 font-medium">yes</td>
            </tr>
            <tr>
              <td className="px-4 py-2">Which package manager do you want to use?</td>
              <td className="px-4 py-2 font-medium">bun</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="mt-3 leading-relaxed">
        この講座で使うパッケージマネージャは <span className="font-medium">Bun</span> です
        （上の質問で「bun」を選んだのはそのためです）。
        1つ目のステップではBunを「実行環境」と紹介しましたが、実はBunは
        実行環境とパッケージマネージャの<span className="font-medium">両方の役割を1つで兼ねる</span>
        オールインワンの道具です。
      </p>
      <p className="mt-3 leading-relaxed">
        パッケージマネージャとは、ライブラリ（部品）のインストールや更新を管理する道具のこと。
        Bunを選ぶと、部品の追加も
        <code className="rounded bg-muted px-1.5 py-0.5 text-xs">bun add 部品名</code>
        の1コマンドで完結します（第2回以降で使います）。
      </p>

      <h2 className="mt-10 text-xl font-bold">5. 開発サーバーを起動する</h2>
      <p className="mt-3 leading-relaxed">
        作成されたbackendディレクトリに移動して、開発サーバーを起動します。
      </p>
      <CopyBlock
        lang="bash"
        title="ターミナル"
        code={`cd backend\nbun run dev`}
      />
      <p className="mt-3 leading-relaxed">
        ブラウザで
        <a
          href="http://localhost:3000"
          target="_blank"
          rel="noreferrer"
          className="text-primary underline-offset-4 hover:underline"
        >
          http://localhost:3000
        </a>
        を開いて、<span className="font-medium">「Hello Hono!」</span>と表示されれば成功です。
      </p>

      <Callout variant="tip" title="ホットリロード">
        <p>
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">bun run dev</code>
          で起動したサーバーは、ファイルを保存するたびに自動で再起動されます。
          起動したままコードを編集してOKです。
        </p>
      </Callout>

      <h2 className="mt-10 text-xl font-bold">理解度チェック</h2>
      <Quiz
        question="Bunの説明として正しいものはどれ？"
        choices={[
          "Node.jsの代替となるJavaScript実行環境で、パッケージ管理の役割も兼ねる",
          "Honoの機能を拡張するためのプラグインの一種",
          "TypeScriptをJavaScriptに変換するためだけの変換ツール",
        ]}
        answerIndex={0}
        explanation="Bunは「JavaScriptを実行する環境」と「パッケージのインストール・管理」の両方を1つでこなすオールインワンの道具です。Honoのプラグインではなく、Honoが動く土台（実行環境）にあたります。"
      />

      <h2 className="mt-10 text-xl font-bold">よくあるつまずき</h2>
      <ul className="mt-3 list-disc space-y-2 pl-6 text-sm leading-relaxed">
        <li>
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">bun: command not found</code>
          → ターミナルを開き直すか、インストール時に表示されたPATH設定のコマンドを実行してください。
          WindowsでPowerShellからインストールした直後は、Git Bashも一度開き直すと認識されます。
        </li>
        <li>
          ポート3000がすでに使われている → ポートは「パソコンの中の番地」のようなものです。
          今回の講座では3000番はAPI（Hono）、5173番はフロント（Vite）が使う番地となっています。
          ほかの開発サーバーが3000を使っている場合は、そのプロセスを止めるか、
          教えてもらった別ポートを使ってください。
        </li>
        <li>
          「Hello Hono!」が表示されない → ブラウザのアドレスが
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">localhost:3000</code>
          になっているか、ターミナルにエラーが出ていないか確認しましょう。
        </li>
        <li>
          macOSで「着信接続を許可しますか？」というダイアログが出る → 初回起動時にファイアウォールが確認するものです。「許可」を選べば問題ありません。
        </li>
      </ul>

      <Callout variant="info" title="参考リンク">
        <ul className="list-disc space-y-1 pl-5">
          <li>
            <a
              href="https://bun.sh/docs/installation"
              target="_blank"
              rel="noreferrer"
              className="text-primary underline-offset-4 hover:underline"
            >
              Bun 公式ドキュメント（インストール）
            </a>
          </li>
          <li>
            <a
              href="https://hono.dev/docs/getting-started/bun"
              target="_blank"
              rel="noreferrer"
              className="text-primary underline-offset-4 hover:underline"
            >
              Hono 公式ドキュメント（Bunでのはじめ方）
            </a>
          </li>
        </ul>
      </Callout>

      <ProgressCheck id="s1-03-setup" label="Bunをインストールし、backendの開発サーバーが起動できた" />
      <NextLink current="/session1/03-setup" />
    </div>
  );
}
