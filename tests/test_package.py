"""Every module of the integration imports under a real Home Assistant, so a
broken import in a module the other tests never touch still fails here."""
from __future__ import annotations

import importlib
import pkgutil

import custom_components.chronos as pkg


def test_every_module_imports():
    names = [m.name for m in pkgutil.iter_modules(pkg.__path__)]
    assert "scheduler" in names and "gate" in names
    for name in names:
        importlib.import_module(f"custom_components.chronos.{name}")


def test_every_websocket_handler_is_registered():
    """A command defined but never registered answers "Unknown command" and
    the card gives up silently: pause and resume from the card were dead from
    1.40.0 to 1.48.0 that way (issue #39)."""
    import pathlib
    import re

    src = pathlib.Path(pkg.__path__[0], "__init__.py").read_text(encoding="utf-8")
    defined = set(re.findall(r"async def (ws_\w+)\(", src))
    registered = set(re.findall(r"async_register_command\(hass, (ws_\w+)\)", src))
    assert defined, "no handlers found: the pattern no longer matches the code"
    assert defined == registered, f"defined but not registered: {sorted(defined - registered)}"
