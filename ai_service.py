"""HTTP adapter between the Lillypad frontend and the existing wellbeing_ai package.

The wellbeing_ai package is intentionally imported as-is. This file owns the
HTTP/API translation so the AI package does not need to know anything about the
frontend or its JSON format.
"""

from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import json
import sys


ROOT = Path(__file__).resolve().parent
AI_DIR = ROOT / "wellbeing_ai"

# The existing wellbeing_ai modules use sibling imports (for example,
# daily_plan imports readiness), so expose that directory exactly as it is.
sys.path.insert(0, str(AI_DIR))

from daily_plan import create_weekly_goals  # noqa: E402


HOST = "127.0.0.1"
PORT = 8001

ACTIVITY_TO_FOCUS = {
    "cardio": "cardio",
    "upper_body_strength": "upper_body_strength",
    "lower_body_strength": "lower_body_strength",
    "core": "core",
    "flexibility": "flexibility",
    "balance": "balance",
}

def choose_focus(activities):
    """Use the first selected frontend activity as the primary AI focus."""
    for activity in activities or []:
        focus = ACTIVITY_TO_FOCUS.get(activity)
        if focus:
            return focus
    return "cardio"


def format_exercise_description(exercise):
    """Turn the AI exercise fields into the frontend's existing description format."""
    details = []

    if exercise.get("sets") is not None:
        details.append(f'{exercise["sets"]} sets')
    if exercise.get("reps") is not None:
        details.append(f'{exercise["reps"]} reps')
    if exercise.get("duration_seconds") is not None:
        details.append(f'{exercise["duration_seconds"]} seconds')
    if exercise.get("environment"):
        details.append(exercise["environment"])
    if exercise.get("equipment_required") is False:
        details.append("no equipment")

    if details:
        return " • ".join(details)

    return "Follow the recommended pace and take breaks when needed."


def to_frontend_goal(goal, index):
    exercise = goal["exercise"]
    duration = exercise.get("duration_minutes")

    return {
        "id": index + 1,
        "goalId": goal["goal_id"],
        "title": exercise["name"],
        "desc": format_exercise_description(exercise),
        "duration": f"{duration} mins" if duration is not None else "Flexible",
        "completed": bool(goal.get("completed", False)),
        "focus": goal.get("focus"),
        "difficulty": goal.get("difficulty"),
        "exercise": exercise,
    }


def generate_goals(payload):
    workout_days = max(1, min(7, int(payload.get("workout_days", 1))))
    activities = payload.get("activities") or []
    focus = choose_focus(activities)
    regeneration_offset = int(payload.get("regeneration_offset", 0))

    # First-week difficulty is deliberately left to wellbeing_ai. Its existing
    # create_weekly_goals() function uses its own weekly rules when difficulty
    # is not supplied.
    ai_goals = create_weekly_goals(
    workout_days=workout_days,
    weekly_focus=focus,
    difficulty=payload.get("difficulty"),
    previous_week_data=payload.get("previous_week_data"),
    focus_history=payload.get("focus_history"),
    outdoor_exercise_accepted=bool(
        payload.get("outdoor_exercise_accepted", True)
    ),
    regeneration_offset=regeneration_offset,
)

    goals = [to_frontend_goal(goal, index) for index, goal in enumerate(ai_goals)]

    return {
        "status": "success",
        "source": "wellbeing_ai",
        "focus": focus,
        "difficulty": ai_goals[0]["difficulty"] if ai_goals else None,
        "goals": goals,
    }


class AIHandler(BaseHTTPRequestHandler):
    def _send_json(self, status, payload):
        body = json.dumps(payload).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.end_headers()
        self.wfile.write(body)

    def do_OPTIONS(self):
        self.send_response(204)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.end_headers()

    def do_GET(self):
        if self.path == "/health":
            self._send_json(200, {"status": "ok", "service": "wellbeing_ai"})
            return
        self._send_json(404, {"error": "Not found"})

    def do_POST(self):

        try:
            length = int(self.headers.get("Content-Length", "0"))
            payload = json.loads(self.rfile.read(length) or b"{}")
            result = generate_goals(payload)
            self._send_json(200, result)
        except Exception as error:
            self._send_json(500, {"status": "error", "error": str(error)})
            
    def log_message(self, format, *args):
        print(f"[wellbeing_ai] {self.address_string()} - {format % args}")


if __name__ == "__main__":
    server = ThreadingHTTPServer((HOST, PORT), AIHandler)
    print(f"wellbeing_ai adapter running at http://{HOST}:{PORT}")
    server.serve_forever()
