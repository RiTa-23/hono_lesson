import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { SessionClearOverlay } from "./SessionClearOverlay";
import { SESSION1_PAGES, SESSION2_PAGES } from "@/lib/routes";
import type { PageDef } from "@/lib/routes";
import { clearAllProgress, setProgress } from "@/lib/storage";

// 実際の公開範囲に関わらず「第2回まで公開」の状態で検証する
// （全クリと重なるときの抑制はSessionClearOverlay.allClear.test.tsxで検証する）
vi.mock("@/lib/routes", async () => {
  const actual =
    await vi.importActual<typeof import("@/lib/routes")>("@/lib/routes");
  return { ...actual, PUBLISHED_UP_TO: 2 };
});

function clearQuests(pages: PageDef[]) {
  act(() => {
    for (const p of pages) {
      if (p.progressId) setProgress(p.progressId, true);
    }
  });
}

describe("SessionClearOverlay（回ごとのクリア演出）", () => {
  beforeEach(() => {
    clearAllProgress();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("未達成のときは何も表示しない", () => {
    render(<SessionClearOverlay />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("回の途中までの達成では表示しない", () => {
    render(<SessionClearOverlay />);
    clearQuests(SESSION1_PAGES.slice(0, -1));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("回の最後のクエストを達成した瞬間に達成報告書が表示される", () => {
    render(<SessionClearOverlay />);
    clearQuests(SESSION1_PAGES);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("第壱回 踏破")).toBeInTheDocument();
    expect(screen.getByText("「駆け出しAPI職人」")).toBeInTheDocument();
    const exp = SESSION1_PAGES.reduce((sum, p) => sum + (p.minutes ?? 0), 0);
    expect(screen.getByText(`+${exp} EXP`)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /第2回へ進む/ })).toHaveAttribute(
      "href",
      "#/session2"
    );
  });

  it("経験値が0から獲得値までカウントアップする", () => {
    vi.useFakeTimers();
    render(<SessionClearOverlay />);
    clearQuests(SESSION1_PAGES);
    const exp = SESSION1_PAGES.reduce((sum, p) => sum + (p.minutes ?? 0), 0);
    const counter = () =>
      screen.getAllByText(/EXP$/).find((el) => el.getAttribute("aria-hidden"));
    expect(counter()).toHaveTextContent("+0 EXP");

    act(() => {
      vi.advanceTimersByTime(3000);
    });
    expect(counter()).toHaveTextContent(`+${exp} EXP`);
  });

  it("クリアした回の数だけギルドランクの星が灯る", () => {
    render(<SessionClearOverlay />);
    clearQuests(SESSION2_PAGES);
    expect(screen.getByRole("img", { name: "星1つ（全4つ）" })).toBeInTheDocument();

    act(() => {
      fireEvent.keyDown(window, { key: "Escape" });
    });
    clearQuests(SESSION1_PAGES);
    expect(screen.getByRole("img", { name: "星2つ（全4つ）" })).toBeInTheDocument();
  });

  it("公開中の最後の回をクリアすると、次回準備中のメッセージを出す", () => {
    render(<SessionClearOverlay />);
    clearQuests(SESSION2_PAGES);
    expect(screen.getByText("「堅牢なる検証士」")).toBeInTheDocument();
    expect(screen.getByText(/次の依頼書はただいま準備中/)).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /第3回へ進む/ })).not.toBeInTheDocument();
  });

  it("達成内容を載せたXの投稿画面を新しいタブで開くボタンがある", () => {
    render(<SessionClearOverlay />);
    clearQuests(SESSION1_PAGES);
    const link = screen.getByRole("link", { name: /でポストする/ });
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");

    const url = new URL(link.getAttribute("href")!);
    expect(url.origin + url.pathname).toBe("https://twitter.com/intent/tweet");
    const exp = SESSION1_PAGES.reduce((sum, p) => sum + (p.minutes ?? 0), 0);
    const text = url.searchParams.get("text")!;
    expect(text).toContain("第1回「Honoでよろず屋APIを作ろう」を踏破した！");
    expect(text).toContain(`+${exp} EXP`);
    expect(text).toContain("称号「駆け出しAPI職人」");
    expect(text).toContain("ギルドランク ★☆☆☆");
    expect(url.searchParams.get("hashtags")).toBe("よろず屋API講座,Hono");
    expect(url.searchParams.get("url")).toBe(
      `${window.location.origin}${window.location.pathname}`
    );
  });

  it("初回マウント時点で達成済みの回では表示しない", () => {
    clearQuests(SESSION1_PAGES);
    render(<SessionClearOverlay />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("達成済みの回のクエストを再度達成扱いにしても再表示しない", () => {
    clearQuests(SESSION1_PAGES);
    render(<SessionClearOverlay />);
    act(() => {
      setProgress(SESSION1_PAGES[0].progressId!, true);
    });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("表示中に未達成へ戻すと消える", () => {
    render(<SessionClearOverlay />);
    clearQuests(SESSION1_PAGES);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    act(() => {
      setProgress(SESSION1_PAGES[0].progressId!, false);
    });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("閉じるボタンで消せる", () => {
    vi.useFakeTimers();
    render(<SessionClearOverlay />);
    clearQuests(SESSION1_PAGES);
    act(() => {
      fireEvent.click(screen.getByRole("button", { name: "閉じる" }));
      vi.advanceTimersByTime(300);
    });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("Escキーで消せる", () => {
    vi.useFakeTimers();
    render(<SessionClearOverlay />);
    clearQuests(SESSION1_PAGES);
    act(() => {
      fireEvent.keyDown(window, { key: "Escape" });
      vi.advanceTimersByTime(300);
    });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
