import { useState, useEffect } from 'react';
import useAuth from '@/hooks/use-auth';
import { Currency } from '@/utils/enums';

const CURRENCY_VALUES = Object.values(Currency);

export function useDashboardUI() {
    const { user } = useAuth();

    const [currency, setCurrency] = useState(Currency.ARS);
    const [query, setQuery] = useState('');
    const [openNewExpense, setOpenNewExpense] = useState(false);

    useEffect(() => {
        if (!user) return;

        const pref =
            user.preferred_currency !== undefined ? user.preferred_currency : user.monedaPreferida;

        setCurrency(CURRENCY_VALUES[pref] ?? Currency.ARS);
    }, [user]);

    return {
        currency,
        setCurrency,
        query,
        setQuery,
        openNewExpense,
        setOpenNewExpense,
    };
}
