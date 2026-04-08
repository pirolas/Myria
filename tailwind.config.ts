import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "var(--color-background)",
        ink: "var(--color-ink)",
        muted: "var(--color-muted)",
        line: "var(--color-line)",
        surface: "var(--color-surface)",
        "surface-strong": "var(--color-surface-strong)",
        accent: "var(--color-accent)",
        "accent-soft": "var(--color-accent-soft)",
        "accent-deep": "var(--color-accent-deep)",
        success: "var(--color-success)"
      },
      fontFamily: {
        sans: ["Manrope", "ui-sans-serif", "system-ui", "sans-serif"],
        serif: ["Fraunces", "Georgia", "serif"]
      },
      boxShadow: {
        soft: "0 24px 60px rgba(94, 76, 67, 0.12)",
        lift: "0 14px 34px rgba(125, 94, 75, 0.16)"
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translate3d(0, 0, 0)" },
          "50%": { transform: "translate3d(0, -8px, 0)" }
        },
        rise: {
          "0%": { opacity: "0", transform: "translate3d(0, 16px, 0)" },
          "100%": { opacity: "1", transform: "translate3d(0, 0, 0)" }
        },
        pulseSoft: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: ".72" }
        }
      },
      animation: {
        float: "float 7s ease-in-out infinite",
        rise: "rise .6s ease-out both",
        "pulse-soft": "pulseSoft 2.8s ease-in-out infinite"
      }
    }
  },
  plugins: []
} satisfies Config;
