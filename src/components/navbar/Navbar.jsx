

import { useState } from "react";
import { Link } from "react-router";
import { Menu, X, Search, ShoppingCart, User } from "lucide-react";
import Logo from "../../utils/Logo";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Shop", path: "/shop" },
    { name: "About", path: "/" },
    { name: "Contact", path: "/" },
  ];

  return (
    <nav className="w-full  bg-white fixed top-0 left-0  z-50 ">
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
            <Logo/> <h2 className="font-semibold text-2xl font-serif uppercase">Kaelora</h2>
          </div>

          {/* NAV ITEMS (Desktop) */}
          <div className="hidden md:flex flex-1  justify-start gap-6">
            {navLinks.map((item) => (
              <Link key={item.name} to={item.path} className="hover:text-red-primary font-serif text-xl font-normal">
                {item.name}
              </Link>
            ))}
          </div>

          {/* RIGHT ICONS */}
          <div className="flex items-center gap-4">
            <Search className="cursor-pointer hover:text-red-primary" />

            {/* Profile (hidden on mobile) */}
           <Link to='/auth'> <User className=" cursor-pointer hover:text-red-primary" /></Link>

            <ShoppingCart className="cursor-pointer hover:text-red-primary" />
          </div>
        </div>
      </div>

      {/* MOBILE SIDEBAR */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg transform ${
          open ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 z-50`}
      >
        {/* Close Button */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-bold">Menu</h2>
          <button onClick={() => setOpen(false)}>
            <X />
          </button>
        </div>

        {/* Nav Links */}
        <div className="flex flex-col p-4 gap-4">
          {navLinks.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              onClick={() => setOpen(false)}
              className="text-lg hover:text-red-primary font-serif  font-normal"
            >
              {item.name}
            </Link>
          ))}
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