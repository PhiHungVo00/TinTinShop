import { IAccount, IBackendRes, IFile, IGetAccount, IUser } from "@/types/backend"
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
    return axios.post<IBackendRes<string>|string>('/api/v1/auth/logout')
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

