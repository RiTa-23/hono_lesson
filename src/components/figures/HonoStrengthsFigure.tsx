import type { ReactNode } from "react";
import { Feather, Globe, Handshake, Zap } from "lucide-react";
import { Figure } from "./Figure";
import { anim } from "./anim";
import { useInView } from "./useInView";

type Strength = { icon: ReactNode; title: string; text: string };

// 1画面でぱっと伝わるよう、1つの強みにつき「アイコン・見出し・ひとこと」だけにする
const STRENGTHS: Strength[] = [
  { icon: <Zap size={28} />, title: "速い", text: "リクエストの行き先を、一瞬で見つける" },
  { icon: <Feather size={28} />, title: "軽い", text: "余計な部品を持たず、身軽に動く" },
  { icon: <Globe size={28} />, title: "どこでも動く", text: "同じコードが、BunでもCloudflare Workersでも動く" },
  { icon: <Handshake size={28} />, title: "型を共有できる", text: "フロントとバックで型がつながり、ミスにすぐ気づける" },
];

export function HonoStrengthsFigure() {
  const { ref, inView } = useInView<HTMLUListElement>();
  return (
    <Figure title="Honoの4つの強み">
      <ul ref={ref} className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {STRENGTHS.map((s, i) => (
          <li
            key={s.title}
            className="flex flex-col items-center rounded-sm border border-gold/60 bg-background px-2 py-4 text-center"
            style={inView ? anim("fig-pop", 0.35, i * 0.15) : { opacity: 0 }}
          >
            <span className="text-gold">{s.icon}</span>
            <p className="mt-2 font-serif text-base font-bold">{s.title}</p>
            <p className="mt-1 text-xs leading-snug text-muted-foreground">{s.text}</p>
          </li>
        ))}
      </ul>
    </Figure>
  );
}
