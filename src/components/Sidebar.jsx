import Icon from './Icon';
import { USER } from '../data/constants';

export default function Sidebar() {
  return (
    <aside className="flex w-64 flex-col border-r border-black/10 dark:border-white/10 p-4 bg-white/50 dark:bg-background-dark">
      <div className="flex flex-col gap-4">
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
        <nav className="flex flex-col gap-2 mt-4">
          <a
            className="flex items-center gap-3 px-3 py-2 rounded-lg bg-primary/20 text-primary"
            href="#"
          >
            <Icon name="dashboard" className="text-2xl" />
            <p className="text-sm font-medium leading-normal">Dashboard</p>
          </a>
          <a
            className="flex items-center gap-3 px-3 py-2 text-slate-700 dark:text-slate-300 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg"
            href="#"
          >
            <Icon name="arrow_upward" className="text-2xl text-red-500" />
            <p className="text-sm font-medium leading-normal">Debo</p>
          </a>
          <a
            className="flex items-center gap-3 px-3 py-2 text-slate-700 dark:text-slate-300 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg"
            href="#"
          >
            <Icon name="arrow_downward" className="text-2xl text-green-500" />
            <p className="text-sm font-medium leading-normal">Me Deben</p>
          </a>
          <a className="flex items-center gap-3 px-3 py-2 text-slate-700 dark:text-slate-300 hover:bg-primary/10 hover:text-primary rounded-lg" href="/entidades"> <Icon name="account_balance" className="text-2xl text-primary" />
            <p className="text-sm font-medium leading-normal">Entidades Financieras</p>
          </a>
        </nav>
      </div>
      <div className="mt-auto flex flex-col gap-1">
        <a
          className="flex items-center gap-3 px-3 py-2 text-slate-700 dark:text-slate-300 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg"
          href="#"
        >
          <Icon name="settings" className="text-2xl" />
          <p className="text-sm font-medium leading-normal">Configuración</p>
        </a>
      </div>
    </aside>
  );
}
