import { useCallback, useMemo, useState } from 'react';
import useAuth from '@/store/use-auth-store';
import { Currency } from '@/utils/enums';

const CURRENCY_VALUES = Object.values(Currency);

export function useDashboardUI(groups = [], pagarCuotas) {
    const { user } = useAuth();

    const [currency, setCurrency] = useState(null);
    const [query, setQuery] = useState('');
    const [openNewExpense, setOpenNewExpense] = useState(false);
    const [loadingCreatingExpense, setLoadingCreatingExpense] = useState(false);
    const [typeFilter, setTypeFilter] = useState(null);
    const [fixedFilter, setFixedFilter] = useState(null);
    const [loadingPayIds, setLoadingPayIds] = useState(new Set());

    const preferredCurrency = (() => {
        const pref = user?.preferred_currency;
        return CURRENCY_VALUES.includes(pref) ? pref : Currency.ARS;
    })();

    const filteredGroups = useMemo(() => {
        const q = query.trim().toLowerCase();

        return groups
            .map((g) => {
                const matchEntityName = q ? g.name.toLowerCase().includes(q) : false;

                const items = g.items.filter((it) => {
                    const matchTitle = q
                        ? matchEntityName || it.name.toLowerCase().includes(q)
                        : true;
                    const matchCurrency = currency === null || it.currency_type === currency;
                    const matchType = typeFilter === null || it.type === typeFilter;
                    const matchFixed = fixedFilter === null || it.fixed_expense === fixedFilter;

                    return matchTitle && matchCurrency && matchType && matchFixed;
                });

                return { ...g, items };
            })
            .filter((g) => g.items.length > 0);
    }, [groups, currency, query, typeFilter, fixedFilter]);

    const [modalOpen, setModalOpen] = useState(false);
    const [modalEntity, setModalEntity] = useState('');
    const [modalItems, setModalItems] = useState([]);

    const openGroup = useCallback((group) => {
        setModalEntity(group.name);
        setModalItems(group.items);
        setModalOpen(true);
    }, []);

    const openItem = useCallback((group, item) => {
        setModalEntity(group.name);
        setModalItems([item]);
        setModalOpen(true);
    }, []);

    const payModal = {
        modalOpen,
        modalItems,
        modalEntity,
        setModalOpen,
        openGroup,
        openItem,
    };

    async function onConfirmPay() {
        payModal.setModalOpen(false);

        const ids = payModal.modalItems.map((i) => i.id);
        setLoadingPayIds((prev) => new Set([...prev, ...ids]));

        await pagarCuotas(payModal.modalItems);

        setLoadingPayIds(new Set());
    }

    return {
        currency,
        setCurrency,
        preferredCurrency,
        query,
        setQuery,
        openNewExpense,
        setOpenNewExpense,
        loadingCreatingExpense,
        setLoadingCreatingExpense,

        typeFilter,
        setTypeFilter,
        fixedFilter,
        setFixedFilter,
        filteredGroups,

        payModal,
        loadingPayIds,
        onConfirmPay,
    };
}
