export interface IProductSizeReq {
    sizeId: string;
    price: number;
    stockQuantity: number;
    status: ProductSizeStatus;
}

export interface IProductSizeRes {
    id: string;
    productId: string;
    sizeId: string;
    sizeName: SizeEnum;
    price: number;
    stockQuantity: number;
    status: ProductSizeStatus;
    createdAt: string;
    updatedAt: string;
}

export interface IProductSize {
    id: string;
    product: IProduct;
    size: ISize;
    price: number;
    stockQuantity: number;
    status: ProductSizeStatus;
    createdAt: string;
    updatedAt: string;
    createdBy: string;
    updatedBy: string;
}

