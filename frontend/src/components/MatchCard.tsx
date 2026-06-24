import type { Match } from "../types/Match";
import { Link } from "react-router-dom";

interface Props {
    match: Match;
}

export default function MatchCard({ match }: Props) {
    const date = new Date(match.matchDate);

    return (
        <Link
            to={`/matches/${match.id}`}
            className="block rounded-2xl border border-white/10 bg-white/5 p-6 shadow-xl backdrop-blur-md transition hover:-translate-y-1 hover:border-emerald-400/40"
        >
            <div className="grid grid-cols-3 items-center gap-4">

                <div className="flex items-center gap-4">
                    <img
                        src={match.homeTeam.flagUrl}
                        alt={match.homeTeam.name}
                        className="h-16 w-20 rounded-xl object-cover shadow-lg"
                    />
                    <div>
                        <h2 className="text-2xl font-bold">{match.homeTeam.name}</h2>
                        <p className="text-sm text-slate-400">Group {match.homeTeam.groupName}</p>
                    </div>
                </div>

                <div className="text-center">
                    <p className="text-sm text-slate-400">
                        {date.toLocaleDateString("pt-PT", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                        })}
                    </p>

                    <p className="mt-2 text-3xl font-bold">
                        {date.toLocaleTimeString("pt-PT", {
                            hour: "2-digit",
                            minute: "2-digit",
                        })}
                    </p>

                    <div className="mx-auto mt-3 w-fit rounded-full border border-white/10 px-8 py-1 text-sm font-semibold text-slate-300">
                        VS
                    </div>
                </div>

                <div className="flex items-center justify-end gap-4">
                    <div className="text-right">
                        <h2 className="text-2xl font-bold">{match.awayTeam.name}</h2>
                        <p className="text-sm text-slate-400">Group {match.awayTeam.groupName}</p>
                    </div>

                    <img
                        src={match.awayTeam.flagUrl}
                        alt={match.awayTeam.name}
                        className="h-16 w-20 rounded-xl object-cover shadow-lg"
                    />
                </div>
            </div>

            <div className="mt-5 flex justify-end">
                <span className="rounded-full bg-emerald-500/10 px-4 py-1 text-sm font-semibold text-emerald-400">
                    {match.status}
                </span>
            </div>
        </Link>
    );
}