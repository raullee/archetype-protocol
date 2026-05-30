import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["'Outfit'", "var(--font-outfit)", "sans-serif"],
      },
      colors: {
        background: "#F0F0F0",
        foreground: "#121212",
        "primary-red": "#D02020",
        "primary-blue": "#1040C0",
        "primary-yellow": "#F0C020",
        border: "#121212",
        muted: "#E0E0E0",
        "muted-foreground": "#555555",
      },
      borderRadius: {
        "none": "0px",
        "full": "9999px",
      },
      boxShadow: {
        "hard-sm": "4px 4px 0px 0px #121212",
        "hard-lg": "8px 8px 0px 0px #121212",
        "hard-red": "4px 4px 0px 0px #D02020",
        "hard-blue": "4px 4px 0px 0px #1040C0",
        "hard-yellow": "4px 4px 0px 0px #F0C020",
      },
    },
  },
  plugins: [],
};
export default config;
