import { getTheme, setTheme, type Theme } from "./storage";

export function getEffectiveTheme(): Theme {
  const stored = getTheme();
  if (stored) return stored;
  if (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  ) {
    return "dark";
  }
  return "light";
}

export function applyTheme(t: Theme): void {
  if (typeof document === "undefined") return;
  document.documentElement.classList.toggle("dark", t === "dark");
}

// レンダリング前に呼び出してテーマのちらつきを防ぐ
export function initTheme(): void {
  applyTheme(getEffectiveTheme());
}

export function toggleTheme(): Theme {
  const next: Theme = getEffectiveTheme() === "dark" ? "light" : "dark";
  setTheme(next);
  applyTheme(next);
  return next;
}
