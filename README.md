# ClaudeBang Kitchen

A Three.js cooking sandbox with physical ingredients, articulated robot fish, pourable oil and water, a gas stove, and a DeepSeek food critic. Includes chopping, frying, boiling, plating, and mukbang playback with separate English subtitles.

## Play

Windows: download the portable ZIP from [Releases](https://github.com/newbmechanix-ship-it/ClaudeBang-Kitchen/releases), extract it, and run **Start-Game.cmd**. Node is bundled in that ZIP.

From this repository: install Node.js, then run `npm start` (or `node server.mjs`). Open http://127.0.0.1:5335. The compiled game is included in `www/`; no dependency install is needed just to play. On non-Windows systems, open the URL manually.

## Controls

- Click an object to pick it up; click again or press Escape to drop.
- Hold right mouse and move to rotate a held object. Scroll to raise/lower it.
- Oil/water: directly pick up the bottle or jug; rotate downward to pour. Q/E also tilt.
- Lighter: pick it up and hold F. Move the pan aside, open the gas, and bring the flame beside the nozzle.
- 1 selects Grab, 2 Knife, 4 Spatula. Slice settled ingredients on the cutting board.
- Plate food, then choose mukbang. Clear station resets the kitchen and refills bottles.

## Optional AI and voice

Core gameplay and sound effects work without credentials. For generated dialogue, copy `.env.example` to `.env` and configure **your own** OpenRouter key and supported model IDs. Restart the server. Requests are billed to your account. Never commit or redistribute a filled `.env`.

Fish speech uses the installed Windows Microsoft David voice when available. Chef speech uses a local Mandarin voice or subtitles. For optional Yunxi speech, install Python and `edge-tts` (`python -m pip install edge-tts`), then set `YUNXI_TTS=1`.

## Develop

Run `npm ci`, `npm test`, and `npm run build`. `npm run watch` rebuilds on changes; keep the local server running and refresh the browser. Sources are in `src/`, compiled assets in `www/`.

## Privacy

This is a new cooking-only repository. It contains no simulated life chip, neural JSON brain, biographies, saved interviews, personal sessions, credentials, browser profiles, development logs, or original project history. Audio metadata was stripped. Source maps are disabled.

The server binds to localhost and reads optional credentials only from this folder's `.env`, ignoring inherited API keys. With optional AI disabled, gameplay makes no external service requests. When enabled, current game observations and dialogue go to OpenRouter and the selected model provider. Optional Yunxi speech sends generated text to Edge TTS. There are no remote fonts or analytics.

The game can store a new station state in the current browser tab and maintain short dialogue context during play. That runtime state is not a preloaded life history. Third-party notices are in `licenses/`.
