import { NavLink, Outlet } from "react-router-dom";

export default function AppLayout() {
    return (
        <div className="min-h-screen app-bg">
            <aside className="fixed left-0 top-0 h-screen w-64 border-r app-sidebar p-6 backdrop-blur-xl">
                <div className="mb-12">
                    <h1 className="text-2xl font-black">
                        Match<span className="app-kicker">Mind</span>
                    </h1>
                    <p className="mt-1 text-xs app-muted">
                        World Cup Predictor
                    </p>
                </div>

                <nav className="space-y-3">
                    <NavItem to="/dashboard" label="Dashboard" />
                    <NavItem to="/matches" label="Matches" />
                    <NavItem to="/predictions" label="Predictions" />
                    <NavItem to="/teams" label="Teams" />
                </nav>

                <div className="absolute bottom-6 left-6 right-6 rounded-2xl app-card p-4 text-sm app-muted">
                    <p className="font-semibold text-white">FIFA World Cup 2026</p>
                    <p className="mt-1 text-xs app-muted">
                        Every match. Every prediction.
                    </p>
                </div>
            </aside>

            <main className="ml-64 min-h-screen app-main-bg px-10 py-10">
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
                    isActive ? "app-nav-active" : "app-nav-inactive"
                }`
            }
        >
            {label}
        </NavLink>
    );
}