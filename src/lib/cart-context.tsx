"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { CartItem } from "@/types";
import { getCartApi, addToCartApi, removeFromCartApi, clearCartApi } from "./api";
import { useAuth } from "./auth-context";

interface CartContextType {
  items: CartItem[];
  loading: boolean;
  itemCount: number;
  addItem: (data: { itemType: string; itemId: string; quantity?: number; selectedArea?: number }) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  const refreshCart = useCallback(async () => {
    if (!isAuthenticated) {
      setItems([]);
      return;
    }
    setLoading(true);
    try {
      const res = await getCartApi();
      setItems(res.data);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const addItem = async (data: { itemType: string; itemId: string; quantity?: number; selectedArea?: number }) => {
    await addToCartApi(data);
    await refreshCart();
  };

  const removeItem = async (id: string) => {
    await removeFromCartApi(id);
    await refreshCart();
  };

  const clearCart = async () => {
    await clearCartApi();
    setItems([]);
  };

  return (
    <CartContext.Provider value={{ items, loading, itemCount: items.length, addItem, removeItem, clearCart, refreshCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}
