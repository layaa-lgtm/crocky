"""Build exposure and outcome columns. Outcomes are read with a 1-day lag."""
from __future__ import annotations

import numpy as np
import pandas as pd

from . import config as C


def build_feature_frame(daily: pd.DataFrame) -> pd.DataFrame:
    df = daily.copy()
    planned = df["planned_duration_min"].astype(float)
    df["completion_ratio"] = np.minimum(df["actual_duration_min"] / planned, 1.0)

    # Missed days are genuine zeros for exposures.
    missed = df["actual_duration_min"] == 0
    for col in ("ex_load", "ex_steps_in_window"):
        df.loc[missed, col] = 0.0

    # Activity OUTSIDE the exercise window, so exercise never "explains" itself.
    if df["ex_steps_in_window"].notna().all():
        df["non_ex_steps"] = df["daily_steps"] - df["ex_steps_in_window"]
    df["non_ex_activity_min"] = (df["activity_min"] - df["actual_duration_min"]).clip(lower=0)
    return df


def usable_exposures(df: pd.DataFrame):
    return [e for e in C.EXPOSURES if e.column in df.columns and df[e.column].notna().all()]


def usable_outcomes(df: pd.DataFrame):
    """Outcome must exist, be complete, and vary enough over the week to matter in practice."""
    return [o for o in C.OUTCOMES
            if o.column in df.columns and df[o.column].notna().all()
            and (df[o.column].max() - df[o.column].min()) >= o.min_range]


def lagged_pair(df: pd.DataFrame, exposure_col: str, outcome_col: str):
    """Exposure on day D  ->  outcome measured on the morning of day D+1."""
    x = df[exposure_col].to_numpy(float)[:-1]
    y = df[outcome_col].to_numpy(float)[1:]
    return x, y
