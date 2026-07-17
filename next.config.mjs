/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Ảnh /uploads đã được sharp nén WebP + resize <=1600px NGAY lúc upload
    // (lib/upload-server.ts) nên nhẹ sẵn (~2-25KB), và được nginx phục vụ tĩnh
    // trực tiếp tại /uploads/... Vì vậy TẮT bộ tối ưu của next/image:
    //  - Bộ tối ưu Next (/_next/image) không phục vụ được file thêm vào public
    //    lúc chạy trên VPS -> đang 404. Tắt đi thì <Image> xuất thẳng src /uploads
    //    -> trình duyệt lấy file .webp nhẹ trực tiếp từ nginx = nhanh nhất.
    unoptimized: true,
  },
};

export default nextConfig;
