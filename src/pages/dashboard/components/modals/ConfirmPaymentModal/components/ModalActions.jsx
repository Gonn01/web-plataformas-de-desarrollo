import Icon from '@/components/Icon';

export default function ModalActions({ onCancel, onConfirm }) {
    return (
        <div className="mt-4 flex flex-col-reverse sm:flex-row sm:justify-center gap-3">
            <button
                type="button"
                onClick={onCancel}
                className="h-10 px-4 rounded-lg bg-slate-200 dark:bg-slate-700 text-sm font-bold hover:bg-slate-600 transition-colors text-white cursor-pointer"
            >
                Cancelar
            </button>

            <button
                type="button"
                onClick={onConfirm}
                className="h-10 px-4 rounded-lg bg-primary text-background-dark text-sm font-bold hover:bg-primary/90 transition-colors flex items-center gap-2 cursor-pointer "
            >
                <Icon name="check_circle" className="text-lg" />
                Confirmar Pago
            </button>
        </div>
    );
}
