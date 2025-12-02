export default function TextInput({ label, type = 'text', value, onChange, placeholder }) {
    return (
        <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">{label}</label>
            <input
                type={type}
                required
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                className="form-input block h-12 w-full rounded-lg border border-gray-700 bg-background-dark px-3 text-white"
            />
        </div>
    );
}
