// src/components/modals/NewExpenseCard/components/ExpenseInstallmentsSection.jsx
import TextInput from '@/components/TextInput';

export default function ExpenseInstallmentsSection({
    installments,
    setInstallments,
    paidInstallments,
    paid,
    totalInstallments,
    progressPct,
}) {
    return (
        <>
            <div className="grid grid-cols-2 gap-4">
                <TextInput
                    label="Cantidad de cuotas"
                    type="number"
                    value={installments}
                    onChange={(e) => setInstallments(e.target.value)}
                />

                <div>
                    <label className="text-sm font-medium text-gray-500">Cuotas pagadas</label>
                    <input
                        disabled
                        className="h-12 w-full rounded-lg bg-[#29382f] px-3 text-gray-500"
                        value={paidInstallments}
                    />
                </div>
            </div>

            <div>
                <p className="text-white text-sm font-medium">Progreso</p>
                <div className="w-full bg-[#29382f] rounded-full h-2.5">
                    <div
                        className="bg-primary h-2.5 rounded-full"
                        style={{ width: `${progressPct}%` }}
                    />
                </div>
                <p className="text-right text-xs text-[#9eb7a8] mt-1">
                    {paid} de {totalInstallments} cuotas pagadas
                </p>
            </div>
        </>
    );
}
