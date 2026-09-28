import numpy as np
import pandas as pd


def clean_activity(df):
    df = df.copy()

    df["timestamp"] = pd.to_datetime(
        df["timestamp"],
        errors="coerce"
    )

    if "duration_sec" in df:
        df.loc[
            (df["duration_sec"] <= 0) |
            (df["duration_sec"] > 4 * 3600),
            "duration_sec"
        ] = np.nan

    for c in [
        "active_kilocalories",
        "steps",
        "distance_m",
        "avg_heart_rate_min",
        "max_heart_rate_min",
        "avg_speed_m_sec",
        "avg_pace_m_km",
        "avg_cadence_min",
    ]:
        if c in df:
            df.loc[df[c] < 0, c] = np.nan

    return df


def clean_spo2(df):
    df = df.copy()

    df["ts_bucket"] = pd.to_datetime(
        df["ts_bucket"],
        errors="coerce"
    )

    return df


def build_daily_features(activities, sleep, spo2):
    """
    Convert Garmin activity, sleep and SpO2 data into
    daily user-level features.

    In addition to activity volume and sleep, this creates
    personalized heart-rate and workout-response features.
    """

    a = clean_activity(activities)

    s = sleep.copy()
    s["timestamp"] = pd.to_datetime(
        s["timestamp"],
        errors="coerce"
    )

    p = clean_spo2(spo2)

    # ---------------------------------------------------------
    # DATE
    # ---------------------------------------------------------

    a["date"] = a["timestamp"].dt.date
    s["date"] = s["timestamp"].dt.date
    p["date"] = p["ts_bucket"].dt.date

    # ---------------------------------------------------------
    # WORKOUT-LEVEL HEART-RATE RESPONSE
    # ---------------------------------------------------------

    # Difference between maximum and average HR.
    #
    # This is NOT HR rise speed.
    # It simply describes how much the workout's peak HR
    # exceeded its average HR.
    a["hr_range"] = (
        a["max_heart_rate_min"]
        - a["avg_heart_rate_min"]
    )

    # Ratio of maximum HR to average HR.
    #
    # Useful as a relative workout-response feature.
    a["hr_peak_ratio"] = (
        a["max_heart_rate_min"]
        / a["avg_heart_rate_min"].replace(0, np.nan)
    )

    # ---------------------------------------------------------
    # DAILY ACTIVITY AGGREGATION
    # ---------------------------------------------------------

    da = a.groupby(
        ["username", "date"]
    ).agg(
        activity_minutes=(
            "duration_sec",
            lambda x: x.sum(min_count=1) / 60
        ),

        active_kcal=(
            "active_kilocalories",
            "sum"
        ),

        steps=(
            "steps",
            "sum"
        ),

        avg_hr=(
            "avg_heart_rate_min",
            "mean"
        ),

        max_hr=(
            "max_heart_rate_min",
            "max"
        ),

        hr_range=(
            "hr_range",
            "mean"
        ),

        hr_peak_ratio=(
            "hr_peak_ratio",
            "mean"
        ),

        distance_m=(
            "distance_m",
            "sum"
        ),

        sessions=(
            "activity_type",
            "count"
        )
    ).reset_index()

    # ---------------------------------------------------------
    # WORKOUT LOAD
    # ---------------------------------------------------------

    # Prototype workload measure.
    #
    # Longer sessions and higher activity HR
    # produce greater load.
    da["load"] = (
        da["activity_minutes"].fillna(0)
        * da["avg_hr"].fillna(0).clip(lower=60)
        / 100
    )

    # ---------------------------------------------------------
    # SLEEP
    # ---------------------------------------------------------

    ds = s.groupby(
        ["username", "date"]
    ).agg(
        sleep_hours=(
            "total_duration_sec",
            lambda x: x.sum(min_count=1) / 3600
        )
    ).reset_index()

    # ---------------------------------------------------------
    # SPO2
    # ---------------------------------------------------------

    dp = p.groupby(
        ["username", "date"]
    ).agg(
        spo2=(
            "spo2_avg",
            "mean"
        )
    ).reset_index()

    # ---------------------------------------------------------
    # COMBINE
    # ---------------------------------------------------------

    out = (
        da
        .merge(
            ds,
            on=["username", "date"],
            how="outer"
        )
        .merge(
            dp,
            on=["username", "date"],
            how="outer"
        )
    )

    out = out.sort_values(
        ["username", "date"]
    ).reset_index(drop=True)

    # ---------------------------------------------------------
    # PERSONAL BASELINES
    # ---------------------------------------------------------

    baseline_columns = [
        "sleep_hours",
        "steps",
        "avg_hr",
        "max_hr",
        "hr_range",
        "hr_peak_ratio",
        "activity_minutes",
        "load",
        "spo2"
    ]

    for column in baseline_columns:

        out[f"{column}_baseline"] = (
            out.groupby("username")[column]
            .transform(
                lambda x:
                x.shift(1)
                .rolling(
                    window=7,
                    min_periods=3
                )
                .median()
            )
        )

    # ---------------------------------------------------------
    # DEVIATIONS FROM PERSONAL BASELINE
    # ---------------------------------------------------------

    for column in baseline_columns:

        baseline = out[
            f"{column}_baseline"
        ]

        out[f"{column}_deviation"] = (
            (
                out[column] - baseline
            )
            /
            baseline.replace(
                0,
                np.nan
            )
        )

    # ---------------------------------------------------------
    # WORKOUT RESPONSE CLASSIFICATION
    # ---------------------------------------------------------

    # These labels are relative to the user's own recent
    # activity history.
    #
    # They are NOT medical classifications.

    def classify_response(deviation):

        if pd.isna(deviation):
            return "unknown"

        if deviation >= 0.15:
            return "high"

        if deviation <= -0.15:
            return "low"

        return "normal"

    out["hr_response"] = (
        out["avg_hr_deviation"]
        .apply(classify_response)
    )

    out["load_response"] = (
        out["load_deviation"]
        .apply(classify_response)
    )

    # ---------------------------------------------------------
    # OVERALL WORKOUT RESPONSE SCORE
    # ---------------------------------------------------------

    # Positive = workout response was higher than usual.
    # Negative = lower than usual.
    #
    # This is used as a prototype adaptation signal.

    out["workout_response_score"] = (
        out["avg_hr_deviation"].fillna(0) * 0.50
        +
        out["load_deviation"].fillna(0) * 0.35
        +
        out["hr_range_deviation"].fillna(0) * 0.15
    )

    return out