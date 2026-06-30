from pathlib import Path
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import GradientBoostingClassifier
import joblib
import pandas as pd

from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor
from sklearn.metrics import (
    accuracy_score,
    classification_report,
    confusion_matrix,
    mean_absolute_error,
    mean_squared_error,
)
from sklearn.model_selection import train_test_split


BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "data"
MODELS_DIR = BASE_DIR / "models"

TRAINING_DATASET_PATH = DATA_DIR / "training_dataset.csv"

CLASSIFIER_MODEL_PATH = MODELS_DIR / "classifier.pkl"
HOME_GOALS_MODEL_PATH = MODELS_DIR / "home_goals_regressor.pkl"
AWAY_GOALS_MODEL_PATH = MODELS_DIR / "away_goals_regressor.pkl"

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


def load_dataset():
    df = pd.read_csv(TRAINING_DATASET_PATH)

    df["neutral"] = df["neutral"].astype(bool).astype(int)

    X = df[FEATURE_COLUMNS]

    y_class = df["target"]
    y_home = df["home_score"]
    y_away = df["away_score"]

    return X, y_class, y_home, y_away


def train_classifier(name, model, X_train, X_test, y_train, y_test):

    print("=" * 60)
    print(f"TRAINING {name}")
    print("=" * 60)

    model.fit(X_train, y_train)

    predictions = model.predict(X_test)

    accuracy = accuracy_score(y_test, predictions)

    print(f"Accuracy: {accuracy:.4f}")
    print()
    print(classification_report(y_test, predictions))
    print(confusion_matrix(y_test, predictions))

    return model, accuracy


def train_regressor(name, model_path, X_train, X_test, y_train, y_test):

    print("=" * 60)
    print(f"TRAINING {name}")
    print("=" * 60)

    model = RandomForestRegressor(
        n_estimators=200,
        max_depth=12,
        min_samples_split=10,
        min_samples_leaf=5,
        random_state=42,
    )

    model.fit(X_train, y_train)

    predictions = model.predict(X_test)

    mae = mean_absolute_error(y_test, predictions)
    rmse = mean_squared_error(y_test, predictions) ** 0.5

    print(f"MAE : {mae:.3f}")
    print(f"RMSE: {rmse:.3f}")

    joblib.dump(model, model_path)

    print(f"\nSaved: {model_path}\n")


def train_models():

    MODELS_DIR.mkdir(exist_ok=True)

    X, y_class, y_home, y_away = load_dataset()

    (
        X_train,
        X_test,
        y_class_train,
        y_class_test,
        y_home_train,
        y_home_test,
        y_away_train,
        y_away_test,
    ) = train_test_split(
        X,
        y_class,
        y_home,
        y_away,
        test_size=0.2,
        random_state=42,
        stratify=y_class,
    )

    models = [

        (
            "Random Forest",
            RandomForestClassifier(
                n_estimators=200,
                max_depth=12,
                min_samples_split=10,
                min_samples_leaf=5,
                class_weight="balanced",
                random_state=42,
            )
        ),

        (
            "Logistic Regression",
            LogisticRegression(
                max_iter=1000,
                class_weight="balanced",
            )
        ),

        (
            "Gradient Boosting",
            GradientBoostingClassifier(
                n_estimators=200,
                learning_rate=0.05,
                max_depth=3,
                random_state=42,
            )
        ),
    ]

    best_accuracy = 0
    best_model = None

    for name, model in models:

        trained_model, accuracy = train_classifier(
            name,
            model,
            X_train,
            X_test,
            y_class_train,
            y_class_test,
        )

        if accuracy > best_accuracy:
            best_accuracy = accuracy
            best_model = trained_model

    joblib.dump(best_model, CLASSIFIER_MODEL_PATH)

    print()
    print("=" * 60)
    print("BEST CLASSIFIER")
    print("=" * 60)
    print(f"Accuracy: {best_accuracy:.4f}")
    print(f"Saved to: {CLASSIFIER_MODEL_PATH}")

    train_regressor(
        "HOME GOALS REGRESSOR",
        HOME_GOALS_MODEL_PATH,
        X_train,
        X_test,
        y_home_train,
        y_home_test,
    )

    train_regressor(
        "AWAY GOALS REGRESSOR",
        AWAY_GOALS_MODEL_PATH,
        X_train,
        X_test,
        y_away_train,
        y_away_test,
    )

    print("=" * 60)
    print("ALL MODELS TRAINED SUCCESSFULLY")
    print("=" * 60)


if __name__ == "__main__":
    train_models()