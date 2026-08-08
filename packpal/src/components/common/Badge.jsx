export default function Badge({ children, color = 'gray' }) {
    const colors = {
        gray: 'bg-slate-100 text-slate-600',
        blue: 'bg-sky-50 text-sky-700 border border-sky-100',
        green: 'bg-emerald-50 text-emerald-700 border border-emerald-100',
        red: 'bg-rose-50 text-rose-700 border border-rose-100',
        yellow: 'bg-amber-50 text-amber-800 border border-amber-100',
        purple: 'bg-purple-50 text-purple-700 border border-purple-100',
    };
    return (
        <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${colors[color] || colors.gray}`}>
            {children}
        </span>
    );
}