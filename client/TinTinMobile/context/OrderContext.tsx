import React, { createContext, useContext, useState, ReactNode } from 'react';

interface OrderItem {
  name: string;
  quantity: number;
  price: string; // Base product price
  size: string;
  ice: string;
  sugar: string;
  toppings: string[];
  toppingPrice: number; // Price for all selected toppings
}

interface Order {
  id: string;
  date: string;
  status: string;
  items: OrderItem[];
  total: string;
}

interface OrderContextType {
  orders: Order[];
  addOrder: (order: Order) => void;
  updateOrderStatus: (orderId: string, newStatus: string) => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider = ({ children }: { children: ReactNode }) => {
  const [orders, setOrders] = useState<Order[]>([]);

  const addOrder = (newOrder: Order) => {
    setOrders(prevOrders => [newOrder, ...prevOrders]);
  };

  const updateOrderStatus = (orderId: string, newStatus: string) => {
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
  };

  return (
    <OrderContext.Provider value={{ orders, addOrder, updateOrderStatus }}>
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