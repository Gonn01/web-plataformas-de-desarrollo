import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import ModalOverlay from './components/ModalOverlay';
import ModalContainer from './components/ModalContainer';
import ModalHeader from './components/ModalHeader';
import SinglePaymentSection from './components/SinglePaymentSection';
import MultiPaymentSection from './components/MultiPaymentSection';
import ModalActions from './components/ModalActions';

export default function ConfirmInstallmentPaymentModal({
    open,
    onCancel,
    onConfirm,
    entityName = 'Entidad',
    items = [],
}) {
    useEffect(() => {
        if (!open) return;

        const prev = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        const onKey = (e) => e.key === 'Escape' && onCancel?.();
        document.addEventListener('keydown', onKey);

        return () => {
            document.body.style.overflow = prev;
            document.removeEventListener('keydown', onKey);
        };
    }, [open, onCancel]);

    if (!open) return null;

    const isSingle = items.length === 1;
    const single = isSingle ? items[0] : null;

    return createPortal(
        <ModalOverlay onClose={onCancel}>
            <ModalContainer>
                <ModalHeader
                    icon="payments"
                    title={isSingle ? 'Confirmar Pago de Cuota' : 'Confirmar Pago de Cuotas'}
                    description={
                        isSingle
                            ? `Vas a registrar el pago de ${single.name} en ${entityName}.`
                            : `Estás por registrar el pago para ${items.length} gastos activos de la entidad ${entityName}.`
                    }
                />

                {isSingle ? (
                    <SinglePaymentSection item={single} entityName={entityName} />
                ) : (
                    <MultiPaymentSection items={items} entityName={entityName} />
                )}

                <ModalActions onCancel={onCancel} onConfirm={onConfirm} />
            </ModalContainer>
        </ModalOverlay>,
        document.body,
    );
}
