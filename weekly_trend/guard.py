"""Language guard: the weekly text may describe associations, never causes."""
import re

BANNED = [
    r"\bcaus(e|es|ed|ing)\b", r"\bbecause\b", r"\bled to\b", r"\bresult(ed|s)? in\b",
    r"\bdue to\b", r"\bthanks to\b", r"\bdefinitely\b", r"\bproves?\b", r"\bproved\b",
    r"\bguarantee", r"\bimproved your\b", r"\bboosted\b", r"\bmade your\b",
]
REQUIRED_ANY = ["associated with", "coincided with", "pattern between", "suggests", "tended to"]


def assert_safe_language(text: str) -> str:
    low = text.lower()
    for pat in BANNED:
        m = re.search(pat, low)
        if m:
            raise ValueError(f"Causal wording not allowed: '{m.group(0)}'")
    if not any(p in low for p in REQUIRED_ANY):
        raise ValueError("Weekly text must contain hedged association language.")
    return text
