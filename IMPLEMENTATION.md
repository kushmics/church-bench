# Church Bench implementation notes

## What changed

The repo was cleaned from a Python package scaffold into a demo-ready Chrome extension:

- Removed the unused `pyproject.toml` and `src/church_bench` Python scaffold.
- Moved extension files to the repo root so Chrome can load the folder directly.
- Removed missing placeholder asset dependencies and replaced them with the actual grandma popup video asset.
- Reworked detection to use safe demo triggers instead of shipping a real NSFW blacklist.
- Reworked the LinkedIn consequence as a website-specific guilt-post draft/share redirect, not an auto-post.
- Added guardrails so the extension does not inject into Chrome internal pages or LinkedIn.
- Added a poster image fallback so the grandma is still visible if Chrome blocks or delays video playback.

## Architecture

- `manifest.json`: Manifest V3 declaration with `tabs`, `scripting`, `storage`, host permissions, and web-accessible grandma video/audio assets.
- `background.js`: watches completed tab updates, checks safe demo triggers, injects `styles.css` and `content.js` once per matching tab.
- `content.js`: builds the grandma popup overlay, records per-site naughty-visit counts in local extension storage, escalates the apology length by repeat offense, runs the timer, validates apology word count, mutes grandma and shows the success screen on completion, classifies the visited website, and opens a dynamic LinkedIn guilt-post draft on timeout.
- `styles.css`: high-contrast full-screen interface for projector-friendly demos, including the grandma video frame.
- `assets/grandmapopup.mp4`: H.264 MP4 grandma popup video.
- `assets/grandmapopup-audio.m4a`: separate boosted grandma audio used because Chrome blocks guaranteed unmuted video autoplay.
- `assets/grandmapopup-poster.jpg`: poster/fallback image used before playback starts or if autoplay fails.

## Repeat-offense apology scaling

The first incident on a hostname requires 50 words. Each later incident on the same hostname adds 25 words, capped at 200 words:

```text
1st visit: 50 words
2nd visit: 75 words
3rd visit: 100 words
...
7th+ visit: 200 words
```

Counts are stored in `chrome.storage.local` under `churchBenchNaughtyAccessCounts`, so the penalty survives page refreshes and browser restarts without sending data anywhere.

## Demo trigger policy

Current triggers:

- `goose.com`
- `xvideo.com`
- `banana.com`
- `goose-test.html`

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
file:///Users/ethankok/Projects/church-bench/goose-test.html
```
