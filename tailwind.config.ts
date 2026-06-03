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
        luxury: {
          black: "#0d0d0d",     // Deep rich black
          white: "#f5f5f7",     // Warm muted off-white
          // Sophisticated neutral grays
          gray: {
            200: "#d4d4d4",
            400: "#a3a3a3",
            600: "#525252",
            800: "#262626",
          },
        },
      },
      fontSize: {
        // Custom fluid typography mapping: clamp(min, preferred, max)
        "fluid-sm": "clamp(0.875rem, 0.8vw + 0.6rem, 1rem)",
        "fluid-base": "clamp(1rem, 1.2vw + 0.7rem, 1.125rem)",
        "fluid-lg": "clamp(1.125rem, 1.5vw + 0.8rem, 1.5rem)",
        "fluid-xl": "clamp(1.5rem, 2.5vw + 1rem, 2.25rem)",
        "fluid-2xl": "clamp(2rem, 4vw + 1.2rem, 3.5rem)",
        "fluid-display": "clamp(3.5rem, 7vw + 2rem, 7rem)", // Hero sections
      },
      fontFamily: {
        sans: ["var(--font-sans)", "sans-serif"],
        serif: ["var(--font-serif)", "serif"],
      },
      transitionTimingFunction: {
        'premium-ease': 'cubic-bezier(0.76, 0, 0.24, 1)', // Smooth architectural ease
      }
    },
  },
  plugins: [],
};

export default config;
