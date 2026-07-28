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
          DEFAULT: "#0B5E2C",
          d: "#094A22",
          dd: "#063619",
          soft: "#E7F5EC",
          tint: "#F1FAF3",
        },
        sale: "#E23A34",
        amber: "#F5A623",
      },
      maxWidth: {
        wrap: "1200px",
      },
      boxShadow: {
        // Độ sâu "cao cấp" dùng chung: nghỉ nhẹ, hover nhấc + ánh xanh.
        card: "0 1px 2px rgba(16,24,20,.04), 0 6px 18px rgba(16,24,20,.06)",
        "card-hover":
          "0 10px 30px rgba(11,94,44,.16), 0 3px 8px rgba(16,24,20,.06)",
        pop: "0 12px 32px rgba(16,24,20,.14)",
        // Bóng riêng cho THẺ SẢN PHẨM: trung tính, sâu, làm thẻ nổi khỏi nền.
        product: "0 2px 6px rgba(16,24,20,.05), 0 14px 34px -12px rgba(16,24,20,.22)",
        "product-hover":
          "0 6px 12px rgba(16,24,20,.08), 0 26px 50px -14px rgba(16,24,20,.30)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "Helvetica", "Arial", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
