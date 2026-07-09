import { redirect } from "next/navigation";

// Thanh toán đã gộp vào trang giỏ hàng -> chuyển hướng về /gio-hang.
export default function CheckoutPage() {
  redirect("/gio-hang");
}
