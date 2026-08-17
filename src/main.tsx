import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "@/App";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { initTheme } from "@/lib/theme";
import "@/index.css";

// レンダリング前にテーマを適用してちらつきを防ぐ
initTheme();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>
);
