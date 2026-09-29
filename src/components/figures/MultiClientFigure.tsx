import { Figure } from "./Figure";
import { Counter, Shopkeeper } from "./Characters";

// 「画面とデータを分ける」うれしさ：いくつ窓口（画面）を出店しても、APIは1つで済む
const CLIENTS = [
  { y: 45, labelY: 82, label: "Web画面（今回）" },
  { y: 125, labelY: 165, label: "スマホアプリ（将来）" },
  { y: 205, labelY: 244, label: "魔王城窓口（将来）" },
];

const API_X = 280;
const API_Y = 125;

export function MultiClientFigure() {
  return (
    <Figure
      title="画面がいくつ増えても、APIは1つ"
      caption="画面（フロントエンド）を作り替えたり増やしたりしても、同じAPIを呼ぶだけで済む"
    >
      <svg viewBox="0 0 400 250" className="mx-auto block w-full max-w-md" role="img" aria-label="3種類の画面が1つのAPIにつながっている図">
        {/* 各画面 → API の線（点が流れる） */}
        {CLIENTS.map((c) => (
          <path
            key={c.label}
            d={`M 112 ${c.y} C 190 ${c.y}, 200 ${API_Y}, ${API_X - 50} ${API_Y}`}
            fill="none"
            className="stroke-gold"
            strokeWidth={2.5}
            strokeDasharray="6 6"
            style={{ animation: "fig-flow 0.8s linear infinite" }}
          />
        ))}

        <g className="stroke-foreground" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round">
          {/* Web画面（ブラウザ） */}
          <rect x={30} y={22} width={78} height={46} className="fill-card" />
          <path d="M 30 32 H 108" fill="none" />
          <circle cx={36} cy={27} r={1.5} className="fill-foreground" stroke="none" />
          <circle cx={41} cy={27} r={1.5} className="fill-foreground" stroke="none" />
          <path d="M 38 42 H 70 M 38 50 H 96 M 38 58 H 84" className="stroke-gold" fill="none" />

          {/* スマホ */}
          <rect x={55} y={100} width={30} height={50} rx={5} className="fill-card" strokeDasharray="4 3" />
          <path d="M 64 143 H 76" fill="none" />
          <path d="M 61 110 H 79 M 61 117 H 75 M 61 124 H 79" className="stroke-gold" fill="none" />

          {/* 魔王城 */}
          <path
            d="M 36 228 V 196 H 42 V 190 H 48 V 196 H 54 V 202 H 88 V 196 H 94 V 190 H 100 V 196 H 106 V 228 Z"
            className="fill-secondary"
            strokeDasharray="4 3"
          />
          <path d="M 63 228 V 216 Q 71 206 79 216 V 228" className="fill-primary" />
          <path d="M 71 202 V 186 L 82 190 L 71 194" className="fill-destructive" />
        </g>

        {CLIENTS.map((c) => (
          <text
            key={c.label}
            x={70}
            y={c.labelY}
            textAnchor="middle"
            className="fill-foreground"
            fontSize={11}
          >
            {c.label}
          </text>
        ))}

        {/* API（店主の窓口） */}
        <g className="stroke-foreground" strokeWidth={2}>
          <rect x={API_X - 50} y={API_Y - 55} width={140} height={142} className="fill-card" />
          <rect x={API_X - 46} y={API_Y - 51} width={132} height={134} fill="none" className="stroke-gold" strokeWidth={1} />
        </g>
        <Shopkeeper x={API_X + 20} y={API_Y + 32} px={3} />
        {/* 店主の下半身を隠すカウンター（メインの図と同じドット絵） */}
        <Counter x={API_X + 20} y={API_Y + 32} width={96} height={21} px={3} />
        <text x={API_X + 20} y={API_Y + 72} textAnchor="middle" className="fill-foreground font-serif" fontSize={13} fontWeight="bold">
          よろず屋API
        </text>
      </svg>
    </Figure>
  );
}
