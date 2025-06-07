import { IProductResponseDTO } from "./product";
import { ITopping } from "./backend";
export interface IProductFavoriteReq {
    productId: string;
    userId: string;
}

export interface IToppingFavoriteReq {
    toppingId: string;
    userId: string;
}

export interface IProductFavoriteRes {
    id: string;
    userId: string;
    product: IProductResponseDTO;
    createdAt?: string;
    updatedAt?: string;
    createdBy?: string;
    updatedBy?: string;
}

export interface IToppingFavoriteRes {
    id: string;
    userId: string;
    topping: ITopping;
    createdAt?: string;
    updatedAt?: string;
    createdBy?: string;
    updatedBy?: string;
}