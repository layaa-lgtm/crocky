"""Crocky Weekly AI Trend: a rule-free statistical pipeline (no ML training)."""
from .pipeline import analyze, analyze_files
from .narrative import render_card

__all__ = ["analyze", "analyze_files", "render_card"]
