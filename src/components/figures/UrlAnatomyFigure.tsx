import { cn } from "@/lib/utils";
import { Figure } from "./Figure";

type Piece = { text: string; label?: string; code?: string; tone?: "muted" | "path" | "param" | "query" };

const toneClass = {
  muted: "border-border text-muted-foreground",
  path: "border-foreground/50",
  param: "border-gold bg-gold/15 font-bold",
  query: "border-destructive/70 bg-destructive/10 font-bold",
};

const URLS: { title: string; pieces: Piece[] }[] = [
  {
    title: "パスパラメータ（この章で使う）",
    pieces: [
      { text: "http://localhost:3000", label: "オリジン", tone: "muted" },
      { text: "/api/items/", label: "パス", tone: "path" },
      { text: "3", label: "パスパラメータ", code: "c.req.param('id')", tone: "param" },
    ],
  },
  {
    title: "クエリパラメータ（発展で使う）",
    pieces: [
      { text: "http://localhost:3000", label: "オリジン", tone: "muted" },
      { text: "/api/items", label: "パス", tone: "path" },
      { text: "?maxPrice=100", label: "クエリパラメータ", code: "c.req.query('maxPrice')", tone: "query" },
    ],
  },
];

export function UrlAnatomyFigure() {
  return (
    <Figure
      title="URLのどこを受け取る？"
      caption="パスパラメータは「どれを」（1件を指定）、クエリパラメータは「どんな条件で」（絞り込み・並べ替え）に使うことが多い"
    >
      <div className="space-y-5">
        {URLS.map((u) => (
          <div key={u.title}>
            <p className="mb-1.5 font-serif text-xs font-bold">{u.title}</p>
            <div className="flex flex-wrap items-start">
              {u.pieces.map((p) => (
                <div key={p.text} className="-ml-px flex flex-col items-stretch first:ml-0">
                  <span className={cn("border px-1.5 py-1 font-mono text-xs sm:text-sm", toneClass[p.tone ?? "path"])}>
                    {p.text}
                  </span>
                  <span className="mt-1 border-t border-gold/60 px-1 pt-0.5 text-center text-[11px] leading-tight">
                    {p.label}
                    {p.code && (
                      <code className="mt-0.5 block whitespace-nowrap font-mono text-[10px] text-gold">{p.code}</code>
                    )}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
        ルート定義の <code className="rounded bg-muted px-1 py-0.5 text-foreground">'/api/items/:id'</code> の
        <code className="mx-0.5 rounded bg-gold/20 px-1 py-0.5 font-bold text-foreground">:id</code>
        が「3」の部分に当てはまり、<code className="rounded bg-muted px-1 py-0.5 text-foreground">c.req.param('id')</code>
        で文字列の <code className="rounded bg-muted px-1 py-0.5 text-foreground">"3"</code> として取り出せます。
      </p>
    </Figure>
  );
}
