export interface IProductSizeReq {
    sizeId: string;
    price: number;
    stockQuantity: number;
    status: ProductSizeStatus;
}

export interface IProductSizeRes {
    id: number;
    productId: number;
    sizeId: number;
    sizeName: SizeEnum;
    price: number;
    stockQuantity: number;
    status: ProductSizeStatus;
    createdAt: string;
    updatedAt: string;
}

