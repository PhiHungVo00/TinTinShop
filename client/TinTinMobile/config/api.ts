import { IAccount, IAddressUser, IBackendRes, IFile, IGetAccount, IModelPaginate, IRole, IUser, ICoupon, ITopping } from "@/types/backend"
import axios from "./axios-customize"

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
    console.log('>> check url: ',`/api/v1/roles?${params.toString()}`);
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
 * Module Coupon
 */
export const getCoupons = () => {
    return axios.get<IBackendRes<ICoupon[]>>('/api/v1/coupons');
}

export const getCouponById = (id: string) => {
    return axios.get<IBackendRes<ICoupon>>(`/api/v1/coupons/${id}`);
}

export const createCoupon = (coupon: ICoupon) => {
    return axios.post<IBackendRes<ICoupon>>('/api/v1/coupons', coupon);
}

export const updateCoupon = (id: string, coupon: ICoupon) => {
    return axios.put<IBackendRes<ICoupon>>(`/api/v1/coupons/${id}`, coupon);
}

export const deleteCoupon = (id: string) => {
    return axios.delete<IBackendRes<ICoupon>>(`/api/v1/coupons/${id}`);
}

/**
 * Module Topping
 */
export const getToppings = () => {
    return axios.get<IBackendRes<ITopping[]>>('/api/v1/toppings');
}

export const getToppingById = (id: string) => {
    return axios.get<IBackendRes<ITopping>>(`/api/v1/toppings/${id}`);
}

export const createTopping = (topping: ITopping) => {
    return axios.post<IBackendRes<ITopping>>('/api/v1/toppings', topping);
}

export const updateTopping = (topping: ITopping) => {
    return axios.put<IBackendRes<ITopping>>('/api/v1/toppings', topping);
}

export const deleteTopping = (id: string) => {
    return axios.delete<IBackendRes<void>>(`/api/v1/toppings/${id}`);
}
