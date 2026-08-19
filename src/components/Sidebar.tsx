import { useEffect, useState, type ReactNode } from "react";
import {
  ChevronDown,
  CheckCircle2,
  MapPin,
  Store,
  ShieldCheck,
  Database,
  Rocket,
  Home,
} from "lucide-react";
import {
  SESSION1_PAGES,
  SESSION2_PAGES,
  SESSION3_PAGES,
  SESSION4_PAGES,
  EXTRA_PAGES,
  HOME,
  PUBLISHED_UP_TO,
  isPagePublished,
} from "@/lib/routes";
import type { PageDef } from "@/lib/routes";
import { getAllProgress } from "@/lib/storage";
import { cn } from "@/lib/utils";
import { ClearedBadge } from "@/components/ClearedBadge";
import { ProgressReset } from "@/components/ProgressReset";

type Props = {
  currentPath: string;
  onNavigate?: () => void;
};

export function Sidebar({ currentPath, onNavigate }: Props) {
  const [progress, setProgress] = useState<Record<string, boolean>>({});
  const [openS1, setOpenS1] = useState(true);
  const [openS2, setOpenS2] = useState(false);
  const [openS3, setOpenS3] = useState(false);
  const [openS4, setOpenS4] = useState(false);
  const [openExtra, setOpenExtra] = useState(false);

  useEffect(() => {
    setProgress(getAllProgress());
    const refresh = () => setProgress(getAllProgress());
    window.addEventListener("progress-updated", refresh);
    window.addEventListener("progress-cleared", refresh);
    return () => {
      window.removeEventListener("progress-updated", refresh);
      window.removeEventListener("progress-cleared", refresh);
    };
  }, []);

  // 現在ページのセクションを自動で開く
  useEffect(() => {
    if (currentPath.startsWith("/session1")) setOpenS1(true);
    if (currentPath.startsWith("/session2")) setOpenS2(true);
    if (currentPath.startsWith("/session3")) setOpenS3(true);
    if (currentPath.startsWith("/session4")) setOpenS4(true);
    if (currentPath.startsWith("/extra")) setOpenExtra(true);
  }, [currentPath]);

  const countProgress = (pages: PageDef[]) => {
    const withId = pages.filter((p) => p.progressId);
    const done = withId.filter((p) => progress[p.progressId!]).length;
    return { done, total: withId.length };
  };

  return (
    <nav aria-label="教材ナビゲーション" className="flex flex-col gap-0.5 p-3 pb-16">
      <a
        href={`#${HOME.path}`}
        onClick={onNavigate}
        className={cn(
          "group mb-3 flex items-center gap-2 rounded-sm px-3 py-2 text-sm font-bold transition",
          currentPath === "/"
            ? "bg-primary/10 text-primary"
            : "text-foreground hover:bg-secondary"
        )}
      >
        <Home size={15} />
        トップ
      </a>

      <Section
        label="第1回：よろず屋API"
        icon={<Store size={14} />}
        open={openS1}
        onToggle={() => setOpenS1((v) => !v)}
        progress={countProgress(SESSION1_PAGES)}
        topPath="/session1"
        active={currentPath === "/session1"}
        onNavigate={onNavigate}
      >
        {SESSION1_PAGES.map((p, i) => (
          <NavItem
            key={p.path}
            page={p}
            index={i + 1}
            active={currentPath === p.path}
            done={!!(p.progressId && progress[p.progressId])}
            onNavigate={onNavigate}
          />
        ))}
      </Section>

      {PUBLISHED_UP_TO >= 2 && (
        <Section
          label="第2回：堅牢なAPIにしよう"
          icon={<ShieldCheck size={14} />}
          open={openS2}
          onToggle={() => setOpenS2((v) => !v)}
          progress={countProgress(SESSION2_PAGES)}
          topPath="/session2"
          active={currentPath === "/session2"}
          onNavigate={onNavigate}
        >
          {SESSION2_PAGES.map((p, i) => (
            <NavItem
              key={p.path}
              page={p}
              index={i + 1}
              active={currentPath === p.path}
              done={!!(p.progressId && progress[p.progressId])}
              onNavigate={onNavigate}
            />
          ))}
        </Section>
      )}

      {PUBLISHED_UP_TO >= 3 && (
        <Section
          label="第3回：データベースを導入しよう"
          icon={<Database size={14} />}
          open={openS3}
          onToggle={() => setOpenS3((v) => !v)}
          progress={countProgress(SESSION3_PAGES)}
          topPath="/session3"
          active={currentPath === "/session3"}
          onNavigate={onNavigate}
        >
          {SESSION3_PAGES.map((p, i) => (
            <NavItem
              key={p.path}
              page={p}
              index={i + 1}
              active={currentPath === p.path}
              done={!!(p.progressId && progress[p.progressId])}
              onNavigate={onNavigate}
            />
          ))}
        </Section>
      )}

      {PUBLISHED_UP_TO >= 4 && (
        <Section
          label="第4回：本番デプロイでよろず屋を開店しよう"
          icon={<Rocket size={14} />}
          open={openS4}
          onToggle={() => setOpenS4((v) => !v)}
          progress={countProgress(SESSION4_PAGES)}
          topPath="/session4"
          active={currentPath === "/session4"}
          onNavigate={onNavigate}
        >
          {SESSION4_PAGES.map((p, i) => (
            <NavItem
              key={p.path}
              page={p}
              index={i + 1}
              active={currentPath === p.path}
              done={!!(p.progressId && progress[p.progressId])}
              onNavigate={onNavigate}
            />
          ))}
        </Section>
      )}

      <div className="mt-6">
        <Section
          label="サブクエスト"
          icon={<MapPin size={14} />}
          open={openExtra}
          onToggle={() => setOpenExtra((v) => !v)}
          progress={countProgress(EXTRA_PAGES.filter(isPagePublished))}
          topPath="/extra"
          active={currentPath === "/extra"}
          onNavigate={onNavigate}
        >
          {EXTRA_PAGES.filter(isPagePublished).map((p) => (
            <NavItem
              key={p.path}
              page={p}
              active={currentPath === p.path}
              done={!!(p.progressId && progress[p.progressId])}
              onNavigate={onNavigate}
            />
          ))}
        </Section>
      </div>

      <div className="mt-8 border-t pt-4">
        <ProgressReset />
        <p className="mt-2 px-1 text-[0.7rem] leading-relaxed text-muted-foreground">
          進捗はこのブラウザ内にのみ保存されます
        </p>
      </div>
    </nav>
  );
}

function Section({
  label,
  icon,
  open,
  onToggle,
  progress,
  topPath,
  active,
  onNavigate,
  children,
}: {
  label: string;
  icon: ReactNode;
  open: boolean;
  onToggle: () => void;
  progress: { done: number; total: number };
  topPath?: string;
  active?: boolean;
  onNavigate?: () => void;
  children: ReactNode;
}) {
  const badge =
    progress.total > 0 &&
    (progress.done === progress.total ? (
      <ClearedBadge />
    ) : (
      <span className="text-xs font-normal text-muted-foreground">
        {progress.done}/{progress.total}
      </span>
    ));

  return (
    <div className="mb-1">
      <div
        className={cn(
          "flex w-full items-center gap-1 rounded-sm border-b border-dashed border-gold/60 pr-2 font-serif text-xs font-bold tracking-widest transition",
          active && "bg-primary/10 text-primary"
        )}
      >
        {topPath ? (
          <a
            href={`#${topPath}`}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className="flex flex-1 items-center gap-2 rounded-sm px-3 py-2 hover:bg-secondary"
          >
            {icon}
            <span className="flex-1 text-left">{label}</span>
          </a>
        ) : (
          <span className="flex flex-1 items-center gap-2 px-3 py-2">
            {icon}
            <span className="flex-1 text-left">{label}</span>
          </span>
        )}
        {badge}
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={open}
          aria-label={open ? `${label}を閉じる` : `${label}を開く`}
          className="rounded-sm p-1 transition hover:bg-secondary"
        >
          <ChevronDown
            size={14}
            className={cn("transition-transform", !open && "-rotate-90")}
          />
        </button>
      </div>
      {open && <div className="ml-3 border-l-2 border-border pl-2">{children}</div>}
    </div>
  );
}

function NavItem({
  page,
  index,
  active,
  done,
  onNavigate,
}: {
  page: PageDef;
  index?: number;
  active: boolean;
  done: boolean;
  onNavigate?: () => void;
}) {
  return (
    <a
      href={`#${page.path}`}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      className={cn(
        "my-0.5 flex items-center gap-2 rounded-sm px-2 py-1.5 text-sm transition",
        active
          ? "bg-primary/10 font-bold text-primary"
          : "text-foreground hover:bg-secondary"
      )}
    >
      {done ? (
        <CheckCircle2 size={14} className="shrink-0 text-gold" />
      ) : (
        <span className="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border border-border text-[0.6rem] text-muted-foreground">
          {index ?? "・"}
        </span>
      )}
      <span className="flex-1 leading-snug">{page.title}</span>
      {active && (
        <span aria-hidden="true" className="shrink-0 text-xs text-primary">
          ▶
        </span>
      )}
    </a>
  );
}
