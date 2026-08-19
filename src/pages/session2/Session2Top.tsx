import { ShieldCheck } from "lucide-react";
import { SessionTopContent } from "@/components/SessionTopContent";
import { SESSION2_PAGES } from "@/lib/routes";

export function Session2Top() {
  return (
    <SessionTopContent
      sessionNumber={2}
      icon={<ShieldCheck size={28} className="text-primary" />}
      title="堅牢なAPIにしよう"
      description="zodでバリデーション、OpenAPIでドキュメント自動生成、そしてテストコードを書いて、安心して直せるAPIに育てます。"
      pages={SESSION2_PAGES}
    />
  );
}
