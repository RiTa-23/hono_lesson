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
    term: "zod",
    reading: "ゾッド",
    body: "TypeScriptと相性のよいバリデーション（検証）ライブラリ。「データはこういう形であるべき」というスキーマを定義し、実際のデータがそれに合っているか検査する。",
  },
  {
    term: "スキーマ",
    body: "データの形のルール。「itemIdは正の整数」「quantityは省略可の正の整数」のように、zodではz.object({...})で表す。",
  },
  {
    term: "safeParse",
    body: "zodでデータを検証するメソッド。成功・失敗どちらでも例外を投げず、{ success, data | error } の形で結果を返す。",
  },
  {
    term: "@hono/zod-openapi",
    body: "zodのスキーマをHonoのルート定義に直接組み込めるライブラリ。バリデーションと、OpenAPI仕様書の自動生成を同時に行える。",
  },
  {
    term: "OpenAPIHono",
    body: "@hono/zod-openapiが提供するHonoの拡張版。app.get/app.postなど通常のHonoの書き方に加え、app.openapi()が使えるようになる。",
  },
  {
    term: "createRoute",
    body: "「このエンドポイントはこういうリクエストを受け取り、こういうレスポンスを返す」という定義をまとめて作る関数。app.openapi()に渡して使う。",
  },
  {
    term: "c.req.valid('json')",
    body: "createRouteで定義したスキーマの検証を通過した後のリクエストボディを、型付きで安全に取り出すためのメソッド。",
  },
  {
    term: "OpenAPI",
    body: "APIの仕様（どんなエンドポイントが、何を受け取り、何を返すか）を記述するための標準フォーマット。createRouteの情報から自動生成される。",
  },
  {
    term: "Swagger UI",
    body: "OpenAPI仕様のJSONを、人が読みやすい形でブラウザに表示し、実際にリクエストを試せるようにするツール。@hono/swagger-uiで導入した。",
  },
  {
    term: "/doc",
    body: "app.doc()で作成した、OpenAPI仕様（JSON）を返すエンドポイント。Swagger UI（/ui）はこのJSONを読み込んで画面を組み立てている。",
  },
  {
    term: "hono/testing",
    body: "Honoアプリを直接テストするためのモジュール。testClientを提供し、開発サーバーを起動しなくてもAPIの動作を確認できる。",
  },
  {
    term: "testClient",
    body: "Honoアプリを渡すと、型付きでエンドポイントを呼び出せるテスト用クライアントを作ってくれる関数。createRouteの型情報がそのまま活きる。",
  },
  {
    term: "bun:test",
    body: "Bunに内蔵されたテストランナー。describe・it・expectといった基本的なテストの書き方が追加インストールなしで使える。",
  },
];

export function Glossary2() {
  return (
    <div>
      <Badge variant="secondary" className="mb-4">
        サブクエスト
      </Badge>
      <PageHeader
        title="用語集（第2回）"
        goal="第2回で出てきた用語を振り返って復習しよう"
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
      <ProgressCheck id="extra-glossary-2" label="第2回の用語集にひととおり目を通した" />
      <NextLink current="/extra/glossary-2" />
    </div>
  );
}
