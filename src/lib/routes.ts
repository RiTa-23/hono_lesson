export type PageDef = {
  path: string;
  title: string;
  section?: "session1" | "session2" | "session3" | "session4" | "extra";
  progressId?: string;
  sectionLabel?: string;
  minutes?: number; // 所要時間の目安（分）
};

export const HOME: PageDef = { path: "/", title: "よろず屋API講座" };

export const SESSION1_PAGES: PageDef[] = [
  {
    path: "/session1/01-about-api",
    title: "APIとは？",
    section: "session1",
    progressId: "s1-01-about-api",
    sectionLabel: "第1回 Honoでよろず屋APIを作ろう",
    minutes: 10,
  },
  {
    path: "/session1/02-about-hono",
    title: "Honoとは？",
    section: "session1",
    progressId: "s1-02-about-hono",
    sectionLabel: "第1回 Honoでよろず屋APIを作ろう",
    minutes: 10,
  },
  {
    path: "/session1/03-setup",
    title: "プロジェクトのセットアップ",
    section: "session1",
    progressId: "s1-03-setup",
    sectionLabel: "第1回 Honoでよろず屋APIを作ろう",
    minutes: 20,
  },
  {
    path: "/session1/04-first-api",
    title: "最初のAPI：商品一覧",
    section: "session1",
    progressId: "s1-04-first-api",
    sectionLabel: "第1回 Honoでよろず屋APIを作ろう",
    minutes: 15,
  },
  {
    path: "/session1/05-path-param",
    title: "商品詳細と404",
    section: "session1",
    progressId: "s1-05-path-param",
    sectionLabel: "第1回 Honoでよろず屋APIを作ろう",
    minutes: 15,
  },
  {
    path: "/session1/06-post-api",
    title: "購入・売却API（POST）",
    section: "session1",
    progressId: "s1-06-post-api",
    sectionLabel: "第1回 Honoでよろず屋APIを作ろう",
    minutes: 20,
  },
  {
    path: "/session1/07-cors-frontend",
    title: "フロントとつなげよう（CORS）",
    section: "session1",
    progressId: "s1-07-cors-frontend",
    sectionLabel: "第1回 Honoでよろず屋APIを作ろう",
    minutes: 20,
  },
  {
    path: "/session1/08-summary",
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
    title: "今のAPIの穴",
    section: "session2",
    progressId: "s2-01-intro",
    sectionLabel: "第2回 堅牢なAPIにしよう",
    minutes: 10,
  },
  {
    path: "/session2/02-zod-basics",
    title: "zodとは？バリデーションの基本",
    section: "session2",
    progressId: "s2-02-zod-basics",
    sectionLabel: "第2回 堅牢なAPIにしよう",
    minutes: 10,
  },
  {
    path: "/session2/03-zod-openapi",
    title: "zod-openapiでリクエストを検証する",
    section: "session2",
    progressId: "s2-03-zod-openapi",
    sectionLabel: "第2回 堅牢なAPIにしよう",
    minutes: 25,
  },
  {
    path: "/session2/04-swagger-ui",
    title: "Swagger UIでドキュメントを見る",
    section: "session2",
    progressId: "s2-04-swagger-ui",
    sectionLabel: "第2回 堅牢なAPIにしよう",
    minutes: 15,
  },
  {
    path: "/session2/05-testing",
    title: "テストコードを書こう",
    section: "session2",
    progressId: "s2-05-testing",
    sectionLabel: "第2回 堅牢なAPIにしよう",
    minutes: 20,
  },
  {
    path: "/session2/06-summary",
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
    title: "メモリ管理の限界とD1",
    section: "session3",
    progressId: "s3-01-intro",
    sectionLabel: "第3回 データベースを導入しよう",
    minutes: 10,
  },
  {
    path: "/session3/02-d1-setup",
    title: "D1データベースを作る",
    section: "session3",
    progressId: "s3-02-d1-setup",
    sectionLabel: "第3回 データベースを導入しよう",
    minutes: 15,
  },
  {
    path: "/session3/03-drizzle-setup",
    title: "Drizzle ORMをセットアップする",
    section: "session3",
    progressId: "s3-03-drizzle-setup",
    sectionLabel: "第3回 データベースを導入しよう",
    minutes: 15,
  },
  {
    path: "/session3/04-migration",
    title: "マイグレーションを実行する（ローカル）",
    section: "session3",
    progressId: "s3-04-migration",
    sectionLabel: "第3回 データベースを導入しよう",
    minutes: 15,
  },
  {
    path: "/session3/05-read-api",
    title: "items一覧・詳細をDBから取得する",
    section: "session3",
    progressId: "s3-05-read-api",
    sectionLabel: "第3回 データベースを導入しよう",
    minutes: 15,
  },
  {
    path: "/session3/06-write-api",
    title: "purchase/sellをDB更新処理に書き換える",
    section: "session3",
    progressId: "s3-06-write-api",
    sectionLabel: "第3回 データベースを導入しよう",
    minutes: 20,
  },
];

export const SESSION4_PAGES: PageDef[] = [
  {
    path: "/session4/01-remote-migration",
    title: "本番D1へのマイグレーション",
    section: "session4",
    progressId: "s4-01-remote-migration",
    sectionLabel: "第4回 本番デプロイでよろず屋を開店しよう",
    minutes: 15,
  },
  {
    path: "/session4/02-deploy",
    title: "Cloudflare Workersへデプロイする",
    section: "session4",
    progressId: "s4-02-deploy",
    sectionLabel: "第4回 本番デプロイでよろず屋を開店しよう",
    minutes: 15,
  },
  {
    path: "/session4/03-verify",
    title: "動作確認・よくあるトラブル",
    section: "session4",
    progressId: "s4-03-verify",
    sectionLabel: "第4回 本番デプロイでよろず屋を開店しよう",
    minutes: 15,
  },
  {
    path: "/session4/04-summary",
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
    title: "おまけ：RPCで型安全な連携",
    section: "extra",
    sectionLabel: "おまけ",
    minutes: 15,
  },
  {
    path: "/extra/glossary",
    title: "用語集",
    section: "extra",
    sectionLabel: "おまけ",
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

export const ALL_PAGES: PageDef[] = [
  HOME,
  ...SESSION1_PAGES,
  ...SESSION2_PAGES,
  ...SESSION3_PAGES,
  ...SESSION4_PAGES,
  ...EXTRA_PAGES,
].filter((p) => isPublished(p.section));

// 進捗トラッキング対象のメインフロー（おまけは含めない）
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
