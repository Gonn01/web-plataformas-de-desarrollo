import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import useAuth from '@/hooks/use-auth';
import { useEntitiesStore } from '@/store/use-entities-store';
import { useEffect } from 'react';

export default function AppLayout() {
    const { token } = useAuth();
    const { loadEntities } = useEntitiesStore();

    useEffect(() => {
        if (token) loadEntities(token);
    }, [loadEntities, token]);

    return (
        <div className="font-display bg-background-light dark:bg-background-dark">
            <div className="flex h-screen w-full overflow-hidden">
                <Sidebar className="h-full shrink-0" />

                <main className="flex-1 overflow-y-auto p-1 sm:p-2 md:p-5">
                    <div className="mx-auto max-w-7xl">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
}
