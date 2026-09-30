"""End-to-end weekly analysis. No model training: descriptive statistics + selection."""
from __future__ import annotations

import pandas as pd

from . import config as C
from .associations import evaluate_all_pairs
from .features import build_feature_frame
from .loader import load_daily
from .narrative import WeeklyTrend, build_no_pattern, build_pattern
from .window import attach_window_metrics, load_stream


def analyze(daily: pd.DataFrame) -> WeeklyTrend:
    """`daily` must already be loaded via loader.load_daily (optionally with window metrics)."""
    df = build_feature_frame(daily)
    results = evaluate_all_pairs(df)

    # Best exposure per outcome, so one outcome can't appear three times.
    best = {}
    for r in results:                       # results are sorted best-first
        best.setdefault(r.outcome, r)

    eligible = [r for r in best.values() if r.n >= C.MIN_PAIRS and r.score >= C.MIN_SCORE]
    if not eligible:
        return build_no_pattern(df, results)

    primary = max(eligible, key=lambda r: (r.score, abs(r.rho), -r.p_value))
    supporting = [r for r in best.values()
                  if r is not primary and r.family == primary.family
                  and r.favorable == primary.favorable and r.score >= C.MIN_SUPPORT_SCORE]
    return build_pattern(df, primary, supporting, results)


def analyze_files(daily_csv: str, stream_csv: str | None = None) -> WeeklyTrend:
    daily = load_daily(daily_csv)
    if stream_csv:
        daily = attach_window_metrics(daily, load_stream(stream_csv))
    return analyze(daily)
