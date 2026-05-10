import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import axios from "axios";
import Swal from "sweetalert2";
import useAuth from "../../hooks/useAuth";
import useCart from "../../hooks/useCart";

const DELIVERY = { inside: 70, outside: 130 };

export default function Checkout() {
  const [zone, setZone] = useState("inside");
  const [placing, setPlacing] = useState(false);
  const { user } = useAuth();
  const { cart, loadDBCart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  //from  Buy Now single product, or cart
  const buyNowProduct = location.state?.product;
  const buyNowQty = location.state?.quantity || 1;

  const orderItems = buyNowProduct
    ? [
        {
          productId: buyNowProduct._id,
          quantity: buyNowQty,
          price:
            buyNowProduct.discountPrice > 0
              ? buyNowProduct.discountPrice
              : buyNowProduct.price,
          name: buyNowProduct.name,
          image: buyNowProduct.images?.[0]?.url,
        },
      ]
    : cart.map((item) => ({
        productId: item.product?._id || item.productId,
        quantity: item.quantity,
        price: item.price,
        name: item.product?.name || item.name,
        image: item.product?.images?.[0]?.url || item.image,
      }));

  const [form, setForm] = useState({
    name: user?.displayName || "",
    phone: "",
    address: "",
    city: "",
    note: "",
    email: user?.email || "",
  });

  useEffect(() => {
    if (user) {
      setForm((prev) => ({
        ...prev,
        name: user.displayName || prev.name,
        email: user.email || prev.email,
      }));
    }
  }, [user]);

  const delivery = DELIVERY[zone];
  const subtotal = orderItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const total = subtotal + delivery;

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async () => {
    if (!form.name || !form.phone || !form.address || !form.city) {
      Swal.fire({
        icon: "warning",
        title: "অসম্পূর্ণ তথ্য",
        text: "সব তারকা (*) চিহ্নিত ঘর পূরণ করুন।",
        confirmButtonColor: "#1f2937",
      });
      return;
    }
    if (orderItems.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "কার্ট খালি",
        text: "কোনো পণ্য নেই।",
        confirmButtonColor: "#1f2937",
      });
      return;
    }

    setPlacing(true);
    try {
      const token = user ? await user.getIdToken() : null;
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/orders`,
        {
          items: orderItems.map((i) => ({
            productId: i.productId,
            quantity: i.quantity,
          })),
          shippingAddress: {
            name: form.name,
            phone: form.phone,
            email: form.email,
            street: form.address,
            city: form.city,
            country: "Bangladesh",
          },
          paymentMethod: "cod",
          shippingCost: delivery, 
          note: form.note,
        },
        { headers },
      );
      // Cart refresh
      if (user) loadDBCart();

      Swal.fire({
        icon: "success",
        title: "অর্ডার সফল!",
        html: `আপনার অর্ডার নম্বর: <b>#${res.data.order._id.slice(-6).toUpperCase()}</b>`,
        confirmButtonColor: "#1f2937",
        confirmButtonText: "ঠিক আছে",
      }).then(() => {
        // localStorage cart clear (guest user)
        if (!user) {
          localStorage.removeItem("cart");
        }
        navigate("/orders", { state: { order: res.data.order } });
      });
    } catch (err) {
      const msg = err.response?.data?.message || "কিছু একটা সমস্যা হয়েছে।";
      const retryAfter = err.response?.data?.retryAfter;

      // next order after 1h
      if (err.response?.status === 429) {
        let timeLeft = "";
        if (retryAfter) {
          const mins = Math.ceil((retryAfter - Date.now()) / 60000);
          timeLeft = `<br/><small>আর প্রায় <b>${mins} মিনিট</b> পরে চেষ্টা করুন।</small>`;
        }
        Swal.fire({
          icon: "error",
          title: "আবার অর্ডার করা যাবে না",
          html: `${msg}${timeLeft}`,
          confirmButtonColor: "#1f2937",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "সমস্যা হয়েছে",
          text: msg,
          confirmButtonColor: "#1f2937",
        });
      }
    } finally {
      setPlacing(false);
    }
  };

  if (orderItems.length === 0)
    return (
      <div className="min-h-screen flex items-center justify-center text-center">
        <div>
          <p className="text-xl font-semibold text-gray-700">কার্ট খালি</p>
          <button
            onClick={() => navigate("/shop")}
            className="mt-4 px-6 py-2 bg-black text-white rounded-xl text-sm"
          >
            Shop করুন
          </button>
        </div>
      </div>
    );

  return (
    <div
      style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
      className="min-h-screen bg-gray-50 mt-16"
    >
      <link
        href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;500;600&display=swap"
        rel="stylesheet"
      />

      <div className="max-w-5xl mx-auto px-4 py-10 grid md:grid-cols-[1fr_380px] gap-8">
        {/* Left — Form */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-base font-semibold text-gray-800 mb-4">
              যোগাযোগের তথ্য
            </h2>
            <div className="space-y-3">
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="পুরো নাম *"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gray-400"
              />
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="মোবাইল নম্বর * (01XXXXXXXXX)"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gray-400"
              />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-base font-semibold text-gray-800 mb-4">
              ডেলিভারির ঠিকানা
            </h2>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setZone("inside")}
                  className={`py-3 rounded-xl border-2 text-sm font-medium transition-all ${
                    zone === "inside"
                      ? "border-gray-800 bg-gray-800 text-white"
                      : "border-gray-200 text-gray-600"
                  }`}
                >
                  ঢাকার ভেতরে
                  <span
                    className={`block text-xs mt-0.5 ${zone === "inside" ? "text-gray-300" : "text-gray-400"}`}
                  >
                    ৳{DELIVERY.inside}
                  </span>
                </button>
                <button
                  onClick={() => setZone("outside")}
                  className={`py-3 rounded-xl border-2 text-sm font-medium transition-all ${
                    zone === "outside"
                      ? "border-gray-800 bg-gray-800 text-white"
                      : "border-gray-200 text-gray-600"
                  }`}
                >
                  ঢাকার বাইরে
                  <span
                    className={`block text-xs mt-0.5 ${zone === "outside" ? "text-gray-300" : "text-gray-400"}`}
                  >
                    ৳{DELIVERY.outside}
                  </span>
                </button>
              </div>
              <input
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="বিস্তারিত ঠিকানা (বাড়ি/রোড/এলাকা) *"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gray-400"
              />
              <input
                name="city"
                value={form.city}
                onChange={handleChange}
                placeholder="জেলা / শহর *"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gray-400"
              />
              <textarea
                name="note"
                value={form.note}
                onChange={handleChange}
                placeholder="অর্ডার নোট (ঐচ্ছিক)"
                rows={3}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gray-400 resize-none"
              />
            </div>
          </div>

          <div className="bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-5 flex gap-4 items-start">
            <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center shrink-0">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 12l2 2 4-4M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-emerald-800 text-sm">
                ক্যাশ অন ডেলিভারি
              </p>
              <p className="text-emerald-700 text-xs mt-1 leading-relaxed">
                পণ্য হাতে পেয়ে টাকা দিন — আগে কোনো পেমেন্ট করতে হবে না।
              </p>
            </div>
          </div>
        </div>

        {/* Right — Order Summary */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <h2 className="text-base font-semibold text-gray-800 mb-4">
              অর্ডার সারসংক্ষেপ
            </h2>
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {orderItems.map((item, i) => (
                <div key={i} className="flex gap-3">
                  <div className="relative shrink-0">
                    <img
                      src={item.image || "/placeholder.jpg"}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-xl border border-gray-100"
                    />
                    <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-gray-700 text-white rounded-full text-xs flex items-center justify-center font-medium">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 line-clamp-2">
                      {item.name}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      ৳{item.price} × {item.quantity}
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-gray-800 shrink-0">
                    ৳{(item.price * item.quantity).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-100 mt-4 pt-4 space-y-2 text-sm">
              <div className="flex justify-between text-gray-500">
                <span>সাবটোটাল</span>
                <span>৳{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>ডেলিভারি চার্জ</span>
                <span>৳{delivery}</span>
              </div>
              <div className="flex justify-between font-semibold text-gray-900 text-base pt-2 border-t border-gray-100">
                <span>মোট</span>
                <span>৳{total.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={placing}
            className="w-full bg-gray-900 hover:bg-gray-700 active:scale-[0.98] text-white font-semibold py-4 rounded-2xl transition-all text-base shadow-lg disabled:opacity-50"
          >
            {placing ? "অর্ডার হচ্ছে..." : "অর্ডার কনফার্ম করুন →"}
          </button>

          <p className="text-center text-xs text-gray-400 leading-relaxed">
            অর্ডার দেওয়ার পর আমাদের টিম ফোনে কনফার্ম করবে।
          </p>
        </div>
      </div>
    </div>
  );
}
