export default function StatsCard({ label, value, icon, className = "" }) {
  return (
    <div className={`glass-card rounded-2xl p-6 ${className}`}>
      <p className="text-sm font-medium text-warm-800/60">{label}</p>
      <div className="mt-2 flex items-center gap-2.5 text-2xl font-bold text-warm-900">
        {icon && (
          <img
            src={icon.src}
            alt={icon.alt}
            className="h-7 w-7 object-contain animate-float"
          />
        )}
        <span>{value}</span>
      </div>
    </div>
  );
}
