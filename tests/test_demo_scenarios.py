import unittest
import sys
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parents[1]))
from readiness_adapter import assess_task

class DemoScenarios(unittest.TestCase):
    def test_good_data_keeps_task(self):
        r=assess_task(dict(goal=dict(focus='cardio',difficulty='challenging'),demoScenario='well_recovered'))
        self.assertEqual(r['method'],'ml')
        self.assertFalse(r['needsAlternative'])

    def test_poor_data_runs_model(self):
        r=assess_task(dict(goal=dict(focus='cardio',difficulty='challenging'),demoScenario='poor_sleep'))
        self.assertEqual(r['method'],'ml')
        self.assertTrue(r['needsAlternative'])
        self.assertTrue(r['alternatives'])

    def test_missing_data_no_recommendation(self):
        r=assess_task(dict(goal=dict(focus='cardio'),demoScenario='missing_data'))
        self.assertEqual(r['status'],'insufficient_data')
        self.assertEqual(r['alternatives'],[])

    def test_invalid_scenario_rejected(self):
        with self.assertRaises(ValueError): assess_task(dict(demoScenario='invented'))

if __name__=='__main__': unittest.main()
