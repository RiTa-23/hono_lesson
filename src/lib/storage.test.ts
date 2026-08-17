import { beforeEach, describe, expect, it } from "vitest";
import {
  __resetMemoryForTest,
  __resetWarnedForTest,
  clearAllProgress,
  getAllProgress,
  getProgress,
  getTheme,
  setProgress,
  setTheme,
  storageAvailable,
} from "./storage";

describe("storage（進捗の永続化）", () => {
  beforeEach(() => {
    localStorage.clear();
    __resetMemoryForTest();
    __resetWarnedForTest();
  });

  it("初期状態では未完了（false）を返す", () => {
    expect(getProgress("s1-01-about-api")).toBe(false);
  });

  it("setProgressで完了を保存し、getProgressで読める", () => {
    setProgress("s1-01-about-api", true);
    expect(getProgress("s1-01-about-api")).toBe(true);
  });

  it("falseを設定するとキーが削除される", () => {
    setProgress("s1-01-about-api", true);
    setProgress("s1-01-about-api", false);
    expect(getProgress("s1-01-about-api")).toBe(false);
    expect(getAllProgress()).not.toHaveProperty("s1-01-about-api");
  });

  it("getAllProgressは完了済みのIDだけを返す", () => {
    setProgress("a", true);
    setProgress("b", true);
    setProgress("c", false);
    const all = getAllProgress();
    expect(all).toEqual({ a: true, b: true });
  });

  it("clearAllProgressですべての進捗が消える", () => {
    setProgress("a", true);
    setProgress("b", true);
    clearAllProgress();
    expect(getAllProgress()).toEqual({});
  });

  it("setProgressでprogress-updatedイベントが発火する", () => {
    let received: { id: string; value: boolean } | null = null;
    const handler = (e: Event) => {
      received = (e as CustomEvent).detail;
    };
    window.addEventListener("progress-updated", handler);
    setProgress("a", true);
    window.removeEventListener("progress-updated", handler);
    expect(received).toEqual({ id: "a", value: true });
  });

  it("clearAllProgressでprogress-clearedイベントが発火する", () => {
    let fired = false;
    const handler = () => {
      fired = true;
    };
    window.addEventListener("progress-cleared", handler);
    clearAllProgress();
    window.removeEventListener("progress-cleared", handler);
    expect(fired).toBe(true);
  });

  it("テーマを保存・読み出しできる", () => {
    expect(getTheme()).toBeNull();
    setTheme("dark");
    expect(getTheme()).toBe("dark");
    setTheme("light");
    expect(getTheme()).toBe("light");
  });

  it("jsdom環境ではlocalStorageが使える", () => {
    expect(storageAvailable()).toBe(true);
  });
});
