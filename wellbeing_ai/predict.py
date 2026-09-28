import sys
import json

def generate_recommendations(user_data):
    # Retrieve user input fields
    sleep_hours = user_data.get("sleep_hours", 7)
    stress_level = user_data.get("stress_level", 5)
    
    # Simple logic / Model inference placeholder
    readiness_score = max(0, min(100, int((sleep_hours * 10) - (stress_level * 5))))
    
    return {
        "readiness_score": readiness_score,
        "recommendation": "Optimal recovery day" if readiness_score > 60 else "Light activity recommended",
        "status": "success"
    }

if __name__ == "__main__":
    if len(sys.argv) > 1:
        # Read JSON string passed from Go
        raw_input = sys.argv[1]
        data = json.loads(raw_input)
        result = generate_recommendations(data)
        # Output JSON result so Go can capture it
        print(json.dumps(result))
    else:
        print(json.dumps({"error": "No input provided"}))