import { Ghost } from "lucide-react";
import { Button } from "@/components/ui/button";

export function NotFound() {
  return (
    <div className="flex flex-col items-center gap-4 py-16 text-center">
      <Ghost size={48} className="text-muted-foreground" />
      <h1 className="text-2xl font-bold">404 - ページが見つかりません</h1>
      <p className="text-sm text-muted-foreground">
        そのページは存在しないか、移動した可能性があります。
      </p>
      <Button asChild>
        <a href="#/">ホームへ戻る</a>
      </Button>
    </div>
  );
}
