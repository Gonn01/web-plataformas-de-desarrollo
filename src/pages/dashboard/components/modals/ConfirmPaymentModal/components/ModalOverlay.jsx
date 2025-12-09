export default function ModalOverlay({ children, onClose }) {
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
            onMouseDown={onClose}
        >
            {children}
        </div>
    );
}
