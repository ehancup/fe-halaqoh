import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        'poppins' : ['Poppins', 'sans-serif'],
        'montserrat' : ['Montserrat', 'sans-serif'],
        'roboto' : ['"Roboto"', 'sans-serif'],
        'quicksand' : ['"Quicksand"', 'sans-serif'],
        'handrawn' : ['"Delicious Handrawn"', 'cursive'],
      },
    },
  },
  plugins: [
    require("daisyui"),
  ],
  daisyui: {
    themes: ["light", "dark", "cupcake"],
  },
};
export default config;
