# Wellbeing AI

Prototype AI layer for an adaptive fitness and wellbeing app.

The system uses wearable activity, sleep and heart-rate data to estimate daily readiness and adapt the user's workout plan based on recent performance, personal baselines and feedback.

## What it does

1. Converts wearable data into standardized features.

2. Builds personal baselines from the user's recent history.

3. Uses a Random Forest model to produce a personalized readiness score from 0–100.

4. Analyzes recent workout response using:
   - average heart rate
   - maximum heart rate
   - heart-rate range
   - workout load
   - recent activity

5. Lets the user choose their weekly workout focus, such as:
   - cardio
   - upper-body strength
   - lower-body strength
   - core
   - flexibility
   - balance

6. Uses previous performance and focus-specific history to determine the starting difficulty for the week.

7. Adjusts the current day's difficulty based on:
   - readiness
   - user feedback
   - recent workout performance
   - remaining work days

8. Selects a specific exercise from the exercise library rather than returning a vague workout description.

9. Supports rest days. When the user selects a rest day, the AI returns only `Rest Day` and does not recommend an exercise.

10. Provides a wearable adapter so data from different smartwatch providers can eventually be converted into the same format before entering the AI pipeline.

## How the adaptive system works

The system has two levels of adaptation.

### Weekly adaptation

At the beginning of a week, the user selects:

- weekly focus
- number of planned workout days

The system uses previous performance and focus-specific history to determine the starting difficulty:

- easy
- moderate
- challenging

The weekly focus remains the core requirement for that week.

### Daily adaptation

Each morning, the user chooses:

- `work`
- `rest`

For a work day, the AI considers the user's readiness and recent performance.

If readiness is normal or high, the planned difficulty is maintained.

If readiness is low, only that day's workout can temporarily become easier. The overall weekly goal is not silently changed.

The user can also provide feedback:

- `too_hard`
- `too_easy`
- `just_right`

This feedback can adjust the difficulty of the remaining goals.

## First-session behaviour

For a user's first workout session, the system uses a short, low-intensity trial session.

This prevents the AI from immediately assigning a difficult workout when there is not yet enough personal workout history.

## Rest days

If the user selects:
rest