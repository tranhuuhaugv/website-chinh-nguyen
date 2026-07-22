"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "./CartContext";
import { ProductImage } from "@/components/ProductImage";
import {
  CheckIcon,
  ClockIcon,
  MinusIcon,
  PhoneIcon,
  PlusIcon,
  ShieldIcon,
  TrashIcon,
  TruckIcon,
} from "@/components/icons";
import { formatPrice } from "@/lib/format";
import { checkoutSchema } from "@/lib/validations/checkout";
import { findVoucher } from "@/lib/vouchers";
import { SITE } from "@/lib/site";

// Giỏ hàng + thanh toán COD trên cùng 1 trang. Client Component.

const EMPTY = { name: "", phone: "", email: "", address: "", note: "" };

// initialUser lấy từ server (trang giỏ hàng đọc cookie) -> trạng thái đăng nhập
// + tên/SĐT/email hiện đúng NGAY từ lần render đầu, không phải chờ fetch.
export function CartCheckout({
  initialUser = null,
}: {
  initialUser?: {
    name: string | null;
    phone: string | null;
    email: string | null;
  } | null;
}) {
  const { items, subtotal, totalItems, updateQty, removeItem, clear, ready } =
    useCart();
  const [values, setValues] = useState({
    ...EMPTY,
    name: initialUser?.name ?? "",
    phone: initialUser?.phone ?? "",
    email: initialUser?.email ?? "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);
  const [sending, setSending] = useState(false);
  const loggedIn = Boolean(initialUser);

  // Mã giảm giá (voucher trang chủ). Giảm chỉ có hiệu lực khi đơn đủ mức tối
  // thiểu — khách bớt hàng xuống dưới mức thì tự mất giảm (có dòng nhắc).
  const [voucherInput, setVoucherInput] = useState("");
  const [appliedCode, setAppliedCode] = useState<string | null>(null);
  const [voucherError, setVoucherError] = useState("");
  const appliedVoucher = appliedCode ? findVoucher(appliedCode) : undefined;
  const voucherValid =
    !!appliedVoucher && subtotal >= appliedVoucher.minSubtotal;
  const discount = voucherValid ? appliedVoucher.amount : 0;
  const total = subtotal - discount;

  function applyVoucher() {
    const v = findVoucher(voucherInput);
    if (!v) {
      setVoucherError("Mã giảm giá không hợp lệ");
      return;
    }
    if (subtotal < v.minSubtotal) {
      setVoucherError(
        `Mã ${v.code} áp dụng cho đơn từ ${formatPrice(v.minSubtotal)}`,
      );
      return;
    }
    setVoucherError("");
    setAppliedCode(v.code);
    setVoucherInput("");
  }

  function set<K extends keyof typeof values>(key: K, val: string) {
    setValues((v) => ({ ...v, [key]: val }));
  }

  async function placeOrder() {
    const result = checkoutSchema.safeParse(values);
    if (!result.success) {
      const fe = result.error.flatten().fieldErrors;
      setErrors(
        Object.fromEntries(
          Object.entries(fe).map(([k, v]) => [k, v?.[0] ?? ""]),
        ),
      );
      return;
    }
    setErrors({});

    // Gửi đơn về server (email thông báo). Không chặn trải nghiệm nếu email lỗi.
    const payload = {
      type: "purchase" as const,
      name: values.name,
      phone: values.phone,
      email: values.email,
      address: values.address,
      note: values.note,
      items: items.map((i) => ({
        name: i.name,
        price: i.price,
        qty: i.qty,
        slug: i.slug,
      })),
      total,
      voucher: voucherValid ? appliedVoucher.code : undefined,
    };
    setSending(true);
    try {
      await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } catch {
      // bỏ qua lỗi mạng — vẫn xác nhận đơn cho khách
    }

    setSending(false);
    clear();
    setDone(true);
  }

  if (!ready) {
    return <p className="py-16 text-center text-muted">Đang tải giỏ hàng…</p>;
  }

  if (done) {
    return (
      <div className="mx-auto max-w-xl">
        <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-sm">
          {/* Đầu thẻ: dấu tích + lời cảm ơn */}
          <div className="flex flex-col items-center bg-gradient-to-b from-green-tint to-white px-6 pb-6 pt-10 text-center">
            <div className="relative mb-4 flex h-20 w-20 items-center justify-center">
              <span className="absolute inset-0 rounded-full bg-green-soft" />
              <span className="absolute inset-0 rounded-full ring-4 ring-green/15" />
              <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-green text-white shadow-sm">
                <CheckIcon className="h-7 w-7" />
              </span>
            </div>
            <h2 className="text-[22px] font-extrabold text-ink">
              Đặt hàng thành công!
            </h2>
            <p className="mx-auto mt-2 max-w-md text-[14px] leading-relaxed text-ink-2">
              Cảm ơn Quý khách đã tin tưởng và mua hàng tại{" "}
              <b className="text-green-d">{SITE.name}</b>. Đơn hàng của Quý khách
              đã được ghi nhận thành công.
            </p>
          </div>

          {/* Các mốc liên hệ / cam kết */}
          <div className="flex flex-col gap-2.5 px-6 pb-6">
            <div className="flex items-start gap-3 rounded-xl border border-line bg-bg/50 p-3.5">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-green-soft text-green">
                <PhoneIcon className="h-[18px] w-[18px]" />
              </span>
              <p className="text-[13.5px] leading-relaxed text-ink-2">
                Trong vòng <b className="text-ink">15 phút</b>, {SITE.name} sẽ
                liên hệ lại để xác nhận đơn hàng với Quý khách.
              </p>
            </div>

            <div className="flex items-start gap-3 rounded-xl border border-line bg-bg/50 p-3.5">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-green-soft text-green">
                <ClockIcon className="h-[18px] w-[18px]" />
              </span>
              <p className="text-[13.5px] leading-relaxed text-ink-2">
                Đơn đặt trong khung{" "}
                <b className="text-ink">21h30 tối đến 8h00 sáng</b> hôm sau sẽ
                được chúng tôi liên hệ xác nhận{" "}
                <b className="text-ink">trước 9h00 sáng</b> cùng ngày.
              </p>
            </div>

            <div className="flex items-start gap-3 rounded-xl border border-line bg-bg/50 p-3.5">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-green-soft text-green">
                <TruckIcon className="h-[18px] w-[18px]" />
              </span>
              <p className="text-[13.5px] leading-relaxed text-ink-2">
                Thanh toán khi nhận hàng (COD) — Quý khách được{" "}
                <b className="text-ink">kiểm tra máy trước</b> khi thanh toán.
              </p>
            </div>
          </div>

          {/* Nút hành động */}
          <div className="flex flex-col gap-2.5 border-t border-line p-6 sm:flex-row">
            <Link
              href="/"
              className="flex h-11 flex-1 items-center justify-center rounded-xl border border-line bg-white text-sm font-semibold text-ink transition hover:bg-bg"
            >
              Tiếp tục mua sắm
            </Link>
            {loggedIn && (
              <Link
                href="/tai-khoan/don-hang"
                className="flex h-11 flex-1 items-center justify-center rounded-xl bg-green text-sm font-semibold text-white transition hover:bg-green-d"
              >
                Xem đơn hàng của tôi
              </Link>
            )}
          </div>
        </div>

        {/* Hotline hỗ trợ */}
        <p className="mt-4 flex items-center justify-center gap-1.5 text-center text-[13px] text-muted">
          <ShieldIcon className="h-4 w-4 text-green" />
          Cần hỗ trợ gấp? Gọi hotline{" "}
          <a
            href={`tel:${SITE.hotlineTel}`}
            className="font-bold text-green-d hover:underline"
          >
            {SITE.hotline}
          </a>
        </p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-lg rounded-2xl border border-dashed border-line bg-white p-12 text-center">
        <p className="text-[16px] font-semibold text-ink">
          Giỏ hàng của bạn đang trống
        </p>
        <p className="mt-1 text-[13.5px] text-muted">
          Khám phá các mẫu laptop chính hãng, giá tốt.
        </p>
        <Link
          href="/"
          className="mt-5 inline-flex h-11 items-center rounded-xl bg-green px-6 text-sm font-semibold text-white transition hover:bg-green-d"
        >
          Mua sắm ngay
        </Link>
      </div>
    );
  }

  const field = (
    key: keyof typeof values,
    label: string,
    placeholder: string,
    full = false,
  ) => (
    <div className={full ? "sm:col-span-2" : ""}>
      <label className="mb-1.5 block text-[13px] font-medium text-ink">
        {label}
      </label>
      <input
        value={values[key]}
        onChange={(e) => set(key, e.target.value)}
        placeholder={placeholder}
        className={`h-11 w-full rounded-xl border bg-white px-3 text-sm text-ink outline-none transition focus:border-green ${
          errors[key] ? "border-sale" : "border-line"
        }`}
      />
      {errors[key] && <p className="mt-1 text-[12px] text-sale">{errors[key]}</p>}
    </div>
  );

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_380px]">
      {/* Cột trái: giỏ + thông tin giao hàng */}
      <div className="flex flex-col gap-6">
        {/* Giỏ hàng */}
        <section className="rounded-2xl border border-line bg-white p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-[15px] font-bold text-ink">
              Giỏ hàng ({totalItems})
            </h2>
            <button
              type="button"
              onClick={clear}
              className="text-[12.5px] text-muted transition hover:text-sale"
            >
              Xóa tất cả
            </button>
          </div>

          <div className="flex flex-col divide-y divide-line">
            {items.map((item) => (
              <div key={item.id} className="flex gap-4 py-3 first:pt-0 last:pb-0">
                <Link
                  href={`/san-pham/${item.slug}`}
                  className="h-20 w-24 shrink-0 overflow-hidden rounded-xl bg-[#F5F7F5] p-2"
                >
                  <div className="h-full w-full overflow-hidden rounded-lg">
                    <ProductImage accent={item.accent} uid={`cart-${item.id}`} />
                  </div>
                </Link>

                <div className="flex flex-1 flex-col">
                  <Link
                    href={`/san-pham/${item.slug}`}
                    className="line-clamp-2 text-[14px] font-semibold text-ink hover:text-green-d"
                  >
                    {item.name}
                  </Link>
                  <span className="mt-1 text-[15px] font-bold text-sale">
                    {formatPrice(item.price)}
                  </span>

                  <div className="mt-auto flex items-center justify-between pt-2">
                    <div className="flex items-center rounded-lg border border-line">
                      <button
                        type="button"
                        onClick={() => updateQty(item.id, item.qty - 1)}
                        aria-label="Giảm"
                        className="flex h-8 w-8 items-center justify-center text-ink-2 hover:text-green-d"
                      >
                        <MinusIcon className="h-3.5 w-3.5" />
                      </button>
                      <span className="w-9 text-center text-sm font-semibold tabular-nums">
                        {item.qty}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQty(item.id, item.qty + 1)}
                        aria-label="Tăng"
                        className="flex h-8 w-8 items-center justify-center text-ink-2 hover:text-green-d"
                      >
                        <PlusIcon className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="flex items-center gap-1.5 text-[12.5px] text-muted transition hover:text-sale"
                    >
                      <TrashIcon className="h-4 w-4" />
                      Xóa
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Thông tin giao hàng */}
        <section className="rounded-2xl border border-line bg-white p-5">
          <h2 className="mb-4 text-[15px] font-bold text-ink">
            Thông tin giao hàng
          </h2>
          {loggedIn ? (
            <div className="mb-4 flex items-center gap-2 rounded-xl bg-green-soft px-3.5 py-2.5 text-[12.5px] text-green-d">
              <CheckIcon className="h-4 w-4 shrink-0" />
              Đơn hàng sẽ được lưu vào tài khoản của bạn. Xem lại tại{" "}
              <Link href="/tai-khoan/don-hang" className="font-semibold underline">
                Đơn hàng của tôi
              </Link>
              .
            </div>
          ) : (
            <div className="mb-4 rounded-xl bg-bg px-3.5 py-2.5 text-[12.5px] text-ink-2">
              <Link href="/dang-nhap" className="font-semibold text-green-d underline">
                Đăng nhập
              </Link>{" "}
              để lưu đơn vào tài khoản và theo dõi lịch sử mua hàng.
            </div>
          )}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {field("name", "Họ và tên", "Nguyễn Văn A")}
            {field("phone", "Số điện thoại", "0912345678")}
            {field(
              "email",
              "Email (để nhận xác nhận đơn — không bắt buộc)",
              "email@example.com",
              true,
            )}
            {field(
              "address",
              "Địa chỉ nhận hàng",
              "Số nhà, đường, phường, quận, tỉnh/thành",
              true,
            )}
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-[13px] font-medium text-ink">
                Ghi chú (tuỳ chọn)
              </label>
              <textarea
                rows={3}
                value={values.note}
                onChange={(e) => set("note", e.target.value)}
                placeholder="Ghi chú cho đơn hàng..."
                className="w-full rounded-xl border border-line bg-white px-3 py-2 text-sm text-ink outline-none transition focus:border-green"
              />
            </div>
          </div>
        </section>

        {/* Phương thức thanh toán (chỉ COD) */}
        <section className="rounded-2xl border border-line bg-white p-5">
          <h2 className="mb-4 text-[15px] font-bold text-ink">
            Phương thức thanh toán
          </h2>
          <div className="flex items-center gap-3 rounded-xl border-2 border-green bg-green-tint px-4 py-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-green">
              <TruckIcon className="h-5 w-5" />
            </span>
            <div>
              <b className="text-[14px] text-ink">
                Thanh toán khi nhận hàng (COD)
              </b>
              <p className="text-[12.5px] text-ink-2">
                Kiểm tra hàng trước khi thanh toán
              </p>
            </div>
            <CheckIcon className="ml-auto h-5 w-5 text-green" />
          </div>
        </section>
      </div>

      {/* Cột phải: tóm tắt + đặt hàng */}
      <aside className="h-fit rounded-2xl border border-line bg-white p-5 lg:sticky lg:top-6">
        <h2 className="text-[15px] font-bold text-ink">Tóm tắt đơn hàng</h2>

        {/* Mã giảm giá */}
        <div className="mt-4">
          {appliedVoucher ? (
            <div
              className={`flex items-center justify-between gap-2 rounded-xl px-3.5 py-2.5 text-[13px] ${
                voucherValid
                  ? "bg-green-soft text-green-d"
                  : "bg-[#FFF7E6] text-[#92400E]"
              }`}
            >
              <span className="min-w-0">
                <b className="font-bold">{appliedVoucher.code}</b>
                {voucherValid ? (
                  <> — giảm {formatPrice(appliedVoucher.amount)}</>
                ) : (
                  <>
                    {" "}
                    cần đơn từ {formatPrice(appliedVoucher.minSubtotal)} — chưa
                    đủ điều kiện
                  </>
                )}
              </span>
              <button
                type="button"
                onClick={() => setAppliedCode(null)}
                aria-label="Bỏ mã giảm giá"
                className="shrink-0 font-semibold underline"
              >
                Bỏ mã
              </button>
            </div>
          ) : (
            <>
              <div className="flex gap-2">
                <input
                  value={voucherInput}
                  onChange={(e) => {
                    setVoucherInput(e.target.value);
                    setVoucherError("");
                  }}
                  onKeyDown={(e) => e.key === "Enter" && applyVoucher()}
                  placeholder="Mã giảm giá (VD: CN100K)"
                  className="h-10 w-full rounded-xl border border-line bg-white px-3 text-sm uppercase text-ink outline-none transition placeholder:normal-case focus:border-green"
                />
                <button
                  type="button"
                  onClick={applyVoucher}
                  className="h-10 shrink-0 rounded-xl bg-ink px-4 text-[13px] font-semibold text-white transition hover:bg-black"
                >
                  Áp dụng
                </button>
              </div>
              {voucherError && (
                <p className="mt-1.5 text-[12px] text-sale">{voucherError}</p>
              )}
            </>
          )}
        </div>

        <div className="mt-4 flex flex-col gap-2.5 border-b border-line pb-4">
          <div className="flex justify-between text-[13.5px] text-ink-2">
            <span>Tạm tính ({totalItems} sản phẩm)</span>
            <span className="font-semibold text-ink">{formatPrice(subtotal)}</span>
          </div>
          {discount > 0 && appliedVoucher && (
            <div className="flex justify-between text-[13.5px] text-ink-2">
              <span>Giảm giá ({appliedVoucher.code})</span>
              <span className="font-semibold text-green-d">
                -{formatPrice(discount)}
              </span>
            </div>
          )}
          <div className="flex justify-between text-[13.5px] text-ink-2">
            <span>Phí vận chuyển</span>
            <span className="font-medium text-green-d">Miễn phí</span>
          </div>
        </div>

        <div className="flex items-center justify-between py-4">
          <span className="text-[15px] font-bold text-ink">Tổng cộng</span>
          <span className="text-[22px] font-extrabold text-sale">
            {formatPrice(total)}
          </span>
        </div>

        <button
          type="button"
          onClick={placeOrder}
          disabled={sending}
          className="flex h-12 w-full items-center justify-center rounded-xl bg-green text-[15px] font-semibold text-white transition hover:bg-green-d disabled:cursor-not-allowed disabled:opacity-70"
        >
          {sending ? "Đang đặt hàng…" : "Đặt hàng"}
        </button>

        <p className="mt-3 flex items-center justify-center gap-1.5 text-[12px] text-muted">
          <ShieldIcon className="h-4 w-4 text-green" />
          Thông tin của bạn được bảo mật
        </p>
      </aside>
    </div>
  );
}
