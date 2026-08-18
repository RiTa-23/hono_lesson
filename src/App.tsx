import { useEffect, useState } from "react";
import { Layout } from "@/components/Layout";
import { findPage } from "@/lib/routes";
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
import { ApiHoles } from "@/pages/session2/ApiHoles";
import { ZodBasics } from "@/pages/session2/ZodBasics";
import { ZodOpenapi } from "@/pages/session2/ZodOpenapi";
import { SwaggerUi } from "@/pages/session2/SwaggerUi";
import { Testing } from "@/pages/session2/Testing";
import { Session2Summary } from "@/pages/session2/Session2Summary";
import { D1Intro } from "@/pages/session3/D1Intro";
import { D1Setup } from "@/pages/session3/D1Setup";
import { DrizzleSetup } from "@/pages/session3/DrizzleSetup";
import { Migration } from "@/pages/session3/Migration";
import { ReadApi } from "@/pages/session3/ReadApi";
import { WriteApi } from "@/pages/session3/WriteApi";
import { RemoteMigration } from "@/pages/session4/RemoteMigration";
import { Deploy } from "@/pages/session4/Deploy";
import { Verify } from "@/pages/session4/Verify";
import { Session4Summary } from "@/pages/session4/Session4Summary";
import { Rpc } from "@/pages/extra/Rpc";
import { Glossary } from "@/pages/extra/Glossary";
import { NotFound } from "@/pages/NotFound";

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
  // 未公開の回（PUBLISHED_UP_TOより先）は、直接URLを叩かれても404にする
  if (!findPage(path)) return NotFound;

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
    case "/session2/01-intro":
      return ApiHoles;
    case "/session2/02-zod-basics":
      return ZodBasics;
    case "/session2/03-zod-openapi":
      return ZodOpenapi;
    case "/session2/04-swagger-ui":
      return SwaggerUi;
    case "/session2/05-testing":
      return Testing;
    case "/session2/06-summary":
      return Session2Summary;
    case "/session3/01-intro":
      return D1Intro;
    case "/session3/02-d1-setup":
      return D1Setup;
    case "/session3/03-drizzle-setup":
      return DrizzleSetup;
    case "/session3/04-migration":
      return Migration;
    case "/session3/05-read-api":
      return ReadApi;
    case "/session3/06-write-api":
      return WriteApi;
    case "/session4/01-remote-migration":
      return RemoteMigration;
    case "/session4/02-deploy":
      return Deploy;
    case "/session4/03-verify":
      return Verify;
    case "/session4/04-summary":
      return Session4Summary;
    case "/extra/rpc":
      return Rpc;
    case "/extra/glossary":
      return Glossary;
    default:
      return NotFound;
  }
}

export default App;
