import Icon from '@/components/Icon';

export default function ModalHeader({ icon, title, description }) {
    return (
        <div className="flex flex-col gap-4 text-center mb-3">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Icon name={icon} className="text-4xl" />
            </div>

            <div className="flex flex-col gap-2">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">{title}</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">{description}</p>
            </div>
        </div>
    );
}
