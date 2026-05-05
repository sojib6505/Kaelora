import { useState } from "react";


const dummyOrder = {
  image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&q=80",
  name: "Men's Essential Regular Fit Panjabi With A Stylish Yoke Detail",
  variant: "M / Gray",
  quantity: 1,
  price: 1850,
};

const DELIVERY = { inside: 70, outside: 130 };

export default function Checkout() {
  const [zone, setZone] = useState("inside");
  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    note: "",
  });

  const delivery = DELIVERY[zone];
  const subtotal = dummyOrder.price * dummyOrder.quantity;
  const total = subtotal + delivery;

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = () => {
    // পরে order logic এখানে
    alert("Order placed! (logic পরে connect করবে)");
  };

  return (
    <div style={{ fontFamily: "'Hind Siliguri', sans-serif" }} className="min-h-screen bg-gray-50 mt-16.5">
      <link href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;500;600&display=swap" rel="stylesheet" />

      <div className="max-w-5xl mx-auto px-4 py-10 grid md:grid-cols-[1fr_380px] gap-8">

        {/* ─── Left — Form ─── */}
        <div className="space-y-6">

          {/* Contact */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-base font-semibold text-gray-800 mb-4">Contact Information \ যোগাযোগের তথ্য</h2>
            <div className="space-y-3">
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Full Name \ পুরো নাম *"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gray-400 placeholder-gray-400"
              />
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Mobile Number \ মোবাইল নম্বর * (01XXXXXXXXX)"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gray-400 placeholder-gray-400"
              />
            </div>
          </div>

          {/* Delivery */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-base font-semibold text-gray-800 mb-4">Delivery Address\ডেলিভারির ঠিকানা</h2>
            <div className="space-y-3">

              {/* Zone selector */}
              <div className="grid grid-cols-2 gap-3 mb-1">
                <button
                  onClick={() => setZone("inside")}
                  className={`py-3 rounded-xl border-2 text-sm font-medium transition-all ${
                    zone === "inside"
                      ? "border-gray-800 bg-gray-800 text-white"
                      : "border-gray-200 text-gray-600 hover:border-gray-300"
                  }`}
                >
                  ঢাকার ভেতরে
                  <span className={`block text-xs mt-0.5 ${zone === "inside" ? "text-gray-300" : "text-gray-400"}`}>
                    Inside Dhaka \ ৳{DELIVERY.inside}
                  </span>
                </button>
                <button
                  onClick={() => setZone("outside")}
                  className={`py-3 rounded-xl border-2 text-sm font-medium transition-all ${
                    zone === "outside"
                      ? "border-gray-800 bg-gray-800 text-white"
                      : "border-gray-200 text-gray-600 hover:border-gray-300"
                  }`}
                >
                  ঢাকার বাইরে
                  <span className={`block text-xs mt-0.5 ${zone === "outside" ? "text-gray-300" : "text-gray-400"}`}>
                    Outside Dhaka \ ৳{DELIVERY.outside}
                  </span>
                </button>
              </div>

              <input
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="Address: বিস্তারিত ঠিকানা (বাড়ি/রোড/এলাকা) *"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gray-400 placeholder-gray-400"
              />
              <input
                name="city"
                value={form.city}
                onChange={handleChange}
                placeholder="city: জেলা / শহর *"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gray-400 placeholder-gray-400"
              />
              <textarea
                name="note"
                value={form.note}
                onChange={handleChange}
                placeholder="অর্ডার নোট (ঐচ্ছিক) — কোনো বিশেষ নির্দেশনা থাকলে লিখুন"
                rows={3}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gray-400 placeholder-gray-400 resize-none"
              />
            </div>
          </div>

          {/* Cash on Delivery highlight */}
          <div className="bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-5 flex gap-4 items-start">
            <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/>
                <path d="M9 12l2 2 4-4"/>
              </svg>
            </div>
            <div>
              <p className="font-semibold text-emerald-800 text-sm">ক্যাশ অন ডেলিভারি</p>
              <p className="text-emerald-700 text-xs mt-1 leading-relaxed">
                পণ্য হাতে পেয়ে টাকা দিন — আগে কোনো পেমেন্ট করতে হবে না।
                ১০০% নিরাপদ ও বিশ্বস্ত।
              </p>
            </div>
          </div>

        </div>

        {/* ─── Right — Order Summary ─── */}
        <div className="space-y-4">

          {/* Product */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <h2 className="text-base font-semibold text-gray-800 mb-4">অর্ডার সারসংক্ষেপ</h2>
            <div className="flex gap-3">
              <div className="relative flex-shrink-0">
                <img
                  src={dummyOrder.image}
                  alt={dummyOrder.name}
                  className="w-16 h-16 object-cover rounded-xl border border-gray-100"
                />
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-gray-700 text-white rounded-full text-xs flex items-center justify-center font-medium">
                  {dummyOrder.quantity}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 leading-snug line-clamp-2">{dummyOrder.name}</p>
                <p className="text-xs text-gray-400 mt-1">{dummyOrder.variant}</p>
              </div>
              <p className="text-sm font-semibold text-gray-800 flex-shrink-0">৳{dummyOrder.price.toLocaleString()}</p>
            </div>

            <div className="border-t border-gray-100 mt-4 pt-4 space-y-2 text-sm">
              <div className="flex justify-between text-gray-500">
                <span>সাবটোটাল</span>
                <span>৳{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>ডেলিভারি চার্জ <span className="text-xs">({zone === "inside" ? "ঢাকার ভেতরে" : "ঢাকার বাইরে"})</span></span>
                <span>৳{delivery}</span>
              </div>
              <div className="flex justify-between font-semibold text-gray-900 text-base pt-2 border-t border-gray-100">
                <span>মোট</span>
                <span>৳{total.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Payment method */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <p className="text-xs text-gray-500 mb-3 font-medium uppercase tracking-wide">পেমেন্ট পদ্ধতি</p>
            <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-3 border-2 border-gray-800">
              <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center flex-shrink-0">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="5" width="20" height="14" rx="2"/>
                  <line x1="2" y1="10" x2="22" y2="10"/>
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800">ক্যাশ অন ডেলিভারি</p>
                <p className="text-xs text-gray-500">পণ্য পেলে তারপর পেমেন্ট</p>
              </div>
              <div className="ml-auto w-5 h-5 rounded-full bg-gray-800 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-white"/>
              </div>
            </div>
          </div>

          {/* Place order btn */}
          <button
            onClick={handleSubmit}
            className="w-full bg-gray-900 hover:bg-gray-700 active:scale-[0.98] text-white font-semibold py-4 rounded-2xl transition-all text-base shadow-lg shadow-gray-900/20"
          >
            অর্ডার কনফার্ম করুন →
          </button>

          <p className="text-center text-xs text-gray-400 leading-relaxed">
            অর্ডার দেওয়ার পর আমাদের টিম ফোনে কনফার্ম করবে।<br/>
            কোনো সমস্যায় WhatsApp করুন।
          </p>

        </div>
      </div>
    </div>
  );
}