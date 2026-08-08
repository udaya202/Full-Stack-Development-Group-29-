import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import SidePanel from './SidePanel';

export default function Navbar({ searchQuery, setSearchQuery, userName = "Alex" }) {
    const [notifOpen, setNotifOpen] = useState(false);
    const [activityOpen, setActivityOpen] = useState(false);
    const [profileMenuOpen, setProfileMenuOpen] = useState(false);
    const navigate = useNavigate();

    const notifications = [
        { icon: 'fa-user-plus', color: 'text-blue-500', text: 'Dahamsa joined your list Japan Trip', time: '2 min ago' },
        { icon: 'fa-check-circle', color: 'text-green-500', text: 'Passport was completed', time: '1 hour ago' },
        { icon: 'fa-pen', color: 'text-amber-500', text: 'Camera quantity updated to 2', time: '3 hours ago' },
    ];

    const activityItems = [
        { avatar: 'D', bg: 'bg-blue-100 text-blue-700', text: 'Dahamsa added Passport', time: '10 min ago' },
        { avatar: 'I', bg: 'bg-emerald-100 text-emerald-700', text: 'Isala completed Camera', time: '30 min ago' },
        { avatar: 'U', bg: 'bg-amber-100 text-amber-700', text: 'Udaya edited Charger quantity', time: '1 hour ago' },
    ];

    return (
        <>
            <nav className="bg-white border-b border-slate-100 sticky top-0 z-40 shadow-xs">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo */}
                        <Link to="/dashboard" className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-sky-600 flex items-center justify-center font-bold text-white text-lg shadow-sm">
                                P
                            </div>
                            <span className="text-xl font-bold text-slate-800 tracking-tight">PackPal</span>
                        </Link>

                        {/* Search Bar */}
                        <div className="flex-1 max-w-sm mx-8 hidden md:block">
                            <div className="relative">
                                <i className="fas fa-search absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
                                <input
                                    type="text"
                                    placeholder="Search lists..."
                                    value={searchQuery || ''}
                                    onChange={(e) => setSearchQuery && setSearchQuery(e.target.value)}
                                    className="w-full bg-slate-100/80 border-0 rounded-full pl-9 pr-4 py-2 text-sm text-slate-700 placeholder-slate-400 focus:ring-2 focus:ring-sky-500 outline-none transition-all"
                                />
                            </div>
                        </div>

                        {/* Right controls */}
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setActivityOpen(true)}
                                title="Activity Feed"
                                className="text-slate-500 hover:text-slate-800 transition-colors p-1"
                            >
                                <i className="fas fa-clock text-lg"></i>
                            </button>

                            <button
                                onClick={() => setNotifOpen(true)}
                                title="Notifications"
                                className="relative text-slate-500 hover:text-slate-800 transition-colors p-1"
                            >
                                <i className="far fa-bell text-lg"></i>
                                <span className="absolute top-0 right-0 bg-rose-500 text-white text-[9px] rounded-full w-4 h-4 flex items-center justify-center font-bold">
                                    3
                                </span>
                            </button>

                            {/* User Profile Dropdown Button */}
                            <div className="relative">
                                <button
                                    onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                                    className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-full hover:bg-slate-50 transition-colors"
                                >
                                    <div className="w-8 h-8 rounded-full bg-sky-500 text-white flex items-center justify-center font-semibold text-sm shadow-xs">
                                        {userName.charAt(0)}
                                    </div>
                                    <span className="text-sm font-semibold text-slate-700 hidden sm:inline">{userName}</span>
                                    <i className={`fas fa-chevron-down text-[10px] text-slate-400 transition-transform ${profileMenuOpen ? 'rotate-180' : ''}`}></i>
                                </button>

                                {profileMenuOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-lg border border-slate-100 py-2 z-50 animate-fadeIn">
                                        <div className="px-4 py-2 border-b border-slate-100">
                                            <p className="text-xs font-semibold text-slate-400">Signed in as</p>
                                            <p className="text-sm font-bold text-slate-800 truncate">{userName}</p>
                                        </div>
                                        <Link
                                            to="/settings"
                                            onClick={() => setProfileMenuOpen(false)}
                                            className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                                        >
                                            <i className="fas fa-cog text-slate-400"></i> Settings
                                        </Link>
                                        <Link
                                            to="/"
                                            onClick={() => setProfileMenuOpen(false)}
                                            className="flex items-center gap-2.5 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50"
                                        >
                                            <i className="fas fa-sign-out-alt text-rose-500"></i> Sign Out
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Mobile Search */}
                    <div className="pb-3 md:hidden">
                        <div className="relative">
                            <i className="fas fa-search absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
                            <input
                                type="text"
                                placeholder="Search lists..."
                                value={searchQuery || ''}
                                onChange={(e) => setSearchQuery && setSearchQuery(e.target.value)}
                                className="w-full bg-slate-100/80 border-0 rounded-full pl-9 pr-4 py-2 text-sm text-slate-700 outline-none"
                            />
                        </div>
                    </div>
                </div>
            </nav>

            <SidePanel
                isOpen={notifOpen}
                onClose={() => setNotifOpen(false)}
                title="Notifications"
                items={notifications}
                type="notification"
            />
            <SidePanel
                isOpen={activityOpen}
                onClose={() => setActivityOpen(false)}
                title="Activity Feed"
                items={activityItems}
                type="activity"
            />
        </>
    );
}