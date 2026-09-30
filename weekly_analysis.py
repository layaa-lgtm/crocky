"""General weekly summaries, independent of exercise-window associations."""
import math

METRICS = [('sleep_hrs_prev_night', 'Sleep', 'h', .3),
           ('resting_hr_bpm', 'Resting heart rate', 'bpm', 2),
           ('hrv_rmssd_ms', 'HRV', 'ms', 3),
           ('daily_steps', 'Daily steps', 'steps', 500),
           ('activity_min', 'Active minutes', 'min', 5)]

def analyze_week(rows, previous=None):
    def values(group, key):
        return [float(r[key]) for r in group if isinstance(r.get(key), (float, int))
                and math.isfinite(r[key]) and r[key] >= 0]
    before = previous if previous else rows[:3]
    after = rows if previous else rows[-3:]
    label = 'the previous week' if previous else 'the first three days'
    metrics, changes, used = [], [], []
    for key, name, unit, threshold in METRICS:
        a, b = values(before, key), values(after, key)
        if len(a) < 3 or len(b) < 3:
            continue
        x, y = sum(a)/len(a), sum(b)/len(b)
        metrics.append(f'{name}: {x:.1f} → {y:.1f} {unit} ({len(a)} / {len(b)} readings)')
        used.append(name)
        if abs(y-x) >= threshold:
            changes.append((abs(y-x)/threshold, name, x, y, unit))
    if changes:
        _, name, x, y, unit = max(changes)
        direction = 'increased' if y > x else 'decreased'
        headline = f'Your {name.lower()} {direction} this week'
        summary = f'{name} averaged {y:.1f} {unit}, compared with {x:.1f} {unit} during {label}.'
    else:
        headline = 'No clear overall weekly change' if metrics else 'More tracked data is needed'
        summary = ('Available measurements were fairly stable.' if metrics else
                   'At least three valid readings in each comparison period are needed.')
    if not previous:
        summary += ' This compares the last three days with the first three; no previous-week baseline is available.'
    return dict(headline=headline, summary=summary, supportingMetrics=metrics,
                dataUsed=used, nextWeekFocus=None)
