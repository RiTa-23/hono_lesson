import { useState } from "react";
import { RotateCcw } from "lucide-react";
import { clearAllProgress } from "@/lib/storage";
import { Button } from "@/components/ui/button";

export function ProgressReset() {
  const [confirming, setConfirming] = useState(false);

  const handleClick = () => {
    if (!confirming) {
      setConfirming(true);
      // 3秒で確認状態を解除（誤操作防止）
      window.setTimeout(() => setConfirming(false), 3000);
      return;
    }
    clearAllProgress();
    setConfirming(false);
  };

  return (
    <Button
      type="button"
      variant={confirming ? "destructive" : "outline"}
      size="sm"
      onClick={handleClick}
      className="gap-2"
    >
      <RotateCcw size={14} />
      {confirming ? "本当にリセットしますか？" : "進捗をリセット"}
    </Button>
  );
}
