export interface IProduct {
    id: string;
    name: string;
    active: boolean;
    description: string;
    image: string;
    category: ICategory;
    createdAt: string;
    updatedAt: string;
    createdBy: string;
    updatedBy: string;
    averageRating?: number;


}
export interface IProductResponseDTO{
    id: string;
    name: string;
    active: boolean;
    description: string;
    image: string;
    createdAt: string;
    updatedAt: string;
    createdBy: string;
    updatedBy: string;
    averageRating?: number;
    category: {
        id: string;
        name: string;
        active: boolean;

    }
}
