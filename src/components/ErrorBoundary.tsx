import { Component, type ErrorInfo, type ReactNode } from "react";
import { Button } from "@/components/ui/button";

type Props = {
  children: ReactNode;
};

type State = {
  hasError: boolean;
};

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: unknown, info: ErrorInfo) {
    // eslint-disable-next-line no-console
    console.error("[yorozuya] 画面の描画に失敗しました", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-8 text-center">
          <h1 className="text-xl font-bold">ページの表示中にエラーが発生しました</h1>
          <p className="text-sm text-muted-foreground">
            再読み込みしても直らない場合は、進捗のリセットをお試しください。
          </p>
          <Button type="button" onClick={() => window.location.reload()}>
            再読み込み
          </Button>
        </div>
      );
    }
    return this.props.children;
  }
}
