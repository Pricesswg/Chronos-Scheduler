DOMAIN = "chronos"
VERSION = "1.10.7"
STORAGE_VERSION = 1
STORAGE_KEY_DEVICES = f"{DOMAIN}.devices"
STORAGE_KEY_SCHEDULES = f"{DOMAIN}.schedules"
STORAGE_KEY_SETTINGS = f"{DOMAIN}.settings"

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
    # Note: "scene" and "automation" are intentionally NOT here. They are not
    # imported as devices; instead, schedules of type "scene" / "automation"
    # pick the target entities per block via the action's `value` field
    # (resolved by the multi-entity picker UI).
}

SUPPORTED_DOMAINS = set(DOMAIN_TO_TYPE.keys())

ACTIONS_BY_TYPE = {
    "thermostat": [
        {
            "id": "set_temperature",
            "label": "Imposta temperatura",
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
        {"id": "turn_off", "label": "Spegni", "kind": "off", "service": "climate.turn_off"},
    ],
    "boiler": [
        {
            "id": "set_temperature",
            "label": "Imposta temperatura",
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
        {"id": "turn_off", "label": "Spegni", "kind": "off", "service": "water_heater.turn_off"},
    ],
    "light": [
        {
            "id": "turn_on",
            "label": "Accendi",
            "kind": "on",
            "service": "light.turn_on",
            "value": {"type": "number", "unit": "%", "min": 1, "max": 100, "step": 1, "default": 80, "label": "Luminosità"},
            "extras": [
                {"key": "rgb_color", "type": "color", "label": "Colore RGB"},
                {"key": "color_temp_kelvin", "type": "number", "min": 2000, "max": 6500, "step": 100, "unit": "K", "label": "Temperatura colore"},
                {"key": "transition", "type": "number", "min": 0, "max": 60, "step": 1, "unit": "s", "label": "Transizione"},
            ],
        },
        {"id": "turn_off", "label": "Spegni", "kind": "off", "service": "light.turn_off"},
    ],
    "scene": [
        {
            "id": "activate", "label": "Attiva scena", "kind": "on", "service": "scene.turn_on",
            # value holds the scene entity_id(s) to activate. Backend dispatch
            # accepts either a single string (legacy v1.8.x) or a list of
            # entity_ids (v1.9+). One service call per entity.
            "value": {"type": "entity", "domain": "scene", "label": "Scena", "multi": True},
        },
    ],
    "automation": [
        {
            "id": "turn_on", "label": "Attiva automazione", "kind": "on", "service": "automation.turn_on",
            "value": {"type": "entity", "domain": "automation", "label": "Automazione", "multi": True},
        },
        {
            "id": "turn_off", "label": "Disattiva automazione", "kind": "off", "service": "automation.turn_off",
            "value": {"type": "entity", "domain": "automation", "label": "Automazione", "multi": True},
        },
        {
            "id": "trigger", "label": "Trigger automazione", "kind": "cmd", "service": "automation.trigger",
            "value": {"type": "entity", "domain": "automation", "label": "Automazione", "multi": True},
        },
    ],
    "blind": [
        {
            "id": "set_position",
            "label": "Posiziona",
            "kind": "set",
            "service": "cover.set_cover_position",
            "value": {"type": "number", "unit": "%", "min": 0, "max": 100, "step": 5, "default": 100, "label": "Apertura"},
        },
        {"id": "open_cover", "label": "Apri", "kind": "on", "service": "cover.open_cover"},
        {"id": "close_cover", "label": "Chiudi", "kind": "off", "service": "cover.close_cover"},
    ],
    "irrigation": [
        {
            "id": "turn_on",
            "label": "Avvia",
            "kind": "on",
            "service": "valve.open_valve",
            "value": {"type": "number", "unit": "min", "min": 1, "max": 240, "step": 1, "default": 30, "label": "Durata"},
        },
        {"id": "turn_off", "label": "Stop", "kind": "off", "service": "valve.close_valve"},
    ],
    "plug": [
        {"id": "turn_on", "label": "Accendi", "kind": "on", "service": "switch.turn_on"},
        {"id": "turn_off", "label": "Spegni", "kind": "off", "service": "switch.turn_off"},
    ],
    "fan": [
        {
            "id": "turn_on",
            "label": "Accendi",
            "kind": "on",
            "service": "fan.turn_on",
            "value": {"type": "number", "unit": "%", "min": 10, "max": 100, "step": 10, "default": 50, "label": "Velocità"},
        },
        {"id": "turn_off", "label": "Spegni", "kind": "off", "service": "fan.turn_off"},
    ],
    "mower": [
        {"id": "start_mowing", "label": "Avvia taglio", "kind": "on", "service": "lawn_mower.start_mowing"},
        {"id": "pause", "label": "Pausa", "kind": "cmd", "service": "lawn_mower.pause"},
        {"id": "dock", "label": "Torna in base", "kind": "off", "service": "lawn_mower.dock"},
    ],
    "vacuum": [
        {"id": "start", "label": "Avvia pulizia", "kind": "on", "service": "vacuum.start"},
        {"id": "pause", "label": "Pausa", "kind": "cmd", "service": "vacuum.pause"},
        {"id": "return_to_base", "label": "Torna in base", "kind": "off", "service": "vacuum.return_to_base"},
    ],
    "alarm": [
        # All alarm_control_panel services accept an optional `code`. The
        # frontend doesn't currently expose a string-typed extras field for
        # it (most HA alarm panels don't require a code at the service-call
        # level), so this is omitted intentionally. Add via extras of type
        # "string" when needed.
        {"id": "arm_home", "label": "Inserisci (home)", "kind": "on", "service": "alarm_control_panel.alarm_arm_home"},
        {"id": "arm_away", "label": "Inserisci (away)", "kind": "on", "service": "alarm_control_panel.alarm_arm_away"},
        {"id": "arm_night", "label": "Inserisci (notte)", "kind": "on", "service": "alarm_control_panel.alarm_arm_night"},
        {"id": "arm_vacation", "label": "Inserisci (vacanza)", "kind": "on", "service": "alarm_control_panel.alarm_arm_vacation"},
        {"id": "disarm", "label": "Disinserisci", "kind": "off", "service": "alarm_control_panel.alarm_disarm"},
        {"id": "trigger", "label": "Attiva sirena", "kind": "cmd", "service": "alarm_control_panel.alarm_trigger"},
    ],
}

WEATHER_ATTRIBUTES = [
    {"key": "temperature", "label": "Temperatura attuale", "unit": "°C", "icon": "temp", "type": "number"},
    {"key": "feels_like", "label": "Temperatura percepita", "unit": "°C", "icon": "temp", "type": "number"},
    {"key": "humidity", "label": "Umidità", "unit": "%", "icon": "droplet", "type": "number"},
    {"key": "dew_point", "label": "Punto di rugiada", "unit": "°C", "icon": "droplet", "type": "number"},
    {"key": "wind_speed", "label": "Velocità vento", "unit": "km/h", "icon": "wind", "type": "number"},
    {"key": "wind_gust", "label": "Raffica vento", "unit": "km/h", "icon": "wind", "type": "number"},
    {"key": "wind_bearing", "label": "Direzione vento", "unit": "°", "icon": "wind", "type": "number"},
    {"key": "pressure", "label": "Pressione atmosferica", "unit": "hPa", "icon": "cloud", "type": "number"},
    {"key": "uv_index", "label": "Indice UV", "unit": "", "icon": "sun", "type": "number"},
    {"key": "solar_radiation", "label": "Irradianza solare", "unit": "W/m²", "icon": "sun", "type": "number"},
    {"key": "rain_rate", "label": "Pioggia istantanea", "unit": "mm/h", "icon": "rain", "type": "number"},
    {
        "key": "rain_state",
        "label": "Stato pioggia",
        "unit": "",
        "icon": "rain",
        "type": "enum",
        "options": ["on", "off"],
    },
    {"key": "sun.elevation", "label": "Elevazione sole", "unit": "°", "icon": "sun", "type": "number"},
    {"key": "sun.minutes_until_sunrise", "label": "Minuti all'alba", "unit": "min", "icon": "sun", "type": "number"},
    {"key": "sun.minutes_until_sunset", "label": "Minuti al tramonto", "unit": "min", "icon": "sun", "type": "number"},
    {
        "key": "sun.state",
        "label": "Sole sopra orizzonte",
        "unit": "",
        "icon": "sun",
        "type": "enum",
        "options": ["above_horizon", "below_horizon"],
    },
    {
        "key": "condition",
        "label": "Condizione attuale",
        "unit": "",
        "icon": "cloud",
        "type": "enum",
        "options": ["sunny", "cloudy", "rainy", "snowy", "partlycloudy", "fog", "windy"],
    },
    {"key": "forecast.temp_max_today", "label": "Temp. max oggi (forecast)", "unit": "°C", "icon": "temp", "type": "number"},
    {"key": "forecast.temp_min_today", "label": "Temp. min oggi (forecast)", "unit": "°C", "icon": "temp", "type": "number"},
    {"key": "forecast.rain_6h", "label": "Pioggia prossime 6h", "unit": "mm", "icon": "rain", "type": "number"},
    {
        "key": "forecast.condition_6h",
        "label": "Condizione +6h",
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
}

EVENT_BLOCK_EXECUTED = f"{DOMAIN}_block_executed"
EVENT_RULE_TRIGGERED = f"{DOMAIN}_rule_triggered"
EVENT_COMMAND_ERROR = f"{DOMAIN}_command_error"
