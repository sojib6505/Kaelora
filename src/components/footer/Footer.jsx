import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaPinterestP,
  FaYoutube,
  FaWhatsapp,
  FaMapMarkerAlt,
  FaEnvelope,
  FaPhoneAlt,
  FaTiktok,
} from "react-icons/fa";

import { Link } from "react-router";
import Logo from "../../utils/Logo";
export default function Footer() {
  const phoneNumber = "8801621234852";
  const message = "Hello! I want to order from your website.";

  const whatsappLink = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
    message
  )}`;

  return (
    <>
      {/* Footer */}
      <footer className="bg-[#0a0a0a] text-gray-400 pt-14 pb-6">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-5 gap-8">

          {/* Contact Info */}
          <div className="space-y-3">
            <Logo className="mt-4 text-white " />
            <p className="flex items-start gap-2 text-sm font-semibold">
              <FaMapMarkerAlt className="mt-1" />
              Outlet: Mirpur - 13, Dhaka, Bangladesh
            </p>

            <p className="flex items-center gap-2 text-sm font-semibold">
              <FaEnvelope />
              officialkaelora@gmail.com
            </p>

            <p className="flex items-center gap-2 text-sm font-semibold">
              <FaPhoneAlt />
              +8801621-234852
            </p>

            {/* Social */}
            <div className="flex gap-4 text-lg mt-4">
             <a href="https://www.facebook.com/kaelorabd"> <FaFacebookF className="cursor-pointer hover:text-white" /></a>
              <a href="https://www.instagram.com/kaelorabd"><FaInstagram className="cursor-pointer hover:text-white" /></a>
              <a href="https://www.tiktok.com/@kaelorabd"><FaTiktok className="cursor-pointer hover:text-white" /></a>
            </div>
            
          </div>

          {/* Policies */}
          <div>
            <h3 className="text-white mb-4 font-semibold">Policies</h3>
            <ul className="space-y-2 text-sm">
              <li className="hover:text-white cursor-pointer font-semibold">Mission & Vision</li>
              <li className="hover:text-white cursor-pointer font-semibold">Privacy Policy</li>
              <li className="hover:text-white cursor-pointer font-semibold">
                Return/Exchange & Refund
              </li>
              <li className="hover:text-white cursor-pointer font-semibold">Shipping Policy</li>
              <li className="hover:text-white cursor-pointer font-semibold">
                Terms & Conditions
              </li>
            </ul>
          </div>

          {/* Quick Link */}
          <div>
            <h3 className="text-white mb-4 font-semibold">Quick Link</h3>
            <div className="space-y-2 grid text-sm">
              <Link to="/" className="hover:text-white cursor-pointer font-semibold">Home</Link>
              <Link to="/all_products" className="hover:text-white cursor-pointer font-semibold">ALL PRODUCTS</Link>
              <Link to="/my_order" className="hover:text-white cursor-pointer font-semibold">My Order</Link>
            </div>
          </div>

          {/* Other Links */}
          <div>
            <h3 className="text-white mb-4 font-semibold">Other Links</h3>
            <ul className="space-y-2 text-sm">
              <li className="hover:text-white cursor-pointer font-semibold">My Profile</li>
              <li className="hover:text-white cursor-pointer font-semibold">Cart</li>
              <li className="hover:text-white cursor-pointer font-semibold">Sitemap</li>
              <li className="hover:text-white cursor-pointer font-semibold">Blog Post</li>
              <li className="hover:text-white cursor-pointer font-semibold">
                How to Order & Get Offer
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            {/* Footer WhatsApp */}
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex font-medium items-center gap-2 text-green-400 hover:text-green-500 text-sm"
            >
              <FaWhatsapp />
              Chat on WhatsApp
            </a>
          </div>
        </div>

        {/* Bottom */}
        <div className="text-center text-xs text-gray-500 mt-10">
          © 2026 Kaelora. All rights reserved.
        </div>
      </footer>

      {/* Floating WhatsApp (Always Visible) */}
      <a
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-5 right-5 bg-green-500 p-4 rounded-full text-white shadow-lg hover:scale-110 transition z-50"
      >
        <FaWhatsapp size={22} />
      </a>
    </>
  );
}