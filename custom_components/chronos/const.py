DOMAIN = "chronos"
VERSION = "1.0.0"
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
        },
        {"id": "turn_off", "label": "Spegni", "kind": "off", "service": "light.turn_off"},
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
}

WEATHER_ATTRIBUTES = [
    {"key": "temperature", "label": "Temperatura attuale", "unit": "°C", "icon": "temp", "type": "number"},
    {"key": "humidity", "label": "Umidità", "unit": "%", "icon": "droplet", "type": "number"},
    {"key": "wind_speed", "label": "Velocità vento", "unit": "km/h", "icon": "wind", "type": "number"},
    {"key": "wind_bearing", "label": "Direzione vento", "unit": "°", "icon": "wind", "type": "number"},
    {"key": "pressure", "label": "Pressione atmosferica", "unit": "hPa", "icon": "cloud", "type": "number"},
    {"key": "uv_index", "label": "Indice UV", "unit": "", "icon": "sun", "type": "number"},
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
    "polling_minutes": 15,
    "snap_minutes": 15,
    "notify_rule_triggered": True,
    "notify_sched_skipped": True,
    "notify_command_error": True,
    "theme": "auto",
    "density": "comfortable",
    "default_timeline_variant": "linear",
}

EVENT_BLOCK_EXECUTED = f"{DOMAIN}_block_executed"
EVENT_RULE_TRIGGERED = f"{DOMAIN}_rule_triggered"
EVENT_COMMAND_ERROR = f"{DOMAIN}_command_error"
