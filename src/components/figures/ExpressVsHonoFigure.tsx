import { Check, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Figure } from "./Figure";
import { Adventurer, Chest, Floor, Item, Potion, Signpost } from "./Characters";
import { useInView } from "./useInView";

// Express：何もない草原に「建設予定地」の立て札だけ
function PlainScene() {
  return (
    <svg viewBox="0 0 240 130" className="block w-full" role="img" aria-label="何もない草原に立て札と、困っている冒険者">
      <Floor x={0} y={112} width={240} px={3} variant="grass" />
      <Signpost x={170} y={112} label="建設予定地" />
      <Adventurer x={70} y={112} px={3} />
      {/* 困った「？」 */}
      <text
        x={104}
        y={52}
        fontSize={22}
        fontWeight="bold"
        className="fill-destructive font-serif"
        style={{ transformBox: "fill-box", transformOrigin: "center", animation: "fig-wiggle 1.6s ease-in-out infinite" }}
      >
        ？
      </text>
    </svg>
  );
}

// Hono：開いた宝箱（道具箱）から道具が飛び出す
function ToolboxScene() {
  const bob = (delay: number) => ({ animation: `fig-bob 1.8s ease-in-out ${delay}s infinite` });
  return (
    <svg viewBox="0 0 240 130" className="block w-full" role="img" aria-label="開いた宝箱から道具が出てきて、喜ぶ冒険者">
      <Floor x={0} y={112} width={240} px={3} variant="grass" />
      <Chest x={138} y={112} />
      {/* 飛び出す道具 */}
      <g style={bob(0)}>
        <Potion x={148} y={40} tone="red" />
      </g>
      <g style={bob(0.3)}>
        <Item x={170} y={30} kind="hammer" />
      </g>
      <g style={bob(0.6)}>
        <Item x={192} y={40} kind="bag" />
      </g>
      <Adventurer x={70} y={112} px={3} />
      {/* うれしい「！」 */}
      <text x={104} y={52} fontSize={22} fontWeight="bold" className="fill-gold font-serif">
        ！
      </text>
    </svg>
  );
}

type Tool = { name: string; builtIn: boolean; note?: string };

const EXPRESS_TOOLS: Tool[] = [
  { name: "ルーティング", builtIn: true },
  { name: "CORS", builtIn: false, note: "cors を追加" },
  { name: "ログ", builtIn: false, note: "morgan を追加" },
  { name: "TypeScriptの型", builtIn: false, note: "@types/express を追加" },
];

const HONO_TOOLS: Tool[] = [
  { name: "ルーティング", builtIn: true },
  { name: "CORS", builtIn: true, note: "hono/cors" },
  { name: "ログ", builtIn: true, note: "hono/logger" },
  { name: "TypeScriptの型", builtIn: true, note: "最初から" },
];

function ToolList({ tools, play }: { tools: Tool[]; play: boolean }) {
  return (
    <ul className="mt-3 space-y-1.5 text-xs">
      {tools.map((t, i) => (
        <li
          key={t.name}
          className={cn(
            "flex items-center gap-1.5 rounded-sm border px-2 py-1",
            t.builtIn ? "border-gold/60 bg-gold/10" : "border-dashed border-border text-muted-foreground"
          )}
          style={play ? { animation: `fig-pop 0.3s ease-out ${0.2 + i * 0.15}s both` } : { opacity: 0 }}
        >
          {t.builtIn ? <Check size={13} className="shrink-0 text-gold" /> : <Plus size={13} className="shrink-0" />}
          <span className="font-medium">{t.name}</span>
          {t.note && <span className="ml-auto text-[11px] text-muted-foreground">{t.note}</span>}
        </li>
      ))}
    </ul>
  );
}

export function ExpressVsHonoFigure() {
  const { ref, inView } = useInView<HTMLDivElement>();
  return (
    <Figure
      title="ExpressとHonoのスタート地点"
      caption="Expressは必要な道具を自分で探して足していく。Honoは道具箱を持った状態から始められる"
    >
      <div ref={ref} className="grid gap-4 grid-cols-1 sm:grid-cols-2">
        <div className="rounded-sm border border-border bg-background p-3">
          <p className="text-center font-serif text-sm font-bold">Express：広い平原からスタート</p>
          <div className="mt-2">
            <PlainScene />
          </div>
          <ToolList tools={EXPRESS_TOOLS} play={inView} />
        </div>
        <div className="rounded-sm border border-gold/60 bg-background p-3">
          <p className="text-center font-serif text-sm font-bold">Hono：道具箱つきでスタート</p>
          <div className="mt-2">
            <ToolboxScene />
          </div>
          <ToolList tools={HONO_TOOLS} play={inView} />
        </div>
      </div>
    </Figure>
  );
}
