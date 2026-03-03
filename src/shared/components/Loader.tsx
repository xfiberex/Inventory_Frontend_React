export default function Loader() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
            <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
            <p className="text-slate-500 font-inter animate-pulse">Cargando módulo...</p>
        </div>
    );
}