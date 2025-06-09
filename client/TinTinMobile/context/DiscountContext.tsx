import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ICoupon } from '@/types/backend';
import { DiscountType } from '@/types/enums/DiscountType.enum';

interface DiscountContextType {
  discountData: ICoupon[];
  appliedDiscount: ICoupon | null;
  setAppliedDiscount: (discount: ICoupon | null) => void;
}

const defaultDiscountData: ICoupon[] = [
  {
    id: 1,
    code: 'TINTIN10',
    description: 'Giảm giá 10% cho đơn hàng',
    image: '',
    discountType: DiscountType.PERCENT,
    discountValue: 10,
    maxDiscount: 100000,
    minOrderValue: 0,
    quantity: 100,
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    isActive: true
  },
  {
    id: 2,
    code: 'TINTIN20',
    description: 'Giảm giá 20% cho đơn hàng',
    image: '',
    discountType: DiscountType.PERCENT,
    discountValue: 20,
    maxDiscount: 200000,
    minOrderValue: 0,
    quantity: 50,
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    isActive: true
  },
  {
    id: 3,
    code: 'TINTIN50K',
    description: 'Giảm giá 50.000 VNĐ cho đơn hàng',
    image: '',
    discountType: DiscountType.AMOUNT,
    discountValue: 50000,
    maxDiscount: 50000,
    minOrderValue: 0,
    quantity: 30,
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    isActive: true
  }
];

const DiscountContext = createContext<DiscountContextType | undefined>(undefined);

export const DiscountProvider = ({ children }: { children: ReactNode }) => {
  const [discountData] = useState<ICoupon[]>(defaultDiscountData);
  const [appliedDiscount, setAppliedDiscount] = useState<ICoupon | null>(null);

  return (
    <DiscountContext.Provider value={{ discountData, appliedDiscount, setAppliedDiscount }}>
      {children}
    </DiscountContext.Provider>
  );
};

export const useDiscount = () => {
  const context = useContext(DiscountContext);
  if (context === undefined) {
    throw new Error('useDiscount must be used within a DiscountProvider');
  }
  return context;
}; 