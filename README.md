# Chronos Scheduler

[![hacs_badge](https://img.shields.io/badge/HACS-Custom-41BDF5.svg)](https://github.com/hacs/integration)
![hass](https://img.shields.io/badge/Home%20Assistant-2024.1%2B-blue.svg)
![license](https://img.shields.io/badge/license-MIT-green.svg)

**Chronos** è uno scheduler avanzato per Home Assistant che gestisce termostati, luci, tapparelle, irrigazione, prese, ventilatori, boiler, tosaerba e aspirapolvere attraverso fasce orarie giornaliere con **regole condizionali basate sul meteo locale**.

Una sola card Lovelace ti dà:

- Panoramica schedulazioni con KPI live
- Editor timeline lineare / radiale / lista, drag-and-drop con snap 15 min
- Regole meteo IF/THEN (temperatura, pioggia, vento, UV, …) per saltare, traslare o forzare l'esecuzione
- Vista settimanale con mini-timeline per giorno
- Stato live con meteo e dispositivi in tempo reale
- Wizard guidato per creare schedulazioni in 6 step
- Gestione dispositivi e impostazioni globali

Tutto persistito da Home Assistant, accessibile via WebSocket API, e auto-registrato come custom card.

## Installazione

### Tramite HACS (consigliato)

1. In HACS → **Integrations** → menu in alto a destra → **Custom repositories**
2. Aggiungi `https://github.com/Pricesswg/Chronos-Scheduler` come **Integration**
3. Cerca "Chronos Scheduler" in HACS, click **Download**
4. Riavvia Home Assistant
5. **Settings → Devices & Services → Add Integration → Chronos Scheduler**
6. Aggiungi la card in qualsiasi dashboard:
   ```yaml
   type: custom:chronos-card
   ```

> La card frontend viene **registrata automaticamente** dall'integration — non devi aggiungerla manualmente come Lovelace resource.

### Installazione manuale

1. Copia la cartella `custom_components/chronos/` (incluso `www/chronos-card.js`) dentro `<config>/custom_components/`
2. Riavvia Home Assistant
3. **Settings → Devices & Services → Add Integration → Chronos Scheduler**
4. Aggiungi `type: custom:chronos-card` in dashboard

## Setup iniziale

Al primo avvio l'integration ti chiede di selezionare un'entità `weather.*` (es. `weather.home`) come sorgente meteo. Puoi cambiarla in seguito da **Impostazioni** dentro la card.

## Domini supportati

| Dominio HA       | Tipo Chronos    | Capabilities tipiche                       |
|------------------|-----------------|--------------------------------------------|
| `climate.*`      | Termostato      | set_temperature, set_hvac_mode, set_preset |
| `light.*`        | Luce            | turn_on, turn_off, brightness, color       |
| `cover.*`        | Tapparella      | open, close, set_position                  |
| `switch.*`       | Presa           | turn_on, turn_off                          |
| `fan.*`          | Ventilatore     | turn_on, set_percentage, oscillate         |
| `vacuum.*`       | Aspirapolvere   | start, stop, return_to_base                |
| `lawn_mower.*`   | Tosaerba        | start_mowing, dock, pause                  |
| `water_heater.*` | Boiler          | set_temperature, set_operation_mode        |
| `valve.*`        | Irrigazione     | open_valve, close_valve                    |

## Licenza

MIT — vedi [LICENSE](LICENSE).
