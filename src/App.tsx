import { Suspense, useEffect, useState } from "react";
import type { ComponentType } from "react";
import { Layout } from "@/components/Layout";
import { findPage } from "@/lib/routes";
import { getPageComponent, preloadSession } from "@/lib/pageResolver";
import { ensureVersion } from "@/lib/storage";
import { NotFound } from "@/pages/NotFound";

function normalizeHash(): string {
  const h = window.location.hash || "";
  const raw = h.startsWith("#") ? h.slice(1) : h;
  if (!raw || raw === "/") return "/";
  return raw.startsWith("/") ? raw : "/" + raw;
}

// 遅延ロード中のフォールバック（依頼書風）
function PageLoading() {
  return (
    <div className="flex justify-center py-24">
      <p className="animate-pulse font-serif text-sm tracking-widest text-muted-foreground">
        依頼書を開いています…
      </p>
    </div>
  );
}

function App() {
  const [path, setPath] = useState(() => {
    if (typeof window === "undefined") return "/";
    return normalizeHash();
  });

  useEffect(() => {
    ensureVersion();
    const onHash = () => {
      const p = normalizeHash();
      setPath(p);
      // ページ遷移時は先頭にスクロール
      window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
    };
    window.addEventListener("hashchange", onHash);
    if (!window.location.hash) window.location.hash = "#/";
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const currentPage = findPage(path);

  useEffect(() => {
    // 現在のセッションの全ページを先読みする。セッションのページは1チャンクに
    // まとまっているため、同一セッション内の遷移ではフォールバックが表示されない
    if (currentPage?.file) {
      preloadSession(currentPage.file.split("/")[0]);
    }
  }, [path]);

  const PageComponent = resolvePage(path);

  return (
    <Layout currentPath={path}>
      <Suspense fallback={<PageLoading />}>
        <PageComponent />
      </Suspense>
    </Layout>
  );
}

// 未公開の回（PUBLISHED_UP_TOより先）は、直接URLを叩かれても404にする
function resolvePage(path: string): ComponentType {
  const page = findPage(path);
  if (!page) return NotFound;
  return getPageComponent(page) ?? NotFound;
}

export default App;
