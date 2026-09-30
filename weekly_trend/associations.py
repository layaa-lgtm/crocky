"""Association engine: lagged Spearman, exact permutation p-value, leave-one-out stability."""
from __future__ import annotations

import itertools
from dataclasses import dataclass, asdict

import numpy as np
import pandas as pd

from . import config as C
from .features import lagged_pair, usable_exposures, usable_outcomes


def _rank(a) -> np.ndarray:
    return pd.Series(np.asarray(a, float)).rank(method="average").to_numpy()


def spearman(x, y) -> float:
    if len(x) < 3:
        return float("nan")
    rx, ry = _rank(x), _rank(y)
    if rx.std() == 0 or ry.std() == 0:
        return float("nan")
    return float(np.corrcoef(rx, ry)[0, 1])


def permutation_p(x, y, max_exact: int = 8, n_mc: int = 5000, seed: int = 0) -> float:
    """Two-sided p-value. Exact enumeration for tiny n (weekly data), Monte Carlo otherwise."""
    n = len(x)
    rx, ry = _rank(x), _rank(y)
    if rx.std() == 0 or ry.std() == 0:
        return 1.0
    rxc = rx - rx.mean()
    if n <= max_exact:
        perms = np.array(list(itertools.permutations(range(n))))
    else:
        rng = np.random.default_rng(seed)
        perms = np.array([rng.permutation(n) for _ in range(n_mc)])
    yp = ry[perms]
    ypc = yp - yp.mean(axis=1, keepdims=True)
    denom = np.sqrt((rxc ** 2).sum()) * np.sqrt((ypc ** 2).sum(axis=1))
    with np.errstate(invalid="ignore", divide="ignore"):
        r = (ypc @ rxc) / denom
    obs = abs(spearman(x, y))
    return float(np.mean(np.abs(np.nan_to_num(r)) >= obs - 1e-12))


def leave_one_out_min(x, y, rho: float) -> float:
    """Weakest |rho| after dropping any single pair. 0 if any drop flips or kills the sign."""
    x, y = np.asarray(x, float), np.asarray(y, float)
    vals = []
    for i in range(len(x)):
        keep = np.ones(len(x), bool)
        keep[i] = False
        r = spearman(x[keep], y[keep])
        if np.isnan(r) or np.sign(r) != np.sign(rho):
            return 0.0
        vals.append(abs(r))
    return float(min(vals))


@dataclass
class PairResult:
    exposure: str
    outcome: str
    family: str
    n: int
    rho: float
    loo_min_abs: float
    p_value: float
    score: float          # conservative: min(|rho|, weakest leave-one-out |rho|)
    favorable: bool       # is the association in the direction that is good for the user?
    outcome_column: str
    exposure_column: str

    def to_dict(self):
        d = asdict(self)
        return {k: (round(v, 4) if isinstance(v, float) else v) for k, v in d.items()}


def evaluate_all_pairs(df: pd.DataFrame) -> list[PairResult]:
    results: list[PairResult] = []
    for ex in usable_exposures(df):
        for out in usable_outcomes(df):
            x, y = lagged_pair(df, ex.column, out.column)
            rho = spearman(x, y)
            if np.isnan(rho):
                continue
            loo = leave_one_out_min(x, y, rho)
            results.append(PairResult(
                exposure=ex.key, outcome=out.key, family=out.family, n=len(x),
                rho=rho, loo_min_abs=loo, p_value=permutation_p(x, y),
                score=min(abs(rho), loo),
                favorable=(rho > 0) == (out.favorable == "up"),
                outcome_column=out.column, exposure_column=ex.column,
            ))
    return sorted(results, key=lambda r: (-r.score, -abs(r.rho), r.p_value))
