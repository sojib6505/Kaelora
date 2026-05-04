import { createBrowserRouter } from "react-router";
import MainLayouts from "../layouts/MainLayouts";
import Home from "../pages/home/Home";
import AllProduct from "../pages/allProducts/AllProduct";
import ProductDetails from "../pages/productDetail/ProductDetails";



const router = createBrowserRouter([
    {path:'/',Component:MainLayouts,
        children:[
            {index:true, Component:Home},
            {path:'/shop', Component:AllProduct},
            { path: "/product/:id",element: <ProductDetails/>}
        ]
    }
])

export default router;