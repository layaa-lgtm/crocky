# Score-free readiness demo update

Apply these files to the Crocky_Readiness_Integrated version from the previous
delivery. These are individual code files, not a replacement project ZIP.

## Replace in the project root

- app.js
- index.html
- style.css
- readiness_adapter.py

## Add

- readiness_demo.js, in the project root
- tests/test_demo_scenarios.py
- tests/test_readiness_demo.cjs
- README_DEMO_UPDATE.md, this guide

The five runtime files must be applied together. index.html loads the new
readiness_demo.js before app.js. Existing ai_service.py already provides the
/api/readiness route; the model, readiness_history.json, requirements and all
other files from the previous delivery are reused.

Restart `python run_local.py` after replacing the files. Open
http://127.0.0.1:8000 and refresh the page to load the new scripts.

## User experience

Readiness scores and bands are never displayed. On a selected demonstration
day, an inline suggestion appears under today's task:

"Demo: Take it a little easier today"

"The sample sleep and recent activity data suggest a gentler session may suit
you better."

The user can choose an easier task or keep the planned task. Accepting an
alternative follows the existing actual-time and completion workflow. The
message clearly identifies the data as sample data, not live tracking. On
normal days the task appears without a readiness callout. No modal interrupts
the user, and no manual tracker-data form is required.

## Randomization and frequency

At the start of an app week, readiness_demo.js randomly chooses ONE or TWO
slots among that week's expected goal-day visits. If there is only one planned
goal day, it chooses one slot. The schedule is saved in existing localStorage,
under readinessDemoWeeks, and is reused after refreshing or reopening the app.

A goal day is counted once. Rest days, bonus days and completed tasks do not
trigger suggestions. Automatic appearances are capped at two per seven-day app
week. The appearance is saved as soon as it is displayed, so a reload does not
show it again, even before the user makes a choice. Accepting or keeping a task
also persists a decision. Task regeneration cannot re-trigger that day's
automatic message. A new app week gets a new randomized schedule.

These are eligible goal-day slots, not fixed calendar dates. If a user does not
reach all scheduled slots or skips a task, fewer suggestions may appear. The
schedule follows the prototype's weekNumber/currentDay, not calendar weeks.
Clearing browser storage starts a new demonstration and resets the schedule.

Only the appearance schedule is randomized. Model scores, alternatives and
conclusions are not randomized. Selected slots use predefined poor-sleep/heavy-
activity sample measurements, which are passed through the actual supplied
readiness model. The model still determines whether an easier task is warranted.

## Manual scenario previews

The collapsed "Demo scenarios" selector lets you deliberately preview:

- Automatic demo: follows the stored randomized schedule and frequency cap.
- Well recovered: runs the model on the normal mock fixture and keeps the task.
- Poor sleep / heavy recent activity: runs the model on predefined reduced-
  readiness sample data and offers easier options.
- Missing data: explains the missing sample data without offering a task change.

Manual previews are explicitly initiated by the user and do not consume the
automatic appearance budget. They can be revisited to demonstrate the feature,
even after two automatic appearances. The selector returns to Automatic demo
on page reload. Accepting an alternative does not immediately reopen a preview.

The API retains scores internally for inference and testing. The interface
shows only the suggestion, sample-data explanation and task choices.

## Verification

36 Python tests pass, including the original weekly and readiness tests and
four new scenario tests using the real ML model. The Node scheduling checks
verify one/two randomized slots, unique slots, persisted schedules, the hard
two-appearance cap, stored decisions and a fresh week. Browser checks verify
hidden scores, all three scenarios, accepting/keeping tasks, no repeat after
reload and the weekly automatic cap. JavaScript syntax checks pass.

```sh
python -m unittest discover -s tests -v
node tests/test_readiness_demo.cjs
```


## If /api/readiness does not respond

Keep the exact filenames. The runtime layout is:

    crocky-master/
      run_local.py
      ai_service.py
      readiness_adapter.py
      report_adapter.py
      weekly_analysis.py
      readiness_demo.js
      app.js
      index.html
      style.css
      requirements.txt
      fixtures/readiness_history.json
      wellbeing_ai/readiness.py
      wellbeing_ai/models/readiness_model.pkl
      weekly_trend/...

The folder name crocky-master can differ; the files must be together in the
same existing app root. The supplied readiness_adapter.py is imported by name
from ai_service.py, so keep its underscores. The two JavaScript filenames must
match the script tags in index.html.

Additional support files are now provided individually alongside this guide:
ai_service.py, run_local.py, requirements.txt, wellbeing_ai/readiness.py and
fixtures/readiness_history.json. Replace these at their matching paths if the
base project was an older delivery. Keep the existing model binary and the
other weekly-report modules; this update folder is not a standalone project.

From that existing app root, install dependencies and restart the server:

    python -m pip install -r requirements.txt
    python run_local.py

Open http://127.0.0.1:8000 and hard-refresh (Ctrl+F5). The frontend sends POST
requests to http://127.0.0.1:8001/api/readiness. Opening that API URL directly in
a browser sends GET, which is not a readiness request. To check whether the
server is up, open http://127.0.0.1:8001/health.

The latest app.js also reports API errors, an outdated route, and a 15-second
request timeout in the Demo scenarios panel. For HTTP 500, read its displayed
Python error; common causes are a missing adapter/fixture or uninstalled
requirements. Restart the service after replacing Python files: the running
process continues using its old imported code until restarted.

An actual POST to the updated service was verified to return HTTP 200, ML
inference, and two easier alternatives for the poor-sleep demonstration.
