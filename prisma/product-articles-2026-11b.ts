// Bài viết cho các sản phẩm thêm ngày 26/11/2026 (cùng khuôn với product-articles-2026-11.ts).
// Kèm META_ONLY: sản phẩm đã có bài nhưng meta còn trống (đang tự sinh) và META_FIXES: meta ghi
// sai cấu hình (chỉ thay khi giá trị trong DB còn đúng y bản sai, để không đè bản admin đã sửa).
import { storeBlock, type ProductArticle } from "./product-articles";

interface Draft {
  slug: string;
  title: string;
  desc: string;
  name: string;
  intro: string;
  sections: [string, string][];
  fit: string[];
  avoid: string;
  lead: string;
  faq: [string, string][];
  more: string;
}

const a = (href: string, text: string) => `<a href="${href}">${text}</a>`;
const home = (text = "laptop Đà Nẵng") => a("/", text);

const B = {
  check: a("/blog/cach-kiem-tra-laptop-cu-truoc-khi-mua-checklist", "Checklist kiểm tra laptop cũ trước khi mua"),
  where: a("/blog/mua-laptop-cu-o-dau-uy-tin-tai-da-nang", "Mua laptop cũ ở đâu uy tín tại Đà Nẵng"),
  i5i7: a("/blog/laptop-van-phong-2026-nen-chon-core-i5-hay-core-i7", "Laptop văn phòng 2026 nên chọn Core i5 hay Core i7"),
  sv: a("/blog/kinh-nghiem-mua-laptop-cu-da-nang-cho-sinh-vien", "Kinh nghiệm mua laptop cũ Đà Nẵng cho sinh viên"),
  u10: a("/blog/laptop-cu-da-nang-duoi-10-trieu-nen-mua-may-nao", "Laptop cũ Đà Nẵng dưới 10 triệu nên mua máy nào"),
  sv15: a("/blog/chon-laptop-cho-sinh-vien-2026-ngan-sach-15-trieu", "Chọn laptop cho sinh viên 2026 ngân sách 15 triệu"),
  topg: a("/blog/top-5-laptop-gaming-cu-gia-re-da-nang-2026", "Top 5 laptop gaming cũ giá rẻ tại Đà Nẵng 2026"),
  r4060: a("/blog/laptop-gaming-rtx-4060-tam-gia-nao-2026", "Laptop gaming RTX 4060 tầm giá nào 2026"),
  xps: a("/blog/dell-xps-13-vs-xps-15-nen-mua-ban-nao", "Dell XPS 13 vs XPS 15: nên mua bản nào"),
  ultra: a("/blog/intel-core-ultra-vs-amd-ryzen-ai-2026", "Intel Core Ultra vs AMD Ryzen AI 2026"),
  tram: a("/blog/kinh-nghiem-chon-laptop-may-tram-do-hoa-render", "Kinh nghiệm chọn laptop máy trạm đồ họa, render"),
  pin: a("/blog/cach-bao-ve-tang-tuoi-tho-pin-laptop-2026", "Cách bảo vệ, tăng tuổi thọ pin laptop"),
};

function build(d: Draft): ProductArticle {
  return {
    slug: d.slug,
    metaTitle: d.title,
    metaDescription: d.desc,
    contentHtml: `<p>${d.intro}</p>
${d.sections.map(([h, p]) => `<h3>${h}</h3>\n<p>${p}</p>`).join("\n")}
<h3>${d.name} phù hợp với ai?</h3>
<ul>
${d.fit.map((x) => `<li>${x}</li>`).join("\n")}
</ul>
<h3>Khi nào nên chọn máy khác?</h3>
<p>${d.avoid}</p>
<h3>Mua ${d.name} ở đâu tại Đà Nẵng?</h3>
${storeBlock(d.lead)}
<h3>Câu hỏi thường gặp về ${d.name}</h3>
${d.faq.map(([q, t]) => `<h4>${q}</h4>\n<p>${t}</p>`).join("\n")}
<p><strong>Xem thêm:</strong> ${d.more}</p>`,
  };
}

// Slug sản phẩm để nối bài (đều đang hiển thị trên web ngày 26/11/2026)
const S = {
  p1g5: "/lenovo-thinkpad-p1-gen-5-core-i7-12800h-16gb-512gb-rtx-a1000-4gb-16-4k",
  p1g4: "/lenovo-thinkpad-p1-gen-4-core-i7-11850h",
  loqA530: "/lenovo-loq-15iax9-core-i5-12450h-16gb-512gb-arc-a530m",
  loq3050: "/lenovo-loq-15iax9-core-i5-12450h-16gb-512gb-rtx-3050-6gb",
  loqIrx9: "/lenovo-loq-15irx9-core-i5-13450hx-16gb-512gb-rtx-3050-6gb",
  loq50: "/lenovo-loq-15ahp10-ryzen-7-250h",
  g5515: "/dell-gaming-g15-5515-ryzen-5-5600h-16gb-512gb-rtx-3050-156-fhd-120hz",
  g5511: "/dell-gaming-g5-15-5511-core-i7-11800h-16gb-512gb-rtx-3060",
  g5520: "/dell-gaming-g15-5520-core-i5-12500h-16gb-512gb-rtx-3050-4gb-156-fhd-120hz",
  g5530: "/dell-gaming-g15-5530-core-i5-13450hx-16gb-512gb-rtx-3050-156-fhd-120hz",
  m5560: "/dell-precision-5560-core-i7-11850h-ram-16gb-ssd-512gb-nvidia-quadro-a2000-156-inch-fhd",
  m5570: "/dell-precision-5570-core-i7-11850h-ram-16gb-ssd-512gb-rtx-a1000-156-inch-fhd",
  m5550: "/dell-precision-m5550-core-i7-10850h",
  m7550: "/dell-precision-7550-core-i7-10850h",
  m7550r: "/dell-precision-7550-i7-1050h-ram-16gb-ss-512gb-rtx-3000-156inch-fhd",
  m7550x: "/dell-precision-7550-xeon-w-10855m-ram-16gb-ssd-512gb-quadro-rtx-3000",
  m7560: "/dell-precision-7560-core-i7-11850h",
  m7750: "/dell-precision-7750-core-i7-10850h-ram-16gb-ssd-512gb-rtx-3000-173-inch-fhd",
  p15: "/lenovo-thinkpad-p15-gen-1-intel-core-i7-10750h-16gb-ram-1tb-ssd-nvidia-quadro-rtx-3000-6gb-156-fhd",
  p15t2: "/lenovo-thinkpad-p15-gen-1-core-i7-10850h-ram-16gb-ssd-512gb-quadro-t2000",
  n5320: "/dell-inspiron-5320-core-i5-1240p",
  n5330: "/dell-inspiron-5330-core-i5-1340p-ram-16gb-ssd-512gb-133-inch-25k",
  n5510: "/dell-inspiron-5510-core-i5-11300h",
  n5510i7: "/dell-inspiron-15-5510-core-i7-11390h-ram-16gb-ssd-512gb-156-inch-fhd",
  n5409: "/dell-inspiron-5409-core-i5-1135g7",
  e7350: "/dell-latitude-7350-core-ultra-5-135u-ram-32gb-ssd-1tb-133-inch-fhd-ips",
  e7350t: "/dell-latitude-7350-2-in-1-core-ultra-7-165u",
  e7450: "/dell-latitude-7450-ultra-7-155u-ram-16gb-ssd-512gb-14-inch-fhd-ips",
  e5440: "/dell-latitude-5440-core-i7-1355u-ram-16gb-ssd-512gb-14-inch-fhd",
  e5510: "/dell-latitude-5510-core-i5-10310u-ram-8gb-ssd-256gb-156-inch-fhd",
  e5420: "/dell-latitude-5420-core-i5-1145g7-ram-8gb-ssd-256gb-14-fhd-win-11",
  e7320d: "/dell-latitude-7320-detachable-core-i5-1140g7-ram-16gb-ssd-256gb-133-fhd",
  e7400: "/dell-latitude-7400-core-i5-8365u",
  hp840: "/hp-elitebook-840-g5g6-core-i7-8850u-ram-8gb-ssd-256gb-14-inch-fhd",
  hp830: "/hp-830-g6-core-i5-8365u-ram-8gb-ssd-256gb-140-inch-fhd",
  nitroI5: "/acer-nitro-5-an515-57-core-i5-11400h-8gb-512gb-gtx-1650-156-fhd-ips-144hz",
  nitroI7: "/acer-nitro-5-2021-an515-57-core-i7-11800h",
  neoI9: "/acer-predator-helios-neo-16-core-i9-14900hx-16gb-1tb-rtx-4060-8gb-16-25k-240hz",
  neoI5: "/acer-predator-helios-neo-16-core-i5-13500hx-ram-16gb-ssd-512gb-rtx-4050-6gb",
  a715: "/acer-aspire-7-a715-ryzen-5-5500u-ram-8gb-ssd-256gb-gtx-1650-156-inch-fhd-144hz",
  x7390: "/dell-xps-13-7390-core-i7-10710u-ram-16gb-ssd-256gb-fhd",
  x7390i5: "/dell-xps-13-7390-core-i5-10210u",
  x9380: "/dell-xps-13-9380-core-i7-8665u-16gb-ram-512gb-ssd-fhd",
  x9380i5: "/dell-xps-13-9380-core-i5-8365u-ram-8gb-ssd-256gb-133-inch-fhd",
  x9300: "/dell-xps-9300-core-i7-1065g7",
  x9300i5: "/dell-xps-13-9300-core-i5-1035g1-ram-8gb-ssd-256gb-134-inch-fhd",
  x9315: "/dell-xps-13-9315-core-i7-1250u",
  x9320: "/dell-xps-13-plus-9320-core-i7-1260p-ram-16gb-ssd-256gb-134-inch-fhd-touch",
  x9320big: "/dell-xps-13-plus-9320-core-i7-1260p-ram-32gb-ssd-1tb",
  shadow: "/acer-shadow-sh16-41-ryzen-7-8745h-ram-16gb-ssd-512gb-rtx-4060-16-fhd-165hz",
  y7000p: "/lenovo-legion-5-y7000p-16irx9-core-i7-14650hx-ram-16gb-ssd-512gb-rtx-4060-16-25k-165hz",
};

const DRAFTS: Draft[] = [
  // ───────────── Lenovo ─────────────
  {
    slug: S.p1g5.slice(1), name: "ThinkPad P1 Gen 5",
    title: "ThinkPad P1 Gen 5 i7-12800H RTX A1000 4K Đà Nẵng",
    desc: "Lenovo ThinkPad P1 Gen 5: Core i7-12800H, RAM 16GB, SSD 512GB, RTX A1000 4GB, màn 16 inch 4K. Máy trạm mỏng nhẹ tại Laptop Chính Nguyễn Đà Nẵng, bảo hành 12 tháng.",
    intro: `<strong>Lenovo ThinkPad P1 Gen 5</strong> là ${a("/may-tram", "máy trạm")} mỏng nhẹ của dòng ThinkPad: Core i7-12800H 14 nhân, RAM 16GB, SSD 512GB, card RTX A1000 4GB và màn hình 16 inch 4K. Máy dành cho kỹ sư, kiến trúc sư, người làm đồ họa muốn sức mạnh máy trạm trong thân máy dễ mang theo. Bạn có thể xem máy tại Laptop Chính Nguyễn, cửa hàng ${home()} có 4 chi nhánh.`,
    sections: [
      ["Core i7-12800H và RTX A1000 làm được gì?", "CPU 14 nhân 20 luồng xử lý tốt AutoCAD, Revit, SolidWorks, dựng video và lập trình. RTX A1000 là card dòng chuyên nghiệp với driver được chứng nhận cho phần mềm kỹ thuật, ổn định hơn card gaming khi làm việc lâu trong các ứng dụng CAD."],
      ["Màn hình 16 inch 4K tỷ lệ 16:10", "Độ phân giải cao giúp bản vẽ, ảnh và timeline video hiển thị rất chi tiết, tỷ lệ 16:10 cho thêm không gian làm việc theo chiều dọc. Đây là màn phù hợp với người làm hình ảnh cần độ nét cao."],
      ["Chất ThinkPad: bền và dễ bảo trì", "P1 giữ bàn phím ThinkPad gõ êm, có TrackPoint, vỏ hoàn thiện chắc chắn. So với các máy trạm 15–17 inch dày nặng, P1 Gen 5 mỏng hơn nhiều, tiện mang đi gặp khách hàng hoặc lên công trình."],
    ],
    fit: ["Kỹ sư, kiến trúc sư dùng AutoCAD, Revit, SolidWorks.", "Người dựng video, chỉnh ảnh cần màn 4K.", "Người cần máy trạm nhưng phải mang theo hằng ngày."],
    avoid: `Ngân sách thấp hơn có ${a(S.p1g4, "ThinkPad P1 Gen 4 i7-11850H T1200")}. Cần card mạnh hơn cho render GPU, xem ${a(S.m7550r, "Dell Precision 7550 RTX 3000")} hoặc các máy trong mục ${a("/may-tram", "máy trạm")}.`,
    lead: "Máy trạm nên được test với chính phần mềm bạn dùng. Mang file làm việc đến để thử ThinkPad P1 Gen 5 tại:",
    faq: [["RTX A1000 có chơi game được không?", "Chơi được game nhẹ đến trung bình, nhưng card này tối ưu cho phần mềm kỹ thuật. Nếu chơi game là chính, nên chọn laptop gaming."], ["Màn 4K có tốn pin không?", "Màn 4K tiêu thụ điện nhiều hơn màn Full HD. Khi làm việc nặng nên cắm sạc để máy đạt hiệu năng tối đa."], ["P1 Gen 5 nâng cấp RAM được không?", "Dòng P1 Gen 5 dùng khe RAM DDR5. Kỹ thuật viên sẽ kiểm tra cấu hình khe trên đúng máy và tư vấn khi bạn cần nâng."]],
    more: `${B.tram} · ${B.check}`,
  },
  {
    slug: S.loq3050.slice(1), name: "Lenovo LOQ 15IAX9 RTX 3050",
    title: "Lenovo LOQ 15IAX9 i5-12450H RTX 3050 6GB Đà Nẵng",
    desc: "Lenovo LOQ 15IAX9: Core i5-12450H, RAM 16GB, SSD 512GB, RTX 3050 6GB, màn 15.6 inch FHD 144Hz. Laptop gaming giá tốt cho sinh viên tại Laptop Chính Nguyễn Đà Nẵng.",
    intro: `<strong>Lenovo LOQ 15IAX9</strong> bản RTX 3050 6GB là ${a("/laptop-gaming", "laptop gaming")} dễ tiếp cận cho sinh viên: Core i5-12450H 8 nhân, RAM 16GB, SSD 512GB và màn 15.6 inch Full HD 144Hz. Máy chơi tốt các game eSports phổ biến và đủ sức cho học đồ họa cơ bản. Bạn có thể test máy tại Laptop Chính Nguyễn, địa chỉ mua ${home()} uy tín.`,
    sections: [
      ["RTX 3050 6GB khác gì bản 4GB?", "Bản 6GB có thêm VRAM, giúp game mới và phần mềm dựng hình ít bị thiếu bộ nhớ đồ họa khi tăng chất lượng texture. Với Liên Minh, Valorant, FC Online, CS2, máy đạt khung hình cao để tận dụng màn 144Hz."],
      ["Core i5-12450H cho học tập và làm việc", "8 nhân 12 luồng đủ cho Photoshop, Premiere dựng clip ngắn, lập trình và đa nhiệm nhiều tab. RAM 16GB là mức nên có cho máy gaming hiện nay, không phải nâng ngay khi mua."],
      ["Thiết kế và tản nhiệt của LOQ", "LOQ là dòng gaming tầm trung của Lenovo, thừa hưởng kiểu tản nhiệt từ Legion với khe gió lớn phía sau. Bàn phím có phím số, đèn nền trắng, phù hợp cả học tập lẫn chơi game."],
    ],
    fit: ["Sinh viên muốn vừa học vừa chơi game eSports.", "Người mới học đồ họa 2D, dựng video ngắn.", "Ai cần máy gaming 15.6 inch ngân sách khoảng 18 triệu."],
    avoid: `Muốn tiết kiệm hơn, xem ${a(S.loqA530, "LOQ 15IAX9 bản Arc A530M")}. Cần CPU mạnh hơn cho stream, dựng phim, ${a(S.loqIrx9, "LOQ 15IRX9 i5-13450HX")} đáng thêm tiền. Xem cả dòng tại ${a("/lenovo-loq", "Lenovo LOQ")}.`,
    lead: "Bạn có thể đến chơi thử game, nghe tiếng quạt và kiểm tra nhiệt độ LOQ 15IAX9 tại:",
    faq: [["LOQ 15IAX9 chơi được game AAA không?", "Được ở Full HD với thiết lập trung bình, nên bật DLSS nếu game hỗ trợ."], ["Máy có nâng cấp SSD được không?", "LOQ 15IAX9 thường có thêm khe M.2 trống. Kỹ thuật viên sẽ kiểm tra trên đúng máy khi bạn cần nâng."]],
    more: `${B.topg} · ${B.sv15}`,
  },
  {
    slug: S.loqIrx9.slice(1), name: "Lenovo LOQ 15IRX9",
    title: "Lenovo LOQ 15IRX9 i5-13450HX RTX 3050 Đà Nẵng",
    desc: "Lenovo LOQ 15IRX9: Core i5-13450HX, RAM 16GB, SSD 512GB, RTX 3050 6GB, màn FHD 144Hz, còn bảo hành hãng đến 8/2027. Có sẵn tại Laptop Chính Nguyễn Đà Nẵng.",
    intro: `<strong>Lenovo LOQ 15IRX9</strong> dùng chip Core i5-13450HX dòng HX hiệu năng cao, RAM 16GB, SSD 512GB, RTX 3050 6GB và màn 15.6 inch Full HD 144Hz. Điểm cộng lớn là máy còn bảo hành hãng đến tháng 8/2027. Đây là lựa chọn ${a("/laptop-gaming", "laptop gaming")} an tâm cho người muốn mua ${home()} dùng lâu dài.`,
    sections: [
      ["Chip HX mạnh hơn chip H ở đâu?", "Core i5-13450HX có 10 nhân 16 luồng và mức điện năng cao hơn chip dòng H, nên xử lý tốt hơn khi vừa chơi game vừa stream, render hay biên dịch code. So với LOQ 15IAX9 dùng i5-12450H, đây là bước nâng rõ rệt về CPU."],
      ["RTX 3050 6GB và màn 144Hz", "Card 6GB VRAM chạy tốt các game eSports ở khung hình cao, game AAA ở Full HD thiết lập vừa. Màn 144Hz giúp chuyển động mượt khi chơi game bắn súng."],
      ["Bảo hành hãng đến 8/2027", "Máy còn bảo hành chính hãng Lenovo đến tháng 8/2027, cộng với bảo hành 12 tháng của cửa hàng. Bạn có thể tra số serial trên trang Lenovo khi nhận máy."],
    ],
    fit: ["Game thủ eSports cần CPU mạnh để stream.", "Sinh viên IT, kỹ thuật muốn máy còn bảo hành hãng.", "Người dựng video ngắn, làm content."],
    avoid: `Cần card mạnh hơn, xem ${a(S.loq50, "LOQ 15AHP10 RTX 5050")}. Muốn tiết kiệm thì ${a(S.loq3050, "LOQ 15IAX9 i5-12450H RTX 3050")} có giá mềm hơn.`,
    lead: "Khi xem LOQ 15IRX9, bạn có thể kiểm tra hạn bảo hành hãng ngay tại quầy. Máy có tại các chi nhánh:",
    faq: [["LOQ 15IRX9 còn bảo hành hãng không?", "Còn, đến tháng 8/2027 theo thông tin máy. Bạn tra serial trên trang Lenovo để xác nhận."], ["i5-13450HX có nóng không?", "Chip HX tỏa nhiệt nhiều hơn khi tải nặng, nên dùng chế độ hiệu năng phù hợp và kê máy thoáng khi chơi game lâu."]],
    more: `${B.topg} · ${B.r4060}`,
  },
  {
    slug: S.p15t2.slice(1), name: "ThinkPad P15 Gen 1 T2000",
    title: "ThinkPad P15 Gen 1 i7-10850H Quadro T2000 Đà Nẵng",
    desc: "Lenovo ThinkPad P15 Gen 1: Core i7-10850H, RAM 16GB, SSD 512GB, Quadro T2000 4GB, màn 15.6 inch FHD. Máy trạm cũ giá tốt tại Laptop Chính Nguyễn Đà Nẵng.",
    intro: `<strong>Lenovo ThinkPad P15 Gen 1</strong> bản Core i7-10850H và Quadro T2000 4GB là ${a("/may-tram", "máy trạm")} 15.6 inch bền bỉ cho dân kỹ thuật, với RAM 16GB và SSD 512GB. Máy được thiết kế để chạy phần mềm CAD, mô phỏng trong nhiều giờ liền. Bạn có thể xem máy tại Laptop Chính Nguyễn, cửa hàng ${home()} có bảo hành 12 tháng.`,
    sections: [
      ["Core i7-10850H 6 nhân 12 luồng", "CPU này xử lý tốt AutoCAD, SketchUp, Revit mức vừa, lập trình và đa nhiệm. Xung boost cao giúp các tác vụ đơn luồng trong phần mềm CAD chạy nhanh."],
      ["Quadro T2000 4GB dành cho phần mềm kỹ thuật", "T2000 là card chuyên nghiệp với driver chứng nhận, cho hình ổn định trong các ứng dụng thiết kế. So với bản RTX 3000 của cùng dòng, T2000 nhẹ hơn nhưng đủ cho đa số công việc dựng hình 2D, 3D mức vừa."],
      ["Khung máy ThinkPad dễ nâng cấp", "P15 Gen 1 có nhiều khe RAM và khe SSD, rất thuận tiện khi cần mở rộng về sau. Bàn phím có phím số đầy đủ, tiện nhập số liệu."],
    ],
    fit: ["Kỹ sư xây dựng, cơ khí dùng phần mềm CAD.", "Sinh viên kiến trúc cần máy trạm giá hợp lý.", "Người cần máy chạy bền nhiều giờ liền."],
    avoid: `Cần card mạnh hơn cho render, xem ${a(S.p15, "ThinkPad P15 Gen 1 RTX 3000")}. Muốn máy gọn nhẹ hơn để mang theo, ${a(S.p1g4, "ThinkPad P1 Gen 4")} là lựa chọn mỏng hơn.`,
    lead: "Mang file bản vẽ của bạn đến để test ThinkPad P15 Gen 1 T2000 trực tiếp tại:",
    faq: [["Quadro T2000 có chơi game được không?", "Chơi được game nhẹ, nhưng card tối ưu cho phần mềm kỹ thuật hơn là game."], ["Máy nặng không?", "P15 Gen 1 là máy trạm 15.6 inch nên nặng hơn laptop văn phòng, phù hợp đặt bàn làm việc hơn là mang theo cả ngày."]],
    more: `${B.tram} · ${B.check}`,
  },
  // ───────────── Dell Gaming ─────────────
  {
    slug: S.g5515.slice(1), name: "Dell G15 5515",
    title: "Dell G15 5515 Ryzen 5 5600H RTX 3050 Đà Nẵng",
    desc: "Dell Gaming G15 5515: Ryzen 5 5600H, RAM 16GB, SSD 512GB, RTX 3050, màn 15.6 inch FHD 120Hz. Laptop gaming cũ giá tốt tại Laptop Chính Nguyễn Đà Nẵng, bảo hành 12 tháng.",
    intro: `<strong>Dell Gaming G15 5515</strong> là ${a("/dell-gaming", "laptop gaming Dell")} dùng Ryzen 5 5600H 6 nhân 12 luồng, RAM 16GB, SSD 512GB, RTX 3050 và màn 15.6 inch Full HD 120Hz. Máy hợp với sinh viên muốn chơi game eSports mượt mà mà không tốn quá nhiều tiền. Bạn có thể chơi thử tại Laptop Chính Nguyễn, cửa hàng ${home()} có 4 chi nhánh.`,
    sections: [
      ["Ryzen 5 5600H: mạnh và mát", "Chip AMD 6 nhân 12 luồng cho hiệu năng đa nhân tốt, đủ cho chơi game, học đồ họa và lập trình. Ryzen đời này cũng nổi tiếng tiết kiệm điện hơn chip Intel cùng thời khi dùng việc nhẹ."],
      ["RTX 3050 và màn 120Hz", "RTX 3050 chơi mượt Liên Minh, Valorant, FC Online, CS2 ở Full HD; game AAA chạy được ở thiết lập trung bình. Màn 120Hz cho chuyển động mượt hơn rõ rệt so với màn 60Hz văn phòng."],
      ["Tản nhiệt và độ bền", "G15 có tản nhiệt lấy cảm hứng từ dòng Alienware với khe gió lớn ở sau và hai bên. Khi xem máy, nên test chơi game 15–20 phút để kiểm tra nhiệt độ và tiếng quạt."],
    ],
    fit: ["Sinh viên chơi game eSports ngân sách khoảng 17 triệu.", "Người mới học đồ họa, dựng video.", "Ai thích máy Dell chắc chắn, dễ sửa chữa."],
    avoid: `Muốn CPU mạnh hơn, xem ${a(S.g5520, "Dell G15 5520 i5-12500H")} hoặc ${a(S.g5530, "G15 5530 i5-13450HX")}. Cần card mạnh hơn cho game AAA thì ${a(S.g5511, "Dell G15 5511 RTX 3060")} hợp lý hơn.`,
    lead: "Bạn có thể đến chơi thử game trên Dell G15 5515 trước khi mua tại:",
    faq: [["G15 5515 có nâng cấp RAM được không?", "Có, máy dùng 2 khe RAM DDR4, nâng được khi cần."], ["Máy có chơi game AAA không?", "Được ở Full HD với thiết lập trung bình, game eSports thì chạy rất mượt."]],
    more: `${B.topg} · ${B.sv15}`,
  },
  {
    slug: S.g5511.slice(1), name: "Dell G15 5511",
    title: "Dell G15 5511 i7-11800H RTX 3060 165Hz Đà Nẵng",
    desc: "Dell Gaming G15 5511: Core i7-11800H, RAM 16GB, SSD 512GB, RTX 3060 6GB, màn 15.6 inch 165Hz. Laptop gaming chơi tốt game AAA tại Laptop Chính Nguyễn Đà Nẵng.",
    intro: `<strong>Dell Gaming G15 5511</strong> trang bị Core i7-11800H 8 nhân 16 luồng, RAM 16GB, SSD 512GB và card RTX 3060 6GB, màn hình 15.6 inch tần số quét 165Hz. Đây là cấu hình chơi tốt game AAA ở Full HD. Bạn có thể test máy tại Laptop Chính Nguyễn, địa chỉ mua ${home()} uy tín.`,
    sections: [
      ["RTX 3060 6GB: chơi game AAA thoải mái", "RTX 3060 là mức card mạnh hơn hẳn RTX 3050, chơi tốt các game AAA ở Full HD thiết lập cao, hỗ trợ DLSS và Ray Tracing. Màn 165Hz giúp tận dụng khung hình cao trong game bắn súng."],
      ["Core i7-11800H cho cả học và làm", "8 nhân 16 luồng xử lý tốt dựng video, render 3D, lập trình và chạy máy ảo. Máy vừa là máy chơi game vừa là máy làm việc nặng."],
      ["Lưu ý khi chọn máy gaming cũ", "Kiểm tra nhiệt độ khi chơi game, tình trạng pin và bản lề. Cửa hàng vệ sinh, tra keo tản nhiệt trước khi bàn giao và cho dùng thử 15 ngày."],
    ],
    fit: ["Game thủ chơi game AAA ở Full HD.", "Người dựng video, render 3D ngân sách tầm trung.", "Sinh viên kỹ thuật cần máy mạnh dùng lâu."],
    avoid: `Ngân sách thấp hơn, xem ${a(S.g5515, "Dell G15 5515 RTX 3050")}. Muốn card đời mới RTX 4060, tham khảo ${a(S.shadow, "Acer Shadow SH16-41")} hoặc trang ${a("/laptop-gaming", "laptop gaming")}.`,
    lead: "Bạn có thể chơi thử game nặng trên Dell G15 5511 tại:",
    faq: [["G15 5511 chơi game AAA được không?", "Được, chơi tốt ở Full HD thiết lập cao với RTX 3060 6GB."], ["Máy có nóng không?", "Khi chơi game nặng máy sẽ nóng như mọi laptop gaming. Nên dùng chế độ hiệu năng phù hợp và kê máy thoáng."]],
    more: `${B.topg} · ${B.r4060}`,
  },
  // ───────────── Dell Precision ─────────────
  {
    slug: S.m5570.slice(1), name: "Dell Precision 5570",
    title: "Dell Precision 5570 i7 RTX A1000 FHD+ Đà Nẵng",
    desc: "Dell Precision 5570: Core i7-11850H, RAM 16GB, SSD 512GB, RTX A1000, màn 15.6 inch FHD+. Máy trạm mỏng nhẹ cho kỹ thuật, đồ họa tại Laptop Chính Nguyễn Đà Nẵng.",
    intro: `<strong>Dell Precision 5570</strong> là ${a("/may-tram", "máy trạm")} mỏng nhẹ cùng kiểu dáng với Dell XPS 15, cấu hình Core i7, RAM 16GB, SSD 512GB, card RTX A1000 và màn 15.6 inch FHD+. Máy dành cho người làm kỹ thuật, đồ họa muốn một chiếc máy trạm sang trọng, dễ mang theo. Bạn có thể xem máy tại Laptop Chính Nguyễn, cửa hàng ${home()} có 4 chi nhánh.`,
    sections: [
      ["Thiết kế mỏng nhẹ như XPS 15", "Dòng Precision 5000 dùng chung khung nhôm, viền màn mỏng với XPS 15, nên nhẹ và gọn hơn nhiều so với máy trạm dòng 7000. Đây là lựa chọn cho người hay di chuyển, gặp khách hàng."],
      ["RTX A1000: card chuyên nghiệp đời mới", "RTX A1000 có driver chứng nhận cho AutoCAD, SolidWorks, Revit, giúp hiển thị ổn định khi làm việc lâu. Card hỗ trợ RTX, tăng tốc render trong các phần mềm có dùng GPU."],
      ["Màn hình FHD+ 16:10", "Tỷ lệ 16:10 cho thêm không gian làm việc theo chiều dọc, tiện cho bản vẽ và timeline dựng video. Bản FHD+ tiết kiệm pin hơn bản 4K."],
    ],
    fit: ["Kỹ sư, kiến trúc sư hay di chuyển.", "Người làm đồ họa cần máy trạm mỏng nhẹ.", "Doanh nhân muốn máy sang trọng, mạnh."],
    avoid: `Cần card mạnh hơn cho render nặng, xem ${a(S.m7550r, "Precision 7550 RTX 3000")} hoặc ${a(S.m7560, "Precision 7560")}. Ngân sách thấp hơn có ${a(S.m5560, "Precision 5560")} và ${a(S.m5550, "Precision 5550")}.`,
    lead: "Bạn có thể mang file làm việc đến test Dell Precision 5570 tại:",
    faq: [["Precision 5570 khác gì XPS 15?", "Cùng kiểu thiết kế, nhưng Precision dùng card chuyên nghiệp có driver chứng nhận cho phần mềm kỹ thuật và chính sách bảo hành doanh nghiệp."], ["RTX A1000 chơi game được không?", "Chơi được game nhẹ và trung bình, nhưng card tối ưu cho phần mềm chuyên nghiệp."]],
    more: `${B.tram} · ${B.xps}`,
  },
  {
    slug: S.m7550.slice(1), name: "Dell Precision 7550 T1000",
    title: "Dell Precision 7550 i7-10850H Quadro T1000 Đà Nẵng",
    desc: "Dell Precision 7550: Core i7-10850H, RAM 16GB, SSD 512GB, Quadro T1000, màn 15.6 inch FHD. Máy trạm cũ bền bỉ cho kỹ thuật, CAD tại Laptop Chính Nguyễn Đà Nẵng.",
    intro: `<strong>Dell Precision 7550</strong> bản Core i7-10850H và Quadro T1000 là ${a("/may-tram", "máy trạm")} 15.6 inch với RAM 16GB, SSD 512GB, phù hợp cho kỹ sư và sinh viên kỹ thuật cần máy chạy CAD ổn định. Dòng 7000 nổi tiếng bền bỉ, nhiều khe nâng cấp. Bạn có thể xem máy tại Laptop Chính Nguyễn, cửa hàng ${home()} uy tín.`,
    sections: [
      ["Core i7-10850H và Quadro T1000", "CPU 6 nhân 12 luồng xử lý tốt AutoCAD, SketchUp, phần mềm kết cấu và lập trình. Quadro T1000 là card chuyên nghiệp mức cơ bản, đủ cho dựng hình 2D, 3D mức vừa với driver ổn định."],
      ["Khung máy trạm dễ nâng cấp", "Precision 7550 có nhiều khe RAM và nhiều khe SSD M.2, rất thuận tiện khi cần mở rộng bộ nhớ cho dự án lớn. Bàn phím có phím số đầy đủ."],
      ["Độ bền dòng Precision 7000", "Vỏ máy chắc chắn, tản nhiệt lớn giúp chạy tải nặng nhiều giờ liền. Đây là dòng máy được doanh nghiệp tin dùng cho công việc kỹ thuật."],
    ],
    fit: ["Kỹ sư xây dựng, cơ khí dùng CAD.", "Sinh viên kỹ thuật cần máy trạm giá hợp lý.", "Người cần máy chạy bền, nhiều khe nâng cấp."],
    avoid: `Cần card mạnh hơn cho render, xem ${a(S.m7550r, "Precision 7550 RTX 3000")} hoặc ${a(S.m7550x, "Precision 7550 Xeon RTX 3000 4K")}. Muốn màn lớn 17 inch có ${a(S.m7750, "Precision 7750")}.`,
    lead: "Mang bản vẽ của bạn đến test Dell Precision 7550 trực tiếp tại:",
    faq: [["Quadro T1000 có đủ cho Revit không?", "Đủ cho dự án vừa và nhỏ. Dự án lớn, nhiều chi tiết nên chọn card RTX 3000 trở lên."], ["Máy có nâng RAM được không?", "Có, Precision 7550 có nhiều khe RAM, nâng cấp thuận tiện."]],
    more: `${B.tram} · ${B.check}`,
  },
  {
    slug: S.m7550x.slice(1), name: "Dell Precision 7550 Xeon",
    title: "Dell Precision 7550 Xeon RTX 3000 4K Đà Nẵng",
    desc: "Dell Precision 7550: Xeon W-10855M, RAM 16GB, SSD 512GB, Quadro RTX 3000 6GB, màn 15.6 inch 4K. Máy trạm cho đồ họa, render tại Laptop Chính Nguyễn Đà Nẵng.",
    intro: `<strong>Dell Precision 7550</strong> bản Xeon W-10855M là cấu hình ${a("/may-tram", "máy trạm")} chuyên nghiệp: CPU Xeon 6 nhân 12 luồng, RAM 16GB, SSD 512GB, card Quadro RTX 3000 6GB và màn 15.6 inch 4K. Máy dành cho người làm đồ họa, render, dựng hình cần cả độ ổn định lẫn màn hình chi tiết. Bạn có thể xem máy tại Laptop Chính Nguyễn, cửa hàng ${home()} có 4 chi nhánh.`,
    sections: [
      ["Vì sao chọn CPU Xeon?", "Xeon W-10855M là dòng CPU dành cho máy trạm, hỗ trợ RAM ECC và được tối ưu để chạy ổn định nhiều giờ dưới tải nặng. Hiệu năng tương đương i7 cùng đời nhưng hướng tới độ tin cậy trong công việc chuyên môn."],
      ["Quadro RTX 3000 6GB và màn 4K", "RTX 3000 6GB là card chuyên nghiệp mạnh, tăng tốc render trong V-Ray, Blender, Lumion, hỗ trợ Ray Tracing. Màn 4K cho hình ảnh rất chi tiết, phù hợp chỉnh ảnh, dựng video và xem bản vẽ lớn."],
      ["Nâng cấp và độ bền", "Khung Precision 7550 có nhiều khe RAM, nhiều khe SSD, tản nhiệt lớn. Đây là máy để làm việc nặng lâu dài."],
    ],
    fit: ["Người làm render, diễn họa kiến trúc.", "Dựng video, chỉnh ảnh cần màn 4K.", "Kỹ sư cần máy trạm ổn định cao."],
    avoid: `Không cần màn 4K và Xeon, ${a(S.m7550r, "Precision 7550 i7 RTX 3000")} tiết kiệm hơn. Muốn màn lớn 17 inch có ${a(S.m7750, "Precision 7750")}.`,
    lead: "Bạn có thể mang file render đến test Dell Precision 7550 Xeon tại:",
    faq: [["Xeon có chơi game được không?", "Được, nhưng máy được tối ưu cho phần mềm chuyên nghiệp, không phải game."], ["Màn 4K có tốn pin không?", "Có, màn 4K tốn điện hơn Full HD. Máy trạm nên cắm sạc khi làm việc nặng."]],
    more: `${B.tram} · ${B.check}`,
  },
  // ───────────── Dell Inspiron ─────────────
  {
    slug: S.n5320.slice(1), name: "Dell Inspiron 5320",
    title: "Dell Inspiron 5320 i5-1240P 2.5K giá tốt Đà Nẵng",
    desc: "Dell Inspiron 5320: Core i5-1240P, RAM 16GB, SSD 512GB, màn 13.3 inch 2.5K. Laptop mỏng nhẹ cho học tập, văn phòng tại Laptop Chính Nguyễn Đà Nẵng, bảo hành 12 tháng.",
    intro: `<strong>Dell Inspiron 5320</strong> là ${a("/laptop-van-phong", "laptop văn phòng")} 13.3 inch mỏng nhẹ, cấu hình Core i5-1240P 12 nhân, RAM 16GB, SSD 512GB và màn 2.5K sắc nét. Máy hợp với sinh viên và nhân viên văn phòng cần máy gọn để mang đi hằng ngày. Bạn có thể xem máy tại Laptop Chính Nguyễn, cửa hàng ${home()} có 4 chi nhánh.`,
    sections: [
      ["Core i5-1240P và RAM 16GB", "Chip 12 nhân 16 luồng thế hệ 12 xử lý mượt Office, Excel nặng, họp online, Canva, Photoshop cơ bản. RAM 16GB giúp mở nhiều tab trình duyệt và ứng dụng cùng lúc không bị chậm."],
      ["Màn hình 13.3 inch 2.5K tỷ lệ 16:10", "Độ phân giải 2560 x 1600 cho chữ và ảnh nét hơn hẳn màn Full HD, tỷ lệ 16:10 hiển thị nhiều nội dung theo chiều dọc hơn, tiện đọc tài liệu và soạn văn bản."],
      ["Gọn nhẹ, dễ mang theo", "Thân máy 13.3 inch vừa balo nhỏ, phù hợp đi học, đi làm, cà phê làm việc. Máy có cổng USB-C hỗ trợ sạc và xuất hình."],
    ],
    fit: ["Sinh viên cần máy nhẹ, màn đẹp.", "Nhân viên văn phòng hay di chuyển.", "Người làm content, Canva, chỉnh ảnh cơ bản."],
    avoid: `Muốn chip đời mới hơn, xem ${a(S.n5330, "Inspiron 5330 i5-1340P")}. Cần màn lớn 15.6 inch, ${a(S.n5510, "Inspiron 5510")} là lựa chọn hợp lý. Xem thêm dòng ${a("/dell-inspiron", "Dell Inspiron")}.`,
    lead: "Bạn có thể cầm thử Dell Inspiron 5320 và so sánh màn hình 2.5K tại:",
    faq: [["Inspiron 5320 có nâng RAM được không?", "RAM của máy được hàn trên bo mạch, nên bản 16GB là lựa chọn hợp lý để dùng lâu."], ["Máy có chơi game được không?", "Chơi được game nhẹ như Liên Minh ở thiết lập thấp. Máy không dành cho game nặng."]],
    more: `${B.i5i7} · ${B.sv15}`,
  },
  {
    slug: S.n5330.slice(1), name: "Dell Inspiron 5330",
    title: "Dell Inspiron 5330 i5-1340P 2.5K giá tốt Đà Nẵng",
    desc: "Dell Inspiron 5330: Core i5-1340P thế hệ 13, RAM 16GB, SSD 512GB, màn 13.3 inch 2.5K. Laptop mỏng nhẹ cho văn phòng, sinh viên tại Laptop Chính Nguyễn Đà Nẵng.",
    intro: `<strong>Dell Inspiron 5330</strong> là phiên bản mới hơn của Inspiron 13 inch, dùng Core i5-1340P thế hệ 13, RAM 16GB, SSD 512GB và màn 13.3 inch 2.5K. Máy mỏng nhẹ, màn đẹp, phù hợp học tập và làm việc văn phòng. Bạn có thể xem máy tại Laptop Chính Nguyễn, địa chỉ mua ${home()} uy tín.`,
    sections: [
      ["Core i5-1340P thế hệ 13", "Chip 12 nhân 16 luồng, xung cao hơn đời 12, cho hiệu năng nhỉnh hơn khi xử lý Excel, Photoshop, dựng clip ngắn. RAM 16GB đủ cho đa nhiệm thoải mái."],
      ["Màn hình 2.5K sắc nét", "Màn 13.3 inch 2560 x 1600 tỷ lệ 16:10 cho chữ rất nét, hiển thị được nhiều nội dung hơn. Phù hợp người làm văn bản, đọc tài liệu và chỉnh ảnh cơ bản."],
      ["Thiết kế gọn cho người di chuyển", "Thân máy nhỏ gọn, dễ bỏ balo, có cổng USB-C hỗ trợ sạc và xuất hình. Thích hợp đi học, đi làm, công tác."],
    ],
    fit: ["Nhân viên văn phòng, kế toán hay di chuyển.", "Sinh viên muốn máy đời mới, nhẹ.", "Người làm content, thiết kế cơ bản."],
    avoid: `Muốn tiết kiệm hơn, ${a(S.n5320, "Inspiron 5320 i5-1240P")} có thiết kế tương tự. Cần máy doanh nhân bền hơn, xem ${a(S.e5440, "Latitude 5440")}.`,
    lead: "Bạn có thể đến xem Dell Inspiron 5330 và so sánh với bản 5320 tại:",
    faq: [["Inspiron 5330 khác gì 5320?", "Khác chủ yếu ở CPU: 5330 dùng Intel thế hệ 13, 5320 dùng thế hệ 12. Thiết kế và màn hình tương tự."], ["RAM có nâng cấp được không?", "RAM được hàn trên bo mạch, không nâng cấp được, bản 16GB đủ dùng lâu dài."]],
    more: `${B.i5i7} · ${B.sv15}`,
  },
  {
    slug: S.n5510i7.slice(1), name: "Dell Inspiron 5510 i7",
    title: "Dell Inspiron 5510 i7-11390H 16GB 512GB Đà Nẵng",
    desc: "Dell Inspiron 15 5510: Core i7-11390H, RAM 16GB, SSD 512GB, màn 15.6 inch FHD. Laptop văn phòng mạnh, màn lớn tại Laptop Chính Nguyễn Đà Nẵng, bảo hành 12 tháng.",
    intro: `<strong>Dell Inspiron 15 5510</strong> bản Core i7-11390H là ${a("/laptop-van-phong", "laptop văn phòng")} 15.6 inch mạnh mẽ, RAM 16GB, SSD 512GB, màn Full HD. Chip dòng H35 cho hiệu năng cao hơn chip U thông thường. Bạn có thể xem máy tại Laptop Chính Nguyễn, cửa hàng ${home()} có 4 chi nhánh.`,
    sections: [
      ["Core i7-11390H: chip văn phòng hiệu năng cao", "i7-11390H 4 nhân 8 luồng có xung boost tới 5.0GHz, xử lý nhanh Excel nặng, lập trình, Photoshop và dựng clip ngắn. Đồ họa Iris Xe tích hợp đủ cho chỉnh ảnh và game nhẹ."],
      ["Màn 15.6 inch, bàn phím có phím số", "Màn lớn giúp làm việc với bảng tính, nhiều cửa sổ dễ chịu hơn. Bàn phím đầy đủ phím số, tiện cho kế toán, nhập liệu."],
      ["RAM 16GB, SSD 512GB", "Cấu hình đủ dùng lâu dài, máy có khe RAM để nâng cấp khi cần."],
    ],
    fit: ["Kế toán, nhân viên văn phòng cần màn lớn.", "Sinh viên kinh tế, IT cần máy mạnh.", "Người làm Excel, dữ liệu nhiều."],
    avoid: `Ngân sách thấp hơn có ${a(S.n5510, "Inspiron 5510 i5-11300H")}. Muốn máy nhỏ gọn để mang theo, xem ${a(S.n5320, "Inspiron 5320")}.`,
    lead: "Bạn có thể đến xem và so sánh Inspiron 5510 bản i5 và i7 tại:",
    faq: [["i7-11390H khác gì i5-11300H?", "i7 có xung cao hơn và bộ nhớ đệm lớn hơn, nhanh hơn khi xử lý tác vụ nặng. Với văn phòng cơ bản, bản i5 cũng đủ dùng."], ["Máy có nâng RAM được không?", "Có, Inspiron 5510 dùng khe RAM, nâng cấp được."]],
    more: `${B.i5i7} · ${B.check}`,
  },
  // ───────────── Dell Latitude ─────────────
  {
    slug: S.e7350.slice(1), name: "Dell Latitude 7350",
    title: "Dell Latitude 7350 Ultra 5 135U 32GB 1TB Đà Nẵng",
    desc: "Dell Latitude 7350: Core Ultra 5 135U, RAM 32GB, SSD 1TB, màn 13.3 inch FHD IPS. Laptop doanh nhân đời mới tại Laptop Chính Nguyễn Đà Nẵng, bảo hành 12 tháng.",
    intro: `<strong>Dell Latitude 7350</strong> là laptop doanh nhân đời mới dùng chip Intel Core Ultra 5 135U có NPU xử lý AI, RAM 32GB, SSD 1TB và màn 13.3 inch FHD IPS. Cấu hình RAM và ổ cứng rất rộng rãi so với máy văn phòng thông thường. Bạn có thể xem máy tại Laptop Chính Nguyễn, cửa hàng ${home()} có 4 chi nhánh.`,
    sections: [
      ["Core Ultra 5 135U có gì mới?", "Dòng Core Ultra thế hệ đầu có thêm NPU chuyên xử lý tác vụ AI như làm mờ nền, khử ồn khi họp online mà không tốn nhiều pin. Hiệu năng văn phòng và đồ họa tích hợp cũng tốt hơn các đời Core i trước."],
      ["RAM 32GB và SSD 1TB", "Hiếm máy văn phòng 13 inch có sẵn 32GB RAM và 1TB SSD. Bạn có thể mở rất nhiều ứng dụng, chạy máy ảo nhẹ và lưu trữ thoải mái mà không cần nâng cấp."],
      ["Chất doanh nhân Latitude 7000", "Dòng Latitude 7000 có vỏ hoàn thiện cao cấp, bảo mật tốt, bàn phím gõ êm. Máy nhỏ gọn, dễ mang đi công tác."],
    ],
    fit: ["Doanh nhân, quản lý hay di chuyển.", "Người làm việc với nhiều ứng dụng cùng lúc.", "Ai muốn máy nhỏ gọn nhưng cấu hình rộng."],
    avoid: `Cần màn 14 inch lớn hơn, xem ${a(S.e7450, "Latitude 7450 Ultra 7")}. Muốn dạng 2-in-1 cảm ứng, có ${a(S.e7350t, "Latitude 7350 2-in-1 Ultra 7")}. Xem thêm ${a("/dell-latitude", "Dell Latitude")}.`,
    lead: "Bạn có thể đến trải nghiệm Dell Latitude 7350 tại:",
    faq: [["NPU trên Core Ultra dùng để làm gì?", "NPU xử lý các tác vụ AI như hiệu ứng camera, khử ồn micro, giúp tiết kiệm pin hơn so với chạy bằng CPU."], ["RAM 32GB có thừa không?", "Với văn phòng cơ bản thì dư, nhưng rất hữu ích cho người mở nhiều ứng dụng, chạy máy ảo hoặc dùng lâu dài."]],
    more: `${B.ultra} · ${B.i5i7}`,
  },
  {
    slug: S.e7350t.slice(1), name: "Dell Latitude 7350 2-in-1",
    title: "Dell Latitude 7350 2-in-1 Ultra 7 2.5K Touch Đà Nẵng",
    desc: "Dell Latitude 7350 2-in-1: Core Ultra 7 165U, RAM 32GB, SSD 256GB, màn 13.3 inch 2.5K cảm ứng. Laptop doanh nhân xoay gập tại Laptop Chính Nguyễn Đà Nẵng.",
    intro: `<strong>Dell Latitude 7350 2-in-1</strong> là laptop doanh nhân cảm ứng dùng Core Ultra 7 165U, RAM 32GB, SSD 256GB và màn 13.3 inch 2.5K. Máy dùng được như laptop để gõ phím và như máy tính bảng khi ghi chú, trình chiếu. Bạn có thể xem máy tại Laptop Chính Nguyễn, cửa hàng ${home()} có 4 chi nhánh.`,
    sections: [
      ["Core Ultra 7 165U và RAM 32GB", "Chip Core Ultra 7 có NPU xử lý AI, hiệu năng văn phòng mạnh và tiết kiệm pin. RAM 32GB cho đa nhiệm rất thoải mái, phù hợp người mở nhiều ứng dụng cùng lúc."],
      ["Màn 2.5K cảm ứng", "Màn 13.3 inch độ phân giải 2.5K cho chữ rất nét, cảm ứng giúp ký tài liệu, ghi chú tay, thuyết trình với khách hàng tiện lợi."],
      ["Lưu ý về SSD 256GB", "SSD 256GB đủ cho tài liệu văn phòng và lưu trữ đám mây. Nếu lưu nhiều ảnh, video nên tính thêm ổ ngoài hoặc nâng cấp SSD."],
    ],
    fit: ["Doanh nhân hay gặp khách, thuyết trình.", "Người thích ghi chú tay, ký tài liệu.", "Quản lý cần máy nhẹ, cấu hình mạnh."],
    avoid: `Cần SSD lớn hơn, xem ${a(S.e7350, "Latitude 7350 Ultra 5 32GB 1TB")}. Muốn máy tính bảng tách rời ngân sách thấp hơn, có ${a(S.e7320d, "Latitude 7320 Detachable")}.`,
    lead: "Máy cảm ứng nên được cầm thử trước khi mua. Bạn có thể trải nghiệm Latitude 7350 2-in-1 tại:",
    faq: [["Máy có dùng được bút cảm ứng không?", "Màn cảm ứng hỗ trợ bút active tương thích. Bạn nên hỏi cửa hàng phụ kiện đi kèm khi mua."], ["SSD 256GB có đủ không?", "Đủ cho văn phòng và tài liệu. Nếu lưu nhiều file đa phương tiện nên dùng thêm ổ ngoài hoặc nâng cấp."]],
    more: `${B.ultra} · ${B.pin}`,
  },
  {
    slug: S.e5510.slice(1), name: "Dell Latitude 5510",
    title: "Dell Latitude 5510 i5-10310U 15.6 inch Đà Nẵng",
    desc: "Dell Latitude 5510: Core i5-10310U, RAM 8GB, SSD 256GB, màn 15.6 inch FHD. Laptop văn phòng màn lớn giá rẻ tại Laptop Chính Nguyễn Đà Nẵng, bảo hành 12 tháng.",
    intro: `<strong>Dell Latitude 5510</strong> là ${a("/laptop-van-phong", "laptop văn phòng")} 15.6 inch giá rẻ, cấu hình Core i5-10310U, RAM 8GB, SSD 256GB, màn Full HD. Máy bền bỉ theo chuẩn doanh nghiệp, bàn phím có phím số, hợp cho kế toán và nhân viên văn phòng. Bạn có thể xem máy tại Laptop Chính Nguyễn, cửa hàng ${home()} uy tín.`,
    sections: [
      ["Hiệu năng đủ cho văn phòng", "Core i5-10310U 4 nhân 8 luồng chạy mượt Word, Excel, trình duyệt, họp Zoom, phần mềm kế toán. SSD giúp máy khởi động và mở ứng dụng nhanh."],
      ["Màn 15.6 inch và bàn phím số", "Màn lớn dễ nhìn bảng tính, bàn phím có phím số rất tiện nhập liệu. Đây là điểm mạnh so với máy 13–14 inch."],
      ["Độ bền dòng Latitude", "Latitude 5000 được thiết kế cho doanh nghiệp, bền và dễ sửa chữa. Máy có khe RAM để nâng cấp khi cần thêm đa nhiệm."],
    ],
    fit: ["Kế toán, nhân viên nhập liệu.", "Sinh viên cần máy màn lớn giá rẻ.", "Văn phòng mua máy số lượng cho nhân viên."],
    avoid: `Cần máy nhỏ gọn hơn, xem ${a(S.e5420, "Latitude 5420")} 14 inch. Cần cấu hình mạnh hơn, có ${a(S.e5440, "Latitude 5440 i7")}. Xem thêm ${a("/laptop-cu", "laptop cũ")} giá tốt.`,
    lead: "Bạn có thể đến xem Dell Latitude 5510 tại:",
    faq: [["Latitude 5510 có nâng RAM được không?", "Có, máy dùng khe RAM DDR4, nâng lên 16GB rất dễ."], ["Máy có hợp cho sinh viên không?", "Hợp nếu bạn học khối kinh tế, văn phòng và cần màn lớn. Máy hơi nặng hơn máy 14 inch nếu mang đi cả ngày."]],
    more: `${B.u10} · ${B.check}`,
  },
  // ───────────── HP ─────────────
  {
    slug: S.hp840.slice(1), name: "HP EliteBook 840 G5/G6",
    title: "HP EliteBook 840 G5/G6 i7-8850U giá rẻ Đà Nẵng",
    desc: "HP EliteBook 840 G5/G6: Core i7-8850U, RAM 8GB, SSD 256GB, màn 14 inch FHD. Laptop doanh nhân cũ giá rẻ dưới 8 triệu tại Laptop Chính Nguyễn Đà Nẵng.",
    intro: `<strong>HP EliteBook 840 G5/G6</strong> là laptop doanh nhân 14 inch giá rẻ với Core i7-8850U, RAM 8GB, SSD 256GB, màn Full HD. Vỏ nhôm, bàn phím gõ êm, máy bền theo chuẩn doanh nghiệp. Đây là lựa chọn ${a("/laptop-cu", "laptop cũ")} dưới 8 triệu đáng mua tại cửa hàng ${home()} Chính Nguyễn.`,
    sections: [
      ["Core i7-8850U cho văn phòng", "Chip 4 nhân 8 luồng chạy mượt Office, trình duyệt, họp online, phần mềm kế toán. Với nhu cầu văn phòng, i7 thế hệ 8 vẫn đáp ứng tốt."],
      ["Vỏ nhôm, bàn phím EliteBook", "Dòng EliteBook có vỏ nhôm chắc chắn, bàn phím hành trình tốt, gõ lâu không mỏi. Máy gọn 14 inch, dễ mang theo."],
      ["Nâng cấp RAM khi cần", "Máy có khe RAM, có thể nâng lên 16GB để đa nhiệm thoải mái hơn với chi phí thấp."],
    ],
    fit: ["Sinh viên cần máy giá rẻ, bền.", "Nhân viên văn phòng ngân sách dưới 8 triệu.", "Người cần máy thứ hai để làm việc."],
    avoid: `Ngân sách thấp hơn nữa, xem ${a(S.hp830, "HP 830 G6 i5")}. Muốn chip đời mới hơn, có ${a(S.e5420, "Dell Latitude 5420")}. Xem thêm ${a("/hp-elitebook", "HP EliteBook")}.`,
    lead: "Bạn có thể đến xem HP EliteBook 840 G5/G6 tại:",
    faq: [["840 G5 và G6 khác nhau thế nào?", "Hai đời có thiết kế gần như giống nhau, khác ở một số chi tiết phần cứng. Cửa hàng sẽ báo rõ đời máy khi bạn xem."], ["Máy có nâng RAM được không?", "Có, máy dùng khe RAM DDR4, nâng lên 16GB dễ dàng."]],
    more: `${B.u10} · ${B.check}`,
  },
  // ───────────── Acer ─────────────
  {
    slug: S.nitroI7.slice(1), name: "Acer Nitro 5 AN515-57 i7",
    title: "Acer Nitro 5 AN515-57 i7-11800H RTX 3050 Đà Nẵng",
    desc: "Acer Nitro 5 AN515-57: Core i7-11800H, RAM 16GB, SSD 512GB, RTX 3050, màn 15.6 inch FHD IPS 144Hz. Laptop gaming cũ giá tốt tại Laptop Chính Nguyễn Đà Nẵng.",
    intro: `<strong>Acer Nitro 5 AN515-57</strong> bản Core i7-11800H là ${a("/acer-nitro", "Acer Nitro")} mạnh nhất trong dòng: CPU 8 nhân 16 luồng, RAM 16GB, SSD 512GB, RTX 3050 và màn 15.6 inch IPS 144Hz. Máy chơi game eSports rất mượt và đủ sức làm đồ họa, dựng video. Bạn có thể test máy tại Laptop Chính Nguyễn, cửa hàng ${home()} có 4 chi nhánh.`,
    sections: [
      ["i7-11800H khác gì i5-11400H?", "i7-11800H có 8 nhân 16 luồng so với 6 nhân 12 luồng của i5-11400H, nhanh hơn rõ khi render, dựng video hoặc vừa chơi vừa stream. Nếu chỉ chơi game, chênh lệch nhỏ hơn."],
      ["RTX 3050 và màn 144Hz", "RTX 3050 chơi mượt Liên Minh, Valorant, FC Online, CS2 ở Full HD, game AAA ở thiết lập trung bình. Màn IPS 144Hz cho màu đẹp và chuyển động mượt."],
      ["Tản nhiệt NitroSense", "Nitro 5 có 2 quạt, phần mềm NitroSense chỉnh tốc độ quạt và chế độ hiệu năng, tiện khi chơi game lâu trong thời tiết nóng."],
    ],
    fit: ["Game thủ eSports kiêm làm đồ họa.", "Sinh viên IT, kỹ thuật cần CPU mạnh.", "Người dựng video, stream game."],
    avoid: `Chỉ chơi game và muốn tiết kiệm, ${a(S.nitroI5, "Nitro 5 i5-11400H GTX 1650")} rẻ hơn. Muốn card mạnh hơn, xem ${a(S.g5511, "Dell G15 5511 RTX 3060")}.`,
    lead: "Bạn có thể đến chơi thử game trên Acer Nitro 5 i7 tại:",
    faq: [["Nitro 5 i7 có nóng không?", "Máy gaming sẽ nóng khi chơi game nặng. Cửa hàng vệ sinh, tra keo tản nhiệt trước khi bàn giao."], ["Máy có nâng cấp được không?", "Có, Nitro 5 có 2 khe RAM và khe SSD trống, dễ nâng cấp."]],
    more: `${B.topg} · ${B.sv15}`,
  },
  {
    slug: S.neoI5.slice(1), name: "Acer Predator Helios Neo 16 i5",
    title: "Predator Helios Neo 16 i5-13500HX RTX 4050 Đà Nẵng",
    desc: "Acer Predator Helios Neo 16: Core i5-13500HX, RAM 16GB, SSD 512GB, RTX 4050 6GB, màn 16 inch 2.5K 165Hz. Laptop gaming mạnh tại Laptop Chính Nguyễn Đà Nẵng.",
    intro: `<strong>Acer Predator Helios Neo 16</strong> bản Core i5-13500HX là ${a("/acer-predator", "Acer Predator")} dễ tiếp cận: CPU HX 14 nhân, RAM 16GB, SSD 512GB, RTX 4050 6GB và màn 16 inch 2.5K 165Hz. Máy chơi tốt game AAA với DLSS 3 và làm việc nặng thoải mái. Bạn có thể test máy tại Laptop Chính Nguyễn, cửa hàng ${home()} có 4 chi nhánh.`,
    sections: [
      ["Core i5-13500HX mạnh thế nào?", "Chip HX có 14 nhân 20 luồng, mạnh hơn nhiều so với i5 dòng H thông thường, xử lý tốt render, dựng video, stream game. Đây là CPU ngang tầm i7 đời trước."],
      ["RTX 4050 6GB và DLSS 3", "RTX 4050 hỗ trợ DLSS 3 Frame Generation, giúp game AAA đạt khung hình cao hơn đáng kể. Màn 2.5K 165Hz cho hình sắc nét và mượt."],
      ["Màn 16 inch 2.5K", "Màn 16:10 độ phân giải 2560 x 1600 rộng rãi, vừa chơi game vừa làm việc với nhiều cửa sổ dễ chịu."],
    ],
    fit: ["Game thủ muốn chơi AAA ở màn 2.5K.", "Người dựng video, làm 3D cần CPU nhiều nhân.", "Sinh viên kỹ thuật muốn máy dùng lâu dài."],
    avoid: `Cần card mạnh hơn cho game AAA nặng, xem ${a(S.neoI9, "Helios Neo 16 i9-14900HX RTX 4060")}. Muốn RTX 4060 với giá mềm hơn, có ${a(S.shadow, "Acer Shadow SH16-41")} hoặc ${a(S.y7000p, "Legion 5 Y7000P")}.`,
    lead: "Bạn có thể đến chơi thử game trên Predator Helios Neo 16 tại:",
    faq: [["RTX 4050 có chơi được màn 2.5K không?", "Được với game eSports. Game AAA nặng nên bật DLSS hoặc giảm thiết lập để giữ khung hình ổn định."], ["Máy có nặng không?", "Máy 16 inch gaming nặng khoảng 2.6 kg, phù hợp đặt bàn hơn là mang đi cả ngày."]],
    more: `${B.r4060} · ${B.topg}`,
  },
  {
    slug: S.a715.slice(1), name: "Acer Aspire 7 A715 Ryzen 5",
    title: "Acer Aspire 7 A715 Ryzen 5 GTX 1650 144Hz Đà Nẵng",
    desc: "Acer Aspire 7 A715: Ryzen 5 5500U, RAM 8GB, SSD 256GB, GTX 1650, màn 15.6 inch FHD 144Hz. Laptop gaming giá rẻ cho sinh viên tại Laptop Chính Nguyễn Đà Nẵng.",
    intro: `<strong>Acer Aspire 7 A715</strong> bản Ryzen 5 5500U là laptop chơi game giá rẻ với card GTX 1650, RAM 8GB, SSD 256GB và màn 15.6 inch Full HD 144Hz. Máy có vỏ thanh lịch, dùng tốt cho cả học tập và chơi game nhẹ. Bạn có thể xem máy tại Laptop Chính Nguyễn, cửa hàng ${home()} có 4 chi nhánh.`,
    sections: [
      ["Ryzen 5 5500U và GTX 1650", "Chip AMD 6 nhân 12 luồng tiết kiệm điện, xử lý tốt học tập, văn phòng. GTX 1650 chơi được Liên Minh, Valorant, FC Online ở Full HD, phù hợp game thủ eSports cơ bản."],
      ["Màn 144Hz hiếm ở tầm giá", "Màn tần số quét 144Hz giúp chơi game bắn súng mượt hơn, đây là điểm cộng lớn ở mức giá phổ thông."],
      ["Thiết kế không quá hầm hố", "Aspire 7 có vỏ đơn giản, mang đi học, đi làm không lộ chất gaming. Nên nâng RAM lên 16GB nếu chơi game kèm mở nhiều ứng dụng."],
    ],
    fit: ["Sinh viên ngân sách thấp muốn chơi game.", "Người cần máy vừa học vừa giải trí.", "Ai thích máy gaming thiết kế thanh lịch."],
    avoid: `Muốn chơi game mạnh hơn, xem ${a(S.nitroI5, "Acer Nitro 5 i5-11400H GTX 1650")} hoặc ${a(S.g5515, "Dell G15 5515 RTX 3050")}. Xem thêm dòng ${a("/acer-aspire", "Acer Aspire")}.`,
    lead: "Bạn có thể đến chơi thử game trên Acer Aspire 7 tại:",
    faq: [["Aspire 7 có nâng RAM được không?", "Có, máy có khe RAM, nâng lên 16GB để chơi game và đa nhiệm tốt hơn."], ["GTX 1650 chơi được game gì?", "Chơi mượt eSports như Liên Minh, Valorant, FC Online, CS2. Game AAA cần hạ thiết lập thấp."]],
    more: `${B.topg} · ${B.sv15}`,
  },
  // ───────────── Dell XPS ─────────────
  {
    slug: S.x7390i5.slice(1), name: "Dell XPS 13 7390 i5",
    title: "Dell XPS 13 7390 i5-10210U giá tốt Đà Nẵng",
    desc: "Dell XPS 13 7390: Core i5-10210U, RAM 8GB, SSD 256GB, màn 13.3 inch FHD. Laptop cao cấp mỏng nhẹ giá dễ tiếp cận tại Laptop Chính Nguyễn Đà Nẵng, bảo hành 12 tháng.",
    intro: `<strong>Dell XPS 13 7390</strong> bản Core i5-10210U là cách tiết kiệm để sở hữu dòng ${a("/dell-xps", "Dell XPS")} cao cấp: RAM 8GB, SSD 256GB, màn 13.3 inch Full HD viền mỏng. Máy nhỏ gọn, vỏ nhôm, rất hợp để mang đi học, đi làm. Bạn có thể xem máy tại Laptop Chính Nguyễn, cửa hàng ${home()} có 4 chi nhánh.`,
    sections: [
      ["Thiết kế XPS viền mỏng", "XPS 13 7390 có viền màn rất mỏng nên thân máy nhỏ gọn hơn nhiều laptop 13 inch khác. Vỏ nhôm, mặt kê tay sợi carbon cho cảm giác cao cấp."],
      ["Core i5-10210U cho văn phòng", "Chip 4 nhân 8 luồng chạy mượt Office, trình duyệt, họp online. RAM 8GB đủ cho văn phòng cơ bản; RAM được hàn trên bo mạch nên không nâng cấp được."],
      ["Lưu ý về cổng kết nối", "Máy dùng cổng USB-C và Thunderbolt 3, bạn nên có thêm hub nếu hay dùng USB thường hoặc HDMI."],
    ],
    fit: ["Sinh viên muốn máy cao cấp giá tốt.", "Nhân viên văn phòng hay di chuyển.", "Người thích máy nhỏ gọn, vỏ nhôm."],
    avoid: `Cần RAM 16GB để đa nhiệm, chọn ${a(S.x7390, "XPS 13 7390 i7 16GB")}. Muốn đời mới hơn, xem ${a(S.x9300i5, "XPS 13 9300 i5")}.`,
    lead: "Bạn có thể đến cầm thử Dell XPS 13 7390 tại:",
    faq: [["RAM 8GB có đủ dùng không?", "Đủ cho văn phòng, học online. Nếu mở nhiều ứng dụng nặng cùng lúc nên chọn bản 16GB."], ["XPS 13 7390 có cổng USB thường không?", "Máy chủ yếu dùng USB-C, nên chuẩn bị thêm đầu chuyển hoặc hub."]],
    more: `${B.xps} · ${B.u10}`,
  },
  {
    slug: S.x9380i5.slice(1), name: "Dell XPS 13 9380 i5",
    title: "Dell XPS 13 9380 i5-8365U giá rẻ Đà Nẵng",
    desc: "Dell XPS 13 9380: Core i5-8365U, RAM 8GB, SSD 256GB, màn 13.3 inch FHD. Laptop cao cấp mỏng nhẹ dưới 10 triệu tại Laptop Chính Nguyễn Đà Nẵng, bảo hành 12 tháng.",
    intro: `<strong>Dell XPS 13 9380</strong> bản Core i5-8365U là laptop cao cấp dưới 10 triệu: RAM 8GB, SSD 256GB, màn 13.3 inch Full HD viền mỏng, vỏ nhôm. Máy rất nhỏ gọn, hợp sinh viên và người làm văn phòng hay di chuyển. Bạn có thể xem máy tại Laptop Chính Nguyễn, địa chỉ mua ${home()} uy tín.`,
    sections: [
      ["XPS 13 giá dưới 10 triệu", "XPS 13 9380 giữ thiết kế cao cấp đặc trưng: viền màn mỏng, vỏ nhôm nguyên khối, mặt kê tay carbon. Ở mức giá này, ít máy có độ hoàn thiện tương đương."],
      ["Core i5-8365U cho văn phòng", "Chip 4 nhân 8 luồng xử lý tốt Office, trình duyệt, họp online, phần mềm kế toán. RAM 8GB hàn trên bo mạch, đủ cho nhu cầu văn phòng cơ bản."],
      ["Webcam đặt ở cạnh trên", "Khác với đời 9370, XPS 13 9380 đã đưa webcam lên cạnh trên màn hình, họp online có góc quay tự nhiên hơn."],
    ],
    fit: ["Sinh viên muốn máy đẹp dưới 10 triệu.", "Nhân viên văn phòng cần máy nhẹ.", "Người làm việc ở quán cà phê, công tác."],
    avoid: `Cần RAM 16GB, chọn ${a(S.x9380, "XPS 13 9380 i7 16GB")}. Muốn chip đời mới hơn, xem ${a(S.x7390i5, "XPS 13 7390 i5")}.`,
    lead: "Bạn có thể đến cầm thử Dell XPS 13 9380 tại:",
    faq: [["XPS 13 9380 có nâng RAM được không?", "Không, RAM được hàn trên bo mạch. Nếu cần đa nhiệm nhiều, nên chọn bản 16GB."], ["Pin máy dùng được bao lâu?", "Tùy tình trạng pin từng máy. Cửa hàng sẽ báo độ chai pin khi bạn xem máy."]],
    more: `${B.u10} · ${B.xps}`,
  },
  {
    slug: S.x9300i5.slice(1), name: "Dell XPS 13 9300 i5",
    title: "Dell XPS 13 9300 i5-1035G1 FHD+ Đà Nẵng",
    desc: "Dell XPS 13 9300: Core i5-1035G1, RAM 8GB, SSD 256GB, màn 13.4 inch FHD+ 16:10. Laptop cao cấp nhỏ gọn tại Laptop Chính Nguyễn Đà Nẵng, bảo hành 12 tháng.",
    intro: `<strong>Dell XPS 13 9300</strong> bản Core i5-1035G1 có màn 13.4 inch FHD+ tỷ lệ 16:10 viền siêu mỏng, RAM 8GB, SSD 256GB. Đây là thế hệ XPS 13 đầu tiên dùng màn 16:10, nhỏ gọn mà hiển thị rộng rãi. Bạn có thể xem máy tại Laptop Chính Nguyễn, cửa hàng ${home()} có 4 chi nhánh.`,
    sections: [
      ["Màn 16:10 viền 4 cạnh siêu mỏng", "Tỷ lệ 16:10 cho thêm không gian hiển thị theo chiều dọc, tiện đọc tài liệu và soạn văn bản. Viền mỏng cả 4 cạnh giúp thân máy nhỏ gọn đáng kinh ngạc."],
      ["Core i5-1035G1 thế hệ 10", "Chip 4 nhân 8 luồng xử lý tốt văn phòng, học online, chỉnh ảnh cơ bản. RAM 8GB hàn trên bo mạch, phù hợp nhu cầu văn phòng."],
      ["Bàn phím và touchpad lớn", "XPS 13 9300 có bàn phím phím to tràn viền và touchpad rộng hơn đời trước, gõ phím và thao tác thoải mái."],
    ],
    fit: ["Sinh viên, văn phòng cần máy nhỏ gọn.", "Người hay đọc tài liệu, soạn văn bản.", "Ai muốn máy cao cấp giá hợp lý."],
    avoid: `Cần RAM 16GB và chip mạnh hơn, xem ${a(S.x9300, "XPS 13 9300 i7 16GB")}. Muốn đời mới hơn có ${a(S.x9315, "XPS 13 9315 i7")}.`,
    lead: "Bạn có thể cầm thử Dell XPS 13 9300 tại:",
    faq: [["XPS 13 9300 có cổng USB-A không?", "Không, máy chỉ có 2 cổng Thunderbolt 3 và khe thẻ nhớ, cần hub hoặc đầu chuyển khi dùng USB thường."], ["RAM có nâng cấp được không?", "Không, RAM được hàn trên bo mạch."]],
    more: `${B.xps} · ${B.i5i7}`,
  },
  {
    slug: S.x9320.slice(1), name: "Dell XPS 13 Plus 9320",
    title: "Dell XPS 13 Plus 9320 i7-1260P Touch Đà Nẵng",
    desc: "Dell XPS 13 Plus 9320: Core i7-1260P, RAM 16GB, SSD 256GB, màn 13.4 inch FHD+ cảm ứng, thiết kế tối giản. Laptop cao cấp tại Laptop Chính Nguyễn Đà Nẵng.",
    intro: `<strong>Dell XPS 13 Plus 9320</strong> là mẫu ${a("/dell-xps", "Dell XPS")} có thiết kế tương lai nhất: bàn phím tràn viền, touchpad ẩn liền mặt kính, hàng phím chức năng cảm ứng. Cấu hình Core i7-1260P 12 nhân, RAM 16GB, SSD 256GB, màn 13.4 inch FHD+ cảm ứng. Bạn có thể xem máy tại Laptop Chính Nguyễn, cửa hàng ${home()} có 4 chi nhánh.`,
    sections: [
      ["Thiết kế khác biệt của XPS 13 Plus", "Touchpad ẩn dưới mặt kính liền khối, phím chức năng là dải cảm ứng phát sáng, bàn phím phím to không khe hở. Đây là thiết kế cần làm quen nhưng rất đẹp và hiện đại."],
      ["Core i7-1260P và RAM 16GB", "Chip 12 nhân 16 luồng thế hệ 12 mạnh cho văn phòng, lập trình, chỉnh ảnh. RAM 16GB LPDDR5 tốc độ cao, đủ đa nhiệm thoải mái."],
      ["Lưu ý về SSD 256GB và cổng kết nối", "SSD 256GB phù hợp người lưu trữ đám mây. Máy chỉ có 2 cổng Thunderbolt 4, không có jack tai nghe 3.5mm, nên chuẩn bị hub hoặc tai nghe không dây."],
    ],
    fit: ["Người yêu thiết kế tối giản, hiện đại.", "Doanh nhân cần máy nhỏ gọn, mạnh.", "Lập trình viên, người làm sáng tạo."],
    avoid: `Cần SSD lớn và màn OLED, xem ${a(S.x9320big, "XPS 13 Plus 9320 32GB 1TB OLED")}. Thích bàn phím truyền thống, chọn ${a(S.x9315, "XPS 13 9315")}.`,
    lead: "Thiết kế XPS 13 Plus nên được thử bàn phím và touchpad trước khi mua. Bạn có thể trải nghiệm tại:",
    faq: [["XPS 13 Plus có jack tai nghe không?", "Không, máy bỏ jack 3.5mm, cần dùng tai nghe Bluetooth hoặc đầu chuyển USB-C."], ["Touchpad ẩn có khó dùng không?", "Touchpad rộng, phản hồi rung tốt, chỉ cần vài ngày làm quen vì không thấy viền touchpad."]],
    more: `${B.xps} · ${B.i5i7}`,
  },
];

export const PRODUCT_ARTICLES_2026_11B: ProductArticle[] = DRAFTS.map(build);

/** Sản phẩm đã có bài viết nhưng meta còn trống (đang dùng meta tự sinh). */
export const META_ONLY: { slug: string; metaTitle: string; metaDescription: string }[] = [
  {
    slug: "acer-nitro-5-an515-57-core-i5-11400h-8gb-512gb-gtx-1650-156-fhd-ips-144hz",
    metaTitle: "Acer Nitro 5 AN515-57 i5-11400H GTX 1650 Đà Nẵng",
    metaDescription: "Acer Nitro 5 AN515-57: Core i5-11400H, RAM 8GB, SSD 512GB, GTX 1650, màn 15.6 inch FHD IPS 144Hz. Laptop gaming cũ giá rẻ tại Laptop Chính Nguyễn Đà Nẵng, bảo hành 12 tháng.",
  },
  {
    slug: "lenovo-legion-5-r7000-15ahp9-ryzen-7-8745h-16gb-512gb-rtx-4060-8gb",
    metaTitle: "Legion 5 R7000 Ryzen 7 8745H RTX 4060 Đà Nẵng",
    metaDescription: "Lenovo Legion 5 R7000 15AHP9: Ryzen 7 8745H, RAM 16GB, SSD 512GB, RTX 4060 8GB, màn 15.6 inch FHD 144Hz. Laptop gaming mạnh tại Laptop Chính Nguyễn Đà Nẵng.",
  },
  {
    slug: "dell-precision-5550-core-i7-10875h-ram-16gb-ssd-512gb-nvidia-quadro-t2000-156-inch-uhd-4k-touch",
    metaTitle: "Dell Precision 5550 i7-10875H T2000 4K Touch Đà Nẵng",
    metaDescription: "Dell Precision 5550: Core i7-10875H, RAM 16GB, SSD 512GB, Quadro T2000, màn 15.6 inch 4K cảm ứng. Máy trạm mỏng nhẹ cho đồ họa tại Laptop Chính Nguyễn Đà Nẵng.",
  },
  {
    slug: "lenovo-legion-pro-5-y9000p-core-i9-13900hx-16gb-1tb-rtx-4050",
    metaTitle: "Legion Pro 5 Y9000P i9-13900HX RTX 4050 Đà Nẵng",
    metaDescription: "Lenovo Legion Pro 5 Y9000P: Core i9-13900HX, RAM 16GB, SSD 1TB, RTX 4050 6GB, màn 16 inch 2K+ 240Hz. Laptop gaming cấu hình cao tại Laptop Chính Nguyễn Đà Nẵng.",
  },
  {
    slug: "dell-latitude-7450-ultra-7-155u-ram-16gb-ssd-512gb-14-inch-fhd-ips",
    metaTitle: "Dell Latitude 7450 Ultra 7 155U 16GB 512GB Đà Nẵng",
    metaDescription: "Dell Latitude 7450: Core Ultra 7 155U, RAM 16GB, SSD 512GB, màn 14 inch FHD+ IPS. Laptop doanh nhân đời mới có NPU AI tại Laptop Chính Nguyễn Đà Nẵng, bảo hành 12 tháng.",
  },
  {
    slug: "dell-latitude-7440-core-i7-1365u-ram-32gb-ssd-512gb-14-2k5",
    metaTitle: "Dell Latitude 7440 i7-1365U 32GB 2.5K Đà Nẵng",
    metaDescription: "Dell Latitude 7440: Core i7-1365U, RAM 32GB, SSD 512GB, màn 14 inch 2.5K. Laptop doanh nhân cao cấp tại Laptop Chính Nguyễn Đà Nẵng, bảo hành 12 tháng, dùng thử 15 ngày.",
  },
  {
    slug: "dell-latitude-7440-core-i7-1370p-ram-32gb-ssd-256gb-14-fhd-touch",
    metaTitle: "Dell Latitude 7440 i7-1370P 32GB FHD Touch Đà Nẵng",
    metaDescription: "Dell Latitude 7440: Core i7-1370P, RAM 32GB, SSD 256GB, màn 14 inch FHD cảm ứng. Laptop doanh nhân hiệu năng cao tại Laptop Chính Nguyễn Đà Nẵng, bảo hành 12 tháng.",
  },
  {
    slug: "dell-precision-5560-core-i9-11950h-16gb-1tb-rtx-a2000-4gb-156-4k-touch",
    metaTitle: "Dell Precision 5560 i9-11950H RTX A2000 4K Đà Nẵng",
    metaDescription: "Dell Precision 5560: Core i9-11950H, RAM 16GB, SSD 1TB, RTX A2000 4GB, màn 15.6 inch 4K cảm ứng. Máy trạm mỏng nhẹ cao cấp tại Laptop Chính Nguyễn Đà Nẵng.",
  },
  {
    slug: "hp-victus-16-ryzen-5-6600h-ram-8gb-ssd-512gb-rtx-3050-4gb-16-fhd-144hz",
    metaTitle: "HP Victus 16 Ryzen 5 6600H RTX 3050 144Hz Đà Nẵng",
    metaDescription: "HP Victus 16: Ryzen 5 6600H, RAM 8GB, SSD 512GB, RTX 3050 4GB, màn 16 inch FHD 144Hz. Laptop gaming màn lớn giá tốt tại Laptop Chính Nguyễn Đà Nẵng.",
  },
  {
    slug: "msi-katana-15-b13vfk-core-i7-13620h-16gb-1tb-rtx-4060",
    metaTitle: "MSI Katana 15 B13VFK i7-13620H RTX 4060 Đà Nẵng",
    metaDescription: "MSI Katana 15 B13VFK: Core i7-13620H, RAM 16GB, SSD 1TB, RTX 4060 8GB, màn 15.6 inch FHD 144Hz. Laptop gaming RTX 4060 tại Laptop Chính Nguyễn Đà Nẵng.",
  },
];

/** Meta ghi sai cấu hình: chỉ thay khi DB còn đúng y giá trị sai (`from`). */
export const META_FIXES: {
  slug: string;
  fromTitle?: string;
  metaTitle?: string;
  fromDescription?: string;
  metaDescription?: string;
}[] = [
  {
    // Máy là RTX 3050 (không Ti) nhưng meta ghi 3050 Ti.
    slug: "dell-xps-9510-core-i7-11800h-ram-16gb-ssd-512b-rtx-3050-156-fhd",
    fromTitle: "Dell XPS 9510 i7-11800H/16GB/512GB/RTX 3050 Ti/FHD+ | Laptop Chính Nguyễn Đà Nẵng",
    metaTitle: "Dell XPS 15 9510 i7-11800H RTX 3050 FHD+ Đà Nẵng",
    fromDescription: "Dell XPS 9510 i7-11800H, 16GB, 512GB, RTX 3050 Ti tại Laptop Chính Nguyễn Đà Nẵng. Laptop cao cấp cho công việc, sáng tạo và đồ họa.",
    metaDescription: "Dell XPS 15 9510: Core i7-11800H, RAM 16GB, SSD 512GB, RTX 3050 4GB, màn 15.6 inch FHD+. Laptop cao cấp cho sáng tạo, đồ họa tại Laptop Chính Nguyễn Đà Nẵng.",
  },
  {
    // Máy màn 4K cảm ứng; meta cũ thiếu "Touch" và mô tả chung chung "văn phòng, học tập".
    slug: "dell-xps-15-9500-core-i7-10750h-ram-16gb-ssd-512gb-gtx-1650ti-156-inch-4k-touch",
    fromTitle: "Dell XPS 15 9500 Core i7-10750H RAM 16GB SSD 512GB GTX 1650Ti 15.6 inch 4K | Laptop Chính Nguyễn Đà Nẵng",
    metaTitle: "Dell XPS 15 9500 i7 GTX 1650Ti 4K Touch Đà Nẵng",
    fromDescription: "Dell XPS 15 9500 Core i7-10750H RAM 16GB SSD 512GB GTX 1650Ti 15.6 inch 4K tại Laptop Chính Nguyễn Đà Nẵng. Phù hợp văn phòng, học tập và công việc chuyên môn. Xem sản phẩm tại Laptop Chính Nguyễn Đà Nẵng.",
    metaDescription: "Dell XPS 15 9500: Core i7-10750H, RAM 16GB, SSD 512GB, GTX 1650Ti, màn 15.6 inch 4K cảm ứng. Laptop cao cấp cho đồ họa, chỉnh ảnh tại Laptop Chính Nguyễn Đà Nẵng.",
  },
];
