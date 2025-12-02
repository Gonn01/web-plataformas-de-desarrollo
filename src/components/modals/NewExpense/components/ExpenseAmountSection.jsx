// src/components/modals/NewExpenseCard/components/ExpenseAmountSection.jsx
import TextInput from '@/components/TextInput';

export default function ExpenseAmountSection({ amount, setAmount, currency, setCurrency }) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 items-end">
            <div className="sm:col-span-3">
                <TextInput
                    label="Monto total"
                    type="number"
                    placeholder="150000"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                />
            </div>

            <div className="relative sm:col-span-2">
                <label className="text-white text-sm font-medium">Moneda</label>
                <select
                    className="h-12 w-full rounded-lg border border-[#3d5245] bg-[#1c2620] px-3 text-white"
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                >
                    <option>ARS</option>
                    <option>USD</option>
                    <option>EUR</option>
                </select>
            </div>
        </div>
    );
}
