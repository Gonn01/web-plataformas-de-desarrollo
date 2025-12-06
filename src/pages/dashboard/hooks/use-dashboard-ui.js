import { useState } from 'react';

export function useDashboardUI() {
    const [currency, setCurrency] = useState('ARS');
    const [query, setQuery] = useState('');
    const [openNewExpense, setOpenNewExpense] = useState(false);

    return {
        currency,
        setCurrency,
        query,
        setQuery,
        openNewExpense,
        setOpenNewExpense,
    };
}
