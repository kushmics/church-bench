# Church Bench implementation notes

## What changed

The repo was cleaned from a Python package scaffold into a demo-ready Chrome extension:

- Removed the unused `pyproject.toml` and `src/church_bench` Python scaffold.
- Moved extension files to the repo root so Chrome can load the folder directly.
- Removed missing placeholder asset dependencies and replaced them with the actual grandma popup video asset.
- Reworked detection to use safe demo triggers instead of shipping a real NSFW blacklist.
- Reworked the LinkedIn consequence as a draft/share redirect, not an auto-post.
- Added guardrails so the extension does not inject into Chrome internal pages or LinkedIn.
- Added a poster image fallback so the grandma is still visible if Chrome blocks or delays video playback.

## Architecture

- `manifest.json`: Manifest V3 declaration with `tabs`, `scripting`, host permissions, and web-accessible grandma video assets.
- `background.js`: watches completed tab updates, checks safe demo triggers, injects `styles.css` and `content.js` once per matching tab.
- `content.js`: builds the grandma popup overlay, runs the timer, validates apology word count, and opens a LinkedIn draft on timeout.
- `styles.css`: high-contrast full-screen interface for projector-friendly demos, including the grandma video frame.
- `assets/grandmapopup.mp4`: H.264 MP4 grandma popup video.
- `assets/grandmapopup-poster.jpg`: poster/fallback image used before playback starts or if autoplay fails.

## Demo trigger policy

Current triggers:

- `goose.com`
- `church-bench-demo`
- query string containing `churchbench=1`

This keeps the demo controllable and avoids accidentally targeting real user browsing.

## Verification

Run:

```bash
node --check background.js
node --check content.js
python3 -m json.tool manifest.json >/dev/null
```

Then load the repo folder via `chrome://extensions` and visit:

```text
https://example.com/?churchbench=1
```
