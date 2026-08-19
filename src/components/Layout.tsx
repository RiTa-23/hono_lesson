import { useEffect, useState, type ReactNode } from "react";
import { Menu, Store, X } from "lucide-react";
import { AllClearOverlay } from "@/components/AllClearOverlay";
import { Sidebar } from "@/components/Sidebar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { findPage } from "@/lib/routes";

type Props = {
  currentPath: string;
  children: ReactNode;
};

export function Layout({ currentPath, children }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const page = findPage(currentPath);

  // ページ遷移したらモバイルメニューを閉じる
  useEffect(() => {
    setMenuOpen(false);
  }, [currentPath]);

  // メニュー表示中は背面をスクロールさせない
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b-[3px] border-double border-b-primary bg-background">
        <div className="flex h-14 items-center gap-2 px-4">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setMenuOpen(true)}
            aria-label="メニューを開く"
          >
            <Menu size={20} />
          </Button>
          <a href="#/" className="flex items-center gap-2 text-lg font-bold">
            <Store size={20} className="text-gold" />
            <span>よろず屋API講座</span>
          </a>
          {page && page.path !== "/" && (
            <span className="hidden truncate text-sm text-muted-foreground sm:inline">
              / {page.title}
            </span>
          )}
          <div className="ml-auto flex items-center gap-1">
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-7xl">
        {/* デスクトップ用サイドバー */}
        <aside className="sticky top-14 hidden h-[calc(100vh-3.5rem)] w-72 shrink-0 border-r-2 border-primary lg:block">
          <ScrollArea className="h-full">
            <Sidebar currentPath={currentPath} />
          </ScrollArea>
        </aside>

        {/* モバイル用ドロワー */}
        {menuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div
              className="absolute inset-0 bg-black/50"
              onClick={() => setMenuOpen(false)}
              aria-hidden="true"
            />
            <div className="absolute inset-y-0 left-0 w-72 max-w-[85vw] border-r-2 border-primary bg-background shadow-xl">
              <div className="flex h-14 items-center justify-between border-b-2 border-primary px-4">
                <span className="flex items-center gap-2 font-bold">
                  <Store size={18} className="text-gold" />
                  メニュー
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setMenuOpen(false)}
                  aria-label="メニューを閉じる"
                >
                  <X size={20} />
                </Button>
              </div>
              <ScrollArea className="h-[calc(100%-3.5rem)]">
                <Sidebar currentPath={currentPath} onNavigate={() => setMenuOpen(false)} />
              </ScrollArea>
            </div>
          </div>
        )}

        <main className="min-w-0 flex-1 px-4 py-8 sm:px-8">
          <div className="mx-auto max-w-3xl">{children}</div>
        </main>
      </div>

      {/* 全クエスト達成時の演出（最後のクエスト完了瞬間に表示） */}
      <AllClearOverlay />
    </div>
  );
}
