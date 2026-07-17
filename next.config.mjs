/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Ảnh tự host trên VPS (/uploads). Ảnh đã được nén sang WebP ngay lúc upload
    // (lib/upload-server.ts) nên nhẹ sẵn; next/image chỉ cắt đúng cỡ hiển thị.
    formats: ["image/webp"],
    // Giữ ảnh đã tối ưu trong cache đĩa 30 ngày -> không nén lại mỗi request.
    // VPS dư ~32GB đĩa nên thoải mái cache.
    minimumCacheTTL: 60 * 60 * 24 * 30,
    // Bớt số breakpoint để mỗi ảnh sinh ít biến thể hơn -> đỡ việc cho CPU 2 core.
    deviceSizes: [360, 640, 828, 1080, 1600],
    imageSizes: [76, 96, 240],
  },
};

export default nextConfig;
