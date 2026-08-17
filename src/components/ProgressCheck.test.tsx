import { beforeEach, describe, expect, it } from "vitest";
import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ProgressCheck } from "./ProgressCheck";
import { clearAllProgress, getProgress } from "@/lib/storage";

describe("ProgressCheck（進捗チェックボックス）", () => {
  beforeEach(() => {
    clearAllProgress();
  });

  it("初期状態は未完了表示", () => {
    render(<ProgressCheck id="test-1" label="テストクエスト" />);
    expect(screen.getByRole("button", { name: /テストクエスト/ })).toHaveAttribute(
      "aria-pressed",
      "false"
    );
  });

  it("クリックで完了になり、storageに保存される", async () => {
    const user = userEvent.setup();
    render(<ProgressCheck id="test-2" label="テストクエスト" />);

    await user.click(screen.getByRole("button", { name: /テストクエスト/ }));

    expect(screen.getByRole("button")).toHaveAttribute("aria-pressed", "true");
    expect(getProgress("test-2")).toBe(true);
    expect(screen.getByText(/クエスト達成/)).toBeInTheDocument();
  });

  it("もう一度クリックで未完了に戻る", async () => {
    const user = userEvent.setup();
    render(<ProgressCheck id="test-3" label="テストクエスト" />);
    const button = screen.getByRole("button", { name: /テストクエスト/ });

    await user.click(button);
    await user.click(button);

    expect(button).toHaveAttribute("aria-pressed", "false");
    expect(getProgress("test-3")).toBe(false);
  });

  it("progress-clearedイベントで未完了に戻る", async () => {
    const user = userEvent.setup();
    render(<ProgressCheck id="test-4" label="テストクエスト" />);
    const button = screen.getByRole("button", { name: /テストクエスト/ });

    await user.click(button);
    expect(button).toHaveAttribute("aria-pressed", "true");

    // イベント経由のstate更新なのでactでラップする
    act(() => {
      clearAllProgress();
    });
    expect(button).toHaveAttribute("aria-pressed", "false");
  });
});
