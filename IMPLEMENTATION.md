# Church Bench implementation notes

## What changed

The repo was cleaned from a Python package scaffold into a demo-ready Chrome extension:

- Removed the unused `pyproject.toml` and `src/church_bench` Python scaffold.
- Moved extension files to the repo root so Chrome can load the folder directly.
- Removed missing asset dependencies (`assets/icon.png`, `assets/auntie.gif`, `assets/scold.mp3`).
- Reworked detection to use safe demo triggers instead of shipping a real NSFW blacklist.
- Reworked the LinkedIn consequence as a draft/share redirect, not an auto-post.
- Added guardrails so the extension does not inject into Chrome internal pages or LinkedIn.
- Made the UI self-contained with HTML/CSS only.

## Architecture

- `manifest.json`: Manifest V3 declaration with `tabs`, `scripting`, and host permissions.
- `background.js`: watches completed tab updates, checks safe demo triggers, injects `styles.css` and `content.js` once per matching tab.
- `content.js`: builds the overlay, runs the timer, validates apology word count, and opens a LinkedIn draft on timeout.
- `styles.css`: high-contrast full-screen interface for projector-friendly demos.

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
