"""Central configuration. Every threshold used by the pipeline lives here."""
from dataclasses import dataclass

# ---------------------------------------------------------------- activities
# Planner catalogue: activity -> typical intensity band (documentation + validation).
ACTIVITY_CATALOG = {
    "Brisk walking": "low-moderate",
    "Low impact step jacks": "low",
    "Low impact side-steps": "low",
    "Light dancing": "low-moderate",
    "Jogging": "moderate-high",
    "Low impact knee lifts": "low",
    "High knees": "high",
}
INTENSITIES = ("low", "moderate", "high")

# ------------------------------------------------------------------- schema
REQUIRED_COLUMNS = [
    "date", "planned_exercise", "planned_duration_min", "planned_intensity",
    "actual_start", "actual_end",
    "sleep_hrs_prev_night", "resting_hr_bpm", "hrv_rmssd_ms",
    "daily_steps", "activity_min", "daily_avg_spo2_pct",
]
WINDOW_COLUMNS = [
    "ex_avg_hr_bpm", "ex_max_hr_bpm", "ex_steps_in_window", "ex_active_kcal",
    "ex_load", "ex_min_spo2_pct", "ex_hr_recovery_1min_bpm",
]
COMPLETED_THRESHOLD = 0.90      # actual/planned >= 0.90 -> "completed"
MIN_DAYS = 5                    # refuse to analyse fewer days than this

# ------------------------------------------------------- exercise-window maths
HR_MAX = 185.0                  # replace with the user's own estimate in the app
LOAD_SCALE = 3.0                # TRIMP-lite -> friendly "load units"
NON_EX_LOAD_STEPS_PER_UNIT = 125.0   # used only by the mock generator

# ------------------------------------------------------- analysis thresholds
MIN_PAIRS = 5                   # minimum lagged (exposure day -> next day) pairs
MIN_SCORE = 0.50                # conservative score needed to report a pattern
MIN_SUPPORT_SCORE = 0.40        # lower bar for supporting evidence in same family
SLEEP_STABLE_RANGE_HRS = 0.8    # max-min sleep range to call sleep "stable"
STRENGTH_CONSISTENT = 0.80
STRENGTH_MODERATE = 0.65


@dataclass(frozen=True)
class OutcomeSpec:
    key: str
    column: str          # column in the feature frame
    label: str           # used in sentences
    short: str           # used in metric lines / "data used"
    unit: str
    family: str
    favorable: str       # "up" or "down": which direction is better for the user
    decimals: int
    min_range: float     # smallest week-long spread (max-min) worth analysing (practical significance)


@dataclass(frozen=True)
class ExposureSpec:
    key: str
    column: str
    phrase: str          # "Days with ..." phrase
    short: str           # noun used in sentences
    data_label: str      # label in the "Data used" line


# Order matters: it is the display order of metric lines.
OUTCOMES = [
    OutcomeSpec("resting_hr", "resting_hr_bpm", "resting heart rate", "Resting HR", "bpm", "recovery", "down", 0, 2.0),
    OutcomeSpec("hrv", "hrv_rmssd_ms", "heart rate variability", "HRV", "ms", "recovery", "up", 0, 3.0),
    OutcomeSpec("sleep", "sleep_hrs_prev_night", "sleep duration", "Sleep", "hrs", "sleep", "up", 1, 0.5),
    OutcomeSpec("non_ex_steps", "non_ex_steps", "non-exercise steps", "Non-exercise steps", "steps", "activity", "up", 0, 500.0),
    OutcomeSpec("non_ex_activity", "non_ex_activity_min", "non-exercise active minutes", "Non-exercise activity", "min", "activity", "up", 0, 5.0),
    OutcomeSpec("spo2", "daily_avg_spo2_pct", "average SpO2", "SpO2", "%", "oxygen", "up", 1, 1.0),
]

EXPOSURES = [
    ExposureSpec("duration", "actual_duration_min", "Days with longer sessions", "duration", "Exercise duration"),
    ExposureSpec("load", "ex_load", "Days with a higher exercise load", "load", "Exercise load"),
    ExposureSpec("completion", "completion_ratio", "Days when more of the planned session was completed", "consistency", "Session completion"),
]
