import { createBrowserRouter } from "react-router";
import MainLayouts from "../layouts/MainLayouts";
import Home from "../pages/home/Home";
import AllProduct from "../pages/allProducts/AllProduct";
import ProductDetails from "../pages/productDetail/ProductDetails";
import AuthenticationLayout from "../layouts/AuthenticationLayout";
import login from "../pages/authenticationPage/login";
import Registration from "../pages/authenticationPage/Registration";
import Checkout from "../pages/order/Checkout";



const router = createBrowserRouter([
    {path:'/',Component:MainLayouts,
        children:[
            {index:true, Component:Home},
            {path:'/shop', Component:AllProduct},
            { path: "/product/:id",element: <ProductDetails/>},
            {path:"/checkout", Component:Checkout }
        ]
    },
    {path:'auth',Component:AuthenticationLayout,
        children:[
            {index:true,Component: login},
            {path:'sign_up', Component: Registration}
        ]
    }
])

export default router;