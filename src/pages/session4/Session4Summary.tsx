import { PageHeader } from "@/components/PageHeader";
import { Callout } from "@/components/Callout";
import { ProgressCheck } from "@/components/ProgressCheck";
import { NextLink } from "@/components/NextLink";
import { Sparkles } from "lucide-react";

export function Session4Summary() {
  return (
    <div>
      <PageHeader
        title="全体まとめ・講座修了"
        chapter="04"
        goal="全4回の講座を振り返り、よろず屋APIの完成を実感する"
        minutes={10}
      />

      <Callout variant="quest" title="よろず屋、本開店！">
        <p>
          お疲れさまでした！全4回を通じて、あなたは駆け出しエンジニアから、
          本番運用できるAPIを一人で作り上げるエンジニアになりました。
          世界中の冒険者が、あなたの作ったよろず屋にアクセスできます。
        </p>
      </Callout>

      <h2 className="mt-8 text-xl font-bold">全4回の歩み</h2>
      <div className="mt-4 overflow-hidden rounded-lg border">
        <table className="w-full text-sm">
          <thead className="border-b border-gold bg-secondary/60 font-serif">
            <tr>
              <th className="px-4 py-2 text-left font-medium">回</th>
              <th className="px-4 py-2 text-left font-medium">やったこと</th>
            </tr>
          </thead>
          <tbody className="[&>tr]:border-t">
            <tr>
              <td className="px-4 py-2 font-medium">第1回</td>
              <td className="px-4 py-2">Honoの基本、GET/POSTのAPI実装、Reactフロントとの連携（CORS）</td>
            </tr>
            <tr>
              <td className="px-4 py-2 font-medium">第2回</td>
              <td className="px-4 py-2">zod・zod-openapiによるバリデーション、Swagger UI、テストコード</td>
            </tr>
            <tr>
              <td className="px-4 py-2 font-medium">第3回</td>
              <td className="px-4 py-2">D1データベース、Drizzle ORM、マイグレーション、CRUD実装</td>
            </tr>
            <tr>
              <td className="px-4 py-2 font-medium">第4回</td>
              <td className="px-4 py-2">本番D1へのマイグレーション、Cloudflare Workersへのデプロイ、本番トラブル対応</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 className="mt-10 text-xl font-bold">これから発展させるなら</h2>
      <p className="mt-3 leading-relaxed">
        よろず屋APIはここで一区切りですが、余力があればこんな拡張にも挑戦してみてください。
      </p>
      <ul className="mt-3 list-disc space-y-1.5 pl-6 text-sm leading-relaxed">
        <li>ログイン機能を作り、プレイヤーごとに所持金・所持品を分ける（player_itemsテーブルはすでにこの拡張を見据えた設計です）</li>
        <li>商品の追加・編集・削除ができる管理者向けAPIを作る</li>
        <li>購入履歴のテーブルを新設し、「いつ何を買ったか」を記録する</li>
        <li>Swagger UIのドキュメントをさらに充実させる（各エンドポイントの説明文・例を追加）</li>
      </ul>

      <h2 className="mt-10 text-xl font-bold">おまけページ</h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <a
          href="#/extra/rpc"
          className="flex items-start gap-3 rounded-lg border p-4 transition hover:bg-secondary/60"
        >
          <Sparkles size={18} className="mt-0.5 shrink-0 text-primary" />
          <span>
            <span className="block font-medium">RPCで型安全な連携</span>
            <span className="mt-1 block text-sm text-muted-foreground">
              まだ試していない人は、講座の締めくくりにぜひ体験してみてください。
            </span>
          </span>
        </a>
        <a
          href="#/extra/glossary-4"
          className="flex items-start gap-3 rounded-lg border p-4 transition hover:bg-secondary/60"
        >
          <Sparkles size={18} className="mt-0.5 shrink-0 text-primary" />
          <span>
            <span className="block font-medium">用語集（第4回）</span>
            <span className="mt-1 block text-sm text-muted-foreground">
              各回の用語集はサイドバーの「おまけ」からもまとめて振り返れます。
            </span>
          </span>
        </a>
      </div>

      <Callout variant="tip" title="お疲れさまでした">
        <p>
          「APIって難しそう」から始まったよろず屋API講座、全4回を完走した皆さんは、もう立派に
          Honoでバックエンドを作れるエンジニアです。ここで学んだ流れ（設計→実装→検証→永続化→公開）は、
          他のどんなAPI開発にも活かせます。この先の開発も楽しんでください！
        </p>
      </Callout>

      <ProgressCheck id="s4-04-summary" label="全4回の講座を振り返り、よろず屋APIの完成を実感した" />
      <NextLink current="/session4/04-summary" />
    </div>
  );
}
