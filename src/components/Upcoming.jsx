import Icon from './Icon';
import { UPCOMING } from '../data/constants';

export default function Upcoming() {
    return (
        <div className="lg:col-span-3 xl:col-span-1 flex flex-col gap-6">
            <h3 className="text-slate-900 dark:text-white text-lg font-bold leading-tight tracking-[-0.015em]">
                Próximos Vencimientos
            </h3>
            <div className="flex flex-col gap-4">
                {UPCOMING.map((u, i) => (
                    <div
                        key={i}
                        className={`flex items-start gap-4 rounded-xl p-4 border ${u.tone === 'yellow' ? 'bg-yellow-400/10 dark:bg-yellow-500/10 border-yellow-400/20 dark:border-yellow-500/20' : u.tone === 'red' ? 'bg-red-500/10 dark:bg-red-500/10 border-red-500/20' : 'bg-blue-500/10 dark:bg-blue-500/10 border-blue-500/20'}`}
                    >
                        <div
                            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${u.tone === 'yellow' ? 'bg-yellow-400/20 dark:bg-yellow-500/20 text-yellow-600 dark:text-yellow-300' : u.tone === 'red' ? 'bg-red-500/20 text-red-600 dark:text-red-300' : 'bg-blue-500/20 text-blue-600 dark:text-blue-300'}`}
                        >
                            <Icon name={u.icon} />
                        </div>
                        <div>
                            <p
                                className={`${u.tone === 'yellow' ? 'text-yellow-800 dark:text-yellow-200' : u.tone === 'red' ? 'text-red-800 dark:text-red-200' : 'text-blue-800 dark:text-blue-200'} font-semibold`}
                            >
                                {u.title}
                            </p>
                            <p
                                className={`${u.tone === 'yellow' ? 'text-yellow-700 dark:text-yellow-300' : u.tone === 'red' ? 'text-red-700 dark:text-red-300' : 'text-blue-700 dark:text-blue-300'} text-sm`}
                            >
                                {u.subtitle}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
