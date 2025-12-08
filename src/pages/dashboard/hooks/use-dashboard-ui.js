import { useState, useEffect } from 'react';
import useAuth from '@/hooks/use-auth';
import { currencyCodeToLabel } from '@/pages/Configuracion';

export function useDashboardUI() {
    const { user } = useAuth();

    const [currency, setCurrency] = useState('ARS');
    const [query, setQuery] = useState('');
    const [openNewExpense, setOpenNewExpense] = useState(false);

    useEffect(() => {
        if (!user) return;

        const pref = user.preferred_currency !== undefined ? user.preferred_currency : user.monedaPreferida;

        const label = pref ? currencyCodeToLabel(pref) : 'ARS';
        setCurrency(label);
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
