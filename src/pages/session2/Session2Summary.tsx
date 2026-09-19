import { PageHeader } from "@/components/PageHeader";
import { Callout } from "@/components/Callout";
import { ProgressCheck } from "@/components/ProgressCheck";
import { NextLink } from "@/components/NextLink";
import { MapPin } from "lucide-react";

export function Session2Summary() {
  return (
    <div>
      <PageHeader
        title="まとめ・次回予告"
        chapter="06"
        goal="第2回で作ったもの・学んだことを振り返り、次回への準備ができている"
        minutes={10}
      />

      <h2 className="text-xl font-bold">第2回で作ったもの</h2>
      <p className="mt-3 leading-relaxed">
        お疲れさまでした！よろず屋のAPIが「壊れにくいAPI」に育ちました。
        エンドポイントのURL自体は第1回と変わっていませんが、中身がしっかり守られています。
      </p>

      <div className="mt-4 overflow-hidden rounded-lg border">
        <table className="w-full text-sm">
          <thead className="border-b border-gold bg-secondary/60 font-serif">
            <tr>
              <th className="px-4 py-2 text-left font-medium">エンドポイント</th>
              <th className="px-4 py-2 text-left font-medium">第2回で加わったこと</th>
            </tr>
          </thead>
          <tbody className="[&>tr]:border-t">
            <tr>
              <td className="px-4 py-2"><code className="rounded bg-muted px-1.5 py-0.5 text-xs">POST /api/purchase</code></td>
              <td className="px-4 py-2">zodによるリクエスト検証（quantityは正の整数のみ）</td>
            </tr>
            <tr>
              <td className="px-4 py-2"><code className="rounded bg-muted px-1.5 py-0.5 text-xs">POST /api/sell</code></td>
              <td className="px-4 py-2">同上</td>
            </tr>
            <tr>
              <td className="px-4 py-2"><code className="rounded bg-muted px-1.5 py-0.5 text-xs">GET /doc</code></td>
              <td className="px-4 py-2">新規：OpenAPI仕様（JSON）を返す</td>
            </tr>
            <tr>
              <td className="px-4 py-2"><code className="rounded bg-muted px-1.5 py-0.5 text-xs">GET /ui</code></td>
              <td className="px-4 py-2">新規：Swagger UIでAPIドキュメントを閲覧・試用</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 className="mt-10 text-xl font-bold">今日学んだこと</h2>
      <ul className="mt-4 list-disc space-y-2 pl-6 text-sm leading-relaxed">
        <li>zodで「データの形のルール」をスキーマとして定義できる</li>
        <li>
          backendを<code className="rounded bg-muted px-1.5 py-0.5 text-xs">data.ts</code> /
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">schemas.ts</code> /
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">routes/</code>
          に分け、<code className="rounded bg-muted px-1.5 py-0.5 text-xs">app.route()</code>
          で<code className="rounded bg-muted px-1.5 py-0.5 text-xs">index.ts</code>に取り付けられる
        </li>
        <li>
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">@hono/zod-openapi</code>
          の<code className="rounded bg-muted px-1.5 py-0.5 text-xs">createRoute</code> +
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">.openapi()</code>
          で、ルート定義そのものにバリデーションを組み込める
        </li>
        <li>そのスキーマ情報から、Swagger UIのドキュメントが自動生成できる</li>
        <li>
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">testClient</code>
          で、サーバーを起動せずにAPIのテストコードが書ける
        </li>
      </ul>

      <Callout variant="quest" title="第3回の予告：データベースを導入しよう">
        <p>
          穴は塞ぎましたが、まだ大きな問題が残っています。
          <span className="font-medium">サーバーを再起動すると、所持金も在庫もすべて初期値に戻ってしまう</span>
          ことです（メモリ上の配列・オブジェクトで管理しているため）。
          第3回では、Cloudflare D1というデータベースと、Drizzle ORMというツールを使って、
          データがずっと残る仕組みを作ります。
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
              今回のcreateRouteで得た型情報は、RPC機能でフロントとも共有できます。まだの人はぜひ。
            </span>
          </span>
        </a>
        <a
          href="#/extra/glossary-2"
          className="flex items-start gap-3 rounded-lg border p-4 transition hover:bg-secondary/60"
        >
          <MapPin size={18} className="mt-0.5 shrink-0 text-primary" />
          <span>
            <span className="block font-medium">用語集（第2回）</span>
            <span className="mt-1 block text-sm text-muted-foreground">
              zod・OpenAPI・テストなど、今日出てきた用語もあわせて復習できます。
            </span>
          </span>
        </a>
      </div>

      <ProgressCheck id="s2-06-summary" label="第2回の内容を振り返り、次回の予習ができた" />
      <NextLink current="/session2/06-summary" />
    </div>
  );
}
