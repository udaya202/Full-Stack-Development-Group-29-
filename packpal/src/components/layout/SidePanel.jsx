export default function SidePanel({ isOpen, onClose, title, items, type = 'notification' }) {
    return (
        <>
            {isOpen && <div className="fixed inset-0 bg-black/30 z-40" onClick={onClose}></div>}
            <div className={`fixed top-0 right-0 w-80 h-full bg-white shadow-lg z-50 transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="p-4 border-b flex justify-between items-center">
                    <h2 className="text-xl font-bold">{title}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><i className="fas fa-times"></i></button>
                </div>
                <div className="p-4 space-y-4 overflow-y-auto h-[calc(100%-5rem)]">
                    {items.length === 0 && <p className="text-gray-400 text-center">You're all caught up</p>}
                    {items.map((item, idx) => (
                        <div key={idx} className="flex items-start gap-3 p-2 rounded-xl hover:bg-gray-50">
                            {type === 'activity' ? (
                                <div className={`w-8 h-8 rounded-full ${item.bg} flex items-center justify-center text-sm font-bold`}>{item.avatar}</div>
                            ) : (
                                <i className={`fas ${item.icon} ${item.color} mt-1`}></i>
                            )}
                            <div>
                                <p className="text-sm">{item.text}</p>
                                <span className="text-xs text-gray-400">{item.time}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}