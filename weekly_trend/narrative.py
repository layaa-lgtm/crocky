"""Turn the selected evidence into the weekly card. Templates only, then a language guard."""
from __future__ import annotations

from dataclasses import dataclass, field

import numpy as np

from . import config as C
from .guard import assert_safe_language

HEADLINES = {
    ("recovery", True): "Consistent exercise was associated with improved recovery this week.",
    ("recovery", False): "Exercise this week coincided with a slower recovery trend.",
    ("sleep", True): "Consistent exercise coincided with longer sleep this week.",
    ("sleep", False): "Longer or harder sessions coincided with shorter sleep this week.",
    ("activity", True): "Exercise days were associated with higher overall activity this week.",
    ("activity", False): "Exercise days coincided with less activity outside workouts this week.",
    ("oxygen", True): "Consistent exercise coincided with slightly higher blood-oxygen readings this week.",
    ("oxygen", False): "Exercise days coincided with slightly lower blood-oxygen readings this week.",
}
NO_PATTERN_HEADLINE = "No clear exercise-related trend stood out this week."
CAVEAT = "Based on 7 days of data: this shows an association, not a cause."


@dataclass
class WeeklyTrend:
    kind: str                       # "pattern" | "no_clear_pattern"
    headline: str
    explanation: str
    metrics: list[str]
    data_used: str
    caveat: str = CAVEAT
    debug: dict = field(default_factory=dict)   # never shown to the user


def _fmt(v: float, decimals: int) -> str:
    return f"{v:,.{decimals}f}"


def _sessions_sentence(df) -> tuple[str, int, int, int, int]:
    n = len(df)
    st = df["completion_status"].value_counts()
    completed, short, missed = int(st.get("completed", 0)), int(st.get("shortened", 0)), int(st.get("missed", 0))
    extras = []
    if short:
        extras.append(f"{short} shortened")
    if missed:
        extras.append(f"{missed} missed")
    tail = f", with {' and '.join(extras)}" if extras else ""
    return f"You completed {completed} of {n} planned sessions{tail}.", completed, short, missed, n


def _strength(score: float) -> str:
    if score >= C.STRENGTH_CONSISTENT:
        return "consistent"
    if score >= C.STRENGTH_MODERATE:
        return "moderate"
    return "tentative"


def find_gap_dip(df, outcome_col: str, favorable: str):
    """Look for a worse-than-usual next-morning reading after a missed/shortened session,
    followed by a rebound. Returns the session status ('missed'/'shortened') or None."""
    y = df[outcome_col].to_numpy(float)
    typical = float(np.median(np.abs(np.diff(y))))
    if typical == 0:
        return None
    sgn = 1.0 if favorable == "up" else -1.0        # sgn * change > 0 means "better"
    best, best_mag = None, 0.0
    for i, status in enumerate(df["completion_status"]):
        if status not in ("missed", "shortened") or i + 2 >= len(y):
            continue
        worse = -sgn * (y[i + 1] - y[i])
        rebound = sgn * (y[i + 2] - y[i + 1])
        if worse >= typical and rebound > 0 and worse > best_mag:
            best, best_mag = status, worse
    return best


def build_no_pattern(df, results) -> WeeklyTrend:
    sess, *_ = _sessions_sentence(df)
    text = (f"{sess} No relationship between exercise and your recovery, sleep or activity data "
            "stood out consistently enough to report this week.")
    completed = int((df["completion_status"] == "completed").sum())
    return WeeklyTrend(
        kind="no_clear_pattern", headline=NO_PATTERN_HEADLINE,
        explanation=text,
        metrics=[f"Planned sessions completed: {completed}/{len(df)}"],
        data_used="Exercise timing • Sleep • Resting HR • HRV • Activity",
        debug={"pairs": [r.to_dict() for r in results[:10]]},
    )


def build_pattern(df, primary, supporting, results) -> WeeklyTrend:
    ex = next(e for e in C.EXPOSURES if e.key == primary.exposure)
    outs = {o.key: o for o in C.OUTCOMES}
    shown = [primary] + supporting
    shown_specs = sorted((outs[r.outcome] for r in shown), key=lambda o: C.OUTCOMES.index(o))
    labels = " and ".join(o.label for o in shown_specs)

    headline = HEADLINES[(primary.family, primary.favorable)]
    sess, completed, short, missed, n = _sessions_sentence(df)

    short_labels = " and ".join(o.short for o in shown_specs)
    lead = f"This week's data suggests a {_strength(primary.score)} pattern: {ex.phrase[0].lower() + ex.phrase[1:]}"
    if primary.family == "recovery" and primary.favorable:
        rel = f"{lead} tended to be followed by better next-morning recovery readings ({short_labels})."
    else:
        direction = "higher" if primary.rho > 0 else "lower"
        rel = f"{lead} tended to be followed by {direction} next-morning {labels}."

    sentences = [sess, rel]

    # Optional context sentences ------------------------------------------------
    p_spec = outs[primary.outcome]
    dip = find_gap_dip(df, p_spec.column, p_spec.favorable)
    if dip:
        sentences.append(f"{p_spec.short} dipped after the {dip} session and rebounded once sessions resumed.")

    sleep_res = next((r for r in results if r.outcome == "sleep"), None)
    sleep_col = df["sleep_hrs_prev_night"]
    sleep_stable = (primary.family != "sleep"
                    and (sleep_col.max() - sleep_col.min()) <= C.SLEEP_STABLE_RANGE_HRS
                    and (sleep_res is None or sleep_res.score < C.MIN_SUPPORT_SCORE))

    # Quantified lines -------------------------------------------------------------
    metrics = []
    for o in shown_specs:
        first, last = df[o.column].iloc[0], df[o.column].iloc[-1]
        metrics.append(f"{o.short}: {_fmt(first, o.decimals)} → {_fmt(last, o.decimals)} {o.unit}")
    metrics.append(f"Planned sessions completed: {completed}/{n}"
                   + (f" ({short} shortened" + (f", {missed} missed)" if missed else ")") if short
                      else (f" ({missed} missed)" if missed else "")))
    if sleep_stable:
        metrics.append(f"Sleep: stable ({sleep_col.min():.1f}–{sleep_col.max():.1f} hrs)")
    done = df[df["actual_duration_min"] > 0]
    if len(done) >= 2:
        metrics.append(f"Session length: {int(done['actual_duration_min'].iloc[0])} → "
                       f"{int(done['actual_duration_min'].iloc[-1])} min")

    used = ["Exercise timing", ex.data_label] + [o.short for o in shown_specs]
    if sleep_stable:
        used.append("Sleep")
    data_used = " • ".join(dict.fromkeys(used))

    explanation = " ".join(sentences)
    assert_safe_language(headline + " " + explanation)
    return WeeklyTrend(
        kind="pattern", headline=headline, explanation=explanation, metrics=metrics[:5],
        data_used=data_used,
        debug={"primary": primary.to_dict(),
               "supporting": [r.to_dict() for r in supporting],
               "all_pairs_ranked": [r.to_dict() for r in results]},
    )


def render_card(t: WeeklyTrend) -> str:
    lines = ["WEEKLY AI TREND", "", f"\"{t.headline}\"", "", f"\"{t.explanation}\"", ""]
    lines += t.metrics
    lines += ["", f"Data used: {t.data_used}", "", f"({t.caveat})"]
    return "\n".join(lines)
