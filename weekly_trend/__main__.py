import argparse
import json
from pathlib import Path

from .narrative import render_card
from .pipeline import analyze_files

ROOT = Path(__file__).resolve().parents[1]


def main():
    ap = argparse.ArgumentParser(description="Crocky Weekly AI Trend")
    ap.add_argument("--data", default=str(ROOT / "data" / "mock_week.csv"))
    ap.add_argument("--stream", default=None, help="optional minute-level stream; recomputes ex_* from the logged window")
    ap.add_argument("--json", default=None, help="write full result (incl. debug evidence) to this path")
    ap.add_argument("--debug", action="store_true", help="print the ranked pair table")
    a = ap.parse_args()

    trend = analyze_files(a.data, a.stream)
    print(render_card(trend))
    if a.debug:
        print("\n--- ranked evidence (internal, never shown to users) ---")
        pairs = trend.debug.get("all_pairs_ranked") or trend.debug.get("pairs", [])
        print(f"{'exposure':<11}{'outcome':<17}{'n':>2}{'rho':>7}{'loo':>7}{'p':>7}{'score':>7}  favourable")
        for p in pairs[:12]:
            print(f"{p['exposure']:<11}{p['outcome']:<17}{p['n']:>2}{p['rho']:>7.2f}{p['loo_min_abs']:>7.2f}"
                  f"{p['p_value']:>7.3f}{p['score']:>7.2f}  {p['favorable']}")
    if a.json:
        Path(a.json).write_text(json.dumps(trend.__dict__, indent=2, default=float))
        print(f"\nWrote {a.json}")


if __name__ == "__main__":
    main()
