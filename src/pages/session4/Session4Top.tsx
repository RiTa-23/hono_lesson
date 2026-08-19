import { Rocket } from "lucide-react";
import { SessionTopContent } from "@/components/SessionTopContent";
import { SESSION4_PAGES } from "@/lib/routes";

export function Session4Top() {
  return (
    <SessionTopContent
      sessionNumber={4}
      icon={<Rocket size={28} className="text-primary" />}
      title="本番デプロイでよろず屋を開店"
      description="本番D1へのマイグレーションとCloudflare Workersへのデプロイで、世界中からアクセスできるお店に仕上げます。"
      pages={SESSION4_PAGES}
    />
  );
}
