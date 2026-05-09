import { useState } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router";
import {
  LayoutDashboard, Package, ShoppingBag, Users, Image,
  Menu, X, LogOut, ChevronRight, Bell
} from "lucide-react";
import useAuth from "../hooks/useAuth";

const navItems = [
  { path: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { path: "/admin/products", label: "Products", icon: Package },
  { path: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { path: "/admin/users", label: "Users", icon: Users },
  { path: "/admin/banners", label: "Banners", icon: Image },
];

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const isActive = (item) => {
    if (item.exact) return location.pathname === item.path;
    return location.pathname.startsWith(item.path);
  };

  return (
    <div className="min-h-screen bg-[#f5f5f0] flex font-sans">
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-[#0f0f0f] text-white z-50 transform transition-transform duration-300
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-white/40 uppercase tracking-widest mb-1">Admin Panel</p>
              <h1 className="text-xl font-bold tracking-tight">KAELORA</h1>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-white/50 hover:text-white">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Nav */}
        <nav className="p-4 flex flex-col gap-1 mt-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all
                  ${active
                    ? "bg-white text-black"
                    : "text-white/60 hover:text-white hover:bg-white/10"
                  }`}
              >
                <Icon size={18} />
                {item.label}
                {active && <ChevronRight size={14} className="ml-auto" />}
              </Link>
            );
          })}
        </nav>

        {/* User */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-sm font-bold">
              {user?.displayName?.charAt(0) || "A"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.displayName || "Admin"}</p>
              <p className="text-xs text-white/40 truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-xs text-white/50 hover:text-red-400 transition-colors w-full"
          >
            <LogOut size={14} /> Logout
          </button>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div onClick={() => setSidebarOpen(false)} className="fixed inset-0 bg-black/50 z-40 lg:hidden" />
      )}

      {/* Main */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-30">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden">
            <Menu size={22} />
          </button>
          <div className="hidden lg:block">
            <p className="text-sm text-gray-500">
              {navItems.find(i => isActive(i))?.label || "Admin"}
            </p>
          </div>
          <div className="flex items-center gap-3 ml-auto">
            <button className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition">
              <Bell size={16} />
            </button>
            <Link to="/" className="text-xs text-gray-500 hover:text-black transition">
              ← View Site
            </Link>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}