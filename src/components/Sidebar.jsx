import { NavLink } from 'react-router-dom';
import Icon from './Icon';
import { USER } from '../data/constants';

export default function Sidebar() {
    // 👉 definimos las clases base fuera del JSX
    const base = 'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium leading-normal';
    const idle = 'text-slate-700 dark:text-slate-300 hover:bg-black/5 dark:hover:bg-white/5';
    const active = 'bg-primary/20 text-primary';

    return (
        <aside className="flex w-64 flex-col border-r border-black/10 dark:border-white/10 p-4 bg-white/50 dark:bg-background-dark">
            <div className="flex flex-col gap-4">
                {/* Perfil del usuario */}
                <div className="flex items-center gap-3">
                    <div
                        className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
                        aria-label="User profile picture"
                        style={{ backgroundImage: `url(${USER.avatar})` }}
                    />
                    <div className="flex flex-col">
                        <h1 className="text-slate-900 dark:text-white text-base font-medium leading-normal">
                            {USER.name}
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
                        to="/app/me-deben"
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
            </div>
        </aside>
    );
}
