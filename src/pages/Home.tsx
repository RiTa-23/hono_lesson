import { useEffect, useState } from "react";
import { ArrowRight, CheckCircle2, Store, Package, ShieldCheck, Database, Rocket } from "lucide-react";
import { Callout } from "@/components/Callout";
import { ProgressReset } from "@/components/ProgressReset";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { MAIN_FLOW, SESSION1_PAGES, PUBLISHED_UP_TO } from "@/lib/routes";
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
      {/* 表紙 */}
      <section className="relative border-2 border-primary bg-card p-2">
        <span aria-hidden="true" className="pointer-events-none absolute -left-1 -top-1 h-4 w-4 border-l-2 border-t-2 border-gold" />
        <span aria-hidden="true" className="pointer-events-none absolute -right-1 -top-1 h-4 w-4 border-r-2 border-t-2 border-gold" />
        <span aria-hidden="true" className="pointer-events-none absolute -bottom-1 -left-1 h-4 w-4 border-b-2 border-l-2 border-gold" />
        <span aria-hidden="true" className="pointer-events-none absolute -bottom-1 -right-1 h-4 w-4 border-b-2 border-r-2 border-gold" />
        <div className="border border-gold/50 px-5 py-8 text-center sm:px-8">
          <p className="font-serif text-xs tracking-[0.5em] text-gold">冒険者ギルド 公式テキスト</p>
          <Badge variant="secondary" className="mb-3 mt-5">
            Hono ハンズオン講座
          </Badge>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            よろず屋API講座
          </h1>
          <div className="mx-auto mt-3 flex w-24 justify-center gap-1" aria-hidden="true">
            <span className="h-0.5 w-16 bg-gold" />
            <span className="h-0.5 w-3 bg-gold/60" />
          </div>
          <p className="mx-auto mt-4 max-w-2xl text-left leading-relaxed text-muted-foreground">
            RPGゲームの「よろず屋」を題材に、HonoでバックエンドAPIを作るハンズオンです。
            フロントエンド（React）は完成済み。あなたは店主からの依頼を受けた
            <span className="font-medium text-foreground">駆け出しエンジニア</span>
            として、よろず屋のネット販売システムを作り上げていきます。
          </p>
        </div>
      </section>

      <Callout variant="quest" title="ストーリー">
        <p>
          とある王国の片隅で営まれてきた老舗のよろず屋。店主はこう言いました。
        </p>
        <p className="mt-2 border-l-4 border-primary/40 pl-3 italic">
          「最近は遠征中でなかなか町まで戻れず、店に来なくてもポーションを買いたいという
          　冒険者が増えておる。うちもネット販売を始めたいのじゃが、
          　APIというのを作ればよいらしい。頼んだぞ、エンジニアよ！」
        </p>
      </Callout>

      {/* 全体進捗 */}
      <section className="mt-8 rounded-md border-2 border-primary bg-card p-6">
        <div className="flex items-center justify-between">
          <h2 className="flex items-center gap-2 font-bold">
            <Package size={18} className="text-primary" />
            全体の進捗（第{PUBLISHED_UP_TO}回まで公開中）
          </h2>
          <span className="text-sm font-bold text-muted-foreground">
            {done}/{total} ステップ完了（{percent}%）
          </span>
        </div>
        <Progress
          value={percent}
          className="mt-3 h-2.5 rounded-none border border-primary bg-card [&>div]:bg-gold"
        />
        {percent === 100 && (
          <p className="mt-3 flex items-center gap-2 font-serif text-sm font-bold text-gold">
            <CheckCircle2 size={16} />
            全クエスト達成！ HP MAX です
          </p>
        )}
      </section>

      {/* ロードマップ */}
      <h2 className="mt-10 text-xl font-bold">全4回のロードマップ</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <Badge className="w-fit">第1回</Badge>
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
        <Card className={PUBLISHED_UP_TO < 2 ? "opacity-75" : undefined}>
          <CardHeader>
            <Badge variant={PUBLISHED_UP_TO >= 2 ? "default" : "secondary"} className="w-fit">
              第2回{PUBLISHED_UP_TO < 2 && "（準備中）"}
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
        <Card className={PUBLISHED_UP_TO < 3 ? "opacity-75" : undefined}>
          <CardHeader>
            <Badge variant={PUBLISHED_UP_TO >= 3 ? "default" : "secondary"} className="w-fit">
              第3回{PUBLISHED_UP_TO < 3 && "（準備中）"}
            </Badge>
            <CardTitle className="flex items-center gap-2 text-base">
              <Database size={16} />
              データベースを導入しよう
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm leading-relaxed text-muted-foreground">
            Cloudflare D1とDrizzle ORMでデータを永続化。
            再起動しても所持金・在庫が消えないAPIに育てます（ローカル環境まで）。
          </CardContent>
        </Card>
        <Card className={PUBLISHED_UP_TO < 4 ? "opacity-75" : undefined}>
          <CardHeader>
            <Badge variant={PUBLISHED_UP_TO >= 4 ? "default" : "secondary"} className="w-fit">
              第4回{PUBLISHED_UP_TO < 4 && "（準備中）"}
            </Badge>
            <CardTitle className="flex items-center gap-2 text-base">
              <Rocket size={16} />
              本番デプロイでよろず屋を開店
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm leading-relaxed text-muted-foreground">
            本番D1へのマイグレーションとCloudflare Workersへのデプロイで、
            世界中からアクセスできるお店に仕上げます。
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
      <div className="mt-4 overflow-hidden rounded-sm border border-primary">
        <table className="w-full text-sm">
          <thead className="border-b border-gold bg-secondary/60 font-serif">
            <tr>
              <th className="px-4 py-2 text-left font-bold">時間</th>
              <th className="px-4 py-2 text-left font-bold">内容</th>
            </tr>
          </thead>
          <tbody>
            {SESSION1_PAGES.map((p, i) => (
              <tr key={p.path} className="border-t border-border">
                <td className="whitespace-nowrap px-4 py-2 text-muted-foreground">
                  約{p.minutes ?? "-"}分
                </td>
                <td className="px-4 py-2">
                  <a href={`#${p.path}`} className="font-medium text-primary underline-offset-4 hover:underline">
                    {String(i + 1).padStart(2, "0")}. {p.title}
                  </a>
                  {p.progressId && progress[p.progressId] && (
                    <CheckCircle2
                      size={14}
                      className="ml-2 inline-block text-gold"
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
          className="inline-flex items-center gap-2 rounded-sm border border-primary bg-primary px-6 py-3 font-serif font-bold text-primary-foreground transition hover:opacity-90"
        >
          クエストを開始する
          <ArrowRight size={18} />
        </a>
      </div>
    </div>
  );
}
