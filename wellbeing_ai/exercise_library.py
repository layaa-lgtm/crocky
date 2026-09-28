
EXERCISE_LIBRARY = {

    "cardio": {

        "easy": [
            {
                "name": "Brisk walking",
                "type": "cardio",
                "environment": "outdoor",
                "duration_minutes": 15,
                "equipment_required": False,
            },
            {
                "name": "Low-impact step jacks",
                "type": "cardio",
                "environment": "indoor",
                "duration_minutes": 15,
                "equipment_required": False,
            },
        ],

        "moderate": [
            {
                "name": "Walk-jog intervals",
                "type": "cardio",
                "environment": "outdoor",
                "duration_minutes": 25,
                "equipment_required": False,
            },
            {
                "name": "Step jacks",
                "type": "cardio",
                "environment": "indoor",
                "duration_minutes": 20,
                "equipment_required": False,
            },
        ],

        "challenging": [
            {
                "name": "Jogging intervals",
                "type": "cardio",
                "environment": "outdoor",
                "duration_minutes": 30,
                "equipment_required": False,
            },
            {
                "name": "Jumping jacks",
                "type": "cardio",
                "environment": "indoor",
                "duration_minutes": 20,
                "equipment_required": False,
            },
        ],
    },


    "upper_body_strength": {

        "easy": [
            {
                "name": "Wall push-ups",
                "type": "strength",
                "environment": "indoor",
                "sets": 2,
                "reps": 10,
                "equipment_required": False,
            },
            {
                "name": "Wall angels",
                "type": "strength",
                "environment": "indoor",
                "sets": 2,
                "reps": 10,
                "equipment_required": False,
            },
        ],

        "moderate": [
            {
                "name": "Incline push-ups",
                "type": "strength",
                "environment": "indoor",
                "sets": 3,
                "reps": 8,
                "equipment_required": False,
            },
            {
                "name": "Shoulder taps",
                "type": "strength",
                "environment": "indoor",
                "sets": 3,
                "reps": 10,
                "equipment_required": False,
            },
        ],

        "challenging": [
            {
                "name": "Standard push-ups",
                "type": "strength",
                "environment": "indoor",
                "sets": 3,
                "reps": 10,
                "equipment_required": False,
            },
            {
                "name": "Knee push-ups",
                "type": "strength",
                "environment": "indoor",
                "sets": 3,
                "reps": 12,
                "equipment_required": False,
            },
        ],
    },


    "lower_body_strength": {

        "easy": [
            {
                "name": "Chair squats",
                "type": "strength",
                "environment": "indoor",
                "sets": 2,
                "reps": 10,
                "equipment_required": False,
            },
            {
                "name": "Glute bridges",
                "type": "strength",
                "environment": "indoor",
                "sets": 2,
                "reps": 12,
                "equipment_required": False,
            },
        ],

        "moderate": [
            {
                "name": "Bodyweight squats",
                "type": "strength",
                "environment": "indoor",
                "sets": 3,
                "reps": 12,
                "equipment_required": False,
            },
            {
                "name": "Reverse lunges",
                "type": "strength",
                "environment": "indoor",
                "sets": 3,
                "reps": 8,
                "equipment_required": False,
            },
        ],

        "challenging": [
            {
                "name": "Forward lunges",
                "type": "strength",
                "environment": "indoor",
                "sets": 3,
                "reps": 10,
                "equipment_required": False,
            },
            {
                "name": "Single-leg glute bridges",
                "type": "strength",
                "environment": "indoor",
                "sets": 3,
                "reps": 8,
                "equipment_required": False,
            },
        ],
    },


    "core": {

        "easy": [
            {
                "name": "Dead bug",
                "type": "core",
                "environment": "indoor",
                "sets": 2,
                "reps": 8,
                "equipment_required": False,
            },
            {
                "name": "Bird-dog",
                "type": "core",
                "environment": "indoor",
                "sets": 2,
                "reps": 8,
                "equipment_required": False,
            },
        ],

        "moderate": [
            {
                "name": "Forearm plank",
                "type": "core",
                "environment": "indoor",
                "sets": 3,
                "duration_seconds": 30,
                "equipment_required": False,
            },
            {
                "name": "Heel taps",
                "type": "core",
                "environment": "indoor",
                "sets": 3,
                "reps": 12,
                "equipment_required": False,
            },
        ],

        "challenging": [
            {
                "name": "Side plank",
                "type": "core",
                "environment": "indoor",
                "sets": 3,
                "duration_seconds": 30,
                "equipment_required": False,
            },
            {
                "name": "Mountain climbers",
                "type": "core",
                "environment": "indoor",
                "sets": 3,
                "reps": 20,
                "equipment_required": False,
            },
        ],
    },


    "flexibility": {

        "easy": [
            {
                "name": "Cat-cow stretch",
                "type": "mobility",
                "environment": "indoor",
                "sets": 2,
                "reps": 8,
                "equipment_required": False,
            },
            {
                "name": "Child's pose",
                "type": "flexibility",
                "environment": "indoor",
                "sets": 2,
                "duration_seconds": 30,
                "equipment_required": False,
            },
        ],

        "moderate": [
            {
                "name": "Standing hamstring stretch",
                "type": "flexibility",
                "environment": "indoor",
                "sets": 2,
                "duration_seconds": 30,
                "equipment_required": False,
            },
            {
                "name": "Hip-flexor stretch",
                "type": "flexibility",
                "environment": "indoor",
                "sets": 2,
                "duration_seconds": 30,
                "equipment_required": False,
            },
        ],

        "challenging": [
            {
                "name": "Seated spinal twist",
                "type": "mobility",
                "environment": "indoor",
                "sets": 3,
                "duration_seconds": 30,
                "equipment_required": False,
            },
            {
                "name": "Chest doorway stretch",
                "type": "flexibility",
                "environment": "indoor",
                "sets": 3,
                "duration_seconds": 30,
                "equipment_required": False,
            },
        ],
    },


    "balance": {

        "easy": [
            {
                "name": "Tandem stance",
                "type": "balance",
                "environment": "indoor",
                "sets": 2,
                "duration_seconds": 20,
                "equipment_required": False,
            },
            {
                "name": "Heel-to-toe walk",
                "type": "balance",
                "environment": "indoor",
                "sets": 2,
                "duration_seconds": 30,
                "equipment_required": False,
            },
        ],

        "moderate": [
            {
                "name": "Single-leg stand",
                "type": "balance",
                "environment": "indoor",
                "sets": 3,
                "duration_seconds": 20,
                "equipment_required": False,
            },
            {
                "name": "Single-leg reach",
                "type": "balance",
                "environment": "indoor",
                "sets": 3,
                "reps": 6,
                "equipment_required": False,
            },
        ],

        "challenging": [
            {
                "name": "Single-leg stand with reach",
                "type": "balance",
                "environment": "indoor",
                "sets": 3,
                "reps": 8,
                "equipment_required": False,
            },
            {
                "name": "Single-leg balance with knee drive",
                "type": "balance",
                "environment": "indoor",
                "sets": 3,
                "reps": 8,
                "equipment_required": False,
            },
        ],
    },
}


def get_exercises(
    focus,
    difficulty,
    outdoor_exercise_accepted=True,
):
    """
    Return exercises matching the weekly focus and difficulty.

    If outdoor exercise is not accepted, outdoor exercises are excluded.
    Indoor exercises remain available as alternatives.
    """

    if focus not in EXERCISE_LIBRARY:
        raise ValueError(
            f"Unknown focus: {focus}"
        )

    if difficulty not in EXERCISE_LIBRARY[focus]:
        raise ValueError(
            f"Unknown difficulty: {difficulty}"
        )

    exercises = EXERCISE_LIBRARY[focus][difficulty]

    if outdoor_exercise_accepted:
        return exercises.copy()

    return [
        exercise
        for exercise in exercises
        if exercise["environment"] != "outdoor"
    ]



def select_exercise(
    focus,
    difficulty,
    outdoor_exercise_accepted=True,
    index=0,
    offset=0,
):
    """
    Select one exercise for the daily plan.

    offset allows regeneration to start from a different
    position in the available exercise list.
    """

    exercises = get_exercises(
        focus,
        difficulty,
        outdoor_exercise_accepted,
    )

    if not exercises:
        return None

    index = (index + offset) % len(exercises)

    return exercises[index]
