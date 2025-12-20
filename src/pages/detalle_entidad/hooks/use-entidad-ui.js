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
    const [loadingExpense, setLoadingExpense] = useState(false);

    async function onCreateExpense(payload) {
        setLoadingExpense(true);
        await crearGastoEntidad(payload);
        setLoadingExpense(false);
        setOpenNewExpense(false);
    }

    async function onUpdateEntity(newName) {
        await actualizarEntidad(newName);
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
        loadingExpense,
        onUpdateEntity,
        onDeleteEntity,

        navigate,
    };
}
