export interface IBackendRes<T> {
  error?: string | string[];
  message: string;
  statusCode: number | string;
  data?: T;
}

export interface IModelPaginate<T> {
  meta: {
    page: number;
    pageSize: number;
    pages: number;
    total: number;
  };
  result: T[];
}

export interface IMeta {
  page: number;
  pageSize: number;
  pages: number;
  total: number;
}
export interface IAccount {
  access_token: string;
  user: {
    id: string;
    email: string;
    userName: string;
    role: {
      id: string;
      name: string;
      permissions: {
        id: string;
        name: string;
        apiPath: string;
        method: string;
        module: string;
      }[];
    };
  };
}

export interface IGetAccount extends Omit<IAccount, "access_token"> {}

export interface IUser {
  id?: string;
  name: string;
  email: string;
  password?: string;
  phone: string;
  age?: number;
  gender?: string;
  birthdate?: string;
  avatar?: string;
  role?: {
    id: string;
    name: string;
  } | null;
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
  updatedBy?: string;
}

export interface IFile {
    fileName: string;
    uploadTime: string;
}

export interface IRole {
  id: string;
  name: string;
  description: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
  permissions: {
    id: string;
    name: string;
    apiPath: string;
    method: string;
    module: string;
    createdAt: string;
    updatedAt: string;
    createdBy: string;
    updatedBy: string;
  }[];
}

export interface IAddressUser {
  id?: string;
  addressLine: string;
  ward: string;
  district: string;
  province: string;
  receiverName: string;
  receiverPhone: string;
  description: string;
  defaultAddress: boolean;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
  updatedBy?: string;
  user: {
    id: string
  };
}
