import sys
import unittest
from pathlib import Path

import numpy as np

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from weekly_trend.guard import assert_safe_language
from weekly_trend.loader import load_daily
from weekly_trend.pipeline import analyze
from weekly_trend.window import attach_window_metrics, load_stream, window_metrics

DAILY = ROOT / "data" / "mock_week.csv"
STREAM = ROOT / "data" / "mock_minute_stream.csv"

ALL_ACTIVITIES = {"Brisk walking", "Low impact step jacks", "Low impact side-steps",
                  "Light dancing", "Jogging", "Low impact knee lifts", "High knees"}


class TestData(unittest.TestCase):
    def setUp(self):
        self.daily = load_daily(DAILY)

    def test_seven_consecutive_days_and_all_activities_present(self):
        self.assertEqual(len(self.daily), 7)
        self.assertEqual(set(self.daily["planned_exercise"]), ALL_ACTIVITIES)

    def test_status_counts(self):
        st = self.daily["completion_status"].value_counts().to_dict()
        self.assertEqual(st, {"completed": 5, "shortened": 1, "missed": 1})

    def test_ex_columns_match_stream_window(self):
        stream = load_stream(STREAM)
        recomputed = attach_window_metrics(self.daily, stream)
        ex = self.daily["actual_duration_min"] > 0
        for col, tol in [("ex_avg_hr_bpm", 0.51), ("ex_max_hr_bpm", 0.51), ("ex_steps_in_window", 0),
                         ("ex_active_kcal", 0.51), ("ex_load", 0.51), ("ex_hr_recovery_1min_bpm", 0.51)]:
            diff = (recomputed.loc[ex, col].astype(float) - self.daily.loc[ex, col].astype(float)).abs().max()
            self.assertLessEqual(diff, tol, col)

    def test_window_choice_matters(self):
        """Same day, wrong hours -> clearly lower HR and far fewer steps."""
        stream = load_stream(STREAM)
        row = self.daily.iloc[6]  # jogging, 07:08-07:43
        real = window_metrics(stream, row["date"], "07:08", "07:43", row["resting_hr_bpm"])
        wrong = window_metrics(stream, row["date"], "13:00", "13:35", row["resting_hr_bpm"])
        self.assertGreater(real["ex_avg_hr_bpm"] - wrong["ex_avg_hr_bpm"], 20)
        self.assertGreater(real["ex_steps_in_window"], 3 * wrong["ex_steps_in_window"])

    def test_bad_window_rejected(self):
        bad = self.daily.copy()
        bad.loc[0, "actual_end"] = "07:00"
        with self.assertRaises(ValueError):
            load_daily(bad)


class TestPipeline(unittest.TestCase):
    def setUp(self):
        self.daily = load_daily(DAILY)

    def test_recovery_pattern_selected(self):
        t = analyze(self.daily)
        self.assertEqual(t.kind, "pattern")
        self.assertEqual(t.headline, "Consistent exercise was associated with improved recovery this week.")
        self.assertEqual(t.debug["primary"]["outcome"], "hrv")
        outs = {p["outcome"] for p in t.debug["supporting"]}
        self.assertIn("resting_hr", outs)

    def test_metrics_are_real_values(self):
        t = analyze(self.daily)
        self.assertIn("Resting HR: 69 → 64 bpm", t.metrics)
        self.assertIn("HRV: 40 → 46 ms", t.metrics)
        self.assertIn("Planned sessions completed: 5/7 (1 shortened, 1 missed)", t.metrics)

    def test_sleep_not_forced(self):
        t = analyze(self.daily)
        self.assertNotIn("sleep", t.headline.lower())
        self.assertNotEqual(t.debug["primary"]["outcome"], "sleep")

    def test_no_causal_language(self):
        t = analyze(self.daily)
        text = f"{t.headline} {t.explanation}".lower()
        for bad in ("caused", "because", "definitely", "led to", "proves"):
            self.assertNotIn(bad, text)

    def test_flat_outcomes_give_no_clear_pattern(self):
        flat = self.daily.copy()
        for c in ("sleep_hrs_prev_night", "resting_hr_bpm", "hrv_rmssd_ms", "daily_avg_spo2_pct"):
            flat[c] = flat[c].iloc[0]
        flat["daily_steps"] = flat["ex_steps_in_window"].fillna(0) + 4500
        flat["activity_min"] = flat["actual_duration_min"] + 20
        t = analyze(flat)
        self.assertEqual(t.kind, "no_clear_pattern")

    def test_reversed_outcomes_are_reported_as_unfavourable_not_improved(self):
        rev = self.daily.copy()
        rev["resting_hr_bpm"] = 133 - rev["resting_hr_bpm"]      # flips direction
        rev["hrv_rmssd_ms"] = 86 - rev["hrv_rmssd_ms"]
        t = analyze(rev)
        self.assertNotIn("improved", t.headline)

    def test_too_few_days_rejected(self):
        with self.assertRaises(ValueError):
            load_daily(self.daily.head(4))


class TestGuard(unittest.TestCase):
    def test_rejects_causal(self):
        with self.assertRaises(ValueError):
            assert_safe_language("Exercise caused your sleep to improve.")

    def test_requires_hedge(self):
        with self.assertRaises(ValueError):
            assert_safe_language("Your resting heart rate went down.")

    def test_accepts_hedged(self):
        assert_safe_language("Exercise was associated with lower resting heart rate.")


if __name__ == "__main__":
    unittest.main()
