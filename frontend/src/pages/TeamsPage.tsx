import { useEffect, useState } from "react";
import { api } from "../services/api";
import type { Team } from "../types/Team";

export default function TeamsPage() {
    const [teams, setTeams] = useState<Team[]>([]);

    useEffect(() => {
        api.get("/teams")
            .then(response => setTeams(response.data))
            .catch(error => console.error(error));
    }, []);

    return (
        <div>
            <header className="mb-10 flex items-end justify-between gap-6">
                <div>
                    <p className="mb-2 text-sm font-semibold uppercase tracking-[0.3em] text-emerald-400">
                        Teams
                    </p>

                    <h1 className="text-5xl font-black tracking-tight">
                        World Cup Teams
                    </h1>

                    <p className="mt-3 text-lg text-slate-400">
                        Explore all teams currently available in MatchMind.
                    </p>
                </div>

                <div className="hidden rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm text-slate-300 md:block">
                    {teams.length} teams available
                </div>
            </header>

            <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {teams.map(team => (
                    <TeamCard key={team.id} team={team} />
                ))}
            </section>
        </div>
    );
}

function TeamCard({ team }: { team: Team }) {
    return (
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl backdrop-blur-md transition hover:-translate-y-1 hover:border-emerald-400/40">
            <div className="flex items-center gap-5">
                <img
                    src={team.flagUrl}
                    alt={team.name}
                    className="h-20 w-28 rounded-2xl object-cover shadow-lg"
                />

                <div>
                    <h2 className="text-2xl font-black">
                        {team.name}
                    </h2>

                    <p className="mt-1 text-sm font-semibold text-emerald-400">
                        {team.code}
                    </p>
                </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
                <InfoBox label="Group" value={team.groupName} />
                <InfoBox label="FIFA Rank" value={`#${team.fifaRanking}`} />
            </div>
        </div>
    );
}

function InfoBox({ label, value }: { label: string; value: string }) {
    return (
        <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
            <p className="text-xs uppercase tracking-widest text-slate-500">
                {label}
            </p>

            <p className="mt-1 text-xl font-black">
                {value}
            </p>
        </div>
    );
}