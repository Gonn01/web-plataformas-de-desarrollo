import { formatMoney } from '@/utils/format-money';

export default function BalancePill({ amount, currency }) {
    const positive = amount >= 0;
    return (
        <p
            className={`${positive ? 'text-green-600 dark:text-green-500' : 'text-red-600 dark:text-red-500'
                } text-sm font-medium leading-normal`}
        >
            {`Balance Neto ${currency}: ${formatMoney(amount, currency)}`}
        </p>
    );
}
