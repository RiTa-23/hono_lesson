import { describe, expect, it, vi } from "vitest";
import { act, render, screen } from "@testing-library/react";
import { SessionClearOverlay } from "./SessionClearOverlay";
import { MAIN_FLOW } from "@/lib/routes";
import { clearAllProgress, setProgress } from "@/lib/storage";

// 「全クリと重なる回クリアでは、回クリア演出を出さずAllClearOverlayに任せる」を検証するため、
// このファイルだけ全4回公開の状態にする
vi.mock("@/lib/routes", async () => {
  const actual =
    await vi.importActual<typeof import("@/lib/routes")>("@/lib/routes");
  return { ...actual, PUBLISHED_UP_TO: 4 };
});

describe("SessionClearOverlay（全クリとの重複抑制）", () => {
  it("最後のクエストで全クリになったときは回クリア演出を出さない", () => {
    clearAllProgress();
    const last = MAIN_FLOW[MAIN_FLOW.length - 1];
    for (const p of MAIN_FLOW) {
      if (p.progressId && p !== last) setProgress(p.progressId, true);
    }
    render(<SessionClearOverlay />);

    act(() => {
      setProgress(last.progressId!, true);
    });

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
