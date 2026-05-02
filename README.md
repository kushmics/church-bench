# Church Bench

**LinkedIn-powered shameware for bad browsing decisions.**

Church Bench is a silly hackathon Chrome extension that turns a blocked demo page into a full-screen public repentance ritual: a screaming grandma popup video, a 90-second apology timer, escalating word-count requirements, and a LinkedIn guilt-post draft if the user refuses to repent.

It does **not** post automatically. It only opens LinkedIn with a prefilled draft/share URL, so the demo stays funny instead of becoming malware.

## Final demo flow

1. Load the extension in Chrome.
2. Visit one of the safe demo trigger pages:
   - `https://goose.com`
   - `https://fuq.com`
   - `https://banana.com`
   - `https://cornhub.website`
   - `https://cornhub.com`
   - local test page: open `goose-test.html` from the repo root
3. Church Bench replaces the page with a full-screen grandma accountability overlay.
4. Grandma appears in a portrait video frame. The video autoplays muted where Chrome allows it; the separate grandma audio starts immediately if allowed, or on the first user gesture.
5. The user has 90 seconds to type the required apology.
6. The first incident for a hostname requires 50 words. Repeat incidents on the same hostname add 25 words each, capped at 200 words.
7. Paste is blocked and penalized by 5 seconds. Consecutive duplicate words are removed and also penalized by 5 seconds.
8. If the user reaches the required word count, grandma is muted/stopped and the green forgiveness screen appears.
9. If the timer reaches zero, Chrome redirects to LinkedIn with a funny guilt-post draft tailored to the category of site visited.

## Install for demo

1. Open `chrome://extensions`.
2. Enable **Developer mode**.
3. Click **Load unpacked**.
4. Select this repo folder: `church-bench/`.
5. Reload the extension after any changes to `manifest.json` or files under `assets/`.
6. Open `goose-test.html` from the repo root, or visit one of the hosted demo trigger URLs above.

## Files

```text
church-bench/
├── manifest.json      # Chrome MV3 config, permissions, content-script matches, web-accessible media assets
├── background.js      # Safe trigger detection + CSS/JS injection fallback for completed tab updates
├── content.js         # Overlay DOM, grandma media playback, timer, escalating apology logic, validation, LinkedIn draft redirect
├── styles.css         # Full-screen panic UI and calming forgiveness screen
├── assets/
│   ├── grandmapopup.mp4        # Portrait grandma popup video
│   ├── grandmapopup-audio.m4a  # Separate boosted audio for Chrome autoplay fallback
│   └── grandmapopup-poster.jpg # Poster/fallback image
├── goose-test.html    # Local trigger page for repeatable demos
├── IMPLEMENTATION.md  # Technical notes, architecture, verification checklist
└── README.md
```

## Safety defaults

- Demo triggers only. No real browsing blacklist is shipped.
- No credentials, cookies, or page content are collected.
- No browsing history is uploaded or transmitted.
- The only persisted state is a local per-hostname incident counter stored under `churchBenchNaughtyAccessCounts` in `chrome.storage.local`.
- No automatic LinkedIn posting occurs; Church Bench only opens a draft/share URL.
- The extension skips LinkedIn itself to avoid redirect loops.
- Chrome internal pages are not injectable by extension content scripts.

## Verification

Run from the repo root:

```bash
node --check background.js
node --check content.js
python3 -m json.tool manifest.json >/dev/null
git diff --check
```

Then reload the unpacked extension and manually test `goose-test.html` from the repo root.

Confirm that the timer, word count, paste penalty, duplicate-word penalty, forgiveness screen, grandma media, and LinkedIn timeout redirect all still work.
