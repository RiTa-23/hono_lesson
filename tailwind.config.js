/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: { "2xl": "1400px" },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        gold: "hsl(var(--gold))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        // 判子が押される演出
        "stamp-in": {
          "0%": { opacity: "0", transform: "scale(2) rotate(-18deg)" },
          "60%": { opacity: "1", transform: "scale(0.92) rotate(-8deg)" },
          "100%": { opacity: "1", transform: "scale(1) rotate(-8deg)" },
        },
        // 回クリアの達成報告書: 下からふわっと差し出される
        "report-in": {
          "0%": { opacity: "0", transform: "translateY(24px) scale(0.96)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        // 判子が押された衝撃で報告書が小さく沈む
        "report-thud": {
          "0%, 100%": { transform: "translateY(0)" },
          "35%": { transform: "translateY(4px) scale(0.99)" },
        },
        // 報酬の行が順に浮かび上がる
        "reveal-up": {
          "0%": { opacity: "0", transform: "translateY(6px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        // 紙吹雪: 中心から --tx/--ty 方向へ飛び散り、少し落ちながら消える
        confetti: {
          "0%": { opacity: "0", transform: "translate(0, 0) rotate(0deg) scale(0.4)" },
          "10%": { opacity: "1" },
          "60%": { opacity: "1", transform: "translate(var(--tx), var(--ty)) rotate(var(--rot)) scale(1)" },
          "100%": {
            opacity: "0",
            transform: "translate(var(--tx), calc(var(--ty) + 90px)) rotate(calc(var(--rot) * 2)) scale(1)",
          },
        },
        // 新しく灯ったランクの星
        "star-pop": {
          "0%": { opacity: "0", transform: "scale(0)" },
          "60%": { opacity: "1", transform: "scale(1.6)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        twinkle: {
          "0%, 100%": { opacity: "0.25", transform: "scale(0.7)" },
          "50%": { opacity: "1", transform: "scale(1.1)" },
        },
      },
      animation: {
        "stamp-in": "stamp-in 0.28s ease-out",
        "report-in": "report-in 0.4s ease-out",
        "report-thud": "report-thud 0.3s ease-out",
        "reveal-up": "reveal-up 0.35s ease-out",
        confetti: "confetti 1.6s cubic-bezier(0.15, 0.7, 0.3, 1) forwards",
        "star-pop": "star-pop 0.45s ease-out",
        twinkle: "twinkle 1.8s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
