import { PageHeader } from "@/components/PageHeader";
import { Callout } from "@/components/Callout";
import { ProgressCheck } from "@/components/ProgressCheck";
import { NextLink } from "@/components/NextLink";
import { CopyBlock } from "@/components/CopyBlock";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function Setup() {
  return (
    <div>
      <PageHeader
        title="プロジェクトのセットアップ"
        goal="Bunをインストールし、講座用リポジトリをcloneして、Honoの開発サーバーが起動している"
        minutes={20}
      />

      <Callout variant="quest">
        <p>
          まずはDX化の工事現場を作りましょう。完成済みのフロントエンド（店舗の外観）が入った
          リポジトリをcloneして、その隣にバックエンド（店の倉庫とレジ）を建てます。
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

      <p className="mt-3 leading-relaxed">
        インストール後、バージョンが表示されればOKです。
      </p>
      <CopyBlock
        lang="bash"
        title="確認"
        code={`bun --version\n# 例: 1.1.38 のように表示されればOK`}
      />

      <h2 className="mt-10 text-xl font-bold">2. 講座用リポジトリをcloneする</h2>
      <p className="mt-3 leading-relaxed">
        フロントエンド（React）が完成済みのリポジトリをcloneします。
        URLは当日案内されるものを使ってください。
      </p>
      <CopyBlock
        lang="bash"
        title="ターミナル"
        code={`git clone <当日案内されるリポジトリURL> yorozuya\ncd yorozuya`}
      />
      <p className="mt-3 leading-relaxed">cloneしたリポジトリの構成はこうなっています。</p>
      <CopyBlock
        lang="text"
        title="リポジトリ構成"
        code={`yorozuya/\n├── frontend/   # 完成済みのReactアプリ（店舗の外観）\n└── backend/    # ← これから自分で作ります（倉庫とレジ）`}
      />

      <Callout variant="info" title="clone先フォルダについて">
        <p>
          日本語やスペースを含まないパスにcloneするのがおすすめです
          （例: <code className="rounded bg-muted px-1.5 py-0.5 text-xs">~/Develop</code> や
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">C:\Develop</code>）。
        </p>
      </Callout>

      <h2 className="mt-10 text-xl font-bold">3. backendディレクトリにHonoを作成する</h2>
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
          <thead className="bg-muted">
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

      <h2 className="mt-10 text-xl font-bold">4. 開発サーバーを起動する</h2>
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

      <h2 className="mt-10 text-xl font-bold">よくあるつまずき</h2>
      <ul className="mt-3 list-disc space-y-2 pl-6 text-sm leading-relaxed">
        <li>
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">bun: command not found</code>
          → ターミナルを開き直すか、インストール時に表示されたPATH設定のコマンドを実行してください。
        </li>
        <li>
          ポート3000がすでに使われている → ほかの開発サーバー（Viteなど）が3000を使っている可能性があります。
          そのプロセスを止めるか、教えてもらった別ポートを使ってください。
        </li>
        <li>
          「Hello Hono!」が表示されない → ブラウザのアドレスが
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">localhost:3000</code>
          になっているか、ターミナルにエラーが出ていないか確認しましょう。
        </li>
      </ul>

      <ProgressCheck id="s1-03-setup" label="Bunをインストールし、backendの開発サーバーが起動できた" />
      <NextLink current="/session1/03-setup" />
    </div>
  );
}
