export default function ProgressBar({ progress, color = 'bg-sky-500' }) {
    return (
        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div
                className={`h-2 rounded-full transition-all duration-500 ${color}`}
                style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
            ></div>
        </div>
    );
}