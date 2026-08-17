import { useState } from "react";
import { Check, Copy } from "lucide-react";

type Props = {
  code: string;
  lang?: string;
  title?: string;
};

export function CopyBlock({ code, lang, title }: Props) {
  const [copied, setCopied] = useState(false);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      // クリップボードAPIが使えない環境向けフォールバック
      const ta = document.createElement("textarea");
      ta.value = code;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-4 overflow-hidden rounded-lg border bg-zinc-950 text-zinc-100 dark:border-zinc-800">
      <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-2">
        <span className="text-xs text-zinc-400">
          {title ?? lang ?? "コード"}
        </span>
        <button
          type="button"
          onClick={onCopy}
          className="inline-flex items-center gap-1 rounded px-2 py-1 text-xs text-zinc-300 transition hover:bg-zinc-800"
          aria-label="コードをコピー"
        >
          {copied ? (
            <>
              <Check size={13} className="text-emerald-400" />
              コピーしました
            </>
          ) : (
            <>
              <Copy size={13} />
              コピー
            </>
          )}
        </button>
      </div>
      <pre className="p-4 text-sm leading-relaxed">
        <code>{code}</code>
      </pre>
    </div>
  );
}
