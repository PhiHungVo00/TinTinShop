export interface ICartItem {
  id: string;
  productSizeId: string;
  quantity: number;
  price: number;
  toppingIds: number[];
}

export interface ICartItemReq {
  userId: string;
  productSizeId: string;
  quantity: number;
  toppingIds?: number[];
}

export interface ICartItemUpdate {
  id: string;
  quantity: number;
}

export interface ICart {
  id: string;
  userId: string;
  createdAt?: string;
  updatedAt?: string;
  items: ICartItem[];
}
