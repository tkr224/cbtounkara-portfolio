import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#1d1d1f",
        mute: "#6e6e73",
        cloud: "#f5f5f7",
        hair: "#d2d2d7",
        blue: { DEFAULT: "#0071e3", hover: "#0077ed" },
        // Bleu des liens texte sur fonds teintés (contraste AA).
        link: "#0066cc",
        teal: "#34c7bd",
      },
      fontFamily: {
        sans: ["var(--font-figtree)", "system-ui", "-apple-system", "sans-serif"],
      },
      maxWidth: {
        site: "1180px",
      },
      borderRadius: {
        card: "32px",
      },
      letterSpacing: {
        display: "-0.04em",
      },
      fontSize: {
        hero: ["clamp(2.875rem, 9vw, 6.5rem)", { lineHeight: "1", letterSpacing: "-0.04em" }],
        title: ["clamp(2.5rem, 6vw, 4rem)", { lineHeight: "1.05", letterSpacing: "-0.04em" }],
        lead: ["clamp(1.1875rem, 2.2vw, 1.5rem)", { lineHeight: "1.4", letterSpacing: "-0.01em" }],
      },
      transitionTimingFunction: {
        apple: "cubic-bezier(.76,0,.24,1)",
        out: "cubic-bezier(.16,1,.3,1)",
      },
    },
  },
  plugins: [],
};
export default config;
