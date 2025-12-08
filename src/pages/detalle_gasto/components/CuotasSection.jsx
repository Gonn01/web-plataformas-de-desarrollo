import Cuota from './Cuota';

export default function CuotasSection({ cuotas }) {
    return (
        <section className="flex flex-col gap-4">
            <h2 className="text-xl font-bold">Cuotas</h2>

            {cuotas.map((c) => (
                <Cuota
                    key={c.nro}
                    icon={c.pagada ? 'check_circle' : c.proxima ? 'arrow_circle_right' : 'schedule'}
                    title={`Cuota #${c.nro}`}
                    venc={c.venc}
                    monto={`$${c.monto.toFixed(2)}`}
                    paid={c.pagada}
                    next={!!c.proxima}
                />
            ))}
        </section>
    );
}
