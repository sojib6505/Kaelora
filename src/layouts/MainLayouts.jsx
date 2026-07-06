import { Outlet } from "react-router";
import Navbar from "../components/navbar/Navbar";
import Footer from "../components/footer/Footer";
import ChatWidget from "../components/ChatWidget/ChatWidget";
// import { OpenChatWidget } from "@openchatwidget/sdk";

export default function MainLayouts() {
  return (
    <div>
      <Navbar />
      <ChatWidget/>
      <Outlet />
      <Footer />
    </div>
  );
}
