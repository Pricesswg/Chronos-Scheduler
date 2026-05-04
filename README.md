# Chronos Scheduler

[![hacs_badge](https://img.shields.io/badge/HACS-Custom-41BDF5.svg)](https://github.com/hacs/integration)
![hass](https://img.shields.io/badge/Home%20Assistant-2024.1%2B-blue.svg)
![license](https://img.shields.io/badge/license-MIT-green.svg)

**Chronos** is an advanced scheduler for Home Assistant. It manages thermostats, lights, blinds, irrigation, switches, fans, water heaters, mowers, vacuums and scenes through daily time slots with **conditional weather rules**.

A single Lovelace card provides:

- Schedule overview with live KPIs
- Linear / radial / list timeline editor with drag-and-drop and 5/15/30/60-minute snap
- IF/THEN weather rules (temperature, rain, wind, UV, sun position, …) to skip, shift, force, or change duration of the active block
- 7-day week view with per-schedule filtering
- Live status with weather and device readings
- 6-step wizard for guided schedule creation
- Scene schedules: a single schedule that activates a different scene per time block
- Recurring yearly date ranges to limit a schedule to specific months/days
- Light advanced parameters (RGB colour, colour temperature, transition) per block
- Per-device and global settings (theme follows Home Assistant, color customisation, sensor-level weather overrides)

All persisted by Home Assistant, accessible via WebSocket API, and auto-registered as a custom card.

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

The frontend card is registered automatically by the integration on every startup:

1. Bundle is copied to `<config>/www/chronos-card.js`
2. Lovelace resource is created/updated to `/local/chronos-card.js?v=<version>` (UI dashboard mode)
3. Fallback `add_extra_js_url` on `/chronos_static/chronos-card.js`

For Lovelace YAML mode, add the resource manually once:

```yaml
resources:
  - url: /local/chronos-card.js?v=1.8.1
    type: module
```

### Manual installation

1. Copy `custom_components/chronos/` (including `www/chronos-card.js`) into `<config>/custom_components/`
2. Restart Home Assistant
3. Settings → Devices & Services → Add Integration → Chronos Scheduler
4. Add `type: custom:chronos-card` in your dashboard

## First-time setup

On first run the integration asks to select a `weather.*` entity to use as the weather source. You can change it later from the in-card Settings, or even leave it empty if you only rely on point sensors (Ecowitt, WeatherFlow, …) configured per attribute under Settings → Weather source → sensor overrides.

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
| `scene.*`        | Scene           | turn_on (selected per block, see below)    |

## Weather rules

A schedule can have any number of weather rules. Each rule has:

- **IF** condition: weather attribute compared with operator and threshold (e.g. `temperature > 22`, `wind_speed > 30`, `sun.minutes_until_sunset < 30`)
- **THEN** action: skip the block, shift the start time, force a specific action, or change duration
- **Fire mode** (when the THEN is "force"):
    - `every` — fires on every false→true transition (use only when desired oscillation is acceptable)
    - `once_per_day` — at most once per calendar day, re-arms at midnight
    - `once_per_daytime` — at most once between sunrise and sunset, re-arms at next sunrise
    - `once_per_nighttime` — at most once between sunset and sunrise, re-arms at next sunset

Rules can be attached to schedules with time blocks (the rule modifies block behaviour) or to schedules with no time blocks at all (pure weather-triggered automation).

## Scene schedules

Scenes are not imported as devices. Instead, create a scene schedule from the overview ("Schedule scenes" button): the schedule has no devices, and each time block picks which `scene.*` entity to activate. This lets a single schedule fire different scenes throughout the day (for example, "morning" at 07:00, "movie" at 21:00, "night" at 23:30).

## Recurring date ranges

Each schedule can be limited to a yearly recurring date range (e.g. 1 May → 30 September). The year is ignored, so the range repeats every year, and ranges that cross year-end are supported (e.g. 1 December → 28 February). When today's date falls outside the range, the schedule is paused without being disabled.

## Time block anchors

Block start and end can be either a fixed hour or anchored to sunrise/sunset with an offset in minutes. The integration resolves the anchor against `sun.sun` on every tick, so a block anchored to `sunset - 15 min` automatically tracks seasonal change.

## Translations

UI is available in Italian, English, French and German. Selectable from Settings → Language. Defaults to Home Assistant's language.

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
