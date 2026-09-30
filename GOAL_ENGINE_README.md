# Crocky – Weekly AI Trend (analysis pipeline + mock data)

Prototype of the **Weekly AI Trend** feature. It finds the single strongest
relationship between a user's exercise and their next-day recovery / sleep /
activity data, and outputs ONE weekly conclusion. **No machine-learning model is
trained**; the pipeline is descriptive statistics + a selection step + templated,
guard-checked language.

## Quick start
```bash
pip install -r requirements.txt
python scripts/generate_mock_data.py                     # (re)creates data/*.csv
python -m weekly_trend --debug                           # weekly card + ranked evidence
python -m weekly_trend --stream data/mock_minute_stream.csv   # recompute ex_* from the logged window
python -m weekly_trend --json outputs/weekly_trend.json  # full result incl. debug block
python -m unittest discover -s tests -v                  # 15 tests
```

## Layout
```
data/mock_week.csv            7 days, one row per day (all 7 Crocky activities appear once)
data/mock_minute_stream.csv   1-minute HR / steps / kcal / SpO2 for the same 7 days
scripts/generate_mock_data.py builds both files; every ex_* value is computed from the stream
weekly_trend/
  config.py        thresholds, activity catalogue, outcome/exposure definitions
  loader.py        validation; derives duration + completion status from the logged window
  window.py        exercise-window slicing + in-window metrics (avg/max HR, steps, kcal, load, min SpO2, 1-min HR recovery)
  features.py      exposures (duration, load, completion) and outcomes; 1-day lag pairing
  associations.py  Spearman, exact permutation p-value, leave-one-out stability
  guard.py         rejects causal wording; requires hedged wording
  narrative.py     headline / explanation / metric lines templates
  pipeline.py      end-to-end: analyze(daily_df) -> WeeklyTrend
tests/test_pipeline.py
```

## How the exercise window is used
`actual_start`–`actual_end` (user-entered) select the minutes of the stream that count as
exercise (`[start, end)` on 1-minute samples). `ex_*` columns come only from those minutes.
Daily totals include the window, so **outside-exercise** activity is derived
(`daily_steps − ex_steps_in_window`, `activity_min − actual_duration_min`) so exercise never "explains itself".

## How the strongest relationship is chosen (no hard-coded conclusion)
1. Exposures on day D: exercise duration, exercise load, session completion (missed = 0).
2. Outcomes on the morning of D+1: resting HR, HRV, sleep, non-exercise steps, non-exercise active minutes, SpO2.
   An outcome is skipped if it varies less than a practical minimum over the week (`min_range` in config).
3. Every exposure × outcome pair gets a lagged Spearman ρ, an exact permutation p-value (n is tiny), and a
   leave-one-out check (drop each pair in turn; sign must never flip).
4. `score = min(|ρ|, weakest leave-one-out |ρ|)`, so a pattern that hinges on one day scores low.
5. Best pair per outcome; the top scorer above `MIN_SCORE` is the primary finding. Others in the same
   family (e.g. resting HR next to HRV) that clear `MIN_SUPPORT_SCORE` and point the same way are supporting.
6. Nothing above threshold -> "No clear exercise-related trend stood out this week."
7. The text is built from templates. `guard.py` raises if any causal wording slips in.
   If the association is in the unfavourable direction, the headline says so ("coincided with a slower recovery trend").

`debug` in the result holds every ranked pair for developers; it is never meant for users.

## Using real data
Provide a daily table with the columns in `config.REQUIRED_COLUMNS`
(and optionally a minute-level stream with `timestamp, hr_bpm, steps, active_kcal, spo2_pct`).
Set `HR_MAX` in `config.py` per user for a better load estimate.

## Caveats
- Seven days is tiny: p-values are descriptive, not confirmatory, and 18 pairs are tested per week.
- The mock outcomes (sleep, resting HR, HRV, active minutes) are hand-authored; the exercise-window,
  steps, kcal, load and SpO2 values are generated from the stream.
