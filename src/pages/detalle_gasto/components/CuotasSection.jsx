import Cuota from './Cuota';

export default function CuotasSection({ gasto }) {
    return (
        <section className="flex flex-col gap-4">
            <h2 className="text-xl font-bold">Cuotas</h2>

            {Array.from({ length: gasto.number_of_quotas }).map((_, index) => (
                <Cuota
                    key={index + 1}
                    icon={
                        index + 1 <= gasto.payed_quotas
                            ? 'check_circle'
                            : index + 1 === gasto.payed_quotas + 1
                                ? 'arrow_circle_right'
                                : 'schedule'
                    }
                    title={`Cuota #${index + 1}`}
                    monto={`$${gasto.amount_per_quota}`}
                    paid={index + 1 <= gasto.payed_quotas}
                    next={index + 1 === gasto.payed_quotas + 1}
                />
            ))}
        </section>
    );
}
