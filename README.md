# Inventory — Frontend

Frontend del sistema CRUD de inventario de productos, construido con **React 19**, **TypeScript**, **Vite 7** y **Tailwind CSS v4**.

## Tech Stack

| Categoría | Tecnología |
|---|---|
| Framework | React 19 |
| Lenguaje | TypeScript 5.9 |
| Bundler | Vite 7 (SWC) |
| Estilos | Tailwind CSS v4 |
| Routing | React Router DOM 7 |
| Server State | TanStack React Query 5 |
| Formularios | React Hook Form 7 + Zod 4 |
| HTTP Client | Axios |
| Notificaciones | React Toastify |
| Iconos | Heroicons 2 |

## Requisitos Previos

- **Node.js** >= 20
- **Backend** ASP.NET corriendo en `http://localhost:5284` (ver `BackendInventory/`)

## Instalación

```bash
cd FrontendInventory
npm install
```

## Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto (ya incluido por defecto):

```env
VITE_API_URL=http://localhost:5284/api
```

## Desarrollo

```bash
npm run dev
```

Abre [http://localhost:5173](http://localhost:5173) en tu navegador.

## Scripts Disponibles

| Comando | Descripción |
|---|---|
| `npm run dev` | Servidor de desarrollo con HMR |
| `npm run build` | Compila TypeScript y genera bundle de producción |
| `npm run preview` | Previsualiza el build de producción |
| `npm run lint` | Ejecuta ESLint |

## Estructura del Proyecto

```
src/
├── main.tsx                        # Entry point + QueryClient + ToastContainer
├── router.tsx                      # Rutas con lazy loading
├── index.css                       # Tailwind + fuentes personalizadas
├── features/
│   └── product/
│       ├── api/ProductAPI.ts       # Llamadas HTTP (CRUD)
│       ├── schemas/productSchema.ts# Esquema Zod + tipos TypeScript
│       └── views/
│           ├── ProductInventoryView.tsx  # Lista + formulario de creación
│           └── ProductEditView.tsx       # Edición de producto
├── layouts/
│   └── AppLayout.tsx               # Header + Outlet
└── shared/
    ├── api/axios.ts                # Instancia Axios configurada
    ├── components/Loader.tsx       # Spinner de carga
    └── constants/queryKeys.ts      # Claves de React Query centralizadas
```

## Funcionalidades

- **Listado** de productos con tabla responsive
- **Creación** de productos con validación Zod en tiempo real
- **Edición** de productos con carga automática de datos
- **Eliminación** con confirmación
- **Code splitting** automático por vista (lazy loading)
- **Cache inteligente** con TanStack Query (invalidación automática tras mutaciones)
