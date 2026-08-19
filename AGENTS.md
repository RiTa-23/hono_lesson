# AGENTS.md

## プロジェクト概要

Honoハンズオン講座「よろず屋API講座」の教材Webサイト。
RPGのよろず屋APIを題材に、全4回を収録済み。
第1回（API基礎・Hono・CORS・フロント連携）／第2回（zod/OpenAPI/テスト）／
第3回（D1・Drizzle ORMでのデータ永続化・ローカル完結）／第4回（本番D1マイグレーション・Cloudflare Workersへのデプロイ）。
公開範囲は `src/lib/routes.ts` の `PUBLISHED_UP_TO` で制御する（下記「公開設定」参照）。

## コマンド

- `npm run dev` … 開発サーバー
- `npm run build` … `tsc -b && vite build`（型チェック込み）
- `npm test` … Vitest 実行

## 構成の要点

- `src/lib/routes.ts` … ページ構成の単一ソース。`progressId` は進捗管理のキー、`file` はページコンポーネントの場所
- `src/lib/pageResolver.tsx` … ページコンポーネントの遅延ロード（`import.meta.glob`）。`PageDef.file` からコンポーネントを解決する（エクスポート名はファイル名と同じ規約）
- `src/lib/storage.ts` … localStorage ラッパー。進捗変更時に `progress-updated` / `progress-cleared` の CustomEvent を発火し、サイドバー・ホームが再描画される仕組み
- `src/lib/theme.ts` … ライト/ダークテーマ（`<html>` の `.dark` クラス切替）
- `src/App.tsx` … hash ルーティング（react-router は未使用）
- `src/components/` … ProgressCheck, CopyBlock, Callout, Quiz など教材用コンポーネントと shadcn/ui パターンの `ui/`

## 公開設定

- `src/lib/routes.ts` の `PUBLISHED_UP_TO`（数値）が「何回目まで公開するか」を決める唯一の設定値
- `PageDef.section`（`"session1"`〜`"session4"`）が対応する回番号と紐づき、`ALL_PAGES` / `MAIN_FLOW` はこの値でフィルタされる
- サブクエスト（`EXTRA_PAGES`: RPC・各回の用語集）も同じ仕組みで回ごとに公開・非公開が切り替わる。表示側で絞り込む場合は `isPagePublished(page)` を使う（`Sidebar.tsx` が実例）
- 未公開ページはナビゲーションから消えるだけでなく、`App.tsx` の `resolvePage` が `findPage(path)` で存在確認し、直接URLを叩いても404にする
- 公開範囲を変えたいときは `PUBLISHED_UP_TO` の値を変更して `main` にpush（Cloudflare PagesのGit連携で自動デプロイされる）

## ルール

- ページ追加時は routes.ts（`path`・`title`・`file` を記入）→ ページコンポーネント作成の2箇所（App.tsx の変更は不要。`src/lib/pageResolver.tsx` が `import.meta.glob` で自動解決する）
- ページコンポーネントのエクスポート名はファイル名と同じにする（例: `FirstApi.tsx` → `export function FirstApi`）。`PageDef.file` は `src/pages` 配下のパスを拡張子なしで書く（例: `"session1/FirstApi"`）
- テンプレート厳守: PageHeader（ゴール・所要時間）/ 手順 / よくあるつまずき×2以上 / ProgressCheck / NextLink
- 進捗IDは既存と重複させない（routes.test.ts が検知）
- 変更後は `npm run build` と `npm test` が通ることを確認する

## UIの約束（冒険者ギルドの依頼書・読みやすさ最優先）

- テーマは「冒険者ギルドの依頼書」: 生成り × 焦茶（primary）× 金（gold）× 朱（destructive）。本文はsans、見出しは明朝。グラデーションと過度な影は使わない
- `PageHeader` は依頼書の二重枠・四隅装飾・依頼番号・金の罫線を使う。各回のページでは `chapter` プロップを必ず渡す（回ごとに"01"から振り直す。第1回は"01"〜"08"、第2回は"01"〜"06"、第3回は"01"〜"07"、第4回は"01"〜"04"）
- h2/h3 は `index.css` の base レイヤーで自動的に罫線が付く（二重線/点線）。ページ側で個別の罫線スタイルを書かない
- コードブロックは焦茶地（`#2b2118`）＋金色ラベルで統一（`CopyBlock` と同じ見た目）
- RPG要素はアクセントのみ: ProgressCheck達成時の朱色の判子スタンプ（`#b3402a` 直書き。CSS変数にしない）、ホームの金色HPバー、サイドバー現在地の「▶」
- 判子のスタンプ演出（`stamp-in`）は全環境で常に再生する（reduced-motion による無効化はしない）
