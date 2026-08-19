import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

// jsdom は matchMedia を実装していないため、テーマ判定用にポリフィルする
if (typeof window !== "undefined" && !window.matchMedia) {
  window.matchMedia = (query: string) =>
    ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }) as MediaQueryList;
}

// vitestはデフォルトでglobalsが無効なため、RTLの自動cleanupが働かない。
// 明示的に各テスト後にDOMをクリーンアップする。
afterEach(() => {
  cleanup();
});
