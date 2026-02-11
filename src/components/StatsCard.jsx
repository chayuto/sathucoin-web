export default function StatsCard({ label, value, icon, className = "" }) {
  return (
    <div className={`rounded-xl border border-gray-200 bg-white p-6 shadow-sm ${className}`}>
      <p className="text-sm text-gray-500">{label}</p>
      <div className="mt-1 flex items-center gap-2 text-2xl font-bold text-gray-900">
        {icon && <img src={icon.src} alt={icon.alt} className="h-6 w-6 object-contain" />}
        <span>{value}</span>
      </div>
    </div>
  );
}
