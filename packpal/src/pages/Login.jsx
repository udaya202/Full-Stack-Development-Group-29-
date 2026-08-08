import { Link, useNavigate } from 'react-router-dom';

export default function Login() {
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        navigate('/dashboard');
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl border border-slate-100 shadow-xl max-w-md w-full p-8 sm:p-10">
                {/* Logo & Header */}
                <div className="flex flex-col items-center text-center mb-8">
                    <div className="w-12 h-12 rounded-2xl bg-sky-600 flex items-center justify-center font-extrabold text-white text-2xl shadow-md mb-3">
                        P
                    </div>
                    <span className="text-2xl font-extrabold text-slate-800 tracking-tight">PackPal</span>
                    <h1 className="text-xl font-bold text-slate-800 mt-4">Welcome back</h1>
                    <p className="text-xs text-slate-500 mt-1 font-medium">
                        Sign in to access your collaborative packing lists
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                            Email Address
                        </label>
                        <input
                            type="email"
                            required
                            defaultValue="senithu@gmail.com"
                            className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all"
                            placeholder="you@gmail.com"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                            Password
                        </label>
                        <input
                            type="password"
                            required
                            defaultValue="password123"
                            className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all"
                            placeholder="••••••••"
                        />
                    </div>

                    <div className="flex items-center justify-between text-xs pt-1">
                        <label className="flex items-center gap-2 text-slate-600 cursor-pointer">
                            <input type="checkbox" defaultChecked className="rounded border-slate-300 text-sky-600 focus:ring-sky-500" />
                            <span>Remember Me</span>
                        </label>
                        <a href="#" className="text-sky-600 font-semibold hover:underline">Forgot Password?</a>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-sky-600 hover:bg-sky-700 text-white py-3 rounded-full font-bold text-sm shadow-md hover:shadow-lg transition-all mt-2 cursor-pointer"
                    >
                        Sign In
                    </button>
                </form>

                {/* Footer link */}
                <p className="mt-8 text-center text-xs text-slate-500 font-medium pt-4 border-t border-slate-100">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-sky-600 font-bold hover:underline">
                        Register
                    </Link>
                </p>
            </div>
        </div>
    );
}