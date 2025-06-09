import { IProductResponseDTO } from './product';

export interface IRatingReq {
  productId: string;
  userId: string;
  score: number;
  comment: string;
}

export interface IRatingRes {
  id: string;
  userId: string;
  product: IProductResponseDTO;
  score: number;
  comment: string;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
  updatedBy?: string;
}
