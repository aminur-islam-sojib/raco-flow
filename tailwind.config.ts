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
        midnight: "#020617",
        cyanAccent: "#22d3ee",
        violetAccent: "#8b5cf6",
      },
      backgroundImage: {
        "grid-pattern": "url('/grid.svg')",
        "radial-glow":
          "radial-gradient(circle at center, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
  // Enable dark mode based on .dark class in HTML element
  darkMode: "class",
};

export default config;
// tailwind.config.ts extension
// tailwind.config.ts

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ["app/**/*.{ts,tsx}", "components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#22d3ee", // Electric Cyan
          foreground: "#020617",
        },
        secondary: {
          DEFAULT: "#8b5cf6", // Violet
          foreground: "hsl(var(--secondary-foreground))",
        },
      },
      borderRadius: {
        lg: `var(--radius)`,
        md: `calc(var(--radius) - 2px)`,
        sm: `calc(var(--radius) - 4px)`,
      },
    },
  },
};
