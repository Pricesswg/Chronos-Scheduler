// A fake `hass` for the layout probe: enough states for every screen to have
// something to draw, and a callWS that answers every Chronos command from
// in-memory data. Mutations echo back their input; nothing persists.
const iso = (h) => { const d = new Date(); d.setHours(h, 0, 0, 0); return d.toISOString(); };
const st = (state, attributes) => ({ state, attributes, last_changed: iso(6), last_updated: iso(6) });

export async function makeHass({ settings: settingsOverride = {} } = {}) {
  const fixtures = await (await fetch("/fixtures/backend.json")).json();
  const devices = [
    { id: "d1", entity_id: "switch.valvola_giardino_1", alias: "Valvola giardino 1", name: "Valvola giardino 1", type: "plug", area: "Giardino Est", enabled: true },
    { id: "d2", entity_id: "light.sala", alias: "Luce sala", name: "Luce sala", type: "light", area: "Sala", enabled: true },
    { id: "d3", entity_id: "climate.termostato_soggiorno", alias: "Termostato soggiorno", name: "Termostato soggiorno", type: "thermostat", area: "Soggiorno", enabled: true },
  ];
  const schedules = [
    { id: "s1", name: "Irrigazione mattina zona 1", device_type: "plug", device_ids: ["d1"], enabled: true, days: [1, 1, 1, 1, 1, 1, 1], timeline_variant: "linear",
      blocks: [{ start: 6, end: 6.5, action: { id: "turn_on", trigger: "both", end_action: { id: "turn_off" } }, jitter_min: 15 }] },
    { id: "s2", name: "Luci sera con presenza simulata", device_type: "light", device_ids: ["d2"], enabled: true, days: [1, 1, 1, 1, 1, 0, 0], timeline_variant: "linear",
      blocks: [{ start: 18.5, end: 23.5, action: { id: "turn_on", value: 70, mode: "presence", presence_cycles: 4, presence_min_min: 20, presence_max_min: 90 } }] },
    { id: "s3", name: "Riscaldamento soggiorno inverno", device_type: "thermostat", device_ids: ["d3"], enabled: false, days: [1, 1, 1, 1, 1, 1, 1], timeline_variant: "radial",
      date_range: { start_month: 10, start_day: 15, end_month: 4, end_day: 15 },
      blocks: [{ start: 6, end: 9, action: { id: "set_temperature", value: 21 } }, { start: 17, end: 23, action: { id: "set_temperature", value: 21.5 } }] },
  ];
  // s4 shares d1 with s1 and overlaps its block: a device conflict.
  schedules.push({ id: "s4", name: "Irrigazione zona 1 bis", device_type: "plug", device_ids: ["d1"], enabled: true, days: [1, 1, 1, 1, 1, 1, 1], timeline_variant: "linear",
    blocks: [{ start: 6.25, end: 7, action: { id: "turn_on", trigger: "both", end_action: { id: "turn_off" } } }] });
  // s2 starts paused until tomorrow midnight.
  const midnight = new Date(); midnight.setDate(midnight.getDate() + 1); midnight.setHours(0, 0, 0, 0);
  const two = (n) => String(n).padStart(2, "0");
  const localIso = (d) => `${d.getFullYear()}-${two(d.getMonth() + 1)}-${two(d.getDate())}T${two(d.getHours())}:${two(d.getMinutes())}:00`;
  schedules[1].paused_until = localIso(midnight);
  // Groups (issue #24): two in "Giardino", one in "Riscaldamento", s2 without.
  schedules[0].group = "Giardino";
  schedules[2].group = "Riscaldamento";
  schedules[3].group = "Giardino";
  // s2 only simulates presence when nobody is home.
  schedules[1].modes = ["away"];
  const live = { mode: "home" };
  const rules = [
    { id: "r1", name: "Salta se piove", if: "precipitation > 2", then: "Skip", effect: "skip", active: true, fire_mode: "every", targets: [{ schedule_id: "s1", block_index: null }] },
    { id: "r2", name: "Più acqua col caldo", if: "", then: "Scale value", effect: "scale_value", active: true, fire_mode: "every",
      scale_var: "temperature", scale_var_min: 25, scale_var_max: 35, scale_out_min: 30, scale_out_max: 120, targets: [{ schedule_id: "s1", block_index: 0 }] },
  ];
  const history = [
    { ts: iso(6), schedule_id: "s1", schedule_name: "Irrigazione mattina zona 1", device_type: "plug", kind: "block", action_id: "turn_on", entity_id: "switch.valvola_giardino_1", value: null, outcome: "ok", error: null, rule_idx: null },
    { ts: iso(6), schedule_id: "s1", schedule_name: "Irrigazione mattina zona 1", device_type: "plug", kind: "rule", action_id: "skip", entity_id: null, value: null, outcome: "ok", error: null, rule_idx: 0 },
    { ts: iso(7), schedule_id: "s1", schedule_name: "Irrigazione mattina zona 1", device_type: "plug", kind: "block", action_id: "turn_off", entity_id: "switch.valvola_giardino_1", value: null, outcome: "warning", error: "switch.valvola_giardino_1 offline; off-recall armed", rule_idx: null },
    { ts: iso(8), schedule_id: "s2", schedule_name: "Luci sera con presenza simulata", device_type: "light", kind: "block", action_id: "turn_on", entity_id: "light.sala", value: 70, outcome: "error", error: "ServiceNotFound: light.turn_on", rule_idx: null },
  ];
  const states = {
    "switch.valvola_giardino_1": st("off", { friendly_name: "Valvola giardino 1" }),
    "light.sala": st("on", { friendly_name: "Luce sala", brightness: 180, supported_color_modes: ["brightness"] }),
    "climate.termostato_soggiorno": st("heat", { friendly_name: "Termostato soggiorno", temperature: 21, current_temperature: 20.4, hvac_modes: ["heat", "off"], min_temp: 7, max_temp: 30 }),
    "weather.casa": st("partlycloudy", { friendly_name: "Casa", temperature: 24.5, humidity: 61, wind_speed: 12.3, wind_bearing: 210, pressure: 1013, cloud_coverage: 40, uv_index: 4, temperature_unit: "°C", wind_speed_unit: "km/h", pressure_unit: "hPa", precipitation_unit: "mm" }),
    "sun.sun": st("above_horizon", { elevation: 38.2, azimuth: 195, rising: false, next_rising: iso(6), next_setting: iso(19), next_dawn: iso(5), next_dusk: iso(20) }),
    "sensor.temperatura_esterna": st("23.8", { friendly_name: "Temperatura esterna", unit_of_measurement: "°C", device_class: "temperature" }),
    "sensor.umidita_esterna": st("58", { friendly_name: "Umidità esterna", unit_of_measurement: "%", device_class: "humidity" }),
    "zone.home": st("0", { friendly_name: "Casa", latitude: 45.46, longitude: 9.19, radius: 100 }),
    "binary_sensor.workday_sensor": st("on", { friendly_name: "Giorno lavorativo" }),
    "calendar.ferie": st("off", { friendly_name: "Ferie" }),
    "person.alessandro": st("home", { friendly_name: "Alessandro" }),
    "sensor.prezzo_energia": st("0.18", { friendly_name: "Prezzo energia", unit_of_measurement: "€/kWh", current_price: 0.18, today: Array.from({ length: 24 }, (_, i) => 0.1 + 0.01 * i) }),
  };
  const sensors = Object.entries(states).filter(([e]) => /^(sensor|binary_sensor|calendar|person)\./.test(e)).map(([entity_id, s]) => ({ entity_id, friendly_name: s.attributes.friendly_name, unit_of_measurement: s.attributes.unit_of_measurement || "", device_class: s.attributes.device_class || "", state: s.state }));
  const forecast = Array.from({ length: 8 }, (_, i) => ({ datetime: iso(12 + i), temperature: 24 - i, condition: i < 4 ? "sunny" : "rainy", precipitation: i < 4 ? 0 : 1.2, wind_speed: 10 + i, humidity: 55 + i }));
  const handlers = {
    "chronos/devices/list": () => devices,
    "chronos/devices/add": (m) => ({ id: "dx", entity_id: m.entity_id, alias: m.alias || m.entity_id, area: m.area || "", type: "plug", enabled: true }),
    "chronos/devices/update": (m) => ({ ...devices.find((d) => d.id === m.device_id), ...m.patch }),
    "chronos/devices/remove": () => null,
    "chronos/schedules/list": () => schedules,
    "chronos/schedules/save": (m) => m.schedule,
    "chronos/schedules/remove": () => null,
    "chronos/schedules/toggle": () => null,
    "chronos/schedules/pause": (m) => {
      const s = schedules.find((x) => x.id === m.schedule_id);
      if (m.until) s.paused_until = m.until; else delete s.paused_until;
      return s;
    },
    "chronos/rules/list": () => rules,
    "chronos/rules/save": (m) => m.rule,
    "chronos/rules/remove": () => null,
    "chronos/rules/reorder": () => rules,
    "chronos/settings/get": () => ({ ...fixtures.settings, language: "it", nav_style: "top", weather_entity: "weather.casa", live_map: false, price_entity: "sensor.prezzo_energia", mode: live.mode, ...settingsOverride }),
    "chronos/mode/set": (m) => { live.mode = m.mode; return { ...fixtures.settings, mode: live.mode }; },
    "chronos/settings/update": (m) => ({ ...fixtures.settings, ...m.patch }),
    "chronos/preview/forecast": () => forecast,
    "chronos/entities/available": () => [
      { entity_id: "light.corridoio", name: "Corridoio", type: "light", domain: "light" },
      { entity_id: "switch.boiler", name: "Boiler", type: "boiler", domain: "switch" },
      { entity_id: "cover.tapparella_sala", name: "Tapparella sala", type: "blind", domain: "cover" },
    ],
    "chronos/weather/entities": () => [{ entity_id: "weather.casa", name: "Casa" }],
    "chronos/sensor/entities": () => sensors,
    "chronos/scene/entities": () => [{ entity_id: "scene.serata", name: "Serata" }],
    "chronos/automation/entities": () => [{ entity_id: "automation.notte", name: "Notte" }],
    "chronos/actions": () => fixtures.actions,
    "chronos/weather/attributes": () => fixtures.weather_attributes,
    "chronos/history/list": () => history,
    "chronos/history/clear": () => null,
  };
  window.__wsLog = [];
  return {
    callWS: async (msg) => {
      window.__wsLog.push(structuredClone(msg));
      const h = handlers[msg.type];
      if (!h) throw new Error(`unmocked WS command ${msg.type}`);
      return structuredClone(h(msg));
    },
    callService: async () => {},
    connection: { subscribeEvents: async () => () => {} },
    states,
    themes: { darkMode: false },
    language: "it",
    config: { latitude: 45.46, longitude: 9.19, unit_system: { temperature: "°C" } },
    localize: () => "",
  };
}
