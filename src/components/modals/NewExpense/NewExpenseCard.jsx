// src/components/modals/NewExpenseCard/NewExpenseCard.jsx
import { useState, useMemo, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import useAuth from '@/hooks/use-auth';
import { createEntity, fetchFinancialEntities } from '@/services/api';

// COMPONENTES
import ExpenseTypeSelector from './components/ExpenseTypeSelector';
import EntitySelector from './components/EntitySelector';
import ExpenseAmountSection from './components/ExpenseAmountSection';
import ExpenseInstallmentsSection from './components/ExpenseInstallmentsSection';
import ExpenseFilesUpload from './components/ExpenseFilesUpload';
import Icon from '@/components/Icon';
import TextInput from '@/components/TextInput';

export default function NewExpenseCard({ onClose, onSave, defaultEntityId = null }) {
    const { token } = useAuth();

    // === STATES ===
    const [type, setType] = useState('Debo');
    const [name, setName] = useState('');
    const [entity, setEntity] = useState(defaultEntityId || '');
    const [entities, setEntities] = useState([]);

    const [amount, setAmount] = useState('');
    const [currency, setCurrency] = useState('ARS');

    const [installments, setInstallments] = useState('');

    const [files, setFiles] = useState(null);

    const [showNewEntity, setShowNewEntity] = useState(false);
    const [newEntityName, setNewEntityName] = useState('');
    const [isFixed, setIsFixed] = useState(false);
    const [isInstallment, setIsInstallment] = useState(false);
    const [paidInstallments, setPaidInstallments] = useState('0');

    const totalInstallments = Number(installments) || 0;
    const paid = Math.min(Number(paidInstallments) || 0, totalInstallments);

    const progressPct = totalInstallments > 0 ? Math.min(100, (paid / totalInstallments) * 100) : 0;

    const containerRef = useRef(null);

    const canSave = useMemo(
        () => name.trim() && entity && Number(amount) > 0 && currency,
        [name, entity, amount, currency],
    );

    // === LOAD ENTITIES ===
    useEffect(() => {
        const load = async () => {
            try {
                const response = await fetchFinancialEntities(token);
                setEntities(response);

                if (defaultEntityId) setEntity(defaultEntityId);
            } catch (err) {
                console.error('Error cargando entidades', err);
            }
        };

        load();
    }, [token, defaultEntityId]);

    // === CREATE ENTITY ===
    const handleCreateEntity = async () => {
        if (!newEntityName.trim()) return;

        try {
            const [created] = await createEntity({ name: newEntityName.trim() }, token);
            console.log('Entidad creada', created);
            setEntities((prev) => [...prev, created]);
            setEntity(created.id);
            setShowNewEntity(false);
            setNewEntityName('');
        } catch (err) {
            console.error('Error creando entidad', err);
        }
    };

    // === ESCAPE + SCROLL LOCK ===
    useEffect(() => {
        const onKey = (e) => e.key === 'Escape' && onClose?.();
        document.addEventListener('keydown', onKey);

        const prevScroll = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        return () => {
            document.removeEventListener('keydown', onKey);
            document.body.style.overflow = prevScroll;
        };
    }, [onClose]);

    // === SAVE ===
    const handleSubmit = () => {
    if (!canSave) return;
    const currency_type =
        currency === 'USD' ? 2 : currency === 'EUR' ? 3 : 1;

    onSave?.({
        type,
        name: name.trim(),
        financial_entity_id: entity,
        amount: Number(amount),
        currency,
        currency_type,
        is_fixed_expense: isFixed,
        is_installment: isInstallment,
        installments: isInstallment ? totalInstallments : 0,
        paidInstallments: isInstallment ? Number(paidInstallments) : 0,
        files,
    });
};

    // === MODAL ===
    const modal = (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center"
            onMouseDown={(e) => e.target === e.currentTarget && onClose?.()}
        >
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />

            <div
                ref={containerRef}
                className="relative z-10 w-[92vw] max-w-2xl max-h-[85vh] overflow-y-auto 
                           rounded-2xl shadow-xl bg-[#111714] border border-[#29382f]"
            >
                {/* HEADER */}
                <header className="sticky top-0 flex items-center justify-between border-b border-[#29382f] px-6 py-4 bg-[#111714]">
                    <div className="flex items-center gap-3 text-white">
                        <Icon name="add_circle" className="text-primary" />
                        <h2 className="text-white text-lg font-bold">Nuevo Gasto</h2>
                    </div>

                    <button
                        onClick={onClose}
                        className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#29382f] text-white hover:bg-[#3d5245]"
                    >
                        <Icon name="close" className="text-xl" />
                    </button>
                </header>

                {/* BODY */}
                <div className="p-6 space-y-6">
                    <ExpenseTypeSelector type={type} setType={setType} />
                    {/* CHECKBOXES */}
                    <div className="flex items-center gap-6 text-white">
                        {/* CUOTAS */}
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                className="w-4 h-4"
                                checked={isInstallment}
                                onChange={(e) => {
                                    setIsInstallment(e.target.checked);
                                    if (e.target.checked) setIsFixed(false); // no puede ser ambas cosas
                                }}
                            />
                            <span>Es por cuotas</span>
                        </label>

                        {/* GASTO FIJO */}
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                className="w-4 h-4"
                                checked={isFixed}
                                onChange={(e) => {
                                    setIsFixed(e.target.checked);
                                    if (e.target.checked) {
                                        setIsInstallment(false);
                                        setInstallments('');
                                        setPaidInstallments('0');
                                    }
                                }}
                            />
                            <span>Gasto fijo</span>
                        </label>
                    </div>

                    <EntitySelector
                        entity={entity}
                        setEntity={setEntity}
                        entities={entities}
                        showNewEntity={showNewEntity}
                        setShowNewEntity={setShowNewEntity}
                        newEntityName={newEntityName}
                        setNewEntityName={setNewEntityName}
                        handleCreateEntity={handleCreateEntity}
                    />

                    <TextInput
                        label="Nombre del gasto"
                        placeholder="Ej: Préstamo personal"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />

                    <ExpenseAmountSection
                        amount={amount}
                        setAmount={setAmount}
                        currency={currency}
                        setCurrency={setCurrency}
                    />

                    {isInstallment && (
                        <ExpenseInstallmentsSection
                            installments={installments}
                            setInstallments={setInstallments}
                            paidInstallments={paidInstallments}
                            setPaidInstallments={setPaidInstallments}
                            paid={paid}
                            totalInstallments={totalInstallments}
                            progressPct={progressPct}
                        />
                    )}

                    <ExpenseFilesUpload setFiles={setFiles} />
                </div>

                {/* FOOTER */}
                <footer className="sticky bottom-0 flex justify-end gap-3 border-t border-[#29382f] px-6 py-4 bg-[#111714]">
                    <button
                        onClick={onClose}
                        className="h-11 px-4 text-sm font-bold text-[#9eb7a8] hover:bg-[#29382f] rounded-lg"
                    >
                        Cancelar
                    </button>

                    <button
                        disabled={!canSave}
                        onClick={handleSubmit}
                        className="h-11 px-4 text-sm font-bold flex items-center gap-2 rounded-lg 
                                   bg-primary text-black disabled:opacity-60"
                    >
                        <Icon name="save" />
                        Guardar gasto
                    </button>
                </footer>
            </div>
        </div>
    );

    return createPortal(modal, document.body);
}
