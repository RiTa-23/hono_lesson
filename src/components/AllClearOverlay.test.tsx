import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { AllClearOverlay } from "./AllClearOverlay";
import { MAIN_FLOW } from "@/lib/routes";
import { SESSION_CLEAR_CLOSED_EVENT } from "@/lib/clear";
import { clearAllProgress, setProgress } from "@/lib/storage";

// 演出の表示・自動消滅・手動クローズを検証するテストなので、
// 実際の公開範囲（PUBLISHED_UP_TO）に関わらず全回公開済みの状態で検証する
// （PUBLISHED_UP_TO<4のときの抑制behaviorはAllClearOverlay.publishGate.test.tsxで検証する）
vi.mock("@/lib/routes", async () => {
  const actual =
    await vi.importActual<typeof import("@/lib/routes")>("@/lib/routes");
  return { ...actual, PUBLISHED_UP_TO: 4 };
});

function clearAllQuests() {
  act(() => {
    for (const p of MAIN_FLOW) {
      if (p.progressId) setProgress(p.progressId, true);
    }
  });
}

// 全クリと同時に出る回クリア演出が閉じられたことを再現する
function closeSessionClear() {
  act(() => {
    window.dispatchEvent(new CustomEvent(SESSION_CLEAR_CLOSED_EVENT));
  });
}

describe("AllClearOverlay（全クエスト達成演出）", () => {
  beforeEach(() => {
    clearAllProgress();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("未達成のときは何も表示しない", () => {
    render(<AllClearOverlay />);
    expect(screen.queryByText("全クエスト達成")).not.toBeInTheDocument();
  });

  it("最後のクエストを達成しても、回クリア演出が閉じられるまでは表示しない", () => {
    render(<AllClearOverlay />);
    clearAllQuests();
    expect(screen.queryByText("全クエスト達成")).not.toBeInTheDocument();
  });

  it("全達成後、回クリア演出が閉じられたら表示される", () => {
    render(<AllClearOverlay />);
    clearAllQuests();
    closeSessionClear();
    expect(screen.getByText("全クエスト達成")).toBeInTheDocument();
    expect(screen.getByText("すべてのクエストを達成した！")).toBeInTheDocument();
  });

  it("講座修了証として、戦績と最終称号を表示する", () => {
    render(<AllClearOverlay />);
    clearAllQuests();
    closeSessionClear();
    expect(screen.getByRole("dialog", { name: "講座修了証" })).toBeInTheDocument();
    expect(screen.getByText("「伝説のよろず屋」")).toBeInTheDocument();
    expect(screen.getByText(`${MAIN_FLOW.length} / ${MAIN_FLOW.length}`)).toBeInTheDocument();
    const exp = MAIN_FLOW.reduce((sum, p) => sum + (p.minutes ?? 0), 0);
    expect(screen.getByText(`+${exp} EXP`)).toBeInTheDocument();
  });

  it("時間が経っても自動では消えない（閉じるまで残る）", () => {
    vi.useFakeTimers();
    render(<AllClearOverlay />);
    clearAllQuests();
    closeSessionClear();
    act(() => {
      vi.advanceTimersByTime(30000);
    });
    expect(screen.getByText("全クエスト達成")).toBeInTheDocument();
  });

  it("講座修了をXにポストするボタンがある", () => {
    render(<AllClearOverlay />);
    clearAllQuests();
    closeSessionClear();
    const link = screen.getByRole("link", { name: /でポストする/ });
    const text = new URL(link.getAttribute("href")!).searchParams.get("text")!;
    expect(text).toContain("全4回を完走した！");
    expect(text).toContain("最終称号「伝説のよろず屋」");
  });

  it("Escキーで消せる", () => {
    vi.useFakeTimers();
    render(<AllClearOverlay />);
    clearAllQuests();
    closeSessionClear();
    act(() => {
      fireEvent.keyDown(window, { key: "Escape" });
      vi.advanceTimersByTime(300);
    });
    expect(screen.queryByText("全クエスト達成")).not.toBeInTheDocument();
  });

  it("初回マウント時点で全達成済みでも表示しない", () => {
    clearAllQuests();
    render(<AllClearOverlay />);
    closeSessionClear();
    expect(screen.queryByText("全クエスト達成")).not.toBeInTheDocument();
  });

  it("全達成していないときに回クリア演出が閉じられても表示しない", () => {
    render(<AllClearOverlay />);
    act(() => {
      setProgress(MAIN_FLOW[0].progressId!, true);
    });
    closeSessionClear();
    expect(screen.queryByText("全クエスト達成")).not.toBeInTheDocument();
  });

  it("回クリア演出が閉じられる前に未達成へ戻したら表示しない", () => {
    render(<AllClearOverlay />);
    clearAllQuests();
    act(() => {
      setProgress(MAIN_FLOW[0].progressId!, false);
    });
    closeSessionClear();
    expect(screen.queryByText("全クエスト達成")).not.toBeInTheDocument();
  });

  it("全達成後に1つ未達成に戻しても再表示されない", () => {
    render(<AllClearOverlay />);
    clearAllQuests();
    closeSessionClear();
    expect(screen.getByText("全クエスト達成")).toBeInTheDocument();

    act(() => {
      setProgress(MAIN_FLOW[0].progressId!, false);
    });
    expect(screen.queryByText("全クエスト達成")).not.toBeInTheDocument();
  });

  it("閉じるボタンで手動で消せる", () => {
    vi.useFakeTimers();
    render(<AllClearOverlay />);
    clearAllQuests();
    closeSessionClear();
    expect(screen.getByText("全クエスト達成")).toBeInTheDocument();

    act(() => {
      fireEvent.click(screen.getByRole("button", { name: "閉じる" }));
      vi.advanceTimersByTime(300);
    });
    expect(screen.queryByText("全クエスト達成")).not.toBeInTheDocument();
  });
});