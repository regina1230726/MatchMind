from pathlib import Path

import joblib
import pandas as pd


BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "data"
MODELS_DIR = BASE_DIR / "models"

RESULTS_PATH = DATA_DIR / "results.csv"
CURRENT_MATCHES_PATH = DATA_DIR / "current_matches.csv"
CLASSIFIER_MODEL_PATH = MODELS_DIR / "classifier.pkl"
HOME_MODEL_PATH = MODELS_DIR / "home_goals_regressor.pkl"
AWAY_MODEL_PATH = MODELS_DIR / "away_goals_regressor.pkl"
OUTPUT_PATH = DATA_DIR / "predictions_output.csv"

FEATURE_COLUMNS = [
    "home_avg_goals_scored_10",
    "home_avg_goals_conceded_10",
    "home_win_rate_10",
    "home_draw_rate_10",
    "home_loss_rate_10",
    "away_avg_goals_scored_10",
    "away_avg_goals_conceded_10",
    "away_win_rate_10",
    "away_draw_rate_10",
    "away_loss_rate_10",
    "home_avg_goals_scored_5",
    "home_avg_goals_conceded_5",
    "home_win_rate_5",
    "away_avg_goals_scored_5",
    "away_avg_goals_conceded_5",
    "away_win_rate_5",
    "win_rate_diff_10",
    "avg_goals_scored_diff_10",
    "avg_goals_conceded_diff_10",
    "win_rate_diff_5",
    "avg_goals_scored_diff_5",
    "home_h2h_win_rate",
    "away_h2h_win_rate",
    "h2h_draw_rate",
    "h2h_matches_played",
    "neutral",
]


def get_team_recent_stats(team_name, matches, last_n):
    team_matches = matches[
        (matches["home_team"] == team_name) |
        (matches["away_team"] == team_name)
    ].tail(last_n)

    if team_matches.empty:
        return {
            "avg_goals_scored": 0,
            "avg_goals_conceded": 0,
            "win_rate": 0,
            "draw_rate": 0,
            "loss_rate": 0,
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


def build_features_for_match(home_team, away_team, historical_matches):
    home_10 = get_team_recent_stats(home_team, historical_matches, 10)
    away_10 = get_team_recent_stats(away_team, historical_matches, 10)

    home_5 = get_team_recent_stats(home_team, historical_matches, 5)
    away_5 = get_team_recent_stats(away_team, historical_matches, 5)

    h2h = get_head_to_head_stats(home_team, away_team, historical_matches, 5)

    return {
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

        "home_avg_goals_scored_5": home_5["avg_goals_scored"],
        "home_avg_goals_conceded_5": home_5["avg_goals_conceded"],
        "home_win_rate_5": home_5["win_rate"],

        "away_avg_goals_scored_5": away_5["avg_goals_scored"],
        "away_avg_goals_conceded_5": away_5["avg_goals_conceded"],
        "away_win_rate_5": away_5["win_rate"],

        "win_rate_diff_10": home_10["win_rate"] - away_10["win_rate"],
        "avg_goals_scored_diff_10": home_10["avg_goals_scored"] - away_10["avg_goals_scored"],
        "avg_goals_conceded_diff_10": home_10["avg_goals_conceded"] - away_10["avg_goals_conceded"],

        "win_rate_diff_5": home_5["win_rate"] - away_5["win_rate"],
        "avg_goals_scored_diff_5": home_5["avg_goals_scored"] - away_5["avg_goals_scored"],

        "home_h2h_win_rate": h2h["home_h2h_win_rate"],
        "away_h2h_win_rate": h2h["away_h2h_win_rate"],
        "h2h_draw_rate": h2h["h2h_draw_rate"],
        "h2h_matches_played": h2h["h2h_matches_played"],

        "neutral": 1,
    }

def build_score_prediction(home_goals, away_goals, outcome):

    if outcome == "DRAW":
        avg = max(1, round((home_goals + away_goals) / 2))
        return avg, avg

    home = max(0, round(home_goals))
    away = max(0, round(away_goals))

    if outcome == "HOME_WIN" and home <= away:
        home = away + 1

    if outcome == "AWAY_WIN" and away <= home:
        away = home + 1

    return home, away

def predict_matches():
    classifier = joblib.load(CLASSIFIER_MODEL_PATH)
    home_regressor = joblib.load(HOME_MODEL_PATH)
    away_regressor = joblib.load(AWAY_MODEL_PATH)

    historical_matches = pd.read_csv(RESULTS_PATH)

    historical_matches = historical_matches.dropna(
        subset=["home_score", "away_score"]
    )

    historical_matches["date"] = pd.to_datetime(historical_matches["date"])
    historical_matches = historical_matches.sort_values("date").reset_index(drop=True)

    current_matches = pd.read_csv(CURRENT_MATCHES_PATH)

    rows = []

    for _, match in current_matches.iterrows():
        home_team = match["home_team"]
        away_team = match["away_team"]

        features = build_features_for_match(
            home_team,
            away_team,
            historical_matches
        )

        X = pd.DataFrame([features])[FEATURE_COLUMNS]

        # ---------- Classifier ----------

        probabilities = classifier.predict_proba(X)[0]
        predicted_class = classifier.predict(X)[0]

        probability_map = dict(zip(classifier.classes_, probabilities))

        # ---------- Regressors ----------

        predicted_home_goals = float(home_regressor.predict(X)[0])
        predicted_away_goals = float(away_regressor.predict(X)[0])

        display_home_score, display_away_score = build_score_prediction(
            predicted_home_goals,
            predicted_away_goals,
            predicted_class,
        )

        rows.append({
            "home_team": home_team,
            "away_team": away_team,

            "home_win_probability": round(probability_map.get("HOME_WIN", 0), 4),
            "draw_probability": round(probability_map.get("DRAW", 0), 4),
            "away_win_probability": round(probability_map.get("AWAY_WIN", 0), 4),

            "predicted_outcome": predicted_class,

            # Expected goals (valores contínuos do modelo)
            "expected_home_goals": round(predicted_home_goals, 2),
            "expected_away_goals": round(predicted_away_goals, 2),

            # Resultado previsto para mostrar ao utilizador
            "predicted_home_score": display_home_score,
            "predicted_away_score": display_away_score,
        })

    output_df = pd.DataFrame(rows)
    output_df.to_csv(OUTPUT_PATH, index=False)

    print("Predictions generated successfully!")
    print(output_df)
    print(f"\nSaved to: {OUTPUT_PATH}")


if __name__ == "__main__":
    predict_matches()