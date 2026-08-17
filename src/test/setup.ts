import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

// vitestはデフォルトでglobalsが無効なため、RTLの自動cleanupが働かない。
// 明示的に各テスト後にDOMをクリーンアップする。
afterEach(() => {
  cleanup();
});
