"""Exercise-window slicing.

The user's logged start/end tells us WHICH minutes of the wearable stream are
exercise. Everything `ex_*` is computed only from those minutes.
Window convention: [start, end) on 1-minute samples, so 07:12-07:31 = 19 rows.
"""
from __future__ import annotations

import numpy as np
import pandas as pd

from . import config as C


def load_stream(path) -> pd.DataFrame:
    s = pd.read_csv(path, parse_dates=["timestamp"])
    return s.sort_values("timestamp").reset_index(drop=True)


def _bounds(date, start: str, end: str):
    day = pd.Timestamp(date).strftime("%Y-%m-%d")
    return pd.Timestamp(f"{day} {start}"), pd.Timestamp(f"{day} {end}")


def slice_window(stream: pd.DataFrame, date, start: str, end: str) -> pd.DataFrame:
    t0, t1 = _bounds(date, start, end)
    return stream[(stream["timestamp"] >= t0) & (stream["timestamp"] < t1)]


def trimp_load(hr: np.ndarray, rest_hr: float, hr_max: float = C.HR_MAX,
               scale: float = C.LOAD_SCALE) -> float:
    """Banister-style TRIMP per minute, summed over the window, scaled to friendly units."""
    frac = np.clip((np.asarray(hr, float) - rest_hr) / (hr_max - rest_hr), 0, 1)
    return float(np.sum(frac * 0.64 * np.exp(1.92 * frac)) * scale)


def window_metrics(stream: pd.DataFrame, date, start: str, end: str, rest_hr: float) -> dict:
    win = slice_window(stream, date, start, end)
    if win.empty:
        raise ValueError(f"No stream samples inside window {date} {start}-{end}")
    t0, t1 = _bounds(date, start, end)
    expected = int((t1 - t0).total_seconds() // 60)
    if len(win) != expected:
        raise ValueError(f"Stream has {len(win)} samples in window, expected {expected}")

    last = stream[stream["timestamp"] == t1 - pd.Timedelta(minutes=1)]["hr_bpm"]
    after = stream[stream["timestamp"] == t1]["hr_bpm"]
    hrr = float(last.iloc[0] - after.iloc[0]) if len(last) and len(after) else np.nan

    return {
        "ex_avg_hr_bpm": float(win["hr_bpm"].mean()),
        "ex_max_hr_bpm": float(win["hr_bpm"].max()),
        "ex_steps_in_window": int(win["steps"].sum()),
        "ex_active_kcal": float(win["active_kcal"].sum()),
        "ex_load": trimp_load(win["hr_bpm"].to_numpy(), rest_hr),
        "ex_min_spo2_pct": float(win["spo2_pct"].min()),
        "ex_hr_recovery_1min_bpm": hrr,
    }


def attach_window_metrics(daily: pd.DataFrame, stream: pd.DataFrame) -> pd.DataFrame:
    """Recompute every ex_* column from the raw stream using the logged windows."""
    df = daily.copy()
    for i, row in df.iterrows():
        if row["actual_duration_min"] == 0:
            for col in ("ex_avg_hr_bpm", "ex_max_hr_bpm", "ex_steps_in_window", "ex_active_kcal",
                        "ex_load", "ex_min_spo2_pct", "ex_hr_recovery_1min_bpm"):
                df.loc[i, col] = np.nan
            continue
        m = window_metrics(stream, row["date"], row["actual_start"], row["actual_end"],
                           row["resting_hr_bpm"])
        for k, v in m.items():
            df.loc[i, k] = v
    return df
