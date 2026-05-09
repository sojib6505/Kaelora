import { useEffect, useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  ToggleLeft,
  ToggleRight,
  X,
  Upload,
  Package,
} from "lucide-react";
import useAxios from "../../hooks/useAxios";
import useAuth from "../../hooks/useAuth";

const EMPTY_FORM = {
  name: "",
  description: "",
  price: "",
  discountPrice: "",
  rating: "",
  review: "",
  unit: "piece",
  brand: "",
  size: "",
  isFeatured: false,
};

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [images, setImages] = useState([]);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const axiosInstance = useAxios();
  const { user } = useAuth();

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(
        `/admin/products?page=${page}&search=${search}`,
      );
      setProducts(res.data.products);
      setPagination(res.data.pagination);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) return;
    fetchProducts();
  }, [page, search, user]);

  const openAdd = () => {
    setEditProduct(null);
    setForm(EMPTY_FORM);
    setImages([]);
    setShowModal(true);
  };

  const openEdit = (product) => {
    setEditProduct(product);
    setForm({
      name: product.name,
      description: product.description,
     category: category.price,
      price: product.price,
      discountPrice: product.discountPrice || "",
      rating: product.rating,
      review: product.review,
      brand: product.brand || "",
       stock: product.stock,
      size: product.size?.join(", ") || "",
      isFeatured: product.isFeatured || false,
    });
    setImages([]);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([k, v]) => formData.append(k, v));
      images.forEach((img) => formData.append("images", img));

      if (editProduct) {
        await axiosInstance.put(
          `/admin/products/${editProduct._id}`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          },
        );
      } else {
        await axiosInstance.post("/admin/products", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
      setShowModal(false);
      fetchProducts();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = async (id) => {
    await axiosInstance.patch(`/admin/products/${id}/toggle`);
    fetchProducts();
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this product?")) return;
    await axiosInstance.delete(`/admin/products/${id}`);
    fetchProducts();
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Products</h1>
          <p className="text-sm text-gray-500 mt-1">
            {pagination.total || 0} total products
          </p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-black text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-800 transition"
        >
          <Plus size={16} /> Add Product
        </button>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search products..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1);
        }}
        className="w-full max-w-sm border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black"
      />

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
                  <th className="text-left px-5 py-3 font-medium text-gray-500">
                    Product
                  </th>
                  <th className="text-left px-5 py-3 font-medium text-gray-500">
                    Category
                  </th>
                  <th className="text-left px-5 py-3 font-medium text-gray-500">
                    Price
                  </th>
                  <th className="text-left px-5 py-3 font-medium text-gray-500">
                    Stock
                  </th>
                  <th className="text-left px-5 py-3 font-medium text-gray-500">
                    Status
                  </th>
                  <th className="text-right px-5 py-3 font-medium text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {products.map((p) => (
                  <tr key={p._id} className="hover:bg-gray-50/50 transition">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        {p.images?.[0]?.url ? (
                          <img
                            src={p.images[0].url}
                            alt={p.name}
                            className="w-10 h-10 rounded-lg object-cover border"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-300">
                            <Package size={18} />
                          </div>
                        )}
                        <span className="font-medium line-clamp-1 max-w-45">
                          {p.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-gray-500">{p.category}</td>
                    <td className="px-5 py-4">
                      <span className="font-semibold">৳{p.price}</span>
                      {p.discountPrice > 0 && (
                        <span className="text-xs text-red-500 ml-1">
                          / ৳{p.discountPrice}
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`font-medium ${p.stock <= 5 ? "text-red-500" : "text-gray-700"}`}
                      >
                        {p.stock}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <button onClick={() => handleToggle(p._id)}>
                        {p.isActive ? (
                          <ToggleRight size={24} className="text-green-500" />
                        ) : (
                          <ToggleLeft size={24} className="text-gray-300" />
                        )}
                      </button>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2 justify-end">
                        <button
                          onClick={() => openEdit(p)}
                          className="p-2 rounded-lg hover:bg-gray-100 transition text-gray-500 hover:text-black"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          onClick={() => handleDelete(p._id)}
                          className="p-2 rounded-lg hover:bg-red-50 transition text-gray-500 hover:text-red-500"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {products.length === 0 && (
              <p className="text-center text-gray-400 py-10">
                No products found
              </p>
            )}
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex items-center gap-2">
          {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(
            (p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-8 h-8 rounded-lg text-sm font-medium transition ${
                  page === p
                    ? "bg-black text-white"
                    : "bg-white border hover:bg-gray-50"
                }`}
              >
                {p}
              </button>
            ),
          )}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-lg font-bold">
                {editProduct ? "Edit Product" : "Add Product"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="text-sm font-medium mb-1 block">
                    Product Name *
                  </label>
                  <input
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-sm font-medium mb-1 block">
                    Description *
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={form.description}
                    onChange={(e) =>
                      setForm({ ...form, description: e.target.value })
                    }
                    className="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black resize-none"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">
                    Price (৳) *
                  </label>
                  <input
                    required
                    type="number"
                    value={form.price}
                    onChange={(e) =>
                      setForm({ ...form, price: e.target.value })
                    }
                    className="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">
                    Discount Price (৳)
                  </label>
                  <input
                    type="number"
                    value={form.discountPrice}
                    onChange={(e) =>
                      setForm({ ...form, discountPrice: e.target.value })
                    }
                    className="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">
                    Rating *
                  </label>
                  <input
                    placeholder="type number 3/4/5"
                    required
                    value={form.rating}
                    onChange={(e) =>
                      setForm({ ...form, rating: e.target.value })
                    }
                    className="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">
                    Review *
                  </label>
                  <input
                    placeholder="type number 3/6/10"
                    required
                    type="number"
                    value={form.review}
                    onChange={(e) =>
                      setForm({ ...form, review: e.target.value })
                    }
                    className="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">
                    category *
                  </label>
                  <input
                    required
                    value={form.category}
                    onChange={(e) =>
                      setForm({ ...form, category: e.target.value })
                    }
                    className="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">
                    Brand
                  </label>
                  <input
                    value={form.brand}
                    onChange={(e) =>
                      setForm({ ...form, brand: e.target.value })
                    }
                    className="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">
                    Stock
                  </label>
                  <input
                    value={form.stock}
                    onChange={(e) =>
                      setForm({ ...form, stock: e.target.value })
                    }
                    className="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-sm font-medium mb-1 block">
                    Size (comma separated)
                  </label>
                  <input
                    value={form.size}
                    onChange={(e) => setForm({ ...form, size: e.target.value })}
                    placeholder="e.g. 30,32,36"
                    className="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
                <div className="col-span-2 flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={form.isFeatured}
                    onChange={(e) =>
                      setForm({ ...form, isFeatured: e.target.checked })
                    }
                    className="w-4 h-4 rounded"
                  />
                  <label htmlFor="featured" className="text-sm font-medium">
                    Featured Product
                  </label>
                </div>
                <div className="col-span-2">
                  <label className="text-sm font-medium mb-1 block">
                    Images (max 5)
                  </label>
                  <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-xl p-6 cursor-pointer hover:bg-gray-50 transition">
                    <Upload size={20} className="text-gray-400 mb-2" />
                    <span className="text-sm text-gray-500">
                      Click to upload images
                    </span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      className="hidden"
                      onChange={(e) =>
                        setImages(Array.from(e.target.files).slice(0, 5))
                      }
                    />
                  </label>
                  {images.length > 0 && (
                    <div className="flex gap-2 mt-2">
                      {images.map((img, i) => (
                        <img
                          key={i}
                          src={URL.createObjectURL(img)}
                          className="w-16 h-16 rounded-lg object-cover border"
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 border rounded-xl py-2.5 text-sm font-medium hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-black text-white rounded-xl py-2.5 text-sm font-medium hover:bg-gray-800 transition disabled:opacity-50"
                >
                  {saving
                    ? "Saving..."
                    : editProduct
                      ? "Update"
                      : "Add Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
