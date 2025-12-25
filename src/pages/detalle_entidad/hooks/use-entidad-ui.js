import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEntidadData } from './use-entidad-data';

export function useEntidadUI() {
    const navigate = useNavigate();

    const { entity, stats, loading, crearGastoEntidad, actualizarEntidad, eliminarEntidad } =
        useEntidadData();

    const [tab, setTab] = useState('activos');
    const [openNewExpense, setOpenNewExpense] = useState(false);
    const [openEditEntity, setOpenEditEntity] = useState(false);
    const [loadingCreatingExpense, setLoadingCreatingExpense] = useState(false);
    const [loadingUpdatingEntity, setLoadingUpdatingEntity] = useState(false);

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

        onDeleteEntity,

        navigate,
    };
}
