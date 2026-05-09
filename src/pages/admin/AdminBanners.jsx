import { useEffect, useState } from "react";
import { Plus, Trash2, ToggleLeft, ToggleRight, Upload, X } from "lucide-react";
import useAxios from "../../hooks/useAxios";
 
export function AdminBanners() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ button: "Shop Now", redirectLink: "/shop", order: 0 });
  const [image, setImage] = useState(null);
  const [saving, setSaving] = useState(false);
  const axiosInstance = useAxios();
 
  const fetchBanners = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/admin/banners");
      setBanners(res.data.banners);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
 
  useEffect(() => { fetchBanners(); }, []);
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) return alert("Please select an image");
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("image", image);
      formData.append("button", form.button);
      formData.append("redirectLink", form.redirectLink);
      formData.append("order", form.order);
      await axiosInstance.post("/admin/banners", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setShowModal(false);
      setImage(null);
      setForm({ button: "Shop Now", redirectLink: "/shop", order: 0 });
      fetchBanners();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };
 
  const handleDelete = async (id) => {
    if (!confirm("Delete this banner?")) return;
    await axiosInstance.delete(`/admin/banners/${id}`);
    fetchBanners();
  };
 
  const handleToggle = async (id) => {
    await axiosInstance.patch(`/admin/banners/${id}/toggle`);
    fetchBanners();
  };
 
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Banners</h1>
          <p className="text-sm text-gray-500 mt-1">{banners.length} banners</p>
        </div>
        <button onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-black text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-800 transition">
          <Plus size={16} /> Add Banner
        </button>
      </div>
 
      {loading ? (
        <div className="flex items-center justify-center h-40">
          <div className="w-7 h-7 border-4 border-black border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid gap-4">
          {banners.length === 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center text-gray-400">
              No banners yet. Add your first banner!
            </div>
          )}
          {banners.map((banner) => (
            <div key={banner._id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <div className="relative aspect-[3/1] bg-gray-100">
                <img src={banner.image?.url} alt="Banner" className="w-full h-full object-cover" />
                {!banner.isActive && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="text-white font-medium">Inactive</span>
                  </div>
                )}
              </div>
              <div className="p-4 flex items-center justify-between">
                <div className="text-sm space-y-1">
                  <p><span className="text-gray-500">Button:</span> <span className="font-medium">{banner.button}</span></p>
                  <p><span className="text-gray-500">Link:</span> <span className="font-medium">{banner.redirectLink}</span></p>
                  <p><span className="text-gray-500">Order:</span> <span className="font-medium">{banner.order}</span></p>
                </div>
                <div className="flex items-center gap-3">
                  <button onClick={() => handleToggle(banner._id)}>
                    {banner.isActive
                      ? <ToggleRight size={28} className="text-green-500" />
                      : <ToggleLeft size={28} className="text-gray-300" />
                    }
                  </button>
                  <button onClick={() => handleDelete(banner._id)}
                    className="p-2 rounded-lg hover:bg-red-50 transition text-gray-500 hover:text-red-500">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
 
      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="font-bold text-lg">Add Banner</h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-lg transition">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Banner Image *</label>
                <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-xl p-8 cursor-pointer hover:bg-gray-50 transition">
                  {image ? (
                    <img src={URL.createObjectURL(image)} className="w-full h-32 object-cover rounded-lg" />
                  ) : (
                    <>
                      <Upload size={24} className="text-gray-400 mb-2" />
                      <span className="text-sm text-gray-500">Click to upload banner image</span>
                      <span className="text-xs text-gray-400 mt-1">Recommended: 1200×400px</span>
                    </>
                  )}
                  <input type="file" accept="image/*" className="hidden"
                    onChange={e => setImage(e.target.files[0])} />
                </label>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Button Text</label>
                <input value={form.button} onChange={e => setForm({...form, button: e.target.value})}
                  className="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Redirect Link</label>
                <input value={form.redirectLink} onChange={e => setForm({...form, redirectLink: e.target.value})}
                  className="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Display Order</label>
                <input type="number" value={form.order} onChange={e => setForm({...form, order: e.target.value})}
                  className="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)}
                  className="flex-1 border rounded-xl py-2.5 text-sm font-medium hover:bg-gray-50 transition">
                  Cancel
                </button>
                <button type="submit" disabled={saving}
                  className="flex-1 bg-black text-white rounded-xl py-2.5 text-sm font-medium hover:bg-gray-800 transition disabled:opacity-50">
                  {saving ? "Uploading..." : "Add Banner"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}