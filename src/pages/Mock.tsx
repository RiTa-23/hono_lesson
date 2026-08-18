// =============================================================================
// 【一時的なテーマ比較モックページ】※破棄予定
// UI案A〜Dを実際の見た目で比較するためのページ。テーマ確定後に削除する。
// 各モックはアプリのCSS変数に依存しないよう色を直書きしている。
// =============================================================================

const SAMPLE_CHAPTER = "4";
const SAMPLE_TITLE = "最初のAPI：商品一覧";
const SAMPLE_GOAL =
  "GET /api/items で、よろず屋の商品一覧をJSONで返せるようになっている";
const SAMPLE_QUEST =
  "勇者「ポーションを3本ください」店主「はいよ、150ゴールドね」——実はこれがそのままAPIの姿です。";
const SAMPLE_STEP = "1. 商品データを用意する";
const SAMPLE_CODE = `app.get('/api/items', (c) => {
  return c.json(items)
})`;
const SAMPLE_CHECK = "GET /api/items で商品一覧のJSONを返せた";
const SAMPLE_HP = 62;

function Stamp({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex shrink-0 -rotate-[8deg] animate-stamp-in items-center rounded border-2 border-[#b3402a] bg-[#b3402a] px-3 py-1.5 font-serif text-xs font-bold tracking-widest text-white outline outline-1 -outline-offset-4 outline-white/90 shadow-sm ${className}`}
    >
      クエスト達成
    </span>
  );
}

export function Mock() {
  return (
    <div className="space-y-16 pb-24">
      <header className="rounded-lg border-2 border-dashed p-6">
        <h1 className="text-2xl font-bold">UIテーマ比較モック（一時ページ）</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          同じサンプル内容を4テーマで並べています。判子スタンプ・HPバーは全案で維持。
          判子はクリックで付き外しできます（モック内では保存されません）。
        </p>
        <nav className="mt-3 flex flex-wrap gap-2 text-sm">
          <a href="#/mock" className="text-primary underline-offset-4 hover:underline">
            ※アンカーは効かないので下にスクロールしてください（A→B→C→Dの順）
          </a>
        </nav>
      </header>

      <MockA />
      <MockB />
      <MockC />
      <MockD />
    </div>
  );
}

// =============================================================================
// 案A：ゲーム攻略本風（2色印刷: 紙白 × インク紺 × 赤）
// =============================================================================
function MockA() {
  return (
    <section className="overflow-hidden rounded-lg border">
      <div className="bg-[#1e2a52] px-4 py-2 font-bold text-white">
        案A：ゲーム攻略本風（2色印刷） — 紙白 × インク紺 × 赤 / フォント変更なし / 影なし
      </div>
      <div className="bg-white p-6 text-[#1e2a52] sm:p-10">
        {/* 柱（_running header_） */}
        <div className="border-t-[3px] border-double border-t-[#1e2a52] pb-1 pt-2">
          <div className="flex justify-between text-[0.7rem] font-bold tracking-widest">
            <span>第1回 よろず屋API講座</span>
            <span>CHAPTER 04</span>
          </div>
        </div>

        {/* 章見出し */}
        <div className="mt-6 flex items-end gap-4">
          <span className="text-6xl font-bold leading-none text-[#c1272d]">
            {SAMPLE_CHAPTER}
          </span>
          <div className="pb-1">
            <h2 className="text-2xl font-bold">{SAMPLE_TITLE}</h2>
            <p className="mt-1 text-xs text-[#1e2a52]/70">所要時間の目安：約15分</p>
          </div>
        </div>

        {/* ゴール: 上下罫線のみの組み */}
        <div className="mt-4 border-y-2 border-[#1e2a52] py-3">
          <p className="text-sm leading-relaxed">
            <span className="mr-2 font-bold text-[#c1272d]">▶ ゴール</span>
            {SAMPLE_GOAL}
          </p>
        </div>

        {/* ストーリー: 赤縦罫 */}
        <aside className="mt-6 border-l-4 border-[#c1272d] pl-4">
          <p className="text-xs font-bold tracking-widest text-[#c1272d]">
            ■ ストーリー
          </p>
          <p className="mt-1 text-sm leading-relaxed">{SAMPLE_QUEST}</p>
        </aside>

        {/* 手順 */}
        <h3 className="mt-8 border-b border-dashed border-[#1e2a52]/60 pb-1 text-lg font-bold">
          {SAMPLE_STEP}
        </h3>
        <div className="mt-3 bg-[#1e2a52] p-4 text-sm leading-relaxed text-white">
          <div className="mb-2 border-b border-white/30 pb-1 text-[0.7rem] font-bold tracking-widest text-[#f8b800]">
            backend/src/index.ts
          </div>
          <pre className="overflow-x-auto font-mono">
            <code>{SAMPLE_CODE}</code>
          </pre>
        </div>

        {/* 進捗チェック */}
        <div className="mt-6 flex items-center gap-3 border-2 border-[#1e2a52] bg-white px-4 py-3">
          <span className="inline-flex h-6 w-6 items-center justify-center border-2 border-[#1e2a52] bg-[#1e2a52] text-xs font-bold text-white">
            ✓
          </span>
          <span className="flex-1 text-sm">{SAMPLE_CHECK}</span>
          <Stamp />
        </div>

        {/* HPバー（赤）＋ 次へ */}
        <div className="mt-6">
          <div className="flex justify-between text-[0.7rem] font-bold">
            <span>第1回の進捗</span>
            <span>5/8（{SAMPLE_HP}%）</span>
          </div>
          <div className="mt-1 h-3 border-2 border-[#1e2a52] bg-white">
            <div
              className="h-full bg-[#c1272d]"
              style={{ width: `${SAMPLE_HP}%` }}
            />
          </div>
          <button className="mt-4 bg-[#1e2a52] px-6 py-2.5 text-sm font-bold text-white">
            次のステップへ →
          </button>
        </div>

        {/* 下の柱 */}
        <div className="mt-8 border-t-2 border-[#1e2a52] pt-1 text-center text-[0.7rem] font-bold tracking-widest text-[#1e2a52]/70">
          よろず屋API講座 — 04
        </div>
      </div>
    </section>
  );
}

// =============================================================================
// 案B：コマンドウィンドウ線画版（白地に紺の二重枠窓＋金タブ／ダーク＝ゲーム画面）
// =============================================================================
function DoubleFrame({
  children,
  className = "",
  dark = false,
}: {
  children: React.ReactNode;
  className?: string;
  dark?: boolean;
}) {
  const line = dark ? "#f5f5f0" : "#1e2a52";
  return (
    <div className={`border-2 p-[3px] ${className}`} style={{ borderColor: line }}>
      <div className="border-2 h-full" style={{ borderColor: line }}>
        {children}
      </div>
    </div>
  );
}

function Window({
  tab,
  children,
  className = "",
  dark = false,
  tabClassName = "",
}: {
  tab?: string;
  children: React.ReactNode;
  className?: string;
  dark?: boolean;
  tabClassName?: string;
}) {
  return (
    <div className={`relative ${className}`}>
      {tab && (
        <span
          className={`absolute -top-3 left-4 z-10 px-2 py-0.5 text-[0.7rem] font-bold tracking-widest ${tabClassName}`}
          style={
            dark
              ? { background: "#0d0e1b", color: "#f8b800", border: "2px solid #f5f5f0" }
              : { background: "#f8b800", color: "#1e2a52", border: "2px solid #1e2a52" }
          }
        >
          {tab}
        </span>
      )}
      <DoubleFrame dark={dark}>{children}</DoubleFrame>
    </div>
  );
}

function MockB() {
  return (
    <section className="overflow-hidden rounded-lg border">
      <div className="bg-[#1e2a52] px-4 py-2 font-bold text-white">
        案B：コマンドウィンドウ線画版 — 紙面に紺の二重枠「窓」／ダークはゲーム画面
      </div>
      <div className="bg-[#f6f7fb] p-6 text-[#1e2a52] sm:p-10">
        {/* 章見出し（窓） */}
        <Window tab="QUEST 04" className="mt-4">
          <div className="bg-white px-5 py-4">
            <h2 className="text-2xl font-bold">{SAMPLE_TITLE}</h2>
            <p className="mt-1 text-xs text-[#1e2a52]/70">所要時間の目安：約15分</p>
            <div className="mt-3 h-[2px] w-16 bg-[#f8b800]" />
            <p className="mt-3 text-sm leading-relaxed">
              <span className="font-bold text-[#1e2a52]">ゴール：</span>
              {SAMPLE_GOAL}
            </p>
          </div>
        </Window>

        {/* ストーリー（ここだけゲーム画面＝深紺） */}
        <Window tab="ストーリー" className="mt-8" dark>
          <div className="bg-[#0d0e1b] px-5 py-4 text-[#f5f5f0]">
            <p className="text-sm leading-relaxed">{SAMPLE_QUEST}</p>
          </div>
        </Window>

        {/* 手順＋コード */}
        <h3 className="mt-8 text-lg font-bold">{SAMPLE_STEP}</h3>
        <div className="mt-3">
          <DoubleFrame>
            <div className="bg-[#0d0e1b] p-4 text-sm leading-relaxed text-[#f5f5f0]">
              <div className="mb-2 text-[0.7rem] font-bold tracking-widest text-[#f8b800]">
                backend/src/index.ts
              </div>
              <pre className="overflow-x-auto font-mono">
                <code>{SAMPLE_CODE}</code>
              </pre>
            </div>
          </DoubleFrame>
        </div>

        {/* 進捗チェック */}
        <Window className="mt-8">
          <div className="flex items-center gap-3 bg-white px-4 py-3">
            <span className="inline-flex h-6 w-6 items-center justify-center border-2 border-[#1e2a52] bg-[#1e2a52] text-xs font-bold text-white">
              ✓
            </span>
            <span className="flex-1 text-sm">{SAMPLE_CHECK}</span>
            <Stamp />
          </div>
        </Window>

        {/* HPバー（金）＋次へ */}
        <div className="mt-8">
          <div className="flex justify-between text-[0.7rem] font-bold tracking-widest">
            <span>第1回の進捗</span>
            <span>5/8</span>
          </div>
          <div className="mt-1 h-3 border-2 border-[#1e2a52] bg-white">
            <div className="h-full bg-[#f8b800]" style={{ width: `${SAMPLE_HP}%` }} />
          </div>
          <button className="mt-4 border-2 border-[#1e2a52] bg-[#1e2a52] px-6 py-2.5 text-sm font-bold text-white">
            ▶ 次のステップへ
          </button>
        </div>
      </div>

      {/* ダークモード見本（ゲーム画面） */}
      <div className="border-t-4 border-[#f8b800] bg-[#0d0e1b] p-6 sm:p-10">
        <p className="mb-4 text-[0.7rem] font-bold tracking-widest text-[#f8b800]">
          ダークモード見本（ゲーム画面）
        </p>
        <Window tab="QUEST 04" dark className="max-w-2xl">
          <div className="bg-[#0d0e1b] px-5 py-4 text-[#f5f5f0]">
            <h2 className="text-2xl font-bold text-white">{SAMPLE_TITLE}</h2>
            <div className="mt-3 h-[2px] w-16 bg-[#f8b800]" />
            <p className="mt-3 text-sm leading-relaxed text-[#f5f5f0]/90">
              <span className="font-bold text-[#f8b800]">ゴール：</span>
              {SAMPLE_GOAL}
            </p>
          </div>
        </Window>
        <div className="mt-6 max-w-2xl">
          <div className="h-3 border-2 border-[#f5f5f0] bg-[#0d0e1b]">
            <div className="h-full bg-[#f8b800]" style={{ width: `${SAMPLE_HP}%` }} />
          </div>
        </div>
      </div>
    </section>
  );
}

// =============================================================================
// 案C：ファミコン4色ドット絵（白 × 紺 × 赤 × 黄／ドットグリッド背景）
// =============================================================================
function CornerBox({ className = "" }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`pointer-events-none absolute h-2 w-2 border-2 border-[#1e2a52] ${className}`}
    />
  );
}

function MockC() {
  return (
    <section className="overflow-hidden rounded-lg border">
      <div className="bg-[#1e2a52] px-4 py-2 font-bold text-white">
        案C：ファミコン4色ドット — 白 × 紺 × 赤 × 黄 / ドットグリッド背景 / 角に_squareマーカー
      </div>
      <div
        className="p-6 text-[#1e2a52] sm:p-10"
        style={{
          backgroundColor: "#fcfcfc",
          backgroundImage:
            "radial-gradient(circle, rgba(30,42,82,0.10) 1px, transparent 1px)",
          backgroundSize: "12px 12px",
        }}
      >
        {/* 章見出し: 角マーカーの枠 */}
        <div className="relative border-2 border-[#1e2a52] bg-[#fcfcfc] p-5">
          <CornerBox className="-left-[3px] -top-[3px] border-b-0 border-r-0 bg-[#1e2a52]" />
          <CornerBox className="-right-[3px] -top-[3px] border-b-0 border-l-0 bg-[#1e2a52]" />
          <CornerBox className="-bottom-[3px] -left-[3px] border-r-0 border-t-0 bg-[#1e2a52]" />
          <CornerBox className="-bottom-[3px] -right-[3px] border-l-0 border-t-0 bg-[#1e2a52]" />
          <p className="inline-block bg-[#1e2a52] px-2 py-0.5 font-mono text-[0.7rem] font-bold tracking-widest text-[#f8b800]">
            QUEST 04
          </p>
          <h2 className="mt-2 flex items-center gap-2 text-2xl font-bold">
            <span className="inline-block h-3 w-3 bg-[#d02f2f]" />
            {SAMPLE_TITLE}
          </h2>
          <p className="mt-1 pl-5 text-xs text-[#1e2a52]/70">所要時間の目安：約15分</p>
          <p className="mt-3 border-t-2 border-dashed border-[#1e2a52]/50 pt-3 pl-5 text-sm leading-relaxed">
            <span className="font-mono font-bold text-[#d02f2f]">GOAL{'>'}</span>{" "}
            {SAMPLE_GOAL}
          </p>
        </div>

        {/* ストーリー */}
        <div className="mt-6 border-l-8 border-[#d02f2f] bg-[#fcfcfc] px-4 py-3 shadow-[4px_4px_0_0_#1e2a52]">
          <p className="font-mono text-[0.7rem] font-bold tracking-widest text-[#d02f2f]">
            STORY
          </p>
          <p className="mt-1 text-sm leading-relaxed">{SAMPLE_QUEST}</p>
        </div>

        {/* 手順＋コード */}
        <h3 className="mt-8 flex items-center gap-2 text-lg font-bold">
          <span className="inline-block h-2.5 w-2.5 bg-[#1e2a52]" />
          {SAMPLE_STEP}
        </h3>
        <div className="mt-3 border-2 border-[#1e2a52] bg-[#1e2a52] shadow-[4px_4px_0_0_#d02f2f]">
          <div className="flex items-center justify-between border-b-2 border-[#f8b800] px-3 py-1">
            <span className="font-mono text-[0.7rem] font-bold tracking-widest text-[#f8b800]">
              backend/src/index.ts
            </span>
            <span className="font-mono text-[0.7rem] text-[#fcfcfc]">COPY</span>
          </div>
          <pre className="overflow-x-auto p-4 font-mono text-sm leading-relaxed text-[#fcfcfc]">
            <code>{SAMPLE_CODE}</code>
          </pre>
        </div>

        {/* 進捗チェック */}
        <div className="mt-8 flex items-center gap-3 border-2 border-[#1e2a52] bg-[#fcfcfc] px-4 py-3 shadow-[4px_4px_0_0_#1e2a52]">
          <span className="inline-flex h-6 w-6 items-center justify-center border-2 border-[#1e2a52] bg-[#1e2a52] text-xs font-bold text-[#f8b800]">
            ✓
          </span>
          <span className="flex-1 text-sm">{SAMPLE_CHECK}</span>
          <Stamp />
        </div>

        {/* HPバー（セグメント）＋次へ */}
        <div className="mt-8">
          <div className="flex justify-between font-mono text-[0.7rem] font-bold tracking-widest">
            <span>HP（第1回の進捗）</span>
            <span>5/8</span>
          </div>
          <div className="mt-1 flex gap-1">
            {Array.from({ length: 10 }).map((_, i) => (
              <span
                key={i}
                className="h-4 flex-1 border-2 border-[#1e2a52]"
                style={{ backgroundColor: i < Math.round(SAMPLE_HP / 10) ? "#f8b800" : "#fcfcfc" }}
              />
            ))}
          </div>
          <button className="mt-4 border-2 border-[#1e2a52] bg-[#1e2a52] px-6 py-2.5 font-mono text-sm font-bold tracking-widest text-[#f8b800] shadow-[4px_4px_0_0_#d02f2f]">
            NEXT ▶
          </button>
        </div>
      </div>
    </section>
  );
}

// =============================================================================
// 案D：冒険者ギルドの依頼書（生成り × 焦茶 × 金 / 装飾二重枠 / 明朝見出し）
// =============================================================================
function CornerOrnament({ className = "" }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`pointer-events-none absolute h-4 w-4 border-[#b8912f] ${className}`}
    />
  );
}

function MockD() {
  return (
    <section className="overflow-hidden rounded-lg border">
      <div className="bg-[#33261a] px-4 py-2 font-bold text-[#faf7f0]">
        案D：ギルドの依頼書 — 生成り × 焦茶 × 金 / 二重枠＋四隅の装飾 / 明朝見出し
      </div>
      <div className="bg-[#efe9dc] p-6 sm:p-10">
        {/* 依頼書本体（二重枠＋四隅装飾） */}
        <div className="relative border border-[#33261a] bg-[#faf7f0] p-2">
          <CornerOrnament className="-left-1 -top-1 border-b-2 border-l-2" />
          <CornerOrnament className="-right-1 -top-1 border-b-2 border-r-2" />
          <CornerOrnament className="-bottom-1 -left-1 border-l-2 border-t-2" />
          <CornerOrnament className="-bottom-1 -right-1 border-r-2 border-t-2" />
          <div className="border border-[#b8912f]/60 px-6 py-8 sm:px-10">
            <p className="text-center font-serif text-xs tracking-[0.5em] text-[#b8912f]">
              冒険者ギルド 公式依頼書
            </p>
            <h2 className="mt-4 text-center font-serif text-3xl font-bold text-[#33261a]">
              依頼 No.04「{SAMPLE_TITLE}」
            </h2>
            <div className="mx-auto mt-3 flex w-24 justify-center gap-1" aria-hidden="true">
              <span className="h-0.5 w-16 bg-[#b8912f]" />
              <span className="h-0.5 w-3 bg-[#b8912f]/60" />
            </div>

            {/* ゴール */}
            <div className="mt-6 border-y border-double border-y-[#b8912f] py-3">
              <p className="font-serif text-sm font-bold text-[#33261a]">【依頼内容】</p>
              <p className="mt-1 text-sm leading-relaxed text-[#33261a]">{SAMPLE_GOAL}</p>
              <p className="mt-1 text-xs text-[#33261a]/60">所要時間の目安：約15分</p>
            </div>

            {/* ストーリー */}
            <blockquote className="mt-6 border-l-4 border-[#b8912f] pl-4 font-serif italic leading-relaxed text-[#4a3826]">
              {SAMPLE_QUEST}
            </blockquote>

            {/* 手順＋コード */}
            <h3 className="mt-8 font-serif text-lg font-bold text-[#33261a]">
              {SAMPLE_STEP}
            </h3>
            <div className="mt-3 bg-[#2b2118]">
              <div className="border-b border-[#faf7f0]/20 px-3 py-1 font-serif text-xs text-[#b8912f]">
                backend/src/index.ts
              </div>
              <pre className="overflow-x-auto p-4 font-mono text-sm leading-relaxed text-[#f0e6d2]">
                <code>{SAMPLE_CODE}</code>
              </pre>
            </div>

            {/* 進捗チェック */}
            <div className="mt-8 flex items-center gap-3 border border-[#33261a]/40 bg-[#faf7f0] px-4 py-3">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full border-2 border-[#33261a] text-xs text-[#33261a]">
                ✓
              </span>
              <span className="flex-1 text-sm text-[#33261a]">{SAMPLE_CHECK}</span>
              <Stamp />
            </div>

            {/* HPバー（金）＋次へ */}
            <div className="mt-8">
              <div className="flex justify-between font-serif text-xs text-[#33261a]">
                <span>達成記録</span>
                <span>5/8（{SAMPLE_HP}%）</span>
              </div>
              <div className="mt-1 h-2.5 border border-[#33261a]/50 bg-[#efe9dc]">
                <div className="h-full bg-[#b8912f]" style={{ width: `${SAMPLE_HP}%` }} />
              </div>
              <button className="mt-4 border border-[#33261a] bg-[#33261a] px-6 py-2.5 font-serif text-sm text-[#faf7f0]">
                次の依頼へ進む
              </button>
            </div>

            <p className="mt-10 text-right font-serif text-[0.65rem] tracking-widest text-[#33261a]/50">
              ギルド長 より
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
