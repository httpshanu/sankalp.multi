// Reusable Stats Card
export default function StatsCard({ title, value, subtitle, icon: Icon, iconBg, trend, trendLabel }) {
  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100 flex items-start gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${iconBg}`}>
        <Icon size={22} className="text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-slate-500 font-medium uppercase tracking-wide truncate" style={{ fontSize: '13px' }}>{title}</p>
        <p className="text-slate-900 font-bold mt-0.5" style={{ fontSize: '32px' }}>{value}</p>
        {subtitle && (
          <p className="text-slate-500 mt-1" style={{ fontSize: '14px' }}>{subtitle}</p>
        )}
        {trend && (
          <p className={`mt-1 font-medium ${trend > 0 ? 'text-emerald-600' : 'text-rose-500'}`} style={{ fontSize: '13px' }}>
            {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}% {trendLabel}
          </p>
        )}
      </div>
    </div>
  );
}
