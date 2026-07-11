"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useCart } from "./CartContext";
import { ProductImage } from "@/components/ProductImage";
import {
  CheckIcon,
  MinusIcon,
  PlusIcon,
  ShieldIcon,
  TrashIcon,
  TruckIcon,
} from "@/components/icons";
import { formatPrice } from "@/lib/format";
import { checkoutSchema } from "@/lib/validations/checkout";

// Giỏ hàng + thanh toán COD trên cùng 1 trang. Client Component.
// TODO: tạo đơn hàng (Prisma) khi có backend.

const EMPTY = { name: "", phone: "", address: "", note: "" };

export function CartCheckout() {
  const { items, subtotal, totalItems, updateQty, removeItem, clear, ready } =
    useCart();
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  // Đã đăng nhập: điền sẵn tên/SĐT cho khách và báo đơn sẽ lưu vào tài khoản.
  useEffect(() => {
    let alive = true;
    fetch("/api/me")
      .then((r) => r.json())
      .then((d) => {
        if (!alive || !d?.user) return;
        setLoggedIn(true);
        setValues((v) => ({
          ...v,
          name: v.name || (d.user.name ?? ""),
          phone: v.phone || (d.user.phone ?? ""),
        }));
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

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
      address: values.address,
      note: values.note,
      items: items.map((i) => ({
        name: i.name,
        price: i.price,
        qty: i.qty,
        slug: i.slug,
      })),
      total: subtotal,
    };
    try {
      await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } catch {
      // bỏ qua lỗi mạng — vẫn xác nhận đơn cho khách
    }

    clear();
    setDone(true);
  }

  if (!ready) {
    return <p className="py-16 text-center text-muted">Đang tải giỏ hàng…</p>;
  }

  if (done) {
    return (
      <div className="mx-auto max-w-lg rounded-2xl border border-line bg-white p-12 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-soft text-green">
          <CheckIcon className="h-8 w-8" />
        </div>
        <p className="text-[18px] font-bold text-ink">Đặt hàng thành công!</p>
        <p className="mx-auto mt-2 max-w-sm text-[13.5px] text-muted">
          Cảm ơn bạn đã đặt hàng. Chúng tôi sẽ gọi xác nhận sớm. Thanh toán khi
          nhận hàng (COD).
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex h-11 items-center rounded-xl bg-green px-6 text-sm font-semibold text-white transition hover:bg-green-d"
        >
          Tiếp tục mua sắm
        </Link>
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

        <div className="mt-4 flex flex-col gap-2.5 border-b border-line pb-4">
          <div className="flex justify-between text-[13.5px] text-ink-2">
            <span>Tạm tính ({totalItems} sản phẩm)</span>
            <span className="font-semibold text-ink">{formatPrice(subtotal)}</span>
          </div>
          <div className="flex justify-between text-[13.5px] text-ink-2">
            <span>Phí vận chuyển</span>
            <span className="font-medium text-green-d">Miễn phí</span>
          </div>
        </div>

        <div className="flex items-center justify-between py-4">
          <span className="text-[15px] font-bold text-ink">Tổng cộng</span>
          <span className="text-[22px] font-extrabold text-sale">
            {formatPrice(subtotal)}
          </span>
        </div>

        <button
          type="button"
          onClick={placeOrder}
          className="flex h-12 w-full items-center justify-center rounded-xl bg-green text-[15px] font-semibold text-white transition hover:bg-green-d"
        >
          Đặt hàng
        </button>

        <p className="mt-3 flex items-center justify-center gap-1.5 text-[12px] text-muted">
          <ShieldIcon className="h-4 w-4 text-green" />
          Thông tin của bạn được bảo mật
        </p>
      </aside>
    </div>
  );
}
