import { PageHeader } from "@/components/PageHeader";
import { Callout } from "@/components/Callout";
import { ProgressCheck } from "@/components/ProgressCheck";
import { NextLink } from "@/components/NextLink";
import { MapPin } from "lucide-react";

export function Session3Summary() {
  return (
    <div>
      <PageHeader
        title="まとめ・次回予告"
        chapter="09"
        goal="第3回で作ったもの・学んだことを振り返り、次回への準備ができている"
        minutes={10}
      />

      <h2 className="text-xl font-bold">第3回で作ったもの</h2>
      <p className="mt-3 leading-relaxed">
        お疲れさまでした！よろず屋のデータが、ようやく「消えないデータ」になりました。
        エンドポイントのURLとレスポンスの形は第1・2回のまま、中身の実装だけをD1に置き換えています。
      </p>

      <div className="mt-4 overflow-hidden rounded-lg border">
        <table className="w-full text-sm">
          <thead className="border-b border-gold bg-secondary/60 font-serif">
            <tr>
              <th className="px-4 py-2 text-left font-medium">エンドポイント</th>
              <th className="px-4 py-2 text-left font-medium">第3回で変わったこと</th>
            </tr>
          </thead>
          <tbody className="[&>tr]:border-t">
            <tr>
              <td className="px-4 py-2"><code className="rounded bg-muted px-1.5 py-0.5 text-xs">GET /api/items</code></td>
              <td className="px-4 py-2">配列からD1（items テーブル）を読み取るように変更</td>
            </tr>
            <tr>
              <td className="px-4 py-2"><code className="rounded bg-muted px-1.5 py-0.5 text-xs">GET /api/items/:id</code></td>
              <td className="px-4 py-2">同上</td>
            </tr>
            <tr>
              <td className="px-4 py-2"><code className="rounded bg-muted px-1.5 py-0.5 text-xs">POST /api/purchase</code></td>
              <td className="px-4 py-2">在庫・所持金・所持アイテムをD1に読み書きするように変更</td>
            </tr>
            <tr>
              <td className="px-4 py-2"><code className="rounded bg-muted px-1.5 py-0.5 text-xs">POST /api/sell</code></td>
              <td className="px-4 py-2">同上</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 className="mt-10 text-xl font-bold">今日学んだこと</h2>
      <ul className="mt-4 list-disc space-y-2 pl-6 text-sm leading-relaxed">
        <li>D1（Cloudflareのデータベース）とDrizzle ORMの役割の違い</li>
        <li>
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">c.env.DB</code>
          はCloudflareのランタイム（workerd）が渡す値なので、開発サーバーも
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">wrangler dev</code>
          で起動する必要がある
        </li>
        <li>
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">wrangler.jsonc</code>
          のd1_databases（binding / database_name / database_id / migrations_dir）の役割
        </li>
        <li>
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">sqliteTable</code>
          でテーブルのスキーマをTypeScriptで定義できる
        </li>
        <li>
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">drizzle-kit generate</code>
          →<code className="rounded bg-muted px-1.5 py-0.5 text-xs">wrangler d1 migrations apply</code>
          という、マイグレーションの流れ
        </li>
        <li>
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">db.select() / update() / insert()</code>
          で、SQLをTypeScriptのメソッドチェーンとして書ける
        </li>
        <li>APIのレスポンス契約さえ守れば、実装（メモリ→D1）が変わってもフロントは無傷でいられる</li>
        <li>
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">testClient(app, {'{ DB }'})</code>
          のようにテスト側からバインディングを渡せば、D1を使うAPIも
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">bun test</code>
          でテストできる（ふるまいをテストしていたので、第2回のexpectはそのまま使えた）
        </li>
      </ul>

      <Callout variant="info" title="次回までに用意しておくこと">
        <p>
          第4回ではCloudflareのアカウントが必要になります。まだ持っていない人は、
          <a
            href="https://dash.cloudflare.com/sign-up"
            target="_blank"
            rel="noreferrer"
            className="text-primary underline-offset-4 hover:underline"
          >
            Cloudflareの登録ページ
          </a>
          から無料アカウントを作っておくと、当日スムーズに進められます
          （クレジットカードの登録は不要です）。
        </p>
      </Callout>

      <Callout variant="quest" title="第4回の予告：本番デプロイでよろず屋を開店しよう">
        <p>
          ここまでの作業は、すべて<code className="rounded bg-muted px-1.5 py-0.5 text-xs">--local</code>
          フラグ付き、つまり手元のシミュレーション環境の中だけで完結しています。
          Cloudflare上の本物のD1は、まだ1つも作っていません。
          第4回では、Cloudflareアカウントでのログインから始めて、本番D1の作成・マイグレーションと
          Cloudflare Workersへのデプロイを行い、
          世界中の冒険者がアクセスできる「本物のよろず屋」を開店させます。
        </p>
      </Callout>

      <h2 className="mt-10 text-xl font-bold">余裕がある人へ（サブクエスト）</h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <a
          href="#/extra/rpc"
          className="flex items-start gap-3 rounded-lg border p-4 transition hover:bg-secondary/60"
        >
          <MapPin size={18} className="mt-0.5 shrink-0 text-primary" />
          <span>
            <span className="block font-medium">RPCで型安全な連携</span>
            <span className="mt-1 block text-sm text-muted-foreground">
              まだ試していない人は、D1化した今のAPIで改めて試してみるのもおすすめです。
            </span>
          </span>
        </a>
        <a
          href="#/extra/glossary-3"
          className="flex items-start gap-3 rounded-lg border p-4 transition hover:bg-secondary/60"
        >
          <MapPin size={18} className="mt-0.5 shrink-0 text-primary" />
          <span>
            <span className="block font-medium">用語集（第3回）</span>
            <span className="mt-1 block text-sm text-muted-foreground">
              D1・Drizzle・マイグレーションなど、今回出てきた用語もあわせて復習できます。
            </span>
          </span>
        </a>
      </div>

      <ProgressCheck id="s3-09-summary" label="第3回の内容を振り返り、次回の予習ができた" />
      <NextLink current="/session3/09-summary" />
    </div>
  );
}
