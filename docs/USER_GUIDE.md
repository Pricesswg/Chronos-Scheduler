# Chronos Scheduler User Guide

Chronos Scheduler lets you create visual schedules for Home Assistant entities without writing YAML.

The workflow is simple:

1. Import the Home Assistant entities you want to control.
2. Create a schedule.
3. Add one or more time blocks.
4. Choose what each block should do.
5. Optionally add weather rules.
6. Use the Live status and Week view sections to verify what Chronos is doing.

> **Important**  
> The **Linear**, **Radial** and **List** views are only three different ways to display and edit the same schedule. They do not change how the schedule runs.

---

## Core concepts

### Device

A device is a Home Assistant entity imported into Chronos.

Examples:

```text
light.living_room
climate.living_room_thermostat
switch.water_heater
valve.irrigation_zone_1
cover.bedroom_blind
```

Chronos does not replace the original Home Assistant entity. It only uses that entity as a target for scheduled actions.

---

### Schedule

A schedule is a daily plan made of one or more time blocks.

A schedule can control a single device or multiple compatible devices. For example, one heating schedule can control several thermostat valves, while each time block can still target all devices or only selected devices.

---

### Time block

A time block defines what Chronos should do during a specific part of the day.

Example:

```text
00:00 → 05:00    sleep
05:00 → 08:00    21°C
08:00 → 16:00    away
16:00 → 17:00    boost
17:00 → 22:00    21°C
22:00 → 23:55    sleep
```

Each block has:

| Setting | Description |
|---|---|
| Start time | When the block starts |
| End time | When the block ends |
| Action | What Chronos should do |
| Value | The value used by the selected action |
| Target devices | Which devices are controlled by that block |
| Weather rules | Optional rules that can modify or skip the block |

Available actions depend on the Home Assistant domain of the selected device.

| Device type | Example actions |
|---|---|
| Thermostat | Set temperature, set preset, turn off |
| Water heater | Set temperature, operation mode, turn off |
| Light | Turn on, turn off, brightness, RGB color, color temperature, transition |
| Switch (plug) | Turn on, turn off |
| Cover (blind) | Open, close, set position |
| Irrigation valve | Start with duration, stop. See the Irrigation section. |
| Fan | Turn on with speed, turn off |
| Mower | Start, pause, dock |
| Vacuum | Start, pause, return to base |
| Alarm panel | Arm home/away/night/vacation, disarm, trigger |
| Helper boolean | Turn on, turn off, toggle |
| Helper number | Set value |
| Helper select | Select option |
| Scene | Activate one or more scenes |
| Automation | Turn on, turn off, trigger |
| Service | Call any Home Assistant service with optional JSON data |

Helper entities (`input_boolean`, `input_number`, `input_select`) let Chronos flip flags, thresholds and state machines at the right times, so existing automations that read them do not need rewriting.

---

## Sections

## Overview

![Overview](images/overview.PNG)

The **Overview** section is the main dashboard of Chronos.

Use this section to quickly check the status of your schedules and access the main actions.

You can see:

| Element | Meaning |
|---|---|
| Active schedules | How many schedules are currently enabled |
| Weather rules | How many weather rules are configured |
| Current time | The time used by Chronos for live updates |
| Schedule cards | Compact previews of each schedule |
| Status badges | Whether a schedule is active, disabled or affected by rules |

From this section you can:

- Create a new schedule.
- Open an existing schedule.
- Enable or disable a schedule.
- Open the Week view.
- Create schedules for scenes.
- Create schedules for automations.
- Create schedules for service calls.
- Duplicate an existing schedule.

---

## Schedule editor

The **Schedule editor** is where you configure the daily timeline.

Chronos provides three timeline views:

- **Linear**
- **Radial**
- **List**

These are only visual editing sections. They all modify the same schedule.

Changing from Linear to Radial or List does not create a different schedule and does not change the execution logic.

The chosen view is remembered per schedule: pick List for your irrigation schedule and Radial for the thermostat, and each one reopens in its own view. The change is saved immediately (it does not count as an unsaved edit). Schedules where you never picked a view follow the default under **Settings → Default timeline**.

---

### Linear section

![Schedule linear view](images/schedule2.PNG)

The **Linear** section shows the full 24 hour day as a horizontal timeline.

This is usually the best section for creating or editing a schedule visually.

Use it when you want to:

- Drag blocks on the timeline.
- Resize blocks by changing their start or end time.
- See empty spaces between blocks.
- Understand the full day at a glance.

Blocks cannot overlap. Dragging a block (or one of its edges) over a neighbour trims the neighbour to the new limit: a block that ends up fully covered is removed, one covered in the middle is split in two, and leftovers shorter than 15 minutes are dropped. The trimming is only committed when you release: while the pointer is down you can swing back and the neighbour is restored. The same rules apply on the radial view.

The thin strip at the top of the linear timeline is today's hourly weather forecast from your configured weather entity, aligned with the hour axis (past hours are empty). Hover a cell to see the hour and the condition.

The timeline follows the snap value configured in Settings.

Example:

| Snap value | Result |
|---|---|
| 5 minutes | More precise editing |
| 15 minutes | Balanced editing |
| 30 minutes | Cleaner schedules |
| 1 hour | Simple routines |

---

### Radial section

![Schedule radial view](images/schedule3.PNG)

The **Radial** section shows the day as a circular 24 hour timeline.

Use it when you want a more visual representation of the whole daily cycle.

This section is useful for:

- Heating schedules.
- Day and night routines.
- Lighting cycles.
- Schedules that repeat every day.
- Showing the logic of a schedule to another person.

The Radial section is mainly a readability tool. It helps you understand how the day is divided, especially when the schedule has several blocks.

---

### List section

![Schedule list view](images/schedule1.PNG)

The **List** section shows every time block as a separate row.

Use it when you want maximum precision and less visual clutter.

This section is useful for:

- Checking exact start and end times.
- Editing many blocks.
- Reviewing complex schedules.
- Avoiding mistakes when blocks are close together.

Each row shows:

| Field | Description |
|---|---|
| Time range | Start and end time of the block |
| Action | Action executed by Chronos |
| Duration | Total block duration |

---

## Selected block panel

When you select a time block, the right panel shows the details of that block.

From this panel you can configure:

| Setting | Description |
|---|---|
| From | Start of the block |
| To | End of the block |
| Action | Service or behavior to execute |
| Value | Value used by the selected action |
| Devices active for this block | Devices affected by this block |

A block can use a fixed time or, when supported, a sun based time.

Example:

```text
From: sunset minus 30 minutes
To: 23:00
Action: turn on light
```

This allows schedules to automatically follow seasonal changes.

---

## Devices active for this block

A schedule can control more than one device.

Inside each block, you can decide whether the block applies to all linked devices or only to selected devices.

By default, **All** is selected.

Example:

```text
18:00 → 22:00    turn on only living room lights
22:00 → 23:55    turn off all selected lights
```

This avoids creating many separate schedules when several devices mostly follow the same routine.

---

## Repeat section

The **Repeat** section controls when the schedule is allowed to run.

You can select:

- Individual weekdays.
- Every day.
- Weekdays.
- Weekend.

You can also enable a yearly recurring date range.

This is useful for seasonal schedules.

Examples:

```text
Irrigation active only from May to September
Heating active only from October to April
Christmas lights active only in December
```

When the current date is outside the configured range, the schedule is automatically ignored.

---

## Weather rules section

![Weather rules](images/weather.PNG)

Weather rules let Chronos adapt schedules using weather data, forecast data, sun position or Home Assistant sensors.

Each rule follows this logic:

```text
IF condition is true
THEN apply effect
```

Examples:

```text
IF forecast.temp_min_today > 22°C
THEN skip heating

IF condition is rainy
THEN skip irrigation

IF wind_speed > 30 km/h
THEN close blinds

IF temperature > 28 AND humidity > 70
THEN extend the fan block
```

### Rules are independent and shared (since 1.17)

A weather rule is its own object, not a property of a single schedule. Each rule has a list of **targets**, where every target is a schedule plus the block it applies to. This means:

- one rule can drive several schedules at once, for example a single "wind > 30 km/h" rule that closes the blinds and skips the irrigation, and
- one schedule can combine any number of rules.

Rules created in older versions are migrated automatically the first time the new version starts. Nothing is lost.

You manage rules in two places:

- The **Weather rules** screen lists every rule with chips for the schedules it targets. You can filter by schedule and sort the list by linked schedule, alphabetically, or manually. The manual order is set by drag and drop or the per row up and down buttons, and it is saved (manual reordering is available when no schedule filter is active).
- A schedule's editor shows the rules targeting that schedule. A counter chip marks rules shared with other schedules. Removing a rule there only detaches it from that schedule; the rule itself is deleted only when that was its last link.

### Conditions

A condition is one or more comparisons combined with `AND`. Every comparison is `key operator value`, and all of them must be true for the rule to apply.

The key can be:

| Key type | Examples |
|---|---|
| Weather attribute | `temperature`, `humidity`, `wind_speed`, `wind_gust`, `pressure`, `uv_index`, `solar_radiation`, `rain_rate`, `condition` |
| Sun attribute | `sun.elevation`, `sun.minutes_until_sunrise`, `sun.minutes_until_sunset`, `sun.state` |
| Forecast attribute | `forecast.temp_max_today`, `forecast.temp_min_today`, `forecast.rain_6h`, `forecast.condition_6h` |
| Home Assistant entity | `sensor.*`, `binary_sensor.*`, `number.*`, `input_number.*`, read directly from the entity state |

Reading any sensor directly is useful for off grid setups, battery state of charge, photovoltaic forecast aggregators or instantaneous power.

### Effects

| Effect | Description |
|---|---|
| Skip | The block is not executed |
| Shift | The block start and end move earlier or later by a number of minutes |
| Extend / Shrink | The block duration grows or shrinks; you choose whether the start or the end moves |
| Force action | A chosen action runs once when the condition becomes true, gated by the fire mode |
| Replace value | The block action value is replaced |
| Scale duration | The block duration is interpolated from a weather variable over a range |
| Scale value | The action value is interpolated from a weather variable over a range |

Continuous effects (shift, extend, shrink, replace value, scale duration, scale value) are recomputed every minute from live weather. The stored schedule is never changed; the effect is applied on the fly.

Effects that use device specific actions (force action, replace value, scale value) require every linked schedule to share the same device type.

### Fire modes

For the force action effect, the fire mode limits how often it can fire:

| Fire mode | Meaning |
|---|---|
| Every time | Each time the condition becomes true |
| Once per day | At most once per calendar day |
| Once per daytime | At most once between sunrise and the next sunset |
| Once per nighttime | At most once between sunset and the next sunrise |

---

## Live status section

![Live status](images/livestatus.PNG)

The **Live status** section shows what Chronos is doing right now.

This is the first section to check when something does not behave as expected.

You can see:

| Element | Description |
|---|---|
| Weather source | The Home Assistant weather entity used by Chronos |
| Current weather | Current temperature, condition and wind, in the units reported by the weather entity |
| 24 hour forecast | Forecast strip used by rules, color coded by severity |
| Active schedules | Schedules currently evaluated by Chronos |
| Current block | The block currently running |
| Next block | The next scheduled block |
| Rule effects | Whether a weather rule is changing the normal behavior |

Each forecast cell is colored by weather severity: green for fine conditions, yellow for cloud or fog, orange for rain, red for storms, hail or snow. Each cell also shows the hourly wind speed, and strong wind raises the severity even when the sky is clear (at least yellow from 30 km/h, orange from 50, red from 70). This makes it easy to decide at a glance whether to let wind sensitive schedules such as awnings or blinds run.

A schedule is only shown as active when it actually runs today, honoring the weekday mask, the yearly date range and sunrise/sunset anchors. A schedule that does not run today is clearly marked.

Use this section to understand why a schedule is running, waiting, skipped or modified.

---

## Week view section

![Week view](images/week.PNG)

The **Week view** section shows all schedules across the next seven days.

Use this section to verify the complete weekly behavior.

It is useful for:

- Checking schedules that run only on specific days.
- Comparing multiple schedules.
- Finding overlaps.
- Finding unexpected inactive periods.
- Verifying the effect of repeat settings.

You can filter schedules using the chips at the top of the page.

---

## Manage devices section

![Manage devices](images/manage.PNG)

The **Manage devices** section shows the Home Assistant entities imported into Chronos.

Each row shows:

| Field | Description |
|---|---|
| Device name | Nickname used inside Chronos. Click it (or the pencil) to rename; the Home Assistant friendly name is not touched |
| Entity ID | Home Assistant entity ID |
| Area | Room assigned in Home Assistant, resolved automatically from the HA registries (an area set manually in Chronos takes precedence) |
| Device type | Detected domain or category |
| Current state | Current state reported by Home Assistant |
| Remove | Removes the entity from Chronos |

The area is also shown in the wizard's device picker and in the add-device list, so several devices that share the same friendly name (three "Thermostat"s in different rooms) stay distinguishable. Hovering a device tile in the wizard shows its entity ID.

Use this section to:

- Add a Home Assistant entity to Chronos.
- Remove an entity from Chronos.
- Check if a device is on or off.
- Verify how Chronos classified an entity.

Removing a device from Chronos does not delete it from Home Assistant. It only removes it from Chronos scheduling.

---

## Device detail section

![Device detail](images/device.PNG)

The **Device detail** section shows information about a single imported entity.

You can see:

| Element | Description |
|---|---|
| Current state | Current state of the entity |
| Device type | Type detected by Chronos |
| Linked schedules | Schedules that use this device |
| Detected capabilities | Home Assistant services Chronos can call on this entity |

Example for a thermostat:

```text
climate.set_temperature
climate.set_hvac_mode
climate.set_preset_mode
```

Use this section when an action is missing or when you want to understand which services are available for a device.

---

## Examples section

![Examples](images/examples.PNG)

The **Examples** section contains ready made schedule templates.

Use this section when you are not sure where to start.

Available examples include:

| Example | Purpose |
|---|---|
| Day/night heating | Alternates lower night and comfortable daytime temperatures |
| Lights at sunset | Turns lights on around sunset |
| Wind safe automatic blinds | Protects blinds using a wind rule |
| Morning irrigation with rain skip | Runs irrigation only when the forecast is dry |
| Night ECO water heater | Reduces energy use at night |
| Daily routine with scenes | Activates scenes during the day |
| Arm alarm at night | Arms night mode overnight, disarms during the day |
| Off grid water heater | Boosts when the battery is full and there is still daylight |
| Heat scaled fan | Fan speed rises with the temperature |
| Summer heat shading blinds | Lowers the blinds when the sun is high and it is hot, summer only |
| Solar surplus load | A midday plug window skipped on overcast days |
| Weekday robot vacuum | Cleaning on weekday mornings |
| Seasonal pool pump | Filtering time grows with the temperature, summer only |

After creating an example schedule, open it and adapt:

- Time blocks.
- Devices.
- Actions.
- Weather rules.
- Repeat days.

---

## Settings section

The **Settings** section controls the global behavior of Chronos.

These settings apply to all schedules.

---

### Language and weather source

![Settings weather source](images/settings1.PNG)

The language option controls the Chronos interface language.

Available options:

- Auto, follow Home Assistant.
- Italian.
- English.
- French.
- German.

The weather source controls which Home Assistant entity Chronos uses for weather rules.

You can select a main `weather.*` entity and optionally override specific attributes with dedicated sensors.

This is useful if you have a local weather station.

Example:

```text
Temperature from a local outdoor sensor
Humidity from a local humidity sensor
Wind speed from a local anemometer
Dew point from a local weather station
```

If an override is empty, Chronos uses the main weather entity for that attribute.

---

### Execution behavior

![Settings behavior](images/settings2.PNG)

The **Execution behavior** settings control how often Chronos updates and how precise the editor should be.

| Setting | Description |
|---|---|
| Weather polling | How often weather rules are re evaluated |
| Timeline snap | Editing precision when moving or resizing blocks |

Example:

```text
5 minute snap: precise schedules
30 minute snap: cleaner schedules
1 hour snap: simple routines
```

---

### Notifications

The **Notifications** settings control which Home Assistant notifications Chronos should send.

You can enable notifications for:

| Notification | Meaning |
|---|---|
| Block executed | A time block has been executed |
| Weather rule triggered | A weather rule has affected a schedule |
| Schedule skipped | A block or schedule has been skipped |
| Command error | A Home Assistant service call failed |

These notifications are useful for testing and troubleshooting.

---

### Appearance

The **Appearance** settings control how dense the Chronos interface is.

| Option | Description |
|---|---|
| Comfortable | More spacing, easier to read |
| Compact | More information visible on screen |

The default timeline option chooses which editor section opens first:

- Linear.
- Radial.
- List.

---

### Device colors

![Settings colors](images/settings3.PNG)

The **Device colors** settings control how devices are represented in timelines and cards.

For lights, Chronos can use the real RGB color from Home Assistant when available.

For thermostats and water heaters, Chronos can use temperature gradients.

Example:

| Temperature range | Example color meaning |
|---|---|
| Low temperature | Blue |
| Comfort temperature | Green |
| High temperature | Yellow |
| Very high temperature | Red |

You can customize thresholds and colors to match your preferences.

---

## Scene schedules

Scene schedules are used to activate one or more Home Assistant scenes at specific times.

Scenes are not managed from the normal device list. They have a dedicated schedule type.

Example:

```text
07:00    activate Morning scene
20:30    activate Evening scene
23:30    activate Night scene
```

A single time block can activate multiple scenes.

Use scene schedules when you already have Home Assistant scenes and you want Chronos to decide when they should run.

---

## Automation schedules

Automation schedules are used to control Home Assistant automations.

Each block can:

- Turn on one or more automations.
- Turn off one or more automations.
- Trigger one or more automations.

Use automation schedules when you want to enable, disable or manually trigger existing automations based on time, sun position or weather rules.

---

## Service schedules

Service schedules call any Home Assistant service at specific times. Each block holds a service path and an optional JSON payload.

Example:

```text
07:30    mqtt.publish        {"topic": "home/wake", "payload": "on"}
03:00    backup.create       {}
20:00    script.evening_run  {}
```

Use service schedules for actions that are not tied to a single device, such as backups, MQTT messages, scripts or debug style invocations. If the service path is wrong, the error is recorded in the History section.

---

## Irrigation

Irrigation schedules drive valve entities. A start block opens valves; Chronos closes them for you. There are two modes.

**Global timed mode** is the default. Every valve in the block opens at the same time and closes automatically after the block duration in minutes. A block without a valid duration keeps the old behavior of opening the valves and leaving them open.

**Per valve sequential mode** opens the valves one at a time, each for its own number of minutes, then moves to the next. The total program length is the sum of the individual times. This suits multi station controllers where stations must run one after another because of water pressure limits.

Both modes are restart safe. If Home Assistant restarts while watering, any valves left open are closed defensively on the next start and the event is recorded in History. Only one timed program per schedule runs at a time, so a re trigger while watering does not start a second timer on the same valves.

To skip watering when rain is likely, add a weather rule such as `forecast.rain_6h > 2` with the skip effect on the watering block.

---

## History section

The **History** section is a log of everything Chronos has dispatched. It is the place to look when a schedule did not behave as expected.

You can filter by date range, by schedule, by kind (block or rule) and by outcome (success or error). A daily bar chart summarizes activity, and a detailed list shows each event with its time, action, target entity and any error message. Integration restarts and defensive valve closures are recorded here too.

---

## Duplicate, export and import

You can reuse schedules without rebuilding them.

- **Duplicate** copies an existing schedule. The copy button in the schedule editor, and the first step of the wizard, open a dialog where you adjust the name, devices, days and whether to copy the weather rules before the copy is created. Copies start disabled.
- **Export** saves a schedule as a JSON file from the schedule editor. Device links are exported as entity ids, and the weather rules targeting the schedule travel with it.
- **Import** reads a JSON export in the first step of the wizard, by pasting it or choosing a file. Devices are re matched by entity id; any that do not exist on this instance are reported so you can import and link them. Imported schedules start disabled.

Exports stay compatible across versions, so a schedule exported from one Home Assistant instance can be imported into another.

---

## Controlling Chronos from Home Assistant

Schedules are deliberately not exposed as Home Assistant entities, to avoid filling your instance with switches. To drive Chronos from automations or scripts, use its services:

| Service | What it does |
|---|---|
| `chronos.schedule_toggle` | Enables or disables a schedule, same as the toggle in the card. Target by `name` (case-insensitive, must be unique among your schedules) or by `schedule_id`. |
| `chronos.fire_block` | Fires the currently active block of a schedule immediately, bypassing timing and weather rules. Useful for testing. |
| `chronos.reload` | Reloads the Chronos configuration from storage. |

Example, pausing irrigation while a vacation flag is on:

```yaml
automation:
  - alias: Pause irrigation on vacation
    triggers:
      - trigger: state
        entity_id: input_boolean.vacation
        to: "on"
    actions:
      - action: chronos.schedule_toggle
        data:
          name: Garden irrigation
          enabled: false
```

If two schedules share the same name, the service refuses to guess: it logs a warning listing the matching ids, and you switch to `schedule_id`. To find a schedule's id, open it in the editor and click the monospace ID chip in the header, which copies it to the clipboard.

---

## Troubleshooting

### My schedule does not run

Check the following:

- The schedule is enabled.
- The current day is selected in the Repeat section.
- The current date is inside the yearly date range, if enabled.
- The target device is still available in Home Assistant.
- The active block targets the correct device.
- A weather rule is not skipping the block.

Then open the **Live status** section to see what Chronos is doing right now.

---

### My block is skipped

Open the schedule and check the **Weather rules** section.

A rule may be active and may be skipping the block because its condition is true.

Examples:

```text
Heating skipped because forecast.temp_min_today > 22°C
Irrigation skipped because condition is rainy
```

---

### The timeline looks different from the screenshots

Chronos has three schedule editor sections:

- Linear.
- Radial.
- List.

They are only different visual representations of the same schedule.

You can switch between them inside the schedule editor or choose the default one in Settings.

---

### I cannot find scenes or automations in Manage devices

This is expected.

Scenes and automations use dedicated schedule types.

Create them from the Overview section using:

- **Schedule scenes**
- **Schedule automations**

---

### I changed something but nothing happens

Check the following:

- Changes were saved.
- The schedule is enabled.
- The selected block is currently active.
- The target device is available in Home Assistant.
- A weather rule is not overriding the normal behavior.

If command error notifications are enabled, Chronos can notify you when a Home Assistant service call fails.

---

## Recommended first test

For the first test, start with a simple light schedule.

Example:

```text
18:00 → 23:00    turn on light
23:00 → 23:55    turn off light
```

After this works, try adding:

- A second block.
- A weather rule.
- Multiple devices.
- The Week view.
- The Live status section.

Once the basic workflow is clear, you can create more advanced schedules for heating, irrigation, blinds, water heaters, scenes and automations.

