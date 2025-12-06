import { useState, useEffect } from 'react';
import useAuth from '@/hooks/use-auth';

function currencyFromUser(user) {
    const pref = user?.preferred_currency ?? user?.monedaPreferida;
    if (!pref) return 'ARS';

    if (typeof pref === 'number') {
        if (pref === 2) return 'USD';
        if (pref === 3) return 'EUR';
        return 'ARS';
    }

    if (typeof pref === 'string') {
        if (['ARS', 'USD', 'EUR'].includes(pref)) return pref;
    }

    return 'ARS';
}

export function useDashboardUI() {
    const { user } = useAuth();

    const [currency, setCurrency] = useState('ARS');
    const [query, setQuery] = useState('');
    const [openNewExpense, setOpenNewExpense] = useState(false);

    useEffect(() => {
        if (!user) return;
        setCurrency((prev) => prev || currencyFromUser(user));
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
