import { describe, expect, it } from "vitest";
import {
  ALL_PAGES,
  EXTRA_PAGES,
  MAIN_FLOW,
  SESSION1_PAGES,
  findPage,
  getNextPage,
  getPrevPage,
} from "./routes";
import { getRegisteredPageFiles } from "./pageResolver";

describe("routes（ページ構成）", () => {
  it("パスが重複していない", () => {
    const paths = ALL_PAGES.map((p) => p.path);
    expect(new Set(paths).size).toBe(paths.length);
  });

  it("progressIdが重複していない", () => {
    const ids = ALL_PAGES.filter((p) => p.progressId).map((p) => p.progressId);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("メインフローの全ページにprogressIdがある", () => {
    for (const p of MAIN_FLOW) {
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
      expect(MAIN_FLOW.find((m) => m.path === p.path)).toBeUndefined();
    }
  });

  it("全ページにコンポーネントのfileが登録されている", () => {
    for (const p of ALL_PAGES) {
      expect(p.file, `${p.path} に file がない`).toBeTruthy();
    }
  });

  it("file が実際のページモジュールに存在する", () => {
    const files = getRegisteredPageFiles();
    for (const p of ALL_PAGES) {
      expect(files, `${p.path} の file (${p.file}) が存在しない`).toContain(p.file);
    }
  });
});
