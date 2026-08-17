import { useState } from "react";
import { Moon, Sun } from "lucide-react";
import { getEffectiveTheme, toggleTheme } from "@/lib/theme";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const [theme, setThemeState] = useState(() => getEffectiveTheme());

  const onClick = () => {
    setThemeState(toggleTheme());
  };

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      onClick={onClick}
      aria-label={theme === "dark" ? "ライトモードに切り替え" : "ダークモードに切り替え"}
      title={theme === "dark" ? "ライトモードに切り替え" : "ダークモードに切り替え"}
    >
      {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
    </Button>
  );
}
