import { api } from "../../../shared/api/axios";
import type { Product, ProductFormData } from "../schemas/productSchema";

export const ProductAPI = {
    getAll: async (): Promise<Product[]> => {
        const { data } = await api.get("/products");
        return data;
    },
    // Necesario para leer datos en /admin/products/:productId/edit
    getById: async (id: number): Promise<Product> => {
        const { data } = await api.get(`/products/${id}`);
        return data;
    },
    create: async (productData: ProductFormData): Promise<Product> => {
        const { data } = await api.post("/products", productData);
        return data;
    },
    // Necesario para actualizar
    update: async ({
        id,
        data,
    }: {
        id: number;
        data: ProductFormData;
    }): Promise<Product> => {
        const response = await api.put(`/products/${id}`, data);
        return response.data;
    },
    delete: async (id: number): Promise<void> => {
        await api.delete(`/products/${id}`);
    },
};