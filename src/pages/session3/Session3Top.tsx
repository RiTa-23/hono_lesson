import { Database } from "lucide-react";
import { SessionTopContent } from "@/components/SessionTopContent";
import { SESSION3_PAGES } from "@/lib/routes";

export function Session3Top() {
  return (
    <SessionTopContent
      sessionNumber={3}
      icon={<Database size={28} className="text-primary" />}
      title="データベースを導入しよう"
      description="Cloudflare D1とDrizzle ORMでデータを永続化。再起動しても所持金・在庫が消えないAPIに育てます（ローカル環境まで）。"
      pages={SESSION3_PAGES}
    />
  );
}
