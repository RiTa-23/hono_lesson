import { useState } from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  question: string;
  choices: string[];
  answerIndex: number;
  explanation?: string;
};

// 理解度チェック用の簡易クイズ（選択すると即フィードバック）
export function Quiz({ question, choices, answerIndex, explanation }: Props) {
  const [selected, setSelected] = useState<number | null>(null);
  const answered = selected !== null;
  const correct = selected === answerIndex;

  return (
    <div className="my-6 rounded-sm border border-primary bg-card p-4">
      <p className="font-medium">
        <span className="font-serif font-bold text-gold">Q. </span>
        {question}
      </p>
      <ul className="mt-3 space-y-2">
        {choices.map((choice, i) => {
          const isAnswer = i === answerIndex;
          const isSelected = i === selected;
          return (
            <li key={i}>
              <button
                type="button"
                disabled={answered}
                onClick={() => setSelected(i)}
                className={cn(
                  "w-full rounded-sm border px-3 py-2 text-left text-sm transition",
                  !answered && "hover:bg-secondary/60",
                  answered && isAnswer && "border-gold bg-gold/10",
                  answered &&
                    isSelected &&
                    !isAnswer &&
                    "border-destructive bg-destructive/10",
                  answered && !isAnswer && !isSelected && "opacity-60"
                )}
              >
                {choice}
              </button>
            </li>
          );
        })}
      </ul>
      {answered && (
        <div
          className={cn(
            "mt-3 flex items-start gap-2 rounded-sm border p-3 text-sm",
            correct
              ? "border-gold bg-gold/10 text-gold"
              : "border-destructive bg-destructive/10 text-destructive"
          )}
        >
          {correct ? (
            <CheckCircle2 size={16} className="mt-0.5 shrink-0" />
          ) : (
            <XCircle size={16} className="mt-0.5 shrink-0" />
          )}
          <span>
            <span className="font-serif font-bold">{correct ? "正解！" : "不正解…"}</span>
            {explanation && <span className="mt-1 block">{explanation}</span>}
          </span>
        </div>
      )}
    </div>
  );
}
