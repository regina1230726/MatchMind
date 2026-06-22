import { useEffect, useState } from "react";
import { api } from "../services/api";
import type { Match } from "../types/Match";
import MatchCard from "../components/MatchCard";

export default function MatchesPage() {
    const [matches, setMatches] = useState<Match[]>([]);

    useEffect(() => {
        api.get("/matches")
            .then(response => setMatches(response.data))
            .catch(error => console.error(error));
    }, []);

    return (
        <div>
            <header className="mb-10">
                <p className="mb-2 text-sm font-semibold uppercase tracking-[0.3em] text-emerald-400">
                    MatchMind
                </p>

                <h1 className="text-5xl font-black tracking-tight">
                    Matches
                </h1>

                <p className="mt-3 text-lg text-slate-400">
                    All scheduled matches for the World Cup prediction platform.
                </p>
            </header>

            <section className="space-y-5">
                {matches.map(match => (
                    <MatchCard key={match.id} match={match} />
                ))}
            </section>
        </div>
    );
}