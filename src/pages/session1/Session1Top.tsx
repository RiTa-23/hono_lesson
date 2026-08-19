import { Store } from "lucide-react";
import { SessionTopContent } from "@/components/SessionTopContent";
import { SESSION1_PAGES } from "@/lib/routes";

export function Session1Top() {
  return (
    <SessionTopContent
      sessionNumber={1}
      icon={<Store size={28} className="text-primary" />}
      title="よろず屋APIを作ろう"
      description="APIとは？Honoとは？から始めて、商品一覧・購入・売却のAPIを実装。最後はReactのフロントとつないで、画面からアイテムを売り買いします。"
      pages={SESSION1_PAGES}
    />
  );
}
