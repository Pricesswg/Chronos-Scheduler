from __future__ import annotations

from typing import Any

import voluptuous as vol
from homeassistant.config_entries import ConfigFlow, ConfigFlowResult

from .const import DOMAIN


class ChronosConfigFlow(ConfigFlow, domain=DOMAIN):
    VERSION = 1

    async def async_step_user(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        if self._async_current_entries():
            return self.async_abort(reason="single_instance_allowed")

        if user_input is not None:
            weather_entities = [
                s.entity_id
                for s in self.hass.states.async_all("weather")
            ]
            weather_entity = user_input.get("weather_entity", "")
            if weather_entity and weather_entity not in weather_entities:
                return self.async_show_form(
                    step_id="user",
                    data_schema=self._build_schema(weather_entities),
                    errors={"weather_entity": "invalid_weather_entity"},
                )
            return self.async_create_entry(
                title="Chronos Scheduler",
                data={"weather_entity": weather_entity},
            )

        weather_entities = [
            s.entity_id for s in self.hass.states.async_all("weather")
        ]
        return self.async_show_form(
            step_id="user",
            data_schema=self._build_schema(weather_entities),
        )

    def _build_schema(self, weather_entities: list[str]) -> vol.Schema:
        default = weather_entities[0] if weather_entities else ""
        return vol.Schema(
            {
                vol.Optional("weather_entity", default=default): vol.In(
                    weather_entities or [""]
                ),
            }
        )
