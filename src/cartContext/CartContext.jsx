import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import useAuth from "../hooks/useAuth";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const { user } = useAuth();

  // LocalStorage  cart load
  const loadLocalCart = () => {
    const data = localStorage.getItem("cart");
    return data ? JSON.parse(data) : [];
  };

  // LocalStorage  cart save
  const saveLocalCart = (items) => {
    localStorage.setItem("cart", JSON.stringify(items));
  };

  // DB cart load
  const loadDBCart = async () => {
    try {
      const token = await user.getIdToken();
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/cart`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCart(res.data.cart?.items || []);
    } catch (err) {
      console.error(err);
    }
  };

  // Login localStorage cart sync  DB 
  const syncCartToDB = async (localItems) => {
    if (!localItems.length) return;
    try {
      const token = await user.getIdToken();
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/cart/sync`,
        { items: localItems.map((i) => ({ productId: i.productId || i.product?._id, quantity: i.quantity })) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCart(res.data.cart?.items || []);
      localStorage.removeItem("cart");
    } catch (err) {
      console.error(err);
    }
  };

  // User change cart load 
  useEffect(() => {
    if (user) {
      const localItems = loadLocalCart();
      if (localItems.length > 0) {
        syncCartToDB(localItems);
      } else {
        loadDBCart();
      }
    } else {
      setCart(loadLocalCart());
    }
  }, [user]);

  // Add to cart
  const addToCart = async (product, quantity = 1) => {
    if (user) {
      try {
        const token = await user.getIdToken();
        const res = await axios.post(
          `${import.meta.env.VITE_API_URL}/cart/add`,
          { productId: product._id, quantity },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setCart(res.data.cart?.items || []);
      } catch (err) {
        console.error(err);
      }
    } else {
      // LocalStorage
      const localCart = loadLocalCart();
      const existing = localCart.find((i) => i.productId === product._id);
      let updated;
      if (existing) {
        updated = localCart.map((i) =>
          i.productId === product._id ? { ...i, quantity: i.quantity + quantity } : i
        );
      } else {
        updated = [...localCart, {
          productId: product._id,
          name: product.name,
          price: product.discountPrice > 0 ? product.discountPrice : product.price,
          image: product.images?.[0]?.url || "",
          quantity,
        }];
      }
      saveLocalCart(updated);
      setCart(updated);
    }
  };

  // Cart item count
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, cartCount, loadDBCart }}>
      {children}
    </CartContext.Provider>
  );
}

export default CartContext;