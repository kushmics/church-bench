# Church Bench

**LinkedIn-powered shameware for bad browsing decisions.**

Church Bench is a hackathon Chrome extension that turns a blocked page into a full-screen public repentance ritual: grandma popup video, timer, apology essay, and a LinkedIn share draft if the user refuses to repent.

It does **not** post automatically. It opens a LinkedIn draft/share URL so the demo stays funny instead of malware.

## Demo flow

1. Load the extension in Chrome.
2. Visit `https://goose.com`, `https://xvideo.com`, `https://banana.com`, or the local `goose-test.html` file.
3. The page is replaced by the Church Bench overlay with a grandma warning video.
4. Type the required apology before the 90-second timer ends. Grandma starts at 50 words, then adds 25 words for each repeat incident on the same naughty site, capped at 200 words.
5. If you succeed, Grandma is muted and a green “Apology accepted” celebration screen appears.
6. If you fail, Chrome opens LinkedIn with a silly guilt-post draft that changes based on the type of website visited.

## Install for demo

1. Open `chrome://extensions`.
2. Enable **Developer mode**.
3. Click **Load unpacked**.
4. Select this repo folder: `church-bench/`.
5. Visit `file:///Users/ethankok/Projects/church-bench/goose-test.html`.

## Files

```text
church-bench/
├── manifest.json      # Chrome MV3 config
├── background.js      # URL detection + script/CSS injection
├── content.js         # Grandma popup overlay, escalating essay, timer, dynamic LinkedIn guilt-post redirect
├── styles.css         # Full-screen panic UI
├── assets/
│   ├── grandmapopup.mp4
│   ├── grandmapopup-audio.m4a
│   └── grandmapopup-poster.jpg
├── IMPLEMENTATION.md  # Build notes and demo constraints
└── README.md
```

## Safety defaults

- Demo triggers only. No real adult-site blacklist is shipped.
- No credentials, cookies, or browsing history are collected. The extension stores only per-site naughty-visit counts locally so repeat offenses require longer apologies.
- No automatic LinkedIn posting; only a website-specific guilt-post draft URL is opened.
- Overlay is skipped on Chrome internal pages and LinkedIn itself.

## Hackathon pitch

Most blockers are boring. Church Bench weaponizes social accountability: it does not just block the page, it makes a grandma pop up and force the user to bargain with their future professional self.
