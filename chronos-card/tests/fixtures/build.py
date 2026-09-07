"""Regenerate backend.json from the integration's constants, so the layout
probe's fake backend answers chronos/actions, chronos/weather/attributes and
chronos/settings/get exactly like the real one. Run from the repo root with a
Python that can import Home Assistant (the test venv):

    python chronos-card/tests/fixtures/build.py
"""
import json
import pathlib
import sys

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parents[3]))
from custom_components.chronos.const import ACTIONS_BY_TYPE, DEFAULT_SETTINGS, WEATHER_ATTRIBUTES  # noqa: E402

out = pathlib.Path(__file__).with_name("backend.json")
out.write_text(json.dumps({
    "_note": "Generated from custom_components/chronos/const.py by tests/fixtures/build.py; do not edit by hand.",
    "actions": ACTIONS_BY_TYPE, "weather_attributes": WEATHER_ATTRIBUTES, "settings": DEFAULT_SETTINGS,
}, indent=1, ensure_ascii=False))
print(f"wrote {out}")
