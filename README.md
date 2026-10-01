ASYNC’26 — Technical README
Project Name
Crocky — An AI-Powered Adaptive Wellness & Lifestyle Companion!

Elevator Pitch & Value Proposition

Most wellness and lifestyle applications are rigid and heavily focused on numerical targets, fixed schedules, daily streaks, and continuous performance. This can be particularly overwhelming for beginners who do not know where to start, what activities are appropriate for them, or how to remain consistent without feeling pressured.

Crocky is an AI-powered adaptive wellness and lifestyle companion designed specifically for beginners. It combines tracked activity data, wearable data, user reflections, flexible weekly planning, and AI-driven analysis to help users build sustainable wellness habits without rigid daily pressure.

The application allows users to choose how many days they want to work toward each week, making rest an intentional part of the routine rather than treating it as a failure.

The core experience combines:
ML-based readiness estimation using tracked user data.
Adaptive AI that uses the readiness score to adjust the difficulty of the user's recommended goal.
General Weekly AI that identifies broad changes across the user's week.

Goal-Specific Weekly AI that examines metrics recorded around the user's actual logged exercise time to identify activity-specific weekly trends.

User reflections and feedback that help the system understand how activities felt to the user.
A compassionate crocodile companion that provides an approachable and beginner-friendly interaction experience.
Flexible weekly goals and rest days instead of rigid daily schedules.

Target Audience
Crocky is designed primarily for beginners who do not know how to start, where to start, or how to stay consistent without pressure.
The application helps answer questions such as:
What should I start with?
How difficult should my activity be?
How many days should I work this week?
Should today's goal be easier based on my recent data?
What has changed in my wellbeing over the week?
Are there any patterns around the activities I have been doing?
What happens if I need a rest day?

Core Features
Adaptive Exercise Planning
The application uses the user's selected goal, intensity, previous performance, feedback, and ML-estimated readiness to determine an appropriate activity.

Flexible Weekly Planning
Users choose how many days they want to work toward each week. Rest days are incorporated into the weekly plan rather than being treated as failures.

User Reflections
After activities, users can provide feedback on how difficult the activity felt. This provides an additional input for future recommendations.

Three AI/ML Components
Crocky's intelligence is divided into distinct components with different responsibilities:
ML Readiness Estimator — calculates a readiness score from tracked data.
Adaptive AI — reads the readiness score and adjusts the recommended goal/difficulty accordingly.
Weekly Analysis AIs — two separate analysis systems provide general weekly trends and goal-specific weekly trends.

Crocodile Companion
Crocky provides a cozy, approachable companion experience designed around flexibility, self-acceptance, and reflection rather than pressure.

Demo Screenshots & Media
Demo Video: https://youtu.be/nPrNrJAtoWE?si=czhcUxtV7MK9DcLN

2. Architecture & System Design
Architecture
Crocky consists of a browser-based frontend, an application/data layer, and a Python-based AI/ML layer.
Frontend
The frontend is implemented using:
HTML
CSS
JavaScript
It handles onboarding, user preferences, weekly planning, daily activity recommendations, activity feedback, and the Progress & Weekly Report interface.
Data Layer
Firebase/Firestore is intended to store user-related information, activity records, feedback, and tracked data.
AI/ML Layer
The AI/ML layer contains separate components for readiness estimation, adaptive planning, and weekly analysis.
ML Readiness Estimator
The readiness estimator is the ML component of the system.
It processes available tracked data such as:
Sleep
Steps
Resting heart rate
Activity duration/load
SpO₂ where available
The model produces a readiness score representing the user's current exercise readiness.
Adaptive AI
The Adaptive AI does not calculate the readiness score itself.
Instead, it receives the readiness score from the ML readiness estimator and uses it as an input when deciding the appropriate difficulty/goal for the user's activity.

For example, a lower readiness score can cause the system to assign an easier goal, while a higher readiness score allows the system to consider a more challenging goal.
The Adaptive AI also considers relevant user context such as:
Selected goal
Preferred intensity
Previous performance
User feedback
Weekly planning constraints
General Weekly AI
The General Weekly AI looks at the user's overall weekly data.
Its purpose is to identify broad trends such as:
Sleep increased over the week.
Step count increased.
Activity consistency changed.
Other tracked metrics changed over the course of the week.
This analysis gives the user a high-level understanding of how their overall week changed.

Goal-Specific Weekly AI
The Goal-Specific Weekly AI is separate from the General Weekly AI.
It focuses on the user's logged exercise time and examines the tracked metrics associated with that period.
For example, if a user logged an activity from 6:00 PM to 6:40 PM, the analysis uses the relevant tracked data around that activity window to identify repeated weekly patterns.
This allows the application to answer questions such as whether a particular activity or activity timing is repeatedly associated with changes in the user's tracked metrics.
The system reports observed patterns rather than treating them as guaranteed cause-and-effect relationships.

Component Interaction
The overall technical interaction is:
User → Frontend → User/Activity Data → ML Readiness Estimator → Readiness Score → Adaptive AI → Daily Goal/Activity
Separately:
Weekly User Data → General Weekly AI → General Weekly Trends
and:
Logged Exercise Time + Corresponding Tracked Metrics → Goal-Specific Weekly AI → Goal-Specific Trends
The two weekly analysis systems therefore serve different purposes and are displayed sequentially in the Progress & Weekly Report:
General Weekly Analysis
Goal-Specific Analysis

End-to-End Execution Flow
Daily Planning
The user provides their profile, goal, preferred intensity, and weekly planning preferences.
Available tracked data is processed.
The ML readiness estimator calculates the user's readiness score.
The Adaptive AI reads the readiness score.
The Adaptive AI selects an appropriate goal/difficulty and activity.
The user performs the recommended activity.
The user logs the activity and provides feedback.
The resulting information becomes part of the user's activity history.
Weekly Analysis
The system collects the user's data across the week.
The General Weekly AI analyzes the overall weekly dataset.
General trends are generated, such as changes in sleep or step count.
The Goal-Specific Weekly AI identifies the user's logged exercise periods.
It examines relevant tracked metrics around those periods.
Repeated activity-specific patterns are identified.
Both analyses are displayed in the Progress & Weekly Report, with the general analysis shown first.

Documentation Links
Repository
GitHub https://github.com/layaa-lgtm/crocky
Demo Video
https://youtu.be/nPrNrJAtoWE?si=czhcUxtV7MK9DcLN


3. Installation & Configuration
Prerequisites & Tech Stack
Runtime Requirements
Requirement
Version
Python
>= 3.11
Node.js
>= 20.x
npm
Compatible with Node.js
Git
Latest stable version
GPU
Not required for current ML pipeline

Technology Stack
Frontend
HTML5
CSS3
JavaScript
AI / ML
Python
Pandas
NumPy
scikit-learn
Joblib
Development
Git
GitHub
VS Code

Step-by-Step Installation
Install Python and ensure it is available in your terminal.
Download and extract the Crocky project ZIP.
Open a terminal in the extracted crocky folder—the folder containing run_local.py.
Create a virtual environment:
python -m venv .venv
Activate it on Windows:
.\.venv\Scripts\Activate.ps1
Install the required dependencies:
python -m pip install -r requirements.txt
Start the application:
python run_local.py
Open http://127.0.0.1:8000 in your browser.
Keep the terminal running while using Crocky. Press Ctrl+C to stop the application.

4. Developer Experience & Quality Control
Usage Snippets
Readiness and Adaptive Planning
The adaptive planning system receives user context and uses the readiness information to determine an appropriate plan.
from daily_plan import make_daily_plan

user = {
    "age": 21
}

plan = make_daily_plan(
    user,
    "cardio",
    3,
    0,
    "work",
    True,
    False,
    None,
    "low",
    None
)

print(plan)

Example structured output:
{
  "type": "trial",
  "goal": "cardio",
  "intensity": "low",
  "duration_min": 15,
  "readiness": 70
}

The readiness value originates from the readiness-estimation stage and is used by the planning logic when determining an appropriate activity.

Testing & QA Commands
Run these commands from the crocky project folder with your virtual environment activated.
Run all Python tests:
python -m unittest discover -s tests -v
Test simulated tracker behavior and report data:
node tests/test_tracker.cjs
Test demo scheduling, persistence and appearance limits:
node tests/test_readiness_demo.cjs
Check JavaScript syntax:
node --check app.js
node --check tracker_report.js
node --check readiness_demo.js
The JavaScript commands require Node.js.
Manual QA: Start the app with python run_local.py, then check Completed, Tried, Missed, Bonus, goal regeneration, week transitions, report results, refresh persistence and switching between demo scenarios.

5. Reliability, Performance & Security
Benchmarks & Maturity Status
Current maturity: Prototype
The core frontend and AI/ML functionality is under active development.
The system currently contains:
A trained ML readiness estimator.
Adaptive planning based on readiness.
A structured exercise library.
User feedback integration.
General weekly trend analysis.
Goal-specific weekly trend analysis.
Final latency and throughput benchmarks are TBD and should be measured against the final integrated application.

Troubleshooting & Known Limitations
Limitation
Description
Workaround / Status
Missing tracked data
Not all users/devices provide every metric
Available features are used; missing data needs to be handled by the pipeline
Limited ML dataset
Current model development uses a limited dataset
Further evaluation/data expansion planned
Bonus days
Bonus days currently consider only one goal
Known design limitation
Dynamic rescheduling
The prototype does not dynamically restructure the user's entire work/rest schedule during the day
Weekly planning is established beforehand
Exercise library
Recommendations currently come from the curated exercise library
Library can be expanded


Open Source & Licensing
License: MIT License



