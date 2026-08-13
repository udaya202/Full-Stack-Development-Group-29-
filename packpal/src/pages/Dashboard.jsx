import { useState } from 'react';
import { usePackPal } from '../context/PackPalContext';
import { waveHand, clipboardImg, checkmarkImg, targetImg, collaboratorsImg } from '../data/mockData';
import Navbar from '../components/layout/Navbar';
import StatsCard from '../components/lists/StatsCard';
import ListCard from '../components/lists/ListCard';
import BoardView from '../components/board/BoardView';
import Modal from '../components/common/Modal';
import Button from '../components/common/Button';

export default function Dashboard() {
    const { lists, tasks, stats, addList, deleteList } = usePackPal();
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState('board');
    const [isCreateModalOpen, setCreateModalOpen] = useState(false);
    const [listToDelete, setListToDelete] = useState(null);
    const [isCollaboratorsModalOpen, setCollaboratorsModalOpen] = useState(false);

    // Board filter states controlled from Dashboard stats
    const [boardStatusFilter, setBoardStatusFilter] = useState('All');
    const [boardAssigneeFilter, setBoardAssigneeFilter] = useState('All');

    // new list form inputs
    const [listName, setListName] = useState('');
    const [listDescription, setListDescription] = useState('');
    const [listType, setListType] = useState('Packing');
    const [listColor, setListColor] = useState('bg-blue-500');

    const filteredLists = lists.filter(l =>
        l.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleCreateList = (e) => {
        e.preventDefault();
        if (!listName.trim()) return;

        addList({
            name: listName.trim(),
            description: listDescription.trim(),
            type: listType,
            color: listColor,
        });

        setListName('');
        setListDescription('');
        setListType('Packing');
        setListColor('bg-blue-500');
        setCreateModalOpen(false);
    };

    const confirmDeleteList = () => {
        if (!listToDelete) return;
        deleteList(listToDelete.id);
        setListToDelete(null);
    };

    // Collaborators metadata calculation
    const collaboratorsList = [
        { name: 'Senithu', role: 'Owner', initials: 'S', bg: 'bg-blue-500 text-white' },
        { name: 'Dahamsa', role: 'Collaborator', initials: 'D', bg: 'bg-teal-500 text-white' },
        { name: 'Isala', role: 'Collaborator', initials: 'I', bg: 'bg-purple-500 text-white' },
        { name: 'Udaya', role: 'Collaborator', initials: 'U', bg: 'bg-amber-500 text-white' },
        { name: 'Abishek', role: 'Collaborator', initials: 'A', bg: 'bg-slate-500 text-white' },
    ].map(member => {
        const memberTasks = tasks.filter(t => t.assignee && t.assignee.toLowerCase() === member.name.toLowerCase());
        const completedCount = memberTasks.filter(t => t.status === 'packed' || t.completed).length;
        return {
            ...member,
            totalAssigned: memberTasks.length,
            completedAssigned: completedCount,
        };
    });

    return (
        <div className="min-h-screen bg-slate-50/50 pb-16">
            <Navbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} userName="Senithu" />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <div>
                        <div className="flex items-center gap-2.5">
                            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">
                                Welcome back, Senithu
                            </h1>
                            <img src={waveHand} alt="waving hand" className="w-7 h-7 inline-block animate-bounce" />
                        </div>
                        <p className="text-sm text-slate-500 mt-1 font-medium">
                            You have {stats.totalItems - stats.completedItems} items pending across {stats.totalLists} lists
                        </p>
                    </div>

                    <Button
                        onClick={() => setCreateModalOpen(true)}
                        icon="fa-plus"
                        variant="primary"
                        className="self-start sm:self-auto bg-sky-600 hover:bg-sky-700 text-white shadow-xs rounded-full px-5 py-2.5 font-semibold text-sm"
                    >
                        Create New List
                    </Button>
                </div>

                {/* Interactive stats cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <StatsCard
                        label="Total Lists"
                        value={stats.totalLists}
                        image={clipboardImg}
                        active={activeTab === 'lists'}
                        onClick={() => {
                            setActiveTab('lists');
                            setBoardStatusFilter('All');
                            setBoardAssigneeFilter('All');
                        }}
                    />

                    <StatsCard
                        label="Total Items"
                        value={stats.totalItems}
                        image={checkmarkImg}
                        active={activeTab === 'board' && boardStatusFilter === 'All' && boardAssigneeFilter === 'All'}
                        onClick={() => {
                            setActiveTab('board');
                            setBoardStatusFilter('All');
                            setBoardAssigneeFilter('All');
                        }}
                    />

                    <StatsCard
                        label="Completed"
                        value={stats.completedItems}
                        image={targetImg}
                        active={activeTab === 'board' && boardStatusFilter === 'packed'}
                        onClick={() => {
                            setActiveTab('board');
                            setBoardStatusFilter('packed');
                            setBoardAssigneeFilter('All');
                        }}
                    />

                    <StatsCard
                        label="Collaborators"
                        value={stats.collaborators}
                        image={collaboratorsImg}
                        onClick={() => setCollaboratorsModalOpen(true)}
                    />
                </div>

                {/* Active filter banner if stats filtered */}
                {boardStatusFilter === 'packed' && activeTab === 'board' && (
                    <div className="mb-6 p-3 px-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between text-xs text-emerald-800 font-semibold">
                        <div className="flex items-center gap-2">
                            <i className="fas fa-filter text-emerald-500"></i>
                            <span>Filtering Board: Showing <strong>Packed / Completed</strong> items ({stats.completedItems})</span>
                        </div>
                        <button
                            onClick={() => setBoardStatusFilter('All')}
                            className="text-emerald-700 hover:underline font-bold"
                        >
                            Reset Filter ×
                        </button>
                    </div>
                )}

                {boardAssigneeFilter !== 'All' && activeTab === 'board' && (
                    <div className="mb-6 p-3 px-4 bg-sky-50 border border-sky-200 rounded-2xl flex items-center justify-between text-xs text-sky-800 font-semibold">
                        <div className="flex items-center gap-2">
                            <i className="fas fa-user-tag text-sky-500"></i>
                            <span>Filtering Board for Assignee: <strong>{boardAssigneeFilter}</strong></span>
                        </div>
                        <button
                            onClick={() => setBoardAssigneeFilter('All')}
                            className="text-sky-700 hover:underline font-bold"
                        >
                            Reset Assignee Filter ×
                        </button>
                    </div>
                )}

                {/* tabs */}
                <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-6">
                    <div className="flex items-center gap-2 bg-slate-200/60 p-1 rounded-2xl">
                        <button
                            onClick={() => setActiveTab('board')}
                            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'board'
                                    ? 'bg-white text-sky-600 shadow-xs'
                                    : 'text-slate-600 hover:text-slate-900'
                                }`}
                        >
                            <i className="fas fa-columns"></i> Board View (3 Columns)
                        </button>
                        <button
                            onClick={() => setActiveTab('lists')}
                            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'lists'
                                    ? 'bg-white text-sky-600 shadow-xs'
                                    : 'text-slate-600 hover:text-slate-900'
                                }`}
                        >
                            <i className="fas fa-th-large"></i> My Lists Grid
                        </button>
                    </div>

                    <span className="text-xs font-bold text-slate-400 hidden sm:inline">
                        {activeTab === 'board' ? 'Task Board Active' : `${filteredLists.length} lists`}
                    </span>
                </div>

                {/* main content tab */}
                {activeTab === 'board' ? (
                    <div className="space-y-6">
                        <BoardView
                            statusFilter={boardStatusFilter}
                            setStatusFilter={setBoardStatusFilter}
                            assigneeFilter={boardAssigneeFilter}
                            setAssigneeFilter={setBoardAssigneeFilter}
                        />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredLists.map((list) => (
                            <ListCard key={list.id} list={list} onDelete={(target) => setListToDelete(target)} />
                        ))}

                        <div
                            onClick={() => setCreateModalOpen(true)}
                            className="group min-h-[220px] rounded-2xl border-2 border-dashed border-sky-300 hover:border-sky-500 bg-sky-50/20 hover:bg-sky-50/60 transition-all duration-200 cursor-pointer flex flex-col items-center justify-center p-6 text-center"
                        >
                            <div className="w-12 h-12 rounded-full border-2 border-sky-500 text-sky-500 flex items-center justify-center font-bold text-xl mb-3 group-hover:scale-110 transition-transform">
                                <i className="fas fa-plus"></i>
                            </div>
                            <span className="text-sm font-bold text-sky-600 group-hover:text-sky-700">
                                Create new list
                            </span>
                        </div>
                    </div>
                )}
            </main>

            {/* create list modal */}
            <Modal isOpen={isCreateModalOpen} onClose={() => setCreateModalOpen(false)} title="Create New List">
                <form onSubmit={handleCreateList} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                            List Name
                        </label>
                        <input
                            type="text"
                            required
                            value={listName}
                            onChange={(e) => setListName(e.target.value)}
                            className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-sky-500 outline-none transition-all"
                            placeholder="e.g. Hawaii Summer Vacation"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                            Description
                        </label>
                        <input
                            type="text"
                            value={listDescription}
                            onChange={(e) => setListDescription(e.target.value)}
                            className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-sky-500 outline-none transition-all"
                            placeholder="What's this list for?"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                            List Type
                        </label>
                        <select
                            value={listType}
                            onChange={(e) => setListType(e.target.value)}
                            className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-sky-500 outline-none bg-white"
                        >
                            <option value="Packing">Packing List</option>
                            <option value="Shopping">Shopping List</option>
                            <option value="Travel">Travel Essentials</option>
                            <option value="Camping">Camping & Hiking</option>
                            <option value="Party">Event & Party</option>
                            <option value="Office">Office Supplies</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                            Color Theme
                        </label>
                        <div className="flex gap-3">
                            {[
                                { bg: 'bg-blue-500', name: 'Blue' },
                                { bg: 'bg-amber-400', name: 'Yellow' },
                                { bg: 'bg-emerald-400', name: 'Green' },
                                { bg: 'bg-purple-500', name: 'Purple' },
                                { bg: 'bg-rose-500', name: 'Rose' }
                            ].map((c) => (
                                <button
                                    key={c.bg}
                                    type="button"
                                    onClick={() => setListColor(c.bg)}
                                    className={`w-8 h-8 rounded-full ${c.bg} cursor-pointer transition-transform ${listColor === c.bg ? 'ring-2 ring-offset-2 ring-slate-800 scale-110' : 'hover:scale-105'
                                        }`}
                                    title={c.name}
                                ></button>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                        <Button variant="secondary" onClick={() => setCreateModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" variant="primary" className="bg-sky-600 text-white">
                            Create List
                        </Button>
                    </div>
                </form>
            </Modal>

            {/* delete list confirmation modal */}
            <Modal isOpen={!!listToDelete} onClose={() => setListToDelete(null)} title="Delete List">
                <div className="space-y-4">
                    <p className="text-sm text-slate-600">
                        Are you sure you want to delete <span className="font-bold text-slate-800">"{listToDelete?.name}"</span>? All items belonging to this list will also be permanently deleted.
                    </p>
                    <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                        <Button variant="secondary" onClick={() => setListToDelete(null)}>
                            Cancel
                        </Button>
                        <Button onClick={confirmDeleteList} variant="danger" className="bg-rose-600 text-white font-bold">
                            Confirm Delete List
                        </Button>
                    </div>
                </div>
            </Modal>

            {/* Collaborators list modal */}
            <Modal isOpen={isCollaboratorsModalOpen} onClose={() => setCollaboratorsModalOpen(false)} title="Team Collaborators">
                <div className="space-y-4">
                    <p className="text-xs text-slate-500">
                        Active team members collaborating across your packing lists and tasks:
                    </p>

                    <div className="space-y-3">
                        {collaboratorsList.map(member => (
                            <div key={member.name} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm ${member.bg}`}>
                                        {member.initials}
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-slate-800">{member.name}</h4>
                                        <p className="text-[11px] text-slate-400 font-medium">
                                            {member.role} • {member.totalAssigned} items assigned ({member.completedAssigned} packed)
                                        </p>
                                    </div>
                                </div>

                                <Button
                                    variant="outline"
                                    icon="fa-filter"
                                    onClick={() => {
                                        setBoardAssigneeFilter(member.name);
                                        setActiveTab('board');
                                        setCollaboratorsModalOpen(false);
                                    }}
                                    className="text-xs font-bold px-3 py-1.5"
                                >
                                    Filter Board
                                </Button>
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-end pt-4 border-t border-slate-100">
                        <Button variant="secondary" onClick={() => setCollaboratorsModalOpen(false)}>
                            Close
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
