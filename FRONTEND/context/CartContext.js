// FRONTEND/src/context/CartContext.js
import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
} from "react";
import api from "../utils/api";
import { UserContext } from "./UserContext";
import { useLocation } from "react-router-dom";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : { items: [], count: 0 };
  });
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useContext(UserContext);
  const location = useLocation();

  const fetchCartItems = useCallback(async () => {
    if (user && user.id) {
      console.log(user.id);
      setIsLoading(true);
      try {
        const response = await api.get(`/addToCart/cart-details/${user.id}`);
        if (Array.isArray(response.data)) {
          const newCart = {
            items: response.data,
            count: response.data.reduce(
              (total, item) => total + item.quantity,
              0
            ),
          };
          setCart(newCart);
          console.log("cart", cart);
          localStorage.setItem("cart", JSON.stringify(newCart));
        }
      } catch (error) {
        console.error("Error fetching cart:", error);
      } finally {
        setIsLoading(false);
      }
    }
  }, [user]);

  useEffect(() => {
    fetchCartItems();
  }, [fetchCartItems, location]);

  const addToCart = useCallback(
    async (item) => {
      if (!user) {
        return false;
      }
      setIsLoading(true);
      try {
        await api.post("/addToCart/add", item);
        window.dispatchEvent(new Event("cartUpdated"));
        await fetchCartItems();
        return true;
      } catch (error) {
        console.error("Error adding to cart:", error);
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [user, fetchCartItems]
  );

  const updateCartItemQuantity = useCallback(
    async (productId, quantityChange) => {
      if (!user) {
        return false;
      }
      setIsLoading(true);
      try {
        await api.put(`/addToCart/update-quantity/${user.id}/${productId}`, {
          quantityChange,
        });
        window.dispatchEvent(new Event("cartUpdated"));
        await fetchCartItems();
        return true;
      } catch (error) {
        console.error("Error updating cart item quantity:", error);
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [user, fetchCartItems]
  );

  const removeFromCart = useCallback(
    async (productId) => {
      if (!user) {
        return false;
      }
      setIsLoading(true);
      try {
        await api.delete(`/addToCart/cart_remove/${user.id}/${productId}`);
        window.dispatchEvent(new Event("cartUpdated"));
        await fetchCartItems();
        return true;
      } catch (error) {
        console.error("Error removing from cart:", error);
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [user, fetchCartItems]
  );

  const clearCart = useCallback(async () => {
    if (user && user.id) {
      setIsLoading(true);
      try {
        await api.delete(`/addToCart/cart_remove_after_purchase/${user.id}`);
        window.dispatchEvent(new Event("cartUpdated"));
        setCart({ items: [], count: 0 });
        localStorage.removeItem("cart");
      } catch (error) {
        console.error("Error clearing cart:", error);
      } finally {
        setIsLoading(false);
      }
    }
  }, [user]);

  const value = {
    cart,
    isLoading,
    addToCart,
    removeFromCart,
    clearCart,
    fetchCartItems,
    updateCartItemQuantity,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
