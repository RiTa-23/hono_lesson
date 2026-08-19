import { describe, expect, it } from "vitest";
import {
  EXTRA_PAGES,
  EXTRA_TOP,
  MAIN_FLOW,
  PUBLISHED_UP_TO,
  SESSION1_PAGES,
  SESSION_TOP_PAGES,
  computeAllPages,
  computeMainFlow,
  findPage,
  getNextPage,
  getPrevPage,
} from "./routes";
import { getRegisteredPageFiles, loadPageModule } from "./pageResolver";

// コンテンツの整合性（重複・ファイル存在など）は、今の公開範囲（PUBLISHED_UP_TO）に
// 関わらず全ページを対象に検証する。そうしないと「未公開の回に壊れたページがある」
// ことに誰も気づけないまま公開してしまう
const FULL_ALL_PAGES = computeAllPages(4);
const FULL_MAIN_FLOW = computeMainFlow(4);

describe("routes（ページ構成）", () => {
  it("パスが重複していない", () => {
    const paths = FULL_ALL_PAGES.map((p) => p.path);
    expect(new Set(paths).size).toBe(paths.length);
  });

  it("progressIdが重複していない", () => {
    const ids = FULL_ALL_PAGES.filter((p) => p.progressId).map((p) => p.progressId);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("メインフローの全ページにprogressIdがある", () => {
    for (const p of FULL_MAIN_FLOW) {
      expect(p.progressId, `${p.path} に progressId がない`).toBeTruthy();
    }
  });

  it("第1回は8ステップある", () => {
    expect(SESSION1_PAGES).toHaveLength(8);
  });

  it("findPageでパスからページを引ける", () => {
    expect(findPage("/session1/01-about-api")?.title).toBe("APIとは？");
    expect(findPage("/no-such-page")).toBeUndefined();
  });

  it("getNextPage / getPrevPage がメインフロー順に動く", () => {
    expect(getNextPage("/session1/01-about-api")?.path).toBe("/session1/02-about-hono");
    expect(getPrevPage("/session1/02-about-hono")?.path).toBe("/session1/01-about-api");
  });

  it("先頭に前のページはなく、末尾に次のページはない", () => {
    expect(getPrevPage(MAIN_FLOW[0].path)).toBeUndefined();
    expect(getNextPage(MAIN_FLOW[MAIN_FLOW.length - 1].path)).toBeUndefined();
  });

  it("サブクエストページはメインフローに含まれない", () => {
    for (const p of EXTRA_PAGES) {
      expect(FULL_MAIN_FLOW.find((m) => m.path === p.path)).toBeUndefined();
    }
  });

  it("各回のトップページはメインフローに含まれず、progressIdも持たない", () => {
    for (const p of SESSION_TOP_PAGES) {
      expect(FULL_MAIN_FLOW.find((m) => m.path === p.path)).toBeUndefined();
      expect(p.progressId, `${p.path} は進捗トラッキング対象外のはず`).toBeUndefined();
    }
  });

  it("サブクエストの各ページにprogressIdがある", () => {
    for (const p of EXTRA_PAGES) {
      expect(p.progressId, `${p.path} に progressId がない`).toBeTruthy();
    }
  });

  it("サブクエストのトップページはメインフローに含まれず、progressIdも持たない。常に公開される", () => {
    expect(FULL_MAIN_FLOW.find((m) => m.path === EXTRA_TOP.path)).toBeUndefined();
    expect(EXTRA_TOP.progressId).toBeUndefined();
    expect(findPage(EXTRA_TOP.path)).toBeDefined();
  });

  it("各回のトップページが、公開状況に応じてfindPageから引ける・引けない", () => {
    for (let n = 1; n <= 4; n++) {
      const path = `/session${n}`;
      const found = findPage(path);
      if (n <= PUBLISHED_UP_TO) {
        expect(found, `${path} が見つからない`).toBeDefined();
      } else {
        expect(found, `${path} は未公開のはずなのに見つかった`).toBeUndefined();
      }
    }
  });

  it("全ページにコンポーネントのfileが登録されている", () => {
    for (const p of FULL_ALL_PAGES) {
      expect(p.file, `${p.path} に file がない`).toBeTruthy();
    }
  });

  it("file が実際のページモジュールに存在する", () => {
    const files = getRegisteredPageFiles();
    for (const p of FULL_ALL_PAGES) {
      expect(files, `${p.path} の file (${p.file}) が存在しない`).toContain(p.file);
    }
  });

  it("file に対応するexportがファイル名と同じ規約で存在する", async () => {
    for (const p of FULL_ALL_PAGES) {
      if (!p.file) continue;
      const mod = await loadPageModule(p.file);
      const exportName = p.file.split("/").pop()!;
      expect(
        mod?.[exportName],
        `${p.file} に export ${exportName} がない（ファイル名とexport名の規約を確認）`
      ).toBeTypeOf("function");
    }
  });
});
