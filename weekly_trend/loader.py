"""Load and validate the daily table. Derives duration/status when missing."""
from __future__ import annotations

import numpy as np
import pandas as pd

from . import config as C


def _minutes(hhmm: str) -> int:
    h, m = hhmm.split(":")
    return int(h) * 60 + int(m)


def load_daily(path_or_df, strict_activities: bool = True) -> pd.DataFrame:
    df = pd.read_csv(path_or_df, dtype={"actual_start": "string", "actual_end": "string"}) \
        if not isinstance(path_or_df, pd.DataFrame) else path_or_df.copy()

    missing = [c for c in C.REQUIRED_COLUMNS if c not in df.columns]
    if missing:
        raise ValueError(f"Missing required columns: {missing}")

    df["date"] = pd.to_datetime(df["date"])
    df = df.sort_values("date").reset_index(drop=True)
    if len(df) < C.MIN_DAYS:
        raise ValueError(f"Need at least {C.MIN_DAYS} days, got {len(df)}")
    gaps = df["date"].diff().dropna().dt.days
    if (gaps != 1).any():
        raise ValueError("Dates must be consecutive (one row per day).")

    if strict_activities:
        unknown = sorted(set(df["planned_exercise"]) - set(C.ACTIVITY_CATALOG))
        if unknown:
            raise ValueError(f"Unknown planned_exercise values: {unknown}")
    bad = sorted(set(df["planned_intensity"]) - set(C.INTENSITIES))
    if bad:
        raise ValueError(f"Unknown planned_intensity values: {bad}")

    # --- exercise window: derive duration from start/end (the user-entered window)
    durations = []
    for s, e in zip(df["actual_start"], df["actual_end"]):
        if pd.isna(s) or pd.isna(e):
            durations.append(0)
            continue
        d = _minutes(e) - _minutes(s)
        if d <= 0:
            raise ValueError(f"Exercise end must be after start (got {s}-{e})")
        durations.append(d)
    df["actual_duration_min"] = durations

    ratio = df["actual_duration_min"] / df["planned_duration_min"]
    if "completion_status" not in df.columns:
        df["completion_status"] = np.select(
            [df["actual_duration_min"] == 0, ratio >= C.COMPLETED_THRESHOLD],
            ["missed", "completed"], default="shortened",
        )

    for col in C.WINDOW_COLUMNS:
        if col not in df.columns:
            df[col] = np.nan
    return df
