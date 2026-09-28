from datetime import datetime


def create_focus_history():
    """
    Stores the user's most recent known difficulty
    separately for each workout focus.
    """

    return {}


def update_focus_history(
    history,
    focus,
    difficulty,
    date=None,
):
    """
    Remember the most recent difficulty used for a focus.
    """

    if date is None:
        date = datetime.now().date().isoformat()

    history = history.copy()

    history[focus] = {
        "difficulty": difficulty,
        "last_performed": date,
    }

    return history


def add_days_since_last(
    history,
    current_date,
):
    """
    Convert stored dates into days_since_last so that
    daily_plan.py can determine how much weight to give
    older exercise history.
    """

    current = datetime.fromisoformat(
        current_date
    ).date()

    updated = {}

    for focus, data in history.items():

        last_performed = data.get(
            "last_performed"
        )

        if not last_performed:
            continue

        last_date = datetime.fromisoformat(
            last_performed
        ).date()

        days_since = (
            current - last_date
        ).days

        updated[focus] = {
            **data,
            "days_since_last": days_since,
        }

    return updated