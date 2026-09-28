import joblib
import numpy as np
import pandas as pd
from pathlib import Path


MODEL_PATH = Path(__file__).parent / "models" / "readiness_model.pkl"


def _load_model():
    if not MODEL_PATH.exists():
        return None

    return joblib.load(MODEL_PATH)


def _rule_based_readiness(data):
    """
    Fallback readiness calculation used when the ML model
    is unavailable.
    """

    score = 50.0

    # Sleep
    sleep = data.get("sleep_hours")

    if sleep is not None:
        if sleep < 5:
            score -= 25
        elif sleep < 6:
            score -= 18
        elif sleep < 7:
            score -= 8
        elif sleep <= 9:
            score += 10
        elif sleep <= 10:
            score += 5

    # Steps
    steps = data.get("steps")

    if steps is not None:
        if steps < 2500:
            score -= 8
        elif steps < 5000:
            score -= 3
        elif steps <= 10000:
            score += 5
        elif steps <= 15000:
            score += 0
        else:
            score -= 5

    # Resting heart rate
    rhr = data.get("resting_heart_rate")
    baseline_rhr = data.get("baseline_resting_heart_rate", rhr)

    if rhr is not None and baseline_rhr is not None:
        difference = rhr - baseline_rhr

        if difference <= -5:
            score += 5
        elif difference <= 2:
            score += 3
        elif difference <= 5:
            score -= 5
        elif difference <= 10:
            score -= 12
        else:
            score -= 20

    # Recent load
    load7 = data.get("load_7d")
    baseline_load = data.get(
        "baseline_load_7d",
        load7
    )

    if (
        load7 is not None
        and baseline_load is not None
        and baseline_load > 0
    ):
        ratio = load7 / baseline_load

        if ratio <= 1:
            score += 0
        elif ratio <= 1.2:
            score -= 3
        elif ratio <= 1.5:
            score -= 8
        else:
            score -= 15

    # Optional energy
    energy = data.get("energy")

    if energy is not None:
        if energy >= 70:
            score += 8
        elif energy < 30:
            score -= 8

    # Optional SpO2
    spo2 = data.get("spo2")

    if spo2 is not None:
        if spo2 >= 95:
            score += 2
        elif spo2 < 92:
            score -= 5

    score = float(np.clip(score, 0, 100))

    if score >= 70:
        band = "high"
    elif score >= 45:
        band = "moderate"
    else:
        band = "low"

    return {
        "readiness_score": round(score, 1),
        "readiness_band": band,
        "method": "rule_based"
    }


def _ml_readiness(data):
    package = _load_model()

    if package is None:
        return None

    model = package["model"]
    features = package["features"]
    medians = package["medians"]

    row = {}

    for feature in features:

        if feature == "sleep_hours":
            value = data.get("sleep_hours")

        elif feature == "energy":
            value = data.get("energy")

        elif feature == "steps":
            value = data.get("steps")

        elif feature == "avg_hr":
            value = data.get(
                "avg_hr",
                data.get("resting_heart_rate")
            )

        elif feature == "activity_minutes":
            value = data.get("activity_minutes")

        elif feature == "load":
            value = data.get(
                "load",
                data.get("load_7d")
            )

        elif feature == "spo2":
            value = data.get("spo2")

        else:
            value = None

        if value is None:
            value = medians.get(feature, 0)

        row[feature] = value

    input_df = pd.DataFrame(
        [row],
        columns=features
    )

    prediction = model.predict(input_df)[0]

    prediction = float(
        np.clip(prediction, 0, 100)
    )

    if prediction >= 70:
        band = "high"
    elif prediction >= 45:
        band = "moderate"
    else:
        band = "low"

    return {
        "readiness_score": round(prediction, 1),
        "readiness_band": band,
        "method": "ml"
    }


def calculate_readiness(data):
    """
    Calculate today's readiness.

    ML is used when the trained model is available.
    Rule-based calculation is used as a fallback.
    """

    try:
        result = _ml_readiness(data)

        if result is not None:
            return result

    except Exception as error:
        print(
            f"ML readiness unavailable: {error}"
        )

    return _rule_based_readiness(data)