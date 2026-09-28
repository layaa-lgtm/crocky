from readiness import calculate_readiness
from exercise_library import select_exercise


DIFFICULTY_LEVELS = [
    "easy",
    "moderate",
    "challenging",
]


VALID_FOCUSES = [
    "cardio",
    "upper_body_strength",
    "lower_body_strength",
    "core",
    "flexibility",
    "balance",
]


# =========================================================
# DIFFICULTY
# =========================================================

def adjust_difficulty(current_difficulty, feedback):
    """
    Move one difficulty level up or down.
    """

    if current_difficulty not in DIFFICULTY_LEVELS:
        current_difficulty = "moderate"

    index = DIFFICULTY_LEVELS.index(
        current_difficulty
    )

    if feedback == "too_hard":
        index = max(index - 1, 0)

    elif feedback == "too_easy":
        index = min(
            index + 1,
            len(DIFFICULTY_LEVELS) - 1
        )

    return DIFFICULTY_LEVELS[index]


# =========================================================
# PREVIOUS-WEEK PERFORMANCE
# =========================================================

def score_weekly_performance(previous_week_data):
    """
    Calculate a rule-based performance score
    for the previous week.

    Signals:
    - completion
    - user feedback
    - heart-rate response
    - workout load
    - readiness
    """

    if not previous_week_data:
        return 0

    score = 0

    planned = previous_week_data.get(
        "planned_work_days",
        0
    )

    completed = previous_week_data.get(
        "completed_work_days",
        0
    )

    # -----------------------------------------------------
    # Completion
    # -----------------------------------------------------

    if planned > 0:

        completion_rate = completed / planned

        if completion_rate >= 0.85:
            score += 2

        elif completion_rate >= 0.60:
            score += 1

        else:
            score -= 2

    # -----------------------------------------------------
    # User feedback
    # -----------------------------------------------------

    feedback = previous_week_data.get(
        "feedback"
    )

    if feedback == "too_easy":
        score += 2

    elif feedback == "too_hard":
        score -= 2

    # -----------------------------------------------------
    # Heart-rate response
    # -----------------------------------------------------

    hr_response = previous_week_data.get(
        "heart_rate_response"
    )

    if hr_response == "low":
        score += 1

    elif hr_response == "high":
        score -= 1

    # -----------------------------------------------------
    # Workout load
    # -----------------------------------------------------

    load_response = previous_week_data.get(
        "load_response"
    )

    if load_response == "manageable":
        score += 1

    elif load_response == "high":
        score -= 1

    elif load_response == "very_high":
        score -= 2

    # -----------------------------------------------------
    # Readiness
    # -----------------------------------------------------

    average_readiness = previous_week_data.get(
        "average_readiness"
    )

    if average_readiness is not None:

        if average_readiness >= 70:
            score += 1

        elif average_readiness < 45:
            score -= 1

    return score


# =========================================================
# WEEKLY DIFFICULTY
# =========================================================

def determine_weekly_complexity(
    previous_week_data=None,
    focus_history=None,
    weekly_focus=None,
):
    """
    Determine the starting difficulty for a new week.

    Uses:
    1. Previous-week performance
    2. Focus-specific history
    3. Recency of that focus
    """

    # -----------------------------------------------------
    # First week
    # -----------------------------------------------------

    if not previous_week_data:
        return "easy"

    performance_score = score_weekly_performance(
        previous_week_data
    )

    # -----------------------------------------------------
    # Overall previous-week performance
    # -----------------------------------------------------

    if performance_score >= 3:
        difficulty = "challenging"

    elif performance_score >= 1:
        difficulty = "moderate"

    else:
        difficulty = "easy"

    # -----------------------------------------------------
    # Focus-specific history
    # -----------------------------------------------------

    if focus_history and weekly_focus:

        history = focus_history.get(
            weekly_focus
        )

        if history:

            previous_difficulty = history.get(
                "difficulty"
            )

            days_since = history.get(
                "days_since_last"
            )

            if previous_difficulty in DIFFICULTY_LEVELS:

                # Recent focus history has strong influence.
                if (
                    days_since is not None
                    and days_since <= 14
                ):

                    difficulty = previous_difficulty

                # Older history is blended.
                elif (
                    days_since is not None
                    and days_since <= 45
                ):

                    history_index = (
                        DIFFICULTY_LEVELS.index(
                            previous_difficulty
                        )
                    )

                    current_index = (
                        DIFFICULTY_LEVELS.index(
                            difficulty
                        )
                    )

                    blended_index = round(
                        (
                            history_index
                            + current_index
                        ) / 2
                    )

                    difficulty = (
                        DIFFICULTY_LEVELS[
                            blended_index
                        ]
                    )

    return difficulty


# =========================================================
# READINESS
# =========================================================

def get_readiness(
    user_data,
    readiness_score=None,
):
    """
    Get today's readiness.

    If readiness_score is supplied, use it directly.
    Otherwise use the existing ML readiness model.
    """

    if readiness_score is None:

        result = calculate_readiness(
            user_data
        )

    else:

        score = float(
            readiness_score
        )

        if score >= 70:
            band = "high"

        elif score >= 45:
            band = "moderate"

        else:
            band = "low"

        result = {
            "readiness_score": score,
            "readiness_band": band,
            "method": "ml",
        }

    return result


# =========================================================
# CREATE ALL WEEKLY GOALS
# =========================================================

def create_weekly_goals(
    workout_days,
    weekly_focus,
    difficulty=None,
    previous_week_data=None,
    focus_history=None,
    outdoor_exercise_accepted=True,
):
    """
    Generate ALL required goals at the beginning
    of the week.

    The user can later choose which day each goal
    will be performed.

    Every required goal initially has the same
    weekly difficulty.
    """

    if weekly_focus not in VALID_FOCUSES:

        raise ValueError(
            f"Unknown weekly focus: {weekly_focus}"
        )

    workout_days = max(
        1,
        int(workout_days)
    )

    # Determine difficulty only once,
    # at the beginning of the week.
    if difficulty is None:

        difficulty = determine_weekly_complexity(
            previous_week_data=previous_week_data,
            focus_history=focus_history,
            weekly_focus=weekly_focus,
        )

    goals = []

    for index in range(workout_days):

        exercise = select_exercise(
        focus=weekly_focus,
        difficulty=difficulty,
        outdoor_exercise_accepted=(
            outdoor_exercise_accepted
        ),
        index=index,
        offset=regeneration_offset,
)

        if exercise is None:
            continue

        goals.append({
            "goal_id": f"goal_{index + 1}",
            "focus": weekly_focus,
            "difficulty": difficulty,
            "exercise": exercise,
            "scheduled_day": None,
            "completed": False,
            "bonus": False,
        })

    return goals


# =========================================================
# ASSIGN GOAL TO DAY
# =========================================================

def assign_goal_to_day(
    weekly_goals,
    goal_id,
    day,
):
    """
    Allow the user to choose which day
    a weekly goal will be performed.
    """

    updated_goals = []

    found = False

    for goal in weekly_goals:

        updated_goal = goal.copy()

        if goal["goal_id"] == goal_id:

            updated_goal[
                "scheduled_day"
            ] = day

            found = True

        updated_goals.append(
            updated_goal
        )

    if not found:

        raise ValueError(
            f"Goal '{goal_id}' was not found."
        )

    return updated_goals


# =========================================================
# MARK GOAL COMPLETE
# =========================================================

def mark_goal_completed(
    weekly_goals,
    goal_id,
):
    """
    Mark a weekly goal as completed.
    """

    updated_goals = []

    found = False

    for goal in weekly_goals:

        updated_goal = goal.copy()

        if goal["goal_id"] == goal_id:

            updated_goal[
                "completed"
            ] = True

            found = True

        updated_goals.append(
            updated_goal
        )

    if not found:

        raise ValueError(
            f"Goal '{goal_id}' was not found."
        )

    return updated_goals


# =========================================================
# COMPLETION
# =========================================================

def count_completed_goals(
    weekly_goals,
):
    """
    Count completed required weekly goals.
    Bonus goals are not included.
    """

    return sum(
        1
        for goal in weekly_goals
        if (
            goal.get("completed", False)
            and not goal.get("bonus", False)
        )
    )


def count_required_goals(
    weekly_goals,
):
    """
    Count required weekly goals.
    """

    return sum(
        1
        for goal in weekly_goals
        if not goal.get("bonus", False)
    )


def all_required_goals_completed(
    weekly_goals,
):
    """
    Check whether every required goal has
    been completed.
    """

    required_goals = [
        goal
        for goal in weekly_goals
        if not goal.get("bonus", False)
    ]

    if not required_goals:
        return False

    return all(
        goal.get("completed", False)
        for goal in required_goals
    )


# =========================================================
# BONUS GOAL
# =========================================================

def offer_bonus_goal(
    weekly_goals,
    weekly_focus,
    weekly_difficulty,
    user_accepts_bonus=False,
    outdoor_exercise_accepted=True,
):
    """
    Offer one optional bonus goal.

    A bonus goal becomes available only after
    all required weekly goals are completed.

    The bonus goal is generated ONLY if
    user_accepts_bonus=True.

    Only one bonus goal is allowed.
    """

    # -----------------------------------------------------
    # Check required goals
    # -----------------------------------------------------

    if not all_required_goals_completed(
        weekly_goals
    ):

        return {
            "bonus_available": False,
            "bonus_goal": None,
            "reason": (
                "Complete all required weekly "
                "goals first."
            ),
        }

    # -----------------------------------------------------
    # Check whether a bonus already exists
    # -----------------------------------------------------

    for goal in weekly_goals:

        if goal.get("bonus", False):

            return {
                "bonus_available": False,
                "bonus_goal": goal,
                "reason": (
                    "The weekly bonus goal has "
                    "already been generated."
                ),
            }

    # -----------------------------------------------------
    # User has not accepted yet
    # -----------------------------------------------------

    if not user_accepts_bonus:

        return {
            "bonus_available": True,
            "bonus_goal": None,
            "reason": (
                "All required goals are complete. "
                "An optional bonus goal is available "
                "if the user chooses yes."
            ),
        }

    # -----------------------------------------------------
    # Generate bonus goal
    # -----------------------------------------------------

    bonus_exercise = select_exercise(
        focus=weekly_focus,
        difficulty=weekly_difficulty,
        outdoor_exercise_accepted=(
            outdoor_exercise_accepted
        ),
        index=len(weekly_goals),
    )

    if bonus_exercise is None:

        return {
            "bonus_available": False,
            "bonus_goal": None,
            "reason": (
                "No suitable bonus exercise "
                "was available."
            ),
        }

    bonus_goal = {
        "goal_id": "bonus_goal_1",
        "focus": weekly_focus,
        "difficulty": weekly_difficulty,
        "exercise": bonus_exercise,
        "scheduled_day": None,
        "completed": False,
        "bonus": True,
    }

    return {
        "bonus_available": False,
        "bonus_goal": bonus_goal,
        "reason": (
            "The user accepted the optional "
            "bonus goal."
        ),
    }


# =========================================================
# GET GOAL FOR TODAY
# =========================================================

def get_goal_for_day(
    weekly_goals,
    today,
):
    """
    Find the incomplete required goal assigned
    to today.

    Returns None if there is no goal assigned.
    """

    for goal in weekly_goals:

        if (
            goal.get("scheduled_day") == today
            and not goal.get("completed", False)
        ):

            return goal

    return None


# =========================================================
# DAILY PLAN
# =========================================================

def make_daily_plan(
    user_data,
    weekly_goals,
    today,
    today_choice,
    is_first_session=False,
    outdoor_exercise_accepted=True,
    daily_feedback=None,
    readiness_score=None,
):
    """
    Generate today's plan using the weekly goals
    that were already created at the beginning
    of the week.

    today_choice:
        "work"
        "rest"

    daily_feedback:
        "too_hard"
        "too_easy"
        "just_right"
        None
    """

    # -----------------------------------------------------
    # READINESS
    # -----------------------------------------------------

    readiness = get_readiness(
        user_data,
        readiness_score,
    )

    readiness_band = readiness[
        "readiness_band"
    ]

    # -----------------------------------------------------
    # REST DAY
    # -----------------------------------------------------

    if today_choice == "rest":

        return {
            **readiness,
            "day_type": "rest",
            "recommendation": "Rest Day",
            "duration_minutes": 0,
            "intensity": "none",
            "exercise": None,
            "outdoor": False,
            "activities": [],
            "goal_id": None,
            "reason": (
                "You selected a rest day."
            ),
        }

    # -----------------------------------------------------
    # VALIDATE CHOICE
    # -----------------------------------------------------

    if today_choice != "work":

        raise ValueError(
            "today_choice must be "
            "'work' or 'rest'."
        )

    # -----------------------------------------------------
    # FIND TODAY'S PRE-GENERATED GOAL
    # -----------------------------------------------------

    goal = get_goal_for_day(
        weekly_goals,
        today,
    )

    # -----------------------------------------------------
    # NO GOAL ASSIGNED
    # -----------------------------------------------------

    if goal is None:

        return {
            **readiness,
            "day_type": "work",
            "session_type": "unassigned",
            "recommendation": (
                "No goal assigned for today"
            ),
            "duration_minutes": 0,
            "intensity": "none",
            "exercise": None,
            "outdoor": False,
            "activities": [],
            "goal_id": None,
            "reason": (
                "Choose one of your weekly "
                "goals for today."
            ),
        }

    # -----------------------------------------------------
    # WEEKLY GOAL DIFFICULTY
    # -----------------------------------------------------

    weekly_difficulty = goal[
        "difficulty"
    ]

    today_difficulty = (
        weekly_difficulty
    )

    # -----------------------------------------------------
    # LOW READINESS
    # -----------------------------------------------------

    if readiness_band == "low":

        today_difficulty = adjust_difficulty(
            today_difficulty,
            "too_hard",
        )

    # -----------------------------------------------------
    # USER FEEDBACK
    # -----------------------------------------------------

    if daily_feedback == "too_hard":

        today_difficulty = adjust_difficulty(
            today_difficulty,
            "too_hard",
        )

    elif daily_feedback == "too_easy":

        today_difficulty = adjust_difficulty(
            today_difficulty,
            "too_easy",
        )

    # -----------------------------------------------------
    # FIRST SESSION
    # -----------------------------------------------------

    if is_first_session:

        today_difficulty = "easy"

    # -----------------------------------------------------
    # SELECT EXERCISE FOR TODAY
    # -----------------------------------------------------

    # Use the exercise that was generated
    # at the beginning of the week.
    selected_exercise = goal["exercise"]

    # If today's difficulty has been temporarily
    # changed because of readiness or feedback,
    # find an appropriate version of the same
    # focus at the adjusted difficulty.
    if today_difficulty != weekly_difficulty:

        adjusted_exercise = select_exercise(
            focus=goal["focus"],
            difficulty=today_difficulty,
            outdoor_exercise_accepted=(
                outdoor_exercise_accepted
            ),
        )

        if adjusted_exercise is not None:
            selected_exercise = adjusted_exercise
    # -----------------------------------------------------
    # NO EXERCISE AVAILABLE
    # -----------------------------------------------------

    if selected_exercise is None:

        return {
            **readiness,
            "day_type": "work",
            "session_type": "normal",
            "goal_id": goal["goal_id"],
            "weekly_difficulty": (
                weekly_difficulty
            ),
            "today_difficulty": (
                today_difficulty
            ),
            "recommendation": (
                "No exercise selected"
            ),
            "duration_minutes": 0,
            "intensity": "none",
            "exercise": None,
            "outdoor": False,
            "activities": [],
            "reason": (
                "No suitable exercise was "
                "available for today's goal."
            ),
        }

    # -----------------------------------------------------
    # INTENSITY
    # -----------------------------------------------------

    intensity_map = {
        "easy": "low",
        "moderate": "moderate",
        "challenging": "high",
    }

    intensity = intensity_map[
        today_difficulty
    ]

    # -----------------------------------------------------
    # EXERCISE DETAILS
    # -----------------------------------------------------

    outdoor = (
        selected_exercise[
            "environment"
        ] == "outdoor"
    )

    activities = [
        selected_exercise["name"]
    ]

    duration = selected_exercise.get(
        "duration_minutes"
    )

    # -----------------------------------------------------
    # REASON
    # -----------------------------------------------------

    if is_first_session:

        reason = (
            "This is your first session, so "
            "the app starts with an easy "
            "low-intensity trial."
        )

    elif readiness_band == "low":

        reason = (
            "Your readiness is low today, "
            "so the assigned weekly goal "
            "has been temporarily made easier."
        )

    elif daily_feedback == "too_hard":

        reason = (
            "You found the previous level "
            "too hard, so today's assigned "
            "goal is temporarily easier."
        )

    elif daily_feedback == "too_easy":

        reason = (
            "You found the previous level "
            "too easy, so today's assigned "
            "goal is temporarily harder."
        )

    else:

        reason = (
            "Today's workout uses the goal "
            "you selected from this week's "
            "pre-generated goals."
        )

    # -----------------------------------------------------
    # FINAL RESULT
    # -----------------------------------------------------

    return {
        **readiness,
        "day_type": "work",
        "session_type": "normal",
        "goal_id": goal["goal_id"],
        "weekly_difficulty": (
            weekly_difficulty
        ),
        "today_difficulty": (
            today_difficulty
        ),
        "recommendation": (
            selected_exercise["name"]
        ),
        "duration_minutes": duration,
        "intensity": intensity,
        "outdoor": outdoor,
        "activities": activities,
        "exercise": selected_exercise,
        "reason": reason,
    }


# =========================================================
# TEST
# =========================================================

if __name__ == "__main__":

    sample_user_data = {
        "sleep_hours": 7.8,
        "steps": 8420,
        "avg_hr": 72,
        "activity_minutes": 43,
        "load": 30.96,
        "spo2": 97,
    }

    # -----------------------------------------------------
    # BEGINNING OF WEEK
    # -----------------------------------------------------

    weekly_goals = create_weekly_goals(
        workout_days=3,
        weekly_focus="cardio",
        difficulty="easy",
        outdoor_exercise_accepted=True,
    )

    print("\nWEEKLY GOALS")

    for goal in weekly_goals:

        print(
            goal["goal_id"],
            "->",
            goal["exercise"]["name"],
            "| difficulty:",
            goal["difficulty"],
        )

    # -----------------------------------------------------
    # USER CHOOSES DAYS
    # -----------------------------------------------------

    weekly_goals = assign_goal_to_day(
        weekly_goals,
        "goal_1",
        "Monday",
    )

    weekly_goals = assign_goal_to_day(
        weekly_goals,
        "goal_2",
        "Wednesday",
    )

    weekly_goals = assign_goal_to_day(
        weekly_goals,
        "goal_3",
        "Saturday",
    )

    print("\nUSER SCHEDULE")

    for goal in weekly_goals:

        print(
            goal["scheduled_day"],
            "->",
            goal["exercise"]["name"],
        )

    # -----------------------------------------------------
    # MONDAY
    # -----------------------------------------------------

    monday_plan = make_daily_plan(
        user_data=sample_user_data,
        weekly_goals=weekly_goals,
        today="Monday",
        today_choice="work",
        is_first_session=True,
    )

    print("\nMONDAY PLAN")
    print(monday_plan)

    # -----------------------------------------------------
    # WEDNESDAY
    # -----------------------------------------------------

    wednesday_plan = make_daily_plan(
        user_data=sample_user_data,
        weekly_goals=weekly_goals,
        today="Wednesday",
        today_choice="work",
        daily_feedback="just_right",
    )

    print("\nWEDNESDAY PLAN")
    print(wednesday_plan)

    # -----------------------------------------------------
    # REST DAY
    # -----------------------------------------------------

    rest_plan = make_daily_plan(
        user_data=sample_user_data,
        weekly_goals=weekly_goals,
        today="Tuesday",
        today_choice="rest",
    )

    print("\nREST DAY")
    print(rest_plan)

    # -----------------------------------------------------
    # COMPLETE ALL REQUIRED GOALS
    # -----------------------------------------------------

    weekly_goals = mark_goal_completed(
        weekly_goals,
        "goal_1",
    )

    weekly_goals = mark_goal_completed(
        weekly_goals,
        "goal_2",
    )

    weekly_goals = mark_goal_completed(
        weekly_goals,
        "goal_3",
    )

    print("\nGOAL COMPLETION")

    print(
        count_completed_goals(
            weekly_goals
        ),
        "/",
        count_required_goals(
            weekly_goals
        ),
    )

    # -----------------------------------------------------
    # BONUS OFFER
    # -----------------------------------------------------

    bonus_offer = offer_bonus_goal(
        weekly_goals=weekly_goals,
        weekly_focus="cardio",
        weekly_difficulty="easy",
        user_accepts_bonus=False,
    )

    print("\nBONUS OFFER")
    print(bonus_offer)

    # -----------------------------------------------------
    # USER SAYS YES
    # -----------------------------------------------------

    bonus_result = offer_bonus_goal(
        weekly_goals=weekly_goals,
        weekly_focus="cardio",
        weekly_difficulty="easy",
        user_accepts_bonus=True,
    )

    print("\nBONUS RESULT")
    print(bonus_result)