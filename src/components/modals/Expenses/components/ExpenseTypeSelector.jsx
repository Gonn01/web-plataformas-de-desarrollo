import Icon from '@/components/Icon';

export default function ExpenseTypeSelector({ type, setType }) {
    return (
        <div className="flex h-12 items-center justify-center rounded-lg bg-[#29382f] p-1.5">
            <label className="flex cursor-pointer h-full grow items-center justify-center gap-2 rounded-md px-3 text-[#9eb7a8] text-sm font-medium has-checked:bg-red-500/10 has-checked:text-red-400">
                <Icon name="arrow_upward" />
                <span>Debo</span>
                <input
                    type="radio"
                    className="invisible w-0"
                    value="Debo"
                    checked={type === 'Debo'}
                    onChange={() => setType('Debo')}
                />
            </label>

            <label className="flex cursor-pointer h-full grow items-center justify-center gap-2 rounded-md px-3 text-[#9eb7a8] text-sm font-medium has-checked:bg-green-500/10 has-checked:text-green-400">
                <Icon name="arrow_downward" />
                <span>Me deben</span>
                <input
                    type="radio"
                    className="invisible w-0"
                    value="Me deben"
                    checked={type === 'Me deben'}
                    onChange={() => setType('Me deben')}
                />
            </label>
        </div>
    );
}
