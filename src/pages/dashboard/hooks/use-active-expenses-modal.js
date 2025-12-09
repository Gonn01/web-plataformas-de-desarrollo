import { useState, useCallback } from 'react';

export function useActiveExpensesModal() {
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

    return {
        modalOpen,
        modalItems,
        modalEntity,
        setModalOpen,
        openGroup,
        openItem,
    };
}
