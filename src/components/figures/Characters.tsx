// 図解で使うドット絵のキャラクター・小物（SVGの <g>）
// スプライトは1文字＝1ドットの文字列で描く（"." は透明）。色は PALETTE の1文字キーで指定する
// 2コマのスプライトは、1コマ目の上に「2コマ目との差分だけの重ね絵」を置き、
// index.css の fig-frame-b（半分ずつ交互）か fig-blink-b（まばたき：最後の少しだけ）で表示・非表示にする

type Rows = readonly string[];

// 依頼書の配色（焦茶・金・朱・生成り）に寄せたドット絵用パレット
const PALETTE: Record<string, string> = {
  K: "#2b2118", // 輪郭（焦茶）
  S: "#f3cfa5", // 肌
  s: "#d9a27a", // 肌の影
  h: "#4a2a14", // 髪の影
  G: "#d9ae4c", // 金
  g: "#9c7426", // 金の影
  Y: "#f7e3a1", // 金のハイライト
  R: "#c0462c", // 朱
  r: "#7e2a1b", // 朱の影
  T: "#8b6a45", // 革
  t: "#5e4630", // 革の影
  W: "#f4efe3", // 白（刃・瓶の光・白ひげ）
  e: "#b9b0a2", // 白髪の影
  M: "#b7bdc1", // 鋼
  N: "#7d9c3f", // やくそう
  n: "#4f6a26", // やくそうの影
  B: "#4f7fa8", // 青い薬
  b: "#2f5577", // 青い薬の影
  Z: "#3a3440", // 冒険者の黒髪
  z: "#5f5868", // 黒髪のハイライト
  P: "#6e4a9e", // 冒険者のマント（紫）
  i: "#47306b", // マントの影
  y: "#e8c34a", // 冒険者の袖（黄色）
  c: "#4fa89a", // 冒険者の髪飾り（緑）
  U: "#3d4280", // 魔法使いの紺（帽子・ローブ）
  u: "#272b57", // 紺の影
  v: "#5c63a8", // 紺のハイライト
  D: "#a0703f", // 木
  d: "#6e4a2a", // 木の影
  L: "#c79a5e", // 木のハイライト
  V: "#3a2a1c", // 棚の奥
};

// ---- スプライト描画 ----

type Run = { x: number; y: number; w: number; c: string };

// 同じ色が横に続く部分を1つの矩形にまとめる（要素数を減らす）
function toRuns(rows: Rows): Run[] {
  const out: Run[] = [];
  rows.forEach((row, y) => {
    let x = 0;
    while (x < row.length) {
      const c = row[x];
      let end = x + 1;
      while (end < row.length && row[end] === c) end++;
      if (c !== ".") out.push({ x, y, w: end - x, c });
      x = end;
    }
  });
  return out;
}

const runCache = new WeakMap<Rows, Run[]>();
function runsOf(rows: Rows) {
  let r = runCache.get(rows);
  if (!r) {
    r = toRuns(rows);
    runCache.set(rows, r);
  }
  return r;
}

// 拡大表示時にドットの境目へ細い隙間が出ないよう、わずかに重ねて描く
const SEAM = 0.25;

function Pixels({ rows, px }: { rows: Rows; px: number }) {
  return (
    <>
      {runsOf(rows).map((r, i) => (
        <rect
          key={i}
          x={r.x * px}
          y={r.y * px}
          width={r.w * px + SEAM}
          height={px + SEAM}
          fill={PALETTE[r.c]}
        />
      ))}
    </>
  );
}

// 2コマ目のうち、1コマ目と違うドットだけを残した「重ね絵」を作る
// 重ね絵は上から描き足すことしかできないため、2コマ目で消えるドット（"."になるドット）があればエラーにする
function overlayOf(base: Rows, next: Rows): Rows {
  return base.map((row, y) =>
    [...row]
      .map((c, x) => {
        const n = next[y][x];
        if (n === c) return ".";
        if (n === ".") throw new Error(`2コマ目で消えるドットは表現できません（${y}行目 ${x}列目）`);
        return n;
      })
      .join("")
  );
}

const overlayCache = new WeakMap<Rows, Rows>();

// 1〜2コマのスプライト。(x, y) はスプライト左上
// 2コマの場合、1コマ目は常に表示したまま、違う部分だけの重ね絵を表示・非表示にする。
// 全身を2枚入れ替える方式だと、切り替えの瞬間に両方が消えて体がちらつくことがあるため
function Sprite({
  frames,
  x,
  y,
  px,
  period = 1,
  timing = "half",
}: {
  frames: Rows[];
  x: number;
  y: number;
  px: number;
  period?: number;
  // half＝2コマを半分ずつ交互に表示、blink＝最後の少しだけ2コマ目を表示（まばたき）
  timing?: "half" | "blink";
}) {
  const [base, next] = frames;
  let overlay: Rows | undefined;
  if (next) {
    overlay = overlayCache.get(next);
    if (!overlay) {
      overlay = overlayOf(base, next);
      overlayCache.set(next, overlay);
    }
  }
  return (
    <g transform={`translate(${x} ${y})`} shapeRendering="crispEdges">
      <Pixels rows={base} px={px} />
      {overlay && (
        // 重ね絵は通常は非表示。動きを減らす設定の環境ではこのまま1コマ目だけが見える
        <g
          style={{
            opacity: 0,
            animation: `${timing === "blink" ? "fig-blink-b" : "fig-frame-b"} ${period}s step-end infinite`,
          }}
        >
          <Pixels rows={overlay} px={px} />
        </g>
      )}
    </g>
  );
}

// ---- スプライトデータ ----

// 冒険者：黒っぽいツンツンのくせ毛に緑の髪飾り、青い瞳、背中に流れる紫のマント、黄色の袖、
// 茶色の革のベストと籠手、金の留め具のベルト、青い腰布、黄土色のズボンと茶色のブーツ（20×28ドット）
// 右（店主の方）へ斜めに向いている。マントと後ろ髪は背中側（左）に流れる
const ADVENTURER_BASE: Rows = [
  ".........K..K.......",
  "......K.KZKKZK.K....",
  ".....KZKZZZZZZKZK...",
  "....KZZZZzZZZzZZZK..",
  "...KZZZZZZZZZZZZZZK.",
  "....KZZZZZZZZZZZZZK.",
  "...KZZZZZZZZScZSZZK.",
  "...KZZZZZSSSSSSSSK..",
  "..KZZZZZSKKSSSKKSK..",
  "...KZZZZSWBSSSWBSK..",
  "....KZZZSSSSSSSSK...",
  "....KZZKSSSSSSSK....",
  ".....KZKKSSSSKK.....",
  "...KiPPPPPPPPPPK....",
  "..KiPPiPPPPPPiPPK...",
  ".KiPKyyKdddddKyyK...",
  ".KiPKyyKdYdYdKyyK...",
  ".KiPKhhKdddddKhhK...",
  ".KiPKddKhhYhhKddK...",
  ".KiPKddKBBBBBKddK...",
  ".KiPKKKKBbBbBKKKK...",
  ".KiPPK.KBBBBBK......",
  "..KiPK.KgggggK......",
  "...KiK.KgK.KgK......",
  "....K..KgK.KgK......",
  "......KddK.KddK.....",
  "......KhdK.KdhK.....",
  "......KKKK.KKKK.....",
];
// 2コマ目：目を閉じた絵（まばたき）。体は動かさないので、足が地面から浮いて見えることはない
const ADVENTURER_BLINK: Record<number, string> = {
  8: "..KZZZZZSSSSSSSSSK..",
  9: "...KZZZZSKKSSSKKSK..",
};
const ADVENTURER: Rows[] = [ADVENTURER_BASE, ADVENTURER_BASE.map((row, i) => ADVENTURER_BLINK[i] ?? row)];
const ADVENTURER_H = ADVENTURER_BASE.length;
const ADVENTURER_CENTER = 10; // 体の中心の列

// 店主：紺のとんがり帽子（先が垂れ、金のバックルの帯）、白い眉と団子鼻、もじゃもじゃの白ひげ、
// 金の縁取りの紺のローブを着た魔法使いのおじいさん（20×24ドット。下の2行はカウンターに隠れる）
const SHOPKEEPER_BASE: Rows = [
  "..........KK........",
  ".........KvUK.......",
  "........KvUUUK......",
  "........KvUUUUKK....",
  ".......KvUUUUUUUK...",
  ".......KUUUUUUuuK...",
  "......KvUUUUKuuuK...",
  "......KUUUUUuKuK....",
  ".....KGGGKYYKGGGK...",
  "...KKuUUUUUUUUUUuKK.",
  "..KuuuuuuuuuuuuuuuuK",
  "....KWSSSSSSSSWK....",
  "....KSWWSSSSWWSK....",
  "....KSSKSSSSKSSK....",
  "...KWWSSSssSSSWWK...",
  "...KWWSWWWWWWSWWK...",
  "..KWWWWWeeeeWWWWWK..",
  ".KWWWWWWWWWWWWWWWWK.",
  ".KeWWWWWWWWWWWWWWeK.",
  "KUUKWWWWWWWWWWWWKUUK",
  "KUGUKeWWWWWWWWeKUGUK",
  "KUGUUKeWWWWWWeKUUGUK",
  "KUGUUUKWWWWWWKUUUGUK",
  "KKKKKKKKKKKKKKKKKKKK",
];
// 2コマ目：片手を上げて「いらっしゃい」と手を振る（1コマ目と違う行だけ書く）
const SHOPKEEPER_WAVE: Record<number, string> = {
  13: ".KK.KSSKSSSSKSSK....",
  14: "KSSKWWSSSssSSSWWK...",
  15: "KSSKWWSWWWWWWSWWK...",
  16: "KSSKWWWWeeeeWWWWWK..",
  17: "KUUKWWWWWWWWWWWWWWK.",
  18: "KUUKWWWWWWWWWWWWWeK.",
};
const SHOPKEEPER: Rows[] = [SHOPKEEPER_BASE, SHOPKEEPER_BASE.map((row, i) => SHOPKEEPER_WAVE[i] ?? row)];
const SHOPKEEPER_HIDDEN_ROWS = 2; // カウンターに隠れる下の行数
const SHOPKEEPER_CENTER = 10; // 体の中心の列

// ポーションの小瓶（4×6ドット）
const POTIONS = {
  red: [".dd.", ".KK.", "KRRK", "KRYK", "KrRK", ".KK."],
  blue: [".dd.", ".KK.", "KBBK", "KBWK", "KbBK", ".KK."],
  gold: [".dd.", ".KK.", "KGGK", "KGYK", "KgGK", ".KK."],
} satisfies Record<string, Rows>;

// 小物（宝箱から出てくる・棚に並ぶ）
const ITEMS = {
  hammer: ["KKKKKKK", "KMMMMMK", "KMMMMMK", "KKKDKKK", "..KDK..", "..KDK..", "..KDK..", "..KKK.."],
  bag: ["..KK..", ".KtdK.", "KTTTTK", "KTGYTK", "KTTTTK", ".KKKK."],
} satisfies Record<string, Rows>;

// 商品棚（26×30ドット）：上段にポーション、中段にやくそうと袋、下段に剣と盾
function buildShelf(): Rows {
  const w = 26;
  const h = 30;
  const g = Array.from({ length: h }, () => Array<string>(w).fill("V"));
  for (let y = 0; y < h; y++) {
    g[y][0] = g[y][w - 1] = "K";
    g[y][1] = g[y][w - 2] = "D";
  }
  for (let x = 0; x < w; x++) {
    g[0][x] = "K";
    g[1][x] = x > 0 && x < w - 1 ? "L" : "K";
    g[h - 1][x] = "K";
  }
  for (const by of [10, 20]) {
    for (let x = 1; x < w - 1; x++) {
      g[by][x] = "L";
      g[by + 1][x] = "d";
    }
  }
  for (let x = 1; x < w - 1; x++) g[h - 2][x] = "d";

  const put = (sprite: Rows, ox: number, oy: number) =>
    sprite.forEach((row, yy) =>
      [...row].forEach((c, xx) => {
        if (c !== ".") g[oy + yy][ox + xx] = c;
      })
    );
  put(POTIONS.red, 4, 4);
  put(POTIONS.blue, 11, 4);
  put(POTIONS.gold, 18, 4);
  put(["..K.K..", ".KNKNK.", "KNnNnNK", ".KNNNK.", "..KnK..", "..KdK..", "..KKK.."], 3, 12);
  put(ITEMS.bag, 12, 13);
  put(ITEMS.bag, 18, 13);
  put(["..........KK", "KKKKKKKKKKWK", "KhhGWWWWWWWK", "KKKKKKKKKKK."], 2, 23);
  put([".KKKKK.", "KMGGGMK", "KGGYGGK", "KMGGGMK", ".KMMMK.", "..KKK.."], 17, 22);
  return g.map((r) => r.join(""));
}
const SHELF = buildShelf();
export const SHELF_PX = 5;
export const SHELF_W = 26 * SHELF_PX;
export const SHELF_H = 30 * SHELF_PX;

// 木のカウンター（幅・高さはドット数）
function buildCounter(w: number, h: number): Rows {
  const rows = ["K".repeat(w), "K" + "L".repeat(w - 2) + "K", "K" + "L".repeat(w - 2) + "K", "K".repeat(w)];
  rows.push("K" + "d".repeat(w - 2) + "K");
  for (let y = 0; y < h - 7; y++) {
    const r = ("K" + "D".repeat(w - 2) + "K").split("");
    for (let x = 6; x < w - 1; x += 8) r[x] = "d";
    rows.push(r.join(""));
  }
  rows.push("K" + "d".repeat(w - 2) + "K", "K".repeat(w));
  return rows;
}

// 床（幅はドット数）。wood＝板張りの店内、grass＝草原
function buildFloor(w: number, variant: "wood" | "grass"): Rows {
  if (variant === "grass") {
    return [
      Array.from({ length: w }, (_, x) => (x % 5 === 1 || x % 7 === 3 ? "N" : ".")).join(""),
      "N".repeat(w),
      Array.from({ length: w }, (_, x) => (x % 4 === 0 ? "n" : "N")).join(""),
      Array.from({ length: w }, (_, x) => (x % 6 === 2 ? "d" : "D")).join(""),
    ];
  }
  const rows = ["K".repeat(w)];
  for (let y = 0; y < 3; y++) {
    rows.push(Array.from({ length: w }, (_, x) => ((x + y * 7) % 12 === 0 ? "d" : "D")).join(""));
  }
  return rows;
}

// 開いた宝箱（16×13ドット）：ふたの裏が見え、中に金貨が詰まっている
const CHEST: Rows = [
  "..KKKKKKKKKKKK..",
  ".KDLLLLLLLLLLDK.",
  ".KDDDDDDDDDDDDK.",
  ".KVVVVVVVVVVVVK.",
  "KKKKKKKKKKKKKKKK",
  "KYGYYGYGYYGYGYYK",
  "KKKKKKKKKKKKKKKK",
  "KGDDDDDKKDDDDDGK",
  "KGDDDDKYGKDDDDGK",
  "KGDDDDDKKDDDDDGK",
  "KGDDDDDDDDDDDDGK",
  "KGGGGGGGGGGGGGGK",
  "KKKKKKKKKKKKKKKK",
];

// 立て札（22×16ドット）。文字はSVGのtextで重ねる
const SIGNPOST: Rows = [
  "KKKKKKKKKKKKKKKKKKKKKK",
  "KLLLLLLLLLLLLLLLLLLLLK",
  "KLLLLLLLLLLLLLLLLLLLLK",
  "KLLLLLLLLLLLLLLLLLLLLK",
  "KLLLLLLLLLLLLLLLLLLLLK",
  "KLLLLLLLLLLLLLLLLLLLLK",
  "KddddddddddddddddddddK",
  "KKKKKKKKKKKKKKKKKKKKKK",
  ".........KDdK.........",
  ".........KDdK.........",
  ".........KDdK.........",
  ".........KDdK.........",
  ".........KDdK.........",
  ".........KDdK.........",
  ".........KDdK.........",
  ".........KKKK.........",
];


// ---- 公開コンポーネント ----

type Pos = { x: number; y: number; px?: number };

// 冒険者（(x, y)＝足元の中心）。ときどきまばたきする
export function Adventurer({ x, y, px = 5 }: Pos) {
  return (
    <Sprite
      frames={ADVENTURER}
      x={x - ADVENTURER_CENTER * px}
      y={y - ADVENTURER_H * px}
      px={px}
      period={3.2}
      timing="blink"
    />
  );
}

// 店主（(x, y)＝カウンター上面の中心）。カウンターより先に描くと下半身が隠れる
export function Shopkeeper({ x, y, px = 5 }: Pos) {
  return <Sprite frames={SHOPKEEPER} x={x - SHOPKEEPER_CENTER * px} y={y - (SHOPKEEPER_BASE.length - SHOPKEEPER_HIDDEN_ROWS) * px} px={px} period={1.4} />;
}

// カウンター（(x, y)＝上面の中心。width/height は描画サイズ）
export function Counter({ x, y, width = 160, height = 56, px = 5 }: { x: number; y: number; width?: number; height?: number; px?: number }) {
  const w = Math.round(width / px);
  const h = Math.round(height / px);
  return <Sprite frames={[buildCounter(w, h)]} x={x - (w * px) / 2} y={y} px={px} />;
}

// 床（(x, y)＝床の上面の左端）
export function Floor({
  x,
  y,
  width,
  px = 5,
  variant = "wood",
}: {
  x: number;
  y: number;
  width: number;
  px?: number;
  variant?: "wood" | "grass";
}) {
  // 草原は1行目が草の先（地面より上）なので、その分だけ上にずらす
  const top = variant === "grass" ? y - px : y;
  return <Sprite frames={[buildFloor(Math.round(width / px), variant)]} x={x} y={top} px={px} />;
}

// 開いた宝箱（(x, y)＝左下）
export function Chest({ x, y, px = 4 }: Pos) {
  return <Sprite frames={[CHEST]} x={x} y={y - CHEST.length * px} px={px} />;
}

// 立て札（(x, y)＝支柱の足元の中心）。label は板に書く文字
export function Signpost({ x, y, px = 3, label }: Pos & { label: string }) {
  const left = x - 11 * px;
  const top = y - SIGNPOST.length * px;
  return (
    <g>
      <Sprite frames={[SIGNPOST]} x={left} y={top} px={px} />
      <text x={x} y={top + 4.6 * px} textAnchor="middle" fontSize={11} fontWeight="bold" fill={PALETTE.K} className="font-serif">
        {label}
      </text>
    </g>
  );
}

// 小物（(x, y)＝中心）
export function Item({ x, y, kind, px = 3 }: Pos & { kind: keyof typeof ITEMS }) {
  const rows = ITEMS[kind];
  return <Sprite frames={[rows]} x={x - (rows[0].length * px) / 2} y={y - (rows.length * px) / 2} px={px} />;
}

// ポーションの小瓶（(x, y)＝瓶の中心）
export function Potion({ x, y, tone = "gold", px = 3 }: { x: number; y: number; tone?: keyof typeof POTIONS; px?: number }) {
  return <Sprite frames={[POTIONS[tone]]} x={x - 2 * px} y={y - 3 * px} px={px} />;
}

// 商品棚（(x, y)＝左上）
export function Shelf({ x, y }: { x: number; y: number }) {
  return <Sprite frames={[SHELF]} x={x} y={y} px={SHELF_PX} />;
}
