import React, { createContext, useContext, useState, ReactNode } from 'react';
import { IOrderRes } from '@/types/order';

interface OrderContextType {
  orders: IOrderRes[];
  addOrder: (order: IOrderRes) => void;
  updateOrderStatus: (orderId: string, newStatus: string) => void;
  setOrdersList: (orders: IOrderRes[]) => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider = ({ children }: { children: ReactNode }) => {
  const [orders, setOrders] = useState<IOrderRes[]>([]);

  const addOrder = (newOrder: IOrderRes) => {
    setOrders(prevOrders => [newOrder, ...prevOrders]);
  };

  const updateOrderStatus = (orderId: string, newStatus: string) => {
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
  };

  const setOrdersList = (orders: IOrderRes[]) => {
    setOrders(orders);
  };

  return (
    <OrderContext.Provider value={{ orders, addOrder, updateOrderStatus, setOrdersList }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
}; 