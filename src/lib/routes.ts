export type PageDef = {
  path: string;
  title: string;
  // ページコンポーネントの場所（src/pages配下・拡張子なし）。エクスポート名はファイル名と同じ
  file?: string;
  section?: "session1" | "session2" | "session3" | "session4" | "extra";
  progressId?: string;
  sectionLabel?: string;
  minutes?: number; // 所要時間の目安（分）
};

export const HOME: PageDef = { path: "/", title: "よろず屋API講座", file: "Home" };

export const SESSION1_PAGES: PageDef[] = [
  {
    path: "/session1/01-about-api",
    file: "session1/AboutApi",
    title: "APIとは？",
    section: "session1",
    progressId: "s1-01-about-api",
    sectionLabel: "第1回 Honoでよろず屋APIを作ろう",
    minutes: 10,
  },
  {
    path: "/session1/02-about-hono",
    file: "session1/AboutHono",
    title: "Honoとは？",
    section: "session1",
    progressId: "s1-02-about-hono",
    sectionLabel: "第1回 Honoでよろず屋APIを作ろう",
    minutes: 10,
  },
  {
    path: "/session1/03-setup",
    file: "session1/Setup",
    title: "プロジェクトのセットアップ",
    section: "session1",
    progressId: "s1-03-setup",
    sectionLabel: "第1回 Honoでよろず屋APIを作ろう",
    minutes: 20,
  },
  {
    path: "/session1/04-first-api",
    file: "session1/FirstApi",
    title: "最初のAPI：商品一覧",
    section: "session1",
    progressId: "s1-04-first-api",
    sectionLabel: "第1回 Honoでよろず屋APIを作ろう",
    minutes: 15,
  },
  {
    path: "/session1/05-path-param",
    file: "session1/PathParam",
    title: "商品詳細と404",
    section: "session1",
    progressId: "s1-05-path-param",
    sectionLabel: "第1回 Honoでよろず屋APIを作ろう",
    minutes: 15,
  },
  {
    path: "/session1/06-post-api",
    file: "session1/PostApi",
    title: "購入・売却API（POST）",
    section: "session1",
    progressId: "s1-06-post-api",
    sectionLabel: "第1回 Honoでよろず屋APIを作ろう",
    minutes: 20,
  },
  {
    path: "/session1/07-cors-frontend",
    file: "session1/CorsFrontend",
    title: "フロントとつなげよう（CORS）",
    section: "session1",
    progressId: "s1-07-cors-frontend",
    sectionLabel: "第1回 Honoでよろず屋APIを作ろう",
    minutes: 20,
  },
  {
    path: "/session1/08-summary",
    file: "session1/Summary",
    title: "まとめ・次回予告",
    section: "session1",
    progressId: "s1-08-summary",
    sectionLabel: "第1回 Honoでよろず屋APIを作ろう",
    minutes: 10,
  },
];

export const SESSION2_PAGES: PageDef[] = [
  {
    path: "/session2/01-intro",
    file: "session2/ApiHoles",
    title: "今のAPIの穴",
    section: "session2",
    progressId: "s2-01-intro",
    sectionLabel: "第2回 堅牢なAPIにしよう",
    minutes: 10,
  },
  {
    path: "/session2/02-zod-basics",
    file: "session2/ZodBasics",
    title: "zodとは？バリデーションの基本",
    section: "session2",
    progressId: "s2-02-zod-basics",
    sectionLabel: "第2回 堅牢なAPIにしよう",
    minutes: 10,
  },
  {
    path: "/session2/03-zod-openapi",
    file: "session2/ZodOpenapi",
    title: "zod-openapiでリクエストを検証する",
    section: "session2",
    progressId: "s2-03-zod-openapi",
    sectionLabel: "第2回 堅牢なAPIにしよう",
    minutes: 25,
  },
  {
    path: "/session2/04-swagger-ui",
    file: "session2/SwaggerUi",
    title: "Swagger UIでドキュメントを見る",
    section: "session2",
    progressId: "s2-04-swagger-ui",
    sectionLabel: "第2回 堅牢なAPIにしよう",
    minutes: 15,
  },
  {
    path: "/session2/05-testing",
    file: "session2/Testing",
    title: "テストコードを書こう",
    section: "session2",
    progressId: "s2-05-testing",
    sectionLabel: "第2回 堅牢なAPIにしよう",
    minutes: 20,
  },
  {
    path: "/session2/06-summary",
    file: "session2/Session2Summary",
    title: "まとめ・次回予告",
    section: "session2",
    progressId: "s2-06-summary",
    sectionLabel: "第2回 堅牢なAPIにしよう",
    minutes: 10,
  },
];

export const SESSION3_PAGES: PageDef[] = [
  {
    path: "/session3/01-intro",
    file: "session3/D1Intro",
    title: "メモリ管理の限界とD1",
    section: "session3",
    progressId: "s3-01-intro",
    sectionLabel: "第3回 データベースを導入しよう",
    minutes: 10,
  },
  {
    path: "/session3/02-d1-setup",
    file: "session3/D1Setup",
    title: "D1データベースを作る",
    section: "session3",
    progressId: "s3-02-d1-setup",
    sectionLabel: "第3回 データベースを導入しよう",
    minutes: 15,
  },
  {
    path: "/session3/03-drizzle-setup",
    file: "session3/DrizzleSetup",
    title: "Drizzle ORMをセットアップする",
    section: "session3",
    progressId: "s3-03-drizzle-setup",
    sectionLabel: "第3回 データベースを導入しよう",
    minutes: 15,
  },
  {
    path: "/session3/04-migration",
    file: "session3/Migration",
    title: "マイグレーションを実行する（ローカル）",
    section: "session3",
    progressId: "s3-04-migration",
    sectionLabel: "第3回 データベースを導入しよう",
    minutes: 15,
  },
  {
    path: "/session3/05-read-api",
    file: "session3/ReadApi",
    title: "items一覧・詳細をDBから取得する",
    section: "session3",
    progressId: "s3-05-read-api",
    sectionLabel: "第3回 データベースを導入しよう",
    minutes: 15,
  },
  {
    path: "/session3/06-write-api",
    file: "session3/WriteApi",
    title: "purchase/sellをDB更新処理に書き換える",
    section: "session3",
    progressId: "s3-06-write-api",
    sectionLabel: "第3回 データベースを導入しよう",
    minutes: 20,
  },
  {
    path: "/session3/07-summary",
    file: "session3/Session3Summary",
    title: "まとめ・次回予告",
    section: "session3",
    progressId: "s3-07-summary",
    sectionLabel: "第3回 データベースを導入しよう",
    minutes: 10,
  },
];

export const SESSION4_PAGES: PageDef[] = [
  {
    path: "/session4/01-remote-migration",
    file: "session4/RemoteMigration",
    title: "本番D1へのマイグレーション",
    section: "session4",
    progressId: "s4-01-remote-migration",
    sectionLabel: "第4回 本番デプロイでよろず屋を開店しよう",
    minutes: 15,
  },
  {
    path: "/session4/02-deploy",
    file: "session4/Deploy",
    title: "Cloudflare Workersへデプロイする",
    section: "session4",
    progressId: "s4-02-deploy",
    sectionLabel: "第4回 本番デプロイでよろず屋を開店しよう",
    minutes: 15,
  },
  {
    path: "/session4/03-verify",
    file: "session4/Verify",
    title: "動作確認・よくあるトラブル",
    section: "session4",
    progressId: "s4-03-verify",
    sectionLabel: "第4回 本番デプロイでよろず屋を開店しよう",
    minutes: 15,
  },
  {
    path: "/session4/04-summary",
    file: "session4/Session4Summary",
    title: "全体まとめ・講座修了",
    section: "session4",
    progressId: "s4-04-summary",
    sectionLabel: "第4回 本番デプロイでよろず屋を開店しよう",
    minutes: 10,
  },
];

export const EXTRA_PAGES: PageDef[] = [
  {
    path: "/extra/rpc",
    file: "extra/Rpc",
    title: "サブクエスト：RPCで型安全な連携",
    section: "session1",
    sectionLabel: "サブクエスト",
    minutes: 15,
  },
  {
    path: "/extra/glossary",
    file: "extra/Glossary",
    title: "用語集（第1回）",
    section: "session1",
    sectionLabel: "サブクエスト",
  },
  {
    path: "/extra/glossary-2",
    file: "extra/Glossary2",
    title: "用語集（第2回）",
    section: "session2",
    sectionLabel: "サブクエスト",
  },
  {
    path: "/extra/glossary-3",
    file: "extra/Glossary3",
    title: "用語集（第3回）",
    section: "session3",
    sectionLabel: "サブクエスト",
  },
  {
    path: "/extra/glossary-4",
    file: "extra/Glossary4",
    title: "用語集（第4回）",
    section: "session4",
    sectionLabel: "サブクエスト",
  },
];

// 公開設定：この回まで公開する（値を変えてmainにpushすると自動デプロイで反映される）
// 例: 第2回まで公開したい場合は 2 にする
export const PUBLISHED_UP_TO = 4;

const SESSION_NUMBER: Partial<Record<NonNullable<PageDef["section"]>, number>> = {
  session1: 1,
  session2: 2,
  session3: 3,
  session4: 4,
};

function isPublished(section: PageDef["section"]): boolean {
  if (!section || section === "extra") return true;
  const num = SESSION_NUMBER[section];
  return num === undefined || num <= PUBLISHED_UP_TO;
}

// サブクエストページなど、ALL_PAGES以外の一覧を表示側で絞り込むときに使う
export function isPagePublished(page: PageDef): boolean {
  return isPublished(page.section);
}

export const ALL_PAGES: PageDef[] = [
  HOME,
  ...SESSION1_PAGES,
  ...SESSION2_PAGES,
  ...SESSION3_PAGES,
  ...SESSION4_PAGES,
  ...EXTRA_PAGES,
].filter((p) => isPublished(p.section));

// 進捗トラッキング対象のメインフロー（サブクエストは含めない）
export const MAIN_FLOW: PageDef[] = [
  ...SESSION1_PAGES,
  ...SESSION2_PAGES,
  ...SESSION3_PAGES,
  ...SESSION4_PAGES,
].filter((p) => isPublished(p.section));

export function findPage(path: string): PageDef | undefined {
  return ALL_PAGES.find((p) => p.path === path);
}

export function getNextPage(current: string): PageDef | undefined {
  const idx = MAIN_FLOW.findIndex((p) => p.path === current);
  if (idx === -1) return undefined;
  return MAIN_FLOW[idx + 1];
}

export function getPrevPage(current: string): PageDef | undefined {
  const idx = MAIN_FLOW.findIndex((p) => p.path === current);
  if (idx <= 0) return undefined;
  return MAIN_FLOW[idx - 1];
}
