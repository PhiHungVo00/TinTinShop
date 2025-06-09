import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { ICartItem, ICartItemReq, ICartItemUpdate } from '@/types/cart';
import { callAddCartItem, callClearCart, callDeleteCartItem, callGetCartByUser, callUpdateCartItem } from '@/config/api';
import { useAppContext } from './AppContext';

interface CartContextType {
  items: ICartItem[];
  addItem: (payload: Omit<ICartItemReq, 'userId'>) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  updateItemQuantity: (itemId: string, quantity: number) => Promise<void>;
  clearCart: () => void;
  getTotalPrice: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAppContext();
  const [items, setItems] = useState<ICartItem[]>([]);

  useEffect(() => {
    if (user?.user.id) {
      callGetCartByUser(user.user.id as string).then(res => {
        if (res.data) {
          setItems(res.data.items);
        }
      });
    }
  }, [user]);

  const addItem = async (payload: Omit<ICartItemReq, 'userId'>) => {
    if (!user?.user.id) return;
    const res = await callAddCartItem({ ...payload, userId: user.user.id });
    if (res.data) {
      setItems(prev => [...prev, res.data]);
    }
  };

  const removeItem = async (itemId: string) => {
    await callDeleteCartItem(itemId);
    setItems(prevItems => prevItems.filter(item => item.id !== itemId));
  };

  const updateItemQuantity = async (itemId: string, quantity: number) => {
    const res = await callUpdateCartItem({ id: itemId, quantity } as ICartItemUpdate);
    if (res.data) {
      setItems(prevItems =>
        prevItems.map(item =>
          item.id === itemId ? res.data : item
        )
      );
    }
  };

  const clearCart = () => {
    if (user?.user.id) {
      callClearCart(user.user.id as string).then(() => setItems([]));
    } else {
      setItems([]);
    }
  };

  const getTotalPrice = () => {
    return items.reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0);
  };

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateItemQuantity, clearCart, getTotalPrice }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}; 