import { NavLink, useNavigate } from 'react-router-dom';
import Icon from '../pages/dashboard/components/Icon';
import { USER } from '../data/constants';
import useAuth from '@/hooks/use-auth';

export default function Sidebar() {
    //agregue lo del logout para cerrar la seccion
    const base = 'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium leading-normal';
    const idle = 'text-slate-700 dark:text-slate-300 hover:bg-black/5 dark:hover:bg-white/5';
    const active = 'bg-primary/20 text-primary';

    const { usuario, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login', { replace: true });
    };

    const avatar = usuario?.avatar || USER.avatar;
    const nombreVisible = usuario?.nombre || USER.name;

    return (
        <aside className="flex w-64 flex-col border-r border-black/10 dark:border-white/10 p-4 bg-white/50 dark:bg-background-dark">
            <div className="flex flex-col gap-4">
                {/* Perfil del usuario */}
                <div className="flex items-center gap-3">
                    <div
                        className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
                        aria-label="User profile picture"
                        /* style={{ backgroundImage: `url(${USER.avatar})` }} */
                        style={{ backgroundImage: `url(${avatar})` }}
                    />
                    <div className="flex flex-col">
                        <h1 className="text-slate-900 dark:text-white text-base font-medium leading-normal">
                            {nombreVisible}
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 text-sm font-normal leading-normal">
                            {USER.email}
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
                        to="/app/debo"
                        className={({ isActive }) => `${base} ${isActive ? active : idle}`}
                    >
                        <Icon name="arrow_upward" className="text-2xl text-red-500" />
                        <p>Debo</p>
                    </NavLink>

                    <NavLink
                        to="/app/medeben"
                        className={({ isActive }) => `${base} ${isActive ? active : idle}`}
                    >
                        <Icon name="arrow_downward" className="text-2xl text-green-500" />
                        <p>Me Deben</p>
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
                {/* Botón de Cerrar sesion */}
                <button onClick={handleLogout} className={`${base} ${idle} text-left w-full`}>
                    <Icon name="logout" className="text-2xl" />
                    <p>Cerrar sesión</p>
                </button>
            </div>
        </aside>
    );
}
