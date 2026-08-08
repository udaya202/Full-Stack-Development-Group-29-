import { Link } from 'react-router-dom';

export default function ListCard({ list, onDelete }) {
    const { id, name, image, icon, topColor = 'bg-sky-500', progressBarColor = 'bg-sky-500', completedItems = 0, totalItems = 0, progress = 0, updated = 'recently', members = [] } = list;

    return (
        <Link
            to={`/list/${id}`}
            className="group bg-white rounded-2xl border border-slate-100 shadow-xs hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 overflow-hidden flex flex-col justify-between cursor-pointer block relative"
        >
            {/* Top Accent Bar */}
            <div className={`h-1.5 w-full ${topColor}`}></div>

            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                {/* Header: Icon badge & Updated time */}
                <div>
                    <div className="flex items-start justify-between">
                        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center p-1 border border-slate-100">
                            {image ? (
                                <img src={image} alt={name} className="max-w-full max-h-full object-contain" />
                            ) : (
                                <i className={`fas ${icon || 'fa-list-check'} text-lg text-sky-600`}></i>
                            )}
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-[11px] font-medium text-slate-400">Updated {updated}</span>
                            {onDelete && (
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        onDelete(list);
                                    }}
                                    className="text-slate-300 hover:text-rose-600 text-xs p-1 transition-colors"
                                    title="Delete List"
                                >
                                    <i className="far fa-trash-alt"></i>
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                        <h3 className="text-lg font-bold text-slate-800 group-hover:text-sky-600 transition-colors">
                            {name}
                        </h3>
                        <i className="fas fa-chevron-right text-xs text-slate-300 group-hover:text-sky-500 group-hover:translate-x-1 transition-all"></i>
                    </div>
                </div>

                {/* Progress bar section */}
                <div>
                    <div className="flex justify-between text-xs font-semibold text-slate-500 mb-1.5">
                        <span>{completedItems}/{totalItems} items</span>
                        <span>{progress}%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div
                            className={`h-full rounded-full transition-all duration-500 ${progressBarColor}`}
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                </div>

                {/* Footer: Avatars & Item Count */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-50">
                    <div className="flex -space-x-1.5 overflow-hidden">
                        {members && members.length > 0 ? (
                            members.slice(0, 4).map((member, idx) => (
                                <div
                                    key={idx}
                                    className={`w-6 h-6 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-bold ${member.bg || 'bg-slate-300 text-slate-700'}`}
                                    title={member.name}
                                >
                                    {member.initials}
                                </div>
                            ))
                        ) : (
                            <span className="text-[11px] text-slate-400">Only you</span>
                        )}
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                        <i className="far fa-clipboard text-slate-400 text-xs"></i>
                        <span>{totalItems} items</span>
                    </div>
                </div>
            </div>
        </Link>
    );
}