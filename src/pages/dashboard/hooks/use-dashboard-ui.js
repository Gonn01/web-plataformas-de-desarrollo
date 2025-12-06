import { useState, useEffect } from 'react';
import useAuth from '@/hooks/use-auth';

function currencyCodeToLabel(codeOrLabel) {
    if (typeof codeOrLabel === 'string') {
        if (['ARS', 'USD', 'EUR'].includes(codeOrLabel)) return codeOrLabel;
    }

    const code = Number(codeOrLabel);
    switch (code) {
        case 2:
            return 'USD';
        case 3:
            return 'EUR';
        default:
            return 'ARS'; 
    }
}

export function useDashboardUI() {
    const { user } = useAuth();

    const [currency, setCurrency] = useState('ARS');
    const [query, setQuery] = useState('');
    const [openNewExpense, setOpenNewExpense] = useState(false);


    useEffect(() => {
        if (!user) return;

        const pref =
            user.preferred_currency !== undefined
                ? user.preferred_currency
                : user.monedaPreferida;

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
