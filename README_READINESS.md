# Readiness model and easier alternatives

This version includes the two weekly analyses from the previous delivery and
adds readiness-based alternatives to the current task.

## Run

```sh
python -m pip install -r requirements.txt
python run_local.py
```

Use Python 3.11+ and open http://127.0.0.1:8000. Stop old Crocky services first.
scikit-learn is pinned to 1.9.1, the version recorded in your supplied model.
No retraining, API key, database or external AI service is needed.

## What changed

- wellbeing_ai/readiness.py: loads the existing RandomForest model once; passes
  all 12 trained features, including personal-baseline deviations, to prediction.
  Previously, deviation features were silently replaced with training medians.
  Activity-average HR is no longer substituted with resting HR, and daily load
  is no longer substituted with seven-day load. The trained model file is unchanged.
- readiness_adapter.py: new /api/readiness adapter, measurement validation,
  feature preparation and readiness-to-task selection policy.
- ai_service.py: adds /api/readiness while keeping goals and weekly reports.
- app.js: readiness card, saved day-specific measurements, async inference,
  explicit alternative selection and integration with normal task completion.
- index.html / style.css: readiness card in the existing visual style and
  optional measurement form. Actual exercise-time minute selectors now support
  all 60 minutes, allowing an eight-minute alternative to be logged exactly.
- fixtures/readiness_history.json: local readiness demo fixture.
- requirements.txt: matching scikit-learn version.
- tests/test_readiness.py: nine readiness tests.

## How it works

The readiness card checks the active unresolved task on app load and whenever
the day/task/measurements change. It displays the real model prediction and
offers up to two easier exercises from your existing catalogue in the same
focus category. The user selects an alternative; the application does not
silently change the task.

Task policy uses the model's 0–100 prediction:

| Estimate | Suggested task level |
|---|---|
| Below 60 | Easy, with duration or sets reduced by half, rounded up |
| 60–69.9 | Moderate or easier |
| 70+ | Existing planned level, up to challenging |

Alternatives appear when the assigned difficulty exceeds that level. Below 60,
even an already-easy task gets a shorter option. This policy is separate from
the model; the model predicts readiness, while the catalogue supplies exercises.
The original score bands remain unchanged in the API.

Why not only use the old <45 threshold? The supplied training data's proxy
target spans 45–82. The regression model seldom predicts below 45, so that
threshold would fail to offer gentler sessions for many reduced-readiness days.
The task thresholds above are explicit prototype choices, not validated medical
or performance thresholds. The model is trained on constructed proxy targets,
not independently measured readiness labels.

Accepting an alternative preserves the original task under readinessOriginal,
keeps its goal ID and replaces only the selected task's exercise/difficulty.
It resets any previously entered exercise interval so the alternative's actual
completion time is collected. Completion then stores the selected alternative,
its actual duration and interval in exerciseSessions. The goal-specific weekly
analysis receives that session through the existing integration. Other weekly
goals and both weekly-analysis algorithms are unaffected.

## Data and missing values

The automatic demonstration uses the supplied mock-week measurements. Sleep,
steps, activity minutes and SpO2 are copied; activity-average HR uses the supplied
exercise-window HR as a documented demo approximation. Daily load is calculated
with the existing training formula: active minutes × max(activity HR,60) / 100.
The preceding six mock days supply a demonstration baseline. This does not
connect to a real wearable provider.

The measurement form lets you enter your current tracked data. Checking
"Use demo history for comparison" explicitly combines your entries with the
demo baseline and labels that combination. Uncheck it to use your earlier saved
measurement entries instead. Today's entries are excluded from their own
baseline. At least three earlier readings are required for a metric's baseline,
using the median of up to seven prior entries, matching the training pipeline.
Data is saved per app week/day in localStorage; a new day does not reuse today's
entered measurements as current measurements.

Sleep and at least two other available measurements are required for an
estimate. Blank measurements remain missing. If activity HR and minutes exist,
missing load is derived using the training formula. Missing model features or
baseline deviations use the model's saved training medians; the card explicitly
discloses this. Invalid/out-of-range inputs are rejected. If the model cannot
load, the original rule-based fallback is labeled as a fallback. Already
completed tasks are not changed.

## Verified

32 Python tests pass (the previous 23 plus nine readiness tests). These verify
real RandomForest inference, baseline deviations reaching the model, reduced
readiness alternatives for all six focus categories, shorter easy tasks,
moderate capacity, missing/invalid input, labeled fallback and completed tasks.
The trained model binary is identical to the original ZIP.

Browser verification used the actual model/service: a demo estimate of 82/100;
entered reduced-readiness data returning about 48/100; an offered eight-minute
Brisk walking alternative; accepting it; persistence after reload; completion
at 15:00–15:08; correct session data and wearable interval in the weekly report.
The original /api/goals planner also generated goals successfully. JavaScript
syntax checks passed and the browser reported no script errors.

Example reduced-readiness demo inputs: sleep 3 hours, steps 12,000, average
activity HR 170 bpm, active minutes 150, load 250 and SpO2 94%, with demo
comparison history enabled. These are test inputs, not suggested target values.

Run all tests with `python -m unittest discover -s tests -v`.
