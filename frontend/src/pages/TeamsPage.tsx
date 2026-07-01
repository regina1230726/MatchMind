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
                    <p className="mb-2 text-sm font-semibold uppercase tracking-[0.3em] app-kicker">
                        Teams
                    </p>

                    <h1 className="text-5xl font-black tracking-tight text-white">
                        World Cup Teams
                    </h1>

                    <p className="mt-3 text-lg app-muted">
                        Explore all teams currently available in MatchMind.
                    </p>
                </div>

                <div className="hidden rounded-2xl app-card px-5 py-3 text-sm app-muted md:block">
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
        <div className="rounded-3xl app-card app-card-hover p-6">
            <div className="flex items-center gap-5">
                <img
                    src={team.flagUrl}
                    alt={team.name}
                    className="h-20 w-28 rounded-2xl object-cover shadow-lg"
                />

                <div>
                    <h2 className="text-2xl font-black text-white">
                        {team.name}
                    </h2>

                    <p className="mt-1 text-sm font-semibold app-kicker">
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
        <div className="rounded-2xl app-panel p-4">
            <p className="text-xs uppercase tracking-widest app-muted">
                {label}
            </p>

            <p className="mt-1 text-xl font-black text-white">
                {value}
            </p>
        </div>
    );
}