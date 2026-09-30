"""Connect the supplied readiness model and exercise catalogue to today's task."""
import json
import math
import statistics
from copy import deepcopy
from pathlib import Path
from wellbeing_ai.readiness import calculate_readiness, _load_model
from wellbeing_ai.exercise_library import get_exercises

FIELDS = {'sleep_hours':(0,24), 'steps':(0,100000), 'avg_hr':(20,250),
          'activity_minutes':(0,1440), 'load':(0,10000), 'spo2':(50,100)}
ROOT = Path(__file__).resolve().parent

def clean(row):
    result = {}
    for key,(low,high) in FIELDS.items():
        value = row.get(key)
        if value is None or value == '':
            result[key] = None
            continue
        value = float(value)
        if not math.isfinite(value) or not low <= value <= high:
            raise ValueError(f'Invalid {key}; expected {low}–{high}.')
        result[key] = value
    if result['load'] is None and result['avg_hr'] is not None and result['activity_minutes'] is not None:
        result['load'] = result['activity_minutes'] * max(result['avg_hr'],60) / 100
    return result

def features_for(today, history):
    result = clean(today)
    history = [clean(r) for r in history[-7:]]
    for key in FIELDS:
        values = [r[key] for r in history if r[key] is not None]
        baseline = statistics.median(values) if len(values) >= 3 else None
        result[key+'_deviation'] = ((result[key]-baseline)/baseline
            if baseline and result[key] is not None else None)
    return result

def assess_task(payload):
    goal = payload.get('goal') or {}
    if goal.get('completed'):
        return dict(status='completed', message='This task is already completed.', alternatives=[])
    mock = json.loads((ROOT/'fixtures/readiness_history.json').read_text())
    scenario = payload.get('demoScenario')
    if scenario is not None and scenario not in ('well_recovered','poor_sleep','missing_data'):
        raise ValueError('Unknown demo scenario.')
    supplied = 'metrics' in payload and scenario is None
    if scenario == 'poor_sleep':
        today = dict(sleep_hours=3,steps=12000,avg_hr=170,activity_minutes=150,load=250,spo2=94)
    elif scenario == 'missing_data':
        today = {}
    else:
        today = payload['metrics'] if supplied else mock[-1]
    history = mock[:-1] if scenario else payload.get('history', mock[:-1] if not supplied or payload.get('useMockHistory') else [])
    inputs = features_for(today, history)
    if sum(inputs[k] is not None for k in FIELDS) < 3 or inputs['sleep_hours'] is None:
        return dict(status='insufficient_data', message='There is not enough sample tracking data to suggest a task change.', alternatives=[])
    result = calculate_readiness(inputs)
    package = _load_model() if result['method']=='ml' else None
    imputed = [f for f in package['features'] if inputs.get(f) is None] if package else []
    score = result['readiness_score']
    # Prototype task policy: the supplied model's training target range is 45–82.
    # Its existing <45 low-band threshold cannot express most reduced-readiness days.
    capacity = 'easy' if score < 60 else 'moderate' if score < 70 else 'challenging'
    difficulty = goal.get('difficulty') or 'easy'
    if difficulty not in ('easy','moderate','challenging'):
        raise ValueError('Unknown task difficulty.')
    focus = goal.get('focus') or 'cardio'
    order = ['easy','moderate','challenging']
    needs_change = order.index(difficulty)>order.index(capacity) or score < 60
    alternatives = []
    if needs_change:
        for exercise in get_exercises(focus, capacity, bool(payload.get('outdoorAllowed',True))):
            exercise = deepcopy(exercise)
            # Even an easy weekly task can be too demanding on a reduced-readiness day.
            if score < 60:
                for key in ('duration_minutes','duration_seconds','sets'):
                    if exercise.get(key):
                        exercise[key] = max(1, math.ceil(exercise[key]/2))
            alternatives.append(dict(title=exercise['name'], difficulty=capacity,
                                     focus=focus, exercise=exercise))
    source = 'Supplied mock daily measurements' if not supplied else 'Your entered daily measurements'
    if supplied and payload.get('useMockHistory'):
        source += ' with demo comparison history'
    return dict(status='success', **result, capacity=capacity, needsAlternative=needs_change,
                message=('An easier session may fit your readiness better today.' if needs_change else
                         'Your planned task fits today’s estimated readiness.'),
                alternatives=alternatives[:2], source=source, imputedFeatures=imputed,
                baselineDays=len(history), note='Prototype estimate; consider how you feel today as well.',
                taskKey=payload.get('taskKey'), inputs=inputs)
