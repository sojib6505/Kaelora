import { useState } from "react";
import { useNavigate } from "react-router";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";
import useCart from "../../hooks/useCart";
import useAuth from "../../hooks/useAuth";
import axios from "axios";
import ScrollToTop from "../../components/scrollToTop/ScrollToTop";

export default function CartPage() {
  const { cart, setCart, cartCount } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [updating, setUpdating] = useState(null);

  const subtotal = cart.reduce((sum, item) => {
    const price = item.price || item.product?.price || 0;
    return sum + price * item.quantity;
  }, 0);

  const total = subtotal;

  const getItemDetails = (item) => ({
    id: item.product?._id || item.productId,
    name: item.product?.name || item.name || "Product",
    image: item.product?.images?.[0]?.url || item.image || "",
    price: item.price || item.product?.price || 0,
    stock: item.product?.stock || 99,
  });

  const updateQty = async (item, newQty) => {
    const details = getItemDetails(item);
    if (newQty < 1) return;
    if (newQty > details.stock) return;
    setUpdating(details.id);

    if (user) {
      try {
        const token = await user.getIdToken();
        const res = await axios.put(
          `${import.meta.env.VITE_API_URL}/cart/update`,
          { productId: details.id, quantity: newQty },
          { headers: { Authorization: `Bearer ${token}` } },
        );
        setCart(res.data.cart?.items || []);
      } catch (err) {
        console.error(err);
      }
    } else {
      const local = JSON.parse(localStorage.getItem("cart") || "[]");
      const updated = local.map((i) =>
        i.productId === details.id ? { ...i, quantity: newQty } : i,
      );
      localStorage.setItem("cart", JSON.stringify(updated));
      setCart(updated);
    }
    setUpdating(null);
  };

  const removeItem = async (item) => {
    const details = getItemDetails(item);
    setUpdating(details.id);

    if (user) {
      try {
        const token = await user.getIdToken();
        const res = await axios.delete(
          `${import.meta.env.VITE_API_URL}/cart/remove/${details.id}`,
          { headers: { Authorization: `Bearer ${token}` } },
        );
        setCart(res.data.cart?.items || []);
      } catch (err) {
        console.error(err);
      }
    } else {
      const local = JSON.parse(localStorage.getItem("cart") || "[]");
      const updated = local.filter((i) => i.productId !== details.id);
      localStorage.setItem("cart", JSON.stringify(updated));
      setCart(updated);
    }
    setUpdating(null);
  };

  const clearAll = async () => {
    if (!confirm("সব পণ্য মুছে ফেলবেন?")) return;
    if (user) {
      try {
        const token = await user.getIdToken();
        await axios.delete(`${import.meta.env.VITE_API_URL}/cart/clear`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch (err) {
        console.error(err);
      }
    } else {
      localStorage.removeItem("cart");
    }
    setCart([]);
  };

  if (cart.length === 0)
    return (
      <>
       <ScrollToTop/>
        <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 mt-16">
          <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mb-6">
            <ShoppingBag size={40} className="text-gray-300" />
          </div>
          <h2 className="text-2xl font-bold font-serif mb-2">কার্ট খালি</h2>
          <p className="text-gray-400 text-sm mb-6">কোনো পণ্য যোগ করা হয়নি</p>
          <button
            onClick={() => navigate("/shop")}
            className="px-8 py-3 bg-black text-white rounded-xl font-medium hover:bg-gray-800 transition flex items-center gap-2"
          >
            পণ্য যোগ করুন <ArrowRight size={16} />
          </button>
        </div>
      </>
    );

  return (
    <>
      <ScrollToTop />
      <div className="min-h-screen bg-gray-50 mt-16">
        <div className="max-w-5xl mx-auto px-4 py-10">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold font-serif">আমার কার্ট</h1>
              <p className="text-sm text-gray-500 mt-1">{cartCount} টি পণ্য</p>
            </div>
            <button
              onClick={clearAll}
              className="text-xs text-red-400 hover:text-red-600 flex items-center gap-1 transition"
            >
              <Trash2 size={13} /> সব মুছুন
            </button>
          </div>

          <div className="grid lg:grid-cols-[1fr_320px] gap-6">
            {/* Cart Items */}
            <div className="space-y-3">
              {cart.map((item, i) => {
                const details = getItemDetails(item);
                const isUpdating = updating === details.id;

                return (
                  <div
                    key={i}
                    className={`bg-white rounded-2xl p-4 border border-gray-100 flex gap-4 transition-opacity ${isUpdating ? "opacity-50" : ""}`}
                  >
                    {/* Image */}
                    <div
                      onClick={() => navigate(`/product/${details.id}`)}
                      className="w-20 h-20 rounded-xl overflow-hidden bg-gray-50 border shrink-0 cursor-pointer"
                    >
                      {details.image ? (
                        <img
                          src={details.image}
                          alt={details.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-200">
                          <ShoppingBag size={24} />
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p
                        onClick={() => navigate(`/product/${details.id}`)}
                        className="font-medium text-sm line-clamp-2 cursor-pointer hover:text-red-500 transition"
                      >
                        {details.name}
                      </p>
                      <p className="text-base font-bold mt-1">
                        ৳{details.price.toLocaleString()}
                      </p>

                      {/* Qty controls */}
                      <div className="flex items-center gap-2 mt-3">
                        <button
                          onClick={() => updateQty(item, item.quantity - 1)}
                          disabled={isUpdating || item.quantity <= 1}
                          className="w-7 h-7 rounded-lg border flex items-center justify-center hover:bg-gray-50 disabled:opacity-40 transition"
                        >
                          <Minus size={13} />
                        </button>
                        <span className="w-8 text-center text-sm font-semibold">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQty(item, item.quantity + 1)}
                          disabled={
                            isUpdating || item.quantity >= details.stock
                          }
                          className="w-7 h-7 rounded-lg border flex items-center justify-center hover:bg-gray-50 disabled:opacity-40 transition"
                        >
                          <Plus size={13} />
                        </button>
                      </div>
                    </div>

                    {/* Right side */}
                    <div className="flex flex-col items-end justify-between shrink-0">
                      <button
                        onClick={() => removeItem(item)}
                        disabled={isUpdating}
                        className="p-1.5 rounded-lg hover:bg-red-50 text-gray-300 hover:text-red-400 transition"
                      >
                        <Trash2 size={16} />
                      </button>
                      <p className="text-sm font-bold text-gray-800">
                        ৳{(details.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Summary */}
            <div className="space-y-4">
              <div className="bg-white rounded-2xl p-5 border border-gray-100 sticky top-24">
                <h2 className="font-semibold mb-4">অর্ডার সারসংক্ষেপ</h2>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between text-gray-500">
                    <span>মোট পণ্য ({cartCount}টি)</span>
                    <span>৳{subtotal.toLocaleString()}</span>
                  </div>
                  <p className="text-xs text-gray-400 bg-gray-50 p-2 rounded-lg text-center">
                    ডেলিভারি চার্জ চেকআউটে যোগ হবে
                  </p>
                  <div className="flex justify-between font-bold text-base border-t pt-3">
                    <span>সাবটোটাল</span>
                    <span>৳{total.toLocaleString()}</span>
                  </div>
                </div>

                <button
                  onClick={() => navigate("/checkout")}
                  className="w-full mt-5 bg-black text-white py-3.5 rounded-xl font-semibold hover:bg-gray-800 transition flex items-center justify-center gap-2"
                >
                  চেকআউট করুন <ArrowRight size={16} />
                </button>

                <button
                  onClick={() => navigate("/shop")}
                  className="w-full mt-2 border py-3 rounded-xl text-sm font-medium hover:bg-gray-50 transition"
                >
                  আরো কেনাকাটা করুন
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
