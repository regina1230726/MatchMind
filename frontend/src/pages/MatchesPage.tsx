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
            <header className="mb-8">
                <p className="mb-2 text-sm font-semibold uppercase tracking-[0.3em] app-kicker">
                    MatchMind
                </p>

                <h1 className="text-5xl font-black tracking-tight text-white">
                    Matches
                </h1>

                <p className="mt-3 text-lg app-muted">
                    All scheduled matches for the World Cup prediction platform.
                </p>
            </header>

            <section className="grid gap-5 xl:grid-cols-2">
                {matches.map(match => (
                    <MatchCard key={match.id} match={match} />
                ))}
            </section>
        </div>
    );
}