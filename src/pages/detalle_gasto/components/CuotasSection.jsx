import Cuota from './Cuota';
import { formatMoney } from '@/utils/FormatMoney';

export default function CuotasSection({ gasto }) {
    const paymentDates = (gasto.movements ?? [])
        .filter((m) => m.movement_type === 'PAYMENT')
        .sort((a, b) => new Date(a.payment_date) - new Date(b.payment_date))
        .map((m) => m.payment_date);

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
                    monto={formatMoney(gasto.amount_per_quota, gasto.currency_type)}
                    currency={gasto.currency_type}
                    paymentDate={paymentDates[index] ?? null}
                    paid={index + 1 <= gasto.payed_quotas}
                    next={index + 1 === gasto.payed_quotas + 1}
                />
            ))}
        </section>
    );
}
