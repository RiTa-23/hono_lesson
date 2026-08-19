import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { AllClearOverlay, OVERLAY_MS } from "./AllClearOverlay";
import { MAIN_FLOW } from "@/lib/routes";
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

  it("最後のクエストを達成した瞬間に表示される", () => {
    render(<AllClearOverlay />);
    clearAllQuests();
    expect(screen.getByText("全クエスト達成")).toBeInTheDocument();
    expect(screen.getByText("すべてのクエストを達成した！")).toBeInTheDocument();
  });

  it("表示時間が経つと自動で消える", () => {
    vi.useFakeTimers();
    render(<AllClearOverlay />);
    clearAllQuests();
    expect(screen.getByText("全クエスト達成")).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(OVERLAY_MS);
    });
    expect(screen.queryByText("全クエスト達成")).not.toBeInTheDocument();
  });

  it("初回マウント時点で全達成済みでも表示しない", () => {
    clearAllQuests();
    render(<AllClearOverlay />);
    expect(screen.queryByText("全クエスト達成")).not.toBeInTheDocument();
  });

  it("全達成後に1つ未達成に戻しても再表示されない", () => {
    render(<AllClearOverlay />);
    clearAllQuests();
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
    expect(screen.getByText("全クエスト達成")).toBeInTheDocument();

    act(() => {
      fireEvent.click(screen.getByRole("button", { name: "閉じる" }));
      vi.advanceTimersByTime(300);
    });
    expect(screen.queryByText("全クエスト達成")).not.toBeInTheDocument();
  });
});