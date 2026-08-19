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

// セッション名 → そのセッションに属するfile一覧（先読み時に全fileを毎回走査しないための索引）
const sessionIndex = new Map<string, string[]>();
for (const file of Object.keys(moduleMap)) {
  const slash = file.indexOf("/");
  if (slash === -1) continue; // Home のようにセッションに属さないページは対象外
  const session = file.slice(0, slash);
  const list = sessionIndex.get(session);
  if (list) list.push(file);
  else sessionIndex.set(session, [file]);
}

// file単位のロード状態を一本化する。preload（先読み）と実描画（lazy）の両方が
// このMapを経由するため、同じファイルへの二重ロードが起きない
const loadPromises = new Map<string, Promise<ComponentType>>();
// ロード済み（評価済み）ページのコンポーネントを保持する同期レジストリ。
// ここに登録済みのページは lazy() を経由せず直接描画されるため、
// ページ遷移で Suspense フォールバック（「依頼書を開いています…」）が
// 一切表示されなくなる（サスペンド自体が発生しない）
const resolvedComponents = new Map<string, ComponentType>();
const lazyComponents = new Map<string, LazyExoticComponent<ComponentType>>();

// テスト用: 登録されているページモジュールの一覧（routes.test.ts が file の存在確認に使う）
export function getRegisteredPageFiles(): string[] {
  return Object.keys(moduleMap);
}

// テスト用: file に対応するモジュールを実際にロードする
// （routes.test.ts が「export名がファイル名と一致しているか」の検証に使う）
export function loadPageModule(
  file: string
): Promise<Record<string, unknown>> | undefined {
  return moduleMap[file]?.();
}

// file に対応するコンポーネントをロードする（進行中のロードがあれば使い回す）。
// 規約: ページコンポーネントのエクスポート名はファイル名と同じ（例: FirstApi.tsx → export function FirstApi）
function loadComponent(file: string): Promise<ComponentType> {
  const inFlight = loadPromises.get(file);
  if (inFlight) return inFlight;

  const loader = moduleMap[file];
  if (!loader) {
    return Promise.reject(
      new Error(`[yorozuya] ページモジュールが見つかりません: ${file}`)
    );
  }

  const exportName = file.split("/").pop()!;
  const promise = loader()
    .then((m) => {
      const C = m[exportName] as ComponentType | undefined;
      if (!C) {
        throw new Error(
          `[yorozuya] ページコンポーネントが見つかりません: ${file} (export: ${exportName})`
        );
      }
      resolvedComponents.set(file, C);
      return C;
    })
    .catch((err) => {
      // 失敗をキャッシュに残さない。ネットワーク不調などの一時的な失敗から
      // 再試行できるようにする
      loadPromises.delete(file);
      throw err;
    });

  loadPromises.set(file, promise);
  return promise;
}

// セッション内の全ページを先読みする。セッションのページは1つのチャンクに
// まとまっているため、先読みは最初の1回だけネットワークを消費する
export function preloadSession(session: string) {
  for (const file of sessionIndex.get(session) ?? []) {
    void loadComponent(file).catch(() => {
      // 読み込み失敗は遅延ロード側（lazy）で改めてエラーになるため、ここでは無視
    });
  }
}

// 指定ページを先読みする（NextLink などが次ページの遷移をスムーズにするために使う）
export function preloadPage(file: string) {
  void loadComponent(file).catch(() => {
    // 読み込み失敗は遅延ロード側（lazy）で改めてエラーになるため、ここでは無視
  });
}

// PageDef.file に対応するページコンポーネントを返す（見つからなければ null）。
// 先読み済みのページはサスペンドしない実コンポーネント、未ロードのページは lazy を返す
export function getPageComponent(
  page: PageDef
): ComponentType | LazyExoticComponent<ComponentType> | null {
  const file = page.file;
  if (!file) return null;

  const resolved = resolvedComponents.get(file);
  if (resolved) return resolved;

  const cachedLazy = lazyComponents.get(file);
  if (cachedLazy) return cachedLazy;

  if (!moduleMap[file]) return null;

  const comp = lazy(() => loadComponent(file).then((C) => ({ default: C })));
  lazyComponents.set(file, comp);
  return comp;
}
