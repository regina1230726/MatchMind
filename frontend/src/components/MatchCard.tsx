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
            className="group block rounded-2xl app-card app-card-hover p-5"
        >
            <div className="mb-4 flex items-center justify-between gap-4">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-widest app-kicker">
                        {match.stage}
                    </p>

                    <p className="mt-1 text-sm app-muted">
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

                <span className="rounded-full app-chip px-3 py-1 text-xs font-semibold">
                    {match.status}
                </span>
            </div>

            <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4">
                <TeamSide
                    name={match.homeTeam.name}
                    code={match.homeTeam.code}
                    flagUrl={match.homeTeam.flagUrl}
                />

                <div className="rounded-full app-panel px-4 py-2 text-xs font-black app-muted">
                    VS
                </div>

                <TeamSide
                    name={match.awayTeam.name}
                    code={match.awayTeam.code}
                    flagUrl={match.awayTeam.flagUrl}
                    alignRight
                />
            </div>

            <div className="mt-5 flex items-center justify-end text-sm font-semibold app-muted transition group-hover:text-[#BBE1FA]">
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
                <h2 className="text-lg font-black leading-tight text-white">
                    {name}
                </h2>

                <p className="text-xs app-muted">
                    {code}
                </p>
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