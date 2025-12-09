import { useState, useMemo, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import useAuth from '@/hooks/use-auth';
import { useEntitiesStore } from '@/store/use-entities-store';
import Icon from '@/components/Icon';
import TextInput from '@/components/TextInput';
import { createEntity } from '@/services/api';
import ExpenseTypeSelector from '../components/ExpenseTypeSelector';
import EntitySelector from '../components/EntitySelector';
import ExpenseAmountSection from '../components/ExpenseAmountSection';
import ExpenseInstallmentsSection from '../components/ExpenseInstallmentsSection';

export default function UpdateExpenseModal({ gasto, onClose, onSave }) {
    const { token } = useAuth();
    const { entities, setEntities } = useEntitiesStore();

    const containerRef = useRef(null);

    const [type, setType] = useState(gasto.type === 'ME_DEBEN' ? 'Me deben' : 'Debo');
    const [name, setName] = useState(gasto.name);
    const [entity, setEntity] = useState(gasto.financial_entity_id);

    const [amount, setAmount] = useState(String(gasto.amount));
    const [currency, setCurrency] = useState(
        gasto.currency_type === '2' ? 'USD' : gasto.currency_type === '3' ? 'EUR' : 'ARS',
    );

    const [isFixed, setIsFixed] = useState(Boolean(gasto.fixed_expense));
    const [isInstallment, setIsInstallment] = useState(gasto.number_of_quotas > 0);

    const [installments, setInstallments] = useState(
        gasto.number_of_quotas ? String(gasto.number_of_quotas) : '',
    );

    const [paidInstallments, setPaidInstallments] = useState(
        gasto.payed_quotas ? String(gasto.payed_quotas) : '0',
    );

    const [showNewEntity, setShowNewEntity] = useState(false);
    const [newEntityName, setNewEntityName] = useState('');

    const totalInstallments = Number(installments) || 0;
    const paid = Math.min(Number(paidInstallments) || 0, totalInstallments);
    const progressPct = totalInstallments > 0 ? Math.min(100, (paid / totalInstallments) * 100) : 0;

    const canSave = useMemo(() => {
        return name?.trim() && entity && Number(amount) > 0 && currency;
    }, [name, entity, amount, currency]);

    const handleCreateEntity = async () => {
        if (!newEntityName.trim()) return;

        try {
            const created = await createEntity({ name: newEntityName.trim() }, token);
            setEntities((prev) => [...prev, created]);
            setEntity(created.id);
            setShowNewEntity(false);
            setNewEntityName('');
        } catch (err) {
            console.error('Error creando entidad', err);
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

    const handleSubmit = () => {
        if (!canSave) return;

        const currency_type = currency === 'USD' ? 2 : currency === 'EUR' ? 3 : 1;

        const payload = {
            financial_entity_id: entity,
            name: name.trim(),
            amount: Number(amount),
            number_of_quotas: isInstallment ? Number(installments) : 0,
            currency_type,
            first_quota_date: gasto.first_quota_date,
            fixed_expense: isFixed,
            image: gasto.image ?? null,
            type: type === 'Me deben' ? 'ME_DEBEN' : 'DEBO',
            payed_quotas: isInstallment ? Number(paidInstallments) : 0,
        };

        onSave?.(payload);
    };

    const modal = (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center"
            onMouseDown={(e) => e.target === e.currentTarget && onClose?.()}
        >
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />

            <div
                ref={containerRef}
                className="
                    relative z-10 w-[92vw] max-w-2xl max-h-[85vh] overflow-y-auto
                    rounded-2xl shadow-xl bg-[#111714] border border-[#29382f]
                "
            >
                {/* HEADER */}
                <header className="sticky top-0 flex items-center justify-between border-b border-[#29382f] px-6 py-4 bg-[#111714]">
                    <div className="flex items-center gap-3 text-white">
                        <Icon name="edit" className="text-primary" />
                        <h2 className="text-white text-lg font-bold">Editar Gasto</h2>
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
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                className="w-4 h-4"
                                checked={isInstallment}
                                onChange={(e) => {
                                    setIsInstallment(e.target.checked);
                                    if (e.target.checked) setIsFixed(false);
                                }}
                            />
                            <span>Es por cuotas</span>
                        </label>

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
                        Guardar cambios
                    </button>
                </footer>
            </div>
        </div>
    );

    return createPortal(modal, document.body);
}
