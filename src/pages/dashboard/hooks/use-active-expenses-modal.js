import { useState, useCallback } from 'react';

function mapItemForModal(it) {
    return {
        id: it.id,
        title: it.title || it.name || '',
        type: it.type,
        currency: it.currency || 'ARS',
        amountPerInstallment:
            typeof it.amountPerInstallment === 'number'
                ? it.amountPerInstallment
                : typeof it.remainingAmount === 'number'
                    ? it.remainingAmount
                    : typeof it.totalAmount === 'number'
                        ? it.totalAmount
                        : 0,
        totalAmount:
            typeof it.totalAmount === 'number' ? it.totalAmount : undefined,
        paidInstallments: it.installments?.paid ?? 0,
        totalInstallments: it.installments?.total ?? 0,
    };
}

export function useActiveExpensesModal() {
    const [modalOpen, setModalOpen] = useState(false);
    const [modalEntity, setModalEntity] = useState('');
    const [modalItems, setModalItems] = useState([]);

    const openGroup = useCallback((group) => {
        setModalEntity(group.title);
        setModalItems(group.items.map(mapItemForModal));
        setModalOpen(true);
    }, []);

    const openItem = useCallback((group, item) => {
        setModalEntity(group.title);
        setModalItems([mapItemForModal(item)]);
        setModalOpen(true);
    }, []);

    return {
        modalOpen,
        modalItems,
        modalEntity,
        setModalOpen,
        openGroup,
        openItem,
    };
}
