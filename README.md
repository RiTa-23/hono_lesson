# よろず屋API講座（Hono ハンズオン教材サイト）

RPGの「よろず屋」を題材に、HonoでバックエンドAPIを作るハンズオン講座の教材サイトです。
全4回（第1回：APIの基礎〜Reactフロント連携／第2回：zod・OpenAPI・テスト／
第3回：D1・Drizzle ORMでのデータ永続化／第4回：本番デプロイ）のコンテンツを収録しています。

## 技術スタック

- Vite + React 19 + TypeScript
- Tailwind CSS v3 + shadcn/ui パターン（Radix UI）
- hash ルーティング（`#/session1/01-about-api` 形式）
- 進捗管理: localStorage + CustomEvent 同期
- テスト: Vitest + Testing Library
- ホスティング: Cloudflare Pages

## 開発

```bash
npm install
npm run dev        # 開発サーバー
npm run build      # 型チェック + 本番ビルド（dist/ に出力）
npm test           # テスト実行
```

## 公開設定

どの回まで公開するかは `src/lib/routes.ts` の `PUBLISHED_UP_TO`（数値）で一元管理しています。
この値を変更して `main` にpushすると、Cloudflare PagesのGit連携で自動デプロイされます。

- 未公開の回のページは、サイドバー・ホームのロードマップから自動的に隠れます
- 未公開ページはURLを直接開いても404になります（`App.tsx` の `resolvePage` が `findPage` で存在確認）
- RPCページ・各回の用語集（サブクエスト）も、対応する回の公開状況に連動します

## コンテンツの追加方法（第5回以降を増やす場合など）

1. `src/lib/routes.ts` に `SESSION5_PAGES` のような配列を追加し、`ALL_PAGES` / `MAIN_FLOW` に組み込む
   （`progressId` は重複しない一意の文字列。`section` に新しい回の識別子を追加し、`PageDef["section"]` の型定義も更新する）
2. `src/pages/session5/` などにページコンポーネントを作成
   （`PageHeader` / `CopyBlock` / `Callout` / `ProgressCheck` / `NextLink` を組み合わせる。エクスポート名はファイル名と同じにし、`routes.ts` の `PageDef.file` に `src/pages` 配下のパスを拡張子なしで書く）
3. `src/App.tsx` の変更は不要（`src/lib/pageResolver.tsx` が `import.meta.glob` で自動解決し、ページごとに遅延ロードする）
4. `src/components/Sidebar.tsx` にセクションを追加
5. 追加した回をいきなり公開したくない場合は `PUBLISHED_UP_TO` を据え置いたままpushする

各ページのテンプレート:

- 冒頭: `PageHeader`（タイトル・ゴール一文・所要時間）
- 手順: 番号付きの見出し＋`CopyBlock`（コピーボタン付きコード）
- 「よくあるつまずき」を2項目以上
- 末尾: `ProgressCheck`（progressId と一致させる）と `NextLink`
