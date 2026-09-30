import unittest
import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from report_adapter import generate_report, prototype_data
from weekly_analysis import analyze_week

class IntegrationTests(unittest.TestCase):
    def test_weekly_real_change(self):
        rows, _ = prototype_data({})
        report = analyze_week(rows)
        self.assertIn('increased', report['headline'])
        self.assertIn('Daily steps: 7036.7 → 8096.7', report['supportingMetrics'][3])

    def test_exact_windows_change_evidence(self):
        def report(start,end):
            return generate_report(dict(date='2026-09-30', currentDay=1,
                sessions=[dict(day=1,status='completed',actualStart=start,actualEnd=end,
                               plannedExercise='Brisk walking',plannedDuration=30)]))
        afternoon, morning = report('15:00','15:30'), report('07:00','07:30')
        a,b = afternoon['sessionEvidence'][-1], morning['sessionEvidence'][-1]
        self.assertEqual((a['start'],a['end'],a['samples']),('15:00','15:30',30))
        self.assertEqual((b['start'],b['end'],b['samples']),('07:00','07:30',30))
        self.assertNotEqual(a['steps'],b['steps'])
        self.assertNotEqual(a['averageHR'],b['averageHR'])

    def test_flat_no_pattern(self):
        rows, stream = prototype_data({})
        for row in rows:
            for key,val in [('sleep_hrs_prev_night',7),('resting_hr_bpm',65),('hrv_rmssd_ms',40),
                            ('daily_avg_spo2_pct',97),('daily_steps',5000),('activity_min',30)]:
                row[key]=val
            row.update(actual_start='12:00',actual_end='12:30')
        # Flat wearable steps make outside-exercise activity flat too.
        stream['steps']=0
        result=generate_report(dict(daily=rows,stream=stream.astype({'timestamp':str}).to_dict('records')))
        self.assertEqual(result['goal']['kind'],'no_clear_pattern')

    def test_missing_wearable(self):
        rows,stream=prototype_data({})
        stream.loc[0:1500,'hr_bpm']=None
        result=generate_report(dict(daily=rows,stream=stream.astype({'timestamp':str}).to_dict('records')))
        self.assertEqual(result['goal']['kind'],'insufficient_data')

    def test_missing_recovery_and_sleep(self):
        rows,stream=prototype_data({})
        for row in rows:
            row['hrv_rmssd_ms']=None
            row['sleep_hrs_prev_night']=None
        result=generate_report(dict(daily=rows,stream=stream.astype({'timestamp':str}).to_dict('records')))
        self.assertNotIn('HRV',result['goal']['dataUsed'])
        self.assertNotIn('Sleep',result['weekly']['dataUsed'])

    def test_missing_times_and_no_sessions(self):
        r=generate_report(dict(sessions=[dict(day=1,status='completed')]))
        self.assertEqual(r['goal']['kind'],'insufficient_data')
        rows,stream=prototype_data({})
        for row in rows: row.update(actual_start=None,actual_end=None,completion_status='missed')
        r=generate_report(dict(daily=rows,stream=stream.astype({'timestamp':str}).to_dict('records')))
        self.assertEqual(r['goal']['kind'],'insufficient_data')

    def test_sections_order_and_distinct(self):
        html=(Path(__file__).resolve().parents[1]/'index.html').read_text(encoding='utf-8')
        self.assertLess(html.index('>Weekly Analysis<'),html.index('>Goal-Specific Analysis<'))
        r=generate_report({})
        self.assertNotEqual(r['weekly']['headline'],r['goal']['headline'])

    def test_short_data(self):
        rows,stream=prototype_data({})
        r=generate_report(dict(daily=rows[:2],stream=[]))
        self.assertEqual(r['goal']['kind'],'insufficient_data')

if __name__=='__main__': unittest.main()
