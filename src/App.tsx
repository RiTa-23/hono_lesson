import { useEffect, useState } from "react";
import { Layout } from "@/components/Layout";
import { ensureVersion } from "@/lib/storage";
import { Home } from "@/pages/Home";
import { AboutApi } from "@/pages/session1/AboutApi";
import { AboutHono } from "@/pages/session1/AboutHono";
import { Setup } from "@/pages/session1/Setup";
import { FirstApi } from "@/pages/session1/FirstApi";
import { PathParam } from "@/pages/session1/PathParam";
import { PostApi } from "@/pages/session1/PostApi";
import { CorsFrontend } from "@/pages/session1/CorsFrontend";
import { Summary } from "@/pages/session1/Summary";
import { Rpc } from "@/pages/extra/Rpc";
import { Glossary } from "@/pages/extra/Glossary";
import { NotFound } from "@/pages/NotFound";
// TODO: 一時的なテーマ比較モック（テーマ確定後に削除）
import { Mock } from "@/pages/Mock";

function normalizeHash(): string {
  const h = window.location.hash || "";
  const raw = h.startsWith("#") ? h.slice(1) : h;
  if (!raw || raw === "/") return "/";
  return raw.startsWith("/") ? raw : "/" + raw;
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

  const PageComponent = resolvePage(path);

  return (
    <Layout currentPath={path}>
      <PageComponent />
    </Layout>
  );
}

function resolvePage(path: string): () => React.JSX.Element {
  switch (path) {
    case "/":
      return Home;
    case "/session1/01-about-api":
      return AboutApi;
    case "/session1/02-about-hono":
      return AboutHono;
    case "/session1/03-setup":
      return Setup;
    case "/session1/04-first-api":
      return FirstApi;
    case "/session1/05-path-param":
      return PathParam;
    case "/session1/06-post-api":
      return PostApi;
    case "/session1/07-cors-frontend":
      return CorsFrontend;
    case "/session1/08-summary":
      return Summary;
    case "/extra/rpc":
      return Rpc;
    case "/extra/glossary":
      return Glossary;
    // TODO: 一時的なテーマ比較モック（テーマ確定後に削除）
    case "/mock":
      return Mock;
    default:
      return NotFound;
  }
}

export default App;
