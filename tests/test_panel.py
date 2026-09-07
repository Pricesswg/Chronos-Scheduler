"""The sidebar entry follows the sidebar_panel setting, idempotently."""
from __future__ import annotations

from unittest.mock import AsyncMock, patch

from custom_components.chronos import PANEL_URL_PATH, async_sync_sidebar_panel
from custom_components.chronos.const import DOMAIN


async def test_panel_follows_the_setting(hass, store):
    hass.data[DOMAIN] = {"store": store}
    with patch("custom_components.chronos.panel_custom.async_register_panel", new=AsyncMock()) as register, \
         patch("custom_components.chronos.async_remove_panel") as remove:
        await async_sync_sidebar_panel(hass)
        await async_sync_sidebar_panel(hass)
        assert register.await_count == 1, "a second sync must not register twice"
        kw = register.await_args.kwargs
        assert kw["frontend_url_path"] == PANEL_URL_PATH
        assert kw["webcomponent_name"] == "chronos-panel"
        assert kw["require_admin"] is False
        assert kw["module_url"].startswith("/chronos_static/chronos-card.js?v=")
        remove.assert_not_called()

        store.settings["sidebar_panel"] = False
        await async_sync_sidebar_panel(hass)
        await async_sync_sidebar_panel(hass)
        remove.assert_called_once()
        assert remove.call_args.args[1] == PANEL_URL_PATH

        store.settings["sidebar_panel"] = True
        await async_sync_sidebar_panel(hass)
        assert register.await_count == 2, "switching it back on registers again"
