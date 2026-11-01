import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          DEFAULT: "#244C3A",
          dark: "#173729",
          light: "#2F614A",
          subtle: "#EDF3EB",
        },
        sage: {
          DEFAULT: "#DCE8D8",
          dark: "#BDD1B6",
          light: "#EBF2E8",
        },
        cream: {
          DEFAULT: "#F8F5ED",
          dark: "#EFEADB",
          light: "#FCFAF6",
        },
        charcoal: {
          DEFAULT: "#252923",
          light: "#3A3F37",
        },
        mutedGray: {
          DEFAULT: "#777C75",
          light: "#9CA199",
          dark: "#555A53",
        },
        accentOrange: {
          DEFAULT: "#E99A55",
          hover: "#DC863C",
          light: "#FDF1E6",
        },
        surfaceBorder: "#E7E5DC",
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "#244C3A",
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#DCE8D8",
          foreground: "#173729",
        },
        accent: {
          DEFAULT: "#E99A55",
          foreground: "#FFFFFF",
        },
        destructive: {
          DEFAULT: "#D9383A",
          foreground: "#FFFFFF",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
        serif: ["var(--font-serif)", "Playfair Display", "Georgia", "Cambria", "serif"],
      },
      borderRadius: {
        lg: "0.75rem",
        md: "0.5rem",
        sm: "0.375rem",
      },
      boxShadow: {
        card: "0 2px 8px -2px rgba(23, 55, 41, 0.06), 0 1px 4px -1px rgba(23, 55, 41, 0.04)",
        cardHover: "0 12px 24px -8px rgba(23, 55, 41, 0.12), 0 4px 12px -2px rgba(23, 55, 41, 0.06)",
        dropdown: "0 10px 30px -5px rgba(23, 55, 41, 0.15)",
      },
    },
  },
  plugins: [],
};

export default config;

