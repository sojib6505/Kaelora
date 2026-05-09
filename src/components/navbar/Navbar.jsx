import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import {
  Menu,
  X,
  Search,
  ShoppingCart,
  User,
  LogOut,
  Package,
  ChevronDown,
} from "lucide-react";
import Logo from "../../utils/Logo";
import useAuth from "../../hooks/useAuth";
import useCart from "../../hooks/useCart";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { cartCount } = useCart()

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Shop", path: "/shop" },
    { name: "About", path: "/" },
    { name: "Contact", path: "/" },
  ];

  // Dropdown বাইরে click করলে বন্ধ হবে
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    setDropdownOpen(false);
    navigate("/");
  };

  return (
    <nav className="w-full bg-white fixed top-0 left-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* LEFT (Mobile Menu Icon) */}
          <div className="lg:hidden">
            <button onClick={() => setOpen(true)}>
              <Menu size={26} />
            </button>
          </div>

          {/* LOGO */}
          <div className="text-xl flex items-center font-bold md:flex-1 text-center lg:text-left">
            <Logo />
            <h2 className="font-semibold text-2xl font-serif uppercase">
              Kaelora
            </h2>
          </div>

          {/* NAV ITEMS (Desktop) */}
          <div className="hidden md:flex flex-1 justify-start gap-6">
            {navLinks.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className="hover:text-red-primary font-serif text-xl font-normal"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* RIGHT ICONS */}
          <div className="flex items-center gap-4">
            <Search className="cursor-pointer hover:text-red-primary" />

            {/* Profile */}
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-1 cursor-pointer hover:text-red-primary"
                >
                  {user.photoURL ? (
                    <User className="text-red-300" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-sm font-bold">
                      {user.displayName?.charAt(0).toUpperCase() ||
                        user.email?.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <ChevronDown size={14} />
                </button>

                {/* Dropdown */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-red-500 py-2 z-50">
                    <div className="px-4 py-2 border-b">
                      <p className="font-semibold text-sm truncate">
                        {user.displayName || "User"}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {user.email}
                      </p>
                    </div>
                    <Link
                      to="/profile"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50"
                    >
                      <User size={15} /> Profile
                    </Link>
                    <Link
                      to="/orders"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50"
                    >
                      <Package size={15} /> My Orders
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-50 w-full text-left"
                    >
                      <LogOut size={15} /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/auth">
                <User className="cursor-pointer hover:text-red-primary" />
              </Link>
            )}

            <div className="relative">
              <ShoppingCart className="cursor-pointer hover:text-red-primary" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE SIDEBAR */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg transform ${
          open ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 z-50`}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-bold">Menu</h2>
          <button onClick={() => setOpen(false)}>
            <X />
          </button>
        </div>

        <div className="flex flex-col p-4 gap-4">
          {navLinks.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              onClick={() => setOpen(false)}
              className="text-lg hover:text-red-primary font-serif font-normal"
            >
              {item.name}
            </Link>
          ))}

          {/* Mobile এ user info */}
          {user ? (
            <div className="border-t pt-4 mt-2">
              <p className="font-semibold text-sm mb-3 truncate">
                {user.displayName || user.email}
              </p>
              <Link
                to="/profile"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 text-sm py-2 hover:text-red-primary"
              >
                <User size={15} /> Profile
              </Link>
              <Link
                to="/orders"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 text-sm py-2 hover:text-red-primary"
              >
                <Package size={15} /> My Orders
              </Link>
              <button
                onClick={() => {
                  handleLogout();
                  setOpen(false);
                }}
                className="flex items-center gap-2 text-sm py-2 text-red-500 w-full"
              >
                <LogOut size={15} /> Logout
              </button>
            </div>
          ) : (
            <Link
              to="/auth"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 text-sm py-2 hover:text-red-primary"
            >
              <User size={15} /> Login
            </Link>
          )}
        </div>
      </div>

      {/* OVERLAY */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/40 z-40"
        ></div>
      )}
    </nav>
  );
}
