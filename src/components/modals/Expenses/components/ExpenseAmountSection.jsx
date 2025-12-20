import Icon from '@/components/Icon';
import TextInput from '@/components/TextInput';
import { CURRENCY_TYPE } from '@/utils/CurrencyType.js';

export default function ExpenseAmountSection({ amount, setAmount, currency, setCurrency }) {
    const isInvalid = amount !== '' && Number(amount) <= 0;

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

                {/* Mensaje de error */}
                {isInvalid && (
                    <p className="text-red-400 text-sm mt-1">
                        El monto debe ser mayor a 0 (no se aceptan números negativos).
                    </p>
                )}
            </div>

            <div className="relative sm:col-span-2">
                <label className="text-white text-sm font-medium">Moneda</label>

                <div className="relative">
                    <select
                        className="h-12 w-full rounded-lg border border-[#3d5245] bg-[#1c2620]
                       px-3 pr-10 text-white cursor-pointer appearance-none"
                        value={currency}
                        onChange={(e) => setCurrency(e.target.value)}
                    >
                        {Object.values(CURRENCY_TYPE).map((curr) => (
                            <option key={curr.id} value={curr.id}>
                                {curr.label}
                            </option>
                        ))}
                    </select>

                    {/* Flecha custom */}
                    <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-[#9eb7a8]">
                        <Icon name="expand_more" />
                    </div>
                </div>
            </div>
        </div>
    );
}
