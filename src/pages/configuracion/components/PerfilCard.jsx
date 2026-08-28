export function PerfilCard({ preview, nombreVisible, email }) {
    return (
        <div className="rounded-2xl border border-black/10 dark:border-white/10 p-4 bg-white/70 dark:bg-background-dark/70">
            <h2 className="text-base font-medium mb-3 text-slate-900 dark:text-white">
                Datos del usuario
            </h2>

            <div className="space-y-3 text-sm">
                <div className="flex flex-col gap-2">
                    <p className="text-slate-600 dark:text-slate-300 font-medium">Foto de perfil</p>

                    <div className="flex items-center gap-4">
                        <div
                            className="size-16 rounded-full bg-cover bg-center border border-black/20 dark:border-white/20"
                            style={{
                                backgroundImage: preview ? `url(${preview})` : 'none',
                            }}
                        />
                    </div>
                </div>

                <p className="text-slate-600 dark:text-slate-300 mt-3">
                    <span className="font-medium">Nombre: </span>
                    {nombreVisible}
                </p>

                <p className="text-slate-600 dark:text-slate-300 mt-3">
                    <span className="font-medium">Email: </span>
                    {email || '—'}
                </p>
            </div>
        </div>
    );
}
