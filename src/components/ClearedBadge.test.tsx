import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { ClearedBadge } from "./ClearedBadge";

describe("ClearedBadge（回のクリア表示）", () => {
  it("「クリア！」と表示される", () => {
    render(<ClearedBadge />);
    expect(screen.getByText("クリア！")).toBeInTheDocument();
  });
});