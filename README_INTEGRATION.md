# Crocky: two separate weekly analyses

## Run locally

Use Python 3.11 or newer. From this extracted folder:

```sh
python -m pip install -r requirements.txt
python run_local.py
```

Open http://127.0.0.1:8000. Stop older Crocky services on ports 8000/8001 before
starting this version. No API key, database, cloud, or external AI is required.
Dependency installation needs internet once; reports run locally afterward.
The root index.html is the active Crocky prototype. The older frontend/ folder
is retained as supplied and is not the entry point for this integration.

## Changed files

- app.js: stores actual completed/tried session records in existing localStorage;
  validates same-day time intervals; calls the report API and renders its objects.
- index.html: report labels and accessible structured-result containers.
- ai_service.py: adds /api/weekly-report to the existing HTTP service; preserves
  /api/goals and loads its original planner when requested.

## Added files

- weekly_analysis.py: independent general wellbeing comparison.
- report_adapter.py: fixture, input, wearable-window and presentation adapter.
- weekly_trend/*.py: all 11 supplied goal-AI modules copied without modification.
- fixtures/mock_week.json and mock_minute_stream.json: converted supplied CSVs.
- run_local.py and requirements.txt: local launch and dependencies.
- tests/test_integration.py: eight integration tests.
- tests/test_pipeline.py and data/*.csv: original 15 tests and their development
  fixtures. These CSVs are not runtime dependencies.
- GOAL_ENGINE_README.md: original engine documentation.
- README_INTEGRATION.md: this guide.

The trained readiness-model binaries, exercise catalogue, unrelated screens and assets
remain unchanged. See README_READINESS.md for the new readiness inference and task UI. No second goal algorithm was created.

## Weekly Analysis: overall wellbeing changes

It compares sleep, resting HR, HRV, steps and active minutes using actual available
numbers, requiring three readings per metric per comparison period. When a
previous-week dataset is supplied to the API it compares weekly averages.
Without that baseline, the UI explicitly compares the first three and last three
days of the supplied seven-day fixture. It reports the strongest meaningful
change, supporting averages and counts. Stable or insufficient data gets an
explicit message. It does not inspect exercise-window relationships.

## Goal-Specific Analysis: activity-window relationships

The existing public analyze(daily_df) entry point remains the source of truth.
The adapter calls the original loader and window_metrics functions, then the
unchanged engine. Every ex_* value is cleared and recomputed from the selected
timestamped minutes, never copied from a daily average. The original engine
pairs day-D duration/load/completion with day-D+1 outcomes; ranks relationships
using Spearman correlation and leave-one-out stability; requires at least five
lagged pairs; and selects one strongest relationship with related supporting
evidence. It preserves cautious language and reports no clear pattern when
thresholds are not met. The original result, including debug evidence, is
retained in the API's goal.original object; the UI does not display debug data.

The supplied engine analyzes window-derived load and duration, rather than
testing morning versus afternoon as separate statistical categories. Integration
preserves that behavior. A changed interval changes which wearable samples are
used, but need not change the strongest conclusion. No next-week focus is
invented: the supplied engine does not produce one.

## Actual-time flow and mock data

Choose Completed on a goal, enter the actual start/end, and save. The session
stores week/day, goal ID/title/category, planned duration, completion status,
and normalized HH:MM start/end. Report requests send the current week's saved
sessions. Editing a completed goal's actual time updates that same day's record.
Old records remain in localStorage across week rollover. Unknown timing in old
saved completions is treated as missing, rather than guessed.

The supplied seven-day table and full 10,080-minute wearable stream are converted
to JSON and loaded automatically. Dates shift together so the final day is the
browser's current local date. The preceding six days provide labeled mock
history, and current/past logged app days override the corresponding fixture
sessions. Today's historical fixture interval is removed: only an entered,
completed/tried session supplies today's interval. Saved rest/missed/pending
days supersede historical sessions. Mock measurements are never regenerated
when a user changes time; only the slice changes.

Both cards appear in the existing Progress & Weekly Report, in this order:
Weekly Analysis, then Goal-Specific Analysis. Streak, balance and daily log
remain. The cards label the mock-data source. The goal card shows the latest
matched interval, sample count, HR and steps so timing changes are visible.
Today's next-morning outcome is unavailable until tomorrow; it is not invented
or included in the last day's lagged pair.

## Missing data and limits

Missing weekly metrics are skipped. Missing session timing, invalid intervals,
absent/incomplete/duplicate wearable samples, missing resting HR, too few days,
and no logged exercise are converted to an insufficient-data result. Missing
HRV/sleep outcomes are excluded according to the original engine's conservative
complete-column requirement. No values are imputed. A stopped service displays
an unavailable message instead of fabricated analysis.

The prototype accepts same-day intervals only. It represents one analyzed
session per app day, consistent with the supplied daily-table engine. Real
device linking remains the existing prototype UI; it does not fetch live device
measurements. The fixture contains differing activities, so the engine reports
aggregate exercise relationships, not unsupported activity-specific findings.
Its fixed HR maximum and tiny seven-day sample remain original limitations.
The model binaries were not retrained. Dependency compatibility and the original
goal planner have now been verified; see README_READINESS.md.

## Validation

```sh
python -m unittest discover -s tests -v
node --check app.js
```

23 tests passed: all 15 original tests plus eight integration tests covering
supported weekly change, exact 15:00-15:30 versus 07:00-07:30 slices, no pattern,
missing wearable data, missing recovery/sleep, missing timing/no sessions,
short datasets, and card order/distinct outputs. Browser verification used the
real report service and existing frontend with a preloaded test goal: Completed
-> actual time -> localStorage -> API -> both cards -> edit time -> changed
sample evidence. No browser script errors occurred. New onboarding/goal
generation was not exercised in that browser test.
