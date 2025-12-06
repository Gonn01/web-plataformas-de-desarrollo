// src/pages/entidad_detalle/hooks/use-entidad-ui.js

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEntidadData } from './use-entidad-data';

export function useEntidadUI() {
    const navigate = useNavigate();

    const { entity, stats, loading, crearGastoEntidad, actualizarEntidad, eliminarEntidad } =
        useEntidadData();

    // ------------------------------
    // UI STATE
    // ------------------------------
    const [tab, setTab] = useState('activos');
    const [openNewExpense, setOpenNewExpense] = useState(false);
    const [openEditEntity, setOpenEditEntity] = useState(false);

    // ------------------------------
    // ACCIONES UI
    // ------------------------------
    async function onCreateExpense(payload) {
        await crearGastoEntidad(payload);
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
        // DATA
        entity,
        stats,
        loading,

        // TABS
        tab,
        setTab,

        // MODALS
        openNewExpense,
        setOpenNewExpense,
        openEditEntity,
        setOpenEditEntity,

        // ACTIONS
        onCreateExpense,
        onUpdateEntity,
        onDeleteEntity,

        // NAV
        navigate,
    };
}
