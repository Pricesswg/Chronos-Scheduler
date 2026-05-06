# Chronos Scheduler  

[![hacs_badge](https://img.shields.io/badge/HACS-Custom-41BDF5.svg)](https://github.com/hacs/integration)
![hass](https://img.shields.io/badge/Home%20Assistant-2024.1%2B-blue.svg)
![license](https://img.shields.io/badge/license-MIT-green.svg)

**Chronos** is an advanced scheduler for Home Assistant. It manages thermostats, lights, blinds, irrigation, switches, fans, water heaters, mowers, vacuums, scenes, automations and alarm panels through daily time slots with **conditional weather rules**.

A single Lovelace card provides:

- Schedule overview with live KPIs
- Linear / radial / list timeline editor with drag-and-drop and 5/15/30/60-minute snap
- IF/THEN weather rules (temperature, rain, wind, UV, sun position, …) to skip, shift, force, or change duration of the active block
- 7-day week view with per-schedule filtering
- Live status with weather and device readings
- 6-step wizard for guided schedule creation
- Scene schedules: a single schedule that fires one or more scenes per time block (multi-select picker)
- Automation schedules: a single schedule that turns on/off or triggers one or more HA automations per time block
- Service-call schedules: each block invokes any HA service (mqtt.publish, backup.create, script.run, …) with an optional JSON service_data payload
- Helper entity support: `input_boolean` (flag toggling), `input_number` (numeric values), `input_select` (option selection), so existing automations that use these as conditions don't need rewriting
- Execution history screen with date range filter, schedule / kind / outcome filters, daily bar chart and detailed event list, useful for debugging schedules that didn't fire as expected
- Per-block device subset: in a multi-device schedule, each block can target a custom subset of those devices
- Recurring yearly date ranges to limit a schedule to specific months/days
- Light advanced parameters (RGB colour, colour temperature, transition) per block
- Per-device and global settings (theme follows Home Assistant, color customisation, sensor-level weather overrides)

All persisted by Home Assistant, accessible via WebSocket API, and auto-registered as a custom card.

## Documentation

The full user guide is in [`docs/USER_GUIDE.md`](docs/USER_GUIDE.md). It covers every section of the card with screenshots: overview, schedule editor (linear / radial / list), weather rules, live status, week view, device management, examples, and settings.

The in-card Help screen has a quick start, a short FAQ, and a link to the full guide.

## Quick start

1. Install Chronos via HACS (see Installation below) and restart Home Assistant.
2. Add the card to any dashboard:
   ```yaml
   type: custom:chronos-card
   ```
3. Open the card and go to **Manage devices** → import the entities you want to control (e.g. `light.living_room`, `climate.kitchen`).
4. Hit **+ New schedule** in the overview, follow the wizard.
5. Add time blocks on the timeline. Each block has a start, an end, an action (e.g. "Turn on at 80%"), and optional weather rules.

A typical first schedule: turn on the living room light from sunset to 23:00. Pick the light, drop a single block from `sunset` to `23:00`, action `Turn on`, brightness `80%`. Save. Done.

![Overview](docs/images/overview.PNG)

## Installation

### Through HACS (recommended)

1. HACS → Integrations → top-right menu → Custom repositories
2. Add `https://github.com/Pricesswg/Chronos-Scheduler` as Integration
3. Search for "Chronos Scheduler" in HACS, click Download
4. Restart Home Assistant
5. Settings → Devices & Services → Add Integration → Chronos Scheduler
6. Add the card to any dashboard:
   ```yaml
   type: custom:chronos-card
   ```

The frontend card is loaded automatically by the integration on every startup via two mechanisms:

1. The bundle is copied to `<config>/www/chronos-card.js` so it's available at `/local/chronos-card.js`.
2. The integration calls `add_extra_js_url` on `/chronos_static/chronos-card.js`, which makes the frontend load the JS and register the `<chronos-card>` custom element. This is enough to use `type: custom:chronos-card` in any dashboard, both storage and YAML mode.

When you install via HACS, HACS also adds a Lovelace resource entry pointing to the bundle. The integration does **not** register that entry on its own (since v1.10.4), to avoid conflicting writes against the resource collection. If you installed manually outside HACS and want a visible Lovelace resource entry too, add it once from **Settings → Dashboards → Resources**:

```yaml
url: /local/chronos-card.js
type: module
```

### Manual installation

1. Copy `custom_components/chronos/` (including `www/chronos-card.js`) into `<config>/custom_components/`
2. Restart Home Assistant
3. Settings → Devices & Services → Add Integration → Chronos Scheduler
4. Add `type: custom:chronos-card` in your dashboard

## First-time setup

On first run the integration asks to select a `weather.*` entity to use as the weather source. You can change it later from the in-card Settings, or even leave it empty if you only rely on point sensors (Ecowitt, WeatherFlow, …) configured per attribute under Settings → Weather source → sensor overrides.

## Card configuration

Most users don't need to configure anything: schedules, devices, weather rules and integration settings live inside the card UI (no YAML to edit). The dashboard's "Edit card" dialog also opens a GUI form for the few presentation options the card exposes.

### Minimal example

```yaml
type: custom:chronos-card
```

That's it — Chronos works out of the box.

### Full example

```yaml
type: custom:chronos-card
title: Home schedules            # optional header above the card
default_screen: overview         # which screen opens first
collapse_sidebar: false          # start with sidebar in mini mode
mobile_threshold: 700            # px below which the drawer layout kicks in
```

### Available options

| Option              | Type                | Default      | Description                                                                  |
|---------------------|---------------------|--------------|------------------------------------------------------------------------------|
| `title`             | string              | —            | Header text shown above the card. Empty / unset hides the header.            |
| `default_screen`    | string              | `overview`   | Initial screen. One of: `overview`, `editor`, `week`, `weatherRulesList`, `device`, `live`, `wizard`, `devices`, `settings`, `help`. |
| `collapse_sidebar`  | boolean             | `false`      | Start the sidebar collapsed (mini mode) on desktop.                          |
| `mobile_threshold`  | number              | `700`        | Pixel width below which the card switches to the drawer layout. `0` disables mobile mode. |

All schedule, device and weather-rule data is persisted by the integration via WebSocket API — the card config only controls presentation.

## Supported domains

| HA domain        | Chronos type    | Typical capabilities                       |
|------------------|-----------------|--------------------------------------------|
| `climate.*`      | Thermostat      | set_temperature, set_hvac_mode, set_preset |
| `light.*`        | Light           | turn_on, turn_off, brightness, color       |
| `cover.*`        | Blind           | open, close, set_position                  |
| `switch.*`       | Plug            | turn_on, turn_off                          |
| `fan.*`          | Fan             | turn_on, set_percentage, oscillate         |
| `vacuum.*`       | Vacuum          | start, pause, return_to_base               |
| `lawn_mower.*`   | Mower           | start_mowing, dock, pause                  |
| `water_heater.*` | Water heater    | set_temperature, set_operation_mode        |
| `valve.*`        | Irrigation      | open_valve, close_valve                    |
| `alarm_control_panel.*` | Alarm    | arm_home, arm_away, arm_night, arm_vacation, disarm, trigger |
| `input_boolean.*` | Boolean helper | turn_on, turn_off, toggle (typical use: flip flags consumed by your existing automations) |
| `input_number.*` | Numeric helper  | set_value                                  |
| `input_select.*` | Select helper   | select_option                              |
| `scene.*`        | Scene           | turn_on (multi-select per block, see below) |
| `automation.*`   | Automation      | turn_on, turn_off, trigger (multi-select per block) |
| (no domain)      | Service         | Generic HA service call: any `domain.service` with optional JSON service_data. Useful for `mqtt.publish`, `backup.create`, `script.run`, debug-style invocations |

## Weather rules

A schedule can have any number of weather rules. Each rule has:

- **IF** condition: one or more comparisons combined with **AND**. Each comparison is `<key> <op> <threshold>`, where the key can be:
    - a weather attribute (`temperature`, `feels_like`, `humidity`, `dew_point`, `wind_speed`, `wind_gust`, `wind_bearing`, `pressure`, `uv_index`, `solar_radiation`, `rain_rate`, `rain_state`, `condition`)
    - a sun attribute (`sun.elevation`, `sun.minutes_until_sunrise`, `sun.minutes_until_sunset`, `sun.state`)
    - a forecast attribute (`forecast.temp_max_today`, `forecast.rain_6h`, `forecast.condition_6h`, …)
    - any HA entity_id whose state is read directly: `sensor.*`, `binary_sensor.*`, `number.*`, `input_number.*` (introduced in v1.10 — useful for off-grid setups, battery SOC, PV forecast aggregators, instantaneous power, etc.)

Each weather attribute can be sourced from the configured weather entity OR overridden per-attribute in Settings → Weather source → sensor overrides. Useful when you have a local weather station (Ecowitt, WeatherFlow, Davis) with sensors more accurate than the cloud weather provider — point each attribute at its corresponding `sensor.*` entity.
- **THEN** action: skip the block, shift the start time, force a specific action, or change duration
- **Fire mode** (when the THEN is "force"):
    - `every` — fires on every false→true transition (use only when desired oscillation is acceptable)
    - `once_per_day` — at most once per calendar day, re-arms at midnight
    - `once_per_daytime` — at most once between sunrise and sunset, re-arms at next sunrise
    - `once_per_nighttime` — at most once between sunset and sunrise, re-arms at next sunset

Rules can be attached to schedules with time blocks (the rule modifies block behaviour) or to schedules with no time blocks at all (pure weather-/sensor-triggered automation).

### Compound conditions (AND)

Add as many AND clauses as you need from the rule builder. All clauses must be true for the rule to fire. Examples:

- `sensor.battery_soc > 96 AND sun.minutes_until_sunset > 120` — turn on the second water heater when the off-grid battery is near full and there are at least two hours of sunlight left to keep replenishing it.
- `sensor.battery_soc < 40 AND sensor.pv_forecast_tomorrow_kwh < 8` — switch outdoor lights to low-power mode when the battery is below 40% and the next-day solar forecast is poor.
- `temperature > 28 AND humidity > 70` — extend a fan schedule when both heat and humidity are high.

OR composition is not supported yet — split into two separate rules with the same effect to emulate it.

## Scene and automation schedules

Scenes and automations are not imported as devices. Instead, create a dedicated schedule from the overview:

- **Schedule scenes** — each time block picks one or more `scene.*` entities to activate (multi-select).
- **Schedule automations** — each block picks one or more `automation.*` entities and one of three actions: `turn_on`, `turn_off`, `trigger`.

A single schedule can therefore fire different scenes (or toggle different automations) throughout the day — for example "morning" at 07:00, "movie" at 21:00, "night" at 23:30.

## Helper entities and service calls

Chronos supports HA helper entities directly so you can keep your existing automations and let Chronos drive their inputs:

- `input_boolean.*` — three actions: turn on, turn off, toggle. The most common pattern is to use these as flag conditions in your existing automations and let Chronos flip them at the right times.
- `input_number.*` — single action `set_value` for numeric helpers used as thresholds.
- `input_select.*` — single action `select_option` for state-machine helpers; the option name is a free string the user types.

For anything else, the **service-call schedule** invokes an arbitrary HA service per block. The block stores a `domain.service` string and an optional JSON `service_data` payload. Examples:

```yaml
# Block 1: morning MQTT announce
service: mqtt.publish
service_data:
  topic: home/morning
  payload: "good morning"

# Block 2: nightly backup
service: backup.create

# Block 3: trigger a custom script
service: script.run
service_data:
  entity_id: script.evening_routine
```

Note on `schedule.*` (HA Schedule helper): Chronos does NOT import these as devices because they're inherently read-only state sources, not action targets. If you want to condition a Chronos block on whether an HA Schedule helper is currently active, reference it directly in the weather rule IF expression: `schedule.work_hours == on`.

## Execution history

A dedicated History screen lists every block dispatch and rule trigger Chronos performed, with date-range and outcome filters. Each entry records timestamp, schedule, target entity, action, value, and ok/error status (with the error message when applicable). The page also shows a daily bar chart split between successful and failed executions. The store keeps the last 5000 events on disk.

Useful for debugging "why didn't my schedule fire" or "did the SOC rule trigger last night".

## Per-block device subset

In a multi-device schedule, each time block can target a custom subset of the schedule's devices. The block detail panel shows an "Active devices for this block" chip selector with an "All" pill (default). Toggling individual chips restricts the dispatch for that block only — useful when, say, only 3 of 4 lights should turn on between 22:00 and 23:00, but all 4 should turn off at 06:00.

## Recurring date ranges

Each schedule can be limited to a yearly recurring date range (e.g. 1 May → 30 September). The year is ignored, so the range repeats every year, and ranges that cross year-end are supported (e.g. 1 December → 28 February). When today's date falls outside the range, the schedule is paused without being disabled.

## Time block anchors

Block start and end can be either a fixed hour or anchored to sunrise/sunset with an offset in minutes. The integration resolves the anchor against `sun.sun` on every tick, so a block anchored to `sunset - 15 min` automatically tracks seasonal change.

## Translations

UI is available in Italian, English, French and German. Selectable from Settings → Language. Defaults to Home Assistant's language.

## Support the integration

You can support the development of this scheduler by giving a small donation here:
<a href='https://ko-fi.com/W7W21XGKFV' target='_blank'><img height='36' style='border:0px;height:36px;' src='https://storage.ko-fi.com/cdn/kofi2.png?v=6' border='0' alt='Buy Me a Coffee at ko-fi.com' /></a>

## Services

| Service               | Description                                                              |
|-----------------------|--------------------------------------------------------------------------|
| `chronos.reload`      | Reload Chronos configuration from storage                                |
| `chronos.fire_block`  | Fire the currently active block of a schedule (bypass timing and rules)  |

## Development

Source layout:

```
custom_components/chronos/    # Python integration
├── __init__.py               # Entry, WS commands, frontend card auto-registration
├── scheduler.py              # 1-min tick, weather rule evaluator, action dispatcher
├── store.py                  # Persistence via HA Store API
├── config_flow.py            # Setup UI
├── const.py                  # Device types, actions, weather attributes
├── brand/icon.png            # HA Brands Proxy icon (2026.3+)
└── www/chronos-card.js       # Frontend bundle (committed)

chronos-card/                 # TypeScript / Lit sources
└── src/
    ├── chronos-card.ts       # Main custom element
    ├── timeline.ts           # Linear / radial / list timeline
    ├── i18n.ts               # IT / EN / FR / DE strings
    └── screens/              # 9 screens
```

To rebuild the frontend bundle:

```sh
cd chronos-card
npm install
npm run build
```

Releases are produced via `scripts/release.sh <version> "<release notes>"` which bumps versions in `const.py`, `manifest.json`, and `chronos-card/src/version.ts`, rebuilds, commits, tags, pushes and creates the GitHub release.

## License

MIT — see [LICENSE](LICENSE).
