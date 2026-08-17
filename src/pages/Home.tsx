import { useEffect, useState } from "react";
import { ArrowRight, CheckCircle2, Store, Package, ShieldCheck, Rocket } from "lucide-react";
import { Callout } from "@/components/Callout";
import { ProgressReset } from "@/components/ProgressReset";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { MAIN_FLOW, SESSION1_PAGES } from "@/lib/routes";
import { getAllProgress } from "@/lib/storage";

export function Home() {
  const [progress, setProgress] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setProgress(getAllProgress());
    const refresh = () => setProgress(getAllProgress());
    window.addEventListener("progress-updated", refresh);
    window.addEventListener("progress-cleared", refresh);
    return () => {
      window.removeEventListener("progress-updated", refresh);
      window.removeEventListener("progress-cleared", refresh);
    };
  }, []);

  const total = MAIN_FLOW.length;
  const done = MAIN_FLOW.filter((p) => p.progressId && progress[p.progressId]).length;
  const percent = total === 0 ? 0 : Math.round((done / total) * 100);

  return (
    <div>
      <section className="rounded-xl border bg-gradient-to-br from-primary/10 via-card to-card p-6 sm:p-8">
        <Badge variant="secondary" className="mb-3">
          Hono ハンズオン講座
        </Badge>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          よろず屋API講座
        </h1>
        <div className="mt-3 flex gap-1" aria-hidden="true">
          <span className="h-1 w-16 rounded-full bg-amber-500" />
          <span className="h-1 w-4 rounded-full bg-amber-400/70" />
        </div>
        <p className="mt-3 leading-relaxed text-muted-foreground">
          RPGゲームの「よろず屋」を題材に、HonoでバックエンドAPIを作るハンズオンです。
          フロントエンド（React）は完成済み。あなたは店主からの依頼を受けた
          <span className="font-medium text-foreground">駆け出しエンジニア</span>
          として、よろず屋のネット販売システムを作り上げていきます。
        </p>
      </section>

      <Callout variant="quest" title="ストーリー">
        <p>
          とある王国の片隅で営まれてきた老舗のよろず屋。店主はこう言いました。
        </p>
        <p className="mt-2 border-l-4 border-primary/40 pl-3 italic">
          「最近は魔王城の近くまで行かずにポーションを買いたい勇者が増えておる。
          　うちもネット販売を始めたいのじゃが、APIというのを作ればよいらしい。
          　頼んだぞ、エンジニアよ！」
        </p>
      </Callout>

      {/* 全体進捗 */}
      <section className="mt-8 rounded-xl border bg-card p-6">
        <div className="flex items-center justify-between">
          <h2 className="flex items-center gap-2 font-semibold">
            <Package size={18} className="text-primary" />
            第1回の進捗
          </h2>
          <span className="text-sm text-muted-foreground">
            {done}/{total} ステップ完了（{percent}%）
          </span>
        </div>
        <Progress
          value={percent}
          className="mt-3 h-3 rounded-full border border-border bg-muted [&>div]:bg-emerald-600"
        />
        {percent === 100 && (
          <p className="mt-3 flex items-center gap-2 text-sm font-medium text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 size={16} />
            全クエスト達成！
          </p>
        )}
      </section>

      {/* ロードマップ */}
      <h2 className="mt-10 text-xl font-bold">全3回のロードマップ</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader>
            <Badge className="w-fit">第1回（今回）</Badge>
            <CardTitle className="flex items-center gap-2 text-base">
              <Store size={16} className="text-primary" />
              よろず屋APIを作ろう
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm leading-relaxed text-muted-foreground">
            APIとは？Honoとは？から始めて、商品一覧・購入・売却のAPIを実装。
            最後はReactのフロントとつないで、画面からアイテムを売り買いします。
          </CardContent>
        </Card>
        <Card className="opacity-75">
          <CardHeader>
            <Badge variant="secondary" className="w-fit">
              第2回（準備中）
            </Badge>
            <CardTitle className="flex items-center gap-2 text-base">
              <ShieldCheck size={16} />
              堅牢なAPIにしよう
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm leading-relaxed text-muted-foreground">
            zodでバリデーション、OpenAPIでドキュメント自動生成、
            そしてテストコードを書いて、安心して直せるAPIに育てます。
          </CardContent>
        </Card>
        <Card className="opacity-75">
          <CardHeader>
            <Badge variant="secondary" className="w-fit">
              第3回（準備中）
            </Badge>
            <CardTitle className="flex items-center gap-2 text-base">
              <Rocket size={16} />
              公開してみよう
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm leading-relaxed text-muted-foreground">
            D1データベース（drizzle ORM）と連携してデータを永続化。
            Cloudflare Workersへデプロイして、世界に公開します。
          </CardContent>
        </Card>
      </div>

      {/* このサイトの使い方 */}
      <h2 className="mt-10 text-xl font-bold">このサイトの使い方</h2>
      <ul className="mt-4 list-disc space-y-2 pl-6 text-sm leading-relaxed">
        <li>
          各ステップの最後にあるチェックボックスを押すと
          <span className="font-medium">「クエスト達成」</span>
          として記録されます（このブラウザ内にのみ保存）。
        </li>
        <li>
          左のサイドバー（スマホは左上のメニュー）で、今どこにいるか・あと何ステップか確認できます。
        </li>
        <li>
          手順どおりに進めていればOK。分からなくなったら「よくあるつまずき」かメンターに聞きましょう。
        </li>
        <li>
          進捗がおかしくなったら、下のボタンから初期化できます。
        </li>
      </ul>
      <div className="mt-4">
        <ProgressReset />
      </div>

      {/* 前提知識 */}
      <h2 className="mt-10 text-xl font-bold">前提知識</h2>
      <ul className="mt-4 list-disc space-y-2 pl-6 text-sm leading-relaxed">
        <li>JavaScript / TypeScriptの基本的な文法</li>
        <li>npm などを使ったフロントエンド開発の経験</li>
        <li>ターミナルでの基本的なコマンド操作</li>
      </ul>

      {/* タイムテーブル */}
      <h2 className="mt-10 text-xl font-bold">第1回のタイムテーブル（目安）</h2>
      <div className="mt-4 overflow-hidden rounded-lg border">
        <table className="w-full text-sm">
          <thead className="bg-muted">
            <tr>
              <th className="px-4 py-2 text-left font-medium">時間</th>
              <th className="px-4 py-2 text-left font-medium">内容</th>
            </tr>
          </thead>
          <tbody>
            {SESSION1_PAGES.map((p, i) => (
              <tr key={p.path} className="border-t">
                <td className="whitespace-nowrap px-4 py-2 text-muted-foreground">
                  約{p.minutes ?? "-"}分
                </td>
                <td className="px-4 py-2">
                  <a href={`#${p.path}`} className="text-primary underline-offset-4 hover:underline">
                    {i + 1}. {p.title}
                  </a>
                  {p.progressId && progress[p.progressId] && (
                    <CheckCircle2
                      size={14}
                      className="ml-2 inline-block text-emerald-600"
                      aria-label="完了"
                    />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-10 flex justify-center">
        <a
          href="#/session1/01-about-api"
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground shadow transition hover:bg-primary/90"
        >
          クエストを開始する
          <ArrowRight size={18} />
        </a>
      </div>
    </div>
  );
}
