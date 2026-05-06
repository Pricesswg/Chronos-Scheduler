import type {
  HomeAssistant,
  ChronosDevice,
  Schedule,
  Settings,
  ActionDef,
  WeatherAttribute,
} from "./types";

export async function fetchDevices(hass: HomeAssistant): Promise<ChronosDevice[]> {
  return hass.callWS({ type: "chronos/devices/list" });
}

export async function addDevice(
  hass: HomeAssistant,
  entity_id: string,
  alias?: string,
  area?: string
): Promise<ChronosDevice> {
  return hass.callWS({ type: "chronos/devices/add", entity_id, alias, area });
}

export async function updateDevice(
  hass: HomeAssistant,
  id: string,
  patch: Partial<ChronosDevice>
): Promise<ChronosDevice> {
  return hass.callWS({ type: "chronos/devices/update", device_id: String(id), patch });
}

export async function removeDevice(hass: HomeAssistant, id: string): Promise<void> {
  await hass.callWS({ type: "chronos/devices/remove", device_id: String(id) });
}

export async function fetchSchedules(hass: HomeAssistant): Promise<Schedule[]> {
  return hass.callWS({ type: "chronos/schedules/list" });
}

export async function saveSchedule(
  hass: HomeAssistant,
  schedule: Schedule
): Promise<Schedule> {
  return hass.callWS({ type: "chronos/schedules/save", schedule });
}

export async function removeSchedule(hass: HomeAssistant, id: string): Promise<void> {
  await hass.callWS({ type: "chronos/schedules/remove", schedule_id: String(id) });
}

export async function toggleSchedule(
  hass: HomeAssistant,
  id: string,
  enabled: boolean
): Promise<void> {
  await hass.callWS({ type: "chronos/schedules/toggle", schedule_id: String(id), enabled });
}

export async function fetchSettings(hass: HomeAssistant): Promise<Settings> {
  return hass.callWS({ type: "chronos/settings/get" });
}

export async function updateSettings(
  hass: HomeAssistant,
  patch: Partial<Settings>
): Promise<Settings> {
  return hass.callWS({ type: "chronos/settings/update", patch });
}

export async function fetchForecast(hass: HomeAssistant): Promise<any[]> {
  return hass.callWS({ type: "chronos/preview/forecast" });
}

export async function fetchAvailableEntities(hass: HomeAssistant): Promise<any[]> {
  return hass.callWS({ type: "chronos/entities/available" });
}

export async function fetchWeatherEntities(hass: HomeAssistant): Promise<any[]> {
  return hass.callWS({ type: "chronos/weather/entities" });
}

export async function fetchSensorEntities(hass: HomeAssistant): Promise<any[]> {
  return hass.callWS({ type: "chronos/sensor/entities" });
}

export async function fetchSceneEntities(hass: HomeAssistant): Promise<any[]> {
  return hass.callWS({ type: "chronos/scene/entities" });
}

export async function fetchAutomationEntities(hass: HomeAssistant): Promise<any[]> {
  return hass.callWS({ type: "chronos/automation/entities" });
}

export async function fetchActions(
  hass: HomeAssistant
): Promise<Record<string, ActionDef[]>> {
  return hass.callWS({ type: "chronos/actions" });
}

export async function fetchWeatherAttributes(
  hass: HomeAssistant
): Promise<WeatherAttribute[]> {
  return hass.callWS({ type: "chronos/weather/attributes" });
}

export interface HistoryEntry {
  ts: string;
  schedule_id: string;
  schedule_name: string;
  device_type: string;
  kind: "block" | "rule";
  action_id: string;
  entity_id: string | null;
  value: any;
  outcome: "ok" | "error";
  error: string | null;
  rule_idx: number | null;
}

export interface HistoryFilters {
  from_ts?: string;
  to_ts?: string;
  schedule_id?: string;
  outcome?: "ok" | "error";
  kind?: "block" | "rule";
  limit?: number;
}

export async function fetchHistory(
  hass: HomeAssistant,
  filters: HistoryFilters = {}
): Promise<HistoryEntry[]> {
  return hass.callWS({ type: "chronos/history/list", ...filters });
}

export async function clearHistory(hass: HomeAssistant): Promise<void> {
  await hass.callWS({ type: "chronos/history/clear" });
}
