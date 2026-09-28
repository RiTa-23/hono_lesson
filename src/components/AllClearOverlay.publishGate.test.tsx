import { describe, expect, it, vi } from "vitest";
import { act, render, screen } from "@testing-library/react";
import { AllClearOverlay } from "./AllClearOverlay";
import { MAIN_FLOW } from "@/lib/routes";
import { SESSION_CLEAR_CLOSED_EVENT } from "@/lib/clear";
import { clearAllProgress, setProgress } from "@/lib/storage";

// 「全4回が公開されていない間は全クリ演出を出さない」を検証するため、
// このファイルだけ PUBLISHED_UP_TO を差し替える
vi.mock("@/lib/routes", async () => {
  const actual =
    await vi.importActual<typeof import("@/lib/routes")>("@/lib/routes");
  return { ...actual, PUBLISHED_UP_TO: 3 };
});

describe("AllClearOverlay（公開範囲による抑制）", () => {
  it("PUBLISHED_UP_TOが4未満のときはメインフローを全達成しても演出が出ない", () => {
    clearAllProgress();
    render(<AllClearOverlay />);

    act(() => {
      for (const p of MAIN_FLOW) {
        if (p.progressId) setProgress(p.progressId, true);
      }
      window.dispatchEvent(new CustomEvent(SESSION_CLEAR_CLOSED_EVENT));
    });

    expect(screen.queryByText("全クエスト達成")).not.toBeInTheDocument();
  });
});
