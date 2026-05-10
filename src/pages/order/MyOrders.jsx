import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router";
import {
  Package,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  ChevronRight,
  ArrowLeft,
} from "lucide-react";
import axios from "axios";
import useAuth from "../../hooks/useAuth";
import useAxios from "../../hooks/useAxios";

const statusConfig = {
  pending: {
    label: "অপেক্ষমাণ",
    color: "bg-yellow-100 text-yellow-700",
    icon: Clock,
    step: 0,
  },
  confirmed: {
    label: "নিশ্চিত",
    color: "bg-blue-100 text-blue-700",
    icon: CheckCircle,
    step: 1,
  },
  processing: {
    label: "প্রক্রিয়াধীন",
    color: "bg-purple-100 text-purple-700",
    icon: Package,
    step: 2,
  },
  shipped: {
    label: "পাঠানো হয়েছে",
    color: "bg-indigo-100 text-indigo-700",
    icon: Truck,
    step: 3,
  },
  delivered: {
    label: "ডেলিভারি সম্পন্ন",
    color: "bg-green-100 text-green-700",
    icon: CheckCircle,
    step: 4,
  },
  cancelled: {
    label: "বাতিল",
    color: "bg-red-100 text-red-700",
    icon: XCircle,
    step: -1,
  },
};

const steps = ["নিশ্চিত", "প্রক্রিয়াধীন", "পাঠানো হয়েছে", "ডেলিভারি সম্পন্ন"];

// Fresh axios — কোনো interceptor নেই
const publicAxios = axios.create({ baseURL: import.meta.env.VITE_API_URL });

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [phoneOrders, setPhoneOrders] = useState([]); // ✅ component এর ভেতরে
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [trackId, setTrackId] = useState("");
  const [tracking, setTracking] = useState(false);
  const [searched, setSearched] = useState(false);
  const { user } = useAuth();
  const axiosInstance = useAxios();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.order) {
      setSelectedOrder(location.state.order);
      window.history.replaceState({}, document.title);
    }
  }, []);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    axiosInstance
      .get("/orders/my")
      .then((res) => setOrders(res.data.orders || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user]);

  const handleTrack = async () => {
    if (!trackId.trim()) return;
    setTracking(true);
    setPhoneOrders([]);
    setSelectedOrder(null);
    setSearched(false);
    try {
      const input = trackId.trim();
      if (input.startsWith("01") && input.length === 11) {
        // Phone number search
        const res = await publicAxios.get(`/orders/phone/${input}`);
        setPhoneOrders(res.data.orders || []);
      } else {
        // Order ID  search
        const res = await publicAxios.get(`/orders/track/${input}`);
        setSelectedOrder(res.data.order);
      }
    } catch {
      setSearched(true);
    } finally {
      setTracking(false);
    }
  };

  const handleBack = () => {
    setSelectedOrder(null);
    if (user) {
      setLoading(true);
      axiosInstance
        .get("/orders/my")
        .then((res) => setOrders(res.data.orders || []))
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center mt-16">
        <div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin" />
      </div>
    );

  if (selectedOrder)
    return <OrderDetail order={selectedOrder} onBack={handleBack} />;

  return (
    <div className="min-h-screen bg-gray-50 mt-16">
      <div className="max-w-3xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold font-serif mb-2">আমার অর্ডার</h1>
        <p className="text-sm text-gray-500 mb-8">
          আপনার সকল অর্ডারের তথ্য এখানে দেখুন
        </p>

        {/* Guest Track */}
        {!user && (
          <div className="bg-white rounded-2xl p-5 border border-gray-100 mb-6">
            <p className="font-semibold text-sm mb-1">অর্ডার ট্র্যাক করুন</p>
            <p className="text-xs text-gray-400 mb-3">
              মোবাইল নম্বর দিয়ে খুঁজুন
            </p>
            <div className="flex gap-2">
              <input
                value={trackId}
                onChange={(e) => setTrackId(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleTrack()}
                placeholder="01XXXXXXXXX "
                className="flex-1 border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black"
              />
              <button
                onClick={handleTrack}
                disabled={tracking}
                className="bg-black text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-800 transition disabled:opacity-50"
              >
                {tracking ? "খুঁজছে..." : "ট্র্যাক"}
              </button>
            </div>

            {/* Order na thakle */}
            {searched && phoneOrders.length === 0 && !selectedOrder && (
              <div className="mt-6 text-center py-10 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
                  <Package size={28} className="text-gray-300" />
                </div>
                <p className="font-semibold text-gray-700">
                  কোনো অর্ডার পাওয়া যায়নি
                </p>
                <p className="text-sm text-gray-400 mt-1 mb-4">
                  এই নম্বর তে কোনো অর্ডার নেই
                </p>
                <button
                  onClick={() => navigate("/shop")}
                  className="px-6 py-2.5 bg-black text-white rounded-xl text-sm font-medium hover:bg-gray-800 transition"
                >
                  এখনই অর্ডার করুন
                </button>
              </div>
            )}
            <p className="text-xs text-gray-400 mt-2">
              লগইন করে অর্ডার করলে  search ছাড়াই  অর্ডার দেখতে পারবেন।।{" "}
              <span
                onClick={() => navigate("/auth")}
                className="text-black underline cursor-pointer"
              >
                লগইন করুন
              </span>
            </p>
          </div>
        )}

        {/* Phone দিয়ে পাওয়া orders */}
        {phoneOrders.length > 0 && (
          <div className="space-y-3 mb-6">
            <p className="text-sm font-semibold text-gray-700">
              {phoneOrders.length}টি অর্ডার পাওয়া গেছে
            </p>
            {phoneOrders.map((order) => {
              const status =
                statusConfig[order.orderStatus] || statusConfig.pending;
              const StatusIcon = status.icon;
              return (
                <div
                  key={order._id}
                  onClick={() => setSelectedOrder(order)}
                  className="bg-white rounded-2xl p-5 border border-gray-100 cursor-pointer hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-xs text-gray-400">অর্ডার নম্বর</p>
                      <p className="font-mono font-bold">
                        #{order._id.slice(-8).toUpperCase()}
                      </p>
                    </div>
                    <span
                      className={`flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full ${status.color}`}
                    >
                      <StatusIcon size={12} /> {status.label}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400 text-xs">
                      {new Date(order.createdAt).toLocaleDateString("bn-BD", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                    <span className="font-bold">
                      ৳{order.totalAmount?.toLocaleString()}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {user && orders.length === 0 && (
          <div className="text-center py-20">
            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <Package size={36} className="text-gray-300" />
            </div>
            <p className="text-lg font-semibold text-gray-700">
              কোনো অর্ডার নেই
            </p>
            <p className="text-sm text-gray-400 mt-1 mb-6">
              এখনো কোনো অর্ডার করা হয়নি
            </p>
            <button
              onClick={() => navigate("/shop")}
              className="px-6 py-3 bg-black text-white rounded-xl text-sm font-medium hover:bg-gray-800 transition"
            >
              Shop করুন
            </button>
          </div>
        )}

        <div className="space-y-3">
          {orders.map((order) => {
            const status =
              statusConfig[order.orderStatus] || statusConfig.pending;
            const StatusIcon = status.icon;
            return (
              <div
                key={order._id}
                onClick={() => setSelectedOrder(order)}
                className="bg-white rounded-2xl p-5 border border-gray-100 cursor-pointer hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-xs text-gray-400">অর্ডার নম্বর</p>
                    <p className="font-mono font-bold">
                      #{order._id.slice(-8).toUpperCase()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full ${status.color}`}
                    >
                      <StatusIcon size={12} /> {status.label}
                    </span>
                    <ChevronRight size={16} className="text-gray-400" />
                  </div>
                </div>
                <div className="flex gap-2 mb-3">
                  {order.items?.slice(0, 3).map((item, i) => (
                    <div
                      key={i}
                      className="w-12 h-12 rounded-lg overflow-hidden bg-gray-50 border flex-shrink-0"
                    >
                      {item.productImage ? (
                        <img
                          src={item.productImage}
                          alt={item.productName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-200">
                          <Package size={16} />
                        </div>
                      )}
                    </div>
                  ))}
                  {order.items?.length > 3 && (
                    <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center text-xs text-gray-500 font-medium">
                      +{order.items.length - 3}
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400 text-xs">
                    {new Date(order.createdAt).toLocaleDateString("bn-BD", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                  <span className="font-bold">
                    ৳{order.totalAmount?.toLocaleString()}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function OrderDetail({ order, onBack }) {
  const status = statusConfig[order.orderStatus] || statusConfig.pending;
  const currentStep = status.step;
  const isCancelled = order.orderStatus === "cancelled";
  const shippingDisplay =
    order.shippingCost === 0
      ? "ফ্রি"
      : `৳${order.shippingCost?.toLocaleString()}`;

  return (
    <div className="min-h-screen bg-gray-50 mt-16">
      <div className="max-w-2xl mx-auto px-4 py-10">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-black transition mb-6"
        >
          <ArrowLeft size={16} /> অর্ডার লিস্টে ফিরুন
        </button>

        <div className="bg-white rounded-2xl p-5 border border-gray-100 mb-4">
          <div className="flex items-center justify-between mb-1">
            <p className="text-xs text-gray-400">অর্ডার নম্বর</p>
            <span
              className={`text-xs font-semibold px-3 py-1 rounded-full ${status.color}`}
            >
              {status.label}
            </span>
          </div>
          <p className="font-mono font-bold text-lg">
            #{order._id.slice(-8).toUpperCase()}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {new Date(order.createdAt).toLocaleString("bn-BD")}
          </p>
        </div>

        {!isCancelled && (
          <div className="bg-white rounded-2xl p-5 border border-gray-100 mb-4">
            <p className="font-semibold text-sm mb-5">অর্ডারের অগ্রগতি</p>
            <div className="relative">
              <div className="absolute top-4 left-4 right-4 h-0.5 bg-gray-100" />
              <div
                className="absolute top-4 left-4 h-0.5 bg-black transition-all duration-500"
                style={{
                  width: `${currentStep > 0 ? ((currentStep - 1) / (steps.length - 1)) * 100 : 0}%`,
                }}
              />
              <div className="relative flex justify-between">
                {steps.map((step, i) => {
                  const done = i < currentStep;
                  const active = i === currentStep - 1;
                  return (
                    <div
                      key={i}
                      className="flex flex-col items-center gap-2 w-16"
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center z-10 transition-all
                        ${done || active ? "bg-black text-white" : "bg-gray-100 text-gray-400"}`}
                      >
                        {done ? (
                          <CheckCircle size={16} />
                        ) : (
                          <span className="text-xs font-bold">{i + 1}</span>
                        )}
                      </div>
                      <p
                        className={`text-[10px] text-center leading-tight ${done || active ? "text-black font-medium" : "text-gray-400"}`}
                      >
                        {step}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl p-5 border border-gray-100 mb-4">
          <p className="font-semibold text-sm mb-4">অর্ডারকৃত পণ্য</p>
          <div className="space-y-3">
            {order.items?.map((item, i) => (
              <div key={i} className="flex gap-3 items-center">
                <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-50 border flex-shrink-0">
                  {item.productImage ? (
                    <img
                      src={item.productImage}
                      alt={item.productName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-200">
                      <Package size={18} />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium line-clamp-2">
                    {item.productName}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    পরিমাণ: {item.quantity} × ৳{item.price?.toLocaleString()}
                  </p>
                </div>
                <p className="font-bold text-sm flex-shrink-0">
                  ৳{(item.price * item.quantity)?.toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-white rounded-2xl p-5 border border-gray-100">
            <p className="font-semibold text-sm mb-3">ডেলিভারির ঠিকানা</p>
            <div className="text-sm text-gray-600 space-y-1">
              <p className="font-medium text-black">
                {order.shippingAddress?.name}
              </p>
              <p>{order.shippingAddress?.phone}</p>
              <p>{order.shippingAddress?.street}</p>
              <p>{order.shippingAddress?.city}</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-gray-100">
            <p className="font-semibold text-sm mb-3">পেমেন্ট তথ্য</p>
            <div className="text-sm text-gray-600 space-y-2">
              <div className="flex justify-between">
                <span>পদ্ধতি</span>
                <span className="font-medium text-black capitalize">
                  {order.paymentMethod}
                </span>
              </div>
              <div className="flex justify-between">
                <span>স্ট্যাটাস</span>
                <span
                  className={`font-medium capitalize ${
                    order.paymentStatus === "paid"
                      ? "text-green-600"
                      : order.paymentStatus === "failed"
                        ? "text-red-500"
                        : "text-yellow-600"
                  }`}
                >
                  {order.paymentStatus}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gray-100 mb-4">
          <p className="font-semibold text-sm mb-3">মূল্য সারসংক্ষেপ</p>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-gray-500">
              <span>সাবটোটাল</span>
              <span>৳{order.subtotal?.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-gray-500">
              <span>ডেলিভারি চার্জ</span>
              <span
                className={order.shippingCost === 0 ? "text-green-500" : ""}
              >
                {shippingDisplay}
              </span>
            </div>
            <div className="flex justify-between font-bold text-base border-t pt-2">
              <span>মোট</span>
              <span>৳{order.totalAmount?.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {order.statusHistory?.length > 0 && (
          <div className="bg-white rounded-2xl p-5 border border-gray-100">
            <p className="font-semibold text-sm mb-4">অর্ডারের ইতিহাস</p>
            <div className="space-y-3">
              {[...order.statusHistory].reverse().map((h, i) => (
                <div key={i} className="flex gap-3 items-start">
                  <div className="w-2 h-2 rounded-full bg-black mt-1.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium">
                      {statusConfig[h.status]?.label || h.status}
                    </p>
                    {h.note && (
                      <p className="text-xs text-gray-400">{h.note}</p>
                    )}
                    <p className="text-xs text-gray-400">
                      {new Date(h.updatedAt).toLocaleString("bn-BD")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
