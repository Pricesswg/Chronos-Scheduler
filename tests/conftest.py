"""Shared fixtures: a real Home Assistant core (from
pytest-homeassistant-custom-component), a real ChronosStore on mocked
storage, and a scheduler that is driven by calling _tick() directly, so no
timers are involved and every instant is explicit.

Time is frozen: `clock` starts the day at noon and tests move it with
`tick_at`, which also feeds the same instant to the scheduler. All wall-clock
times are in the test time zone HA installs (US/Pacific), which is why the
helpers below always convert through dt_util."""
from __future__ import annotations

from datetime import datetime

import pytest
from freezegun import freeze_time
from homeassistant.core import HomeAssistant
from homeassistant.util import dt as dt_util

from custom_components.chronos.const import EVENT_BLOCK_EXECUTED
from custom_components.chronos.scheduler import ChronosScheduler
from custom_components.chronos.store import ChronosStore

# A Monday, so days=[1,0,0,0,0,0,0] means "today only".
# Chronos device types are functional ("plug", "light", ...), not HA domains:
# a switch.* entity is a "plug" here.
DAY = "2026-09-07"


@pytest.fixture(autouse=True)
def _custom_integrations(enable_custom_integrations):
    """Let HA import custom_components.chronos."""
    yield


def local(h: int, m: int = 0, day: str = DAY) -> datetime:
    """UTC instant for a local wall-clock time on the fixed test day."""
    y, mo, d = (int(x) for x in day.split("-"))
    return dt_util.as_utc(datetime(y, mo, d, h, m, tzinfo=dt_util.DEFAULT_TIME_ZONE))


@pytest.fixture
def clock():
    with freeze_time(local(12)) as frozen:
        yield frozen


@pytest.fixture
def calls(hass: HomeAssistant) -> list:
    """Every service call Chronos makes, with its context, in order."""
    recorded: list = []

    async def handler(call):
        recorded.append(call)

    for domain in ("switch", "light"):
        for svc in ("turn_on", "turn_off"):
            hass.services.async_register(domain, svc, handler)
    return recorded


@pytest.fixture
def events(hass: HomeAssistant) -> list:
    """chronos_block_executed events, so a call's context can be traced."""
    seen: list = []
    hass.bus.async_listen(EVENT_BLOCK_EXECUTED, lambda e: seen.append(e))
    return seen


@pytest.fixture
async def store(hass: HomeAssistant, hass_storage) -> ChronosStore:
    st = ChronosStore(hass)
    await st.async_load()
    return st


@pytest.fixture
def scheduler(hass: HomeAssistant, store: ChronosStore) -> ChronosScheduler:
    return ChronosScheduler(hass, store)


async def tick_at(scheduler: ChronosScheduler, hass: HomeAssistant, clock, h: int, m: int = 0, day: str = DAY):
    now = local(h, m, day)
    clock.move_to(now)
    await scheduler._tick(now)
    await hass.async_block_till_done()


def make_device(dev_id: str, entity_id: str, dtype: str = "plug") -> dict:
    return {
        "id": dev_id, "entity_id": entity_id, "alias": entity_id, "name": entity_id,
        "type": dtype, "area": "Sala", "enabled": True,
    }


def make_schedule(sched_id: str, device_ids: list[str], blocks: list[dict], *,
                  dtype: str = "plug", enabled: bool = True, days: list[int] | None = None) -> dict:
    return {
        "id": sched_id, "name": sched_id, "device_type": dtype,
        "device_ids": list(device_ids), "blocks": blocks,
        "enabled": enabled, "days": days or [1] * 7,
    }


def names(calls: list) -> list[str]:
    return [f"{c.domain}.{c.service}" for c in calls]


def chained_to_chronos(call, events: list) -> bool:
    """True when the call's context descends from a Chronos event, which is
    what makes the HA logbook say the change came from Chronos."""
    return any(ev.context.id == call.context.parent_id for ev in events)
