import { IOrder } from "./order";
import { IProductSize } from "./productSize";

export interface IOrderDetail{
    id: string;
    order: IOrder;
    productSize: IProductSize;
    quantity: number;
    price: number;
    createdAt?: string;
    updatedAt?: string;
    createdBy?: string;
    updatedBy?: string;
    toppings: ITopping[];
};

export interface IOrderDetailRes {
    id: string;
    productSizeId: string;
    quantity: number;
    price: number;
    toppingIds: number[];

}

export interface IOderDetailDTO{
    productSizeId: string;
    quantity: number;
    toppingIds: string[];


}