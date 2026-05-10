import { createBrowserRouter } from "react-router";
import MainLayouts from "../layouts/MainLayouts";
import Home from "../pages/home/Home";
import AllProduct from "../pages/allProducts/AllProduct";
import AuthenticationLayout from "../layouts/AuthenticationLayout";
import Registration from "../pages/authenticationPage/Registration";
import Checkout from "../pages/order/Checkout";
import Login from "../pages/authenticationPage/Login";
import AdminLayout from "../layouts/AdminLayouts";
import AdminProducts from "../pages/admin/AdminProducts";
import AdminOrders from "../pages/admin/AdminOrders";
import { AdminUsers } from "../pages/admin/AdminUsers";
import { AdminBanners } from "../pages/admin/AdminBanners";
import CartPage from "../pages/cart/CartPage";
import MyOrders from "../pages/order/MyOrders";
import ProductDetails from "../pages/productDetail/ProductDetails";
import AdminDashboard from "../pages/admin/AdminDashboard";
import ErrorPage from "../pages/ErrorPage";

const router = createBrowserRouter([
  {
    path: "/",
    Component: MainLayouts,
    children: [
      { index: true, Component: Home },
      { path: "/shop", Component: AllProduct },
      { path: "/product/:id", Component:ProductDetails },
      { path: "/checkout", Component: Checkout },
      { path: "/cart", Component: CartPage },
      { path: "/orders", Component: MyOrders }
    ],
  },
  {
    path: "auth",
    Component: AuthenticationLayout,
    children: [
      { index: true, Component: Login },
      { path: "sign_up", Component: Registration },
    ],
  },
  {
    path: "admin",
    Component: AdminLayout,
    children: [
      { index: true, Component: AdminDashboard },
      { path: "products", Component: AdminProducts },
      { path: "orders", Component: AdminOrders },
      { path: "users", Component: AdminUsers },
      { path: "banners", Component: AdminBanners },
    ],
  },
  {
  path: "*",
  Component: ErrorPage
}
]);

export default router;
