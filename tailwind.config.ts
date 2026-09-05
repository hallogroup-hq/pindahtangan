import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        terracotta: {
          50: "#FDF4F2",
          100: "#FBE8E5",
          200: "#F7D1CB",
          300: "#EFA99C",
          400: "#DF7D66",
          500: "#C25E43", // Brand Primary Accent
          600: "#B04F36",
          700: "#943F29",
          800: "#7B3523",
          900: "#652E20",
        },
        linen: {
          50: "#FAF7F2", // Canvas Background
          100: "#F5F0E6",
          200: "#E7E2D8", // Subtle Border
          300: "#D6CEBF",
          400: "#B8ACA0",
        },
        espresso: {
          900: "#1C1917", // Primary Text Heading
          800: "#292524",
          700: "#44403C", // Body Text
          600: "#57534E",
          500: "#78716C", // Muted Text & Timestamps
          400: "#A8A29E",
          300: "#D6D3D1",
        },
        sage: {
          50: "#F4F6F3",
          100: "#E5EBE3",
          500: "#849078", // Sustainable Accent
          600: "#6E7A63",
          700: "#58634E",
        },
      },
      fontFamily: {
        sans: ["var(--font-plus-jakarta)", "sans-serif"],
        serif: ["var(--font-playfair)", "serif"],
      },
      boxShadow: {
        warm: "0 8px 30px rgba(194, 94, 67, 0.08)",
        "warm-lg": "0 14px 40px rgba(194, 94, 67, 0.12)",
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
    },
  },
  plugins: [],
};
export default config;
