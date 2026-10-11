import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        void: "#03040a",
        obsidian: "#05070f",
        midnight: "#0a1024",
        cyanic: "#4de8ff",
        ultra: "#7a5cff",
        amberglow: "#ffb454",
        warmwhite: "#f2ede4",
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      letterSpacing: {
        widest2: "0.35em",
      },
    },
  },
  plugins: [],
};
export default config;
