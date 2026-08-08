import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { usePackPal } from '../context/PackPalContext';
import Navbar from '../components/layout/Navbar';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';

export default function TaskDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const taskId = Number(id);

    const { tasks, updateTask, deleteTask } = usePackPal();
    const task = tasks.find(t => t.id === taskId);

    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    const [statusToast, setStatusToast] = useState('');

    const handleStatusChange = (newStatus) => {
        if (!task) return;
        updateTask(taskId, { status: newStatus });
        let label = 'To Pack';
        if (newStatus === 'in-progress') label = 'In Progress';
        if (newStatus === 'packed') label = 'Packed';

        setStatusToast(`Task status updated to "${label}"`);
        setTimeout(() => {
            setStatusToast('');
        }, 3000);
    };

    const handleDelete = () => {
        setDeleteModalOpen(false);
        deleteTask(taskId);
        navigate('/dashboard');
    };

    // check if task exists or id is invalid
    if (!task || isNaN(taskId)) {
        return (
            <div className="min-h-screen bg-slate-50/50 pb-16">
                <Navbar userName="Senithu" />

                <main className="max-w-3xl mx-auto px-4 py-16 text-center">
                    <div className="bg-white rounded-3xl border border-slate-100 shadow-xl p-10 space-y-4">
                        <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center text-3xl mx-auto">
                            <i className="fas fa-exclamation-circle"></i>
                        </div>
                        <h1 className="text-2xl font-extrabold text-slate-800">Task Not Found</h1>
                        <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed font-medium">
                            No task matching ID <span className="font-mono bg-slate-100 text-slate-700 px-2 py-0.5 rounded">/tasks/{id}</span> was found in your workspace. It may have been deleted or the link is invalid.
                        </p>
                        <div className="pt-4">
                            <Link
                                to="/dashboard"
                                className="inline-flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold px-6 py-3 rounded-full shadow-md transition-all"
                            >
                                <i className="fas fa-arrow-left"></i> Back to Board & Dashboard
                            </Link>
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50/50 pb-16">
            <Navbar userName="Senithu" />

            <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
                {/* back button */}
                <div className="flex items-center justify-between mb-6">
                    <Link
                        to="/dashboard"
                        className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-800 bg-white border border-slate-200 px-4 py-2 rounded-full shadow-xs hover:bg-slate-50 transition-colors"
                    >
                        <i className="fas fa-arrow-left"></i> Back to Board
                    </Link>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setDeleteModalOpen(true)}
                            className="text-xs font-bold text-rose-600 hover:text-rose-700 bg-rose-50 border border-rose-200 px-4 py-2 rounded-full transition-colors flex items-center gap-1.5 cursor-pointer"
                        >
                            <i className="far fa-trash-alt"></i> Delete Task
                        </button>
                    </div>
                </div>

                {statusToast && (
                    <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-fadeIn shadow-xs">
                        <i className="fas fa-check-circle text-emerald-500"></i> {statusToast}
                    </div>
                )}

                {/* main card */}
                <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 sm:p-8 space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-slate-100 pb-6">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-[11px] font-mono text-slate-400">Task ID #{task.id}</span>
                                <Badge color={task.priority === 'High' ? 'red' : task.priority === 'Medium' ? 'yellow' : 'green'}>
                                    {task.priority} Priority
                                </Badge>
                                <Badge color="blue">{task.category}</Badge>
                                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-sky-700 bg-sky-50 border border-sky-100 px-2.5 py-0.5 rounded-full">
                                    <i className="fas fa-bullseye text-[9px] text-sky-500"></i>
                                    For: {task.purpose || 'Japan Trip Packing'}
                                </span>
                            </div>
                            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">
                                {task.title}
                            </h1>
                        </div>

                        {/* status switcher */}
                        <div className="bg-slate-50 border border-slate-200 p-2 rounded-2xl flex flex-col gap-1 min-w-[160px]">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2">Current Column</span>
                            <select
                                value={task.status}
                                onChange={(e) => handleStatusChange(e.target.value)}
                                className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-700 outline-none focus:ring-2 focus:ring-sky-500"
                            >
                                <option value="to-pack">To Pack</option>
                                <option value="in-progress">In Progress</option>
                                <option value="packed">Packed</option>
                            </select>
                        </div>
                    </div>

                    {/* details grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                        <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Assignee</p>
                            <div className="flex items-center gap-2 mt-1">
                                <div className="w-6 h-6 rounded-full bg-sky-500 text-white flex items-center justify-center font-bold text-[10px]">
                                    {(task.assignee || 'S').charAt(0)}
                                </div>
                                <span className="text-xs font-bold text-slate-700">{task.assignee || 'Senithu'}</span>
                            </div>
                        </div>

                        <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Due Date</p>
                            <p className="text-xs font-bold text-slate-700 mt-1 flex items-center gap-1">
                                <i className="far fa-calendar-alt text-slate-400"></i> {task.dueDate}
                            </p>
                        </div>

                        <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Quantity</p>
                            <p className="text-xs font-bold text-slate-700 mt-1">{task.quantity || 1} unit(s)</p>
                        </div>

                        <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Added By</p>
                            <p className="text-xs font-bold text-slate-700 mt-1">{task.addedBy || 'Senithu'} ({task.addedAt || 'Recently'})</p>
                        </div>
                    </div>

                    {/* description */}
                    <div>
                        <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Description & Notes</h3>
                        <p className="text-sm text-slate-600 leading-relaxed bg-white border border-slate-100 p-4 rounded-2xl">
                            {task.description}
                        </p>
                    </div>

                    {/* activity */}
                    <div className="pt-4 border-t border-slate-100">
                        <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">Task Activity</h3>
                        <div className="space-y-2 text-xs text-slate-500">
                            <div className="flex items-center gap-2">
                                <i className="fas fa-history text-sky-500"></i>
                                <span>Task created by {task.addedBy || 'Senithu'} • {task.addedAt || 'Recently'}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* delete modal */}
            <Modal isOpen={isDeleteModalOpen} onClose={() => setDeleteModalOpen(false)} title="Delete Task">
                <div className="space-y-4">
                    <p className="text-sm text-slate-600">
                        Are you sure you want to delete <span className="font-bold text-slate-800">"{task.title}"</span>?
                    </p>
                    <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                        <Button variant="secondary" onClick={() => setDeleteModalOpen(false)}>Cancel</Button>
                        <Button onClick={handleDelete} variant="danger" className="bg-rose-600 text-white font-bold">
                            Delete Task
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
