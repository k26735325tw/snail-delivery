import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "rgb(var(--color-ink) / <alpha-value>)",
        blue: "rgb(var(--color-blue) / <alpha-value>)",
        sky: "rgb(var(--color-sky) / <alpha-value>)",
        yellow: "rgb(var(--color-yellow) / <alpha-value>)",
        cream: "rgb(var(--color-cream) / <alpha-value>)",
        line: "rgb(var(--color-line) / <alpha-value>)",
      },
      boxShadow: {
        glow: "0 30px 80px rgba(14, 67, 155, 0.18)",
      },
      backgroundImage: {
        mesh:
          "radial-gradient(circle at top left, rgba(255, 213, 52, 0.36), transparent 34%), radial-gradient(circle at 80% 10%, rgba(46, 122, 255, 0.25), transparent 30%), linear-gradient(180deg, #f8fbff 0%, #fffef6 100%)",
      },
    },
  },
  plugins: [],
};

export default config;
