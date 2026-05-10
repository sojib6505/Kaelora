import { useEffect, useState } from "react";
import { ShoppingBag, Users, Package, TrendingUp, Clock, CheckCircle, XCircle, Truck, AlertTriangle } from "lucide-react";
import useAxios from "../../hooks/useAxios";
import useAuth from "../../hooks/useAuth";

const statusColors = {
  pending: "bg-yellow-100 text-yellow-700",
  confirmed: "bg-blue-100 text-blue-700",
  processing: "bg-purple-100 text-purple-700",
  shipped: "bg-indigo-100 text-indigo-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const axiosInstance = useAxios();
  const {user} = useAuth()

 useEffect(() => {
    if (!user) return; 
    axiosInstance.get("/admin/dashboard")
      .then(res => setData(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user]);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const stats = [
    { label: "Total Orders", value: data?.stats?.totalOrders || 0, icon: ShoppingBag, color: "bg-blue-50 text-blue-600" },
    { label: "Total Products", value: data?.stats?.totalProducts || 0, icon: Package, color: "bg-green-50 text-green-600" },
    { label: "Total Users", value: data?.stats?.totalUsers || 0, icon: Users, color: "bg-purple-50 text-purple-600" },
    { label: "Total Revenue", value: `৳${(data?.stats?.totalRevenue || 0).toLocaleString()}`, icon: TrendingUp, color: "bg-amber-50 text-amber-600" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Welcome back, here's what's happening.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white rounded-2xl p-5 border border-gray-100">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${stat.color}`}>
                <Icon size={20} />
              </div>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
            </div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="p-5 border-b border-gray-100">
            <h2 className="font-semibold">Recent Orders</h2>
          </div>
          <div className="divide-y divide-gray-50">
            {data?.recentOrders?.length === 0 && (
              <p className="text-sm text-gray-400 p-5">No orders yet</p>
            )}
            {data?.recentOrders?.map((order) => (
              <div key={order._id} className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">#{order._id.slice(-6).toUpperCase()}</p>
                  <p className="text-xs text-gray-500">{order.user?.name || order.guestEmail || "Guest"}</p>
                </div>
                <div className="text-right">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColors[order.orderStatus]}`}>
                    {order.orderStatus}
                  </span>
                  <p className="text-sm font-bold mt-1">৳{order.totalAmount}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Low Stock + Order Status */}
        <div className="space-y-4">
          {/* Order by status */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <h2 className="font-semibold mb-4">Orders by Status</h2>
            <div className="space-y-2">
              {data?.ordersByStatus?.map((s) => (
                <div key={s._id} className="flex items-center justify-between">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium capitalize ${statusColors[s._id] || "bg-gray-100 text-gray-600"}`}>
                    {s._id}
                  </span>
                  <span className="text-sm font-bold">{s.count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Low stock */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle size={16} className="text-amber-500" />
              <h2 className="font-semibold">Low Stock</h2>
            </div>
            {data?.lowStock?.length === 0 && (
              <p className="text-xs text-gray-400">All products well stocked</p>
            )}
            {data?.lowStock?.map((p) => (
              <div key={p._id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <p className="text-sm truncate flex-1">{p.name}</p>
                <span className="text-xs font-bold text-red-500 ml-2">{p.stock} left</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}