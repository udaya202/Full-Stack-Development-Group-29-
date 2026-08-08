export default function Button({ children, variant = 'primary', icon, onClick, type = 'button', className = '' }) {
    const base = 'px-4 py-2 rounded-full font-semibold transition-all inline-flex items-center justify-center gap-2 cursor-pointer';
    const styles = {
        primary: 'bg-sky-600 text-white hover:bg-sky-700 shadow-xs',
        secondary: 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200',
        outline: 'bg-white text-sky-600 hover:bg-sky-50 border border-sky-200 hover:border-sky-300 shadow-xs',
        danger: 'bg-rose-600 text-white hover:bg-rose-700',
    };
    return (
        <button type={type} className={`${base} ${styles[variant] || ''} ${className}`} onClick={onClick}>
            {icon && <i className={`fas ${icon}`}></i>}
            {children}
        </button>
    );
}