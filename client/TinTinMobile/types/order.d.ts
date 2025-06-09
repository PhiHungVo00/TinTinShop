import { ICoupon, IUser, IAddressUser } from "./backend";

export interface IOrder {
    id: string;
    user: IUser;
    coupon?: ICoupon;
    address: IAddressUser;
    note: string;
    totalPrice: number;
    finalPrice: number;
    status: OrderStatus;
    createdAt?: string;
    updatedAt?: string;
    createdBy?: string;
    updatedBy?: string;
}

export interface IOrderReq {
    userId: string;
    couponId?: string;
    addressId: string;
    note?: string;
    useCart?: boolean;
    orderDetails: IOderDetailDTO[];
}

export interface IOrderUpdate{
    id: string;
    userId: string;
    couponId?: string;
    addressId: string;
    note?: string;
    status: OrderStatus;
    orderDetails: IOderDetailDTO[];
}

export interface IOrderRes {
    id: string;
    userId: string;
    couponId?: string;
    addressUser: IAddressUserRes;
    note: string;
    totalPrice: number;
    finalPrice: number;
    status: OrderStatus;
    createdAt?: string;
    updatedAt?: string;
    orderDetails: IOrderDetailRes[];
}