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
            className="group block rounded-2xl border border-white/10 bg-white/5 p-5 shadow-xl backdrop-blur-md transition hover:-translate-y-1 hover:border-emerald-400/50 hover:bg-white/10"
        >
            <div className="mb-4 flex items-center justify-between gap-4">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-emerald-400">
                        {match.stage}
                    </p>
                    <p className="mt-1 text-sm text-slate-400">
                        {date.toLocaleDateString("pt-PT", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                        })}{" "}
                        •{" "}
                        {date.toLocaleTimeString("pt-PT", {
                            hour: "2-digit",
                            minute: "2-digit",
                        })}
                    </p>
                </div>

                <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">
                    {match.status}
                </span>
            </div>

            <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4">
                <TeamSide
                    name={match.homeTeam.name}
                    code={match.homeTeam.code}
                    flagUrl={match.homeTeam.flagUrl}
                />

                <div className="rounded-full border border-white/10 bg-slate-950/50 px-4 py-2 text-xs font-black text-slate-400">
                    VS
                </div>

                <TeamSide
                    name={match.awayTeam.name}
                    code={match.awayTeam.code}
                    flagUrl={match.awayTeam.flagUrl}
                    alignRight
                />
            </div>

            <div className="mt-5 flex items-center justify-end text-sm font-semibold text-slate-400 transition group-hover:text-emerald-300">
                View details →
            </div>
        </Link>
    );
}

function TeamSide({
                      name,
                      code,
                      flagUrl,
                      alignRight = false,
                  }: {
    name: string;
    code: string;
    flagUrl: string;
    alignRight?: boolean;
}) {
    return (
        <div
            className={`flex items-center gap-3 ${
                alignRight ? "justify-end text-right" : ""
            }`}
        >
            {!alignRight && (
                <img
                    src={flagUrl}
                    alt={name}
                    className="h-11 w-14 rounded-lg object-cover shadow-lg"
                />
            )}

            <div>
                <h2 className="text-lg font-black leading-tight">{name}</h2>
                <p className="text-xs text-slate-400">{code}</p>
            </div>

            {alignRight && (
                <img
                    src={flagUrl}
                    alt={name}
                    className="h-11 w-14 rounded-lg object-cover shadow-lg"
                />
            )}
        </div>
    );
}