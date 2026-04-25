import { NavLink, useNavigate } from 'react-router-dom';
import { useEffect, useState, useCallback } from 'react';
import Icon from './Icon';
import useAuth from '@/hooks/use-auth';
import { useCompartidosStore } from '@/store/use-compartidos-store';
import { fetchCompartidos } from '@/services/api';
import { usePusherChannel } from '@/hooks/use-pusher-channel';
import Snackbar from './Snackbar';

export default function Sidebar() {
    const base = 'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium leading-normal';
    const idle = 'text-slate-700 dark:text-slate-300 hover:bg-black/5 dark:hover:bg-white/5';
    const active = 'bg-primary/20 text-primary';

    const { user, logout, token } = useAuth();
    const navigate = useNavigate();
    const { pendingCount, setPendingCount } = useCompartidosStore();
    const [notification, setNotification] = useState(null);

    useEffect(() => {
        if (!token) return;
        fetchCompartidos(token)
            .then((data) => {
                const count = data.recibidos.filter((r) => r.status === 'PENDING_APPROVAL').length;
                setPendingCount(count);
            })
            .catch(() => {});
    }, [token, setPendingCount]);

    const handleNuevo = useCallback(() => {
        setPendingCount((c) => c + 1);
        setNotification('Recibiste un nuevo gasto compartido');
    }, [setPendingCount]);

    usePusherChannel(`compartidos-${user?.id}`, {
        'compartido.nuevo': handleNuevo,
    });

    const handleLogout = () => {
        logout();
        navigate('/login', { replace: true });
    };

    const avatar = user?.avatar;
    const nombreVisible = user?.name;
    const email = user?.email;

    return (
        <>
        {notification && (
            <Snackbar message={notification} onClose={() => setNotification(null)} />
        )}
        <aside className="flex w-64 flex-col border-r border-black/10 dark:border-white/10 p-4 bg-white/50 dark:bg-background-dark">
            <div className="flex flex-col gap-4">
                {/* Perfil del usuario */}
                <div className="flex items-center gap-3">
                    <div
                        className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
                        aria-label="User profile picture"
                        style={{ backgroundImage: `url(${avatar})` }}
                    />
                    <div className="flex flex-col">
                        <h1 className="text-slate-900 dark:text-white text-base font-medium leading-normal">
                            {nombreVisible}
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 text-sm font-normal leading-normal truncate max-w-40">
                            {email}
                        </p>
                    </div>
                </div>

                {/* Navegación */}
                <nav className="flex flex-col gap-2 mt-4">
                    <NavLink
                        to="/app/dashboard"
                        className={({ isActive }) => `${base} ${isActive ? active : idle}`}
                    >
                        <Icon name="dashboard" className="text-2xl" />
                        <p>Dashboard</p>
                    </NavLink>

                    <NavLink
                        to="/app/entidades"
                        className={({ isActive }) =>
                            `${base} ${isActive ? active : idle} hover:text-primary`
                        }
                    >
                        <Icon name="account_balance" className="text-2xl text-primary" />
                        <p>Entidades Financieras</p>
                    </NavLink>

                    <NavLink
                        to="/app/compartidos"
                        className={({ isActive }) => `${base} ${isActive ? active : idle}`}
                    >
                        <Icon name="group" className="text-2xl" />
                        <p className="flex-1">Compartidos</p>
                        {pendingCount > 0 && (
                            <span className="ml-auto bg-primary text-white text-xs font-bold rounded-full min-w-5 h-5 flex items-center justify-center px-1">
                                {pendingCount}
                            </span>
                        )}
                    </NavLink>
                </nav>
            </div>

            {/* Sección inferior */}
            <div className="mt-auto flex flex-col gap-1">
                <NavLink
                    to="/app/configuracion"
                    className={({ isActive }) => `${base} ${isActive ? active : idle}`}
                >
                    <Icon name="settings" className="text-2xl" />
                    <p>Configuración</p>
                </NavLink>
                <button onClick={handleLogout} className={`${base} ${idle} text-left w-full`}>
                    <Icon name="logout" className="text-2xl" />
                    <p>Cerrar sesión</p>
                </button>
            </div>
        </aside>
        </>
    );
}
