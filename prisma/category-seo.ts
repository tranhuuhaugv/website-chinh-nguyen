// Nạp SẴN bài viết SEO + meta description cho các danh mục / nhu cầu.
// Chạy 1 lần trên VPS SAU khi deploy (đã có cột seoContent):  npx tsx prisma/category-seo.ts
//
// AN TOÀN: chỉ điền cho danh mục CHƯA có seoContent -> không đè bài bạn đã sửa
// trong admin. Muốn ghi đè 1 mục, xoá nội dung mục đó trong admin rồi chạy lại.
//
// Nội dung là HTML (h2/h3/p/ul) — khớp bộ thẻ cho phép của trang. Sửa thoải mái
// trong admin (CKEditor) sau khi nạp.

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface Seo {
  slug: string;
  metaDescription: string;
  html: string;
}

const ARTICLES: Seo[] = [
  // ---- NHU CẦU ----
  {
    slug: "laptop-gaming",
    metaDescription:
      "Laptop gaming cũ & mới giá tốt tại Đà Nẵng: cấu hình RTX mạnh, màn 144Hz, trả góp 0%, bảo hành dài. Tư vấn chọn máy chơi game đúng ngân sách.",
    html: `
<h2>Laptop gaming là gì và ai nên mua?</h2>
<p>Laptop gaming là dòng máy được trang bị card đồ họa rời (NVIDIA RTX / GTX), CPU hiệu năng cao và màn hình tần số quét lớn (120Hz, 144Hz trở lên) để chơi game mượt, ổn định. Ngoài chơi game, đây cũng là lựa chọn tốt cho công việc dựng phim, render 3D hay lập trình nặng nhờ sức mạnh phần cứng dư dả.</p>
<h2>Chọn laptop gaming theo ngân sách</h2>
<ul>
<li><strong>Dưới 20 triệu:</strong> ưu tiên RTX 3050 / 2050, RAM 16GB, đủ chơi tốt các tựa game phổ thông ở thiết lập trung bình – cao.</li>
<li><strong>20 – 30 triệu:</strong> RTX 4060 / 3060, màn 144Hz, chiến mượt game AAA ở mức High.</li>
<li><strong>Trên 30 triệu:</strong> RTX 4070 trở lên, màn 165Hz/2K, dành cho game thủ và người làm đồ họa chuyên nghiệp.</li>
</ul>
<h2>Kinh nghiệm chọn laptop gaming cũ</h2>
<p>Máy gaming cũ giá tốt hơn 30–50% so với máy mới cùng cấu hình. Khi mua nên kiểm tra nhiệt độ khi tải nặng, tình trạng pin, quạt tản nhiệt và độ zin của màn hình. Tại Laptop Chính Nguyễn (Đà Nẵng), mỗi máy đều được vệ sinh, tra keo tản nhiệt và test kỹ trước khi giao, hỗ trợ trả góp 0% và bảo hành rõ ràng.</p>
`,
  },
  {
    slug: "laptop-do-hoa",
    metaDescription:
      "Laptop đồ họa – máy trạm (workstation) cho thiết kế, render, dựng phim: card Quadro/RTX, màn màu chuẩn. Giá tốt, trả góp, bảo hành tại Đà Nẵng.",
    html: `
<h2>Laptop đồ họa – máy trạm khác gì máy thường?</h2>
<p>Laptop đồ họa và máy trạm (workstation) được tối ưu cho các phần mềm nặng như Photoshop, Premiere, AutoCAD, SolidWorks, 3ds Max hay Blender. Điểm mạnh nằm ở card đồ họa chuyên dụng (NVIDIA Quadro/RTX), CPU nhiều nhân, RAM lớn và màn hình hiển thị màu chuẩn (phủ sRGB/AdobeRGB cao).</p>
<h2>Nên ưu tiên thông số nào?</h2>
<ul>
<li><strong>Màn hình:</strong> độ phủ màu cao, độ phân giải từ FHD trở lên để làm ảnh/video chính xác.</li>
<li><strong>RAM:</strong> tối thiểu 16GB, nên 32GB cho dựng phim và 3D.</li>
<li><strong>CPU &amp; GPU:</strong> chip đa nhân (Core i7/i9, Ryzen 7/9) kết hợp card rời để render nhanh.</li>
<li><strong>Ổ cứng:</strong> SSD NVMe dung lượng lớn giúp mở file dự án và xuất bản nhanh.</li>
</ul>
<h2>Mua laptop đồ họa cũ có nên không?</h2>
<p>Các dòng máy trạm Dell Precision, HP ZBook, Lenovo ThinkPad P-series đời trước vẫn rất mạnh và bền, giá lại mềm hơn nhiều so với máy mới. Đây là lựa chọn tối ưu cho sinh viên thiết kế và freelancer. Laptop Chính Nguyễn tư vấn cấu hình phù hợp từng phần mềm, hỗ trợ trả góp và bảo hành tại Đà Nẵng.</p>
`,
  },
  {
    slug: "laptop-van-phong",
    metaDescription:
      "Laptop văn phòng mỏng nhẹ, pin trâu, giá tốt cho học tập và làm việc. Nhiều lựa chọn cũ & mới, trả góp 0%, bảo hành tại Laptop Chính Nguyễn Đà Nẵng.",
    html: `
<h2>Laptop văn phòng nên chọn thế nào?</h2>
<p>Với nhu cầu soạn thảo, bảng tính, học online, lướt web và họp trực tuyến, một chiếc laptop văn phòng tốt cần gọn nhẹ, pin lâu và chạy mượt các tác vụ hằng ngày. Bạn không cần card đồ họa rời, thay vào đó nên ưu tiên trọng lượng, thời lượng pin và độ bền.</p>
<h2>Cấu hình đề xuất cho dân văn phòng &amp; sinh viên</h2>
<ul>
<li><strong>CPU:</strong> Intel Core i5 / AMD Ryzen 5 là đủ cho hầu hết công việc.</li>
<li><strong>RAM:</strong> 8GB dùng cơ bản, 16GB nếu mở nhiều tab và ứng dụng cùng lúc.</li>
<li><strong>Ổ cứng:</strong> SSD giúp máy khởi động và mở phần mềm nhanh.</li>
<li><strong>Màn hình:</strong> tấm nền IPS, độ phân giải FHD cho mắt dễ chịu khi làm lâu.</li>
</ul>
<h2>Gợi ý dòng máy bền – đẹp – tiết kiệm</h2>
<p>Các dòng ThinkPad, Dell Latitude, HP EliteBook (bản cũ) nổi tiếng bền bỉ, bàn phím tốt, rất hợp đi làm; còn ai thích mỏng nhẹ có thể chọn Asus Zenbook, LG Gram hay MacBook Air. Ghé Laptop Chính Nguyễn (Đà Nẵng) để được tư vấn chọn máy đúng nhu cầu, trả góp 0% và bảo hành dài.</p>
`,
  },

  // ---- TÌNH TRẠNG ----
  {
    slug: "laptop-cu",
    metaDescription:
      "Laptop cũ giá rẻ, còn zin, đã kiểm tra kỹ tại Đà Nẵng. Tiết kiệm 30–50% so với máy mới, trả góp 0%, bảo hành rõ ràng tại Laptop Chính Nguyễn.",
    html: `
<h2>Vì sao nên mua laptop cũ?</h2>
<p>Laptop cũ giúp bạn sở hữu cấu hình cao với chi phí thấp hơn 30–50% so với máy mới. Với cùng số tiền, bạn có thể chọn được máy mạnh hơn hẳn – rất phù hợp cho sinh viên, người mới đi làm hay ai cần máy phụ. Điều quan trọng là mua ở nơi uy tín, máy được kiểm tra kỹ.</p>
<h2>Kiểm tra gì khi mua laptop cũ?</h2>
<ul>
<li><strong>Màn hình:</strong> điểm chết, hở sáng, độ zin.</li>
<li><strong>Pin:</strong> độ chai, thời lượng dùng thực tế.</li>
<li><strong>Bàn phím, cổng kết nối, loa, webcam:</strong> hoạt động đầy đủ.</li>
<li><strong>Nhiệt độ &amp; hiệu năng:</strong> chạy ổn định khi tải nặng.</li>
</ul>
<h2>Mua laptop cũ ở đâu yên tâm tại Đà Nẵng?</h2>
<p>Mỗi máy tại Laptop Chính Nguyễn đều được vệ sinh, tra keo tản nhiệt, test toàn bộ linh kiện và có chính sách bảo hành, đổi trả minh bạch. Hỗ trợ trả góp 0%, giao nhanh, tư vấn tận tình để bạn chọn đúng máy cũ giá tốt và bền.</p>
`,
  },
  {
    slug: "laptop-moi",
    metaDescription:
      "Laptop mới 100% chính hãng, đầy đủ bảo hành hãng, nhiều thương hiệu Dell, Asus, HP, Lenovo, MacBook. Giá tốt, trả góp 0% tại Laptop Chính Nguyễn Đà Nẵng.",
    html: `
<h2>Laptop mới – yên tâm bảo hành chính hãng</h2>
<p>Nếu bạn ưu tiên sự an tâm lâu dài, laptop mới 100% là lựa chọn hợp lý với nguyên hộp, đầy đủ phụ kiện và bảo hành chính hãng. Máy mới cũng cập nhật các công nghệ mới nhất về vi xử lý, thời lượng pin và kết nối.</p>
<h2>Chọn laptop mới theo nhu cầu</h2>
<ul>
<li><strong>Học tập – văn phòng:</strong> ưu tiên mỏng nhẹ, pin trâu, Core i5/Ryzen 5.</li>
<li><strong>Đồ họa – kỹ thuật:</strong> màn màu chuẩn, RAM 16GB+, card rời.</li>
<li><strong>Gaming:</strong> RTX đời mới, màn tần số quét cao.</li>
</ul>
<h2>Mua laptop mới trả góp tại Đà Nẵng</h2>
<p>Laptop Chính Nguyễn cung cấp laptop mới đa dạng thương hiệu, giá cạnh tranh, hỗ trợ trả góp 0% qua thẻ hoặc công ty tài chính, giao hàng nhanh toàn quốc và tư vấn chọn máy phù hợp túi tiền.</p>
`,
  },

  // ---- THƯƠNG HIỆU ----
  {
    slug: "dell",
    metaDescription:
      "Laptop Dell cũ & mới giá tốt: XPS, Latitude, Precision, Inspiron, Vostro. Bền bỉ, hậu mãi tốt, trả góp 0%, bảo hành tại Laptop Chính Nguyễn Đà Nẵng.",
    html: `
<h2>Vì sao chọn laptop Dell?</h2>
<p>Dell là thương hiệu laptop phổ biến nhờ độ bền cao, linh kiện dễ thay thế và các dòng sản phẩm trải rộng mọi nhu cầu: XPS cao cấp mỏng nhẹ, Latitude cho doanh nghiệp, Precision cho đồ họa – kỹ thuật, Inspiron/Vostro cho học tập – văn phòng.</p>
<h2>Các dòng Dell đáng mua</h2>
<ul>
<li><strong>Dell XPS:</strong> thiết kế sang, màn đẹp, hợp dân văn phòng cao cấp.</li>
<li><strong>Dell Latitude:</strong> bền, bàn phím tốt, pin ổn cho công việc.</li>
<li><strong>Dell Precision:</strong> máy trạm mạnh cho render, thiết kế.</li>
</ul>
<p>Xem các mẫu Dell cũ &amp; mới giá tốt tại Laptop Chính Nguyễn (Đà Nẵng) – máy kiểm tra kỹ, trả góp 0%, bảo hành minh bạch.</p>
`,
  },
  {
    slug: "asus",
    metaDescription:
      "Laptop Asus cũ & mới: Zenbook mỏng nhẹ, Vivobook học tập, TUF/ROG gaming. Giá tốt, trả góp 0%, bảo hành tại Laptop Chính Nguyễn Đà Nẵng.",
    html: `
<h2>Laptop Asus – đa dạng lựa chọn</h2>
<p>Asus ghi điểm nhờ dải sản phẩm phong phú và giá hợp lý: Zenbook mỏng nhẹ thời trang, Vivobook giá tốt cho học tập, dòng TUF và ROG mạnh mẽ cho game thủ. Chất lượng hoàn thiện tốt, hiệu năng ổn định trong tầm giá.</p>
<h2>Nên chọn dòng Asus nào?</h2>
<ul>
<li><strong>Zenbook:</strong> mỏng nhẹ, màn OLED đẹp, hợp văn phòng &amp; di chuyển nhiều.</li>
<li><strong>Vivobook:</strong> giá mềm, đủ dùng cho sinh viên.</li>
<li><strong>TUF / ROG:</strong> card RTX, tản nhiệt tốt, chiến game mượt.</li>
</ul>
<p>Tham khảo laptop Asus giá tốt tại Laptop Chính Nguyễn (Đà Nẵng), hỗ trợ trả góp 0% và bảo hành dài.</p>
`,
  },
  {
    slug: "macbook",
    metaDescription:
      "MacBook Air & Pro (chip M1, M2, M3) cũ và mới, pin trâu, hiệu năng mạnh, màn đẹp. Giá tốt, trả góp 0%, bảo hành tại Laptop Chính Nguyễn Đà Nẵng.",
    html: `
<h2>MacBook – hiệu năng và thời lượng pin ấn tượng</h2>
<p>Từ khi chuyển sang chip Apple Silicon (M1, M2, M3), MacBook nổi bật với hiệu năng mạnh, chạy mát, êm và thời lượng pin rất lâu. MacBook Air phù hợp học tập – văn phòng, còn MacBook Pro dành cho dựng phim, thiết kế và lập trình.</p>
<h2>Chọn MacBook nào?</h2>
<ul>
<li><strong>MacBook Air M1/M2/M3:</strong> mỏng nhẹ, pin trâu, mượt cho công việc hằng ngày.</li>
<li><strong>MacBook Pro:</strong> màn Liquid Retina, hiệu năng cao cho sáng tạo nội dung.</li>
</ul>
<p>MacBook cũ tại Laptop Chính Nguyễn đều được kiểm tra pin và độ zin kỹ càng; hỗ trợ trả góp 0%, bảo hành và tư vấn chọn cấu hình phù hợp tại Đà Nẵng.</p>
`,
  },
  {
    slug: "hp",
    metaDescription:
      "Laptop HP cũ & mới: Pavilion, Envy, EliteBook, ProBook, Victus gaming. Bền, giá tốt, trả góp 0%, bảo hành tại Laptop Chính Nguyễn Đà Nẵng.",
    html: `
<h2>Laptop HP cho mọi nhu cầu</h2>
<p>HP có dải sản phẩm rộng: EliteBook/ProBook bền bỉ cho doanh nghiệp, Pavilion/Envy cho học tập – giải trí, Victus/Omen cho gaming. Thiết kế chắc chắn, bàn phím tốt, hậu mãi rộng khắp.</p>
<ul>
<li><strong>EliteBook:</strong> cao cấp, bền, bảo mật tốt cho công việc.</li>
<li><strong>Pavilion / Envy:</strong> cân đối giữa giá và hiệu năng.</li>
<li><strong>Victus / Omen:</strong> cấu hình gaming mạnh mẽ.</li>
</ul>
<p>Xem laptop HP giá tốt tại Laptop Chính Nguyễn (Đà Nẵng) – trả góp 0%, bảo hành rõ ràng.</p>
`,
  },
  {
    slug: "lenovo",
    metaDescription:
      "Laptop Lenovo cũ & mới: ThinkPad bền bỉ, IdeaPad học tập, Legion gaming. Giá tốt, trả góp 0%, bảo hành tại Laptop Chính Nguyễn Đà Nẵng.",
    html: `
<h2>Lenovo – bền bỉ, bàn phím tốt</h2>
<p>Lenovo được yêu thích nhờ dòng ThinkPad huyền thoại: bền, bàn phím gõ sướng, rất hợp dân văn phòng và kỹ thuật. IdeaPad phù hợp học tập giá mềm, còn Legion là lựa chọn gaming đáng tiền.</p>
<ul>
<li><strong>ThinkPad:</strong> độ bền cao, bảo mật tốt, hợp công việc lâu dài.</li>
<li><strong>IdeaPad:</strong> giá tốt cho sinh viên, văn phòng cơ bản.</li>
<li><strong>Legion:</strong> tản nhiệt tốt, cấu hình gaming mạnh.</li>
</ul>
<p>Tham khảo laptop Lenovo tại Laptop Chính Nguyễn (Đà Nẵng), hỗ trợ trả góp 0% và bảo hành.</p>
`,
  },
  {
    slug: "acer",
    metaDescription:
      "Laptop Acer cũ & mới: Aspire học tập, Swift mỏng nhẹ, Nitro/Predator gaming. Giá tốt, trả góp 0%, bảo hành tại Laptop Chính Nguyễn Đà Nẵng.",
    html: `
<h2>Laptop Acer – giá tốt, đa dụng</h2>
<p>Acer nổi bật với mức giá dễ tiếp cận: Aspire cho học tập – văn phòng, Swift mỏng nhẹ, Nitro và Predator cho gaming. Hiệu năng ổn trong tầm tiền, phù hợp người dùng cần tối ưu chi phí.</p>
<ul>
<li><strong>Aspire:</strong> giá mềm, đủ dùng hằng ngày.</li>
<li><strong>Swift:</strong> mỏng nhẹ, di chuyển tiện.</li>
<li><strong>Nitro / Predator:</strong> card rời, chơi game tốt trong tầm giá.</li>
</ul>
<p>Xem laptop Acer giá tốt tại Laptop Chính Nguyễn (Đà Nẵng) – trả góp 0%, bảo hành.</p>
`,
  },
  {
    slug: "msi",
    metaDescription:
      "Laptop MSI gaming & sáng tạo: dòng Gaming GF/GP, Modern, Creator. Tản nhiệt tốt, card RTX mạnh. Giá tốt, trả góp 0% tại Laptop Chính Nguyễn Đà Nẵng.",
    html: `
<h2>MSI – chuyên gaming và sáng tạo nội dung</h2>
<p>MSI mạnh về dòng laptop gaming và creator với card đồ họa RTX, hệ thống tản nhiệt tốt và màn hình chất lượng. Đây là lựa chọn đáng cân nhắc cho game thủ và người làm đồ họa cần hiệu năng cao.</p>
<ul>
<li><strong>Gaming (GF/GP/Katana):</strong> hiệu năng mạnh, tản nhiệt hiệu quả.</li>
<li><strong>Modern:</strong> gọn nhẹ cho văn phòng.</li>
<li><strong>Creator:</strong> tối ưu cho dựng phim, thiết kế.</li>
</ul>
<p>Tham khảo laptop MSI tại Laptop Chính Nguyễn (Đà Nẵng), hỗ trợ trả góp 0% và bảo hành.</p>
`,
  },

  // ---- KHÁC ----
  {
    slug: "pc",
    metaDescription:
      "PC đồng bộ cũ & mới cho văn phòng, học tập, đồ họa. Máy chạy ổn định, giá tốt, bảo hành tại Laptop Chính Nguyễn Đà Nẵng.",
    html: `
<h2>PC đồng bộ – ổn định, giá hợp lý</h2>
<p>PC đồng bộ (Dell OptiPlex, HP ProDesk/EliteDesk, Lenovo ThinkCentre…) là lựa chọn tốt cho văn phòng và gia đình nhờ độ bền, chạy ổn định và chi phí hợp lý. Dễ nâng cấp RAM, ổ cứng khi cần.</p>
<ul>
<li><strong>Văn phòng:</strong> cấu hình đủ dùng, tiết kiệm điện, gọn gàng.</li>
<li><strong>Đồ họa nhẹ:</strong> nâng RAM/SSD để làm việc mượt hơn.</li>
</ul>
<p>Xem PC đồng bộ giá tốt tại Laptop Chính Nguyễn (Đà Nẵng) – kiểm tra kỹ, bảo hành minh bạch.</p>
`,
  },
  {
    slug: "man-hinh",
    metaDescription:
      "Màn hình máy tính cũ & mới: văn phòng, đồ họa màu chuẩn, gaming tần số quét cao. Giá tốt, bảo hành tại Laptop Chính Nguyễn Đà Nẵng.",
    html: `
<h2>Chọn màn hình máy tính phù hợp</h2>
<p>Một chiếc màn hình tốt giúp làm việc thoải mái và bảo vệ mắt hơn. Tùy nhu cầu bạn nên cân nhắc kích thước, độ phân giải, tấm nền và tần số quét.</p>
<ul>
<li><strong>Văn phòng:</strong> tấm nền IPS, FHD, kích thước 24–27 inch.</li>
<li><strong>Đồ họa:</strong> độ phủ màu cao, độ phân giải 2K/4K.</li>
<li><strong>Gaming:</strong> tần số quét 144Hz+ cho hình ảnh mượt.</li>
</ul>
<p>Tham khảo màn hình giá tốt tại Laptop Chính Nguyễn (Đà Nẵng) – bảo hành rõ ràng.</p>
`,
  },
  {
    slug: "phu-kien",
    metaDescription:
      "Sạc, pin, chuột, bàn phím, balo, RAM, SSD và phụ kiện laptop chính hãng giá tốt. Bảo hành tại Laptop Chính Nguyễn Đà Nẵng.",
    html: `
<h2>Phụ kiện laptop chính hãng, giá tốt</h2>
<p>Bên cạnh laptop, việc chọn đúng phụ kiện giúp máy bền và làm việc hiệu quả hơn: sạc và pin thay thế, chuột, bàn phím, balo/túi chống sốc, cùng linh kiện nâng cấp như RAM và SSD.</p>
<ul>
<li><strong>Nâng cấp:</strong> RAM, SSD giúp máy nhanh và mượt hơn rõ rệt.</li>
<li><strong>Bảo vệ:</strong> túi chống sốc, lót chuột, tản nhiệt.</li>
<li><strong>Phụ kiện dùng hằng ngày:</strong> sạc, chuột, bàn phím, hub cổng.</li>
</ul>
<p>Xem sạc &amp; phụ kiện tại Laptop Chính Nguyễn (Đà Nẵng) – hàng đảm bảo, bảo hành.</p>
`,
  },
];

async function main() {
  let filled = 0;
  let skipped = 0;
  for (const a of ARTICLES) {
    const cat = await prisma.category.findUnique({ where: { slug: a.slug } });
    if (!cat) {
      console.log(`- BỎ QUA (không có danh mục): ${a.slug}`);
      continue;
    }
    if (cat.seoContent && cat.seoContent.trim()) {
      skipped++;
      console.log(`- Giữ nguyên (đã có bài): ${a.slug}`);
      continue;
    }
    await prisma.category.update({
      where: { slug: a.slug },
      data: {
        seoContent: a.html.trim(),
        metaDescription: cat.metaDescription ?? a.metaDescription,
      },
    });
    filled++;
    console.log(`- Đã nạp bài SEO: ${a.slug}`);
  }
  console.log(`\nXong. Nạp mới: ${filled} | Giữ nguyên: ${skipped}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
