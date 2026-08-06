import { SITE } from "./site";

// Nội dung các trang Chính sách (/chinh-sach/[slug]) — cấu trúc đồng nhất nên
// cho phép sửa qua admin (lưu DB, ghi đè bản mặc định dưới đây).

export interface Section {
  heading: string;
  paragraphs?: string[];
  items?: string[];
}
export interface Policy {
  title: string;
  lead: string;
  intro: string[];
  sections: Section[];
}

export const POLICIES: Record<string, Policy> = {
  "bao-hanh": {
    title: "Chính sách bảo hành",
    lead: "Cam kết bảo hành minh bạch, hỗ trợ nhanh chóng và quyền lợi tối đa cho khách hàng khi mua sắm tại Laptop Chính Nguyễn.",
    intro: [
      "Laptop Chính Nguyễn cam kết mọi sản phẩm bán ra đều là hàng chính hãng, mới 100%, nguyên seal và được hưởng đầy đủ chế độ bảo hành theo tiêu chuẩn của nhà sản xuất cũng như chính sách riêng của cửa hàng. Chúng tôi hiểu rằng sự an tâm sau khi mua hàng cũng quan trọng như chất lượng sản phẩm, vì vậy chính sách bảo hành dưới đây được xây dựng rõ ràng, dễ hiểu để khách hàng nắm được quyền lợi của mình.",
      "Trong suốt thời gian bảo hành, khách hàng được hỗ trợ kiểm tra, sửa chữa hoặc thay thế linh kiện lỗi hoàn toàn miễn phí (đối với lỗi từ nhà sản xuất). Đội ngũ kỹ thuật viên giàu kinh nghiệm của Chính Nguyễn luôn sẵn sàng tiếp nhận và xử lý nhanh nhất có thể.",
    ],
    sections: [
      {
        heading: "1. Phạm vi & đối tượng áp dụng",
        paragraphs: [
          "Chính sách bảo hành áp dụng cho tất cả sản phẩm laptop, phụ kiện và thiết bị công nghệ được mua trực tiếp tại hệ thống cửa hàng hoặc website chính thức của Laptop Chính Nguyễn.",
        ],
        items: [
          "Sản phẩm còn trong thời hạn bảo hành ghi trên hóa đơn hoặc phiếu bảo hành.",
          "Tem bảo hành, tem niêm phong của cửa hàng và nhà sản xuất còn nguyên vẹn.",
          "Số serial/IMEI trên máy trùng khớp với thông tin trên hóa đơn.",
        ],
      },
      {
        heading: "2. Thời gian bảo hành",
        paragraphs: [
          "Thời gian bảo hành được tính từ ngày mua hàng ghi trên hóa đơn và có thể khác nhau tùy theo từng nhóm sản phẩm:",
        ],
        items: [
          "Laptop, máy tính: bảo hành chính hãng 24 tháng.",
          "Pin và bộ sạc (adapter): bảo hành 12 tháng.",
          "Phụ kiện (chuột, balo, tai nghe, túi chống sốc...): bảo hành 3 - 6 tháng tùy loại.",
          "Phần mềm cài đặt kèm theo: hỗ trợ cài lại miễn phí trong suốt thời gian bảo hành máy.",
        ],
      },
      {
        heading: "3. Điều kiện được bảo hành",
        items: [
          "Sản phẩm bị lỗi kỹ thuật do nhà sản xuất trong điều kiện sử dụng bình thường, đúng hướng dẫn.",
          "Còn trong thời hạn bảo hành và đầy đủ tem, phiếu bảo hành hợp lệ.",
          "Lỗi phát sinh không do tác động vật lý hay môi trường bên ngoài.",
        ],
      },
      {
        heading: "4. Các trường hợp KHÔNG được bảo hành",
        paragraphs: [
          "Để đảm bảo quyền lợi công bằng, sản phẩm sẽ không được bảo hành miễn phí trong các trường hợp sau:",
        ],
        items: [
          "Sản phẩm hết thời hạn bảo hành hoặc không xuất trình được hóa đơn/phiếu bảo hành.",
          "Tem bảo hành, tem niêm phong bị rách, tẩy xóa, mờ số serial hoặc có dấu hiệu can thiệp.",
          "Hư hỏng do rơi vỡ, va đập, cong vênh, trầy xước, biến dạng do ngoại lực.",
          "Sản phẩm bị vào nước, ẩm ướt, ẩm mốc, gỉ sét, côn trùng xâm nhập.",
          "Cháy nổ, chập điện do sử dụng sai điện áp, nguồn điện không ổn định.",
          "Tự ý tháo lắp, sửa chữa, nâng cấp tại nơi không thuộc hệ thống ủy quyền.",
          "Hư hỏng do thiên tai, hỏa hoạn hoặc các nguyên nhân bất khả kháng khác.",
          "Hao mòn tự nhiên của pin, bàn phím, cổng kết nối theo thời gian sử dụng.",
        ],
      },
      {
        heading: "5. Chính sách 1 đổi 1 trong 30 ngày",
        paragraphs: [
          "Trong vòng 30 ngày kể từ ngày mua, nếu sản phẩm phát sinh lỗi kỹ thuật do nhà sản xuất, khách hàng được đổi mới 1 đổi 1 sản phẩm cùng loại (hoặc tương đương nếu sản phẩm đã ngừng kinh doanh).",
        ],
        items: [
          "Sản phẩm đổi phải còn đầy đủ hộp, phụ kiện, quà tặng kèm và không có dấu hiệu tác động vật lý.",
          "Trường hợp sản phẩm mới có giá cao hơn, khách hàng bù phần chênh lệch; nếu thấp hơn sẽ được hoàn lại.",
          "Sau 30 ngày, sản phẩm được bảo hành theo chế độ tiêu chuẩn (sửa chữa/thay linh kiện).",
        ],
      },
      {
        heading: "6. Quy trình tiếp nhận bảo hành",
        items: [
          `Bước 1: Liên hệ hotline ${SITE.hotline} hoặc mang sản phẩm kèm hóa đơn đến cửa hàng gần nhất.`,
          "Bước 2: Kỹ thuật viên tiếp nhận, kiểm tra và xác định nguyên nhân lỗi trong vòng 24 giờ.",
          "Bước 3: Thông báo tình trạng, phương án và thời gian xử lý cho khách hàng.",
          "Bước 4: Tiến hành sửa chữa/thay thế và bàn giao lại máy kèm phiếu bảo hành.",
        ],
      },
      {
        heading: "7. Thời gian xử lý & lưu ý",
        items: [
          "Thời gian bảo hành thông thường từ 3 - 7 ngày làm việc; trường hợp cần gửi hãng có thể lâu hơn.",
          "Khách hàng vui lòng sao lưu dữ liệu trước khi gửi bảo hành; cửa hàng không chịu trách nhiệm về dữ liệu bị mất.",
          "Ưu tiên hỗ trợ máy tạm cho một số trường hợp bảo hành kéo dài (tùy tình trạng).",
        ],
      },
    ],
  },

  "doi-tra": {
    title: "Chính sách đổi trả & hoàn tiền",
    lead: "Cho dùng thử 15 ngày, 1 đổi 1 trong 30 ngày nếu lỗi kỹ thuật — đặt sự hài lòng của khách hàng lên hàng đầu.",
    intro: [
      "Laptop Chính Nguyễn luôn mong muốn khách hàng hoàn toàn hài lòng với sản phẩm của mình. Trong trường hợp sản phẩm không đúng như mô tả, phát sinh lỗi kỹ thuật hoặc chưa phù hợp với nhu cầu, chúng tôi hỗ trợ đổi trả và hoàn tiền theo các quy định rõ ràng dưới đây.",
    ],
    sections: [
      {
        heading: "1. Nguyên tắc chung",
        items: [
          "Áp dụng cho sản phẩm mua tại hệ thống cửa hàng và website chính thức của Chính Nguyễn.",
          "Khách hàng cần xuất trình hóa đơn mua hàng hoặc thông tin đơn hàng hợp lệ.",
          "Sản phẩm đổi trả được kiểm tra bởi kỹ thuật viên trước khi xác nhận.",
        ],
      },
      {
        heading: "2. Thời gian & điều kiện đổi trả",
        paragraphs: [
          "Khách hàng được dùng thử và đổi trả trong vòng 15 ngày kể từ ngày nhận hàng; riêng lỗi kỹ thuật do nhà sản xuất được 1 đổi 1 trong vòng 30 ngày. Điều kiện áp dụng:",
        ],
        items: [
          "Sản phẩm còn nguyên vẹn, đầy đủ hộp, phụ kiện, quà tặng kèm và giấy tờ.",
          "Chưa qua sử dụng quá mức cho phép, không trầy xước, không móp méo.",
          "Chưa kích hoạt bảo hành điện tử, chưa đăng nhập tài khoản cá nhân trên thiết bị.",
          "Tem niêm phong của cửa hàng còn nguyên (nếu có).",
        ],
      },
      {
        heading: "3. Trường hợp được đổi trả / hoàn tiền",
        items: [
          "Sản phẩm bị lỗi kỹ thuật do nhà sản xuất ngay khi nhận hàng.",
          "Sản phẩm giao không đúng mẫu mã, cấu hình, màu sắc so với đơn đặt.",
          "Sản phẩm thiếu phụ kiện, thiếu quà tặng so với cam kết.",
        ],
      },
      {
        heading: "4. Sản phẩm KHÔNG áp dụng đổi trả",
        items: [
          "Sản phẩm đã qua sử dụng, có dấu hiệu hư hỏng do người dùng gây ra.",
          "Sản phẩm đã kích hoạt tài khoản, cài đặt phần mềm bản quyền theo yêu cầu riêng.",
          "Sản phẩm trong chương trình thanh lý, giảm giá đặc biệt (nếu có ghi chú riêng).",
        ],
      },
      {
        heading: "5. Hình thức & thời gian hoàn tiền",
        items: [
          "Hoàn tiền mặt tại cửa hàng hoặc chuyển khoản theo thông tin khách hàng cung cấp.",
          "Thời gian hoàn tiền từ 1 - 3 ngày làm việc sau khi xác nhận đủ điều kiện.",
          "Phí vận chuyển đổi trả do khách hàng chịu, trừ trường hợp lỗi từ phía cửa hàng.",
        ],
      },
      {
        heading: "6. Quy trình đổi trả",
        items: [
          "Bước 1: Liên hệ hotline hoặc mang sản phẩm đến cửa hàng kèm hóa đơn.",
          "Bước 2: Nhân viên kiểm tra tình trạng và xác nhận điều kiện đổi trả.",
          "Bước 3: Tiến hành đổi sản phẩm khác hoặc hoàn tiền theo thỏa thuận.",
        ],
      },
    ],
  },

  "giao-hang": {
    title: "Chính sách giao hàng",
    lead: "Giao hàng nhanh chóng, an toàn trên toàn quốc, cho phép kiểm tra sản phẩm trước khi thanh toán.",
    intro: [
      "Laptop Chính Nguyễn hỗ trợ giao hàng tận nơi trên toàn quốc với nhiều lựa chọn linh hoạt. Chúng tôi hợp tác cùng các đối tác vận chuyển uy tín để đảm bảo sản phẩm đến tay khách hàng nhanh chóng, an toàn và đúng hẹn.",
    ],
    sections: [
      {
        heading: "1. Phạm vi & thời gian giao hàng",
        items: [
          "Nội thành Đà Nẵng: giao nhanh trong vòng 2 giờ, miễn phí với đơn hàng laptop.",
          "Các tỉnh thành khác: giao trong 1 - 3 ngày làm việc tùy khu vực.",
          "Đơn đặt sau 17h, ngày lễ, Tết sẽ được xử lý vào ngày làm việc kế tiếp.",
          "Khu vực vùng sâu, vùng xa, hải đảo có thể phát sinh thêm thời gian vận chuyển.",
        ],
      },
      {
        heading: "2. Phí vận chuyển",
        items: [
          "Miễn phí vận chuyển cho hầu hết đơn hàng laptop trong nội thành Đà Nẵng.",
          "Đơn hàng liên tỉnh: phí tính theo bảng giá của đối tác vận chuyển và khối lượng.",
          "Phụ kiện nhỏ lẻ: phí vận chuyển được báo rõ trước khi khách hàng xác nhận đơn.",
        ],
      },
      {
        heading: "3. Quy định nhận hàng & kiểm tra",
        paragraphs: [
          "Chính Nguyễn khuyến khích khách hàng kiểm tra kỹ sản phẩm ngay khi nhận để đảm bảo quyền lợi:",
        ],
        items: [
          "Được đồng kiểm (mở hộp kiểm tra) trước khi thanh toán đối với đơn COD.",
          "Kiểm tra ngoại hình, tem niêm phong, phụ kiện và tình trạng sản phẩm.",
          "Nên quay video quá trình mở hộp để được hỗ trợ tốt nhất nếu có sự cố.",
          "Từ chối nhận hàng nếu phát hiện sản phẩm bị móp méo, sai mẫu, thiếu phụ kiện.",
        ],
      },
      {
        heading: "4. Trường hợp giao hàng không thành công",
        items: [
          "Nhân viên giao hàng sẽ liên hệ lại tối đa 3 lần nếu không gặp được khách.",
          "Đơn hàng sẽ được hoàn về cửa hàng nếu không liên hệ được sau 3 lần.",
          "Khách hàng vui lòng cung cấp số điện thoại và địa chỉ chính xác để tránh chậm trễ.",
        ],
      },
    ],
  },

  "tra-gop": {
    title: "Chính sách trả góp 0%",
    lead: "Sở hữu laptop chính hãng ngay hôm nay với hình thức trả góp 0% lãi suất, thủ tục nhanh gọn.",
    intro: [
      "Nhằm giúp khách hàng dễ dàng sở hữu sản phẩm mong muốn mà không cần thanh toán toàn bộ ngay, Laptop Chính Nguyễn triển khai chương trình trả góp linh hoạt qua thẻ tín dụng và các công ty tài chính uy tín, với nhiều gói lãi suất 0%.",
    ],
    sections: [
      {
        heading: "1. Các hình thức trả góp",
        items: [
          "Trả góp qua thẻ tín dụng (Visa, Mastercard, JCB...) của các ngân hàng liên kết.",
          "Trả góp qua công ty tài chính: chỉ cần CCCD/CMND và giấy tờ theo yêu cầu.",
          "Nhiều gói lãi suất 0% áp dụng theo từng sản phẩm và chương trình cụ thể.",
        ],
      },
      {
        heading: "2. Đối tượng & điều kiện",
        items: [
          "Khách hàng là công dân Việt Nam, độ tuổi từ 20 đến 60.",
          "Có CCCD/CMND còn hiệu lực và giấy tờ tùy thân theo yêu cầu của đối tác.",
          "Có khả năng tài chính để thanh toán khoản trả góp hằng tháng.",
        ],
      },
      {
        heading: "3. Hồ sơ cần chuẩn bị",
        items: [
          "Với thẻ tín dụng: thẻ tín dụng còn hạn mức và CCCD/CMND.",
          "Với công ty tài chính: CCCD/CMND kèm bằng lái xe hoặc hộ khẩu/giấy tờ bổ sung.",
          "Nhân viên sẽ hướng dẫn chi tiết hồ sơ theo từng đối tác tài chính.",
        ],
      },
      {
        heading: "4. Kỳ hạn & lãi suất",
        items: [
          "Kỳ hạn linh hoạt từ 3, 6, 9 đến 12 tháng tùy sản phẩm và đối tác.",
          "Lãi suất 0% áp dụng cho các sản phẩm và chương trình được chỉ định.",
          "Một số gói có thể phát sinh phí chuyển đổi trả góp theo quy định của đối tác.",
        ],
      },
      {
        heading: "5. Quy trình đăng ký trả góp",
        items: [
          "Bước 1: Chọn sản phẩm và hình thức trả góp tại cửa hàng hoặc qua hotline.",
          "Bước 2: Cung cấp giấy tờ, nhân viên hỗ trợ làm hồ sơ.",
          "Bước 3: Hồ sơ được duyệt nhanh trong khoảng 15 phút.",
          "Bước 4: Thanh toán khoản trả trước (nếu có) và nhận máy ngay.",
        ],
      },
    ],
  },

  "dieu-khoan": {
    title: "Điều khoản sử dụng",
    lead: "Các quy định và điều khoản khi bạn sử dụng website cùng dịch vụ của Laptop Chính Nguyễn.",
    intro: [
      "Khi truy cập và sử dụng website của Laptop Chính Nguyễn, bạn đồng ý tuân thủ các điều khoản dưới đây. Vui lòng đọc kỹ để đảm bảo quyền lợi của cả hai bên.",
    ],
    sections: [
      {
        heading: "1. Quy định chung",
        items: [
          "Bạn đồng ý cung cấp thông tin chính xác và chịu trách nhiệm về tài khoản của mình.",
          "Không sử dụng website vào mục đích vi phạm pháp luật hoặc gây hại cho hệ thống.",
          "Chúng tôi có quyền tạm ngưng hoặc chấm dứt tài khoản vi phạm điều khoản.",
        ],
      },
      {
        heading: "2. Quyền sở hữu nội dung",
        items: [
          "Mọi nội dung, hình ảnh, logo trên website thuộc quyền sở hữu của Laptop Chính Nguyễn.",
          "Không sao chép, sử dụng lại nội dung khi chưa được sự đồng ý bằng văn bản.",
        ],
      },
      {
        heading: "3. Giá cả & chương trình khuyến mãi",
        items: [
          "Giá sản phẩm và chương trình khuyến mãi có thể thay đổi mà không cần báo trước.",
          "Trong trường hợp có sai sót về giá, chúng tôi sẽ liên hệ khách hàng để xác nhận lại.",
        ],
      },
    ],
  },

  "bao-mat": {
    title: "Chính sách bảo mật thông tin",
    lead: "Laptop Chính Nguyễn tôn trọng và cam kết bảo vệ thông tin cá nhân của khách hàng.",
    intro: [
      "Chúng tôi hiểu rằng thông tin cá nhân là tài sản quan trọng của khách hàng. Chính sách này giải thích cách chúng tôi thu thập, sử dụng và bảo vệ thông tin của bạn khi mua sắm tại Laptop Chính Nguyễn.",
    ],
    sections: [
      {
        heading: "1. Thông tin chúng tôi thu thập",
        items: [
          "Thông tin liên hệ: họ tên, số điện thoại, địa chỉ, email.",
          "Thông tin đơn hàng: sản phẩm đã mua, lịch sử giao dịch.",
          "Thông tin kỹ thuật ẩn danh phục vụ cải thiện trải nghiệm website.",
        ],
      },
      {
        heading: "2. Mục đích sử dụng thông tin",
        items: [
          "Xử lý đơn hàng, giao hàng và chăm sóc khách hàng.",
          "Gửi thông báo về đơn hàng, chương trình khuyến mãi (khi được đồng ý).",
          "Nâng cao chất lượng sản phẩm và dịch vụ.",
        ],
      },
      {
        heading: "3. Cam kết bảo mật",
        items: [
          "Không mua bán, trao đổi thông tin khách hàng cho bên thứ ba khi chưa được đồng ý.",
          "Áp dụng các biện pháp kỹ thuật để bảo vệ dữ liệu khỏi truy cập trái phép.",
          "Khách hàng có quyền yêu cầu chỉnh sửa hoặc xóa thông tin cá nhân bất cứ lúc nào.",
        ],
      },
    ],
  },
};

export const POLICY_NAV = [
  { label: "Chính sách bảo hành", href: "/chinh-sach/bao-hanh" },
  { label: "Chính sách đổi trả", href: "/chinh-sach/doi-tra" },
  { label: "Chính sách giao hàng", href: "/chinh-sach/giao-hang" },
  { label: "Chính sách trả góp", href: "/chinh-sach/tra-gop" },
  { label: "Điều khoản sử dụng", href: "/chinh-sach/dieu-khoan" },
  { label: "Chính sách bảo mật", href: "/chinh-sach/bao-mat" },
];

/** Danh sách slug chính sách (để admin liệt kê). */
export const POLICY_SLUGS = Object.keys(POLICIES);

// --- Trang nội dung khác (Giới thiệu / Liên hệ) — cùng cấu trúc Policy để admin
// sửa được qua DB. Nội dung mặc định dưới đây, admin sửa sẽ ghi đè. ---
export const INFO_PAGES: Record<string, Policy> = {
  "gioi-thieu": {
    title: "Giới thiệu Laptop Chính Nguyễn",
    lead: "Cửa hàng laptop chính hãng & laptop cũ uy tín tại Đà Nẵng — giá tốt, bảo hành minh bạch, dịch vụ tận tâm.",
    intro: [
      "Laptop Chính Nguyễn là địa chỉ mua laptop tin cậy tại Đà Nẵng: chuyên laptop nhập khẩu từ USA/Japan, laptop cũ đã kiểm định kỹ và laptop mới chính hãng.",
      "Chúng tôi đặt sự hài lòng của khách hàng lên hàng đầu — tư vấn trung thực theo đúng nhu cầu và ngân sách, không chạy theo doanh số.",
    ],
    sections: [
      {
        heading: "Cam kết của chúng tôi",
        items: [
          "Máy được kiểm tra kỹ pin, màn hình, linh kiện trước khi bán.",
          "Bảo hành minh bạch, hỗ trợ đổi trả theo chính sách.",
          "Trả góp 0%, giao nhanh, cài đặt phần mềm miễn phí.",
        ],
      },
      {
        heading: "Vì sao chọn Chính Nguyễn",
        paragraphs: [
          "Nhiều năm kinh nghiệm, đội ngũ am hiểu sản phẩm, hệ thống cửa hàng tại Đà Nẵng và Hội An để bạn dễ dàng ghé thăm và trải nghiệm máy trực tiếp trước khi mua.",
        ],
      },
    ],
  },
  "lien-he": {
    title: "Kết nối với Chính Nguyễn",
    lead: "Cần tư vấn chọn máy, hỗ trợ bảo hành hay hợp tác kinh doanh? Đội ngũ của chúng tôi luôn sẵn sàng lắng nghe bạn.",
    // Đoạn văn đầu trang (tuỳ chọn). Để trống -> trang chỉ hiện kênh liên hệ +
    // cửa hàng như hiện tại. Admin thêm đoạn -> hiện phía trên.
    intro: [],
    sections: [],
  },
};

/** Base để sửa (chính sách + giới thiệu/liên hệ). */
export const EDITABLE_PAGES: Record<string, Policy> = {
  ...POLICIES,
  ...INFO_PAGES,
};

/** Đường dẫn trang khách của 1 trang sửa được. */
export function pagePublicPath(id: string): string {
  return POLICIES[id] ? `/chinh-sach/${id}` : `/${id}`;
}
