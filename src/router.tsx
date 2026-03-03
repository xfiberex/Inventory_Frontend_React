import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './layouts/AppLayout';
import Loader from './shared/components/Loader';

// Lazy imports – each view is code-split into its own chunk
const ProductInventoryView = lazy(
    () => import('./features/product/views/ProductInventoryView')
);
const ProductEditView = lazy(
    () => import('./features/product/views/ProductEditView')
);

export default function Router() {
    return (
        <BrowserRouter>
            <Suspense fallback={<Loader />}>
                <Routes>
                    <Route element={<AppLayout />}>
                        {/* Redirect root to /products */}
                        <Route index element={<Navigate to="/products" replace />} />

                        {/* Product list / inventory */}
                        <Route path="/products" element={<ProductInventoryView />} />

                        {/* Edit a specific product */}
                        <Route path="/products/:productId/edit" element={<ProductEditView />} />
                    </Route>

                    {/* 404 fallback */}
                    <Route path="*" element={<Navigate to="/products" replace />} />
                </Routes>
            </Suspense>
        </BrowserRouter>
    );
}
