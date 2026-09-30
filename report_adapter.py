"""Transport and presentation only. The supplied weekly_trend package is unchanged."""
from pathlib import Path
from datetime import date
from dataclasses import asdict
import json
import re
import pandas as pd
from weekly_analysis import analyze_week
from weekly_trend.loader import load_daily
from weekly_trend.window import window_metrics, slice_window
from weekly_trend.pipeline import analyze
from weekly_trend import config as C

ROOT = Path(__file__).resolve().parent

def clock(value):
    if not re.fullmatch(r'(?:[01]\d|2[0-3]):[0-5]\d', str(value)):
        raise ValueError('Use valid 24-hour actual start/end times.')
    return value

def prototype_data(payload):
    rows = json.loads((ROOT/'fixtures/mock_week.json').read_text())
    stream = pd.DataFrame(json.loads((ROOT/'fixtures/mock_minute_stream.json').read_text()))
    anchor = pd.Timestamp(payload.get('date') or date.today()).normalize()
    shift = anchor - pd.Timestamp(rows[-1]['date'])
    for row in rows:
        row['date'] = (pd.Timestamp(row['date']) + shift).strftime('%Y-%m-%d')
    stream['timestamp'] = pd.to_datetime(stream['timestamp']) + shift
    # Six fixture days are history; today's completion must come from the user.
    rows[-1].update(actual_start=None, actual_end=None, completion_status='missed')
    current_day = max(1, min(7, int(payload.get('currentDay', 1))))
    for session in payload.get('sessions', []):
        idx = 6 - current_day + int(session['day'])
        if idx < 0 or idx > 6:
            continue
        row = rows[idx]
        row.update(planned_exercise=session.get('plannedExercise') or row['planned_exercise'],
                   planned_duration_min=session.get('plannedDuration') or row['planned_duration_min'],
                   planned_intensity=session.get('intensity') or 'moderate')
        status = session.get('status')
        if status in ('completed', 'tried'):
            row.update(actual_start=session.get('actualStart'), actual_end=session.get('actualEnd'),
                       completion_status='completed' if status == 'completed' else 'shortened')
        else:
            row.update(actual_start=None, actual_end=None, completion_status='missed')
    return rows, stream

def insufficient(reason):
    return dict(kind='insufficient_data', headline='Not enough data for an exercise-related pattern',
                summary=reason, supportingMetrics=[], dataUsed=[], nextWeekFocus=None,
                caveat='A seven-day observation cannot establish cause and effect.')

def goal_report(rows, stream):
    evidence = []
    try:
        if any(r.get('completion_status') in ('completed','shortened') and
               (not r.get('actual_start') or not r.get('actual_end')) for r in rows):
            return insufficient('Some completed sessions have no actual start/end time.'), evidence
        daily = load_daily(pd.DataFrame(rows), strict_activities=False)
        # Clear precomputed mock metrics: only real slices may supply window evidence.
        for col in C.WINDOW_COLUMNS:
            daily[col] = float('nan')
        for i, row in daily.iterrows():
            if row['actual_duration_min'] == 0:
                continue
            clock(row['actual_start']); clock(row['actual_end'])
            win = slice_window(stream, row['date'], row['actual_start'], row['actual_end'])
            if win['timestamp'].duplicated().any() or win[['hr_bpm','steps','active_kcal','spo2_pct']].isna().any().any() or pd.isna(row['resting_hr_bpm']):
                return insufficient('Some session wearable or resting heart-rate readings are missing.'), evidence
            m = window_metrics(stream, row['date'], row['actual_start'], row['actual_end'], row['resting_hr_bpm'])
            for key, value in m.items():
                daily.loc[i,key] = value
            evidence.append(dict(date=row['date'].strftime('%Y-%m-%d'), start=row['actual_start'],
                                 end=row['actual_end'], samples=len(win), averageHR=round(m['ex_avg_hr_bpm'],1),
                                 steps=m['ex_steps_in_window']))
        if not evidence:
            return insufficient('No completed exercise intervals are available.'), evidence
        trend = analyze(daily)
        raw = asdict(trend)
        primary = trend.debug.get('primary')
        metrics = trend.metrics[:]
        if primary:
            metrics.insert(0, f"{primary['n']} comparable session-day / next-day pairs")
        used = ['Actual exercise intervals', 'Timestamped wearable readings']
        used += [name for key,name in [('sleep_hrs_prev_night','Sleep'),('resting_hr_bpm','Resting HR'),
                                     ('hrv_rmssd_ms','HRV'),('daily_steps','Daily steps'),('activity_min','Activity')]
                 if daily[key].notna().all()]
        return dict(kind=trend.kind, headline=trend.headline, summary=trend.explanation,
                    supportingMetrics=metrics, dataUsed=used, nextWeekFocus=None,
                    caveat=trend.caveat, original=raw), evidence
    except (ValueError, KeyError, TypeError) as error:
        return insufficient(f'Insufficient or invalid tracked data: {error}'), evidence

def generate_report(payload):
    if 'daily' in payload:
        rows = payload['daily']
        stream = pd.DataFrame(payload.get('stream', []), columns=['timestamp','hr_bpm','steps','active_kcal','spo2_pct'])
        stream['timestamp'] = pd.to_datetime(stream['timestamp'])
        source = 'Provided tracked data'
    else:
        rows, stream = prototype_data(payload)
        source = 'Prototype: supplied mock wearable data with your logged session intervals'
    goal, evidence = goal_report(rows, stream)
    return dict(weekly=analyze_week(rows, payload.get('previous')), goal=goal,
                sessionEvidence=evidence, source=source)
