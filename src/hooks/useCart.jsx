import { useContext } from "react";
import CartContext from "../cartContext/CartContext";


const useCart = () => useContext(CartContext);
export default useCart;