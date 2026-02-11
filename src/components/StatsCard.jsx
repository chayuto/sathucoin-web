export default function StatsCard({ label, value, className = "" }) {
  return (
    <div className={`rounded-xl border border-gray-200 bg-white p-6 shadow-sm ${className}`}>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="mt-1 text-2xl font-bold text-gray-900">{value}</p>
    </div>
  );
}
