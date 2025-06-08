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
    category: {
        id: string;
        name: string;
        active: boolean;

    }
}
