export type PageDef = {
  path: string;
  title: string;
  section?: "session1" | "session2" | "session3" | "extra";
  progressId?: string;
  sectionLabel?: string;
  minutes?: number; // 所要時間の目安（分）
};

export const HOME: PageDef = { path: "/", title: "よろず屋DX講座" };

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

// 第2回・第3回は開催前に同じリポジトリへ追記する（パスは予約済み）
export const SESSION2_PAGES: PageDef[] = [];
export const SESSION3_PAGES: PageDef[] = [];

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

export const ALL_PAGES: PageDef[] = [
  HOME,
  ...SESSION1_PAGES,
  ...SESSION2_PAGES,
  ...SESSION3_PAGES,
  ...EXTRA_PAGES,
];

// 進捗トラッキング対象のメインフロー（おまけは含めない）
export const MAIN_FLOW: PageDef[] = [...SESSION1_PAGES];

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
