export default function InfoItem({ label, value }) {
    return (
        <div className="flex flex-col gap-1">
            <p className="text-sm text-[#9eb7a8]">{label}</p>
            <p className="text-base font-medium text-white">{value}</p>
        </div>
    );
}
