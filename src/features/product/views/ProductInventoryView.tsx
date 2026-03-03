import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import type { Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';
import { TrashIcon, PlusCircleIcon, PencilSquareIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';

// Importamos desde nuestro ecosistema feature-based y compartidos
import { ProductAPI } from '../api/ProductAPI';
import { productSchema } from '../schemas/productSchema';
import type { Product, ProductFormData } from '../schemas/productSchema';
import { QUERY_KEYS } from '../../../shared/constants/queryKeys';

export default function ProductInventoryView() {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    // 1. Configuramos el Formulario (Zod + React Hook Form)
    const { register, handleSubmit, reset, formState: { errors } } = useForm<ProductFormData>({
        resolver: zodResolver(productSchema) as Resolver<ProductFormData>,
        defaultValues: { name: '', price: 0, quantity: 0 }
    });

    // 2. Traer los datos (React Query - equivalente a GET /api/products)
    const { data: products, isLoading, isError } = useQuery<Product[]>({
        queryKey: [QUERY_KEYS.PRODUCTS],
        queryFn: ProductAPI.getAll,
    });

    // 3. Crear Producto (React Query Mutation)
    const createMutation = useMutation({
        mutationFn: ProductAPI.create,
        onSuccess: () => {
            // Invalida la cache local, obliga a React Query a refescar el listado 
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PRODUCTS] });
            toast.success('Producto creado exitosamente');
            reset(); // Limpia formulario
        },
        onError: () => toast.error('Error al crear el producto')
    });

    // 4. Eliminar Producto (React Query Mutation)
    const deleteMutation = useMutation({
        mutationFn: ProductAPI.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PRODUCTS] });
            toast.info('Producto eliminado');
        },
        onError: () => toast.error('Error al eliminar el producto')
    });

    // Manejador del Submit
    const onSubmit = (data: ProductFormData) => {
        createMutation.mutate(data);
    };

    if (isError) return <div className="text-red-500 font-inter">Error cargando el backend ASP.NET. ¿Tienes el servidor y CORS configurados?</div>;

    return (
        <div className="font-inter max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 pt-10 px-4">

            {/* SECCIÓN 1: Formulario */}
            <div className="md:col-span-1 bg-white p-6 shadow-md rounded-xl border border-gray-100 h-fit">
                <h2 className="text-xl font-orbitron font-bold text-slate-800 mb-6 flex items-center gap-2">
                    <PlusCircleIcon className="w-6 h-6 text-indigo-600" />
                    Nuevo Producto
                </h2>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-600 mb-1">Nombre del producto</label>
                        <input
                            {...register('name')}
                            className={`w-full p-2.5 rounded-lg border ${errors.name ? 'border-red-500 bg-red-50' : 'border-gray-200'} focus:ring-2 focus:ring-indigo-500 outline-none transition-all`}
                        />
                        {errors.name && <span className="text-red-500 text-xs">{errors.name.message}</span>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-600 mb-1">Precio</label>
                            <input
                                type="number" step="0.01" {...register('price')}
                                className="w-full p-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                            />
                            {errors.price && <span className="text-red-500 text-xs">{errors.price.message}</span>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-600 mb-1">Cantidad</label>
                            <input
                                type="number" {...register('quantity')}
                                className="w-full p-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                            />
                            {errors.quantity && <span className="text-red-500 text-xs">{errors.quantity.message}</span>}
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={createMutation.isPending}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-lg transition-colors flex justify-center mt-6 disabled:opacity-50"
                    >
                        {createMutation.isPending ? 'Guardando...' : 'Guardar Producto'}
                    </button>
                </form>
            </div>

            {/* SECCIÓN 2: Data Grid / Lista de Inventario */}
            <div className="md:col-span-2 bg-white shadow-md rounded-xl border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 bg-slate-50">
                    <h2 className="text-xl font-orbitron font-bold text-slate-800">Inventario Actual</h2>
                </div>

                <div className="p-0 overflow-x-auto">
                    {isLoading ? (
                        <div className="p-10 text-center text-slate-500 animate-pulse">Cargando inventario...</div>
                    ) : (
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 text-slate-500 text-sm">
                                <tr>
                                    <th className="p-4 font-semibold">ID</th>
                                    <th className="p-4 font-semibold">Producto</th>
                                    <th className="p-4 font-semibold">Precio</th>
                                    <th className="p-4 font-semibold text-center">Stock</th>
                                    <th className="p-4 font-semibold text-center">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {products?.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="p-8 text-center text-gray-400">No hay productos. Añade uno.</td>
                                    </tr>
                                ) : (
                                    products?.map((prod) => (
                                        <tr key={prod.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="p-4 text-sm font-mono text-slate-500">#{prod.id}</td>
                                            <td className="p-4 font-medium text-slate-700">{prod.name}</td>
                                            <td className="p-4 text-emerald-600 font-semibold">${prod.price.toFixed(2)}</td>
                                            <td className="p-4 text-center">
                                                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${prod.quantity === 0 ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                                                    {prod.quantity}
                                                </span>
                                            </td>
                                            <td className="p-4 flex justify-center gap-2">
                                                <button
                                                    onClick={() => prod.id && navigate(`/products/${prod.id}/edit`)}
                                                    className="p-1.5 text-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-all"
                                                    title="Editar producto"
                                                    type="button"
                                                >
                                                    <PencilSquareIcon className="w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        if (prod.id && window.confirm(`¿Eliminar "${prod.name}"?`)) {
                                                            deleteMutation.mutate(prod.id);
                                                        }
                                                    }}
                                                    className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition-all"
                                                    title="Eliminar producto"
                                                    type="button"
                                                >
                                                    <TrashIcon className="w-5 h-5" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

        </div>
    );
}