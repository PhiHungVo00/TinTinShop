import { IAccount, IAddressUser, IBackendRes, ICategory, ICoupon, IFile, IGetAccount, IModelPaginate, IRole, ISize, ITopping, IUser } from "@/types/backend"
import axios from "./axios-customize"
import { IProduct, IProductResponseDTO } from "@/types/product"
import { IProductSizeReq, IProductSizeRes } from "@/types/productSize"
import { IProductFavoriteReq, IProductFavoriteRes, IToppingFavoriteReq, IToppingFavoriteRes } from "@/types/favorite"
import { IOrderReq, IOrderRes, IOrderUpdate } from "@/types/order"
import { IOrderDetailRes } from "@/types/orderDetail"

/**
 * 
Module Auth
 */
export const callRegister = (name: string, email: string, password: string) => {
    return axios.post<IBackendRes<IUser>>('/api/v1/auth/register', { name, email, password})
}

export const callLogin = (username: string, password: string) => {
    return axios.post<IBackendRes<IAccount>>('/api/v1/auth/login', { username, password })
}

export const callFetchAccount = () => {
    return axios.get<IBackendRes<IGetAccount>>('/api/v1/auth/account')
}

export const callRefreshToken = () => {
    return axios.get<IBackendRes<IAccount>>('/api/v1/auth/refresh')
}

export const callLogout = () => {
    return axios.post<IBackendRes<void>>('/api/v1/auth/logout')
}

/**
 * 
Module Upload
 */
export const callUploadFile = (formData: FormData) => {
    return axios.post<IBackendRes<IFile>>('/api/v1/files', formData)
}

export const callGetFile = (fileName: string, folder: string) => {
    return axios.get<IBackendRes<IFile>>(`/api/v1/files/${fileName}?folder=${folder}`)
}

/**
 * 
Module User
 */
export const callGetUser = (id: string) => {
    return axios.get<IBackendRes<IUser>>(`/api/v1/users/${id}`)
}

export const callUpdateUser = (user: IUser) => {
    return axios.put<IBackendRes<IUser>>(`/api/v1/users`, user)
}

export const callGetUsers = ({ page, size, sort, filter }: {
    page?: number,
    size?: number,
    sort?: string,
    filter?: string
}) => {
    const params = new URLSearchParams();

    if (page !== undefined) params.append("page", page.toString());
    if (size !== undefined) params.append("size", size.toString());
    if (sort) params.append("sort", sort);
    if (filter) params.append("filter", filter);
    return axios.get<IBackendRes<IModelPaginate<IUser>>>(`/api/v1/users?${params.toString()}`);
};

export const callDeleteUser = (id: string) => {
    return axios.delete<IBackendRes<void>>(`/api/v1/users/${id}`);
}

export const createUser = (user: IUser) => {
    return axios.post<IBackendRes<IUser>>(`/api/v1/users`, user)
}

/**
 * 
Module Role
 */
export const callGetRoles = ({ page, size, sort, filter }: {
    page?: number,
    size?: number,
    sort?: string,
    filter?: string
}) => {
    const params = new URLSearchParams();

    if (page !== undefined) params.append("page", page.toString());
    if (size !== undefined) params.append("size", size.toString());
    if (sort) params.append("sort", sort);
    if (filter) params.append("filter", filter);
    return axios.get<IBackendRes<IModelPaginate<IRole>>>(`/api/v1/roles?${params.toString()}`);
};

/**
 * 
Module Address
 */
export const getAllAddressOfUser = (id: string) => {
    return axios.get<IBackendRes<IAddressUser[]>>(`/api/v1/addresses-user/users/${id}`);
}

export const createAddress = (address: IAddressUser) => {
    return axios.post<IBackendRes<IAddressUser>>(`/api/v1/addresses-user`, address)
}

export const getAddressById = (id: string) => {
    return axios.get<IBackendRes<IAddressUser>>(`/api/v1/addresses-user/${id}`)
}

export const updateAddress = (address: IAddressUser) => {
    return axios.put<IBackendRes<IAddressUser>>(`/api/v1/addresses-user`, address)
}

export const deleteAddress = (id: string) => {
    return axios.delete<IBackendRes<void>>(`/api/v1/addresses-user/${id}`)
}

/**
 * 
Module Coupon
 */
export const callGetCoupons = ({ page, size, sort, filter }: {
    page?: number,
    size?: number,
    sort?: string,
    filter?: string
}) => {
    const params = new URLSearchParams();

    if (page !== undefined) params.append("page", page.toString());
    if (size !== undefined) params.append("size", size.toString());
    if (sort) params.append("sort", sort);
    if (filter) params.append("filter", filter);
    return axios.get<IBackendRes<ICoupon[]>>(`/api/v1/coupons?${params.toString()}`);
};
export const callCreateCoupon = (coupon: ICoupon) => {
    return axios.post<IBackendRes<ICoupon>>(`/api/v1/coupons`, coupon)
}

export const callUpdateCoupon = (coupon: ICoupon) => {
    return axios.put<IBackendRes<ICoupon>>(`/api/v1/coupons`, coupon)
}

export const callDeleteCoupon = (id: string) => {
    return axios.delete<IBackendRes<ICoupon>>(`/api/v1/coupons/${id}`)
}

export const callGetCouponById = (id: string) => {
    return axios.get<IBackendRes<ICoupon>>(`/api/v1/coupons/${id}`)
}
/**
 * 
Module category
 */
export const callCreateCategory = (category: ICategory) => {
    return axios.post<IBackendRes<ICategory>>(`/api/v1/categories`, category)
}

export const callGetCategories = ({ filter }: {
    filter?: string
}) => {
    const params = new URLSearchParams();

    if (filter) params.append("filter", filter);
    return axios.get<IBackendRes<ICategory[]>>(`/api/v1/categories?${params.toString()}`);
}

export const callDeleteCategory = (id: string) => {
    return axios.delete<IBackendRes<void>>(`/api/v1/categories/${id}`)
}

export const callUpdateCategory = (category: ICategory) => {
    return axios.put<IBackendRes<ICategory>>(`/api/v1/categories`, category)
}

export const callGetCategoryById = (id: string) => {
    return axios.get<IBackendRes<ICategory>>(`/api/v1/categories/${id}`)
}
/**
 * 
Module product
 */
export const callCreateProduct = (product: IProduct) => {
    return axios.post<IBackendRes<IProductResponseDTO>>(`/api/v1/products`, product);
}

export const callGetProductById = (id: string) => {
    return axios.get<IBackendRes<IProductResponseDTO>>(`/api/v1/products/${id}`);
}

export const callGetProducts = ({filter }: {
    filter?: string
}) => {
    const params = new URLSearchParams();

    if (filter) params.append("filter", filter);
    return axios.get<IBackendRes<IProductResponseDTO[]>>(`/api/v1/products?${params.toString()}`);
}

export const callUpdateProduct = (product: IProduct) => {
    return axios.put<IBackendRes<IProductResponseDTO>>(`/api/v1/products`, product);
}

export const callDeleteProduct = (id: string) => {
    return axios.delete<IBackendRes<void>>(`/api/v1/products/${id}`);
}


/**
 * 
Module productSize
 */
export const callCreateProductSize = (id: string, productSizeReq: IProductSizeReq) => {
    return axios.post<IBackendRes<IProductSizeRes>>(`/api/v1/products/${id}/variants`, productSizeReq);
};

export const callGetProductSizesByProductId = (id: string) => {
    return axios.get<IBackendRes<IProductSizeRes[]>>(`/api/v1/products/${id}/variants`);
};

export const callUpdateProductSize = (id: string, productSizeReq: IProductSizeReq) => {
    return axios.put<IBackendRes<IProductSizeRes>>(`/api/v1/products/${id}/variants`, productSizeReq);
}

/**
 * 
Module topping
 */
export const callCreateTopping = (topping: ITopping) => {
    return axios.post<IBackendRes<ITopping>>(`/api/v1/toppings`, topping);
}

export const callGetToppingById = (id: string) => {
    return axios.get<IBackendRes<ITopping>>(`/api/v1/toppings/${id}`);
}

export const callGetToppings = ({filter}: {
    filter?: string
}) => {
    const params = new URLSearchParams();

    if (filter) params.append("filter", filter);
    return axios.get<IBackendRes<ITopping[]>>(`/api/v1/toppings?${params.toString()}`);
}

export const callUpdateTopping = (topping: ITopping) => {
    return axios.put<IBackendRes<ITopping>>(`/api/v1/toppings`, topping);
}

export const callDeleteTopping = (id: string) => {
    return axios.delete<IBackendRes<void>>(`/api/v1/toppings/${id}`);
}
/**
 * 
Module order
 */
export const callCreateOrder = (order: IOrderReq) => {
    return axios.post<IBackendRes<IOrderRes>>(`/api/v1/orders`, order);
}

export const callGetOrders = ({filter}: {
    filter?: string
}) => {
    const params = new URLSearchParams();

    if (filter) params.append("filter", filter);
    return axios.get<IBackendRes<IOrderRes[]>>(`/api/v1/orders?${params.toString()}`);
}

export const callUpdateOrder = (order: IOrderUpdate) => {
    return axios.put<IBackendRes<IOrderRes>>(`/api/v1/orders`, order);
}

export const callDeleteOrder = (id: string) => {
    return axios.delete<IBackendRes<IOrderRes>>(`/api/v1/orders/${id}`);
}




/**
 * 
Module order detail
 */

export const callGetOrderDetailsByOrderId = (id: string) => {
    return axios.get<IBackendRes<IOrderDetailRes[]>>(`/api/v1/orders/${id}/details`);
}

/**
 * 
Module product favorite
 */
export const callCreateProductFavorite = (productFavoriteReq: IProductFavoriteReq) => {
    return axios.post<IBackendRes<IProductFavoriteRes>>(`/api/v1/favorite/products`, productFavoriteReq);
}

export const callGetProductFavoritesOfUser = (id: string) => {
    return axios.get<IBackendRes<IProductFavoriteRes[]>>(`/api/v1/favorite/products/users/${id}`);
}

export const callDeleteProductFavorite = (id: string) => {
    return axios.delete<IBackendRes<void>>(`/api/v1/favorite/products/${id}`);
}
/**
 * 
Module topping favorite
 */
export const callCreateToppingFavorite = (toppingFavoriteReq: IToppingFavoriteReq) => {
    return axios.post<IBackendRes<IToppingFavoriteRes>>(`/api/v1/favorite/toppings`, toppingFavoriteReq);
}

export const callGetToppingFavoritesOfUser = (id: string) => {
    return axios.get<IBackendRes<IToppingFavoriteRes[]>>(`/api/v1/favorite/toppings/users/${id}`);
}

export const callDeleteToppingFavorite = (id: string) => {
    return axios.delete<IBackendRes<void>>(`/api/v1/favorite/toppings/${id}`);
}

/**
 * 
 Module size
 */
export const callCreateSize = (size: ISize) => {
    return axios.post<IBackendRes<ISize>>(`/api/v1/sizes`, size);
}

export const callGetSizes = () => {
    return axios.get<IBackendRes<ISize[]>>(`/api/v1/sizes`);
}

export const callUpdateSize = (size: ISize) => {
    return axios.put<IBackendRes<ISize>>(`/api/v1/sizes`, size);
}
