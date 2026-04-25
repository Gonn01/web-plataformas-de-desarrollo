import { useState, useMemo, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import useAuth from '@/hooks/use-auth';
import { createEntity, createCategory } from '@/services/api';

import Icon from '@/components/Icon';
import TextInput from '@/components/TextInput';
import { useEntitiesStore } from '@/store/use-entities-store';
import { ExpenseType } from '@/utils/enums';
import { useCategoriesStore } from '@/store/use-categories-store';
import ExpenseTypeSelector from '../components/ExpenseTypeSelector';
import EntitySelector from '../components/EntitySelector';
import ExpenseAmountSection from '../components/ExpenseAmountSection';
import ExpenseInstallmentsSection from '../components/ExpenseInstallmentsSection';
import CategorySelector from '../components/CategorySelector';
import ExpenseModeSelector from '../components/ExpenseModeSelector';

export default function NewExpenseModal({
    onClose,
    onSave,
    saving = false,
    defaultEntityId = null,
}) {
    const { token } = useAuth();

    const [type, setType] = useState(ExpenseType.EGRESO);
    const [name, setName] = useState('');
    const [entity, setEntity] = useState(defaultEntityId || '');

    const [amount, setAmount] = useState('');
    const [currency, setCurrency] = useState('ARS');

    const [installments, setInstallments] = useState('');

    const [showNewEntity, setShowNewEntity] = useState(false);
    const [newEntityName, setNewEntityName] = useState('');
    const [isFixed, setIsFixed] = useState(false);
    const [isInstallment, setIsInstallment] = useState(false);
    const [isPaid, setIsPaid] = useState(false);
    const [paidInstallments, setPaidInstallments] = useState('0');
    const { entities, loading, addEntity } = useEntitiesStore();
    const [loadingNewEntity, setLoadingNewEntity] = useState(false);

    const { categories, loading: loadingCategories, addCategory } = useCategoriesStore();
    const [selectedCategoryIds, setSelectedCategoryIds] = useState([]);

    const handleToggleCategory = (id) => {
        setSelectedCategoryIds((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );
    };

    const handleCreateCategory = async (name) => {
        const created = await createCategory({ name }, token);
        addCategory(created);
        setSelectedCategoryIds((prev) => [...prev, created.id]);
    };

    useEffect(() => {
        if (!loading && entities.length === 0) {
            setShowNewEntity(true);
        }
    }, [loading, entities.length]);
    const totalInstallments = Number(installments) || 0;
    const paid = Math.min(Number(paidInstallments) || 0, totalInstallments);
    const progressPct = totalInstallments > 0 ? Math.min(100, (paid / totalInstallments) * 100) : 0;

    const containerRef = useRef(null);

    const canSave = useMemo(
        () => name.trim() && entity && Number(amount) > 0 && currency,
        [name, entity, amount, currency],
    );

    const handleCreateEntity = async () => {
        if (!newEntityName.trim()) return;
        setLoadingNewEntity(true);
        try {
            const created = await createEntity({ name: newEntityName.trim() }, token);
            addEntity(created);
            setEntity(created.id);
            setShowNewEntity(false);
            setNewEntityName('');
        } catch (err) {
            console.error('Error creando entidad', err);
        } finally {
            setLoadingNewEntity(false);
        }
    };

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

    function handleSubmit() {
        if (!canSave) return;

        const payload = {
            financial_entity_id: entity,
            name: name.trim(),
            amount: Number(amount),
            number_of_quotas: isInstallment ? Number(installments) : 1,
            currency_type: currency,
            first_quota_date: null,
            fixed_expense: isFixed,
            image: null,
            type,
            payed_quotas: isInstallment ? Number(paidInstallments) : isPaid ? 1 : 0,
            category_ids: selectedCategoryIds,
        };

        onSave?.(payload);
    }

    const modalContent = (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center"
            onMouseDown={(e) => e.target === e.currentTarget && onClose?.()}
        >
            {/* Background */}
            <div className="fixed inset-0 bg-black/60" />

            <div
                ref={containerRef}
                className="relative z-10 w-[92vw] max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl shadow-xl bg-[#111714] border border-[#29382f]"
            >
                {/* HEADER */}
                <header className="sticky top-0 flex items-center justify-between border-b border-[#29382f] px-6 py-4 bg-[#111714]">
                    <div className="flex items-center gap-3 text-white">
                        <Icon name="add_circle" className="text-primary" />
                        <h2 className="text-white text-lg font-bold">Nuevo Gasto</h2>
                    </div>

                    <button
                        onClick={onClose}
                        className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#29382f] text-white hover:bg-[#3d5245] cursor-pointer"
                    >
                        <Icon name="close" className="text-xl" />
                    </button>
                </header>

                {/* BODY */}
                <div className="p-6 space-y-6">
                    <ExpenseTypeSelector type={type} setType={setType} />

                    <ExpenseModeSelector
                        isInstallment={isInstallment}
                        isFixed={isFixed}
                        onChange={({ isInstallment: i, isFixed: f }) => {
                            setIsInstallment(i);
                            setIsFixed(f);
                            if (!i) { setInstallments(''); setPaidInstallments('0'); }
                            setIsPaid(false);
                        }}
                    />

                    {!isInstallment && !isFixed && (
                        <label className="flex items-center gap-3 cursor-pointer select-none">
                            <div
                                onClick={() => setIsPaid((v) => !v)}
                                className={`w-5 h-5 rounded flex items-center justify-center border transition-colors shrink-0 cursor-pointer
                                    ${isPaid ? 'bg-primary border-primary' : 'border-[#3d5245] bg-[#1c2620]'}`}
                            >
                                {isPaid && <span className="text-black text-xs font-bold">✓</span>}
                            </div>
                            <span className="text-white text-sm font-medium">Pagado</span>
                        </label>
                    )}

                    <EntitySelector
                        entity={entity}
                        setEntity={setEntity}
                        loading={loading}
                        loadingNewEntity={loadingNewEntity}
                        entities={entities}
                        showNewEntity={showNewEntity}
                        setShowNewEntity={setShowNewEntity}
                        newEntityName={newEntityName}
                        setNewEntityName={setNewEntityName}
                        handleCreateEntity={handleCreateEntity}
                    />

                    <CategorySelector
                        categories={categories}
                        selectedIds={selectedCategoryIds}
                        onToggle={handleToggleCategory}
                        onCreate={handleCreateCategory}
                        loading={loadingCategories}
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
                </div>

                {/* FOOTER */}
                <footer className="sticky bottom-0 flex justify-end gap-3 border-t border-[#29382f] px-6 py-4 bg-[#111714]">
                    <button
                        onClick={onClose}
                        className="h-11 px-4 text-sm font-bold text-[#9eb7a8] hover:bg-[#29382f] rounded-lg cursor-pointer"
                    >
                        Cancelar
                    </button>

                    <button
                        disabled={!canSave || saving}
                        onClick={handleSubmit}
                        className="
        h-11 px-4 text-sm font-bold flex items-center gap-2 rounded-lg 
        bg-primary text-black cursor-pointer hover:bg-primary/80
        disabled:opacity-60 disabled:cursor-not-allowed
    "
                    >
                        {saving ? (
                            <>
                                <Icon name="progress_activity" className="animate-spin" />
                                Guardando...
                            </>
                        ) : (
                            <>
                                <Icon name="save" />
                                Guardar gasto
                            </>
                        )}
                    </button>
                </footer>
            </div>
        </div>
    );

    return createPortal(modalContent, document.body);
}
