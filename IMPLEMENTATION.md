# Church Bench implementation notes

## Final submission scope

Church Bench is a demo-ready Chrome Manifest V3 extension. The repo root is the extension root; load this folder directly in `chrome://extensions` with Developer Mode enabled.

The final product is intentionally absurd shameware for hackathon demos:

- A full-screen grandma accountability overlay replaces safe demo trigger pages.
- A 90-second timer forces the user to type an apology essay.
- Repeat visits to the same hostname increase the required apology length.
- Paste and consecutive duplicate words are penalized.
- Completing the apology stops grandma and shows a forgiveness screen.
- Failing the timer opens LinkedIn with a generated guilt-post draft.

The extension does **not** automatically post, collect credentials, read cookies, scrape page content, or transmit browsing data.

## Project cleanup

The repo was cleaned from an earlier Python package scaffold into a direct Chrome extension:

- Removed the unused Python scaffold.
- Moved extension files to the repo root so Chrome can load the folder directly.
- Removed unused missing asset references.
- Added the actual grandma popup video, poster, and separate audio asset.
- Reworked triggers to use safe demo sites instead of a real NSFW blacklist.
- Reworked the LinkedIn consequence into a draft/share redirect, not an auto-post.
- Added guardrails so LinkedIn is skipped and Chrome internal pages are not targeted.

## Architecture

- `manifest.json`
  - Manifest V3 declaration.
  - Permissions: `tabs`, `scripting`, `storage`.
  - Host permission: `<all_urls>` so the demo can inject on the configured trigger pages.
  - Content-script matches for demo domains and the local `goose-test.html` page.
  - Declares grandma video, audio, and poster as web-accessible resources.

- `background.js`
  - Watches completed tab updates.
  - Checks safe demo trigger strings.
  - Injects `styles.css` and `content.js` once per matching tab.
  - Clears tab injection state when a tab navigates away or closes.

- `content.js`
  - Prevents duplicate activation with `window.__churchBenchActive`.
  - Clears the page and renders the Church Bench overlay.
  - Loads packaged media with `chrome.runtime.getURL(...)`.
  - Autoplays the visible grandma video muted for Chrome compatibility.
  - Starts separate boosted grandma audio immediately if Chrome allows it, then retries on user gestures if autoplay is blocked.
  - Records per-hostname incident counts in `chrome.storage.local` with a `localStorage` fallback for non-extension testing.
  - Computes escalating apology word requirements.
  - Runs the 90-second countdown.
  - Blocks paste and penalizes the timer.
  - Removes consecutive duplicate words and penalizes the timer.
  - Stops/mutes grandma media before rendering the success screen.
  - Builds a category-aware LinkedIn guilt-post draft on timeout.

- `styles.css`
  - Full-screen high-contrast panic UI for the active overlay.
  - Responsive portrait video layout using `object-fit: contain` so grandma is not cropped.
  - Danger-state styling when the timer reaches the final 15 seconds.
  - Calmer green forgiveness screen after apology completion.

- `assets/`
  - `grandmapopup.mp4`: portrait grandma video used in the visible overlay.
  - `grandmapopup-audio.m4a`: separate boosted audio used because Chrome does not guarantee autoplay with sound.
  - `grandmapopup-poster.jpg`: poster/fallback frame for the video.

- `goose-test.html`
  - Local file trigger for reliable demo testing without depending on external websites.

## Demo triggers

Configured content-script trigger patterns in `manifest.json`:

```text
*://*.goose.com/*
*://*.fuq.com/*
*://*.banana.com/*
*://*.cornhub.website/*
*://*.cornhub.com/*
file:///*goose-test.html*
```

`background.js` also checks safe trigger strings for completed tab updates. The trigger list is intentionally small and fake/demo-oriented.

## Repeat-offense apology scaling

The required apology length is calculated from the incident count for the current hostname:

```text
1st visit: 50 words
2nd visit: 75 words
3rd visit: 100 words
4th visit: 125 words
5th visit: 150 words
6th visit: 175 words
7th+ visit: 200 words
```

Constants in `content.js`:

```js
BASE_REQUIRED_WORDS = 50
WORDS_PER_REPEAT_OFFENSE = 25
MAX_REQUIRED_WORDS = 200
TOTAL_SECONDS = 90
DUPLICATE_WORD_PENALTY_SECONDS = 5
ACCESS_COUNTS_KEY = "churchBenchNaughtyAccessCounts"
```

Counts are stored locally only. No full URLs, credentials, cookies, or page content are stored.

## LinkedIn consequence

On timeout, the extension builds a LinkedIn post draft based on the current hostname category:

- video/streaming sites
- social media sites
- shopping sites
- gaming sites
- adult-themed hostnames
- generic naughty non-roadmap tabs

The redirect target is:

```text
https://www.linkedin.com/feed/?shareActive=true&text=<encoded draft>
```

This opens a draft/share UI. It does not submit or publish the post.

## Media behavior

Chrome usually blocks autoplay with sound. Church Bench uses a split-media approach:

1. The visible `<video>` is muted so it can autoplay reliably.
2. A separate `Audio` object plays `assets/grandmapopup-audio.m4a`.
3. If audio autoplay fails, document-level gesture listeners retry on pointer, mouse, touch, keyboard, or textarea input.
4. A Web Audio `GainNode` boosts the separate audio when available.
5. On forgiveness, video and audio are stopped/muted and the audio context is closed.

## Manual demo checklist

After loading or reloading the unpacked extension:

1. Open `file:///Users/ethankok/Projects/church-bench/goose-test.html`.
2. Confirm the page is replaced by the Church Bench overlay.
3. Confirm grandma video is visible and not cropped.
4. Confirm the timer starts at `01:30` and counts down.
5. Confirm typing updates the word count.
6. Confirm paste is blocked and subtracts 5 seconds.
7. Confirm consecutive duplicate words are removed and subtract 5 seconds.
8. Type enough words to trigger the forgiveness screen.
9. Refresh/revisit the same trigger page and confirm the required word count increases.
10. Let the timer expire on a test run and confirm LinkedIn opens with a draft URL.
11. Confirm Escape does not close the overlay.

## Verification commands

Run from the repo root:

```bash
node --check background.js
node --check content.js
python3 -m json.tool manifest.json >/dev/null
git diff --check
```

Optional media inspection:

```bash
for file in assets/grandmapopup.mp4 assets/grandmapopup-audio.m4a; do
  echo "== $file =="
  ffprobe -v error -show_entries stream=index,codec_type,codec_name,width,height,channels -of compact "$file"
done
```

## Backup branch

A more polished alternate UI was saved locally on:

```text
backup/premium-cancer-ui-20260502-150918
```

The final `main` submission intentionally keeps the louder/crazier version.
