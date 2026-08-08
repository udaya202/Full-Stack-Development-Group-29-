export default function StatsCard({ label, value, image, icon, valueColor = 'text-slate-800', onClick, active = false, subtitle }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`w-full bg-white rounded-2xl border transition-all p-5 flex flex-col items-center justify-center text-center cursor-pointer group ${
                active
                    ? 'border-sky-500 ring-2 ring-sky-500/20 shadow-md bg-sky-50/10'
                    : 'border-slate-100 shadow-xs hover:shadow-md hover:-translate-y-0.5 hover:border-slate-200'
            }`}
            title={`Click to inspect ${label}`}
        >
            <div className="w-10 h-10 mb-2 flex items-center justify-center group-hover:scale-110 transition-transform">
                {image ? (
                    <img src={image} alt={label} className="max-w-full max-h-full object-contain" />
                ) : (
                    <i className={`fas ${icon} text-2xl text-sky-500`}></i>
                )}
            </div>
            <p className={`text-2xl sm:text-3xl font-extrabold ${valueColor}`}>{value}</p>
            <p className="text-xs text-slate-500 font-bold mt-0.5 group-hover:text-sky-600 transition-colors flex items-center gap-1">
                <span>{label}</span>
                <i className="fas fa-chevron-right text-[9px] opacity-0 group-hover:opacity-100 transition-opacity text-sky-500"></i>
            </p>
            {subtitle ? (
                <p className="text-[10px] text-slate-400 font-medium mt-0.5">{subtitle}</p>
            ) : (
                <span className="text-[10px] text-sky-600 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">View details →</span>
            )}
        </button>
    );
}