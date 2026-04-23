import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEntidadData } from './use-entidad-data';
import { usePayments } from '@/hooks/use-payments';
import useAuth from '@/hooks/use-auth';

export function useEntidadUI() {
    const navigate = useNavigate();
    const { token } = useAuth();

    const {
        entity,
        stats,
        loading,
        crearGastoEntidad,
        actualizarEntidad,
        eliminarEntidad,
        vincularUsuario,
        desvincularUsuario,
        setEntity,
    } = useEntidadData();

    const [tab, setTab] = useState('activos');
    const [openNewExpense, setOpenNewExpense] = useState(false);
    const [openEditEntity, setOpenEditEntity] = useState(false);
    const [loadingCreatingExpense, setLoadingCreatingExpense] = useState(false);
    const [loadingUpdatingEntity, setLoadingUpdatingEntity] = useState(false);
    const [loadingVincular, setLoadingVincular] = useState(false);

    // Payment modal
    const [payModalOpen, setPayModalOpen] = useState(false);
    const [payModalItem, setPayModalItem] = useState(null);
    const [loadingPayIds, setLoadingPayIds] = useState(new Set());

    const { handleConfirm } = usePayments(token);

    function openPayModal(gasto) {
        setPayModalItem(gasto);
        setPayModalOpen(true);
    }

    async function onConfirmPay() {
        if (!payModalItem) return;
        setPayModalOpen(false);
        setLoadingPayIds((prev) => new Set([...prev, payModalItem.id]));

        await handleConfirm([payModalItem]);

        setEntity((prev) => {
            if (!prev) return prev;
            const update = (list) =>
                list.map((g) =>
                    g.id === payModalItem.id
                        ? { ...g, payed_quotas: g.payed_quotas + 1 }
                        : g,
                );
            return { ...prev, gastos_activos: update(prev.gastos_activos) };
        });

        setLoadingPayIds((prev) => {
            const next = new Set(prev);
            next.delete(payModalItem.id);
            return next;
        });
        setPayModalItem(null);
    }

    async function onCreateExpense(payload) {
        setLoadingCreatingExpense(true);
        await crearGastoEntidad(payload);
        setLoadingCreatingExpense(false);
        setOpenNewExpense(false);
    }

    async function onUpdateEntity(newName) {
        setLoadingUpdatingEntity(true);
        await actualizarEntidad(newName);
        setLoadingUpdatingEntity(false);
        setOpenEditEntity(false);
    }

    async function onDeleteEntity() {
        await eliminarEntidad();
        navigate('/app/entidades');
    }

    async function onVincular(email) {
        setLoadingVincular(true);
        try {
            await vincularUsuario(email);
        } finally {
            setLoadingVincular(false);
        }
    }

    async function onDesvincular() {
        setLoadingVincular(true);
        try {
            await desvincularUsuario();
        } finally {
            setLoadingVincular(false);
        }
    }

    return {
        entity,
        stats,
        loading,

        tab,
        setTab,

        openNewExpense,
        setOpenNewExpense,
        openEditEntity,
        setOpenEditEntity,

        onCreateExpense,
        loadingCreatingExpense,

        onUpdateEntity,
        loadingUpdatingEntity,

        onVincular,
        onDesvincular,
        loadingVincular,

        onDeleteEntity,

        payModalOpen,
        payModalItem,
        openPayModal,
        onConfirmPay,
        setPayModalOpen,
        loadingPayIds,

        navigate,
    };
}
