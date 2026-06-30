import pandas as pd
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "data"

RESULTS_PATH = DATA_DIR / "results.csv"
OUTPUT_PATH = DATA_DIR / "training_dataset.csv"


def get_match_result(home_score, away_score):
    if home_score > away_score:
        return "HOME_WIN"
    if home_score < away_score:
        return "AWAY_WIN"
    return "DRAW"


def get_team_recent_stats(team_name, previous_matches, last_n):
    team_matches = previous_matches[
        (previous_matches["home_team"] == team_name) |
        (previous_matches["away_team"] == team_name)
    ].tail(last_n)

    if team_matches.empty:
        return {
            "avg_goals_scored": 0,
            "avg_goals_conceded": 0,
            "win_rate": 0,
            "draw_rate": 0,
            "loss_rate": 0,
            "matches_played": 0,
        }

    goals_scored = []
    goals_conceded = []
    results = []

    for _, match in team_matches.iterrows():
        is_home = match["home_team"] == team_name

        scored = match["home_score"] if is_home else match["away_score"]
        conceded = match["away_score"] if is_home else match["home_score"]

        goals_scored.append(scored)
        goals_conceded.append(conceded)

        if scored > conceded:
            results.append("WIN")
        elif scored < conceded:
            results.append("LOSS")
        else:
            results.append("DRAW")

    total = len(results)

    return {
        "avg_goals_scored": sum(goals_scored) / total,
        "avg_goals_conceded": sum(goals_conceded) / total,
        "win_rate": results.count("WIN") / total,
        "draw_rate": results.count("DRAW") / total,
        "loss_rate": results.count("LOSS") / total,
        "matches_played": total,
    }


def get_head_to_head_stats(home_team, away_team, previous_matches, last_n=5):
    h2h_matches = previous_matches[
        (
            (previous_matches["home_team"] == home_team) &
            (previous_matches["away_team"] == away_team)
        ) |
        (
            (previous_matches["home_team"] == away_team) &
            (previous_matches["away_team"] == home_team)
        )
    ].tail(last_n)

    if h2h_matches.empty:
        return {
            "home_h2h_win_rate": 0,
            "away_h2h_win_rate": 0,
            "h2h_draw_rate": 0,
            "h2h_matches_played": 0,
        }

    home_wins = 0
    away_wins = 0
    draws = 0

    for _, match in h2h_matches.iterrows():
        actual_home = match["home_team"]
        actual_away = match["away_team"]
        home_score = match["home_score"]
        away_score = match["away_score"]

        if home_score == away_score:
            draws += 1
        elif home_score > away_score:
            winner = actual_home
            if winner == home_team:
                home_wins += 1
            else:
                away_wins += 1
        else:
            winner = actual_away
            if winner == home_team:
                home_wins += 1
            else:
                away_wins += 1

    total = len(h2h_matches)

    return {
        "home_h2h_win_rate": home_wins / total,
        "away_h2h_win_rate": away_wins / total,
        "h2h_draw_rate": draws / total,
        "h2h_matches_played": total,
    }


def build_training_dataset():
    df = pd.read_csv(RESULTS_PATH)

    df = df.dropna(subset=["home_score", "away_score"])

    df["date"] = pd.to_datetime(df["date"])
    df = df.sort_values("date").reset_index(drop=True)

    rows = []

    for index, match in df.iterrows():
        previous_matches = df.iloc[:index]

        if previous_matches.empty:
            continue

        home_team = match["home_team"]
        away_team = match["away_team"]

        home_10 = get_team_recent_stats(home_team, previous_matches, 10)
        away_10 = get_team_recent_stats(away_team, previous_matches, 10)

        home_5 = get_team_recent_stats(home_team, previous_matches, 5)
        away_5 = get_team_recent_stats(away_team, previous_matches, 5)

        h2h = get_head_to_head_stats(home_team, away_team, previous_matches, 5)

        if home_10["matches_played"] == 0 or away_10["matches_played"] == 0:
            continue

        rows.append({
            "date": match["date"],
            "home_team": home_team,
            "away_team": away_team,

            # Last 10 matches
            "home_avg_goals_scored_10": home_10["avg_goals_scored"],
            "home_avg_goals_conceded_10": home_10["avg_goals_conceded"],
            "home_win_rate_10": home_10["win_rate"],
            "home_draw_rate_10": home_10["draw_rate"],
            "home_loss_rate_10": home_10["loss_rate"],

            "away_avg_goals_scored_10": away_10["avg_goals_scored"],
            "away_avg_goals_conceded_10": away_10["avg_goals_conceded"],
            "away_win_rate_10": away_10["win_rate"],
            "away_draw_rate_10": away_10["draw_rate"],
            "away_loss_rate_10": away_10["loss_rate"],

            # Last 5 matches
            "home_avg_goals_scored_5": home_5["avg_goals_scored"],
            "home_avg_goals_conceded_5": home_5["avg_goals_conceded"],
            "home_win_rate_5": home_5["win_rate"],

            "away_avg_goals_scored_5": away_5["avg_goals_scored"],
            "away_avg_goals_conceded_5": away_5["avg_goals_conceded"],
            "away_win_rate_5": away_5["win_rate"],

            # Differences
            "win_rate_diff_10": home_10["win_rate"] - away_10["win_rate"],
            "avg_goals_scored_diff_10": home_10["avg_goals_scored"] - away_10["avg_goals_scored"],
            "avg_goals_conceded_diff_10": home_10["avg_goals_conceded"] - away_10["avg_goals_conceded"],

            "win_rate_diff_5": home_5["win_rate"] - away_5["win_rate"],
            "avg_goals_scored_diff_5": home_5["avg_goals_scored"] - away_5["avg_goals_scored"],

            # Head-to-head
            "home_h2h_win_rate": h2h["home_h2h_win_rate"],
            "away_h2h_win_rate": h2h["away_h2h_win_rate"],
            "h2h_draw_rate": h2h["h2h_draw_rate"],
            "h2h_matches_played": h2h["h2h_matches_played"],

            # Actual result (regression targets)
            "home_score": match["home_score"],
            "away_score": match["away_score"],

            # Context
            "neutral": int(str(match["neutral"]).lower() == "true"),

            "target": get_match_result(match["home_score"], match["away_score"]),
        })

    training_df = pd.DataFrame(rows)
    training_df.to_csv(OUTPUT_PATH, index=False)

    print("Improved training dataset created successfully!")
    print(f"Rows: {len(training_df)}")
    print(f"Columns: {len(training_df.columns)}")
    print(f"Saved to: {OUTPUT_PATH}")


if __name__ == "__main__":
    build_training_dataset()