import { lazy, type ComponentType, type LazyExoticComponent } from "react";
import type { PageDef } from "@/lib/routes";

// src/pages 配下のページコンポーネントをすべて遅延ロード対象にする。
// キーは import 文と同じ相対指定になる（例: "../pages/session1/FirstApi.tsx"）
const pageModules = import.meta.glob("../pages/**/*.tsx");

// "../pages/session1/FirstApi.tsx" → "session1/FirstApi"（PageDef.file の形式に正規化）
const moduleMap: Record<string, () => Promise<Record<string, unknown>>> =
  Object.fromEntries(
    Object.entries(pageModules)
      .filter(([key]) => !/\.test\.tsx$/.test(key)) // テストファイルは対象外
      .map(([key, loader]) => [
        key.replace(/^\.\.\/pages\//, "").replace(/\.tsx$/, ""),
        loader as () => Promise<Record<string, unknown>>,
      ])
  );

const cache = new Map<string, LazyExoticComponent<ComponentType>>();

// ロード済み（評価済み）ページのコンポーネントを保持する同期レジストリ。
// ここに登録済みのページは lazy() を経由せず直接描画されるため、
// ページ遷移で Suspense フォールバック（「依頼書を開いています…」）が
// 一切表示されなくなる（サスペンド自体が発生しない）
const loadedComponents = new Map<string, ComponentType>();

// テスト用: 登録されているページモジュールの一覧（routes.test.ts が file の存在確認に使う）
export function getRegisteredPageFiles(): string[] {
  return Object.keys(moduleMap);
}

function loadModule(file: string) {
  if (loadedComponents.has(file)) return;
  const loader = moduleMap[file];
  if (!loader) return;
  // 規約: ページコンポーネントのエクスポート名はファイル名と同じ（例: FirstApi.tsx → export function FirstApi）
  const exportName = file.split("/").pop()!;
  void loader()
    .then((m) => {
      const C = m[exportName] as ComponentType | undefined;
      if (C) loadedComponents.set(file, C);
    })
    .catch(() => {
      // 読み込み失敗は遅延ロード側（lazy）で改めてエラーになるため、ここでは無視
    });
}

// セッション内の全ページを先読みする。セッションのページは1つのチャンクに
// まとまっているため、先読みは最初の1回だけネットワークを消費する。
// 先読み完了後は loadedComponents に登録され、遷移時にサスペンドしない
export function preloadSession(session: string) {
  for (const file of Object.keys(moduleMap)) {
    if (file.startsWith(`${session}/`)) loadModule(file);
  }
}

// 指定ページを先読みする（NextLink などが次ページの遷移をスムーズにするために使う）
export function preloadPage(file: string) {
  loadModule(file);
}

// PageDef.file に対応するページコンポーネントを返す（見つからなければ null）。
// 先読み済みのページはサスペンドしない実コンポーネント、未ロードのページは lazy を返す
export function getPageComponent(
  page: PageDef
): ComponentType | LazyExoticComponent<ComponentType> | null {
  const file = page.file;
  if (!file) return null;
  const loaded = loadedComponents.get(file);
  if (loaded) return loaded;
  const cached = cache.get(page.path);
  if (cached) return cached;
  const loader = moduleMap[file];
  if (!loader) return null;
  const exportName = file.split("/").pop()!;
  const comp = lazy(() =>
    loader().then((m) => {
      const C = m[exportName] as ComponentType | undefined;
      if (!C) {
        throw new Error(
          `[yorozuya] ページコンポーネントが見つかりません: ${file} (export: ${exportName})`
        );
      }
      // 一度ロードしたページは以降サスペンドさせない
      loadedComponents.set(file, C);
      return { default: C };
    })
  );
  cache.set(page.path, comp);
  return comp;
}
