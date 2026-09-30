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
  h: "#4a2a14", // 濃い焦茶（棚の継ぎ目・剣の柄）
  G: "#d9ae4c", // 金
  g: "#9c7426", // 金の影
  Y: "#f7e3a1", // 金のハイライト
  R: "#c0462c", // 朱
  r: "#7e2a1b", // 朱の影
  W: "#f4efe3", // 白（刃・瓶の光・白ひげ）
  e: "#b9b0a2", // 白の影（白ひげ・袖口・瓶の口）
  M: "#b7bdc1", // 鋼
  N: "#7d9c3f", // やくそう
  n: "#4f6a26", // やくそうの影
  B: "#4f7fa8", // 青い薬
  b: "#2f5577", // 青い薬の影
  F: "#4a9e2c", // 冒険者のフードと服（緑）
  f: "#2f7327", // 緑の影
  l: "#78c24a", // 緑のハイライト（服・草の先）
  H: "#8c5a32", // 冒険者の茶髪
  o: "#1d4a22", // フードの内側の暗がり
  j: "#5e3a20", // 茶髪の影・眉・口
  q: "#b07a45", // 茶髪のハイライト
  A: "#8a4f2c", // 革（冒険者の籠手・ブーツ・背負い袋、革袋）
  a: "#5a3120", // 革の影・たすき
  O: "#b0703f", // 革のハイライト・ブーツの折り返し
  m: "#7d8388", // 鋼の影
  w: "#dcd6cb", // 店主の灰色の髪・ひげ・眉
  c: "#8e877c", // 灰色の眉の影・口ひげの縁・ひげの毛筋
  p: "#e8927a", // ほおの赤み
  E: "#e6dcc0", // 冒険者の袖口（生成り）
  Z: "#3a3440", // 冒険者のズボン（黒）
  z: "#5f5868", // ズボンのハイライト
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
// どのスプライトも「基準の大きさ px」の半分（px / DETAIL）を1ドットとして描く。
// 図の側は従来どおり px（1マスの大きさ）を指定すればよく、ドットの細かさだけがここで決まる
const DETAIL = 2;

// 冒険者：緑のとんがりフードに茶色の髪、緑の服に革のたすきとベルト、生成りの袖口と茶色の籠手、
// 黒いズボンと折り返しのある茶色のブーツ。寝袋とロープを付けた背負い袋を背負っている（34×60ドット）
// 右（店主の方）へ斜めに向いている。背負い袋は背中側（左）に見える
const ADVENTURER_BASE: Rows = [
  ".................KKKKKKKK.........",
  "..............KKKllllllffKK.......",
  ".............KlllFFFFFFFFffK......",
  "...........KKlFFFFFfffffffffK.....",
  "..........KllFFFFFfffffffffffK....",
  ".........KlFFFFFFffoojjjjjoffK....",
  "........KffFFFFFffojHHHHHHjofK....",
  ".........KffFFFffojHHqqqHHHHofK...",
  "..........KfFFFffjHHqqHHHHHHjfK...",
  "....KKKKKKDKlFffojHHHHHjHHHHjfK...",
  "..KKLDDKKDDKlFffojHHjHHHjHHHjfK...",
  ".KLLLLLDDKDKlFffojHjHHjHHjHHjfK...",
  ".KLLDDDDDKDKlFffojjSjHSjSSjHjfK...",
  "KLLDLLLDDDKKlFffooSjjjSSjjjSjfK...",
  "KDLDLDLDLDDKlFffooSWKSSSSWKSofK...",
  "KDLDLLLDDDKKlFffooSKKSSSSKKsofK...",
  ".KDDDDDDDKDKlFffoosSSSSsSSSsofK...",
  ".KDDDDDDDKDKlFffoosSSSSSSSSsofK...",
  "..KKDDDKKDDKfFFffoosSSjjSSsoffK...",
  ".KaaKKKKKKKKffffffoosSSSSsoffK....",
  "KOOOOOOOOOK.KffffffoossssooffK....",
  "KOAAAAAAAaaKKKKKKKKKKKKKKKKKKa....",
  "KOAAAAAaaKKfKaallllllollfffaKKK...",
  "KaaaaaaaaaafKaalFFFFFFlfffaaKfK...",
  "KOAAAAAaaKffMMMlFFFFFofffaafKffK..",
  "KaaaaaaaaKlfMKmlFFFFFfMMMafffKfK..",
  "KaaaaaaaaKffmmmlFFFFffMamafffKfK..",
  "KKKKKKKKaKfffKalFFFfffmmmfffKKKKK.",
  "KKOOOOOaKKKKKKalFFfffaaalfffKEEeK.",
  "KKOAAAAaKEEEeKalFFfffaalFfffKeeeK.",
  "KKKKKKKKKeeeeKafffffaaffffffKKKKK.",
  "KKOAMAaKKKKKKaaffffaafffffffKOaaK.",
  "KKOAmAaKOOaaKaafffaaffffffffKOaaK.",
  "KKOAAAaKOAaaKKKKKKKKKKMMMMKKKOAaaK",
  "KKaaaaaKOAAaaKaaaaaaaaMaamaaKOAaaK",
  "KKKKKKKKOAAaaKKKKKKKKKmmmmKKKaAaaK",
  "KLLDDKaKaAAaaKfllllllllllfffKaaaaK",
  "KDKKdKaKaAAaaKfFFFFFFFFFFFfffKaaK.",
  "KLKKDKaaKaaaK.KlFFFFFFFFFFfffKKKK.",
  "KDKKdKaaKaaaK.KlFFFFFFFFFFfffK....",
  "KLKKDKaaaKKKK.KffffffffffffffK....",
  "KDKKdKaaaaK...KffffffffffffffK....",
  "KLKKDKKKKK...KfffffffffffffffK....",
  "KLDDdK.......KKKKKKKKKKKKKKKKKK...",
  ".KDdK........KzzzzzK..KzzzzzK.....",
  "..KK.........KzZZZZK..KzZZZZK.....",
  ".............KzZZZZK..KzZZZZK.....",
  "..............KzZZZK..KzZZZZK.....",
  "..............KzZZZK..KzZZZZK.....",
  "............KKKKKKKK..KKKKKKKK....",
  "............KOOOOOAK..KOOOOOAK....",
  "............KAAAAAAK..KAAAAAAK....",
  "............KKKKKKKK..KKKKKKKK....",
  ".............KOOaaK....KOOaaK.....",
  ".............KOAaaK....KOAaaK.....",
  "............KOAAaaK....KOAAaaKK...",
  "...........KOAAAaaK...KOAAAAAaaKK.",
  "...........KaaaaaaK...KaaaaaaaaaK.",
  "...........KaaaaaaK...KaaaaaaaaaK.",
  "...........KKKKKKKK...KKKKKKKKKKK.",
];
// 2コマ目：目を閉じた絵（まばたき。目の上の段を肌色にして、下の段だけ残す）。体は動かさないので、足が地面から浮いて見えることはない
const ADVENTURER_BLINK: Record<number, string> = {
  14: "KDLDLDLDLDDKlFffooSSSSSSSSSSofK...",
};
const ADVENTURER: Rows[] = [ADVENTURER_BASE, ADVENTURER_BASE.map((row, i) => ADVENTURER_BLINK[i] ?? row)];
const ADVENTURER_H = ADVENTURER_BASE.length;
const ADVENTURER_CENTER = 21; // 体の中心の列

// 店主：つばの広い紺のとんがり帽子（つばの両端が垂れ、先が右へ折れて垂れる。茶色の革の帯に金の四角いバックル）、
// 垂れた灰色の眉と団子鼻、赤いほお、八の字の口ひげ（あいだに小さな口）、毛筋の入った先細りの灰色のあごひげ。
// 前の開いた紺のローブ（襟に金の縁取り）の下に茶色のベストと金の丸いブローチ。魔法使いのおじいさん
// （40×44ドット。下の4行はカウンターに隠れる）。顔と体は冒険者と釣り合う大きさにしてあり、帽子だけ大きめ。
// 横の髪は外下へとがった房が重なるギザギザの毛先で、下の房ほど外へ広がる。顔やひげとの境目には輪郭線を引かず影色でなじませている
const SHOPKEEPER_BASE: Rows = [
  ".....................KKKKKK.............",
  "..................KKKvvvuuKKKKK.........",
  ".................KvvvUUUuuKuvuuK........",
  "................KvUUUUUUUuuKuUuuK.......",
  "...............KvUUUUUUUUuuKuuUuuK......",
  "..............KvUUUUUUUUUUuuKuuUuuK.....",
  ".............KvUUUUUUUUUUUUuuKuuUuuK....",
  ".............KvUUUUUUUUUUUUUuuKuuUuuK...",
  "............KvUUUUUUUUUUUUUuuK.KuuuuK...",
  "............KvUUUUUUUUUUUUUuuK..KuuuuK..",
  "............KuuuuuuuuuuuuuuuuuK..KuuuK..",
  "...........KuuuuuKKKKKKuuuuuuuK...KuuK..",
  ".........KKKKKKKKKGYYGKKKKKKKKK....KuuK.",
  ".........KOOOOOOOKYAAgKOOOOOOaK....KuuK.",
  "........KaaaaaaaaKGAAgKaaaaaaaK....KuuK.",
  "......KKKKKKKKKKKKGggGKKKKKKKKKKK...KK..",
  "..KKKKvvvvvvvvvvvKKKKKKvvvvvvvvuuKKK.K..",
  ".KvvvvUuuuuuuuuuuuuuuuuuuuuuuuuuUvuuK...",
  "KvUUuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuK..",
  "KvUuuuuKKKKKKKKKKKKKKKKKKKKKKKKKuuuuuuK.",
  "KuuuKKK..KWwewWWwwSSSSwwWWwewWK.KKKuuuK.",
  "KuuK....KWwwecwwweSSSSewwwcewwWK...KuuuK",
  ".KK....KwwweeSSWKSSSSSSWKSseewwwK...KuuK",
  "........KeWweSSKKSSssSSKKSsewWeK.....KK.",
  ".......KWwwwepSSSSsSSsSSSSpewwwWK.......",
  "......KWwwwweSSSSSSssSSSSSsewwwwWK......",
  ".....KwwwweeessssWWWWWWsssseeewwwwK.....",
  "......KKeWwweewwWWWssWWWwweewwWeKK......",
  ".....KWwwwwweWcwWwcaacwWwceewwwwwWK.....",
  "....KWwwwwwwecwWwcwwwwcwWwcewwwwwwWK....",
  "...KwwwwweeeeccewwwwwwwwecceeeewwwwwK...",
  "....KKKKewwweeeewcwewwcweeeewwweKKKK....",
  ".......KuuKKKeKeecweewceeKeKKKuK........",
  ".......KvUvuuKuKeceeeeceKuKvvvuuK.......",
  ".......KvUUUUuGKKeeeeeeKKGvUUUuuK.......",
  "......KvUUUUUuGKAKKKKKKAKGUUUUuuK.......",
  "......KvUUUUUuGKAKGYYgKaKGUUUUUuuK......",
  "......KvUUUUUuGKAKYGggKaKGUUUUUuuK......",
  "......KvUUUUUuGKAKgggGKaKGUUUUUuuK......",
  ".....KvUUUUUUuGKAaKKKKaaKGUUUUUUuuK.....",
  ".....KvUUUUUUuGKAaaaaaaaKGUUUUUUuuK.....",
  ".....KuuuuuuuuGKAaaaaaaaKGuuuuuuuuK.....",
  "....KuuuuuuuuuGKAaaaaaaaKGuuuuuuuuuK....",
  "....KKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKK....",
];
// 2コマ目：片手を上げて「いらっしゃい」と手を振る（1コマ目と違う行だけ書く）
const SHOPKEEPER_WAVE: Record<number, string> = {
  23: "...KKKK.KeWweSSKKSSssSSKKSsewWeK.....KK.",
  24: "..KSsSsKWwwwepSSSSsSSsSSSSpewwwWK.......",
  25: "..KSsSsKKwwweSSSSSSssSSSSSsewwwwWK......",
  26: "..KSSSSKSKeeessssWWWWWWsssseeewwwwK.....",
  27: "..KSSSSSSKwweewwWWWssWWWwweewwWeKK......",
  28: "..KSSSSSKwwweWcwWwcaacwWwceewwwwwWK.....",
  29: "..KsSSSsKwwwecwWwcwwwwcwWwcewwwwwwWK....",
  30: "...KsssKweeeeccewwwwwwwwecceeeewwwwwK...",
  31: "...KKKKKewwweeeewcwewwcweeeewwweKKKK....",
  32: "...KvUUUuuKeKeKeecweewceeKeKKKuK........",
  33: "...KvUUUUuuKuKuKeceeeeceKuKvvvuuK.......",
  34: "...KuUUUUuuKvuGKKeeeeeeKKGvUUUuuK.......",
  35: "...KuUUUUuuKvuGKAKKKKKKAKGUUUUuuK.......",
  36: "....KvUUUuuKvuGKAKGYYgKaKGUUUUUuuK......",
  37: "....KuuuuuKvUuGKAKYGggKaKGUUUUUuuK......",
  38: "....KuuuuuKvUuGKAKgggGKaKGUUUUUuuK......",
  39: ".....KKKKKKvUuGKAaKKKKaaKGUUUUUUuuK.....",
  40: ".....KvvvvvUUuGKAaaaaaaaKGUUUUUUuuK.....",
};
const SHOPKEEPER: Rows[] = [SHOPKEEPER_BASE, SHOPKEEPER_BASE.map((row, i) => SHOPKEEPER_WAVE[i] ?? row)];
const SHOPKEEPER_HIDDEN_ROWS = 4; // カウンターに隠れる下の行数
const SHOPKEEPER_CENTER = 20; // 体の中心の列

// ポーションの小瓶（8×12ドット）。"1" が薬の色、"2" がその影
const POTION_TEMPLATE: Rows = [
  "..KKKK..",
  "..KLDK..",
  "..KDdK..",
  "..KKKK..",
  "..KWeK..",
  ".KW11eK.",
  "KW11112K",
  "K1W1112K",
  "K111122K",
  "K211122K",
  ".K2222K.",
  "..KKKK..",
];
const tintPotion = (main: string, dark: string): Rows =>
  POTION_TEMPLATE.map((row) => row.replaceAll("1", main).replaceAll("2", dark));
const POTIONS = {
  red: tintPotion("R", "r"),
  blue: tintPotion("B", "b"),
  gold: tintPotion("G", "g"),
} satisfies Record<string, Rows>;
const POTION_W = POTION_TEMPLATE[0].length;
const POTION_H = POTION_TEMPLATE.length;

// 小物（宝箱から出てくる・棚に並ぶ）
const ITEMS = {
  // ハンマー（14×16ドット）
  hammer: [
    "KKKKKKKKKKKKKK",
    "KWWMMMMMMMMMmK",
    "KWMMMMMMMMMMmK",
    "KMMMMMMMMMMMmK",
    "KmmmmmmmmmmmmK",
    "KKKKKLDdKKKKKK",
    ".....KDdK.....",
    ".....KLdK.....",
    ".....KDdK.....",
    ".....KDdK.....",
    ".....KLdK.....",
    ".....KDdK.....",
    ".....KDdK.....",
    ".....KLdK.....",
    ".....KddK.....",
    ".....KKKK.....",
  ],
  // 金の紋章の革袋（12×12ドット）
  bag: [
    "....KKKK....",
    "...KOAAaK...",
    "....KaaK....",
    "...KKGGKK...",
    "..KOAAAAaK..",
    ".KOAAAAAAaK.",
    "KOAAAGGAAAaK",
    "KAAAGYYGAAaK",
    "KAAAAGGAAAaK",
    "KAAAAAAAAaaK",
    ".KaaaaaaaaK.",
    "..KKKKKKKK..",
  ],
} satisfies Record<string, Rows>;

// 棚だけに並ぶ商品：やくそうの鉢（14×14）、剣（24×7）、金の盾（14×13）
const HERB: Rows = [
  "....KK..KK....",
  "...KNlK.KlK...",
  "..KNlNK.KNNK..",
  ".KKNNnKKNNnKK.",
  "KlNKNnKNnKNlK.",
  "KNNNKnKnKNNnK.",
  ".KnNNKnKNNnK..",
  "..KKnnKnnKK...",
  "....KKnKK.....",
  ".....KnK......",
  "....KKdKK.....",
  "...KDLDdDK....",
  "...KdDDddK....",
  "....KKKKK.....",
];
const SHOP_SWORD: Rows = [
  "......KKK...............",
  "......KGKKKKKKKKKKKKKK..",
  "KKKKKKKGKWWWWWWWWWWWWKK.",
  "KGKhhhKGKMMMMMMMMMMMMMMK",
  "KKKKKKKGKmmmmmmmmmmmmKK.",
  "......KgKKKKKKKKKKKKKK..",
  "......KKK...............",
];
const SHIELD: Rows = [
  ".KKKKKKKKKKKK.",
  "KMWMMMMMMMMMmK",
  "KMGGGGGGGGGGmK",
  "KMGYYGGGGGGgmK",
  "KMGYGGYYGGGgmK",
  "KMGGGYWYGGggmK",
  "KMGGGGYGGGggmK",
  ".KMGGGGGGggmK.",
  ".KMGGGGGgggmK.",
  "..KMGGgggmK...",
  "...KMmgmmK....",
  "....KMmmK.....",
  ".....KKK......",
];

// 商品棚（52×60ドット）：上段にポーション、中段にやくそうと袋、下段に剣と盾
function buildShelf(): Rows {
  const w = 52;
  const h = 60;
  // 奥の板：8ドットごとに板の継ぎ目
  const g = Array.from({ length: h }, () => Array.from({ length: w }, (_, x): string => (x % 8 === 3 ? "h" : "V")));
  // 横板（上が明るく下が暗い）。top は板の上端の輪郭の行
  const board = (top: number) => {
    ["K", "L", "D", "d", "K"].forEach((c, i) => {
      for (let x = 0; x < w; x++) g[top + i][x] = c;
    });
  };
  board(0);
  board(18);
  board(37);
  for (let x = 0; x < w; x++) {
    g[h - 4][x] = "K";
    g[h - 3][x] = "D";
    g[h - 2][x] = "d";
    g[h - 1][x] = "K";
  }
  // 左右の側板（光は左から）
  for (let y = 0; y < h; y++) {
    ["K", "L", "D", "d", "K"].forEach((c, i) => {
      g[y][i] = c;
      g[y][w - 5 + i] = c;
    });
  }

  const put = (sprite: Rows, ox: number, oy: number) =>
    sprite.forEach((row, yy) =>
      [...row].forEach((c, xx) => {
        if (c !== ".") g[oy + yy][ox + xx] = c;
      })
    );
  put(POTIONS.red, 9, 6);
  put(POTIONS.blue, 22, 6);
  put(POTIONS.gold, 35, 6);
  put(HERB, 7, 23);
  put(ITEMS.bag, 23, 25);
  put(ITEMS.bag, 34, 25);
  put(SHOP_SWORD, 7, 49);
  put(SHIELD, 33, 43);
  return g.map((r) => r.join(""));
}
const SHELF = buildShelf();
const SHELF_DOT = 5 / DETAIL;
export const SHELF_W = SHELF[0].length * SHELF_DOT;
export const SHELF_H = SHELF.length * SHELF_DOT;

// 木のカウンター（幅・高さはドット数）：天板の下に、縁が面取りされた板を並べた前板
function buildCounter(w: number, h: number): Rows {
  const row = (edge: string, fill: string) => edge + fill.repeat(w - 2) + edge;
  const rows = [row("K", "K"), row("K", "L"), row("K", "L"), row("K", "D"), row("K", "K"), row("K", "d")];
  const bodyH = h - rows.length - 2;
  // 前板は1枚14ドット前後。幅を均等に割って、右端で板が途中で切れないようにする
  const inner = w - 2;
  const panels = Math.max(1, Math.round(inner / 14));
  const starts = Array.from({ length: panels + 1 }, (_, i) => Math.round((i * inner) / panels));
  for (let y = 0; y < bodyH; y++) {
    const r = row("K", "D").split("");
    for (let x = 1; x < w - 1; x++) {
      const k = starts.findIndex((s) => s > x - 1) - 1;
      const col = x - 1 - starts[k];
      const pw = starts[k + 1] - starts[k];
      if (col === 0) r[x] = "d"; // 板の継ぎ目
      // 面取り：内側の枠の左上を暗く、右下を明るく
      if (bodyH >= 6 && y >= 1 && y <= bodyH - 2 && col >= 2 && col <= pw - 2) {
        if (y === 1 || col === 2) r[x] = "d";
        else if (y === bodyH - 2 || col === pw - 2) r[x] = "L";
      }
    }
    rows.push(r.join(""));
  }
  rows.push(row("K", "d"), row("K", "K"));
  return rows;
}

// 床（幅はドット数）。wood＝板張りの店内、grass＝草原（上の2行は地面より上に伸びる草の先）
function buildFloor(w: number, variant: "wood" | "grass"): Rows {
  const line = (f: (x: number) => string) => Array.from({ length: w }, (_, x) => f(x)).join("");
  if (variant === "grass") {
    return [
      line((x) => (x % 7 === 2 || x % 11 === 5 ? "l" : ".")),
      line((x) => ((x % 7 >= 1 && x % 7 <= 3) || x % 11 === 5 || x % 11 === 6 || x % 5 === 0 ? "N" : ".")),
      line((x) => (x % 9 === 4 ? "l" : "N")),
      line((x) => (x % 4 === 0 ? "n" : "N")),
      line((x) => (x % 3 === 1 ? "n" : x % 5 === 2 ? "N" : "n")),
      line((x) => (x % 6 === 2 ? "d" : "D")),
      line((x) => (x % 13 === 6 ? "L" : x % 5 === 1 ? "d" : "D")),
      line((x) => (x % 9 === 3 ? "D" : "d")),
    ];
  }
  // 板張り：板は3行分の高さで、継ぎ目の位置を段ごとにずらす
  const plank = (y: number, offset: number) =>
    line((x) => ((x + offset) % 24 === 0 ? "d" : y === 0 ? "L" : "D"));
  return [
    "K".repeat(w),
    plank(0, 0),
    plank(1, 0),
    plank(2, 0),
    "d".repeat(w),
    plank(1, 12),
    plank(2, 12),
    plank(2, 12),
  ];
}

// 開いた宝箱（32×26ドット）：ふたは奥へ倒れて内側の面が見え、箱の中には金貨が山盛り。
// 金貨の山のすそは箱の手前の縁に隠れる。金の帯と錠前つき
const CHEST: Rows = [
  "................................",
  "....KKKKKKKKKKKKKKKKKKKKKKKK....",
  "...KDDgDDDDDDDDDDDDDDDDDDgDK....",
  "...KDdgddddddddddddddddddgdDK...",
  "...KagaaaaaaaaaaaaaaaaaaaagaK...",
  "..KDdgddddddddddddddddddddgdK...",
  "..KDdgddddddddggggddddddddgdDK..",
  "..KagaaaaaaaKgYYGGgKggggaaagaK..",
  ".KDdgdddggggYYggggYgYYGGgggggK..",
  ".VVVgKKgYYGggggGGggggggggYYGGgV.",
  ".VVVYYgggggYYGGggYYGGgGgggggggV.",
  ".VVgggYYGGgggggggggggggYYgYYGGg.",
  "KKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKK",
  "KGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGK",
  "KggggggggggggggggggggggggggggggK",
  "KLDDGgDDDDDDDKKKKKKDDDDDDDGgDddK",
  "KLDDGgDDDDDDDKGYYGKDDDDDDDGgDddK",
  "KLDDGgDDDDDDDKGKKgKDDDDDDDGgDddK",
  "KLDDGgDDDDDDDKGKKgKDDDDDDDGgDddK",
  "KLDDGgDDDDDDDKggggKDDDDDDDGgDddK",
  "KdddGgdddddddKKKKKKdddddddGgdddK",
  "KLDDGgDDDDDDDDDDDDDDDDDDDDGgDddK",
  "KLDDGgDDDDDDDDDDDDDDDDDDDDGgDddK",
  "KdddGgddddddddddddddddddddGgdddK",
  "KdddGgddddddddddddddddddddGgdddK",
  "KKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKK",
];

// 立て札（44×32ドット）：鋲を打った木の板と支柱。文字はSVGのtextで重ねる
function buildSignpost(): Rows {
  const w = 44;
  const h = 32;
  const boardH = 16;
  const postL = 18;
  const g = Array.from({ length: h }, () => Array<string>(w).fill("."));
  for (let y = 0; y < boardH; y++) {
    for (let x = 0; x < w; x++) {
      const edge = y === 0 || y === boardH - 1 || x === 0 || x === w - 1;
      // 木目：ところどころに横の筋
      const grain = (y === 5 && x % 13 > 4) || (y === 10 && x % 11 < 6);
      g[y][x] = edge ? "K" : y >= boardH - 3 ? "d" : grain ? "D" : "L";
    }
  }
  for (const [x, y] of [[2, 2], [w - 3, 2], [2, boardH - 5], [w - 3, boardH - 5]]) g[y][x] = "M";
  for (let y = boardH; y < h; y++) {
    ["K", "L", "D", "D", "D", "d", "d", "K"].forEach((c, i) => {
      g[y][postL + i] = y === h - 1 ? "K" : c;
    });
  }
  return g.map((r) => r.join(""));
}
const SIGNPOST = buildSignpost();

// ---- 公開コンポーネント ----
// px はどれも「基準の大きさ」。実際の1ドットは px / DETAIL

type Pos = { x: number; y: number; px?: number };

// 冒険者（(x, y)＝足元の中心）。ときどきまばたきする
export function Adventurer({ x, y, px = 5 }: Pos) {
  const dot = px / DETAIL;
  return (
    <Sprite
      frames={ADVENTURER}
      x={x - ADVENTURER_CENTER * dot}
      y={y - ADVENTURER_H * dot}
      px={dot}
      period={3.2}
      timing="blink"
    />
  );
}

// 店主（(x, y)＝カウンター上面の中心）。カウンターより先に描くと下半身が隠れる
export function Shopkeeper({ x, y, px = 5 }: Pos) {
  const dot = px / DETAIL;
  return (
    <Sprite
      frames={SHOPKEEPER}
      x={x - SHOPKEEPER_CENTER * dot}
      y={y - (SHOPKEEPER_BASE.length - SHOPKEEPER_HIDDEN_ROWS) * dot}
      px={dot}
      period={1.4}
    />
  );
}

// カウンター（(x, y)＝上面の中心。width/height は描画サイズ）
export function Counter({ x, y, width = 160, height = 56, px = 5 }: { x: number; y: number; width?: number; height?: number; px?: number }) {
  const dot = px / DETAIL;
  const w = Math.round(width / dot);
  const h = Math.round(height / dot);
  return <Sprite frames={[buildCounter(w, h)]} x={x - (w * dot) / 2} y={y} px={dot} />;
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
  const dot = px / DETAIL;
  // 草原は上の2行が草の先（地面より上）なので、その分だけ上にずらす
  const top = variant === "grass" ? y - 2 * dot : y;
  return <Sprite frames={[buildFloor(Math.round(width / dot), variant)]} x={x} y={top} px={dot} />;
}

// 開いた宝箱（(x, y)＝左下）
export function Chest({ x, y, px = 4 }: Pos) {
  const dot = px / DETAIL;
  return <Sprite frames={[CHEST]} x={x} y={y - CHEST.length * dot} px={dot} />;
}

// 立て札（(x, y)＝支柱の足元の中心）。label は板に書く文字
export function Signpost({ x, y, px = 3, label }: Pos & { label: string }) {
  const dot = px / DETAIL;
  const left = x - (SIGNPOST[0].length / 2) * dot;
  const top = y - SIGNPOST.length * dot;
  return (
    <g>
      <Sprite frames={[SIGNPOST]} x={left} y={top} px={dot} />
      <text x={x} y={top + 9.2 * dot} textAnchor="middle" fontSize={11} fontWeight="bold" fill={PALETTE.K} className="font-serif">
        {label}
      </text>
    </g>
  );
}

// 小物（(x, y)＝中心）
export function Item({ x, y, kind, px = 3 }: Pos & { kind: keyof typeof ITEMS }) {
  const dot = px / DETAIL;
  const rows = ITEMS[kind];
  return <Sprite frames={[rows]} x={x - (rows[0].length * dot) / 2} y={y - (rows.length * dot) / 2} px={dot} />;
}

// ポーションの小瓶（(x, y)＝瓶の中心）
export function Potion({ x, y, tone = "gold", px = 3 }: { x: number; y: number; tone?: keyof typeof POTIONS; px?: number }) {
  const dot = px / DETAIL;
  return <Sprite frames={[POTIONS[tone]]} x={x - (POTION_W / 2) * dot} y={y - (POTION_H / 2) * dot} px={dot} />;
}

// 商品棚（(x, y)＝左上）
export function Shelf({ x, y }: { x: number; y: number }) {
  return <Sprite frames={[SHELF]} x={x} y={y} px={SHELF_DOT} />;
}
