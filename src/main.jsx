import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { RouterProvider } from 'react-router'
import router from './routes/Router.jsx'
import  AuthProvider  from './context/AuthProvider.jsx'
import { CartProvider } from './cartContext/CartContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
   <AuthProvider>
    <CartProvider>
       <RouterProvider router={router}>   
    </RouterProvider>
    </CartProvider>
   </AuthProvider>
  </StrictMode>,
)
