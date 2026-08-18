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
    <div className="my-4 overflow-hidden rounded-sm border border-gold/40 bg-[#2b2118] text-[#f0e6d2]">
      <div className="flex items-center justify-between border-b border-gold/25 px-4 py-2">
        <span className="font-serif text-xs font-bold tracking-wider text-gold">
          {title ?? lang ?? "コード"}
        </span>
        <button
          type="button"
          onClick={onCopy}
          className="inline-flex items-center gap-1 rounded-sm px-2 py-1 text-xs text-[#f0e6d2]/70 transition hover:bg-white/10"
          aria-label="コードをコピー"
        >
          {copied ? (
            <>
              <Check size={13} className="text-gold" />
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
