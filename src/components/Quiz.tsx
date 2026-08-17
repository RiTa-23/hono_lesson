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
    <div className="my-6 rounded-lg border bg-card p-4">
      <p className="font-medium">Q. {question}</p>
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
                  "w-full rounded-md border px-3 py-2 text-left text-sm transition",
                  !answered && "hover:bg-secondary/60",
                  answered && isAnswer && "border-emerald-500 bg-emerald-500/10",
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
            "mt-3 flex items-start gap-2 rounded-md p-3 text-sm",
            correct
              ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
              : "bg-destructive/10 text-destructive"
          )}
        >
          {correct ? (
            <CheckCircle2 size={16} className="mt-0.5 shrink-0" />
          ) : (
            <XCircle size={16} className="mt-0.5 shrink-0" />
          )}
          <span>
            {correct ? "正解！" : "不正解…"}
            {explanation && <span className="mt-1 block">{explanation}</span>}
          </span>
        </div>
      )}
    </div>
  );
}
