# CLAUDE.md — Website bán laptop

File này định nghĩa quy tắc và bối cảnh dự án. Đọc kỹ trước khi viết bất kỳ code nào và tuân thủ xuyên suốt.

## 1. Bối cảnh dự án

- Website thương mại điện tử bán laptop, xây riêng (không dùng CMS có sẵn).
- Mục tiêu: tối ưu SEO tối đa, giao diện hiện đại/cao cấp, tốc độ tải nhanh.
- Định hướng thiết kế: hiện đại, chuyên nghiệp, tham khảo các site công nghệ lớn (FPT Shop, Thế Giới Di Động, Điện Máy Xanh). Nền/tông trung tính + nhiều khoảng trắng làm nền tảng, kết hợp mega-menu danh mục, các khối thông tin phong phú và điểm nhấn khuyến mãi. KHÔNG bắt buộc theo phong cách tối giản TopZone; ưu tiên trông chuyên nghiệp, đầy đủ, đáng tin.
- Timeline: hoàn thành MVP trong ~1 tháng. Ưu tiên code chạy đúng, gọn, dễ mở rộng hơn là over-engineer.

## 2. Tech stack (không tự ý đổi)

- Next.js 14+ (App Router) — fullstack, dùng cả API routes.
- TypeScript.
- Prisma ORM + PostgreSQL (Neon hoặc Supabase).
- TailwindCSS + shadcn/ui.
- NextAuth.js cho xác thực.
- Cloudinary cho lưu ảnh.
- VNPay cho thanh toán.
- Deploy sau cùng lên VPS (không phải Vercel). Code phải chạy được ở môi trường Node tự host (chú ý cấu hình phù hợp).

## 3. Quy tắc tối ưu tốc độ (BẮT BUỘC, áp dụng mọi lúc)

### Ảnh
- Toàn bộ ảnh phải dùng `next/image`, TUYỆT ĐỐI không dùng thẻ `<img>` thường ở bất kỳ đâu, kể cả trong trang admin.
- Cấu hình Cloudinary trả ảnh đúng kích thước hiển thị (dùng transformation, không tải ảnh gốc full-size cho ô nhỏ).
- Ảnh ngoài màn hình đầu tiên phải lazy load (mặc định của `next/image`, không tắt `loading="lazy"`).
- Luôn khai báo `width`/`height` hoặc dùng `fill` + container có kích thước để tránh layout shift (CLS).

### Database
- Prisma Client khởi tạo dạng singleton (1 instance dùng chung toàn app), đặt trong `lib/prisma.ts`. KHÔNG tạo `new PrismaClient()` rải rác trong từng file.
- Bật connection pooling khi kết nối Neon/Supabase (dùng connection string có `?pgbouncer=true` hoặc pooled endpoint).
- Đánh index cho các cột thường lọc/sắp xếp: `price`, `categoryId`, `brandId`, `createdAt`, `slug`.
- KHÔNG query kiểu N+1. Dùng `include`/`select` của Prisma để lấy dữ liệu liên quan trong 1 lần.
- Chỉ `select` các cột thực sự cần cho từng màn hình, không lấy dư.

### Trang & cache
- Phân trang BẮT BUỘC ở mọi danh sách (trang danh mục, tìm kiếm, admin). Không bao giờ query "lấy tất cả".
- Trang chủ, trang danh mục dùng ISR (`export const revalidate = <giây>`) hoặc caching hợp lý — không query DB lại mỗi request cho dữ liệu ít đổi.
- Dữ liệu ít thay đổi (danh mục, thương hiệu) nên được cache.
- Dùng Server Components mặc định; chỉ chuyển sang Client Component (`"use client"`) khi thật sự cần tương tác (state, event handler).

### Đo lường
- Sau mỗi tính năng lớn, nhắc chạy Lighthouse (Chrome DevTools) để kiểm tra Performance/SEO.
- Mục tiêu Core Web Vitals: LCP tốt, CLS thấp, INP nhanh.

## 4. Quy tắc SEO (BẮT BUỘC)

- Mỗi trang động (sản phẩm, danh mục, bài viết) phải có `generateMetadata()` sinh title + meta description riêng, không trùng lặp.
- URL thân thiện, có nghĩa, dùng slug: ví dụ `/san-pham/laptop-dell-xps-13`. KHÔNG dùng URL kiểu `?id=123`.
- Slug tự sinh từ tên khi tạo sản phẩm/bài viết, có kiểm tra trùng (thêm hậu tố nếu trùng).
- Cấu trúc heading đúng: mỗi trang 1 thẻ `<h1>` duy nhất, các mục dùng `<h2>`/`<h3>` hợp lý.
- Thêm structured data Schema.org: `Product` + `Offer` (giá, tình trạng) cho trang sản phẩm; `Article` cho blog.
- `sitemap.ts` tự động sinh sitemap từ DB (gồm sản phẩm, danh mục, bài viết).
- `robots.ts`/`robots.txt`: cho index trang sản phẩm/danh mục/blog; chặn index trang giỏ hàng, checkout, tài khoản, admin.
- OpenGraph + Twitter card tags cho các trang chính (để share link đẹp trên Facebook/Zalo).
- Dùng `next/link` cho điều hướng nội bộ (không dùng thẻ `<a>` thường cho link nội bộ).

## 5. Quy ước code

- Ngôn ngữ giao diện: tiếng Việt. Đặt tên biến/hàm/file bằng tiếng Anh.
- Component tái sử dụng đặt trong `components/`. Component dùng chung nhiều nơi (Header, Footer, ProductCard, Pagination) phải tách riêng, không lặp code.
- Ở khu admin: dựng component form và table dạng generic/dùng chung, áp dụng lại cho các CRUD (sản phẩm, danh mục, thương hiệu, blog) thay vì viết riêng từng cái.
- Xử lý lỗi rõ ràng: try/catch ở các thao tác DB và gọi API ngoài (VNPay, Cloudinary); trả về thông báo lỗi thân thiện cho người dùng.
- Validate dữ liệu đầu vào (dùng zod) ở cả client và server cho form quan trọng (checkout, tạo sản phẩm).
- Không hardcode giá trị nhạy cảm (key, secret) trong code — luôn đọc từ biến môi trường (`.env`).
- Format tiền tệ nhất quán (VND, có phân cách hàng nghìn).
- Commit thường xuyên theo từng tính năng nhỏ.

## 6. Cấu trúc thư mục gợi ý

```
src/
  app/                 # routes (App Router)
    (shop)/            # nhóm trang khách hàng
    admin/             # nhóm trang quản trị
    api/               # API routes
  components/          # component tái sử dụng
    ui/                # shadcn/ui
  lib/                 # prisma.ts, utils, cấu hình
  prisma/              # schema.prisma
```

## 7. Điều cần tránh

- Không dùng `<img>` thay cho `next/image`.
- Không tạo nhiều instance PrismaClient.
- Không query "lấy tất cả" không phân trang.
- Không để trang động thiếu metadata.
- Không dùng URL có id số thay cho slug.
- Không tự ý thêm thư viện nặng nếu chưa cần.
- Không over-engineer: ưu tiên giải pháp đơn giản chạy được trong timeline 1 tháng.
