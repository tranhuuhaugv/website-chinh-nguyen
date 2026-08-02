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
  async redirects() {
    return [
      // Rút gọn URL: bỏ tiền tố /san-pham/ và /danh-muc/ (giữ SEO qua 301).
      // Chỉ khớp khi CÓ slug phía sau -> /san-pham (trang danh sách) không bị đụng.
      { source: "/san-pham/:slug", destination: "/:slug", permanent: true },
      { source: "/danh-muc/:slug", destination: "/:slug", permanent: true },
    ];
  },
};

export default nextConfig;
