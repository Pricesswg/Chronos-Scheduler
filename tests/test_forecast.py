"""Hourly forecast cache: filled from weather.get_forecasts, read by the
forecast.* rule variables, and driving a skip rule through the tick."""
from __future__ import annotations

from homeassistant.core import SupportsResponse

from .conftest import make_device, make_schedule, names, tick_at


def _forecast_service(hass, data):
    async def get_forecasts(call):
        rain = data["rain"]
        return {"weather.casa": {"forecast": [
            {"datetime": f"2026-09-07T{i:02d}:00:00+00:00", "temperature": 20 + i, "precipitation": rain, "condition": "rainy" if rain else "sunny"}
            for i in range(24)
        ]}}
    hass.services.async_register("weather", "get_forecasts", get_forecasts, supports_response=SupportsResponse.ONLY)


async def test_cache_feeds_the_forecast_variables(hass, store, scheduler):
    store.settings["weather_entity"] = "weather.casa"
    hass.states.async_set("weather.casa", "sunny", {})
    data = {"rain": 0.0}
    _forecast_service(hass, data)
    await scheduler._refresh_forecast_cache()
    assert scheduler._forecast_value_from_cache("forecast.temp_max_today") == 43
    assert scheduler._forecast_value_from_cache("forecast.temp_min_today") == 20
    assert scheduler._forecast_value_from_cache("forecast.rain_6h") == 0
    assert scheduler._forecast_value_from_cache("forecast.condition_6h") == "sunny"
    data["rain"] = 0.5
    await scheduler._refresh_forecast_cache()
    assert scheduler._forecast_value_from_cache("forecast.rain_6h") == 3.0


async def test_no_weather_entity_means_no_forecast(hass, store, scheduler):
    store.settings["weather_entity"] = ""
    await scheduler._refresh_forecast_cache()
    assert scheduler._forecast_value_from_cache("forecast.rain_6h") is None


async def test_skip_rule_on_forecast_rain(hass, store, scheduler, calls, clock):
    store.settings["weather_entity"] = "weather.casa"
    hass.states.async_set("weather.casa", "sunny", {})
    data = {"rain": 2.0}
    _forecast_service(hass, data)
    store.devices = [make_device("d1", "switch.pump")]
    store.schedules = [make_schedule("s1", ["d1"], [{"start": 6, "end": 7, "action": {"id": "turn_on"}}])]
    store.rules = [{
        "id": "r1", "if": "forecast.rain_6h > 1", "then": "Skip", "effect": "skip", "active": True,
        "fire_mode": "every", "targets": [{"schedule_id": "s1", "block_index": None}],
    }]
    hass.states.async_set("switch.pump", "off")
    await scheduler._refresh_forecast_cache()
    await tick_at(scheduler, hass, clock, 6, 0)
    assert calls == [], "rain coming: the block is skipped"
    await tick_at(scheduler, hass, clock, 7, 30)
    data["rain"] = 0.0
    await scheduler._refresh_forecast_cache()
    await tick_at(scheduler, hass, clock, 6, 0, day="2026-09-08")
    assert names(calls) == ["switch.turn_on"], "dry forecast: the block fires"
