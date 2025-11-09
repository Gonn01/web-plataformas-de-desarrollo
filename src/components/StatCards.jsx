import { CARDS } from '../data/constants';

export default function StatCards() {
    return (
        <div className="flex flex-col gap-4">
            {CARDS.map((c) => (
                <div
                    key={c.label}
                    className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-xl p-6 border border-black/10 dark:border-white/10 bg-white dark:bg-white/5"
                >
                    <p className="text-slate-600 dark:text-slate-300 text-base font-medium leading-normal">
                        {c.label}
                    </p>
                    <p className={`${c.tone} tracking-tight text-3xl font-bold leading-tight`}>
                        {c.value}
                    </p>
                </div>
            ))}
        </div>
    );
}
