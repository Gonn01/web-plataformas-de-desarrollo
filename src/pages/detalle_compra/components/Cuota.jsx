export default function Cuota({ icon, title, venc, monto, paid, next }) {
    const base = 'flex items-center justify-between p-4 rounded-lg shadow-sm bg-[#111714]';
    const mods = paid ? 'opacity-60' : next ? 'border border-primary/50' : '';

    return (
        <div className={`${base} ${mods}`}>
            <div className="flex items-center gap-4">
                <span
                    className={`material-symbols-outlined ${paid ? 'text-primary' : next ? 'text-primary animate-pulse' : 'text-gray-600'}`}
                >
                    {icon}
                </span>

                <div className="flex flex-col">
                    <p className={`font-medium ${paid ? 'line-through text-white' : 'text-white'}`}>
                        {title}
                    </p>
                    <p className="text-sm text-[#9eb7a8]">Vencimiento: {venc}</p>
                </div>
            </div>

            <p className={`font-semibold ${paid ? 'line-through text-white' : 'text-white'}`}>
                {monto}
            </p>
        </div>
    );
}
