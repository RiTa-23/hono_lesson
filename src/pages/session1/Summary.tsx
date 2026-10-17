import { PageHeader } from "@/components/PageHeader";
import { Callout } from "@/components/Callout";
import { ProgressCheck } from "@/components/ProgressCheck";
import { NextLink } from "@/components/NextLink";
import { MapPin } from "lucide-react";

export function Summary() {
  return (
    <div>
      <PageHeader
        title="まとめ・次回予告"
        chapter="08"
        goal="第1回で作ったもの・学んだことを振り返り、次回への準備ができている"
        minutes={10}
      />

      <h2 className="text-xl font-bold">第1回で作ったもの</h2>
      <p className="mt-3 leading-relaxed">
        お疲れさまでした！よろず屋のネット販売システム（API + フロント連携）が開店しました。
        今日のお店にできた窓口（エンドポイント）はこちらです。
      </p>

      <div className="mt-4 overflow-hidden rounded-lg border">
        <table className="w-full text-sm">
          <thead className="border-b border-gold bg-secondary/60 font-serif">
            <tr>
              <th className="px-4 py-2 text-left font-medium">エンドポイント</th>
              <th className="px-4 py-2 text-left font-medium">役割</th>
            </tr>
          </thead>
          <tbody className="[&>tr]:border-t">
            <tr>
              <td className="px-4 py-2">
                <code className="rounded bg-muted px-1.5 py-0.5 text-xs">GET /api/items</code>
              </td>
              <td className="px-4 py-2">商品一覧を返す（<code className="rounded bg-muted px-1.5 py-0.5 text-xs">?maxPrice=</code> で価格の絞り込み）</td>
            </tr>
            <tr>
              <td className="px-4 py-2">
                <code className="rounded bg-muted px-1.5 py-0.5 text-xs">GET /api/items/:id</code>
              </td>
              <td className="px-4 py-2">商品を1件返す（なければ404）</td>
            </tr>
            <tr>
              <td className="px-4 py-2">
                <code className="rounded bg-muted px-1.5 py-0.5 text-xs">GET /api/player</code>
              </td>
              <td className="px-4 py-2">所持金・所持アイテムを返す</td>
            </tr>
            <tr>
              <td className="px-4 py-2">
                <code className="rounded bg-muted px-1.5 py-0.5 text-xs">POST /api/purchase</code>
              </td>
              <td className="px-4 py-2">アイテムを購入する</td>
            </tr>
            <tr>
              <td className="px-4 py-2">
                <code className="rounded bg-muted px-1.5 py-0.5 text-xs">POST /api/sell</code>
              </td>
              <td className="px-4 py-2">アイテムを売却する（買取半額）</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 className="mt-10 text-xl font-bold">今日学んだこと</h2>
      <ul className="mt-4 list-disc space-y-2 pl-6 text-sm leading-relaxed">
        <li>APIは「お願い（リクエスト）にお返事（レスポンス）を返す窓口」</li>
        <li>Honoは必要な機能が全部入り（Batteries Included）のフレームワーク</li>
        <li>
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">app.get / app.post</code>
          で窓口を作り、<code className="rounded bg-muted px-1.5 py-0.5 text-xs">c.json()</code> で返す
        </li>
        <li>
          パスパラメータ（<code className="rounded bg-muted px-1.5 py-0.5 text-xs">c.req.param()</code>）・
          クエリパラメータ（<code className="rounded bg-muted px-1.5 py-0.5 text-xs">c.req.query()</code>）・
          リクエストボディ（<code className="rounded bg-muted px-1.5 py-0.5 text-xs">await c.req.json()</code>）の受け取り方
        </li>
        <li>ステータスコード（200 / 400 / 404）で結果の種類を伝える</li>
        <li>CORSミドルウェアで別オリジンのフロントエンドとつなぐ</li>
      </ul>

      <h2 className="mt-10 text-xl font-bold">第2回の予告：堅牢なAPIにしよう</h2>
      <p className="mt-3 leading-relaxed">
        今日作ったAPIには、実は穴があります。たとえば
        <code className="rounded bg-muted px-1.5 py-0.5 text-xs">quantity</code> に
        マイナスの数を送られると、<span className="font-medium">お金が増えてしまう</span>かもしれません。
        第2回では、この穴を塞ぐ技術を学びます。
      </p>
      <ul className="mt-3 list-disc space-y-2 pl-6 text-sm leading-relaxed">
        <li>
          <span className="font-medium">zod</span> … リクエストの中身を検査（バリデーション）して、おかしな注文を入口で断る
        </li>
        <li>
          <span className="font-medium">OpenAPI + Swagger UI</span> … コードからAPIの仕様書（ドキュメント）を自動生成する
        </li>
        <li>
          <span className="font-medium">テストコード</span> … 「購入したら在庫が減る」といったお店のルールを自動で検査する
        </li>
      </ul>

      <Callout variant="quest" title="第3回・第4回の予告">
        <p>
          今のよろず屋は、店じまい（サーバー停止）するとすべてを忘れてしまいます。
          第3回はCloudflare D1とDrizzle ORMでデータを永続化し、再起動してもデータが消えないお店にします
          （この時点では、まだ手元のパソコンの中だけの話です）。
          そして第4回で、実際にCloudflare Workersへデプロイし、世界中の冒険者がアクセスできるお店にします。
        </p>
      </Callout>

      <h2 className="mt-10 text-xl font-bold">参考リンクまとめ</h2>
      <p className="mt-3 leading-relaxed">
        今日の講座内で登場した公式ドキュメントへのリンクです。復習や、家に帰ってからの深掘りにどうぞ。
      </p>
      <Callout variant="info" title="復習用リンク集">
        <ul className="list-disc space-y-1 pl-5">
          <li>
            <a href="https://hono.dev/docs/" target="_blank" rel="noreferrer" className="text-primary underline-offset-4 hover:underline">
              Hono 公式ドキュメント
            </a>
          </li>
          <li>
            <a href="https://hono.dev/docs/api/routing" target="_blank" rel="noreferrer" className="text-primary underline-offset-4 hover:underline">
              Hono 公式ドキュメント（Routing）
            </a>
          </li>
          <li>
            <a href="https://hono.dev/docs/middleware/builtin/cors" target="_blank" rel="noreferrer" className="text-primary underline-offset-4 hover:underline">
              Hono 公式ドキュメント（CORS Middleware）
            </a>
          </li>
          <li>
            <a href="https://bun.sh/docs" target="_blank" rel="noreferrer" className="text-primary underline-offset-4 hover:underline">
              Bun 公式ドキュメント
            </a>
          </li>
          <li>
            <a href="https://developer.mozilla.org/ja/docs/Web/HTTP/Overview" target="_blank" rel="noreferrer" className="text-primary underline-offset-4 hover:underline">
              MDN: HTTP の概要
            </a>
          </li>
        </ul>
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
              HonoのRPC機能で、フロントとバックエンドを型でつなぐ最先端の書き方を体験します。
            </span>
          </span>
        </a>
        <a
          href="#/extra/glossary"
          className="flex items-start gap-3 rounded-lg border p-4 transition hover:bg-secondary/60"
        >
          <MapPin size={18} className="mt-0.5 shrink-0 text-primary" />
          <span>
            <span className="block font-medium">用語集（第1回）</span>
            <span className="mt-1 block text-sm text-muted-foreground">
              今日出てきた用語を辞書のように引けます。復習にどうぞ。
            </span>
          </span>
        </a>
      </div>

      <ProgressCheck id="s1-08-summary" label="第1回の内容を振り返り、次回の予習ができた" />
      <NextLink current="/session1/08-summary" />
    </div>
  );
}
