import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Nft } from "@/mocks/db";

export interface CartItem {
  nft: Nft;
  quantity: number;
}

interface CartContextValue {
  items: CartItem[];
  itemCount: number;
  couponCode: string;
  addItem: (nft: Nft, quantity?: number) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  setCouponCode: (code: string) => void;
  removeCoupon: () => void;
  clear: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  // Inicializa o estado lendo do localStorage (se existir)
  const [items, setItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem("@kurio:cart");
    return saved ? JSON.parse(saved) : [];
  });
  
  const [couponCode, setCouponCode] = useState<string>(() => {
    return localStorage.getItem("@kurio:coupon") || "";
  });

  // Salva no localStorage sempre que mudar
  useEffect(() => {
    localStorage.setItem("@kurio:cart", JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    if (couponCode) {
      localStorage.setItem("@kurio:coupon", couponCode);
    } else {
      localStorage.removeItem("@kurio:coupon");
    }
  }, [couponCode]);

  const addItem = useCallback((nft: Nft, quantity = 1) => {
    setItems((current) => {
      const existing = current.find((item) => item.nft.id === nft.id);
      if (existing) {
        return current.map((item) =>
          item.nft.id === nft.id
            ? { ...item, quantity: Math.min(item.quantity + quantity, nft.editions) }
            : item,
        );
      }
      return [...current, { nft, quantity: Math.min(quantity, nft.editions) }];
    });
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    setItems((current) =>
      current
        .map((item) =>
          item.nft.id === id ? { ...item, quantity: Math.min(quantity, item.nft.editions) } : item,
        )
        .filter((item) => item.quantity > 0),
    );
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((current) => current.filter((item) => item.nft.id !== id));
  }, []);

  const removeCoupon = useCallback(() => setCouponCode(""), []);

  const clear = useCallback(() => {
    setItems([]);
    setCouponCode("");
  }, []);

  const value = useMemo<CartContextValue>(() => {
    const itemCount = items.reduce((total, item) => total + item.quantity, 0);
    return {
      items,
      itemCount,
      couponCode,
      addItem,
      updateQuantity,
      removeItem,
      setCouponCode,
      removeCoupon,
      clear,
    };
  }, [items, couponCode, addItem, updateQuantity, removeItem, removeCoupon, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}