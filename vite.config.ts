import { fileURLToPath, URL } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  build: {
    rolldownOptions: {
      output: {
        // ページをセッション単位のチャンクにまとめる（教材はセッション内を順に進むため、
        // 2ページ目以降の遷移では追加読み込みが発生しない）
        codeSplitting: {
          groups: [
            // 依存コンポーネントまで再帰的に取り込むと、共有コンポーネントが
            // 最初のセッションチャンクに吸収され、セッション間の依存が生まれるため false にする
            { name: "session1", test: /src[\\/]pages[\\/]session1[\\/]/, includeDependenciesRecursively: false },
            { name: "session2", test: /src[\\/]pages[\\/]session2[\\/]/, includeDependenciesRecursively: false },
            { name: "session3", test: /src[\\/]pages[\\/]session3[\\/]/, includeDependenciesRecursively: false },
            { name: "session4", test: /src[\\/]pages[\\/]session4[\\/]/, includeDependenciesRecursively: false },
            { name: "extra", test: /src[\\/]pages[\\/]extra[\\/]/, includeDependenciesRecursively: false },
            { name: "home", test: /src[\\/]pages[\\/]Home\.tsx$/, includeDependenciesRecursively: false },
            // 教材コンポーネントは共有チャンクにまとめる
            { name: "shared", test: /src[\\/]components[\\/]/ },
          ],
        },
      },
    },
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
  },
});
