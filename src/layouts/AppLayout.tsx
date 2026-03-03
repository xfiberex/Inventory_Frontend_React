import { Outlet, NavLink } from 'react-router-dom';
import { CubeIcon } from '@heroicons/react/24/outline';

export default function AppLayout() {
    return (
        <div className="min-h-screen bg-slate-50 font-inter">
            <header className="bg-indigo-600 text-white shadow-md">
                <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <CubeIcon className="w-7 h-7 text-indigo-200" />
                        <h1 className="text-2xl font-orbitron font-bold tracking-wider">Inventory</h1>
                    </div>
                    <nav className="flex items-center gap-4">
                        <NavLink
                            to="/products"
                            end
                            className={({ isActive }) =>
                                `text-sm font-medium px-3 py-1.5 rounded-full transition-colors ${
                                    isActive
                                        ? 'bg-white text-indigo-700'
                                        : 'text-indigo-100 hover:bg-indigo-500'
                                }`
                            }
                        >
                            Inventario
                        </NavLink>
                    </nav>
                </div>
            </header>

            {/* React Router inyecta el componente lazy aquí */}
            <main className="max-w-7xl mx-auto py-8">
                <Outlet />
            </main>
        </div>
    );
}