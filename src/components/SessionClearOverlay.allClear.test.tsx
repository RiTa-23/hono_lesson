import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { AllClearOverlay } from "./AllClearOverlay";
import { SessionClearOverlay } from "./SessionClearOverlay";
import { MAIN_FLOW } from "@/lib/routes";
import { clearAllProgress, setProgress } from "@/lib/storage";

// 「全クリと重なる回クリアでは、回クリア演出 → 全クリ演出の順に出す」を検証するため、
// このファイルだけ全4回公開の状態にする
vi.mock("@/lib/routes", async () => {
  const actual =
    await vi.importActual<typeof import("@/lib/routes")>("@/lib/routes");
  return { ...actual, PUBLISHED_UP_TO: 4 };
});

// 最後の1クエストを残して達成済みにしてから、両方の演出をマウントする
function renderJustBeforeAllClear() {
  const last = MAIN_FLOW[MAIN_FLOW.length - 1];
  for (const p of MAIN_FLOW) {
    if (p.progressId && p !== last) setProgress(p.progressId, true);
  }
  render(
    <>
      <SessionClearOverlay />
      <AllClearOverlay />
    </>
  );
  return last;
}

describe("SessionClearOverlay（全クリとの連携）", () => {
  beforeEach(() => {
    clearAllProgress();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("全クリの瞬間は、まず回クリア演出だけを出す", () => {
    const last = renderJustBeforeAllClear();
    act(() => {
      setProgress(last.progressId!, true);
    });

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /知らせを受け取る/ })).toBeInTheDocument();
    expect(screen.queryByText("全クエスト達成")).not.toBeInTheDocument();
  });

  it("回クリア演出を閉じると全クリ演出が続く", () => {
    vi.useFakeTimers();
    const last = renderJustBeforeAllClear();
    act(() => {
      setProgress(last.progressId!, true);
    });

    act(() => {
      fireEvent.click(screen.getByRole("button", { name: /知らせを受け取る/ }));
      vi.advanceTimersByTime(300);
    });
    expect(screen.queryByText(/QUEST CLEAR/)).not.toBeInTheDocument();
    expect(screen.getByRole("dialog", { name: "講座修了証" })).toBeInTheDocument();
  });

  it("Escで閉じた場合も全クリ演出が続く", () => {
    vi.useFakeTimers();
    const last = renderJustBeforeAllClear();
    act(() => {
      setProgress(last.progressId!, true);
    });

    act(() => {
      fireEvent.keyDown(window, { key: "Escape" });
      vi.advanceTimersByTime(300);
    });
    expect(screen.getByText("全クエスト達成")).toBeInTheDocument();
  });

  it("全クリでない回クリアを閉じても全クリ演出は出ない", () => {
    vi.useFakeTimers();
    render(
      <>
        <SessionClearOverlay />
        <AllClearOverlay />
      </>
    );
    const session1 = MAIN_FLOW.filter((p) => p.section === "session1");
    act(() => {
      for (const p of session1) setProgress(p.progressId!, true);
    });

    act(() => {
      fireEvent.click(screen.getByRole("button", { name: "報告書をしまう" }));
      vi.advanceTimersByTime(300);
    });
    expect(screen.queryByText("全クエスト達成")).not.toBeInTheDocument();
  });
});
