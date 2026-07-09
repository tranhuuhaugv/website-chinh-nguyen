/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Ảnh sản phẩm sẽ lưu trên Cloudinary (theo CLAUDE.md). Khai báo sẵn remotePattern
    // để dùng next/image với ảnh thật khi có, đồng thời trả đúng kích thước hiển thị.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
