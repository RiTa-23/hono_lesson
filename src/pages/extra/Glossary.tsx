import { PageHeader } from "@/components/PageHeader";
import { NextLink } from "@/components/NextLink";
import { ProgressCheck } from "@/components/ProgressCheck";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const TERMS: { term: string; reading?: string; body: string }[] = [
  {
    term: "API",
    reading: "エーピーアイ",
    body: "プログラム同士がやりとりするための窓口。Webでは「リクエストを受けてレスポンスを返すサーバー側の仕組み」を指すことが多い。よろず屋で言えば店頭の窓口。",
  },
  {
    term: "HTTP",
    body: "ブラウザとサーバーがやりとりするときのルール（約束事）。「GET /api/items」のように、メソッドとパスでお願いを伝える。",
  },
  {
    term: "HTTPメソッド",
    body: "お願いの種類を表す合図。GET（見せて）・POST（処理して）・PUT（更新して）・DELETE（消して）など。第1回ではGETとPOSTだけ使用。",
  },
  {
    term: "エンドポイント",
    body: "「GET /api/items」のような、メソッドとパスの組み合わせ。APIが公開している窓口1つ1つのこと。",
  },
  {
    term: "リクエスト / レスポンス",
    body: "クライアントからサーバーへのお願い / サーバーからのお返事。店頭での「ポーションください」「はい150Gね」の関係。",
  },
  {
    term: "JSON",
    reading: "ジェイソン",
    body: "データをやりとりするための書き方（フォーマット）。JavaScriptのオブジェクトに似た形で、WebAPIの伝票として広く使われる。",
  },
  {
    term: "ステータスコード",
    body: "レスポンスに付く3桁の数字。結果の種類を表す。200=成功、400=お願いがおかしい、404=見つからない、500=サーバーのトラブル。",
  },
  {
    term: "オリジン",
    body: "「スキーム＋ドメイン＋ポート」の組み合わせ。http://localhost:5173 と http://localhost:3000 はポートが違うので別オリジン。",
  },
  {
    term: "CORS",
    reading: "コルス",
    body: "Cross-Origin Resource Sharing。別オリジンからの通信を、サーバー側の許可宣言によって可能にする仕組み。Honoでは hono/cors ミドルウェアで設定する。",
  },
  {
    term: "ミドルウェア",
    body: "すべてのリクエストに共通して通す「関所」のような処理。CORSの許可やログ出力などに使う。Honoでは app.use() で設定する。",
  },
  {
    term: "パスパラメータ",
    body: "URLの一部に埋め込まれた値。/api/items/3 の「3」のこと。Honoでは c.req.param('id') で受け取る（文字列として返ってくる点に注意）。",
  },
  {
    term: "クエリパラメータ",
    body: "URLの ? の後ろに付ける値。/api/items?maxPrice=100 のような絞り込みに使う。c.req.query('maxPrice') で受け取る。",
  },
  {
    term: "ボディ",
    body: "リクエストに載せるデータの本体。POSTで「何をいくつ買うか」といった中身をJSONで入れる。await c.req.json() で取り出す。",
  },
  {
    term: "フロントエンド / バックエンド",
    body: "画面（Reactなど、ユーザーが見る側）/ データと計算を担当するサーバー側。今回は frontend/ が完成済みで、backend/ を自分で作った。",
  },
  {
    term: "Bun",
    reading: "バン",
    body: "Node.jsの代替となる高速なJavaScript実行環境。パッケージ管理やテストもこれ1つでできる。料理で言えば「厨房」。",
  },
  {
    term: "Hono",
    reading: "ほの",
    body: "和田裕介さん作の国産Webフレームワーク。「炎」が名前の由来。必要な機能が全部入り（Batteries Included）で、Cloudflare WorkersでもBunでも同じコードが動く。",
  },
  {
    term: "RPC",
    body: "Honoの機能の1つ。APIの型情報をフロント側と共有して、パスの補完や型チェックが効くクライアントを作れる。サブクエストページ参照。",
  },
  {
    term: "ホットリロード",
    body: "ファイルを保存したら自動で再起動・反映される仕組み。bun run dev の --hot オプションが担当。今回のAPIは再起動でメモリ上のデータがリセットされる点に注意。",
  },
];

export function Glossary() {
  return (
    <div>
      <Badge variant="secondary" className="mb-4">
        サブクエスト
      </Badge>
      <PageHeader
        title="用語集（第1回）"
        goal="第1回で出てきた用語をいつでも引けるようにする"
      />
      <Accordion type="multiple" className="w-full">
        {TERMS.map((t) => (
          <AccordionItem key={t.term} value={t.term}>
            <AccordionTrigger>
              <span>
                {t.term}
                {t.reading && (
                  <span className="ml-2 text-xs font-normal text-muted-foreground">
                    （{t.reading}）
                  </span>
                )}
              </span>
            </AccordionTrigger>
            <AccordionContent className="leading-relaxed">{t.body}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      <ProgressCheck id="extra-glossary-1" label="第1回の用語集にひととおり目を通した" />
      <NextLink current="/extra/glossary" />
    </div>
  );
}
