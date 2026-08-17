import { useEffect, useState, type ReactNode } from "react";
import {
  ChevronDown,
  CheckCircle2,
  Sparkles,
  Store,
  Home,
  Hammer,
} from "lucide-react";
import {
  SESSION1_PAGES,
  SESSION2_PAGES,
  SESSION3_PAGES,
  EXTRA_PAGES,
  HOME,
} from "@/lib/routes";
import type { PageDef } from "@/lib/routes";
import { getAllProgress } from "@/lib/storage";
import { cn } from "@/lib/utils";
import { ProgressReset } from "@/components/ProgressReset";

type Props = {
  currentPath: string;
  onNavigate?: () => void;
};

export function Sidebar({ currentPath, onNavigate }: Props) {
  const [progress, setProgress] = useState<Record<string, boolean>>({});
  const [openS1, setOpenS1] = useState(true);
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
          "group mb-3 flex items-center gap-2 rounded-md px-3 py-2 text-sm transition",
          currentPath === "/"
            ? "bg-primary/10 font-medium text-primary"
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

      {/* 第2回・第3回は開催前に追記 */}
      {SESSION2_PAGES.length === 0 && SESSION3_PAGES.length === 0 && (
        <div className="mt-4 rounded-md border border-dashed px-3 py-2 text-xs text-muted-foreground">
          <p className="flex items-center gap-1.5">
            <Hammer size={12} />
            第2回・第3回のページは準備中です
          </p>
        </div>
      )}

      <div className="mt-6">
        <Section
          label="おまけ"
          icon={<Sparkles size={14} />}
          open={openExtra}
          onToggle={() => setOpenExtra((v) => !v)}
          progress={{ done: 0, total: 0 }}
        >
          {EXTRA_PAGES.map((p) => (
            <NavItem
              key={p.path}
              page={p}
              active={currentPath === p.path}
              done={false}
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
  children,
}: {
  label: string;
  icon: ReactNode;
  open: boolean;
  onToggle: () => void;
  progress: { done: number; total: number };
  children: ReactNode;
}) {
  return (
    <div className="mb-1">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition hover:bg-secondary"
      >
        {icon}
        <span className="flex-1 text-left">{label}</span>
        {progress.total > 0 && (
          <span className="text-xs text-muted-foreground">
            {progress.done}/{progress.total}
          </span>
        )}
        <ChevronDown
          size={14}
          className={cn("transition-transform", !open && "-rotate-90")}
        />
      </button>
      {open && <div className="ml-3 border-l pl-2">{children}</div>}
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
        "my-0.5 flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition",
        active
          ? "bg-primary/10 font-medium text-primary"
          : "text-foreground hover:bg-secondary"
      )}
    >
      {done ? (
        <CheckCircle2 size={14} className="shrink-0 text-emerald-600" />
      ) : (
        <span className="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full border text-[0.6rem] text-muted-foreground">
          {index ?? "・"}
        </span>
      )}
      <span className="flex-1 leading-snug">{page.title}</span>
    </a>
  );
}
