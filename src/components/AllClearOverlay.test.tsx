import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, render, screen } from "@testing-library/react";
import { AllClearOverlay, OVERLAY_MS } from "./AllClearOverlay";
import { MAIN_FLOW } from "@/lib/routes";
import { clearAllProgress, setProgress } from "@/lib/storage";

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
});