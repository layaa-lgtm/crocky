from daily_plan import (
    create_weekly_goals,
    assign_goal_to_day,
    make_daily_plan,
    mark_goal_completed,
    offer_bonus_goal,
)


if __name__ == "__main__":

    # =====================================================
    # SAMPLE WEARABLE DATA
    # =====================================================

    data = {
        "sleep_hours": 7.8,
        "steps": 8420,
        "avg_hr": 72,
        "max_hr": 154,
        "activity_minutes": 43,
        "load": 30.96,
        "spo2": 97,
    }

    # =====================================================
    # BEGINNING OF WEEK
    # =====================================================

    weekly_goals = create_weekly_goals(
        workout_days=3,
        weekly_focus="cardio",
        difficulty="easy",
        outdoor_exercise_accepted=True,
    )

    print("WEEKLY GOALS")
    print("-------------")

    for goal in weekly_goals:

        print(
            goal["goal_id"],
            "->",
            goal["exercise"]["name"],
            "|",
            goal["difficulty"],
        )

    # =====================================================
    # USER CHOOSES WHICH DAY FOR EACH GOAL
    # =====================================================

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
    print("-------------")

    for goal in weekly_goals:

        print(
            goal["scheduled_day"],
            "->",
            goal["exercise"]["name"],
        )

    # =====================================================
    # MONDAY WORK DAY
    # =====================================================

    print("\nMONDAY WORK DAY")
    print("----------------")

    monday_plan = make_daily_plan(
        user_data=data,
        weekly_goals=weekly_goals,
        today="Monday",
        today_choice="work",
        is_first_session=True,
        outdoor_exercise_accepted=True,
    )

    print(monday_plan)

    # =====================================================
    # TUESDAY REST DAY
    # =====================================================

    print("\nTUESDAY REST DAY")
    print("----------------")

    tuesday_plan = make_daily_plan(
        user_data=data,
        weekly_goals=weekly_goals,
        today="Tuesday",
        today_choice="rest",
        outdoor_exercise_accepted=True,
    )

    print(tuesday_plan)

    # =====================================================
    # WEDNESDAY WORK DAY
    # =====================================================

    print("\nWEDNESDAY WORK DAY")
    print("------------------")

    wednesday_plan = make_daily_plan(
        user_data=data,
        weekly_goals=weekly_goals,
        today="Wednesday",
        today_choice="work",
        daily_feedback="just_right",
        outdoor_exercise_accepted=True,
    )

    print(wednesday_plan)

    # =====================================================
    # COMPLETE ALL WEEKLY GOALS
    # =====================================================

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

    # =====================================================
    # BONUS GOAL OFFER
    # =====================================================

    print("\nBONUS GOAL OFFER")
    print("----------------")

    bonus_offer = offer_bonus_goal(
        weekly_goals=weekly_goals,
        weekly_focus="cardio",
        weekly_difficulty="easy",
        user_accepts_bonus=False,
        outdoor_exercise_accepted=True,
    )

    print(bonus_offer)

    # =====================================================
    # USER ACCEPTS BONUS
    # =====================================================

    print("\nBONUS GOAL AFTER USER SAYS YES")
    print("--------------------------------")

    bonus_result = offer_bonus_goal(
        weekly_goals=weekly_goals,
        weekly_focus="cardio",
        weekly_difficulty="easy",
        user_accepts_bonus=True,
        outdoor_exercise_accepted=True,
    )

    print(bonus_result)