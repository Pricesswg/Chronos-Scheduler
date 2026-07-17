DOMAIN = "chronos"
VERSION = "1.26.2"
STORAGE_VERSION = 1
STORAGE_KEY_DEVICES = f"{DOMAIN}.devices"
STORAGE_KEY_SCHEDULES = f"{DOMAIN}.schedules"
STORAGE_KEY_SETTINGS = f"{DOMAIN}.settings"
STORAGE_KEY_HISTORY = f"{DOMAIN}.history"
# Tracks in-flight sequential irrigation programs so that, after an HA or
# integration restart mid-watering, Chronos can defensively close the
# valves that were left open and record a restart-abort history event.
STORAGE_KEY_SEQUENCES = f"{DOMAIN}.sequences"
# Weather rules v2 (1.17+): rules live in their own store, decoupled from
# schedules. Each rule has a stable id and a list of targets
# ({schedule_id, block_index}), so one rule can drive several schedules.
STORAGE_KEY_RULES = f"{DOMAIN}.rules"

# Maximum number of history entries kept on disk. Older entries are dropped
# in FIFO order when this limit is reached. 5000 entries is roughly several
# weeks of typical usage at 1-2 dispatches per minute.
HISTORY_MAX_ENTRIES = 5000

DOMAIN_TO_TYPE = {
    "climate": "thermostat",
    "light": "light",
    "cover": "blind",
    "switch": "plug",
    "fan": "fan",
    "vacuum": "vacuum",
    "lawn_mower": "mower",
    "water_heater": "boiler",
    "valve": "irrigation",
    "alarm_control_panel": "alarm",
    # HA helper entities. Common pattern: users set up input_boolean as flags
    # for automation conditions, input_number for thresholds, input_select for
    # state machines. Chronos schedules can flip them at the right times so
    # existing automations don't need to be rewritten.
    "input_boolean": "input_boolean",
    "input_number": "input_number",
    "input_select": "input_select",
    # Note: "scene", "automation" and "service" are intentionally NOT here.
    # They are not imported as devices; instead, schedules of those types
    # pick the target entity / service per block via the action value.
}

SUPPORTED_DOMAINS = set(DOMAIN_TO_TYPE.keys())

# Schedule types that don't iterate the schedule's device_ids list at dispatch
# time. They reference target entities per-block via the action's value
# field instead. When the user removes a device that was the last target of a
# device-based schedule, that schedule is auto-disabled with a warning;
# deviceless schedules are never affected by device removal.
DEVICELESS_SCHEDULE_TYPES = frozenset({"scene", "automation", "service"})

ACTIONS_BY_TYPE = {
    "thermostat": [
        {
            "id": "set_temperature",
            "label": "Set temperature",
            "kind": "set",
            "service": "climate.set_temperature",
            "value": {"type": "number", "unit": "°C", "min": 5, "max": 35, "step": 0.5, "default": 21},
        },
        {
            "id": "set_preset",
            "label": "Preset",
            "kind": "preset",
            "service": "climate.set_preset_mode",
            "value": {
                "type": "enum",
                "options": ["none", "eco", "comfort", "sleep", "away", "boost", "home"],
                "default": "comfort",
            },
        },
        # set_hvac_mode is the real "power on" for air conditioners: many
        # units ignore turn_on or resume an arbitrary mode; selecting the
        # mode (cool/heat/dry/...) is deterministic across brands. The
        # options are HA's canonical values.
        {
            "id": "set_hvac_mode",
            "label": "HVAC mode",
            "kind": "preset",
            "service": "climate.set_hvac_mode",
            "value": {
                "type": "enum",
                "options": ["heat", "cool", "heat_cool", "dry", "fan_only", "auto", "off"],
                "default": "heat",
            },
        },
        # Plain turn_on: resumes the device's last mode.
        {"id": "turn_on", "label": "Turn on", "kind": "on", "service": "climate.turn_on"},
        {"id": "turn_off", "label": "Turn off", "kind": "off", "service": "climate.turn_off"},
    ],
    "boiler": [
        {
            "id": "set_temperature",
            "label": "Set temperature",
            "kind": "set",
            "service": "water_heater.set_temperature",
            "value": {"type": "number", "unit": "°C", "min": 30, "max": 75, "step": 1, "default": 55},
        },
        {
            "id": "set_operation",
            "label": "Operation mode",
            "kind": "preset",
            "service": "water_heater.set_operation_mode",
            "value": {
                "type": "enum",
                "options": ["off", "eco", "electric", "gas", "heat_pump", "high_demand", "performance"],
                "default": "eco",
            },
        },
        {"id": "turn_off", "label": "Turn off", "kind": "off", "service": "water_heater.turn_off"},
    ],
    "light": [
        {
            "id": "turn_on",
            "label": "Turn on",
            "kind": "on",
            "service": "light.turn_on",
            "value": {"type": "number", "unit": "%", "min": 1, "max": 100, "step": 1, "default": 80, "label": "Brightness"},
            "extras": [
                {"key": "rgb_color", "type": "color", "label": "RGB color"},
                {"key": "color_temp_kelvin", "type": "number", "min": 2000, "max": 6500, "step": 100, "unit": "K", "label": "Color temperature"},
                {"key": "transition", "type": "number", "min": 0, "max": 60, "step": 1, "unit": "s", "label": "Transition"},
            ],
        },
        {"id": "turn_off", "label": "Turn off", "kind": "off", "service": "light.turn_off"},
    ],
    "scene": [
        {
            "id": "activate", "label": "Activate scene", "kind": "on", "service": "scene.turn_on",
            # value holds the scene entity_id(s) to activate. Backend dispatch
            # accepts either a single string (legacy v1.8.x) or a list of
            # entity_ids (v1.9+). One service call per entity.
            "value": {"type": "entity", "domain": "scene", "label": "Scene", "multi": True},
        },
    ],
    "automation": [
        {
            "id": "turn_on", "label": "Enable automation", "kind": "on", "service": "automation.turn_on",
            "value": {"type": "entity", "domain": "automation", "label": "Automation", "multi": True},
        },
        {
            "id": "turn_off", "label": "Disable automation", "kind": "off", "service": "automation.turn_off",
            "value": {"type": "entity", "domain": "automation", "label": "Automation", "multi": True},
        },
        {
            "id": "trigger", "label": "Trigger automation", "kind": "cmd", "service": "automation.trigger",
            "value": {"type": "entity", "domain": "automation", "label": "Automation", "multi": True},
        },
    ],
    "blind": [
        {
            "id": "set_position",
            "label": "Set position",
            "kind": "set",
            "service": "cover.set_cover_position",
            "value": {"type": "number", "unit": "%", "min": 0, "max": 100, "step": 5, "default": 100, "label": "Opening"},
        },
        {"id": "open_cover", "label": "Open", "kind": "on", "service": "cover.open_cover"},
        {"id": "close_cover", "label": "Close", "kind": "off", "service": "cover.close_cover"},
    ],
    "irrigation": [
        {
            "id": "turn_on",
            "label": "Start",
            "kind": "on",
            "service": "valve.open_valve",
            "value": {"type": "number", "unit": "min", "min": 1, "max": 240, "step": 1, "default": 30, "label": "Duration"},
        },
        {"id": "turn_off", "label": "Stop", "kind": "off", "service": "valve.close_valve"},
    ],
    "plug": [
        {"id": "turn_on", "label": "Turn on", "kind": "on", "service": "switch.turn_on"},
        {"id": "turn_off", "label": "Turn off", "kind": "off", "service": "switch.turn_off"},
    ],
    "fan": [
        {
            "id": "turn_on",
            "label": "Turn on",
            "kind": "on",
            "service": "fan.turn_on",
            "value": {"type": "number", "unit": "%", "min": 10, "max": 100, "step": 10, "default": 50, "label": "Speed"},
        },
        {"id": "turn_off", "label": "Turn off", "kind": "off", "service": "fan.turn_off"},
    ],
    "mower": [
        {"id": "start_mowing", "label": "Start mowing", "kind": "on", "service": "lawn_mower.start_mowing"},
        {"id": "pause", "label": "Pause", "kind": "cmd", "service": "lawn_mower.pause"},
        {"id": "dock", "label": "Return to dock", "kind": "off", "service": "lawn_mower.dock"},
    ],
    "vacuum": [
        {"id": "start", "label": "Start cleaning", "kind": "on", "service": "vacuum.start"},
        {"id": "pause", "label": "Pause", "kind": "cmd", "service": "vacuum.pause"},
        {"id": "return_to_base", "label": "Return to dock", "kind": "off", "service": "vacuum.return_to_base"},
    ],
    "input_boolean": [
        {"id": "turn_on", "label": "Turn flag on", "kind": "on", "service": "input_boolean.turn_on"},
        {"id": "turn_off", "label": "Turn flag off", "kind": "off", "service": "input_boolean.turn_off"},
        {"id": "toggle", "label": "Toggle flag", "kind": "cmd", "service": "input_boolean.toggle"},
    ],
    "input_number": [
        {
            "id": "set_value", "label": "Set value", "kind": "set",
            "service": "input_number.set_value",
            "value": {"type": "number", "min": -1000000, "max": 1000000, "step": 0.1, "default": 0, "label": "Value"},
        },
    ],
    "input_select": [
        {
            "id": "select_option", "label": "Select option", "kind": "preset",
            "service": "input_select.select_option",
            # The user types the option name; we don't enumerate options
            # because they vary per entity and would require a per-entity
            # WS lookup. A free string is the lowest-friction approach.
            "value": {"type": "string", "label": "Option"},
        },
    ],
    "service": [
        {
            "id": "call_service", "label": "Call service", "kind": "cmd",
            # `service` is filled at dispatch time from the block's value
            # (the user enters something like "mqtt.publish" or "backup.create").
            "service": "",
            "value": {
                "type": "string",
                "label": "HA service",
                "placeholder": "e.g. mqtt.publish, backup.create, script.run",
            },
            "extras": [
                {"key": "service_data", "type": "json", "label": "Service data (JSON)"},
            ],
        },
    ],
    "alarm": [
        # All alarm_control_panel services accept an optional `code`. Most
        # panels (Alarmo, MQTT alarm with code_arm_required:true, Bosch,
        # DSC, ...) reject the call silently if the code isn't passed.
        # Stored as plain string in the schedule for now; the input is
        # masked in the UI via the `secret` flag, but the value is in
        # clear in .storage/chronos.schedules. Suitable when the alarm
        # storage shares the same trust boundary as the HA host.
        # Trigger doesn't take a code: any panel can sound the siren
        # without authentication (it's by design an emergency action).
        {"id": "arm_home", "label": "Arm (home)", "kind": "on", "service": "alarm_control_panel.alarm_arm_home",
         "extras": [{"key": "code", "type": "string", "label": "Code (PIN)", "secret": True}]},
        {"id": "arm_away", "label": "Arm (away)", "kind": "on", "service": "alarm_control_panel.alarm_arm_away",
         "extras": [{"key": "code", "type": "string", "label": "Code (PIN)", "secret": True}]},
        {"id": "arm_night", "label": "Arm (night)", "kind": "on", "service": "alarm_control_panel.alarm_arm_night",
         "extras": [{"key": "code", "type": "string", "label": "Code (PIN)", "secret": True}]},
        {"id": "arm_vacation", "label": "Arm (vacation)", "kind": "on", "service": "alarm_control_panel.alarm_arm_vacation",
         "extras": [{"key": "code", "type": "string", "label": "Code (PIN)", "secret": True}]},
        {"id": "disarm", "label": "Disarm", "kind": "off", "service": "alarm_control_panel.alarm_disarm",
         "extras": [{"key": "code", "type": "string", "label": "Code (PIN)", "secret": True}]},
        {"id": "trigger", "label": "Trigger siren", "kind": "cmd", "service": "alarm_control_panel.alarm_trigger"},
    ],
}

WEATHER_ATTRIBUTES = [
    {"key": "temperature", "label": "Current temperature", "unit": "°C", "icon": "temp", "type": "number"},
    {"key": "feels_like", "label": "Feels-like temperature", "unit": "°C", "icon": "temp", "type": "number"},
    {"key": "humidity", "label": "Humidity", "unit": "%", "icon": "droplet", "type": "number"},
    {"key": "dew_point", "label": "Dew point", "unit": "°C", "icon": "droplet", "type": "number"},
    {"key": "wind_speed", "label": "Wind speed", "unit": "km/h", "icon": "wind", "type": "number"},
    {"key": "wind_gust", "label": "Wind gust", "unit": "km/h", "icon": "wind", "type": "number"},
    {"key": "wind_bearing", "label": "Wind bearing", "unit": "°", "icon": "wind", "type": "number"},
    {"key": "pressure", "label": "Atmospheric pressure", "unit": "hPa", "icon": "cloud", "type": "number"},
    {"key": "uv_index", "label": "UV index", "unit": "", "icon": "sun", "type": "number"},
    {"key": "solar_radiation", "label": "Solar irradiance", "unit": "W/m²", "icon": "sun", "type": "number"},
    {"key": "rain_rate", "label": "Rain rate", "unit": "mm/h", "icon": "rain", "type": "number"},
    {
        "key": "rain_state",
        "label": "Rain state",
        "unit": "",
        "icon": "rain",
        "type": "enum",
        "options": ["on", "off"],
    },
    {"key": "sun.elevation", "label": "Sun elevation", "unit": "°", "icon": "sun", "type": "number"},
    {"key": "sun.minutes_until_sunrise", "label": "Minutes until sunrise", "unit": "min", "icon": "sun", "type": "number"},
    {"key": "sun.minutes_until_sunset", "label": "Minutes until sunset", "unit": "min", "icon": "sun", "type": "number"},
    {
        "key": "sun.state",
        "label": "Sun above horizon",
        "unit": "",
        "icon": "sun",
        "type": "enum",
        "options": ["above_horizon", "below_horizon"],
    },
    {
        "key": "condition",
        "label": "Current condition",
        "unit": "",
        "icon": "cloud",
        "type": "enum",
        "options": ["sunny", "cloudy", "rainy", "snowy", "partlycloudy", "fog", "windy"],
    },
    {"key": "forecast.temp_max_today", "label": "Max temp today (forecast)", "unit": "°C", "icon": "temp", "type": "number"},
    {"key": "forecast.temp_min_today", "label": "Min temp today (forecast)", "unit": "°C", "icon": "temp", "type": "number"},
    {"key": "forecast.rain_6h", "label": "Rain next 6h", "unit": "mm", "icon": "rain", "type": "number"},
    {
        "key": "forecast.condition_6h",
        "label": "Condition +6h",
        "unit": "",
        "icon": "cloud",
        "type": "enum",
        "options": ["sunny", "cloudy", "rainy", "snowy", "partlycloudy", "fog", "windy"],
    },
]

DEFAULT_SETTINGS = {
    "weather_entity": "",
    "weather_sensor_map": {},
    "polling_minutes": 15,
    "snap_minutes": 15,
    "notify_rule_triggered": True,
    "notify_sched_skipped": True,
    "notify_command_error": True,
    "notify_block_executed": True,
    "theme": "auto",
    "density": "comfortable",
    "default_timeline_variant": "linear",
    "language": "auto",
    # Action-kind colors (timeline blocks). Five kinds, one HEX each. Used
    # in linear/radial/list timelines and in the legend chips. Settable in
    # Settings > Colors > Action timeline.
    "color_kind": {
        "on": "#10b981",
        "off": "#9ca3af",
        "set": "#06b6d4",
        "preset": "#6366f1",
        "cmd": "#f59e0b",
    },
    # Simple on/off device colors. Each entry has an `active` and an
    # `inactive` HEX. The frontend's getDeviceColor consults this map for
    # device types that don't have a continuous state mapping.
    "color_simple": {
        "plug":          {"active": "#10b981", "inactive": "#9ca3af"},
        "mower":         {"active": "#10b981", "inactive": "#9ca3af"},
        "vacuum":        {"active": "#10b981", "inactive": "#9ca3af"},
        "irrigation":    {"active": "#10b981", "inactive": "#9ca3af"},
        "alarm":         {"active": "#10b981", "inactive": "#9ca3af"},
        "input_boolean": {"active": "#10b981", "inactive": "#9ca3af"},
        "input_select":  {"active": "#10b981", "inactive": "#9ca3af"},
        "input_number":  {"active": "#10b981", "inactive": "#9ca3af"},
    },
    # Range device colors (gradient endpoints). Used by getDeviceColor for
    # device types whose color reflects a continuous state value.
    "color_range": {
        "blind": {"start": "#3c5078", "end": "#c8b4ff"},
        "fan":   {"start": "#06b6d4", "end": "#3b82f6"},
    },
    # When true the card refuses to save an irrigation schedule whose
    # sequential program overlaps in time with another that shares a
    # valve (water pressure hazard). Default off: warn only, user decides.
    "irrigation_conflict_block": False,
    # Offline-device recall: when a target entity is unavailable at block
    # dispatch, retry the action when it comes back online, as long as the
    # block is still active. Armed only for devices that were OFFLINE at
    # dispatch (never state-reconciliation against manual changes).
    # Irrigation is excluded by design.
    "offline_recall": True,
    "offline_recall_max_attempts": 3,
}

# Auto-off timer for turn_on blocks: device type → switch-off service
# map. Only the listed types show the "auto-off after N minutes" field in
# the editor; the runner and the post-restart recovery use the service
# declared here. Irrigation has its own dedicated runner and is not here.
AUTO_OFF_SERVICE = {
    "light": "light.turn_off",
    "plug": "switch.turn_off",
    "fan": "fan.turn_off",
    "thermostat": "climate.turn_off",
}

# Max age of an off-recall (a switch-off lost because the device was
# offline, retried when it reconnects). Past this threshold we give up with
# a History note: a device coming back days later may have been handled
# manually (or physically on the device) in the meantime, and a surprise
# switch-off would do more harm than good.
OFF_RECALL_MAX_AGE_HOURS = 12

EVENT_BLOCK_EXECUTED = f"{DOMAIN}_block_executed"
EVENT_RULE_TRIGGERED = f"{DOMAIN}_rule_triggered"
EVENT_COMMAND_ERROR = f"{DOMAIN}_command_error"
