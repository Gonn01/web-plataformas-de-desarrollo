// src/components/entities/EntityIcon.jsx
export default function EntityIcon({ type }) {
    const icon = type === 'bank' ? 'account_balance' : type === 'wallet' ? 'wallet' : 'person';
    return (
        <div className="text-primary flex items-center justify-center rounded-lg bg-primary/20 shrink-0 size-12">
            <span className="material-symbols-outlined text-3xl">{icon}</span>
        </div>
    );
}
