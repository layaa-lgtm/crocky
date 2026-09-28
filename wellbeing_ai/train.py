import os
import sys
import joblib
import numpy as np
import pandas as pd

from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, r2_score

# Allow importing data_pipeline.py from this folder
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from data_pipeline import build_daily_features


# --------------------------------------------------
# PATHS
# --------------------------------------------------

PROJECT_ROOT = os.path.dirname(
    os.path.abspath(__file__)
)

GARMIN_FILE = os.path.join(
    PROJECT_ROOT,
    "..",
    "..",
    "garmin ai clone",
    "coach",
    "data",
    "Garmin_Greece_202409-202508__SHA256.xlsx"
)

MODEL_DIR = os.path.join(
    PROJECT_ROOT,
    "models"
)

OUTPUT_DIR = os.path.join(
    PROJECT_ROOT,
    "outputs"
)

MODEL_PATH = os.path.join(
    MODEL_DIR,
    "readiness_model.pkl"
)

FEATURE_OUTPUT = os.path.join(
    OUTPUT_DIR,
    "daily_features_real.csv"
)


# --------------------------------------------------
# LOAD DATA
# --------------------------------------------------

print("Loading real Garmin dataset...")

activities = pd.read_excel(
    GARMIN_FILE,
    sheet_name="Activities"
)

sleep = pd.read_excel(
    GARMIN_FILE,
    sheet_name="Sleep"
)

spo2 = pd.read_excel(
    GARMIN_FILE,
    sheet_name="Spo2"
)

print(f"Activities: {len(activities)} rows")
print(f"Sleep: {len(sleep)} rows")
print(f"Spo2: {len(spo2)} rows")


# --------------------------------------------------
# BUILD DAILY FEATURES
# --------------------------------------------------

print("\nBuilding daily features...")

daily = build_daily_features(
    activities,
    sleep,
    spo2
)

print(
    f"Daily records created: {len(daily)}"
)


# --------------------------------------------------
# FEATURES
# --------------------------------------------------

features = [
    "sleep_hours",
    "steps",
    "avg_hr",
    "activity_minutes",
    "load",
    "spo2",

    # Personal-baseline features
    "sleep_hours_deviation",
    "steps_deviation",
    "avg_hr_deviation",
    "activity_minutes_deviation",
    "load_deviation",
    "spo2_deviation"
]


# Keep only features that actually exist
features = [
    f for f in features
    if f in daily.columns
]

print("\nFeatures used:")
print(features)


# --------------------------------------------------
# CREATE PROXY READINESS TARGET
# --------------------------------------------------
#
# IMPORTANT:
# The Garmin dataset does not contain a true
# readiness label.
#
# Therefore this is a PROTOTYPE proxy target.
#
# It is deliberately based on personal deviation
# rather than fixed universal values.
# --------------------------------------------------

def calculate_readiness(row):

    score = 70.0

    # ----------------------------------------------
    # SLEEP
    # ----------------------------------------------

    sleep_dev = row.get(
        "sleep_hours_deviation",
        np.nan
    )

    if pd.notna(sleep_dev):

        if sleep_dev >= -0.05:
            score += 10

        elif sleep_dev >= -0.15:
            score += 3

        elif sleep_dev <= -0.30:
            score -= 20

        elif sleep_dev <= -0.15:
            score -= 10

    # ----------------------------------------------
    # RECENT WORKLOAD
    # ----------------------------------------------

    load_dev = row.get(
        "load_deviation",
        np.nan
    )

    if pd.notna(load_dev):

        if load_dev > 0.50:
            score -= 15

        elif load_dev > 0.25:
            score -= 7

        elif load_dev < -0.50:
            score += 3

    # ----------------------------------------------
    # ACTIVITY
    # ----------------------------------------------

    activity_dev = row.get(
        "activity_minutes_deviation",
        np.nan
    )

    if pd.notna(activity_dev):

        if activity_dev > 1.00:
            score -= 5

    # ----------------------------------------------
    # HEART RATE RESPONSE
    # ----------------------------------------------
    #
    # This is NOT resting HR.
    # It is average activity HR.
    #
    # We therefore only use unusual increases,
    # rather than assuming a lower HR is always
    # better.
    # ----------------------------------------------

    hr_dev = row.get(
        "avg_hr_deviation",
        np.nan
    )

    if pd.notna(hr_dev):

        if hr_dev > 0.15:
            score -= 5

    # ----------------------------------------------
    # SPO2
    # ----------------------------------------------

    spo2 = row.get(
        "spo2",
        np.nan
    )

    if pd.notna(spo2):

        if spo2 >= 95:
            score += 2

        elif spo2 < 92:
            score -= 5

    return float(
        np.clip(score, 0, 100)
    )


daily["readiness_target"] = daily.apply(
    calculate_readiness,
    axis=1
)


# --------------------------------------------------
# REMOVE ROWS WITHOUT TARGET/FEATURE DATA
# --------------------------------------------------

model_data = daily[
    features + ["readiness_target"]
].dropna(
    subset=["readiness_target"]
)

# Fill missing feature values using medians
for feature in features:
    model_data[feature] = (
        model_data[feature]
        .fillna(model_data[feature].median())
    )


print(
    f"\nTraining rows: {len(model_data)}"
)


# --------------------------------------------------
# TRAIN / TEST SPLIT
# --------------------------------------------------

X = model_data[features]
y = model_data["readiness_target"]

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.20,
    random_state=42
)


# --------------------------------------------------
# TRAIN RANDOM FOREST
# --------------------------------------------------

print("\nTraining Random Forest...")

model = RandomForestRegressor(
    n_estimators=300,
    max_depth=10,
    random_state=42,
    n_jobs=-1
)

model.fit(
    X_train,
    y_train
)


# --------------------------------------------------
# EVALUATE
# --------------------------------------------------

predictions = model.predict(X_test)

mae = mean_absolute_error(
    y_test,
    predictions
)

r2 = r2_score(
    y_test,
    predictions
)


print("\nMODEL RESULTS")
print("--------------------")
print(
    f"MAE: {mae:.2f}"
)
print(
    f"R²: {r2:.2f}"
)


# --------------------------------------------------
# FEATURE IMPORTANCE
# --------------------------------------------------

importance = pd.Series(
    model.feature_importances_,
    index=features
).sort_values(
    ascending=False
)

print("\nFEATURE IMPORTANCE")
print("--------------------")
print(importance)


# --------------------------------------------------
# SAVE MODEL
# --------------------------------------------------

os.makedirs(
    MODEL_DIR,
    exist_ok=True
)

os.makedirs(
    OUTPUT_DIR,
    exist_ok=True
)

# Save the medians used to fill missing feature values.
# readiness.py needs these when making predictions
# for new users/days.

medians = {}

for feature in features:
    medians[feature] = model_data[feature].median()


joblib.dump(
    {
        "model": model,
        "features": features,
        "medians": medians
    },
    MODEL_PATH
)

daily.to_csv(
    FEATURE_OUTPUT,
    index=False
)


print("\nSaved model:")
print(MODEL_PATH)

print("\nSaved daily features:")
print(FEATURE_OUTPUT)