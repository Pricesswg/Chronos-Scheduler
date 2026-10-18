"""User-defined modes (discussion #28): names, extra modes, the select
entity, and the guard against deleting a mode that is in use."""
from __future__ import annotations

from custom_components.chronos.const import DOMAIN
from custom_components.chronos.modes import mode_list, resolve_mode, validate_modes
from custom_components.chronos.select import ChronosModeSelect

SEASONS = [
    {"id": "home", "name": "Summer"},
    {"id": "away", "name": ""},
    {"id": "winter", "name": "Winter"},
    {"id": "christmas", "name": "Christmas"},
]


def test_defaults_and_garbage_fall_back_to_the_built_in_three():
    assert [m["id"] for m in mode_list({})] == ["home", "away", "holiday"]
    assert [m["id"] for m in mode_list({"modes": "nope"})] == ["home", "away", "holiday"]
    assert [m["id"] for m in mode_list({"modes": [{"id": "Bad Id"}]})] == ["home", "away", "holiday"]


def test_resolve_by_id_or_by_name():
    settings = {"modes": SEASONS}
    assert resolve_mode(settings, "winter") == "winter"
    assert resolve_mode(settings, "summer") == "home", "names match case-insensitively"
    assert resolve_mode(settings, "away") == "away", "an unnamed mode is reached by its id"
    assert resolve_mode(settings, "holiday") is None, "not configured any more"
    assert resolve_mode(settings, "") is None


def test_validation_rules():
    ok = validate_modes(SEASONS, [], "home")
    assert ok is None
    assert validate_modes([], [], "home") == "at least one mode is required"
    assert "at most" in validate_modes([{"id": f"m{i}", "name": ""} for i in range(9)], [], "m0")
    assert "invalid mode id" in validate_modes([{"id": "Not ok", "name": ""}], [], "")
    assert "duplicate mode id" in validate_modes([{"id": "a"}, {"id": "a"}], [], "a")
    assert "both named" in validate_modes([{"id": "a", "name": "X"}, {"id": "b", "name": "x"}], [], "a")
    assert "current mode" in validate_modes([{"id": "away", "name": ""}], [], "home")


def test_a_mode_in_use_cannot_be_deleted():
    schedules = [{"id": "s1", "name": "Christmas lights", "modes": ["christmas"]}]
    without = [m for m in SEASONS if m["id"] != "christmas"]
    error = validate_modes(without, schedules, "home")
    assert error and "Christmas lights" in error, "the reason names the schedule"
    assert validate_modes(SEASONS, schedules, "home") is None


async def test_custom_mode_switch_and_the_select_entity(hass, store, scheduler):
    store.settings["modes"] = SEASONS
    store.settings["mode"] = "home"
    hass.data[DOMAIN] = {"store": store, "scheduler": scheduler}
    select = ChronosModeSelect(hass)
    assert select.options == ["Summer", "away", "Winter", "Christmas"]
    assert select.current_option == "Summer"

    assert (await scheduler.set_mode("christmas"))["ok"]
    assert store.settings["mode"] == "christmas"
    assert select.current_option == "Christmas"

    await select.async_select_option("Winter")
    assert store.settings["mode"] == "winter", "the label maps back to the id"

    assert (await scheduler.set_mode("holiday"))["ok"] is False, "no longer configured"
