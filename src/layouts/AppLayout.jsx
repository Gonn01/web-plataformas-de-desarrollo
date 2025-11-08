// src/layouts/AppLayout.jsx
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

export default function AppLayout() {
    return (
        <div className="font-display bg-background-light dark:bg-background-dark min-h-screen">
            <div className="flex min-h-screen w-full">
                {/* Sidebar siempre visible */}
                <Sidebar />

                {/* Contenido de cada página */}
                <main className="flex-1 p-4 sm:p-6 md:p-8">
                    <div className="mx-auto max-w-7xl">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
}
