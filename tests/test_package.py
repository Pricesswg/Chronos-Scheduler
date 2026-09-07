"""Every module of the integration imports under a real Home Assistant, so a
broken import in a module the other tests never touch still fails here."""
from __future__ import annotations

import importlib
import pkgutil

import custom_components.chronos as pkg


def test_every_module_imports():
    names = [m.name for m in pkgutil.iter_modules(pkg.__path__)]
    assert "scheduler" in names and "gate" in names
    for name in names:
        importlib.import_module(f"custom_components.chronos.{name}")
