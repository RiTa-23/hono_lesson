# よろず屋DX講座（Hono ハンズオン教材サイト）

RPGの「よろず屋」を題材に、HonoでバックエンドAPIを作るハンズオン講座の教材サイトです。
第1回（APIの基礎〜Reactフロント連携）のコンテンツを収録しています。

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

## デプロイ（Cloudflare Pages）

### GitHub連携（推奨）

1. このリポジトリをGitHubにpush
2. Cloudflare ダッシュボード → Workers & Pages → Pages → 「Gitに接続」
3. ビルド設定:
   - Build command: `npm run build`
   - Build output directory: `dist`

### 手動デプロイ

```bash
npm run build
npx wrangler pages deploy dist --project-name hono-yorozuya-kouza
```

## コンテンツの追加方法（第2回・第3回）

1. `src/lib/routes.ts` の `SESSION2_PAGES` / `SESSION3_PAGES` にページ定義を追記
   （`progressId` は重複しない一意の文字列）
2. `src/pages/session2/` などにページコンポーネントを作成
   （`PageHeader` / `CopyBlock` / `Callout` / `ProgressCheck` / `NextLink` を組み合わせる）
3. `src/App.tsx` の `resolvePage` に case を追記
4. 必要なら `src/components/Sidebar.tsx` にセクションを追加

各ページのテンプレート:

- 冒頭: `PageHeader`（タイトル・ゴール一文・所要時間）
- 手順: 番号付きの見出し＋`CopyBlock`（コピーボタン付きコード）
- 「よくあるつまずき」を2項目以上
- 末尾: `ProgressCheck`（progressId と一致させる）と `NextLink`
