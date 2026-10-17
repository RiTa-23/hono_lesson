import { PageHeader } from "@/components/PageHeader";
import { Callout } from "@/components/Callout";
import { Quiz } from "@/components/Quiz";
import { ProgressCheck } from "@/components/ProgressCheck";
import { NextLink } from "@/components/NextLink";
import { CopyBlock } from "@/components/CopyBlock";

export function DrizzleSetup() {
  return (
    <div>
      <PageHeader
        title="Drizzle ORMをセットアップする"
        chapter="04"
        goal="Drizzle ORMを導入し、items・player・player_itemsのテーブル定義（スキーマ）を書けるようになっている"
        minutes={15}
      />

      <h2 className="text-xl font-bold">1. インストールする</h2>
      <CopyBlock
        lang="bash"
        title="ターミナル（backendディレクトリで）"
        code={`bun add drizzle-orm
bun add -D drizzle-kit`}
      />
      <p className="mt-3 leading-relaxed">
        <code className="rounded bg-muted px-1.5 py-0.5 text-xs">drizzle-orm</code>
        は実際にDBを読み書きするための本体、<code className="rounded bg-muted px-1.5 py-0.5 text-xs">drizzle-kit</code>
        はスキーマからマイグレーション用SQLを生成するための開発ツールです。
      </p>

      <h2 className="mt-10 text-xl font-bold">2. テーブルを設計する</h2>
      <p className="mt-3 leading-relaxed">
        第1回の<code className="rounded bg-muted px-1.5 py-0.5 text-xs">items</code>配列・
        <code className="rounded bg-muted px-1.5 py-0.5 text-xs">player</code>オブジェクトを、
        3つのテーブルに置き換えます。
      </p>
      <ul className="mt-3 list-disc space-y-1.5 pl-6 text-sm leading-relaxed">
        <li><span className="font-medium">items</span> … 商品データ（第1回のitems配列相当）</li>
        <li><span className="font-medium">player</span> … 所持金（今回はid:1の1行だけ使う）</li>
        <li><span className="font-medium">player_items</span> … 誰が・どの商品を・いくつ持っているか（中間テーブル）</li>
      </ul>

      <h2 className="mt-10 text-xl font-bold">3. スキーマを定義する</h2>
      <CopyBlock
        lang="ts"
        title="backend/src/db/schema.ts（新規作成）"
        code={`import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core'

export const items = sqliteTable('items', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  price: integer('price').notNull(),
  stock: integer('stock').notNull(),
  description: text('description').notNull(),
})

export const player = sqliteTable('player', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  gold: integer('gold').notNull(),
})

export const playerItems = sqliteTable('player_items', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  playerId: integer('player_id').notNull(),
  itemId: integer('item_id').notNull(),
  quantity: integer('quantity').notNull(),
})`}
      />

      <h2 className="mt-10 text-xl font-bold">4. drizzle-kitの設定ファイルを作る</h2>
      <CopyBlock
        lang="ts"
        title="backend/drizzle.config.ts（新規作成）"
        code={`import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './drizzle/migrations',
  dialect: 'sqlite',
})`}
      />
      <p className="mt-3 leading-relaxed">
        <code className="rounded bg-muted px-1.5 py-0.5 text-xs">schema</code>
        でスキーマファイルの場所を、<code className="rounded bg-muted px-1.5 py-0.5 text-xs">out</code>
        で生成されるマイグレーションSQLの出力先を指定しています。実際にDBへ反映する作業は次のページで行います。
      </p>
      <Callout variant="warn" title="outとmigrations_dirは必ず揃える">
        <p>
          ここで指定した<code className="rounded bg-muted px-1.5 py-0.5 text-xs">out</code>
          （<code className="rounded bg-muted px-1.5 py-0.5 text-xs">./drizzle/migrations</code>）は、
          依頼No.03で<code className="rounded bg-muted px-1.5 py-0.5 text-xs">wrangler.jsonc</code>
          に書いた<code className="rounded bg-muted px-1.5 py-0.5 text-xs">migrations_dir</code>
          と同じ場所でなければいけません。
          「SQLを出力する側（drizzle-kit）」と「SQLを探す側（wrangler）」が別々の場所を見ていると、
          次のページのマイグレーションが
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">No migrations present at ...</code>
          で止まります。
        </p>
      </Callout>

      <Callout variant="tip" title="player_itemsがitemIdとplayerIdの両方を持つ理由">
        <p>
          「プレイヤーとアイテムは、どちらも複数存在しうる」関係（多対多）を表現するには、
          間に「誰が・何を持っているか」を1行ずつ記録する中間テーブルが必要です。
          今は<code className="rounded bg-muted px-1.5 py-0.5 text-xs">player</code>が1人しかいませんが、
          この設計にしておくことで、将来プレイヤーが増えても仕組みを変えずに済みます。
        </p>
      </Callout>

      <h2 className="mt-10 text-xl font-bold">理解度チェック</h2>
      <Quiz
        question="player_itemsテーブルの役割として正しいものはどれ？"
        choices={[
          "「どのプレイヤーが」「どの商品を」「いくつ」持っているかを記録する中間テーブル",
          "商品の価格と在庫だけを記録するテーブル",
          "プレイヤーのログイン情報を記録するテーブル",
        ]}
        answerIndex={0}
        explanation="playerId・itemId・quantityの3つを1行にまとめて持つことで、「誰が何をいくつ持っているか」を表現しています。第1回のplayer.items配列が担っていた役割です。"
      />

      <h2 className="mt-10 text-xl font-bold">よくあるつまずき</h2>
      <ul className="mt-3 list-disc space-y-2 pl-6 text-sm leading-relaxed">
        <li>
          「今は1人しか使わないのに、なぜplayerテーブルが必要？」→ 将来的に複数プレイヤーへ拡張しやすい設計にしておくためです。
          今回はid:1の行だけを使い続けます。
        </li>
        <li>
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">integer</code> /
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">text</code>
          の書き方を間違える → 必ず<code className="rounded bg-muted px-1.5 py-0.5 text-xs">drizzle-orm/sqlite-core</code>
          からimportした関数を使ってください。他のORM（Prismaなど）の記法と混ざらないよう注意しましょう。
        </li>
      </ul>

      <ProgressCheck id="s3-04-drizzle-setup" label="Drizzle ORMを導入し、3つのテーブルのスキーマを定義できた" />
      <NextLink current="/session3/04-drizzle-setup" />
    </div>
  );
}
