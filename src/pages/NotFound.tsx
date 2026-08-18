import { Ghost } from "lucide-react";
import { Button } from "@/components/ui/button";

export function NotFound() {
  return (
    <div className="flex justify-center py-16">
      <div className="border border-primary bg-card p-8 text-center">
        <Ghost size={48} className="mx-auto text-gold" />
        <h1 className="mt-4 text-2xl font-bold">404 - ページが見つかりません</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          そのページは存在しないか、移動した可能性があります。
        </p>
        <Button asChild className="mt-4">
          <a href="#/">ホームへ戻る</a>
        </Button>
      </div>
    </div>
  );
}
