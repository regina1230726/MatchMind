import { NavLink, Outlet } from "react-router-dom";

export default function AppLayout() {
    return (
        <div className="min-h-screen bg-[#050816] text-white">
            <aside className="fixed left-0 top-0 h-screen w-64 border-r border-white/10 bg-slate-950/80 p-6 backdrop-blur-xl">
                <div className="mb-12">
                    <h1 className="text-2xl font-black">
                        Match<span className="text-emerald-400">Mind</span>
                    </h1>
                    <p className="mt-1 text-xs text-slate-400">
                        World Cup Predictor
                    </p>
                </div>

                <nav className="space-y-3">
                    <NavItem to="/dashboard" label="Dashboard" />
                    <NavItem to="/matches" label="Matches" />
                    <NavItem to="/predictions" label="Predictions" />
                    <NavItem to="/teams" label="Teams" />
                </nav>

                <div className="absolute bottom-6 left-6 right-6 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
                    <p className="font-semibold text-white">FIFA World Cup 2026</p>
                    <p className="mt-1 text-xs text-slate-400">
                        Every match. Every prediction.
                    </p>
                </div>
            </aside>

            <main className="ml-64 min-h-screen bg-[radial-gradient(circle_at_top_left,#1e1b4b,#050816_45%)] px-10 py-10">
                <Outlet />
            </main>
        </div>
    );
}

function NavItem({ to, label }: { to: string; label: string }) {
    return (
        <NavLink
            to={to}
            className={({ isActive }) =>
                `block rounded-2xl px-4 py-3 font-semibold transition ${
                    isActive
                        ? "bg-violet-600 text-white shadow-lg shadow-violet-600/25"
                        : "text-slate-400 hover:bg-white/5 hover:text-white"
                }`
            }
        >
            {label}
        </NavLink>
    );
}