import type { Config } from "tailwindcss";

// Bảng màu lấy từ design/trang-chu-demo.html (tone xanh lá, phong cách TopZone)
const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#F3F5F2",
        ink: {
          DEFAULT: "#17201A",
          2: "#5A6560",
        },
        muted: "#8B948E",
        line: "#E4E8E3",
        green: {
          DEFAULT: "#159A48",
          d: "#0F7C39",
          dd: "#0B5E2C",
          soft: "#E7F5EC",
          tint: "#F1FAF3",
        },
        sale: "#E23A34",
        amber: "#F5A623",
      },
      maxWidth: {
        wrap: "1200px",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "Helvetica", "Arial", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
