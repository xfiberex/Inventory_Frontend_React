import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import type { Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';
import { ArrowLeftIcon, PencilSquareIcon } from '@heroicons/react/24/outline';

import { ProductAPI } from '../api/ProductAPI';
import { productSchema } from '../schemas/productSchema';
import type { ProductFormData } from '../schemas/productSchema';
import { QUERY_KEYS } from '../../../shared/constants/queryKeys';

export default function ProductEditView() {
    const { productId } = useParams<{ productId: string }>();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const id = Number(productId);

    // Redirigir si el id no es un número válido
    useEffect(() => {
        if (!productId || isNaN(id) || id <= 0) {
            navigate('/products', { replace: true });
        }
    }, [productId, id, navigate]);

    const { data: product, isLoading, isError } = useQuery({
        queryKey: [QUERY_KEYS.PRODUCTS, id],
        queryFn: () => ProductAPI.getById(id),
        enabled: !!id,
    });

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<ProductFormData>({
        resolver: zodResolver(productSchema.omit({ id: true })) as Resolver<ProductFormData>,
        defaultValues: { name: '', price: 0, quantity: 0 },
    });

    // Populate form once data is loaded
    useEffect(() => {
        if (product) {
            reset({
                name: product.name,
                price: product.price,
                quantity: product.quantity,
            });
        }
    }, [product, reset]);

    const updateMutation = useMutation({
        mutationFn: (data: ProductFormData) => ProductAPI.update({ id, data }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PRODUCTS] });
            toast.success('Producto actualizado exitosamente');
            navigate('/products');
        },
        onError: () => toast.error('Error al actualizar el producto'),
    });

    const onSubmit = (data: ProductFormData) => {
        updateMutation.mutate(data);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
            </div>
        );
    }

    if (isError || !product) {
        return (
            <div className="max-w-lg mx-auto mt-16 text-center space-y-4 px-4">
                <p className="text-red-500 font-semibold">No se pudo cargar el producto.</p>
                <button
                    onClick={() => navigate('/products')}
                    className="text-indigo-600 hover:underline text-sm flex items-center gap-1 mx-auto"
                >
                    <ArrowLeftIcon className="w-4 h-4" /> Volver al inventario
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-lg mx-auto pt-10 px-4">
            <button
                onClick={() => navigate('/products')}
                className="flex items-center gap-1.5 text-slate-500 hover:text-indigo-600 text-sm mb-6 transition-colors"
            >
                <ArrowLeftIcon className="w-4 h-4" />
                Volver al inventario
            </button>

            <div className="bg-white p-8 shadow-md rounded-xl border border-gray-100">
                <h2 className="text-xl font-orbitron font-bold text-slate-800 mb-6 flex items-center gap-2">
                    <PencilSquareIcon className="w-6 h-6 text-indigo-600" />
                    Editar Producto
                    <span className="ml-auto text-xs font-mono font-normal text-slate-400 bg-slate-100 px-2 py-1 rounded">
                        #{product.id}
                    </span>
                </h2>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-slate-600 mb-1">
                            Nombre del producto
                        </label>
                        <input
                            {...register('name')}
                            className={`w-full p-2.5 rounded-lg border ${
                                errors.name ? 'border-red-500 bg-red-50' : 'border-gray-200'
                            } focus:ring-2 focus:ring-indigo-500 outline-none transition-all`}
                        />
                        {errors.name && (
                            <span className="text-red-500 text-xs mt-1 block">{errors.name.message}</span>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-600 mb-1">Precio</label>
                            <input
                                type="number"
                                step="0.01"
                                {...register('price')}
                                className={`w-full p-2.5 rounded-lg border ${
                                    errors.price ? 'border-red-500 bg-red-50' : 'border-gray-200'
                                } focus:ring-2 focus:ring-indigo-500 outline-none`}
                            />
                            {errors.price && (
                                <span className="text-red-500 text-xs mt-1 block">{errors.price.message}</span>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-600 mb-1">Cantidad</label>
                            <input
                                type="number"
                                {...register('quantity')}
                                className={`w-full p-2.5 rounded-lg border ${
                                    errors.quantity ? 'border-red-500 bg-red-50' : 'border-gray-200'
                                } focus:ring-2 focus:ring-indigo-500 outline-none`}
                            />
                            {errors.quantity && (
                                <span className="text-red-500 text-xs mt-1 block">{errors.quantity.message}</span>
                            )}
                        </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={() => navigate('/products')}
                            className="flex-1 border border-gray-200 text-slate-600 hover:bg-slate-50 font-semibold py-2.5 rounded-lg transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={updateMutation.isPending}
                            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-lg transition-colors disabled:opacity-50"
                        >
                            {updateMutation.isPending ? 'Guardando...' : 'Guardar Cambios'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
