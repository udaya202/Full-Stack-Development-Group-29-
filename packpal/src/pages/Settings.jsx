import { useState } from 'react';
import { Link } from 'react-router-dom';
import { usePackPal } from '../context/PackPalContext';
import Navbar from '../components/layout/Navbar';
import Button from '../components/common/Button';

export default function Settings() {
    const { resetData } = usePackPal();
    const [name, setName] = useState('Senithu');
    const [email, setEmail] = useState('senithu@gmail.com');
    const [savedMsg, setSavedMsg] = useState(false);
    const [resetMsg, setResetMsg] = useState(false);

    const handleSave = (e) => {
        e.preventDefault();
        setSavedMsg(true);
        setTimeout(() => setSavedMsg(false), 2500);
    };

    const handleReset = () => {
        if (window.confirm("Are you sure you want to reset all lists and tasks to default mock data? Local changes will be lost.")) {
            resetData();
            setResetMsg(true);
            setTimeout(() => setResetMsg(false), 2500);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50/50 pb-16">
            <Navbar userName={name} />

            <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
                <div className="flex items-center gap-3 mb-8">
                    <Link
                        to="/dashboard"
                        className="w-9 h-9 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-colors shadow-xs"
                    >
                        <i className="fas fa-arrow-left text-sm"></i>
                    </Link>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">
                        Account Settings
                    </h1>
                </div>

                {savedMsg && (
                    <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-semibold flex items-center gap-2">
                        <i className="fas fa-check-circle text-emerald-500"></i> Settings successfully saved!
                    </div>
                )}

                {resetMsg && (
                    <div className="mb-6 p-4 rounded-2xl bg-sky-50 border border-sky-200 text-sky-800 text-sm font-semibold flex items-center gap-2">
                        <i className="fas fa-info-circle text-sky-500"></i> Data successfully reset to initial mock data!
                    </div>
                )}

                <form onSubmit={handleSave} className="space-y-6">
                    {/* Profile Information */}
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-xs p-6">
                        <h2 className="text-lg font-bold text-slate-800 mb-4">Profile Information</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-sky-500"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-sky-500"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Change Password */}
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-xs p-6">
                        <h2 className="text-lg font-bold text-slate-800 mb-4">Security</h2>
                        <div className="space-y-3">
                            <input
                                type="password"
                                placeholder="Current Password"
                                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-sky-500"
                            />
                            <input
                                type="password"
                                placeholder="New Password"
                                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-sky-500"
                            />
                        </div>
                    </div>

                    {/* Data Management */}
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-xs p-6">
                        <h2 className="text-lg font-bold text-slate-800 mb-2">Data & Local Storage</h2>
                        <p className="text-xs text-slate-500 mb-4 font-medium leading-relaxed">
                            Your tasks, lists, and status changes are currently stored locally in your browser's LocalStorage. If you want to restore the initial sample data, click below.
                        </p>
                        <Button
                            type="button"
                            onClick={handleReset}
                            variant="secondary"
                            className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-4 py-2 rounded-xl"
                            icon="fa-undo"
                        >
                            Reset Local Data to Default
                        </Button>
                    </div>

                    {/* Preferences */}
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-xs p-6">
                        <h2 className="text-lg font-bold text-slate-800 mb-4">Preferences</h2>
                        <div className="space-y-3 text-sm font-medium text-slate-700">
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input type="checkbox" defaultChecked className="rounded border-slate-300 text-sky-600 focus:ring-sky-500" />
                                <span>Email notifications when item status changes</span>
                            </label>
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input type="checkbox" defaultChecked className="rounded border-slate-300 text-sky-600 focus:ring-sky-500" />
                                <span>Push notifications for collaborator invites</span>
                            </label>
                        </div>
                    </div>

                    <div className="flex justify-between items-center pt-2">
                        <Button type="submit" className="bg-sky-600 hover:bg-sky-700 text-white font-bold px-6 py-2.5 rounded-full">
                            Save Settings
                        </Button>
                        <Link to="/" className="text-xs font-bold text-rose-600 hover:underline flex items-center gap-1.5">
                            <i className="fas fa-sign-out-alt"></i> Sign Out
                        </Link>
                    </div>
                </form>
            </main>
        </div>
    );
}