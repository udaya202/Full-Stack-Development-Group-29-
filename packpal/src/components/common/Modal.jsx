export default function Modal({ isOpen, onClose, title, children }) {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-fadeIn" onClick={onClose}>
            <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl max-w-lg w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center pb-4 border-b border-slate-100 mb-4">
                    <h3 className="text-xl font-extrabold text-slate-800 tracking-tight">{title}</h3>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-full bg-slate-100 text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors flex items-center justify-center text-sm"
                    >
                        <i className="fas fa-times"></i>
                    </button>
                </div>
                {children}
            </div>
        </div>
    );
}