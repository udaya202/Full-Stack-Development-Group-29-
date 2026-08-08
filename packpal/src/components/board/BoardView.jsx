import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { usePackPal } from '../../context/PackPalContext';
import Badge from '../common/Badge';
import Modal from '../common/Modal';
import Button from '../common/Button';

export default function BoardView({
    statusFilter: externalStatusFilter,
    setStatusFilter: externalSetStatusFilter,
    assigneeFilter: externalAssigneeFilter,
    setAssigneeFilter: externalSetAssigneeFilter,
}) {
    const { lists, tasks, addTask, updateTask, deleteTask } = usePackPal();

    // state for filters
    const [searchQuery, setSearchQuery] = useState('');
    const [localAssigneeFilter, setLocalAssigneeFilter] = useState('All');
    const [localStatusFilter, setLocalStatusFilter] = useState('All');
    const [purposeFilter, setPurposeFilter] = useState('All');

    const statusFilter = externalStatusFilter !== undefined ? externalStatusFilter : localStatusFilter;
    const setStatusFilter = externalSetStatusFilter || setLocalStatusFilter;

    const assigneeFilter = externalAssigneeFilter !== undefined ? externalAssigneeFilter : localAssigneeFilter;
    const setAssigneeFilter = externalSetAssigneeFilter || setLocalAssigneeFilter;

    // UI state for loading and notifications
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    const [successToast, setSuccessToast] = useState('');

    // modal states
    const [isCreateModalOpen, setCreateModalOpen] = useState(false);
    const [taskToDelete, setTaskToDelete] = useState(null);

    // form inputs and error messages
    const [title, setTitle] = useState('');
    const [purpose, setPurpose] = useState('Japan Trip Packing');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState('to-pack');
    const [assignee, setAssignee] = useState('Senithu');
    const [priority, setPriority] = useState('Medium');
    const [category, setCategory] = useState('Documents');
    const [dueDate, setDueDate] = useState(new Date().toISOString().split('T')[0]);

    const [errors, setErrors] = useState({});

    // set default purpose when lists are loaded
    useEffect(() => {
        if (lists.length > 0 && !lists.some(l => l.name === purpose)) {
            setPurpose(lists[0].name);
        }
    }, [lists]);

    // simulate short loading animation
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 300);
        return () => clearTimeout(timer);
    }, []);

    const showToast = (message) => {
        setSuccessToast(message);
        setTimeout(() => {
            setSuccessToast('');
        }, 3000);
    };

    const handleRetry = () => {
        setIsError(false);
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
        }, 300);
    };

    // form validation logic
    const validateForm = () => {
        let errs = {};

        if (!title.trim() || title.trim().length < 3) {
            errs.title = 'Title must be at least 3 characters long.';
        }

        const today = new Date().toISOString().split('T')[0];
        if (dueDate && dueDate < today) {
            errs.dueDate = 'Due date cannot be in the past.';
        }

        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    // handle adding a new task
    const handleCreateTask = (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        const created = addTask({
            title,
            purpose,
            description,
            status,
            assignee,
            priority,
            category,
            dueDate,
        });

        setCreateModalOpen(false);

        // reset form
        setTitle('');
        setDescription('');
        setStatus('to-pack');
        setAssignee('Senithu');
        setPriority('Medium');
        setCategory('Documents');
        setDueDate(new Date().toISOString().split('T')[0]);
        setErrors({});

        showToast(`Task "${created.title}" created successfully!`);
    };

    // move task to another column
    const handleMoveTask = (taskId, newStatus) => {
        updateTask(taskId, { status: newStatus });

        let statusText = 'To Pack';
        if (newStatus === 'in-progress') statusText = 'In Progress';
        if (newStatus === 'packed') statusText = 'Packed';

        showToast(`Task moved to "${statusText}" column.`);
    };

    // delete task after confirmation
    const confirmDeleteTask = () => {
        if (!taskToDelete) return;
        deleteTask(taskToDelete.id);
        showToast(`Task "${taskToDelete.title}" deleted.`);
        setTaskToDelete(null);
    };

    // filter tasks by search query, assignee, status, and purpose/trip
    const filteredTasks = tasks.filter(task => {
        const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (task.purpose && task.purpose.toLowerCase().includes(searchQuery.toLowerCase()));
        const matchesAssignee = assigneeFilter === 'All' || (task.assignee && task.assignee.toLowerCase() === assigneeFilter.toLowerCase());
        const matchesStatus = statusFilter === 'All' || task.status === statusFilter;
        const matchesPurpose = purposeFilter === 'All' || task.purpose === purposeFilter;
        return matchesSearch && matchesAssignee && matchesStatus && matchesPurpose;
    });

    const columns = [
        { id: 'to-pack', title: 'To Pack', color: 'bg-sky-500', badgeColor: 'bg-sky-100 text-sky-700' },
        { id: 'in-progress', title: 'In Progress', color: 'bg-amber-500', badgeColor: 'bg-amber-100 text-amber-800' },
        { id: 'packed', title: 'Packed', color: 'bg-emerald-500', badgeColor: 'bg-emerald-100 text-emerald-700' },
    ];

    const getColumnTasks = (colId) => {
        return filteredTasks.filter(t => t.status === colId);
    };

    return (
        <div className="space-y-6">
            {/* success notification */}
            {successToast && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-2xl text-sm font-semibold flex items-center gap-2 animate-fadeIn shadow-sm">
                    <i className="fas fa-check-circle text-emerald-500"></i>
                    <span>{successToast}</span>
                </div>
            )}

            {/* simulated error banner */}
            {isError && (
                <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-2xl text-sm flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <i className="fas fa-exclamation-triangle text-rose-500"></i>
                        <span>Failed to sync board tasks.</span>
                    </div>
                    <Button onClick={handleRetry} className="bg-rose-600 text-white text-xs px-3 py-1">
                        Retry Loading
                    </Button>
                </div>
            )}

            {/* search and filter controls */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-xs">
                <div className="relative flex-1 min-w-[200px]">
                    <i className="fas fa-search absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
                    <input
                        type="text"
                        placeholder="Search by title or purpose (e.g. Japan Trip)..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-full pl-9 pr-4 py-2 text-xs sm:text-sm outline-none focus:ring-2 focus:ring-sky-500"
                    />
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <select
                        value={purposeFilter}
                        onChange={(e) => setPurposeFilter(e.target.value)}
                        className="bg-slate-50 border border-slate-200 rounded-full px-4 py-2 text-xs font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-sky-500"
                    >
                        <option value="All">All Lists & Trips</option>
                        {lists.map((l) => (
                            <option key={l.id} value={l.name}>{l.name}</option>
                        ))}
                    </select>

                    <select
                        value={assigneeFilter}
                        onChange={(e) => setAssigneeFilter(e.target.value)}
                        className="bg-slate-50 border border-slate-200 rounded-full px-4 py-2 text-xs font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-sky-500"
                    >
                        <option value="All">All Assignees</option>
                        <option value="Senithu">Senithu</option>
                        <option value="Dahamsa">Dahamsa</option>
                        <option value="Isala">Isala</option>
                        <option value="Udaya">Udaya</option>
                        <option value="Abishek">Abishek</option>
                    </select>

                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="bg-slate-50 border border-slate-200 rounded-full px-4 py-2 text-xs font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-sky-500"
                    >
                        <option value="All">All Statuses</option>
                        <option value="to-pack">To Pack</option>
                        <option value="in-progress">In Progress</option>
                        <option value="packed">Packed</option>
                    </select>

                    <Button
                        onClick={() => setCreateModalOpen(true)}
                        variant="primary"
                        icon="fa-plus"
                        className="bg-sky-600 hover:bg-sky-700 text-white rounded-full px-4 py-2 text-xs font-bold shadow-xs"
                    >
                        Create Task
                    </Button>
                </div>
            </div>

            {/* loading state */}
            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[1, 2, 3].map((col) => (
                        <div key={col} className="bg-slate-100/60 rounded-2xl p-4 animate-pulse space-y-4">
                            <div className="h-6 bg-slate-200 rounded-md w-1/2"></div>
                            <div className="h-28 bg-slate-200 rounded-xl"></div>
                            <div className="h-28 bg-slate-200 rounded-xl"></div>
                        </div>
                    ))}
                </div>
            ) : (
                <>
                    {/* empty state */}
                    {filteredTasks.length === 0 ? (
                        <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center">
                            <i className="fas fa-search-minus text-5xl text-slate-300 mb-3"></i>
                            <h3 className="text-lg font-bold text-slate-800">No tasks found</h3>
                            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                                No tasks match your filter criteria or search query. Try clearing your filters or adding a new task.
                            </p>
                            <Button
                                onClick={() => { setSearchQuery(''); setAssigneeFilter('All'); setStatusFilter('All'); setPurposeFilter('All'); }}
                                variant="secondary"
                                className="mt-4 text-xs font-bold"
                            >
                                Reset Filters
                            </Button>
                        </div>
                    ) : (
                        /* 3-column kanban board */
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {columns.map((col) => {
                                const colTasks = getColumnTasks(col.id);
                                return (
                                    <div key={col.id} className="bg-slate-100/70 rounded-2xl p-4 border border-slate-200/50 flex flex-col justify-between min-h-[450px]">
                                        <div>
                                            {/* column header */}
                                            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200">
                                                <div className="flex items-center gap-2">
                                                    <div className={`w-3 h-3 rounded-full ${col.color}`}></div>
                                                    <h3 className="font-bold text-sm text-slate-800">{col.title}</h3>
                                                </div>
                                                <span className={`text-xs font-extrabold px-2.5 py-0.5 rounded-full ${col.badgeColor}`}>
                                                    {colTasks.length}
                                                </span>
                                            </div>

                                            {/* task list */}
                                            <div className="space-y-3">
                                                {colTasks.map((task) => {
                                                    const targetList = lists.find(l => l.id === task.listId || l.name === task.purpose);
                                                    const listIdToUse = targetList ? targetList.id : 1;

                                                    return (
                                                        <div
                                                            key={task.id}
                                                            className="bg-white rounded-xl border border-slate-100 shadow-xs p-4 space-y-3 hover:shadow-md transition-shadow group"
                                                        >
                                                            {/* Task Title & Purpose Badge */}
                                                            <div className="flex items-start justify-between gap-2">
                                                                <div>
                                                                    <Link
                                                                        to={`/list/${listIdToUse}`}
                                                                        className="inline-flex items-center gap-1 text-[10px] font-bold text-sky-700 bg-sky-50 border border-sky-100 hover:bg-sky-100 hover:text-sky-800 px-2 py-0.5 rounded-md mb-1.5 transition-colors cursor-pointer"
                                                                        title="Open trip list details"
                                                                    >
                                                                        <i className="fas fa-bullseye text-[9px] text-sky-500"></i>
                                                                        <span>For: {task.purpose || 'Japan Trip Packing'}</span>
                                                                        <i className="fas fa-chevron-right text-[8px] text-sky-400 ms-0.5"></i>
                                                                    </Link>
                                                                    <Link
                                                                        to={`/tasks/${task.id}`}
                                                                        className="font-bold text-sm text-slate-800 hover:text-sky-600 transition-colors line-clamp-2 block"
                                                                    >
                                                                        {task.title}
                                                                    </Link>
                                                                </div>
                                                                <Badge color={task.priority === 'High' ? 'red' : task.priority === 'Medium' ? 'yellow' : 'green'}>
                                                                    {task.priority}
                                                                </Badge>
                                                            </div>

                                                            {task.description && (
                                                                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                                                                    {task.description}
                                                                </p>
                                                            )}

                                                            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-50">
                                                                <span className="flex items-center gap-1">
                                                                    <i className="far fa-calendar-alt"></i> {task.dueDate}
                                                                </span>
                                                                <div className="flex items-center gap-1.5">
                                                                    <div className="w-5 h-5 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-[9px]" title={`Assignee: ${task.assignee}`}>
                                                                        {(task.assignee || 'S').charAt(0)}
                                                                    </div>
                                                                    <span className="font-semibold text-slate-600">{task.assignee || 'Senithu'}</span>
                                                                </div>
                                                            </div>

                                                            {/* column switcher and action icons */}
                                                            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                                                                <select
                                                                    value={task.status}
                                                                    onChange={(e) => handleMoveTask(task.id, e.target.value)}
                                                                    className="text-[11px] font-semibold bg-slate-50 border border-slate-200 rounded-md px-2 py-1 text-slate-600 outline-none"
                                                                >
                                                                    <option value="to-pack">Move: To Pack</option>
                                                                    <option value="in-progress">Move: In Progress</option>
                                                                    <option value="packed">Move: Packed</option>
                                                                </select>

                                                                <div className="flex items-center gap-2">
                                                                    <Link
                                                                        to={`/tasks/${task.id}`}
                                                                        className="text-slate-400 hover:text-sky-600 text-xs p-1"
                                                                        title="View Details"
                                                                    >
                                                                        <i className="fas fa-external-link-alt"></i>
                                                                    </Link>
                                                                    <button
                                                                        onClick={() => setTaskToDelete(task)}
                                                                        className="text-slate-300 hover:text-rose-600 text-xs p-1 transition-colors"
                                                                        title="Delete Task"
                                                                    >
                                                                        <i className="far fa-trash-alt"></i>
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                })}

                                                {colTasks.length === 0 && (
                                                    <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center text-xs text-slate-400 font-medium">
                                                        No tasks in {col.title}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => {
                                                setStatus(col.id);
                                                setCreateModalOpen(true);
                                            }}
                                            className="w-full mt-4 py-2 border border-dashed border-slate-300 hover:border-sky-500 rounded-xl text-slate-500 hover:text-sky-600 text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                                        >
                                            <i className="fas fa-plus"></i> Add to {col.title}
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </>
            )}

            {/* modal for creating a task */}
            <Modal isOpen={isCreateModalOpen} onClose={() => setCreateModalOpen(false)} title="Create New Task">
                <form onSubmit={handleCreateTask} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                            Item / Task Title <span className="text-rose-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className={`w-full border rounded-xl px-4 py-2.5 text-sm outline-none transition-all ${errors.title ? 'border-rose-500 bg-rose-50/20 focus:ring-2 focus:ring-rose-500' : 'border-slate-200 focus:ring-2 focus:ring-sky-500'
                                }`}
                            placeholder="e.g. Yen Cash & Suica Card"
                        />
                        {errors.title && (
                            <p className="text-xs text-rose-600 font-semibold mt-1 flex items-center gap-1">
                                <i className="fas fa-exclamation-circle text-xs"></i> {errors.title}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                            Purpose / Trip List
                        </label>
                        <select
                            value={purpose}
                            onChange={(e) => setPurpose(e.target.value)}
                            className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm bg-white outline-none focus:ring-2 focus:ring-sky-500"
                        >
                            {lists.map((l) => (
                                <option key={l.id} value={l.name}>{l.name}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                            Description & Purpose Notes
                        </label>
                        <textarea
                            rows="2"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full border border-slate-200 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-sky-500"
                            placeholder="Withdraw JPY bills and top up digital Suica card for subway trains..."
                        ></textarea>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                                Status Column
                            </label>
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm bg-white outline-none focus:ring-2 focus:ring-sky-500"
                            >
                                <option value="to-pack">To Pack</option>
                                <option value="in-progress">In Progress</option>
                                <option value="packed">Packed</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                                Assignee
                            </label>
                            <select
                                value={assignee}
                                onChange={(e) => setAssignee(e.target.value)}
                                className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm bg-white outline-none focus:ring-2 focus:ring-sky-500"
                            >
                                <option value="Senithu">Senithu</option>
                                <option value="Dahamsa">Dahamsa</option>
                                <option value="Isala">Isala</option>
                                <option value="Udaya">Udaya</option>
                                <option value="Abishek">Abishek</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                                Priority
                            </label>
                            <select
                                value={priority}
                                onChange={(e) => setPriority(e.target.value)}
                                className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm bg-white outline-none focus:ring-2 focus:ring-sky-500"
                            >
                                <option value="High">High</option>
                                <option value="Medium">Medium</option>
                                <option value="Low">Low</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                                Due Date <span className="text-rose-500">*</span>
                            </label>
                            <input
                                type="date"
                                value={dueDate}
                                onChange={(e) => setDueDate(e.target.value)}
                                className={`w-full border rounded-xl px-3 py-2.5 text-sm outline-none ${errors.dueDate ? 'border-rose-500 bg-rose-50/20' : 'border-slate-200'
                                    }`}
                            />
                            {errors.dueDate && (
                                <p className="text-xs text-rose-600 font-semibold mt-1">
                                    {errors.dueDate}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                        <Button variant="secondary" onClick={() => setCreateModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" variant="primary" className="bg-sky-600 text-white font-bold">
                            Create Task
                        </Button>
                    </div>
                </form>
            </Modal>

            {/* delete confirmation modal */}
            <Modal isOpen={!!taskToDelete} onClose={() => setTaskToDelete(null)} title="Confirm Deletion">
                <div className="space-y-4">
                    <p className="text-sm text-slate-600">
                        Are you sure you want to delete <span className="font-bold text-slate-800">"{taskToDelete?.title}"</span>? This action cannot be undone.
                    </p>
                    <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                        <Button variant="secondary" onClick={() => setTaskToDelete(null)}>
                            Cancel
                        </Button>
                        <Button onClick={confirmDeleteTask} variant="danger" className="bg-rose-600 text-white font-bold">
                            Confirm Delete
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
