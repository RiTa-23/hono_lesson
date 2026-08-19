import { describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import App from "@/App";

describe("App（ルーティング・遅延ロード）", () => {
  it("ホームが表示される", async () => {
    window.location.hash = "#/";
    render(<App />);
    expect(
      await screen.findByRole("heading", { level: 1, name: "よろず屋API講座" })
    ).toBeInTheDocument();
  });

  it("第1回のページが遅延ロードで表示される", async () => {
    window.location.hash = "#/session1/04-first-api";
    render(<App />);
    expect(
      await screen.findByRole("heading", { level: 1, name: /依頼 No.04/ })
    ).toBeInTheDocument();
  });

  it("存在しないパスは404になる", async () => {
    window.location.hash = "#/no-such-page";
    render(<App />);
    expect(
      await screen.findByText("404 - ページが見つかりません")
    ).toBeInTheDocument();
  });

  it("同一セッション内の移動ではローディング表示が出ない", async () => {
    window.location.hash = "#/session1/01-about-api";
    render(<App />);
    await screen.findByRole("heading", { level: 1, name: /依頼 No.01/ });

    // 同じセッション内の別ページへ移動（先読み済みなのでフォールバックが出ない）
    window.location.hash = "#/session1/04-first-api";
    await screen.findByRole("heading", { level: 1, name: /依頼 No.04/ });
    expect(
      screen.queryByText("依頼書を開いています…")
    ).not.toBeInTheDocument();
  });

  it("別セッションへの移動ではローディング表示を経由してページが表示される", async () => {
    window.location.hash = "#/session1/01-about-api";
    render(<App />);
    await screen.findByRole("heading", { level: 1, name: /依頼 No.01/ });

    window.location.hash = "#/session2/01-intro";
    // 次ページは未先読みのため、フォールバックが一度表示される
    await screen.findByText("依頼書を開いています…");
    await screen.findByRole("heading", { level: 1, name: /今のAPIの穴/ });
    expect(
      screen.queryByText("依頼書を開いています…")
    ).not.toBeInTheDocument();
  });

  it("NextLink経由の別セッション移動でもローディング表示が出ない", async () => {
    window.location.hash = "#/session1/08-summary";
    render(<App />);
    await screen.findByRole("heading", { level: 1, name: /依頼 No.08/ });

    // NextLink が次ページ（第2回）を先読み済みのため、フォールバックが出ない
    fireEvent.click(screen.getByRole("link", { name: /次の依頼/ }));
    await screen.findByRole("heading", { level: 1, name: /依頼 No.01/ });
    expect(
      screen.queryByText("依頼書を開いています…")
    ).not.toBeInTheDocument();
  });
});