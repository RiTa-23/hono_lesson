# AGENTS.md

## プロジェクト概要

Honoハンズオン講座「よろず屋DX講座」の教材Webサイト。
RPGのよろず屋APIを題材に、第1回（API基礎・Hono・CORS・フロント連携）を収録。
第2回（zod/OpenAPI/テスト）・第3回（D1/デプロイ）は開催前に同リポジトリへ追記する方針。

## コマンド

- `npm run dev` … 開発サーバー
- `npm run build` … `tsc -b && vite build`（型チェック込み）
- `npm test` … Vitest 実行

## 構成の要点

- `src/lib/routes.ts` … ページ構成の単一ソース。`progressId` は進捗管理のキー
- `src/lib/storage.ts` … localStorage ラッパー。進捗変更時に `progress-updated` / `progress-cleared` の CustomEvent を発火し、サイドバー・ホームが再描画される仕組み
- `src/lib/theme.ts` … ライト/ダークテーマ（`<html>` の `.dark` クラス切替）
- `src/App.tsx` … hash ルーティング（react-router は未使用）
- `src/components/` … ProgressCheck, CopyBlock, Callout, Quiz など教材用コンポーネントと shadcn/ui パターンの `ui/`

## ルール

- ページ追加時は必ず routes.ts → ページコンポーネント → App.tsx の3箇所を更新する
- テンプレート厳守: PageHeader（ゴール・所要時間）/ 手順 / よくあるつまずき×2以上 / ProgressCheck / NextLink
- 進捗IDは既存と重複させない（routes.test.ts が検知）
- 変更後は `npm run build` と `npm test` が通ることを確認する
