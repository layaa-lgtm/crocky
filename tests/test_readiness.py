import unittest
from unittest.mock import patch
import sys
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parents[1]))
from readiness_adapter import assess_task, features_for
from wellbeing_ai.readiness import _load_model, calculate_readiness

LOW = dict(sleep_hours=3,steps=12000,avg_hr=170,activity_minutes=150,load=250,spo2=94)

class ReadinessTests(unittest.TestCase):
    def test_actual_model_loads(self):
        package=_load_model()
        self.assertEqual(package['model'].__class__.__name__,'RandomForestRegressor')
        self.assertIn('sleep_hours_deviation',package['features'])
        r=assess_task({'goal':{'focus':'cardio','difficulty':'challenging'}})
        self.assertEqual(r['method'],'ml')
        self.assertFalse(r['needsAlternative'])

    def test_low_estimate_offers_easier_same_focus(self):
        for focus in ['cardio','upper_body_strength','lower_body_strength','core','flexibility','balance']:
            r=assess_task(dict(goal=dict(focus=focus,difficulty='challenging'),metrics=LOW,useMockHistory=True))
            self.assertEqual(r['method'],'ml')
            self.assertLess(r['readiness_score'],60)
            self.assertEqual(r['capacity'],'easy')
            self.assertTrue(r['alternatives'])
            self.assertTrue(all(a['focus']==focus and a['difficulty']=='easy' for a in r['alternatives']))

    def test_easy_task_can_be_shortened(self):
        r=assess_task(dict(goal=dict(focus='cardio',difficulty='easy'),metrics=LOW,useMockHistory=True))
        self.assertEqual(r['alternatives'][0]['exercise']['duration_minutes'],8)

    def test_moderate_limits_challenging_task(self):
        with patch('readiness_adapter.calculate_readiness',return_value=dict(readiness_score=65,readiness_band='moderate',method='rule_based')):
            r=assess_task(dict(goal=dict(focus='core',difficulty='challenging')))
        self.assertEqual(r['alternatives'][0]['difficulty'],'moderate')

    def test_deviations_use_prior_history(self):
        history=[dict(sleep_hours=8,load=50) for _ in range(7)]
        f=features_for(dict(sleep_hours=4,load=100),history)
        self.assertEqual(f['sleep_hours_deviation'],-.5)
        self.assertEqual(f['load_deviation'],1)
        self.assertIsNone(f['avg_hr'])

    def test_missing_data_and_invalid_values(self):
        r=assess_task(dict(metrics={}))
        self.assertEqual(r['status'],'insufficient_data')
        with self.assertRaises(ValueError): assess_task(dict(metrics=dict(sleep_hours=-2)))

    def test_model_unavailable_fallback_is_labeled(self):
        with patch('wellbeing_ai.readiness._load_model',return_value=None):
            r=assess_task(dict(goal=dict(focus='cardio',difficulty='challenging')))
        self.assertEqual(r['method'],'rule_based')

    def test_no_change_to_completed_goal(self):
        r=assess_task(dict(goal=dict(completed=True),metrics=LOW))
        self.assertEqual(r['status'],'completed')
        self.assertEqual(r['alternatives'],[])

    def test_model_receives_deviation_values(self):
        class Model:
            def predict(self,frame):
                self.sleep_dev=float(frame.iloc[0]['sleep_hours_deviation'])
                return [55]
        model=Model()
        with patch('wellbeing_ai.readiness._load_model',return_value=dict(model=model,features=['sleep_hours_deviation'],medians={'sleep_hours_deviation':0})):
            r=calculate_readiness(dict(sleep_hours_deviation=-.5))
        self.assertEqual(model.sleep_dev,-.5)
        self.assertEqual(r['method'],'ml')

if __name__=='__main__': unittest.main()
