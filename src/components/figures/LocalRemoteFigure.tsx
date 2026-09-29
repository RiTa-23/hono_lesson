import { useState } from "react";
import { Cloud, Laptop, Terminal } from "lucide-react";
import { cn } from "@/lib/utils";
import { Figure, FigureButton } from "./Figure";

type Target = "local" | "remote";

export function LocalRemoteFigure() {
  const [target, setTarget] = useState<Target>("remote");

  return (
    <Figure
      title="--local と --remote の行き先"
      caption="同じコマンドでも、フラグ1つで操作する相手がまったく変わる。--remote は世界中の冒険者が使う本番データ"
    >
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-serif text-xs text-muted-foreground">フラグ：</span>
        <FigureButton active={target === "local"} onClick={() => setTarget("local")}>
          --local（第3回）
        </FigureButton>
        <FigureButton active={target === "remote"} onClick={() => setTarget("remote")}>
          --remote（第4回）
        </FigureButton>
      </div>

      {/* 端末のコマンド */}
      <div className="mt-4 flex items-center gap-2 rounded-sm border border-gold/40 bg-[#2b2118] px-3 py-2 font-mono text-xs text-[#f0e6d2]">
        <Terminal size={14} className="shrink-0 text-gold" />
        <span className="min-w-0 break-all">
          bun wrangler d1 migrations apply yorozuya-db{" "}
          <span key={target} className="rounded-sm bg-[#c9a24a]/35 px-1 font-bold text-[#fff4d6]" style={{ animation: "fig-pop 0.3s ease-out both" }}>
            --{target}
          </span>
        </span>
      </div>

      <div className="mt-3 grid gap-3 grid-cols-1 sm:grid-cols-2">
        {(
          [
            {
              key: "local",
              icon: <Laptop size={20} />,
              title: "手元のPCのD1",
              body: "backend/.wrangler フォルダの中にあるお試し用のD1。壊しても作り直せる",
            },
            {
              key: "remote",
              icon: <Cloud size={20} />,
              title: "Cloudflare上の本番D1",
              body: "デプロイしたAPIが実際に読み書きするD1。操作はすぐ本番に反映される",
            },
          ] as const
        ).map((d) => {
          const active = d.key === target;
          return (
            <div
              key={d.key}
              className={cn(
                "rounded-sm border-2 px-3 py-2.5 transition-all duration-300",
                active
                  ? d.key === "remote"
                    ? "border-destructive bg-destructive/5"
                    : "border-gold bg-gold/10"
                  : "border-dashed border-border opacity-50"
              )}
            >
              <div className={cn("flex items-center gap-2 font-serif text-sm font-bold", active && d.key === "remote" && "text-destructive")}>
                {d.icon}
                {d.title}
                {active && (
                  <span className="ml-auto rounded-sm bg-foreground px-1.5 py-0.5 font-sans text-[10px] text-background" style={{ animation: "fig-pop 0.3s ease-out both" }}>
                    ここに反映
                  </span>
                )}
              </div>
              <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{d.body}</p>
            </div>
          );
        })}
      </div>
    </Figure>
  );
}
