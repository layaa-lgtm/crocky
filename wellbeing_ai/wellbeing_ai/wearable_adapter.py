"""
Wearable data adapter.

Converts smartwatch data from different providers into
the standardized format expected by the wellbeing AI.

The AI should work with the standardized format rather
than depending directly on Garmin, Apple, Fitbit, etc.
"""


STANDARD_FIELDS = [
    "sleep_hours",
    "steps",
    "avg_hr",
    "max_hr",
    "activity_minutes",
    "active_kcal",
    "distance_m",
    "spo2",
]


def get_first_available(data, possible_names):
    """
    Return the first available value from a list
    of possible device-specific field names.
    """

    for name in possible_names:

        if name in data:

            value = data[name]

            if value is not None:
                return value

    return None


def adapt_wearable_data(data):
    """
    Convert wearable/device data into the standard
    format used by the wellbeing AI.

    This allows different wearable providers to feed
    the same AI pipeline.
    """

    standardized = {
        "sleep_hours": get_first_available(
            data,
            [
                "sleep_hours",
                "sleep_duration_hours",
                "total_sleep_hours",
            ],
        ),

        "steps": get_first_available(
            data,
            [
                "steps",
                "total_steps",
            ],
        ),

        "avg_hr": get_first_available(
            data,
            [
                "avg_hr",
                "average_heart_rate",
                "avg_heart_rate",
                "heart_rate_avg",
            ],
        ),

        "max_hr": get_first_available(
            data,
            [
                "max_hr",
                "maximum_heart_rate",
                "max_heart_rate",
                "heart_rate_max",
            ],
        ),

        "activity_minutes": get_first_available(
            data,
            [
                "activity_minutes",
                "active_minutes",
                "exercise_minutes",
            ],
        ),

        "active_kcal": get_first_available(
            data,
            [
                "active_kcal",
                "active_calories",
                "active_kilocalories",
                "calories_burned",
            ],
        ),

        "distance_m": get_first_available(
            data,
            [
                "distance_m",
                "distance_meters",
                "distance",
            ],
        ),

        "spo2": get_first_available(
            data,
            [
                "spo2",
                "blood_oxygen",
                "oxygen_saturation",
            ],
        ),
    }

    return standardized


def validate_standard_data(data):
    """
    Check which standardized fields are available.
    """

    return {
        field: data.get(field) is not None
        for field in STANDARD_FIELDS
    }


def calculate_derived_features(data):
    """
    Calculate simple derived features that can be
    used by the wellbeing AI.

    These are intentionally device-independent.
    """

    result = data.copy()

    avg_hr = result.get("avg_hr")
    max_hr = result.get("max_hr")

    if avg_hr is not None and max_hr is not None:

        result["hr_range"] = (
            max_hr - avg_hr
        )

        if avg_hr != 0:

            result["hr_peak_ratio"] = (
                max_hr / avg_hr
            )

        else:

            result["hr_peak_ratio"] = None

    else:

        result["hr_range"] = None
        result["hr_peak_ratio"] = None

    activity_minutes = result.get(
        "activity_minutes"
    )

    if (
        activity_minutes is not None
        and avg_hr is not None
    ):

        result["load"] = (
            activity_minutes
            * max(avg_hr, 60)
            / 100
        )

    else:

        result["load"] = None

    return result


def prepare_for_ai(data):
    """
    Full wearable-data preparation flow.

    1. Standardize device-specific field names.
    2. Calculate device-independent derived features.
    3. Return data ready for the AI pipeline.
    """

    standardized = adapt_wearable_data(
        data
    )

    prepared = calculate_derived_features(
        standardized
    )

    return prepared


if __name__ == "__main__":

    # Example Garmin-style data.
    #
    # In the future, this could instead come
    # from Apple Health, Fitbit, Wear OS, etc.

    garmin_data = {

        "sleep_duration_hours": 7.4,

        "total_steps": 8420,

        "average_heart_rate": 72,

        "maximum_heart_rate": 154,

        "active_minutes": 43,

        "active_calories": 385,

        "distance_meters": 5200,

        "blood_oxygen": 97,
    }

    prepared_data = prepare_for_ai(
        garmin_data
    )

    print(
        "STANDARDIZED WEARABLE DATA"
    )

    print(prepared_data)

    print(
        "\nAVAILABLE STANDARD FIELDS"
    )

    print(
        validate_standard_data(
            prepared_data
        )
    )