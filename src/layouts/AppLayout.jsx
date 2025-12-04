// src/layouts/AppLayout.jsx
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

export default function AppLayout() {
    return (
        <div className="font-display bg-background-light dark:bg-background-dark">
            <div className="flex h-screen w-full overflow-hidden">
                {/* Sidebar fija sin scroll de la página */}
                <Sidebar className="h-full shrink-0" />

                {/* Contenido con scroll independiente */}
                <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
                    <div className="mx-auto max-w-7xl">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
}
