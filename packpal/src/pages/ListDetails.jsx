import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { usePackPal } from '../context/PackPalContext';
import Navbar from '../components/layout/Navbar';
import ProgressBar from '../components/common/ProgressBar';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import Modal from '../components/common/Modal';

export default function ListDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const listId = Number(id);

    const { lists, tasks, addTask, deleteTask, toggleTaskStatus, deleteList } = usePackPal();

    // Find current list info
    const currentList = lists.find(l => l.id === listId) || {
        id: listId,
        name: 'Packing List',
        owner: 'Senithu',
        members: [
            { id: 1, name: 'Senithu', initials: 'S', bg: 'bg-blue-500 text-white' },
        ]
    };

    // Filter tasks for this list
    const items = tasks.filter(t => t.listId === listId || (t.purpose && currentList && t.purpose.toLowerCase() === currentList.name.toLowerCase()));

    const [selectedCategory, setSelectedCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('Priority');

    const [isAddItemOpen, setAddItemOpen] = useState(false);
    const [isInviteOpen, setInviteOpen] = useState(false);
    const [isConflictOpen, setConflictOpen] = useState(false);
    const [isDeleteListOpen, setDeleteListOpen] = useState(false);
    const [copiedLink, setCopiedLink] = useState(false);

    // New item form
    const [newItem, setNewItem] = useState({
        name: '',
        quantity: 1,
        category: 'Food',
        priority: 'Medium',
        assignedTo: 'Senithu',
    });

    // Delete item
    const handleDeleteItem = (itemId) => {
        deleteTask(itemId);
    };

    // Add item handler
    const handleAddItem = (e) => {
        e.preventDefault();
        if (!newItem.name.trim()) return;

        addTask({
            listId: listId,
            purpose: currentList.name,
            title: newItem.name.trim(),
            category: newItem.category,
            priority: newItem.priority,
            assignee: newItem.assignedTo || 'Senithu',
            quantity: Number(newItem.quantity) || 1,
            status: 'to-pack',
        });

        setNewItem({ name: '', quantity: 1, category: 'Food', priority: 'Medium', assignedTo: 'Senithu' });
        setAddItemOpen(false);
    };

    const handleDeleteList = () => {
        deleteList(listId);
        setDeleteListOpen(false);
        navigate('/dashboard');
    };

    // Calculate progress stats
    const completedCount = items.filter(i => i.completed || i.status === 'packed').length;
    const totalCount = items.length;
    const progressPercent = totalCount ? Math.round((completedCount / totalCount) * 100) : 0;

    // Filter & Sort
    const categories = ['All', 'Food', 'Electronics', 'Clothing', 'Documents', 'Medicine', 'Toiletries', 'Sports', 'Accessories'];

    let filteredItems = items.filter(item => {
        const itemName = item.title || item.name || '';
        const itemCat = item.category || 'Documents';
        const matchesCategory = selectedCategory === 'All' || itemCat.toLowerCase() === selectedCategory.toLowerCase();
        const matchesSearch = itemName.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    if (sortBy === 'Priority') {
        const priorityOrder = { High: 1, Medium: 2, Low: 3 };
        filteredItems.sort((a, b) => (priorityOrder[a.priority] || 4) - (priorityOrder[b.priority] || 4));
    } else if (sortBy === 'Alphabetical') {
        filteredItems.sort((a, b) => (a.title || a.name || '').localeCompare(b.title || b.name || ''));
    }

    const copyInviteLink = () => {
        navigator.clipboard?.writeText(`https://packpal.app/join/list-${listId}`);
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2000);
    };

    return (
        <div className="min-h-screen bg-slate-50/50 pb-16">
            <Navbar userName="Senithu" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header Navigation & Info */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-3">
                            <Link
                                to="/dashboard"
                                className="w-9 h-9 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-colors shadow-xs"
                            >
                                <i className="fas fa-arrow-left text-sm"></i>
                            </Link>
                            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">
                                {currentList.name}
                            </h1>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 mt-2 text-xs sm:text-sm text-slate-500">
                            <span className="font-medium">Owner: {currentList.owner || 'Senithu'}</span>
                            <span className="text-slate-300">•</span>
                            <div className="flex -space-x-1.5 overflow-hidden items-center">
                                {currentList.members?.map((m, idx) => (
                                    <div key={idx} className={`w-6 h-6 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-bold ${m.bg || 'bg-blue-500 text-white'}`}>
                                        {m.initials}
                                    </div>
                                ))}
                            </div>
                            <button
                                onClick={() => setInviteOpen(true)}
                                className="text-sky-600 font-semibold hover:underline flex items-center gap-1.5 ml-1"
                            >
                                <i className="fas fa-user-plus text-xs"></i> Invite
                            </button>
                            <button
                                onClick={copyInviteLink}
                                className="text-sky-600 font-semibold hover:underline flex items-center gap-1.5"
                            >
                                <i className="fas fa-link text-xs"></i> {copiedLink ? 'Copied Link!' : 'Share'}
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            onClick={() => setDeleteListOpen(true)}
                            variant="secondary"
                            className="text-xs bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200"
                            icon="fa-trash-alt"
                        >
                            Delete List
                        </Button>
                        <Button
                            onClick={() => setConflictOpen(true)}
                            variant="secondary"
                            className="text-xs bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200"
                            icon="fa-bolt"
                        >
                            Conflict
                        </Button>
                        <Button
                            onClick={() => setAddItemOpen(true)}
                            variant="primary"
                            icon="fa-plus"
                            className="bg-sky-600 hover:bg-sky-700 text-white shadow-xs rounded-full px-5"
                        >
                            Add Item
                        </Button>
                    </div>
                </div>

                {/* Progress Overview Card */}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div className="col-span-2 bg-white rounded-2xl border border-slate-100 shadow-xs p-6 flex flex-col justify-between">
                        <div>
                            <div className="flex justify-between items-center text-sm font-semibold text-slate-700 mb-2">
                                <span>Overall Packing Progress</span>
                                <span className="text-sky-600 font-extrabold text-lg">{progressPercent}%</span>
                            </div>
                            <ProgressBar progress={progressPercent} />
                        </div>
                        <div className="flex gap-6 mt-4 pt-3 border-t border-slate-50 text-xs sm:text-sm">
                            <span className="text-slate-600 font-medium">
                                <span className="font-bold text-emerald-600 text-base me-1">{completedCount}</span> Packed
                            </span>
                            <span className="text-slate-600 font-medium">
                                <span className="font-bold text-amber-600 text-base me-1">{totalCount - completedCount}</span> Remaining
                            </span>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-100 shadow-xs p-6 flex items-center justify-around">
                        <div className="text-center">
                            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Items</p>
                            <p className="text-3xl font-extrabold text-slate-800 mt-1">{totalCount}</p>
                        </div>
                        <div className="h-10 w-[1px] bg-slate-100"></div>
                        <div className="text-center">
                            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Members</p>
                            <p className="text-3xl font-extrabold text-sky-600 mt-1">{currentList.members?.length || 1}</p>
                        </div>
                    </div>
                </div>

                {/* Filters, Search & Actions */}
                <div className="mt-8 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    {/* Category Filter Pills */}
                    <div className="flex flex-wrap gap-1.5">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${selectedCategory === cat
                                    ? 'bg-sky-600 text-white shadow-xs'
                                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    {/* Search & Sort Controls */}
                    <div className="flex items-center gap-3">
                        <div className="relative flex-1 sm:w-64">
                            <i className="fas fa-search absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
                            <input
                                type="text"
                                placeholder="Search items..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-white border border-slate-200 rounded-full pl-9 pr-4 py-2 text-xs sm:text-sm text-slate-700 outline-none focus:ring-2 focus:ring-sky-500"
                            />
                        </div>

                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="bg-white border border-slate-200 rounded-full px-4 py-2 text-xs sm:text-sm text-slate-700 outline-none focus:ring-2 focus:ring-sky-500 font-medium"
                        >
                            <option value="Priority">Sort: Priority</option>
                            <option value="Alphabetical">Alphabetical</option>
                        </select>
                    </div>
                </div>

                {/* Items List */}
                <div className="mt-6 space-y-3">
                    {filteredItems.map((item) => {
                        const isDone = item.completed || item.status === 'packed';
                        const itemName = item.title || item.name;
                        const assigneeName = item.assignee || item.assignedTo || 'Senithu';

                        return (
                            <div
                                key={item.id}
                                className={`bg-white rounded-2xl border border-slate-100 shadow-xs p-4 flex flex-wrap items-center gap-4 transition-all ${isDone ? 'opacity-75 bg-slate-50/50' : 'hover:border-slate-200'
                                    }`}
                            >
                                {/* Checkbox */}
                                <input
                                    type="checkbox"
                                    checked={isDone}
                                    onChange={() => toggleTaskStatus(item.id)}
                                    className="w-5 h-5 rounded-md border-slate-300 text-sky-600 focus:ring-sky-500 cursor-pointer"
                                />

                                {/* Item Name & Details */}
                                <div className="flex-1 min-w-[160px]">
                                    <Link
                                        to={`/tasks/${item.id}`}
                                        className={`font-semibold text-slate-800 hover:text-sky-600 transition-colors ${isDone ? 'line-through text-slate-400' : ''}`}
                                    >
                                        {itemName}
                                    </Link>
                                    <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                                        Added by {item.addedBy || 'Senithu'} • {item.addedAt || 'Recently'}
                                    </p>
                                </div>

                                {/* Badges & Meta */}
                                <div className="flex items-center gap-2 flex-wrap">
                                    <Badge color={item.category === 'Documents' ? 'purple' : item.category === 'Electronics' ? 'blue' : 'gray'}>
                                        {item.category || 'General'}
                                    </Badge>

                                    <Badge color={item.priority === 'High' ? 'red' : item.priority === 'Medium' ? 'yellow' : 'green'}>
                                        {item.priority || 'Medium'}
                                    </Badge>

                                    <div className="w-6 h-6 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center text-[10px] font-bold" title={`Assigned to ${assigneeName}`}>
                                        {assigneeName.charAt(0)}
                                    </div>

                                    <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                                        Qty: {item.quantity || 1}
                                    </span>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-3 ml-auto">
                                    <Link
                                        to={`/tasks/${item.id}`}
                                        className="text-slate-400 hover:text-sky-600 transition-colors p-1"
                                        title="View Details"
                                    >
                                        <i className="fas fa-external-link-alt text-xs"></i>
                                    </Link>
                                    <button
                                        onClick={() => handleDeleteItem(item.id)}
                                        className="text-slate-300 hover:text-rose-600 transition-colors p-1"
                                        title="Delete Item"
                                    >
                                        <i className="far fa-trash-alt text-sm"></i>
                                    </button>
                                </div>
                            </div>
                        );
                    })}

                    {filteredItems.length === 0 && (
                        <div className="bg-white rounded-2xl border border-slate-100 p-8 text-center text-slate-400 text-sm">
                            No items found in this list.
                        </div>
                    )}
                </div>
            </div>

            {/* Add Item Modal */}
            <Modal isOpen={isAddItemOpen} onClose={() => setAddItemOpen(false)} title="Add Packing Item">
                <form onSubmit={handleAddItem} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Item Name</label>
                        <input
                            type="text"
                            required
                            value={newItem.name}
                            onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                            className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-sky-500 outline-none"
                            placeholder="e.g. Passport, Camera, Towel..."
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Quantity</label>
                            <input
                                type="number"
                                min="1"
                                value={newItem.quantity}
                                onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
                                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-sky-500 outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Priority</label>
                            <select
                                value={newItem.priority}
                                onChange={(e) => setNewItem({ ...newItem, priority: e.target.value })}
                                className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm bg-white outline-none focus:ring-2 focus:ring-sky-500"
                            >
                                <option value="High">High</option>
                                <option value="Medium">Medium</option>
                                <option value="Low">Low</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Category</label>
                        <select
                            value={newItem.category}
                            onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                            className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm bg-white outline-none focus:ring-2 focus:ring-sky-500"
                        >
                            <option value="Food">Food</option>
                            <option value="Electronics">Electronics</option>
                            <option value="Clothing">Clothing</option>
                            <option value="Documents">Documents</option>
                            <option value="Medicine">Medicine</option>
                            <option value="Toiletries">Toiletries</option>
                            <option value="Sports">Sports</option>
                            <option value="Accessories">Accessories</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Assigned Member</label>
                        <input
                            type="text"
                            value={newItem.assignedTo}
                            onChange={(e) => setNewItem({ ...newItem, assignedTo: e.target.value })}
                            className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-sky-500 outline-none"
                            placeholder="Senithu, Dahamsa, Isala..."
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                        <Button variant="secondary" onClick={() => setAddItemOpen(false)}>Cancel</Button>
                        <Button type="submit" variant="primary" className="bg-sky-600 text-white">Add Item</Button>
                    </div>
                </form>
            </Modal>

            {/* Invite Modal */}
            <Modal isOpen={isInviteOpen} onClose={() => setInviteOpen(false)} title="Invite Collaborators">
                <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Shareable Link</label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                readOnly
                                value={`https://packpal.app/join/list-${listId}`}
                                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-600 outline-none"
                            />
                            <Button onClick={copyInviteLink} className="bg-sky-600 text-white text-xs">
                                {copiedLink ? 'Copied!' : 'Copy'}
                            </Button>
                        </div>
                    </div>

                    <div className="pt-2">
                        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">Active Members</h4>
                        <div className="space-y-2">
                            {currentList.members?.map((m) => (
                                <div key={m.id} className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100">
                                    <div className="flex items-center gap-2.5">
                                        <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${m.bg || 'bg-blue-500 text-white'}`}>
                                            {m.initials}
                                        </div>
                                        <span className="text-sm font-semibold text-slate-700">{m.name}</span>
                                    </div>
                                    <span className="text-xs text-slate-400 font-medium">{m.id === 1 ? 'Owner' : 'Member'}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </Modal>

            {/* Version Conflict Modal */}
            <Modal isOpen={isConflictOpen} onClose={() => setConflictOpen(false)} title="Version Conflict Detected">
                <div className="space-y-4">
                    <p className="text-sm text-slate-600 leading-relaxed">
                        Another member (<span className="font-bold text-slate-800">Dahamsa</span>) updated this list offline. Please resolve which version to keep:
                    </p>

                    <div className="grid grid-cols-2 gap-3 pt-2">
                        <div className="p-3.5 rounded-2xl bg-sky-50 border border-sky-200 space-y-1">
                            <span className="text-[10px] font-bold text-sky-600 uppercase tracking-wider">YOUR LOCAL VERSION</span>
                            <p className="text-xs font-bold text-slate-800">Items: {totalCount} ({completedCount} packed)</p>
                            <p className="text-[11px] text-slate-500">Edited 2 mins ago</p>
                        </div>

                        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">OTHER VERSION</span>
                            <p className="text-xs font-bold text-slate-800">Items: {Math.max(0, totalCount - 1)}</p>
                            <p className="text-[11px] text-slate-500">Edited 1 min ago</p>
                        </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                        <Button
                            variant="secondary"
                            onClick={() => setConflictOpen(false)}
                            className="text-xs bg-slate-100 text-slate-700"
                        >
                            Accept Other Version
                        </Button>
                        <Button
                            variant="primary"
                            onClick={() => setConflictOpen(false)}
                            className="text-xs bg-sky-600 text-white font-bold"
                        >
                            Keep My Local Version
                        </Button>
                    </div>
                </div>
            </Modal>

            {/* Delete List Modal */}
            <Modal isOpen={isDeleteListOpen} onClose={() => setDeleteListOpen(false)} title="Delete Entire List">
                <div className="space-y-4">
                    <p className="text-sm text-slate-600">
                        Are you sure you want to delete list <span className="font-bold text-slate-800">"{currentList.name}"</span>? All packing items inside it will be permanently deleted.
                    </p>
                    <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                        <Button variant="secondary" onClick={() => setDeleteListOpen(false)}>Cancel</Button>
                        <Button onClick={handleDeleteList} variant="danger" className="bg-rose-600 text-white font-bold">
                            Confirm Delete List
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}