import { useEffect, useState } from "react";
import { X } from "lucide-react";
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

const orderStatuses = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"];
const paymentStatuses = ["pending", "paid", "failed", "refunded"];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filterStatus, setFilterStatus] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [updating, setUpdating] = useState(false);
  const axiosInstance = useAxios();
  const {user} = useAuth()

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(
        `/admin/orders?page=${page}&status=${filterStatus}&search=${search}`
      );
      setOrders(res.data.orders);
      setPagination(res.data.pagination);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
     if (!user) return;
    fetchOrders(); }, [page, filterStatus, search,user]);

  const handleStatusUpdate = async (orderId, orderStatus, paymentStatus) => {
    setUpdating(true);
    try {
      await axiosInstance.patch(`/admin/orders/${orderId}/status`, { orderStatus, paymentStatus });
      fetchOrders();
      if (selectedOrder?._id === orderId) {
        const res = await axiosInstance.get(`/admin/orders/${orderId}`);
        setSelectedOrder(res.data.order);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Orders</h1>
        <p className="text-sm text-gray-500 mt-1">{pagination.total || 0} total orders</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <input
          type="text" placeholder="Search name or phone..."
          value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
          className="border rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black w-full max-w-xs"
        />
        <select value={filterStatus} onChange={e => { setFilterStatus(e.target.value); setPage(1); }}
          className="border rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black">
          <option value="">All Status</option>
          {orderStatuses.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-40">
            <div className="w-7 h-7 border-4 border-black border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-5 py-3 font-medium text-gray-500">Order</th>
                  <th className="text-left px-5 py-3 font-medium text-gray-500">Customer</th>
                  <th className="text-left px-5 py-3 font-medium text-gray-500">Items</th>
                  <th className="text-left px-5 py-3 font-medium text-gray-500">Amount</th>
                  <th className="text-left px-5 py-3 font-medium text-gray-500">Status</th>
                  <th className="text-left px-5 py-3 font-medium text-gray-500">Payment</th>
                  <th className="text-left px-5 py-3 font-medium text-gray-500">Date</th>
                  <th className="text-right px-5 py-3 font-medium text-gray-500">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {orders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50/50 transition">
                    <td className="px-5 py-4 font-mono font-medium">#{order._id.slice(-6).toUpperCase()}</td>
                    <td className="px-5 py-4">
                      <p className="font-medium">{order.shippingAddress?.name}</p>
                      <p className="text-xs text-gray-500">{order.shippingAddress?.phone}</p>
                    </td>
                    <td className="px-5 py-4 text-gray-500">{order.items?.length} items</td>
                    <td className="px-5 py-4 font-bold">৳{order.totalAmount}</td>
                    <td className="px-5 py-4">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium capitalize ${statusColors[order.orderStatus]}`}>
                        {order.orderStatus}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium capitalize
                        ${order.paymentStatus === "paid" ? "bg-green-100 text-green-700" :
                          order.paymentStatus === "failed" ? "bg-red-100 text-red-700" :
                          "bg-gray-100 text-gray-600"}`}>
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-gray-500 text-xs">
                      {new Date(order.createdAt).toLocaleDateString("en-BD")}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button onClick={() => setSelectedOrder(order)}
                        className="text-xs bg-black text-white px-3 py-1.5 rounded-lg hover:bg-gray-800 transition">
                        Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {orders.length === 0 && (
              <p className="text-center text-gray-400 py-10">No orders found</p>
            )}
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex items-center gap-2">
          {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((p) => (
            <button key={p} onClick={() => setPage(p)}
              className={`w-8 h-8 rounded-lg text-sm font-medium transition ${
                page === p ? "bg-black text-white" : "bg-white border hover:bg-gray-50"
              }`}>
              {p}
            </button>
          ))}
        </div>
      )}

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white">
              <div>
                <h2 className="font-bold text-lg">Order #{selectedOrder._id.slice(-6).toUpperCase()}</h2>
                <p className="text-xs text-gray-500">{new Date(selectedOrder.createdAt).toLocaleString("en-BD")}</p>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-gray-100 rounded-lg transition">
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Items */}
              <div>
                <h3 className="text-sm font-semibold mb-3">Items</h3>
                <div className="space-y-2">
                  {selectedOrder.items?.map((item, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                      {item.productImage && (
                        <img src={item.productImage} className="w-10 h-10 rounded-lg object-cover" />
                      )}
                      <div className="flex-1">
                        <p className="text-sm font-medium">{item.productName}</p>
                        <p className="text-xs text-gray-500">Qty: {item.quantity} × ৳{item.price}</p>
                      </div>
                      <p className="font-bold text-sm">৳{item.price * item.quantity}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping */}
              <div>
                <h3 className="text-sm font-semibold mb-2">Shipping Address</h3>
                <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-600 space-y-1">
                  <p className="font-medium text-black">{selectedOrder.shippingAddress?.name}</p>
                  <p>{selectedOrder.shippingAddress?.phone}</p>
                  <p>{selectedOrder.shippingAddress?.street}, {selectedOrder.shippingAddress?.city}</p>
                </div>
              </div>

              {/* Summary */}
              <div className="border rounded-xl p-4 space-y-2 text-sm">
                <div className="flex justify-between text-gray-500">
                  <span>Subtotal</span><span>৳{selectedOrder.subtotal}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Shipping</span><span>৳{selectedOrder.shippingCost}</span>
                </div>
                <div className="flex justify-between font-bold border-t pt-2">
                  <span>Total</span><span>৳{selectedOrder.totalAmount}</span>
                </div>
              </div>

              {/* Update Status */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold">Update Status</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Order Status</label>
                    <select
                      defaultValue={selectedOrder.orderStatus}
                      onChange={e => handleStatusUpdate(selectedOrder._id, e.target.value, undefined)}
                      disabled={updating}
                      className="w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                    >
                      {orderStatuses.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Payment Status</label>
                    <select
                      defaultValue={selectedOrder.paymentStatus}
                      onChange={e => handleStatusUpdate(selectedOrder._id, undefined, e.target.value)}
                      disabled={updating}
                      className="w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                    >
                      {paymentStatuses.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}